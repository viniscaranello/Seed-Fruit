import React from 'react';
import { Page } from '../App';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  status: string;
}

export default function Header({ currentPage, setCurrentPage, status }: HeaderProps) {
  const tabs: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'protocol', label: 'Protocolo' },
    { id: 'design-system', label: 'Design System' },
    { id: 'manifest', label: 'Export Manifest' },
    { id: 'checklists', label: 'Checklists' },
    { id: 'history', label: 'Histórico' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] flex items-center justify-between px-4 md:px-[40px] h-[56px] border-b border-border bg-[#0a0a08f0] backdrop-blur-md">
      <div className="font-bebas text-[20px] tracking-[0.15em] text-accent cursor-none shrink-0">
        SEED<span className="text-muted">→</span>FRUIT
      </div>
      <div className="flex h-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            className={`flex items-center px-[12px] md:px-[18px] text-[10px] md:text-[11px] tracking-[0.1em] uppercase border-l border-border cursor-none transition-colors duration-200 relative bg-transparent font-mono whitespace-nowrap ${
              currentPage === tab.id ? 'text-accent bg-accent/5' : 'text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            {tab.label}
            {currentPage === tab.id && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-[10px] shrink-0 hidden sm:flex">
        <div className="w-[8px] h-[8px] bg-accent rounded-full animate-pdot" />
        <span className="text-[10px] text-accent tracking-[0.12em] uppercase">{status}</span>
      </div>
    </header>
  );
}
