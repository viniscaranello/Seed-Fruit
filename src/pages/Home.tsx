import React from 'react';
import { Page } from '../App';

export default function Home({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) {
  return (
    <div className="animate-in fade-in duration-500">
      <section className="min-h-[calc(100vh-56px)] flex flex-col justify-end px-5 md:px-[48px] pb-[64px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(200,240,96,0.06)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(74,240,200,0.04)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,240,96,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,240,96,0.03)_1px,transparent_1px)] bg-[size:80px_80px] animate-gdrift" />
        
        <div className="text-[11px] text-muted tracking-[0.2em] uppercase mb-[24px] flex items-center gap-[12px] z-10">
          <div className="w-[32px] h-[1px] bg-muted" />
          Principal DesignOps Engine / Art Direction System
        </div>
        
        <h1 className="font-bebas text-[clamp(80px,12vw,170px)] leading-[0.9] text-text relative z-10 reveal">
          SEED<span className="text-accent2 inline-block animate-arr">→</span><br />
          <span className="text-accent">FRUIT</span>
        </h1>
        
        <p className="font-fraunces italic text-[clamp(15px,2vw,21px)] text-muted mt-[32px] max-w-[480px] font-light z-10 reveal">
          Transformando assets brutos + briefing em peças finais com metadados de exportação completos.
        </p>
        
        <div className="flex gap-[16px] mt-[40px] flex-wrap z-10 reveal">
          <button onClick={() => setCurrentPage('protocol')} className="bg-accent text-bg border-none px-[28px] py-[12px] font-bebas text-[17px] tracking-[0.1em] cursor-none transition-all hover:bg-text hover:translate-x-1">
            INICIAR BRIEFING →
          </button>
          <button onClick={() => setCurrentPage('design-system')} className="bg-transparent text-text border border-border px-[28px] py-[12px] font-bebas text-[17px] tracking-[0.1em] cursor-none transition-all hover:border-accent hover:text-accent">
            VER DESIGN SYSTEM
          </button>
        </div>
        
        <div className="absolute right-[48px] bottom-[64px] text-right text-[11px] text-muted leading-[2] hidden md:block z-10">
          <div>Metodologia: Bottom-Up</div>
          <div>Atomic → Composite</div>
          <div>Audit-First Thinking</div>
        </div>
        
        <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] text-[10px] text-muted tracking-[0.15em] uppercase z-10">
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-accent to-transparent animate-sline" />
          SCROLL
        </div>
      </section>

      <div className="bg-accent py-[10px] overflow-hidden whitespace-nowrap">
        <span className="inline-block animate-tick font-bebas text-[14px] tracking-[0.1em] text-bg">
          DESIGN GRÁFICO ✦ ART DIRECTION ✦ EXPORT MANIFEST ✦ TYPOGRAPHIC SCALE ✦ COLOR TOKENS ✦ GRID SYSTEM ✦ GESTALT PRINCIPLES ✦ WCAG COMPLIANCE ✦ PDF/X-4 ✦ CMYK ✦ RGB ✦ DESIGN GRÁFICO ✦ ART DIRECTION ✦ EXPORT MANIFEST ✦ TYPOGRAPHIC SCALE ✦ COLOR TOKENS ✦ GRID SYSTEM ✦ GESTALT PRINCIPLES ✦ WCAG COMPLIANCE ✦ PDF/X-4 ✦ CMYK ✦ RGB ✦ 
        </span>
      </div>

      <div className="bg-surface border-y border-border py-[80px] px-6 md:px-[48px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] mb-[64px] items-end">
          <div>
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Execution Protocol</div>
            <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] reveal">5 ETAPAS DE<br/>EXECUÇÃO</h2>
          </div>
          <p className="font-fraunces text-[17px] font-light text-muted leading-[1.9] reveal">
            Cada decisão visual precisa de justificativa funcional. Não geramos estética por estética — resolvemos problemas de comunicação com design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-[2px]">
          {[
            { tag: 'Gate', num: '00', name: 'Triagem da Semente', body: 'Briefing Validation Gate. Objetivo primário, público-alvo, canal, restrições, formato. Briefing incompleto = pausa obrigatória.', page: 'protocol' },
            { tag: 'Input', num: '01', name: 'Análise da Semente', body: 'Análise de assets visuais, paleta cromática, semântica visual, pontos de tensão e decomposição do briefing.', page: 'protocol' },
            { tag: 'System', num: '02', name: 'Definição das Raízes', body: 'Mini Design System: escala tipográfica, paleta técnica, grid, espaçamento e tokens de estilo.', page: 'design-system' },
            { tag: 'Logic', num: '03', name: 'Construção do Caule', body: 'Layout logic, mapeamento composicional, instruções de montagem técnica e decisões rejeitadas documentadas.', page: 'protocol' },
            { tag: 'Output', num: '04', name: 'Entrega dos Frutos', body: 'Export Manifest completo: PNG, JPG, SVG, EPS/AI, PDF — metadados, perfis de cor e checklists.', page: 'manifest' }
          ].map((step, i) => (
            <div key={i} onClick={() => setCurrentPage(step.page as Page)} className="bg-bg p-[28px_20px] border border-border relative overflow-hidden transition-all duration-300 hover:border-accent hover:-translate-y-1 cursor-none group reveal">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute top-[14px] right-[14px] text-[9px] text-accent2 tracking-[0.15em] uppercase">{step.tag}</div>
              <div className="font-bebas text-[56px] text-border leading-none mb-[12px] transition-colors duration-300 group-hover:text-accent">{step.num}</div>
              <div className="font-bebas text-[17px] tracking-[0.06em] text-text mb-[10px]">{step.name}</div>
              <p className="text-[11px] text-muted leading-[1.8]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-[80px] px-6 md:px-[48px] relative overflow-hidden">
        <div className="absolute -top-[20px] -right-[40px] font-bebas text-[280px] text-white/[0.015] pointer-events-none leading-none">RULES</div>
        <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Golden Rules</div>
        <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] reveal">7 REGRAS DE OURO</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-[56px]">
          {[
            { num: '01', title: 'Briefing Incompleto = Pausa', body: 'Liste as perguntas, não assuma respostas. Sem contexto suficiente, nenhuma execução começa.' },
            { num: '02', title: 'Toda Decisão Tem Justificativa', body: '"Ficou bonito" não é justificativa. Cada escolha visual resolve um problema de comunicação.' },
            { num: '03', title: 'Priorize a Exportabilidade', body: 'Descreva estruturas como se fosse entregar para um desenvolvedor ou gráfica sem contexto adicional.' },
            { num: '04', title: 'Terminologia Técnica Precisa', body: 'Kerning, leading, tracking, white space, visual weight, bleed, trap, overprint, moiré, PPI vs DPI.' },
            { num: '05', title: 'Documente o Rejeitado', body: 'Decisões de design são tão importantes quanto os resultados. O que foi descartado e por quê.' },
            { num: '06', title: 'Conceito ≠ Produção', body: 'Se o output for referência/conceito, sinalize claramente. Não misture com especificações de arquivo final.' },
            { num: '07', title: 'Acessibilidade Não é Opcional', body: 'Verifique contraste WCAG e legibilidade em todos os formatos. AA mínimo, AAA quando possível.' }
          ].map((rule, i) => (
            <div key={i} className="grid grid-cols-[48px_1fr] gap-[20px] py-[28px] border-b border-border items-start transition-colors duration-300 hover:border-accent reveal">
              <div className="font-bebas text-[28px] text-accent opacity-40">{rule.num}</div>
              <div>
                <div className="font-fraunces text-[15px] font-medium text-text mb-[6px]">{rule.title}</div>
                <p className="text-[11px] text-muted leading-[1.8]">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
