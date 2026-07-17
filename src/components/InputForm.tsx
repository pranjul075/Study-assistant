import React, { useState, useEffect } from 'react';
import type { StudySession } from '../types';

interface InputFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  isMockMode: boolean;
  sessions: StudySession[];
  onSelectSession: (id: string) => void;
}

const TEMPLATES = [
  {
    label: "Photosynthesis",
    icon: "🌱",
    text: "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. Key concepts: Light-dependent reactions (takes place in thylakoid membranes, splits H2O, produces ATP, NADPH, and O2 byproduct) and Light-independent reactions (Calvin Cycle, occurs in stroma, fixes CO2 using RuBisCO, produces G3P/glucose)."
  },
  {
    label: "React Hooks",
    icon: "⚛️",
    text: "React Hooks allow functional components to manage state and side effects. Rules of hooks: only call at top level, only call from React functions. Main hooks: useState (adds state), useEffect (manages side effects and cleanup), useContext (consumes contexts), useMemo (memoizes computed values), useCallback (memoizes functions), useRef (persists values across renders without re-rendering)."
  },
  {
    label: "Mitochondria",
    icon: "🔋",
    text: "Mitochondria are the double-membraned powerhouses of the cell. They contain an outer membrane, an intermembrane space, an inner membrane (folded into cristae to maximize surface area), and the matrix inside. Responsible for aerobic respiration: Link reaction and Krebs cycle occur in the matrix, while the electron transport chain (ETC) and oxidative phosphorylation occur on the inner membrane cristae."
  }
];

