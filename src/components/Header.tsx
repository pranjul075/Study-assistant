import React from 'react';
import { History } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, historyCount }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-margin-desktop py-4 max-w-full bg-white/5 backdrop-blur-[30px] border-b border-white/12">
      <div className="text-headline-md font-headline-md font-bold text-primary bg-clip-text">AuraStudy</div>
      
      <nav className="hidden md:flex items-center gap-xl">
        <span className="text-label-md font-label-md text-primary border-b-2 border-primary pb-1 cursor-default">Study Space</span>
      </nav>

      <div className="flex items-center gap-md">
        <button 
          onClick={onToggleHistory}
          className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-white/10 rounded-full transition-all duration-300 flex items-center gap-xs"
          aria-label="Toggle History"
        >
          <History size={20} />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary animate-scale-in">
              {historyCount}
            </span>
          )}
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            alt="Student portrait"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV11DsTY_F7HVZT356NQvrNfmAdDduWBJq-mpNwN84bKDYIEJgS8vRADAovTNZMJh35jcQy15Zk-QJt29ZzqoxQBlJO7GLYv5IIZFm40rUGkgBNHUG6jdUlwvqkAZ3Auv4KKGx6Jq1Jmw4MYym0Ge76l9mXH0W4wiXxYHyf87Mx5jxHji7RagpSGuqJlNIU6VVbFxrZd5OyV-2i6ciM3gJF_Xrde5ruOURC1PrJe8SXgPZOT--ctMYiA"
          />
        </div>
      </div>
    </header>
  );
};
