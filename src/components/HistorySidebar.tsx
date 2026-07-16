import React from 'react';
import { X, Trash2, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import type { StudySession } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: StudySession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onClearAll,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="sidebar-backdrop" onClick={onClose} />
      )}
      
      <div className={`history-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title-wrapper">
            <BookOpen size={20} className="text-primary" />
            <h2>Study History</h2>
          </div>
          <button onClick={onClose} className="btn-icon close-btn" aria-label="Close Sidebar">
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {sessions.length === 0 ? (
            <div className="sidebar-empty">
              <Calendar size={40} className="empty-icon" />
              <p>No saved study sessions yet.</p>
              <span className="hint-text">Your generated notes and quizzes will be saved here automatically.</span>
            </div>
          ) : (
            <>
              <div className="sidebar-list-header">
                <span>{sessions.length} sessions saved</span>
                <button onClick={onClearAll} className="btn-text-only text-danger">
                  Clear All
                </button>
              </div>
              <ul className="sidebar-list">
                {sessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  const masteredCount = session.flashcards.filter(f => f.status === 'mastered').length;
                  const cardProgress = Math.round((masteredCount / Math.max(session.flashcards.length, 1)) * 100);

                  return (
                    <li key={session.id} className="sidebar-item-wrapper animate-slide-in">
                      <button
                        onClick={() => {
                          onSelectSession(session.id);
                          onClose();
                        }}
                        className={`sidebar-item ${isActive ? 'active' : ''}`}
                      >
                        <div className="item-main">
                          <span className="item-topic">{session.topic}</span>
                          <span className="item-date">{formatDate(session.createdAt)}</span>
                          <div className="item-progress-bar-container">
                            <div 
                              className="item-progress-bar" 
                              style={{ width: `${cardProgress}%` }}
                            />
                          </div>
                          <span className="item-stats">
                            {masteredCount}/{session.flashcards.length} cards mastered
                          </span>
                        </div>
                        <ChevronRight size={16} className="item-arrow" />
                      </button>
                      <button
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="btn-icon item-delete-btn"
                        title="Delete Session"
                        aria-label={`Delete ${session.topic}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};
