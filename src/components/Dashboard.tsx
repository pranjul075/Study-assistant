import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  Settings, 
  ArrowLeft, 
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { StudySession } from '../types';
import { Flashcards } from './Flashcards';
import { Quiz } from './Quiz';
import { Checklist } from './Checklist';

interface DashboardProps {
  session: StudySession;
  onUpdateFlashcardStatus: (cardId: string, status: 'new' | 'review' | 'mastered') => void;
  onUpdateChecklistItem: (itemId: string, completed: boolean) => void;
  onRefine: (feedback: string) => void;
  isRefining: boolean;
  onReset: () => void;
}

type TabType = 'overview' | 'flashcards' | 'quiz' | 'checklist';

export const Dashboard: React.FC<DashboardProps> = ({
  session,
  onUpdateFlashcardStatus,
  onUpdateChecklistItem,
  onRefine,
  isRefining,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [refinementFeedback, setRefinementFeedback] = useState("");

  // Calculate statistics
  const totalCards = session.flashcards.length;
  const masteredCards = session.flashcards.filter(f => f.status === 'mastered').length;
  const cardProgressPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const totalChecklistItems = session.checklist.length;
  const completedChecklistItems = session.checklist.filter(c => c.completed).length;
  const checklistProgressPercent = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementFeedback.trim() && !isRefining) {
      onRefine(refinementFeedback.trim());
      setRefinementFeedback("");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Top bar */}
      <div className="dashboard-header animate-fade-in">
        <button onClick={onReset} className="btn-back-link" title="Study another topic">
          <ArrowLeft size={16} />
          <span>New Topic</span>
        </button>
        
        <h2 className="dashboard-topic-title">{session.topic}</h2>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs-wrapper animate-fade-in">
        <nav className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            <span>Flashcards</span>
            <span className="tab-badge">{masteredCards}/{totalCards}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          >
            <HelpCircle size={18} />
            <span>Quiz</span>
            <span className="tab-badge">{session.quiz.length} Qs</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
          >
            <CheckSquare size={18} />
            <span>Checklist</span>
            <span className="tab-badge">{completedChecklistItems}/{totalChecklistItems}</span>
          </button>
        </nav>
      </div>

      {/* Main Study Desk Area */}
      <div className="dashboard-content-area">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="tab-panel overview-panel animate-fade-in">
            {/* Quick Summary */}
            <div className="card glass overview-summary-card">
              <h3>Summary Overview</h3>
              <p className="summary-paragraph">{session.summary}</p>
            </div>

            {/* Performance Stats Cards */}
            <div className="overview-stats-grid">
              
              {/* Card Stats */}
              <div className="stat-card card glass">
                <div className="stat-icon-wrapper text-primary">
                  <BookOpen size={24} />
                </div>
                <div className="stat-details">
                  <h4>Flashcard Mastery</h4>
                  <p className="stat-metric">{masteredCards} / {totalCards}</p>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${cardProgressPercent}%` }}
                    />
                  </div>
                  <span className="stat-hint">{cardProgressPercent}% mastered</span>
                </div>
              </div>

              {/* Checklist Stats */}
              <div className="stat-card card glass">
                <div className="stat-icon-wrapper text-accent">
                  <CheckSquare size={24} />
                </div>
                <div className="stat-details">
                  <h4>Milestone Progress</h4>
                  <p className="stat-metric">{completedChecklistItems} / {totalChecklistItems}</p>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar bar-accent" 
                      style={{ width: `${checklistProgressPercent}%` }}
                    />
                  </div>
                  <span className="stat-hint">{checklistProgressPercent}% checked</span>
                </div>
              </div>

            </div>

            {/* Refinement Loop Form */}
            <div className="card glass refinement-card">
              <div className="refinement-header">
                <Settings size={20} className="text-muted" />
                <h3>Tailor Study Guide (Refinement Loop)</h3>
              </div>
              <p className="card-desc">
                Want to tweak this kit? Type instructions (e.g., "translate definitions to French", "add more cards on thylakoids", "make quiz questions twice as hard") and the AI will remodel it.
              </p>
              
              <form onSubmit={handleRefineSubmit} className="refinement-form">
                <div className="input-group">
                  <input
                    type="text"
                    value={refinementFeedback}
                    onChange={(e) => setRefinementFeedback(e.target.value)}
                    placeholder="e.g. Translate to Spanish or focus more on the chemical equations..."
                    disabled={isRefining}
                    maxLength={300}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isRefining || !refinementFeedback.trim()}
                  >
                    {isRefining ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Remodeling...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Refine Study Guide</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="tab-panel animate-fade-in">
            <Flashcards 
              cards={session.flashcards} 
              onUpdateStatus={onUpdateFlashcardStatus} 
            />
          </div>
        )}

        {/* TAB: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="tab-panel animate-fade-in">
            <Quiz questions={session.quiz} />
          </div>
        )}

        {/* TAB: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="tab-panel animate-fade-in">
            <Checklist 
              items={session.checklist} 
              onToggleItem={onUpdateChecklistItem} 
            />
          </div>
        )}

      </div>
    </div>
  );
};
