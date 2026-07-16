import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HistorySidebar } from './components/HistorySidebar';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { ErrorFallback } from './components/ErrorFallback';
import type { StudySession, Flashcard, ChecklistItem } from './types';

const API_BASE_URL = '/api';

export default function App() {
  // Persistence state
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('aurastudy_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return localStorage.getItem('aurastudy_current_id') || null;
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true);
  const [lastPrompt, setLastPrompt] = useState("");

  // Ref to cancel active requests (prevents race conditions)
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem('aurastudy_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Sync active session ID to localStorage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('aurastudy_current_id', currentSessionId);
    } else {
      localStorage.removeItem('aurastudy_current_id');
    }
  }, [currentSessionId]);

  // Query server configuration status on mount
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/status`);
        if (res.ok) {
          const data = await res.json();
          setIsMockMode(data.isMockMode);
        }
      } catch (err) {
        console.warn("Could not connect to study server status. Defaulting to local Mock Mode.", err);
        setIsMockMode(true);
      }
    };
    checkServerStatus();
  }, []);

  // Find active study session
  const currentSession = sessions.find((s) => s.id === currentSessionId) || null;

  // Handle study kit generation
  const handleGenerate = async (prompt: string) => {
    setError(null);
    setIsLoading(true);
    setLastPrompt(prompt);

    // Cancel any ongoing generation requests to prevent stale responses overwriting newer requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        topic: data.topic,
        summary: data.summary,
        flashcards: data.flashcards,
        quiz: data.quiz,
        checklist: data.checklist,
        createdAt: new Date().toISOString()
      };

      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Generation request aborted.");
        return; // Ignore abort exceptions
      }
      console.error("Failed to generate study kit:", err);
      setError(err.message || "An unexpected error occurred while communicating with the AI server.");
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false);
      }
    }
  };

  // Handle refinement feedback
  const handleRefine = async (feedback: string) => {
    if (!currentSession) return;
    
    setError(null);
    setIsRefining(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentSession.topic,
          existingData: currentSession,
          refinementFeedback: feedback
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Refinement failed with status ${response.status}`);
      }

      const data = await response.json();

      // Smart Merge logic:
      // If a card or task returned matches one the user has already studied, preserve their progress status
      const mergedFlashcards = data.flashcards.map((newCard: Flashcard) => {
        const match = currentSession.flashcards.find(
          (oldCard) => oldCard.question.toLowerCase().trim() === newCard.question.toLowerCase().trim()
        );
        return match ? { ...newCard, id: match.id, status: match.status } : newCard;
      });

      const mergedChecklist = data.checklist.map((newItem: ChecklistItem) => {
        const match = currentSession.checklist.find(
          (oldItem) => oldItem.item.toLowerCase().trim() === newItem.item.toLowerCase().trim()
        );
        return match ? { ...newItem, id: match.id, completed: match.completed } : newItem;
      });

      const refinedSession: StudySession = {
        ...currentSession,
        topic: data.topic || currentSession.topic,
        summary: data.summary || currentSession.summary,
        flashcards: mergedFlashcards,
        quiz: data.quiz || currentSession.quiz,
        checklist: mergedChecklist,
        createdAt: new Date().toISOString()
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? refinedSession : s))
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Refinement request aborted.");
        return;
      }
      console.error("Failed to refine study kit:", err);
      setError(err.message || "Could not apply modifications to the study guide.");
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsRefining(false);
      }
    }
  };

  // Update card mastery status
  const handleUpdateFlashcardStatus = (cardId: string, status: 'new' | 'review' | 'mastered') => {
    if (!currentSession) return;
    
    const updatedCards = currentSession.flashcards.map((fc) =>
      fc.id === cardId ? { ...fc, status } : fc
    );

    const updatedSession = { ...currentSession, flashcards: updatedCards };
    setSessions((prev) => prev.map((s) => (s.id === currentSession.id ? updatedSession : s)));
  };

  // Toggle checklist milestones
  const handleUpdateChecklistItem = (itemId: string, completed: boolean) => {
    if (!currentSession) return;

    const updatedChecklist = currentSession.checklist.map((item) =>
      item.id === itemId ? { ...item, completed } : item
    );

    const updatedSession = { ...currentSession, checklist: updatedChecklist };
    setSessions((prev) => prev.map((s) => (s.id === currentSession.id ? updatedSession : s)));
  };

  // Delete single session from history
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Clear all sessions
  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete all saved study sessions?")) {
      setSessions([]);
      setCurrentSessionId(null);
      setError(null);
    }
  };

  // Retry generating study guide
  const handleRetry = () => {
    if (lastPrompt) {
      handleGenerate(lastPrompt);
    }
  };

  // Reset workspace back to editor input
  const handleResetWorkspace = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentSessionId(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <Header 
        onToggleHistory={() => setHistoryOpen(!historyOpen)} 
        historyCount={sessions.length}
      />

      <HistorySidebar
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllHistory}
      />

      <main className="main-content">
        {error ? (
          <ErrorFallback 
            message={error} 
            onRetry={handleRetry} 
            onReset={handleResetWorkspace} 
          />
        ) : currentSession ? (
          <Dashboard
            session={currentSession}
            onUpdateFlashcardStatus={handleUpdateFlashcardStatus}
            onUpdateChecklistItem={handleUpdateChecklistItem}
            onRefine={handleRefine}
            isRefining={isRefining}
            onReset={handleResetWorkspace}
          />
        ) : (
          <InputForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
            isMockMode={isMockMode}
          />
        )}
      </main>
    </div>
  );
}
