import React from 'react';
import { History, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="logo-icon-wrapper">
          <GraduationCap className="logo-icon animate-pulse-slow" size={28} />
        </div>
        <div>
          <h1>AuraStudy</h1>
          <span className="subtitle">AI-Powered Active Learning</span>
        </div>
      </div>

      <div className="header-actions">
        <button 
          onClick={onToggleHistory}
          className="btn btn-secondary history-toggle-btn"
          aria-label="Toggle History"
        >
          <History size={18} />
          <span className="btn-text">History</span>
          {historyCount > 0 && (
            <span className="badge badge-accent animate-scale-in">{historyCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};
