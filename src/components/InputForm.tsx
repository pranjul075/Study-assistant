import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

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
    <div className="card input-card glass animate-fade-in">
      <div className="card-header">
        <Sparkles size={24} className="text-accent animate-pulse-slow" />
        <h2>What are we studying today?</h2>
      </div>
      
      <p className="card-desc">
        Paste your messy class notes, study guides, or simply type a topic you want to master. 
        Our AI will structure it into an active study kit.
      </p>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="textarea-wrapper">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Paste details about mitochondrial cellular respiration or type 'JavaScript closures vs prototypes'..."
            disabled={isLoading}
            maxLength={5000}
            rows={6}
            required
          />
          <div className="char-count">
            {prompt.length}/5000
          </div>
        </div>

        {/* Quick template suggestions */}
        <div className="templates-section">
          <span className="templates-label">Quick Demos:</span>
          <div className="templates-chips">
            {TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                className="chip-btn"
                onClick={() => handleApplyTemplate(tpl.text)}
                disabled={isLoading}
                title="Click to populate input with sample study text"
              >
                <span>{tpl.icon}</span> {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-footer">
          {isMockMode && (
            <div className="mock-badge-wrapper">
              <span className="badge badge-warning animate-pulse-slow">
                Mock AI Mode Active
              </span>
              <span className="mock-tooltip" title="The server detected no GEMINI_API_KEY. It will generate dynamic realistic mock data instantly.">
                (?)
              </span>
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary btn-large submit-btn"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Generating Study Kit...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Study Kit</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading Steps Visual Indicator */}
      {isLoading && (
        <div className="loading-steps-overlay">
          <div className="loading-steps-card glass">
            <Loader2 className="animate-spin text-accent text-large-spin" size={48} />
            <h3 className="loading-title">AI is working its magic</h3>
            <div className="progress-bar-container animate-pulse-slow">
              <div 
                className="progress-bar-loading" 
                style={{ width: `${((loadingStepIndex + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="loading-step-text animate-fade-in" key={loadingStepIndex}>
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
