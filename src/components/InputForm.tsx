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
    label: "Photosynthesis Guide",
    icon: "🌱",
    text: "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy. Key concepts: Light-dependent reactions (takes place in thylakoid membranes, splits H2O, produces ATP, NADPH, and O2 byproduct) and Light-independent reactions (Calvin Cycle, occurs in stroma, fixes CO2 using RuBisCO, produces G3P/glucose)."
  },
  {
    label: "React Hooks Cheat Sheet",
    icon: "⚛️",
    text: "React Hooks allow functional components to manage state and side effects. Rules of hooks: only call at top level, only call from React functions. Main hooks: useState (adds state), useEffect (manages side effects and cleanup), useContext (consumes contexts), useMemo (memoizes computed values), useCallback (memoizes functions), useRef (persists values across renders without re-rendering)."
  },
  {
    label: "Mitochondria Anatomy",
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
    <div className="w-full space-y-16 max-w-max-width mx-auto">
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center animate-fade-in max-w-sm mx-auto">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-primary-fixed-dim/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-primary-fixed-dim animate-spin"></div>
            <span className="material-symbols-outlined text-[20px] text-primary-fixed-dim">auto_awesome</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary">Formulating Pathway</h3>
            <p className="text-sm text-on-surface-variant animate-pulse leading-relaxed">
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
            <h1 className="font-display-xl text-3xl md:text-[44px] text-primary tracking-tight leading-tight">
              Precision Learning <br />
              <span className="text-gradient">for Technical Minds.</span>
            </h1>
            <p className="font-body-md text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Transform dense technical documentation into interactive cognitive pathways. Designed for engineers, researchers, and polymaths.
            </p>
          </section>

          {/* Intelligent Studio Card */}
          <section>
            <div className="glass-studio glowing-edge rounded-2xl p-6 md:p-8 mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Intelligent Studio</h2>
                    <div className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></span>
                      <span className="font-label-mono text-[10px] text-on-surface-variant tracking-wider">READY TO ANALYZE</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-on-surface-variant text-sm opacity-85 leading-relaxed">
                      Paste your class notes, technical docs, or simply type a topic you want to master. Our AI will structure it into an interactive study kit.
                    </p>

                    <div className="relative group">
                      <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">auto_awesome</span>
                      </div>
                      <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Paste technical docs, notes, code snippets, or study outlines..."
                        maxLength={5000}
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/5 focus:border-white/10 rounded-xl text-primary placeholder-on-surface-variant/30 focus:ring-2 focus:ring-primary/45 outline-none transition-all text-sm min-h-[120px] resize-none"
                      />
                      <div className="absolute bottom-3 right-4 font-label-mono text-[10px] text-on-surface-variant/50">
                        {prompt.length}/5000
                      </div>
                    </div>

                    {/* Demos section */}
                    <div className="space-y-2">
                      <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Quick Demos:</span>
                      <div className="flex flex-wrap gap-2">
                        {TEMPLATES.map((tpl, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplyTemplate(tpl.text)}
                            className="bg-white/5 hover:bg-white/10 hover:text-primary text-on-surface-variant px-3 py-1.5 text-xs rounded-lg flex items-center gap-xs transition-all duration-300 border border-white/5"
                          >
                            <span>{tpl.icon}</span>
                            <span>{tpl.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      {isMockMode && (
                        <span className="text-secondary-fixed-dim text-[11px] font-label-mono flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          MOCK AI MODE
                        </span>
                      )}
                      <button 
                        type="submit"
                        disabled={!prompt.trim()}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-fixed-dim via-secondary-fixed-dim to-tertiary-fixed-dim text-on-primary-fixed font-bold text-base hover:shadow-[0_0_20px_rgba(153,212,174,0.2)] transition-all duration-500 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
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
            <div className="md:col-span-2 glass-studio rounded-2xl overflow-hidden group flex flex-col justify-between">
              <div className="h-44 relative overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="Neural Network conceptual visual"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3x5dW-wXzIdegc7GgE9p_NsN4U4eneZ7S79MkQbSvcCXJEA5zZ4zPYsC0XMd3-1_h_JBOiLnmA6U08AImwStV2MdIV4jLhceN32FcA2G2GPUqG-sUvJohXIbnGtYWN69bPFyeOnO0IyjyaIXOIJagCBlcnkUi4r65IoA6dY6xqdXuMuW6WIsozkCVshiq9T6W7zjY2BNN8_4zcpQYZJgfdzmTQhQfTMUifjqIGjwlwb2hwQ98HDLwGQ"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent opacity-60"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-label-mono text-[10px] text-secondary px-2 py-0.5 bg-secondary/10 rounded">SYSTEM RECOMMENDED</span>
                  <span className="text-on-surface-variant font-label-mono text-[10px]">12 MIN READ</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Quantum Architecture Foundations</h3>
                <p className="text-on-surface-variant text-sm mb-4 leading-relaxed line-clamp-2">Explore the multi-layered intricacies of quantum logic gates and their implementation in error-correction protocols.</p>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-secondary to-primary-fixed-dim"></div>
                </div>
              </div>
            </div>
            {/* Side Cards */}
            <div className="flex flex-col gap-gutter">
              <div className="glass-studio rounded-2xl p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-primary-fixed-dim mb-2 text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>bolt</span>
                  <h4 className="font-body-lg text-base text-primary mb-1 font-bold">Daily Sprint</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed">Reinforce 5 key concepts from your systems design library.</p>
                </div>
                <button 
                  onClick={() => handleApplyTemplate(TEMPLATES[0].text)}
                  className="text-primary font-label-mono text-[10px] uppercase hover:tracking-widest transition-all text-left mt-3"
                >
                  Start Now →
                </button>
              </div>
              <div className="glass-studio rounded-2xl p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-secondary-fixed-dim mb-2 text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>insights</span>
                  <h4 className="font-body-lg text-base text-primary mb-1 font-bold">Retention Score</h4>
                </div>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-3xl font-bold text-primary">94%</span>
                  <span className="text-primary-fixed-dim text-xs font-label-mono mb-1">+2.4%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Pathways Row */}
          <section className="pb-8">
            <h2 className="text-xl font-bold text-primary mb-4">Active Pathways</h2>
            <div className="flex gap-gutter overflow-x-auto pb-4 scrollbar-hide">
              {sessions.length > 0 ? (
                sessions.map((s) => {
                  const total = s.flashcards.length;
                  const mastered = s.flashcards.filter(f => f.status === 'mastered').length;
                  const progress = total > 0 ? Math.round((mastered / total) * 100) : 0;
                  return (
                    <div 
                      key={s.id} 
                      onClick={() => onSelectSession(s.id)}
                      className="min-w-[260px] max-w-[280px] glass-studio rounded-xl p-5 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-secondary text-[20px]">memory</span>
                      </div>
                      <h5 className="text-primary font-bold text-sm mb-1 truncate">{s.topic}</h5>
                      <p className="text-on-surface-variant text-xs mb-4 line-clamp-2 leading-relaxed">{s.summary}</p>
                      <div className="flex justify-between items-center text-[10px] font-label-mono">
                        <span className="text-on-surface-variant">{mastered}/{total} MASTERED</span>
                        <span className="text-primary">{progress}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  {/* Default Pathways when history is empty */}
                  <div className="min-w-[260px] max-w-[280px] glass-studio rounded-xl p-5 hover:translate-y-[-4px] transition-all duration-300">
                    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-secondary text-[20px]">memory</span>
                    </div>
                    <h5 className="text-primary font-bold text-sm mb-1">Systems Design</h5>
                    <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">Distributed systems and consensus algorithms.</p>
                    <div className="flex justify-between items-center text-[10px] font-label-mono">
                      <span className="text-on-surface-variant">8/12 MODULES</span>
                      <span className="text-primary">67%</span>
                    </div>
                  </div>
                  <div className="min-w-[260px] max-w-[280px] glass-studio rounded-xl p-5 hover:translate-y-[-4px] transition-all duration-300">
                    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-secondary text-[20px]">psychology</span>
                    </div>
                    <h5 className="text-primary font-bold text-sm mb-1">Neural Networks</h5>
                    <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">Deep learning architectures and backpropagation.</p>
                    <div className="flex justify-between items-center text-[10px] font-label-mono">
                      <span className="text-on-surface-variant">15/20 MODULES</span>
                      <span className="text-primary">75%</span>
                    </div>
                  </div>
                  <div className="min-w-[260px] max-w-[280px] glass-studio rounded-xl p-5 hover:translate-y-[-4px] transition-all duration-300">
                    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-secondary text-[20px]">terminal</span>
                    </div>
                    <h5 className="text-primary font-bold text-sm mb-1">Compiler Theory</h5>
                    <p className="text-on-surface-variant text-xs mb-4 leading-relaxed">Lexical analysis and syntax trees.</p>
                    <div className="flex justify-between items-center text-[10px] font-label-mono">
                      <span className="text-on-surface-variant">3/10 MODULES</span>
                      <span className="text-primary">30%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-surface-dim w-full py-4 mt-auto border-t border-white/5 absolute left-0 right-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-margin-desktop max-w-max-width mx-auto">
              <div className="space-y-1">
                <span className="text-sm font-bold text-on-surface">AuraStudy</span>
                <p className="font-label-mono text-[9px] text-on-surface-variant opacity-80">© 2024 AuraStudy. Precision Learning.</p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end items-center">
                <a className="font-label-mono text-[10px] text-on-surface-variant hover:text-secondary transition-colors" href="#">About</a>
                <a className="font-label-mono text-[10px] text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy</a>
                <a className="font-label-mono text-[10px] text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms</a>
                <a className="font-label-mono text-[10px] text-on-surface-variant hover:text-secondary transition-colors" href="#">Support</a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};
