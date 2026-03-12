import React, { useState, useEffect } from 'react';
import Cursor from './components/Cursor';
import { NotificationProvider } from './components/NotificationProvider';
import Header from './components/Header';
import Home from './pages/Home';
import Protocol from './pages/Protocol';
import DesignSystem from './pages/DesignSystem';
import Manifest from './pages/Manifest';
import Checklists from './pages/Checklists';
import History from './pages/History';

export type Page = 'home' | 'protocol' | 'design-system' | 'manifest' | 'checklists' | 'history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [status, setStatus] = useState('Sistema Pronto');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), (i % 6) * 70);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <NotificationProvider>
      <Cursor />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} status={status} />
      <main className="pt-[56px]">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'protocol' && <Protocol setStatus={setStatus} />}
        {currentPage === 'design-system' && <DesignSystem />}
        {currentPage === 'manifest' && <Manifest />}
        {currentPage === 'checklists' && <Checklists />}
        {currentPage === 'history' && <History setCurrentPage={setCurrentPage} />}
      </main>
    </NotificationProvider>
  );
}
