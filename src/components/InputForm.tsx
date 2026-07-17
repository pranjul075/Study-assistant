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
    label: "Quantum Electrodynamics",
    text: "Quantum Electrodynamics (QED) is the relativistic quantum field theory of electrodynamics. It describes how light and matter interact. Key concepts: virtual photons as force carriers, Feynman diagrams for visualizing interactions, renormalization to handle infinities, the anomalous magnetic moment of the electron, and the Lamb shift in hydrogen spectral lines."
  },
  {
    label: "Rust Memory Safety",
    text: "Rust's memory safety model is built on ownership, borrowing, and lifetimes. Each value has a single owner. References can be either shared (&T, immutable) or exclusive (&mut T, mutable) but never both simultaneously. Lifetimes ensure references don't outlive their data. The borrow checker enforces these rules at compile time, eliminating data races and use-after-free bugs without a garbage collector."
  },
  {
    label: "TensorFlow Optimizers",
    text: "TensorFlow optimizers minimize loss functions during neural network training. SGD (Stochastic Gradient Descent) updates weights using the gradient of the loss. Adam combines momentum and RMSProp for adaptive learning rates. AdaGrad adapts per-parameter learning rates. Key hyperparameters: learning rate, beta1, beta2, epsilon. Learning rate scheduling (cosine annealing, warmup) improves convergence."
  }
];

