import React, { useState } from 'react';
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

  const totalCards = session.flashcards.length;
  const masteredCards = session.flashcards.filter(f => f.status === 'mastered').length;
  const cardPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const totalChecklist = session.checklist.length;
  const completedChecklist = session.checklist.filter(c => c.completed).length;
  const checkPct = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  const overallMastery = Math.round((cardPct + checkPct) / 2);
  // SVG ring: radius 50, circumference ≈ 314.2
  const strokeDashoffset = 314.2 - (314.2 * overallMastery) / 100;

  const getTopicTag = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('photo') || t.includes('plant') || t.includes('bio') || t.includes('cell')) return 'BIOLOGY';
    if (t.includes('react') || t.includes('hook') || t.includes('web') || t.includes('js')) return 'WEB DEV';
    if (t.includes('rust') || t.includes('memory') || t.includes('compiler')) return 'SYSTEMS';
    if (t.includes('tensor') || t.includes('neural') || t.includes('ml') || t.includes('ai')) return 'ML / AI';
    return 'ACADEMIC';
  };

  const getMnemonic = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('photo') || t.includes('plant')) return '"OIL RIG — Oxidation is Loss, Reduction is Gain"';
    if (t.includes('react') || t.includes('hook')) return '"Only call Hooks at the top level, only from React functions."';
    return '"Space your reviews: 1d → 3d → 7d → 14d for optimal retention."';
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementFeedback.trim() && !isRefining) {
      onRefine(refinementFeedback.trim());
      setRefinementFeedback("");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto animate-fade-in">

      {/* Back button */}
      <button
        onClick={onReset}
        className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all font-label-md text-[11px] uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        New Topic
      </button>

      {/* ── Hero Card ── */}
      <section className="glass-card prism-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
        {/* Accent glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/8 blur-[60px] pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-secondary/5 blur-[60px] pointer-events-none"></div>

        <div className="flex-1 space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-label-sm text-[10px] uppercase tracking-widest">{getTopicTag(session.topic)}</span>
            <span className="flex items-center gap-1 text-secondary font-label-sm text-[10px]">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: '"FILL" 1' }}>local_fire_department</span>
              12 Day Streak
            </span>
          </div>
          <h1 className="font-headline-lg text-xl md:text-3xl text-primary tracking-tight font-bold leading-tight">{session.topic}</h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">{session.summary}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setActiveTab('flashcards')}
              className="gradient-button-glow bg-gradient-to-r from-primary-container to-white text-on-primary-fixed font-label-md text-xs px-5 py-2 rounded-lg flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span> Resume Learning
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="glass-nested px-5 py-2 rounded-lg text-xs text-primary font-label-md hover:bg-white/10 transition-all"
            >
              Practice Quiz
            </button>
          </div>
        </div>

        {/* Mastery Ring + Stats */}
        <div className="flex flex-row md:flex-col items-center gap-6 md:gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0 relative z-10">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeWidth="5" />
              <circle className="text-primary progress-glow" cx="56" cy="56" r="50" fill="transparent" stroke="currentColor" strokeDasharray="314.2" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="7" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-bold text-primary">{overallMastery}%</span>
              <span className="font-label-sm text-[8px] text-on-surface-variant uppercase tracking-widest">Mastery</span>
            </div>
          </div>
          <div className="glass-nested rounded-lg p-2.5 flex gap-4 justify-around min-w-[160px]">
            <div className="text-center">
              <div className="font-label-sm text-[8px] text-on-surface-variant uppercase tracking-wider">Cards</div>
              <div className="text-xs font-bold text-primary">{masteredCards}/{totalCards}</div>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center">
              <div className="font-label-sm text-[8px] text-on-surface-variant uppercase tracking-wider">Tasks</div>
              <div className="text-xs font-bold text-secondary">{completedChecklist}/{totalChecklist}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['overview', 'flashcards', 'quiz', 'checklist'] as TabType[]).map((tab) => {
          const labels: Record<TabType, string> = {
            overview: 'Overview',
            flashcards: `Flashcards (${masteredCards}/${totalCards})`,
            quiz: `Quiz (${session.quiz.length} Qs)`,
            checklist: `Checklist (${completedChecklist}/${totalChecklist})`
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`glass-card px-4 py-2 rounded-lg font-label-md text-[11px] whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-white/10 border-primary/50 text-primary prism-border'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </nav>

      {/* ── Tab Content ── */}
      <div className="w-full">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* Key Concepts */}
              <div className="md:col-span-8 glass-card prism-border rounded-xl p-5 hover:bg-white/[0.04] transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm md:text-base font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span> Key Concepts & Tasks
                  </h3>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <div className="space-y-2.5">
                  {session.checklist.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="glass-nested p-3 rounded-lg flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[14px]">
                          {idx === 0 ? 'light_mode' : idx === 1 ? 'cycle' : 'psychology'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary leading-snug">{item.item}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {item.completed ? '✓ Completed' : '⏳ Pending review'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mnemonics */}
              <div className="md:col-span-4 glass-card prism-border rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm md:text-base font-bold text-secondary mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">psychology</span> Mnemonics
                  </h3>
                  <div className="p-3 bg-secondary/5 rounded-lg italic text-xs text-on-surface-variant leading-relaxed border border-secondary/10">
                    {getMnemonic(session.topic)}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-label-sm text-[9px] text-on-surface-variant uppercase tracking-wider mb-0.5">Next recall:</p>
                  <p className="text-xs font-bold text-primary">In 2 hours (Spaced Repetition)</p>
                </div>
              </div>

              {/* Glossary */}
              <div className="md:col-span-12 glass-card prism-border rounded-xl p-5">
                <h3 className="text-sm md:text-base font-bold text-primary mb-4">Glossary Keywords</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {session.flashcards.slice(0, 6).map((fc) => (
                    <div key={fc.id} className="flex justify-between items-start py-1.5 border-b border-white/5 gap-4 text-xs">
                      <span className="font-bold text-primary shrink-0 max-w-[40%] truncate">{fc.question}</span>
                      <span className="text-on-surface-variant text-right max-w-[60%] truncate leading-normal">{fc.answer}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="mt-4 font-label-sm text-[10px] text-primary uppercase tracking-wider flex items-center gap-1 hover:tracking-[0.15em] transition-all"
                >
                  View all {session.flashcards.length} terms →
                </button>
              </div>
            </div>

            {/* Refinement Loop */}
            <div className="glass-card prism-border rounded-xl p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
                <h3 className="text-sm md:text-base font-bold text-primary">Refine Study Guide</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Type instructions to tailor this study set (e.g. "translate to French", "add harder questions", "focus on equations").
              </p>
              <form onSubmit={handleRefineSubmit} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                  placeholder="e.g. Make quiz questions harder..."
                  disabled={isRefining}
                  maxLength={300}
                  required
                  className="flex-1 bg-surface-container-lowest/40 border border-white/10 rounded-lg px-4 py-2 text-xs text-on-surface placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={isRefining || !refinementFeedback.trim()}
                  className="gradient-button-glow bg-gradient-to-r from-primary-container to-white text-on-primary-fixed font-label-md text-xs px-5 py-2 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-40 min-w-[140px] active:scale-95 transition-all"
                >
                  {isRefining ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                      Remodeling...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Refine
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="animate-fade-in w-full">
            <Flashcards cards={session.flashcards} onUpdateStatus={onUpdateFlashcardStatus} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-fade-in w-full">
            <Quiz questions={session.quiz} />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="animate-fade-in w-full">
            <Checklist items={session.checklist} onToggleItem={onUpdateChecklistItem} />
          </div>
        )}
      </div>
    </div>
  );
};
