import React, { useState, useEffect } from 'react';

interface InputFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  isMockMode: boolean;
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
  "Synthesizing core terms into 3D flashcards...",
  "Drafting conceptual multiple-choice quiz questions...",
  "Formatting explanations and compiling checklists...",
  "Assembling your active study guide..."
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, isMockMode }) => {
  const [prompt, setPrompt] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  // Cycle through funny/informative loading status steps
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

  return (
    <div className="glass-base rounded-3xl p-lg md:p-xl space-y-md w-full max-w-3xl mx-auto relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] rounded-full"></div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-xl space-y-lg text-center animate-fade-in">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Pulsing loading spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-primary animate-spin"></div>
            <span className="material-symbols-outlined text-[36px] text-primary">auto_awesome</span>
          </div>
          <div className="space-y-sm">
            <h3 className="text-headline-md font-headline-md text-on-surface">Creating Study Space</h3>
            <p className="text-body-md text-on-surface-variant max-w-md animate-pulse">
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-md animate-fade-in">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-[28px] text-primary">auto_awesome</span>
            <h2 className="text-headline-md font-headline-md text-on-surface">What are we studying today?</h2>
          </div>
          
          <p className="text-label-md text-on-surface-variant leading-relaxed">
            Paste your messy class notes, study guides, or simply type a topic you want to master. 
            Our AI will structure it into a beautiful, interactive active study kit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="relative w-full">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Paste details about mitochondrial cellular respiration or type 'JavaScript closures vs prototypes'..."
                maxLength={5000}
                rows={6}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-md pr-16 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 text-[12px] text-on-surface-variant/60 font-mono">
                {prompt.length}/5000
              </div>
            </div>

            {/* Quick template suggestions */}
            <div className="space-y-sm">
              <span className="text-[12px] font-bold text-on-surface-variant tracking-wider uppercase">Quick Demos:</span>
              <div className="flex flex-wrap gap-sm">
                {TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl.text)}
                    className="glass-nested hover:bg-white/10 hover:border-primary/50 text-on-surface rounded-xl px-4 py-2 text-label-sm font-label-sm flex items-center gap-sm transition-all"
                  >
                    <span>{tpl.icon}</span>
                    <span>{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-sm flex items-center justify-between">
              {isMockMode && (
                <span className="text-tertiary text-label-sm flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  Mock AI Mode Active
                </span>
              )}
              <button 
                type="submit" 
                disabled={!prompt.trim()}
                className="primary-btn px-xl py-3 rounded-xl text-on-primary font-label-md flex items-center gap-sm ml-auto disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Generate Study Space</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