const LOADING_STEPS = [
  "Analyzing conceptual topology...",
  "Constructing knowledge lattice...",
  "Generating active recall vectors...",
  "Compiling assessment modules...",
  "Finalizing study architecture..."
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, isMockMode, sessions, onSelectSession }) => {
  const [prompt, setPrompt] = useState("");
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2800);
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
    if (!isLoading) setPrompt(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 relative">

      {isLoading ? (
        /* ── Loading State ── */
        <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center animate-fade-in">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-headline-md text-lg text-primary">Synthesizing Knowledge</h3>
            <p className="font-body-sm text-sm text-on-surface-variant animate-pulse">
              {LOADING_STEPS[loadingStepIndex]}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Hero Section ── */}
          <section className="flex flex-col items-center text-center">
            <h2 className="font-headline-xl text-3xl md:text-[52px] leading-tight tracking-tight mb-3 text-primary max-w-4xl">
              Precision Learning for <span className="text-secondary">Technical Minds</span>
            </h2>
            <p className="text-on-surface-variant font-body-lg text-sm md:text-base max-w-2xl mx-auto opacity-80 leading-relaxed">
              Transform fragmented notes into crystalline knowledge structures using geometric AI synthesis.
            </p>
          </section>

          {/* ── Main Studio Card ── */}
          <div className="relative w-full group">
            {/* Prism refraction corners */}
            <div className="prism-refraction refraction-tl"></div>
            <div className="prism-refraction refraction-br"></div>

            <div className="glass-card rounded-xl p-6 md:p-10 shadow-2xl relative overflow-hidden prism-border">
              {/* Inner geometric light accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
                  <span className="font-label-md text-label-md uppercase tracking-widest text-primary/70">Intelligent Studio</span>
                </div>

                <p className="text-on-surface-variant font-body-md text-sm mb-6 opacity-80 max-w-3xl leading-relaxed">
                  Paste your messy class notes, study guides, or simply type a topic you want to master. Our AI will structure it into a beautiful, interactive active study kit.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    maxLength={5000}
                    required
                    className="w-full h-40 bg-surface-container-lowest/40 border border-white/10 rounded-xl p-5 font-body-md text-sm text-on-surface placeholder:text-white/20 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none resize-none"
                    placeholder="e.g. Paste your messy notes or type a complex topic..."
                  />

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-sm text-[10px] text-on-surface-variant tracking-widest uppercase mr-1">Quick Demos:</span>
                      {TEMPLATES.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplyTemplate(tpl.text)}
                          className="px-3 py-1 rounded-full border border-white/10 bg-white/5 font-label-sm text-[10px] text-on-surface-variant hover:bg-white/10 hover:border-primary/40 hover:text-primary transition-all"
                        >
                          {tpl.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {isMockMode && (
                        <span className="font-label-sm text-[10px] text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">info</span>
                          MOCK MODE
                        </span>
                      )}
                      <span className="font-label-sm text-[10px] text-on-surface-variant/50">{prompt.length}/5000</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="gradient-button-glow bg-gradient-to-r from-primary-container to-white text-on-primary-fixed font-headline-md text-base px-8 py-3.5 rounded-lg flex items-center gap-2 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none w-full md:w-auto justify-center"
                  >
                    Generate Study Space
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </button>
                </form>
              </div>
            </div>

            {/* ── Bento Feature Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="glass-card prism-border p-5 rounded-lg group hover:translate-y-[-3px] transition-transform">
                <span className="material-symbols-outlined text-primary-fixed-dim mb-3 text-[20px]" style={{ fontVariationSettings: '"FILL" 0' }}>style</span>
                <h3 className="font-headline-md text-base mb-1 text-primary">Smart Flashcards</h3>
                <p className="text-on-surface-variant font-body-sm text-xs leading-relaxed">AI-generated active recall decks based on your synthesized notes.</p>
              </div>
              <div className="glass-card prism-border p-5 rounded-lg group hover:translate-y-[-3px] transition-transform">
                <span className="material-symbols-outlined text-secondary-fixed-dim mb-3 text-[20px]">account_tree</span>
                <h3 className="font-headline-md text-base mb-1 text-primary">Prism Mapping</h3>
                <p className="text-on-surface-variant font-body-sm text-xs leading-relaxed">Visualize complex concepts through interactive geometric nodes.</p>
              </div>
              <div className="glass-card prism-border p-5 rounded-lg group hover:translate-y-[-3px] transition-transform">
                <span className="material-symbols-outlined text-primary mb-3 text-[20px]">auto_awesome</span>
                <h3 className="font-headline-md text-base mb-1 text-primary">Pathways AI</h3>
                <p className="text-on-surface-variant font-body-sm text-xs leading-relaxed">Personalized curriculum logic that adapts to your mental speed.</p>
              </div>
            </div>
          </div>

          {/* ── Recent Knowledge Sprints / Active Pathways ── */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-lg text-primary">Recent Knowledge Sprints</h3>
              <span className="text-label-md text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                View History <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>

            <div className="glass-card prism-border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-5 py-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant/70 border-b border-white/5">Topic</th>
                    <th className="px-5 py-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant/70 border-b border-white/5 hidden md:table-cell">Progress</th>
                    <th className="px-5 py-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant/70 border-b border-white/5">Retained</th>
                    <th className="px-5 py-3 font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant/70 border-b border-white/5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessions.length > 0 ? (
                    sessions.map((s) => {
                      const total = s.flashcards.length;
                      const mastered = s.flashcards.filter(f => f.status === 'mastered').length;
                      const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
                      return (
                        <tr
                          key={s.id}
                          onClick={() => onSelectSession(s.id)}
                          className="hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></div>
                              <span className="font-body-md text-sm truncate max-w-[200px]">{s.topic}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }}></div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-label-md text-[12px] text-primary">{pct}%</td>
                          <td className="px-5 py-4 text-right">
                            <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity text-primary">open_in_new</span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    /* Default placeholder rows */
                    <>
                      <tr className="hover:bg-white/5 transition-colors cursor-pointer group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span className="font-body-md text-sm">Advanced React Hooks</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-gradient-to-r from-primary to-secondary"></div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-label-md text-[12px] text-primary">82%</td>
                        <td className="px-5 py-4 text-right">
                          <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors cursor-pointer group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                            <span className="font-body-md text-sm">Distributed Systems</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-gradient-to-r from-primary to-secondary"></div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-label-md text-[12px] text-primary">64%</td>
                        <td className="px-5 py-4 text-right">
                          <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors cursor-pointer group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full"></div>
                            <span className="font-body-md text-sm">Graph Theory Basics</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-gradient-to-r from-primary to-secondary"></div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-label-md text-[12px] text-primary">95%</td>
                        <td className="px-5 py-4 text-right">
                          <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Mobile Bottom Nav spacer ── */}
          <div className="h-20 md:hidden"></div>
        </>
      )}
    </div>
  );
};
