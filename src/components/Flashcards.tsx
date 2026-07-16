import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import type { Flashcard } from '../types';

interface FlashcardsProps {
  cards: Flashcard[];
  onUpdateStatus: (id: string, status: 'new' | 'review' | 'mastered') => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ cards, onUpdateStatus }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCard = cards[currentIndex];

  // Reset flip when switching cards
  const handleNavigate = (direction: 'next' | 'prev') => {
    setIsFlipped(false);
    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
      }
    }, 100); // Small delay to let flip reset look clean
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault(); // Prevent scrolling
          setIsFlipped((prev) => !prev);
          break;
        case 'ArrowRight':
          handleNavigate('next');
          break;
        case 'ArrowLeft':
          handleNavigate('prev');
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (currentCard) {
            onUpdateStatus(currentCard.id, 'mastered');
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentCard) {
            onUpdateStatus(currentCard.id, 'review');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards, onUpdateStatus, currentCard]);

  if (cards.length === 0) {
    return (
      <div className="card text-center glass padding-large">
        <p>No flashcards available in this study session.</p>
      </div>
    );
  }

  // Calculate deck progress percentages
  const masteredCount = cards.filter((c) => c.status === 'mastered').length;
  const reviewCount = cards.filter((c) => c.status === 'review').length;
  const newCount = cards.length - masteredCount - reviewCount;

  const masteredPct = (masteredCount / cards.length) * 100;
  const reviewPct = (reviewCount / cards.length) * 100;
  const newPct = (newCount / cards.length) * 100;

  return (
    <div className="flashcards-container" ref={containerRef}>
      {/* Mastery Progress Bar */}
      <div className="deck-progress">
        <div className="deck-progress-labels">
          <span className="label-new">New ({newCount})</span>
          <span className="label-review">Review ({reviewCount})</span>
          <span className="label-mastered">Mastered ({masteredCount})</span>
        </div>
        <div className="stacked-progress-bar">
          <div 
            className="bar-segment bar-mastered" 
            style={{ width: `${masteredPct}%` }} 
            title={`Mastered: ${masteredCount}`}
          />
          <div 
            className="bar-segment bar-review" 
            style={{ width: `${reviewPct}%` }} 
            title={`Needs Review: ${reviewCount}`}
          />
          <div 
            className="bar-segment bar-new" 
            style={{ width: `${newPct}%` }} 
            title={`New: ${newCount}`}
          />
        </div>
      </div>

      {/* 3D Flashcard Wrapper */}
      <div className="flashcard-scene" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-3d ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Card Front (Question) */}
          <div className={`card-side card-front status-${currentCard.status}`}>
            <div className="card-side-header">
              <span className="card-index">Card {currentIndex + 1} of {cards.length}</span>
              <span className={`badge status-badge badge-${currentCard.status}`}>
                {currentCard.status.toUpperCase()}
              </span>
            </div>
            <div className="card-side-body">
              <p className="card-text question-text">{currentCard.question}</p>
            </div>
            <div className="card-side-footer">
              <RotateCw size={14} className="flip-icon" />
              <span>Click to reveal answer</span>
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="card-side card-back">
            <div className="card-side-header">
              <span className="card-index">Card {currentIndex + 1} of {cards.length}</span>
              <span className={`badge status-badge badge-${currentCard.status}`}>
                {currentCard.status.toUpperCase()}
              </span>
            </div>
            <div className="card-side-body">
              <p className="card-text answer-text">{currentCard.answer}</p>
            </div>
            <div className="card-side-footer">
              <RotateCw size={14} className="flip-icon" />
              <span>Click to show question</span>
            </div>
          </div>

        </div>
      </div>

      {/* Controls & Shortcuts */}
      <div className="deck-controls">
        <div className="navigation-controls">
          <button 
            onClick={(e) => { e.stopPropagation(); handleNavigate('prev'); }} 
            className="btn btn-secondary btn-icon-round"
            title="Previous Card (Left Arrow)"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }} 
            className="btn btn-secondary flip-btn-main"
          >
            <RotateCw size={16} />
            <span>Flip Card</span>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); handleNavigate('next'); }} 
            className="btn btn-secondary btn-icon-round"
            title="Next Card (Right Arrow)"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Status Grading Buttons */}
        <div className="status-grader">
          <button
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(currentCard.id, 'review'); }}
            className={`btn btn-status btn-status-review ${currentCard.status === 'review' ? 'active' : ''}`}
          >
            <AlertCircle size={16} />
            <span>Need Review (↓)</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(currentCard.id, 'mastered'); }}
            className={`btn btn-status btn-status-mastered ${currentCard.status === 'mastered' ? 'active' : ''}`}
          >
            <CheckCircle size={16} />
            <span>Mastered (↑)</span>
          </button>
        </div>

        {/* Keyboard Helper */}
        <div className="keyboard-helper">
          <Keyboard size={14} />
          <span>Space to Flip | Arrows to navigate/grade</span>
        </div>
      </div>
    </div>
  );
};
