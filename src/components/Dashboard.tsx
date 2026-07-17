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

  // Calculate statistics
  const totalCards = session.flashcards.length;
  const masteredCards = session.flashcards.filter(f => f.status === 'mastered').length;
  const cardProgressPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const totalChecklistItems = session.checklist.length;
  const completedChecklistItems = session.checklist.filter(c => c.completed).length;
  const checklistProgressPercent = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  const overallMastery = Math.round((cardProgressPercent + checklistProgressPercent) / 2);

  // SVG dasharray formulas for mastery ring (radius 50, circumference = 2 * PI * 50 = 314.16)
  const strokeDashoffset = 314.2 - (314.2 * overallMastery) / 100;

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refinementFeedback.trim() && !isRefining) {
      onRefine(refinementFeedback.trim());
      setRefinementFeedback("");
    }
  };

  // Determine Tag based on topic name
  const getTopicTag = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('photo') || t.includes('plant') || t.includes('bio') || t.includes('cell')) return 'BIOLOGY';
    if (t.includes('react') || t.includes('hook') || t.includes('web') || t.includes('js') || t.includes('html') || t.includes('css')) return 'WEB DEV';
    if (t.includes('math') || t.includes('algeb') || t.includes('calc')) return 'MATHEMATICS';
    return 'ACADEMIC';
  };

  // Get topic custom mnemonic helper
  const getMnemonic = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('photo') || t.includes('plant')) {
      return '"OIL RIG of Electrons: Oxidation is Loss, Reduction is Gain"';
    }
    if (t.includes('react') || t.includes('hook')) {
      return '"Rules of Hooks: Only call them at the top level and only from React Functions."';
    }
    return `"Recall practice is key: space out your studies over intervals of 24h, 3d, and 7d."`;
  };

  // Get interactive image search link/diagram
  const getDiagramImage = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('photo') || t.includes('plant')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDx_cPWH1lfbUES0_HLPDfkKBuHhke6x22IvWVwIDTwvGNfrJLg-sN5V8U2-ZobQGFJlnWvvYMbpOQK5rMfGCmJWVFltXAkOwK923w0wFn6l1DCPdcukr4XIiHfkugIxrE05vGRT1KCxqcMAzApRrLR0oLTOMRaV-GHHg0MbzjJDdJXc8VF8Qinkowayyvkyay_rWpciu4FrjfZ9LU-UM3N2xaWsE-u4D3aOHEssRaIF-fltWRMEFBsdg";
    }
    // General study space picture
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDTNq8SjC3N-sC4o1oK6iFpGqm4mK75Pj4iLpW4HlW09z-N9s4H2l1L5O9s4H2l1L5O9s4H2l1L5O9s4H2l1L5";
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      
      {/* Back button link */}
      <button 
        onClick={onReset} 
        className="flex items-center gap-xs text-on-surface-variant hover:text-on-surface transition-all font-label-md text-xs"
        title="Study another topic"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>New Topic</span>
      </button>

      {/* Hero Card */}
      <section className="glass-base rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-lg items-center relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-xs">
            <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-label-mono uppercase tracking-wider">{getTopicTag(session.topic)}</span>
            <span className="flex items-center gap-xs text-tertiary text-[10px] font-label-mono">
              <span className="material-symbols-outlined text-[14px] fill-[1]">local_fire_department</span>
              12 Day Streak
            </span>
          </div>
          <h1 className="text-xl md:text-3xl font-headline-lg text-primary tracking-tight font-bold leading-tight">{session.topic}</h1>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed">
            {session.summary}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => setActiveTab('flashcards')}
              className="primary-btn px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">play_circle</span> Resume Learning
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className="glass-nested px-4 py-2 rounded-lg text-xs text-primary font-bold hover:bg-white/10 transition-all"
            >
              Practice Quiz
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex flex-row md:flex-col items-center gap-6 justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0">
          {/* Mastery Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="64" cy="64" r="50" fill="transparent" stroke="currentColor" strokeWidth="6"></circle>
              <circle className="text-primary progress-glow" cx="64" cy="64" r="50" fill="transparent" stroke="currentColor" strokeDasharray="314.2" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">{overallMastery}%</span>
              <span className="text-[9px] font-label-mono text-on-surface-variant uppercase tracking-wider">Mastery</span>
            </div>
          </div>
          <div className="glass-nested rounded-xl p-3 flex gap-4 w-full justify-around max-w-[200px]">
            <div className="text-center">
              <div className="text-[10px] font-label-mono text-on-surface-variant uppercase">Mastery</div>
              <div className="text-sm font-bold text-primary">{masteredCards}/{totalCards}</div>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] font-label-mono text-on-surface-variant uppercase">Tasks</div>
              <div className="text-sm font-bold text-tertiary">{completedChecklistItems}/{totalChecklistItems}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`glass-base px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-primary'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('flashcards')}
          className={`glass-base px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'flashcards' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-primary'}`}
        >
          Flashcards ({masteredCards}/{totalCards})
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`glass-base px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'quiz' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-primary'}`}
        >
          Quiz ({session.quiz.length} Qs)
        </button>
        <button 
          onClick={() => setActiveTab('checklist')}
          className={`glass-base px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'checklist' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-primary'}`}
        >
          Checklist ({completedChecklistItems}/{totalChecklistItems})
        </button>
      </nav>

      {/* Main Study Desk Area */}
      <div className="w-full">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              
              {/* Key Concepts Review */}
              <div className="md:col-span-8 glass-base rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base md:text-lg font-bold text-primary flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span> Key Concepts & Tasks
                  </h3>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <div className="space-y-3">
                  {session.checklist.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="glass-nested p-3 rounded-xl flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[16px]">
                          {idx === 0 ? 'light_mode' : idx === 1 ? 'cycle' : 'psychology'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-bold text-primary leading-tight">{item.item}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">
                          {item.completed ? '🟢 Completed task' : '⏳ Pending milestone review'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory Tricks (Mnemonic) */}
              <div className="md:col-span-4 glass-base rounded-2xl p-6 flex flex-col justify-between border-tertiary/20">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-tertiary mb-3 flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[20px]">psychology</span> Mnemonics
                  </h3>
                  <div className="p-3 bg-tertiary/5 rounded-xl italic text-xs text-on-surface-variant leading-relaxed">
                    {getMnemonic(session.topic)}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-label-mono text-on-surface-variant uppercase tracking-wider mb-0.5">Next recall session:</p>
                  <p className="text-xs font-bold text-primary">In 2 hours (Spaced Repetition)</p>
                </div>
              </div>

              {/* Visual Diagram */}
              <div className="md:col-span-6 h-[260px] glass-base rounded-2xl overflow-hidden group relative">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Ultrastructure graphic"
                  src={getDiagramImage(session.topic)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-sm font-bold text-primary">Interactive Visuals</h3>
                  <p className="text-[11px] text-on-surface-variant">Explore structure diagrams and concepts</p>
                </div>
                <button className="absolute top-4 right-4 p-1.5 bg-white/10 backdrop-blur-md rounded-full text-primary hover:bg-white/20 transition-all">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </button>
              </div>

              {/* Glossary (Extracted from Flashcards) */}
              <div className="md:col-span-6 glass-base rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-primary mb-4">Glossary Keywords</h3>
                  <div className="space-y-3">
                    {session.flashcards.slice(0, 4).map((fc) => (
                      <div key={fc.id} className="flex justify-between items-start py-1 border-b border-white/5 gap-md text-xs">
                        <span className="font-bold text-primary shrink-0 max-w-[40%] truncate">{fc.question}</span>
                        <span className="text-on-surface-variant text-right max-w-[60%] truncate leading-normal">{fc.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('flashcards')}
                  className="mt-4 text-primary font-label-mono text-[10px] uppercase flex items-center gap-xs hover:tracking-wider transition-all"
                >
                  View all {session.flashcards.length} terms →
                </button>
              </div>

            </div>

            {/* Refinement Loop Form */}
            <div className="glass-base rounded-2xl p-6 border-primary/20 mt-4">
              <div className="flex items-center gap-xs mb-3">
                <span className="material-symbols-outlined text-primary text-[20px]">settings</span>
                <h3 className="text-base md:text-lg font-bold text-primary">Tailor Study Guide (Refinement Loop)</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Want to tweak this study set? Type instructions (e.g. "translate definitions to French", "add more detailed flashcards", "make quiz questions twice as hard") and the AI will remodel it.
              </p>
              
              <form onSubmit={handleRefineSubmit} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                  placeholder="e.g. Translate to Spanish or focus more on the chemical equations..."
                  disabled={isRefining}
                  maxLength={300}
                  required
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-primary placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isRefining || !refinementFeedback.trim()}
                  className="primary-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-xs disabled:opacity-50 min-w-[160px]"
                >
                  {isRefining ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                      <span>Remodeling...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      <span>Refine Pathway</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="animate-fade-in w-full">
            <Flashcards 
              cards={session.flashcards} 
              onUpdateStatus={onUpdateFlashcardStatus} 
            />
          </div>
        )}

        {/* TAB: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in w-full">
            <Quiz questions={session.quiz} />
          </div>
        )}

        {/* TAB: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="animate-fade-in w-full">
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
