import React from 'react';
import { Square, Trophy, CheckCircle2 } from 'lucide-react';
import type { ChecklistItem } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string, completed: boolean) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ items, onToggleItem }) => {
  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  if (items.length === 0) {
    return (
      <div className="card text-center glass padding-large">
        <p>No study tasks available in this session.</p>
      </div>
    );
  }

  return (
    <div className="checklist-container animate-fade-in">
      <div className="checklist-header-card card glass">
        <div className="checklist-progress-meta">
          <div className="progress-text-wrapper">
            <h3>Concept Checklist</h3>
            <p className="completed-ratio">
              {completedCount} of {totalCount} concepts completed
            </p>
          </div>
          <div className="progress-percentage-large">{progressPercent}%</div>
        </div>

        <div className="progress-bar-container large-bar-container">
          <div 
            className="progress-bar bar-accent" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {allCompleted && (
        <div className="trophy-banner animate-scale-in">
          <Trophy className="trophy-icon text-warning animate-bounce-slow" size={28} />
          <div>
            <h4>All Concepts Checked!</h4>
            <p>You have reviewed all targeted milestones for this topic.</p>
          </div>
        </div>
      )}

      <ul className="checklist-list">
        {items.map((item, idx) => (
          <li key={item.id} className="animate-slide-in">
            <button
              onClick={() => onToggleItem(item.id, !item.completed)}
              className={`checklist-item ${item.completed ? 'completed' : ''}`}
            >
              <span className="checklist-checkbox">
                {item.completed ? (
                  <CheckCircle2 size={22} className="text-accent checkbox-icon fill-accent-trans" />
                ) : (
                  <Square size={22} className="checkbox-icon text-muted" />
                )}
              </span>
              <div className="checklist-body">
                <span className="item-index-label">Concept #{idx + 1}</span>
                <p className="item-text">{item.item}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
