import React from 'react';
import { History } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl border-b border-white/10 h-16">
      <div className="flex justify-between items-center px-gutter max-w-max-width mx-auto h-full">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-12">
          <h1 className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">AuraStudy</h1>
          <nav className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            <span className="text-primary border-b-2 border-primary pb-1 cursor-default">Library</span>
            <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Pathways</span>
            <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Insights</span>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Search bar (desktop) */}
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-3">
            <span className="material-symbols-outlined text-sm opacity-50">search</span>
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="bg-transparent border-none focus:ring-0 text-label-md w-48 text-on-surface placeholder:text-white/20"
              readOnly
            />
          </div>

          <div className="flex items-center gap-4">
            {/* History toggle */}
            <button
              onClick={onToggleHistory}
              className="relative p-1.5 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Toggle History"
            >
              <History size={20} />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container text-[9px] font-bold text-white">
                  {historyCount}
                </span>
              )}
            </button>

            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors text-[20px]">settings</span>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <img 
                className="w-full h-full object-cover" 
                alt="Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyLxOrZz6WEE0H7UDb5XXyvOpgNLRi0uRVn8zCAL0_K26kdNqQbhXG0edvSfCEPPhbgAZ4KLL8EylhIsIPwsrp7mhNJkio7C7lUD_Z-Wh0NpQYY5CPRWg4BS9RG_S7tIg56HDHz3a8CGSP_8AIijGQ_3OUElFnpndR26hsyHfqcHhx-2cuVtFw6ArqMuXEBMkH2TAIoQ4PWVG1Uu9A0i6v20AkpCJ9cepSwtDejbwW6BuxNZpC3Piq0g"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
