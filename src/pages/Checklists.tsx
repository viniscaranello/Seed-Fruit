import React, { useState, useEffect } from 'react';

const clData = [
  { title: 'Briefing Gate', color: 'var(--color-accent)', items: ['Objetivo primário definido', 'Público-alvo identificado', 'Canal de veiculação especificado', 'Restrições de identidade visual documentadas', 'Formato e dimensões confirmados', 'Prazo e uso definidos', 'Tom de voz estabelecido', 'KPIs implícitos mapeados'] },
  { title: 'Análise Visual', color: 'var(--color-accent3)', items: ['Composição e hierarquia analisadas', 'Paleta cromática identificada', 'Temperatura de cor avaliada', 'Semântica visual documentada', 'Áreas de respiro mapeadas', 'Safe zones para texto definidas', 'Compatibilidade de sobreposição verificada'] },
  { title: 'Design System', color: 'var(--color-accent)', items: ['Escala tipográfica definida (H1→CTA)', 'Paleta com HEX/RGB/CMYK', 'Contraste WCAG verificado (AA mínimo)', 'Grid de colunas especificado', 'Unidade base de espaçamento (8px)', 'Tokens de estilo documentados', 'Border-radius e sombras definidos', 'Diretrizes de iconografia'] },
  { title: 'Princípios Gestalt', color: 'var(--color-accent2)', items: ['Contraste suficiente (texto vs fundo)', 'Hierarquia clara em 3 segundos', 'White space intencional', 'Alinhamento consistente ao grid', 'Proximidade entre elementos relacionados', 'Continuidade no fluxo de leitura', 'Figura-fundo bem definidos', 'Consistência com Design System'] },
  { title: 'Decisões Documentadas', color: 'var(--color-accent3)', items: ['Mínimo 2 opções rejeitadas documentadas', 'Justificativa funcional para cada decisão', 'Fluxo de leitura especificado (F/Z/radial)', 'Blend modes documentados', 'Hierarquia visual enumerada', 'Conceito vs Produção separados'] },
  { title: 'Entrega Final', color: 'var(--color-accent)', items: ['Arquivo nomeado por convenção', 'Perfil de cor correto para destino', 'Fontes resolvidas (outlines/embedded)', 'Imagens na resolução correta', 'Versão low-res para aprovação', 'Variações de formato entregues', 'Sangria/bleed configurado (print)', 'Overprint verificado'] }
];

export default function Checklists() {
  const [states, setStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sf_checks') || '{}');
      setStates(saved);
    } catch {}
  }, []);

  const toggleCheck = (ci: number, ii: number) => {
    const key = `${ci}-${ii}`;
    const newStates = { ...states, [key]: !states[key] };
    setStates(newStates);
    try { localStorage.setItem('sf_checks', JSON.stringify(newStates)); } catch {}
  };

  const resetCard = (ci: number) => {
    const newStates = { ...states };
    clData[ci].items.forEach((_, ii) => {
      newStates[`${ci}-${ii}`] = false;
    });
    setStates(newStates);
    try { localStorage.setItem('sf_checks', JSON.stringify(newStates)); } catch {}
  };

  let total = 0;
  let done = 0;
  clData.forEach((card, ci) => {
    total += card.items.length;
    card.items.forEach((_, ii) => {
      if (states[`${ci}-${ii}`]) done++;
    });
  });
  const pending = total - done;
  const globalPct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="p-6 md:p-[48px] animate-in fade-in duration-500">
      <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Quality Gate</div>
      <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] mb-[32px]">CHECKLISTS DE ENTREGA</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mt-[48px]">
        {clData.map((card, ci) => {
          const cardDone = card.items.filter((_, ii) => states[`${ci}-${ii}`]).length;
          const cardPct = card.items.length ? Math.round((cardDone / card.items.length) * 100) : 0;
          
          return (
            <div key={ci} className="bg-surface border border-border p-[28px]">
              <div className="font-bebas text-[19px] tracking-[0.08em] mb-[4px]" style={{ color: card.color }}>{card.title}</div>
              <div className="text-[10px] text-muted tracking-[0.1em] uppercase mb-[18px] pb-[14px] border-b border-border">Quality Gate {ci + 1}</div>
              
              <div className="flex flex-col">
                {card.items.map((item, ii) => {
                  const isChecked = states[`${ci}-${ii}`];
                  return (
                    <div key={ii} onClick={() => toggleCheck(ci, ii)} className={`flex items-start gap-[10px] py-[8px] border-b border-white/5 cursor-none transition-colors group ${isChecked ? 'text-text' : 'text-muted hover:text-text'}`}>
                      <div className={`w-[15px] h-[15px] border shrink-0 mt-[3px] relative transition-all duration-200 group-hover:border-accent ${isChecked ? 'bg-accent border-accent' : 'border-border'}`}>
                        {isChecked && <div className="absolute inset-0 flex items-center justify-center text-[9px] text-bg font-bold">✓</div>}
                      </div>
                      <span className="text-[12px] leading-[1.5]">{item}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-[18px] pt-[14px] border-t border-border">
                <div className="text-[10px] text-muted flex justify-between">
                  <span>{cardDone} / {card.items.length}</span>
                </div>
                <div className="h-[3px] bg-border mt-[5px] overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-400 ease-out" style={{ width: `${cardPct}%` }} />
                </div>
              </div>
              
              <button onClick={() => resetCard(ci)} className="mt-[10px] bg-transparent border border-border text-muted p-[5px_12px] text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors font-mono w-full hover:border-accent2 hover:text-accent2">RESETAR</button>
            </div>
          );
        })}
      </div>
      
      <div className="bg-surface border border-border p-[22px_28px] mt-[2px] flex gap-[40px] items-center flex-wrap">
        <div className="flex flex-col gap-[4px]">
          <div className="font-bebas text-[36px] leading-none text-accent">{total}</div>
          <div className="text-[10px] text-muted tracking-[0.1em] uppercase">Total de Itens</div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="font-bebas text-[36px] leading-none text-accent3">{done}</div>
          <div className="text-[10px] text-muted tracking-[0.1em] uppercase">Concluídos</div>
        </div>
        <div className="flex flex-col gap-[4px]">
          <div className="font-bebas text-[36px] leading-none text-accent2">{pending}</div>
          <div className="text-[10px] text-muted tracking-[0.1em] uppercase">Pendentes</div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[10px] text-muted tracking-[0.1em] uppercase mb-[6px]">Progresso Global</div>
          <div className="h-[4px] bg-border mt-[6px]">
            <div className="h-[4px] bg-accent transition-all duration-500 ease-out" style={{ width: `${globalPct}%` }} />
          </div>
          <div className="text-[11px] text-muted mt-[5px]">{globalPct}% completo</div>
        </div>
      </div>
    </div>
  );
}
