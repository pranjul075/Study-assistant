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

  // SVG dasharray formulas for mastery ring (radius 80, circumference = 2 * PI * 80 = 502.6)
  const strokeDashoffset = 502.6 - (502.6 * overallMastery) / 100;

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
    <div className="space-y-lg w-full max-w-7xl mx-auto">
      
      {/* Back button link */}
      <button 
        onClick={onReset} 
        className="flex items-center gap-xs text-on-surface-variant hover:text-on-surface transition-all font-label-md"
        title="Study another topic"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span>New Topic</span>
      </button>

      {/* Hero Card */}
      <section className="glass-base rounded-3xl p-lg md:p-xxl flex flex-col md:flex-row gap-xl items-center relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full"></div>
        <div className="flex-1 space-y-md">
          <div className="flex items-center gap-sm">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-label-sm font-label-sm uppercase">{getTopicTag(session.topic)}</span>
            <span className="flex items-center gap-xs text-tertiary text-label-sm font-label-sm">
              <span className="material-symbols-outlined text-[16px] fill-[1]">local_fire_department</span>
              12 Day Streak
            </span>
          </div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface leading-tight">{session.topic}</h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-lg">
            {session.summary}
          </p>
          <div className="flex flex-wrap gap-md pt-md">
            <button 
              onClick={() => setActiveTab('flashcards')}
              className="primary-btn px-xl py-md rounded-xl text-on-primary font-label-md flex items-center gap-sm"
            >
              <span className="material-symbols-outlined">play_circle</span> Resume Learning
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className="glass-nested px-xl py-md rounded-xl text-on-surface font-label-md hover:bg-white/10 transition-all"
            >
              Practice Quiz
            </button>
          </div>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center gap-lg">
          {/* Mastery Ring */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/5" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-primary progress-glow" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.6" strokeDashoffset={strokeDashoffset} strokeLinecap="round" strokeWidth="10"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-headline-xl font-headline-xl text-on-surface">{overallMastery}%</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">Mastery</span>
            </div>
          </div>
          <div className="glass-nested rounded-2xl p-md flex gap-xl w-full justify-around">
            <div className="text-center">
              <div className="text-label-sm font-label-sm text-on-surface-variant">Mastered</div>
              <div className="text-body-lg font-bold text-primary">{masteredCards} / {totalCards}</div>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="text-center">
              <div className="text-label-sm font-label-sm text-on-surface-variant">Checklist</div>
              <div className="text-body-lg font-bold text-tertiary">{completedChecklistItems} / {totalChecklistItems}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="flex gap-md overflow-x-auto pb-2 no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`glass-base px-xl py-3 rounded-xl font-label-md whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-on-surface'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('flashcards')}
          className={`glass-base px-xl py-3 rounded-xl font-label-md whitespace-nowrap transition-all ${activeTab === 'flashcards' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-on-surface'}`}
        >
          Flashcards ({masteredCards}/{totalCards})
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`glass-base px-xl py-3 rounded-xl font-label-md whitespace-nowrap transition-all ${activeTab === 'quiz' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-on-surface'}`}
        >
          Quiz ({session.quiz.length} Qs)
        </button>
        <button 
          onClick={() => setActiveTab('checklist')}
          className={`glass-base px-xl py-3 rounded-xl font-label-md whitespace-nowrap transition-all ${activeTab === 'checklist' ? 'bg-white/10 border-primary/50 text-primary' : 'text-on-surface-variant hover:bg-white/10 hover:text-on-surface'}`}
        >
          Checklist ({completedChecklistItems}/{totalChecklistItems})
        </button>
      </nav>

      {/* Main Study Desk Area */}
      <div className="w-full">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-lg animate-fade-in">
            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              
              {/* Key Concepts Review */}
              <div className="md:col-span-8 glass-base rounded-3xl p-lg hover:bg-white/10 transition-all duration-500 cursor-pointer group">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span> Key Concepts & Tasks
                  </h3>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
                <div className="space-y-md">
                  {session.checklist.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="glass-nested p-md rounded-2xl flex gap-md items-start">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          {idx === 0 ? 'light_mode' : idx === 1 ? 'cycle' : 'psychology'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-body-md font-bold text-on-surface">{item.item}</h4>
                        <p className="text-label-md text-on-surface-variant">
                          {item.completed ? '🟢 Completed task' : '⏳ Pending milestone review'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory Tricks (Mnemonic) */}
              <div className="md:col-span-4 glass-base rounded-3xl p-lg flex flex-col justify-between border-tertiary/20">
                <div>
                  <h3 className="text-headline-md font-headline-md text-tertiary mb-md flex items-center gap-sm">
                    <span className="material-symbols-outlined">psychology</span> Mnemonics
                  </h3>
                  <div className="p-md bg-tertiary/10 rounded-2xl italic text-on-surface-variant">
                    {getMnemonic(session.topic)}
                  </div>
                </div>
                <div className="mt-lg">
                  <p className="text-label-sm text-on-surface-variant mb-xs">Next recall session:</p>
                  <p className="text-body-md font-bold text-on-surface">In 2 hours (Spaced Repetition)</p>
                </div>
              </div>

              {/* Visual Diagram */}
              <div className="md:col-span-6 h-[400px] glass-base rounded-3xl overflow-hidden group relative">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt="Chloroplast Ultrastructure"
                  src={getDiagramImage(session.topic)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                <div className="absolute bottom-lg left-lg right-lg">
                  <h3 className="text-headline-md font-headline-md text-on-surface">Interactive Visuals</h3>
                  <p className="text-label-md text-on-surface-variant">Explore structure diagrams and concepts</p>
                </div>
                <button className="absolute top-lg right-lg p-2 bg-white/10 backdrop-blur-md rounded-full text-on-surface">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>

              {/* Glossary (Extracted from Flashcards) */}
              <div className="md:col-span-6 glass-base rounded-3xl p-lg">
                <h3 className="text-headline-md font-headline-md text-on-surface mb-lg">Glossary Keywords</h3>
                <div className="space-y-4">
                  {session.flashcards.slice(0, 4).map((fc) => (
                    <div key={fc.id} className="flex justify-between items-start py-2 border-b border-white/5 gap-md">
                      <span className="text-body-md font-bold text-primary shrink-0 max-w-[40%] truncate">{fc.question}</span>
                      <span className="text-label-md text-on-surface-variant text-right max-w-[60%] truncate">{fc.answer}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('flashcards')}
                  className="mt-lg text-primary font-label-md flex items-center gap-xs hover:gap-sm transition-all"
                >
                  View all {session.flashcards.length} terms <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

            </div>

            {/* Refinement Loop Form */}
            <div className="glass-base rounded-3xl p-lg border-primary/20 mt-xl">
              <div className="flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-primary">settings</span>
                <h3 className="text-headline-md font-headline-md text-on-surface">Tailor Study Guide (Refinement Loop)</h3>
              </div>
              <p className="text-label-md text-on-surface-variant mb-md">
                Want to tweak this study set? Type instructions (e.g. "translate definitions to French", "add more detailed flashcards", "make quiz questions twice as hard") and the AI will remodel it.
              </p>
              
              <form onSubmit={handleRefineSubmit} className="flex flex-col md:flex-row gap-md">
                <input
                  type="text"
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                  placeholder="e.g. Translate to Spanish or focus more on the chemical equations..."
                  disabled={isRefining}
                  maxLength={300}
                  required
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={isRefining || !refinementFeedback.trim()}
                  className="primary-btn px-xl py-3 rounded-xl text-on-primary font-label-md flex items-center justify-center gap-sm disabled:opacity-50 min-w-[200px]"
                >
                  {isRefining ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      <span>Remodeling...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      <span>Refine Study Guide</span>
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
