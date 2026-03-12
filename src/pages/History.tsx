import React, { useState, useEffect } from 'react';
import { Page } from '../App';
import { useNotification } from '../components/NotificationProvider';

interface HistoryItem {
  id: number;
  date: string;
  nome: string;
  canal: string;
  objetivo: string;
  manifest: string;
  preview: string;
}

export default function History({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) {
  const { notify } = useNotification();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf_history') || '[]');
      setHistory(saved);
    } catch {}
  }, []);

  const deleteHist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHist = history.filter(h => h.id !== id);
    setHistory(newHist);
    try { localStorage.setItem('sf_history', JSON.stringify(newHist)); } catch {}
    notify('info', 'Removido');
  };

  const clearHistory = () => {
    if (!window.confirm('Limpar todo o histórico?')) return;
    setHistory([]);
    try { localStorage.setItem('sf_history', '[]'); } catch {}
    notify('info', 'Histórico limpo');
  };

  const formatText = (t: string) => {
    let html = t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/`([^`]+)`/g, '<code style="color:var(--color-accent3);background:rgba(74,240,200,.08);padding:1px 5px">$1</code>');
    return { __html: html };
  };

  return (
    <div className="p-6 md:p-[48px] animate-in fade-in duration-500">
      <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Arquivo</div>
      <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] mb-[32px]">HISTÓRICO DE PROJETOS</h2>
      
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[380px] gap-[14px] text-center">
          <div className="text-[48px] opacity-30">📂</div>
          <div className="font-fraunces italic text-[19px] text-muted font-light">Nenhum projeto processado ainda</div>
          <div className="text-[11px] text-muted">Os manifests gerados aparecerão aqui automaticamente.</div>
          <button onClick={() => setCurrentPage('protocol')} className="mt-[16px] bg-transparent border border-border text-text p-[12px_28px] font-bebas text-[17px] tracking-[0.1em] cursor-none transition-all hover:border-accent hover:text-accent">
            INICIAR PRIMEIRO PROJETO
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-[2px] mt-[48px]">
            {history.map(item => (
              <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-surface border border-border p-[22px_26px] grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[22px] items-start cursor-none transition-colors hover:border-accent group">
                <div>
                  <div className="font-bebas text-[19px] tracking-[0.05em] text-text mb-[6px]">{item.nome}</div>
                  <div className="flex gap-[12px] flex-wrap items-center">
                    {item.canal && <span className="text-[10px] text-accent3 bg-accent3/10 p-[2px_7px] tracking-[0.08em] uppercase">{item.canal}</span>}
                    {item.objetivo && <span className="text-[10px] text-accent3 bg-accent3/10 p-[2px_7px] tracking-[0.08em] uppercase">{item.objetivo}</span>}
                    <span className="text-[10px] text-muted">{item.date}</span>
                  </div>
                  <div className="text-[11px] text-muted mt-[7px] leading-[1.7] max-w-[560px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.preview}...
                  </div>
                </div>
                <div className="flex gap-[7px] shrink-0">
                  <button onClick={(e) => deleteHist(item.id, e)} className="bg-transparent border border-border text-muted p-[6px_12px] text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors font-mono hover:border-accent2 hover:text-accent2">✕</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={clearHistory} className="mt-[20px] bg-transparent border border-border text-muted p-[8px_18px] text-[11px] tracking-[0.1em] uppercase cursor-none transition-colors font-mono hover:border-accent2 hover:text-accent2">
            LIMPAR HISTÓRICO
          </button>
        </>
      )}

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-[#0a0a08e6] z-[500] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div className="bg-surface border border-border w-[92%] max-w-[740px] max-h-[88vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-[18px_26px] border-b border-border flex justify-between items-center">
              <div className="font-bebas text-[20px] tracking-[0.06em]">{selectedItem.nome}</div>
              <button onClick={() => setSelectedItem(null)} className="bg-transparent border-none text-muted text-[22px] cursor-none transition-colors font-mono p-0 hover:text-accent2">✕</button>
            </div>
            <div className="p-[26px] overflow-y-auto flex-1">
              <div className="manifest-text" dangerouslySetInnerHTML={formatText(selectedItem.manifest)} />
            </div>
            <div className="p-[14px_26px] border-t border-border flex justify-end gap-[8px]">
              <button onClick={() => { navigator.clipboard.writeText(selectedItem.manifest); notify('success', 'Copiado!'); }} className="bg-transparent border border-border text-muted p-[6px_12px] font-mono text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors hover:border-accent hover:text-accent">COPIAR CONTEÚDO</button>
              <button onClick={() => setSelectedItem(null)} className="bg-transparent border border-border text-muted p-[6px_12px] font-mono text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors hover:border-accent2 hover:text-accent2">FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
