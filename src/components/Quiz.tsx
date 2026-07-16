import React, { useState } from 'react';
import { Check, X, RefreshCw, Award, ArrowRight, AlertCircle } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  // We keep a local list of active questions. This lets us filter for "re-testing wrong answers".
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  
  // Track incorrect question IDs to support re-testing wrong answers
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<{ questionId: string; selectedIndex: number; isCorrect: boolean }[]>([]);

  const currentQuestion = activeQuestions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedOptionIndex(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestionIds((prev) => [...prev, currentQuestion.id]);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: optionIndex,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  // Re-test only incorrect answers
  const handleReTestWrong = () => {
    const wrongQuestions = questions.filter((q) => wrongQuestionIds.includes(q.id));
    setActiveQuestions(wrongQuestions);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestionIds([]);
    setIsFinished(false);
    setAnswersHistory([]);
  };

  // Reset the quiz to take the entire set again
  const handleFullReset = () => {
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScore(0);
    setWrongQuestionIds([]);
    setIsFinished(false);
    setAnswersHistory([]);
  };

  if (questions.length === 0) {
    return (
      <div className="card text-center glass padding-large">
        <p>No quiz questions available in this study session.</p>
      </div>
    );
  }

  // Quiz Results Summary Screen
  if (isFinished) {
    const totalQuestions = activeQuestions.length;
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    const hasWrong = wrongQuestionIds.length > 0;

    return (
      <div className="quiz-finished-card card glass text-center animate-scale-in">
        <div className="finished-badge-wrapper">
          <Award size={64} className="finished-icon text-accent" />
        </div>
        
        <h2>Quiz Completed!</h2>
        
        <div className="score-radial">
          <div className="score-percentage">{scorePercentage}%</div>
          <div className="score-fraction">{score} / {totalQuestions} Correct</div>
        </div>

        <p className="finished-message">
          {scorePercentage === 100 
            ? "Perfect! You've completely mastered these concepts!" 
            : scorePercentage >= 70 
              ? "Great job! You have a solid grasp, but there is room to polish." 
              : "Keep studying! Active recall and review will help solidify these."}
        </p>

        <div className="quiz-summary-results">
          <h3>Question Summary:</h3>
          <ul className="summary-list">
            {activeQuestions.map((q, idx) => {
              const hist = answersHistory.find(h => h.questionId === q.id);
              return (
                <li key={q.id} className={`summary-item ${hist?.isCorrect ? 'correct' : 'incorrect'}`}>
                  <span className="summary-status-icon">
                    {hist?.isCorrect ? <Check size={14} /> : <X size={14} />}
                  </span>
                  <span className="summary-q-text">Q{idx + 1}: {q.question}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="quiz-action-buttons">
          {hasWrong && (
            <button 
              onClick={handleReTestWrong} 
              className="btn btn-primary btn-large retest-btn"
            >
              <RefreshCw size={16} />
              <span>Re-test Wrong Answers ({wrongQuestionIds.length})</span>
            </button>
          )}

          <button 
            onClick={handleFullReset} 
            className={`btn btn-large ${hasWrong ? 'btn-secondary' : 'btn-primary'}`}
          >
            <RefreshCw size={16} />
            <span>Retake Full Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container animate-fade-in">
      {/* Quiz Progress Header */}
      <div className="quiz-progress-header">
        <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / activeQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-question-card card glass">
        <h3 className="quiz-question-text">{currentQuestion.question}</h3>

        <div className="quiz-options-list">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;
            
            let optionClass = "";
            if (isAnswered) {
              if (isCorrect) {
                optionClass = "option-correct";
              } else if (isSelected) {
                optionClass = "option-incorrect";
              } else {
                optionClass = "option-disabled";
              }
            } else {
              optionClass = "option-interactive";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`quiz-option ${optionClass}`}
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="option-text">{option}</span>
                <span className="option-status-icon-wrapper">
                  {isAnswered && isCorrect && <Check size={18} className="text-success" />}
                  {isAnswered && isSelected && !isCorrect && <X size={18} className="text-danger" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation Panel */}
        {isAnswered && (
          <div className="quiz-explanation-panel animate-slide-in">
            <div className="explanation-title">
              <AlertCircle size={16} />
              <span>Explanation</span>
            </div>
            <p className="explanation-text">{currentQuestion.explanation}</p>
            
            <button onClick={handleNext} className="btn btn-accent next-question-btn">
              <span>{currentQuestionIndex === activeQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
