import React from 'react';
import { History } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-glass-fill backdrop-blur-3xl border-b border-glass-stroke shadow-sm h-16">
      <div className="flex justify-between items-center h-full px-margin-desktop max-w-max-width mx-auto w-full">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md text-primary tracking-tight">AuraStudy</span>
          <div className="hidden md:flex gap-6">
            <span className="text-primary font-medium px-3 py-1 rounded-full bg-white/5 cursor-default">Study Space</span>
          </div>
        </div>

        <div className="flex items-center gap-md">
          <button 
            onClick={onToggleHistory}
            className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-white/5 rounded-full transition-all duration-300 flex items-center gap-xs"
            aria-label="Toggle History"
          >
            <History size={20} />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-fixed-dim text-[10px] font-bold text-on-primary-fixed animate-scale-in">
                {historyCount}
              </span>
            )}
          </button>
          
          <div className="w-8 h-8 rounded-full border border-glass-stroke overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV11DsTY_F7HVZT356NQvrNfmAdDduWBJq-mpNwN84bKDYIEJgS8vRADAovTNZMJh35jcQy15Zk-QJt29ZzqoxQBlJO7GLYv5IIZFm40rUGkgBNHUG6jdUlwvqkAZ3Auv4KKGx6Jq1Jmw4MYym0Ge76l9mXH0W4wiXxYHyf87Mx5jxHji7RagpSGuqJlNIU6VVbFxrZd5OyV-2i6ciM3gJF_Xrde5ruOURC1PrJe8SXgPZOT--ctMYiA"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