const LOADING_STEPS = [
  "Reading your notes and digesting concepts...",
  "Synthesizing core terms into cognitive pathways...",
  "Drafting conceptual multiple-choice quiz questions...",
  "Formatting explanations and compiling checklists...",
  "Assembling your active study guide..."
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, isMockMode, sessions, onSelectSession }) => {
  const [prompt, setPrompt] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle loading steps
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleApplyTemplate = (text: string) => {
    if (!isLoading) {
      setPrompt(text);
    }
  };

  // Add mouse move listener for glass card glowing effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.glass-studio').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full space-y-32">
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-8 text-center animate-fade-in max-w-md mx-auto">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary-fixed-dim/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-primary-fixed-dim animate-spin"></div>
            <span className="material-symbols-outlined text-[36px] text-primary-fixed-dim">auto_awesome</span>
          </div>
          <div className="space-y-3">
            <h3 className="font-headline-md text-headline-md text-primary">Formulating Pathway</h3>
            <p className="font-body-lg text-body-lg text-on-surface-variant animate-pulse">
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="text-center mb-16 max-w-4xl mx-auto space-y-6">
            <h1 className="font-display-xl text-[44px] md:text-display-xl text-primary tracking-tight leading-none">
              Precision Learning <br />
              <span className="text-gradient">for Technical Minds.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Transform dense technical documentation into interactive cognitive pathways. Designed for engineers, researchers, and polymaths.
            </p>
          </section>

          {/* Intelligent Studio Card */}
          <section>
            <div className="glass-studio glowing-edge rounded-[32px] p-8 md:p-12 mx-auto max-w-max-width">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-headline-md text-headline-md text-primary">Intelligent Studio</h2>
                    <div className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></span>
                      <span className="font-label-mono text-label-mono text-on-surface-variant">READY TO ANALYZE</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <p className="text-on-surface-variant font-body-md opacity-85 leading-relaxed">
                      Paste your messy class notes, study guides, or simply type a topic you want to master. Our AI will structure it into a beautiful, interactive active study kit.
                    </p>

                    <div className="relative group">
                      <div className="absolute top-6 left-6 flex items-start pointer-events-none">
                        <span className="material-symbols-outlined text-on-surface-variant">auto_awesome</span>
                      </div>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Paste technical docs, notes, code snippets, or study outlines..."
                        maxLength={5000}
                        required
                        className="w-full pl-14 pr-6 py-6 bg-white/5 border-none rounded-2xl text-primary placeholder-on-surface-variant/30 focus:ring-2 focus:ring-primary/45 outline-none transition-all text-body-md min-h-[160px] resize-none"
                      />
                      <div className="absolute bottom-4 right-6 font-label-mono text-label-mono text-on-surface-variant/50">
                        {prompt.length}/5000
                      </div>
                    </div>

                    {/* Demos section */}
                    <div className="space-y-2">
                      <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Quick Demos:</span>
                      <div className="flex flex-wrap gap-2">
                        {TEMPLATES.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplyTemplate(tpl.text)}
                            className="bg-white/5 hover:bg-white/10 hover:text-primary text-on-surface-variant px-3 py-2 text-[13px] rounded-xl flex items-center gap-sm transition-all duration-300 border border-white/5"
                          >
                            <span>{tpl.icon}</span>
                            <span>{tpl.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      {isMockMode && (
                        <span className="text-secondary-fixed-dim text-xs font-label-mono flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">info</span>
                          MOCK AI MODE
                        </span>
                      )}
                      <button 
                        type="submit"
                        disabled={!prompt.trim()}
                        className="w-full py-6 rounded-full bg-gradient-to-r from-primary-fixed-dim via-secondary-fixed-dim to-tertiary-fixed-dim text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(153,212,174,0.3)] transition-all duration-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Generate Cognitive Pathway
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid Insights */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Featured Module */}
            <div className="md:col-span-2 glass-studio rounded-[24px] overflow-hidden group">
              <div className="h-64 relative">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Neural Network conceptual visual"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3x5dW-wXzIdegc7GgE9p_NsN4U4eneZ7S79MkQbSvcCXJEA5zZ4zPYsC0XMd3-1_h_JBOiLnmA6U08AImwStV2MdIV4jLhceN32FcA2G2GPUqG-sUvJohXIbnGtYWN69bPFyeOnO0IyjyaIXOIJagCBlcnkUi4r65IoA6dY6xqdXuMuW6WIsozkCVshiq9T6W7zjY2BNN8_4zcpQYZJgfdzmTQhQfTMUifjqIGjwlwb2hwQ98HDLwGQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-label-mono text-label-mono text-secondary px-2 py-1 bg-secondary/10 rounded">SYSTEM RECOMMENDED</span>
                  <span className="text-on-surface-variant font-label-mono text-label-mono">12 MIN READ</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-primary mb-4">Quantum Architecture Foundations</h3>
                <p className="text-on-surface-variant mb-6">Explore the multi-layered intricacies of quantum logic gates and their implementation in error-correction protocols.</p>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-secondary to-primary-fixed-dim"></div>
                </div>
              </div>
            </div>
            {/* Side Cards */}
            <div className="flex flex-col gap-gutter">
              <div className="glass-studio rounded-[24px] p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary-fixed-dim mb-4 text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                  <h4 className="font-body-lg text-body-lg text-primary mb-2">Daily Sprint</h4>
                  <p className="text-on-surface-variant text-sm">Reinforce 5 key concepts from your systems design library.</p>
                </div>
                <button 
                  onClick={() => handleApplyTemplate(TEMPLATES[0].text)}
                  className="text-primary font-label-mono text-label-mono uppercase hover:tracking-widest transition-all text-left mt-4"
                >
                  Start Now →
                </button>
              </div>
              <div className="glass-studio rounded-[24px] p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-secondary-fixed-dim mb-4 text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>insights</span>
                  <h4 className="font-body-lg text-body-lg text-primary mb-2">Retention Score</h4>
                </div>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-4xl font-bold text-primary">94%</span>
                  <span className="text-primary-fixed-dim text-sm font-label-mono mb-1">+2.4%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Pathways Row */}
          <section className="pb-12">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-12">Active Pathways</h2>
            <div className="flex gap-gutter overflow-x-auto pb-8 scrollbar-hide">
              {sessions.length > 0 ? (
                sessions.map((s) => {
                  const total = s.flashcards.length;
                  const mastered = s.flashcards.filter(f => f.status === 'mastered').length;
                  const progress = total > 0 ? Math.round((mastered / total) * 100) : 0;
                  return (
                    <div 
                      key={s.id} 
                      onClick={() => onSelectSession(s.id)}
                      className="min-w-[300px] glass-studio rounded-2xl p-6 hover:translate-y-[-8px] transition-transform duration-300 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-secondary">memory</span>
                      </div>
                      <h5 className="text-primary font-bold mb-2 truncate">{s.topic}</h5>
                      <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{s.summary}</p>
                      <div className="flex justify-between items-center text-xs font-label-mono">
                        <span className="text-on-surface-variant">{mastered}/{total} MASTERED</span>
                        <span className="text-primary">{progress}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Default Pathways when history is empty */}
                  <div className="min-w-[300px] glass-studio rounded-2xl p-6 hover:translate-y-[-8px] transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-secondary">memory</span>
                    </div>
                    <h5 className="text-primary font-bold mb-2">Systems Design</h5>
                    <p className="text-on-surface-variant text-sm mb-6">Distributed systems and consensus algorithms.</p>
                    <div className="flex justify-between items-center text-xs font-label-mono">
                      <span className="text-on-surface-variant">8/12 MODULES</span>
                      <span className="text-primary">67%</span>
                    </div>
                  </div>
                  <div className="min-w-[300px] glass-studio rounded-2xl p-6 hover:translate-y-[-8px] transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-secondary">psychology</span>
                    </div>
                    <h5 className="text-primary font-bold mb-2">Neural Networks</h5>
                    <p className="text-on-surface-variant text-sm mb-6">Deep learning architectures and backpropagation.</p>
                    <div className="flex justify-between items-center text-xs font-label-mono">
                      <span className="text-on-surface-variant">15/20 MODULES</span>
                      <span className="text-primary">75%</span>
                    </div>
                  </div>
                  <div className="min-w-[300px] glass-studio rounded-2xl p-6 hover:translate-y-[-8px] transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-secondary">terminal</span>
                    </div>
                    <h5 className="text-primary font-bold mb-2">Compiler Theory</h5>
                    <p className="text-on-surface-variant text-sm mb-6">Lexical analysis and abstract syntax trees.</p>
                    <div className="flex justify-between items-center text-xs font-label-mono">
                      <span className="text-on-surface-variant">3/10 MODULES</span>
                      <span className="text-primary">30%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-surface-dim w-full py-gutter mt-auto border-t border-white/5 absolute left-0 right-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-margin-desktop max-w-max-width mx-auto">
              <div className="space-y-4">
                <span className="font-headline-sm text-headline-sm text-on-surface">AuraStudy</span>
                <p className="font-label-mono text-label-mono text-on-surface-variant opacity-80">© 2024 AuraStudy. Precision Learning.</p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end items-center">
                <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">About</a>
                <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy</a>
                <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms</a>
                <a className="font-label-mono text-label-mono text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};
