import React, { useEffect, useState } from 'react';
import { useNotification } from '../components/NotificationProvider';

export default function DesignSystem() {
  const { notify } = useNotification();
  const [gridCols, setGridCols] = useState(12);

  useEffect(() => {
    const handleResize = () => setGridCols(window.innerWidth < 768 ? 4 : 12);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    notify('success', `Copiado: ${hex}`);
  };

  return (
    <div className="p-6 md:p-[48px] animate-in fade-in duration-500">
      <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Etapa 02 — Definição das Raízes</div>
      <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] mb-[32px]">MINI DESIGN SYSTEM</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mb-[2px]">
        {/* Typography */}
        <div className="bg-surface border border-border p-[28px]">
          <div className="text-[10px] tracking-[0.2em] uppercase text-accent3 mb-[14px] pb-[10px] border-b border-border">2.1 — Escala Tipográfica</div>
          <div className="font-bebas text-[20px] tracking-[0.06em] text-text mb-[18px]">TIPOGRAFIA</div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[9px] tracking-[0.15em] uppercase text-muted p-[6px_8px] border-b border-border text-left font-normal">Nível</th>
                <th className="text-[9px] tracking-[0.15em] uppercase text-muted p-[6px_8px] border-b border-border text-left font-normal">Família</th>
                <th className="text-[9px] tracking-[0.15em] uppercase text-muted p-[6px_8px] border-b border-border text-left font-normal">Peso</th>
                <th className="text-[9px] tracking-[0.15em] uppercase text-muted p-[6px_8px] border-b border-border text-left font-normal">Size</th>
                <th className="text-[9px] tracking-[0.15em] uppercase text-muted p-[6px_8px] border-b border-border text-left font-normal">Leading</th>
              </tr>
            </thead>
            <tbody>
              {[
                { level: 'H1', family: 'Bebas Neue', weight: '400', size: '72px', leading: '0.9', style: { fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', letterSpacing: '0.04em' } },
                { level: 'H2', family: 'Fraunces', weight: '300', size: '40px', leading: '1.1', style: { fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '13px' } },
                { level: 'H3', family: 'Bebas Neue', weight: '400', size: '24px', leading: '1.0', style: { fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '0.04em' } },
                { level: 'Body', family: 'DM Mono', weight: '300', size: '13px', leading: '1.7', style: {} },
                { level: 'Cap', family: 'DM Mono', weight: '300', size: '11px', leading: '1.6', style: {} },
                { level: 'CTA', family: 'Bebas Neue', weight: '400', size: '17px', leading: '1.0', style: { fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em' } }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-[7px_8px] border-b border-border2 text-[11px] text-accent font-medium">{row.level}</td>
                  <td className="p-[7px_8px] border-b border-border2 text-[11px]"><span style={row.style}>{row.family}</span></td>
                  <td className="p-[7px_8px] border-b border-border2 text-[11px]">{row.weight}</td>
                  <td className="p-[7px_8px] border-b border-border2 text-[11px]">{row.size}</td>
                  <td className="p-[7px_8px] border-b border-border2 text-[11px]">{row.leading}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-[18px] pt-[14px] border-t border-border">
            <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[10px]">Preview</div>
            <div className="font-bebas text-[32px] leading-none text-text">TÍTULO PRINCIPAL</div>
            <div className="font-fraunces italic text-[16px] text-muted font-light mt-[5px]">Subtítulo com Fraunces Italic</div>
            <div className="text-[11px] text-muted mt-[7px] leading-[1.7]">Texto corrido em DM Mono para máxima legibilidade técnica e clareza na comunicação.</div>
          </div>
        </div>

        {/* Palette */}
        <div className="bg-surface border border-border p-[28px]">
          <div className="text-[10px] tracking-[0.2em] uppercase text-accent3 mb-[14px] pb-[10px] border-b border-border">2.2 — Paleta Cromática Técnica</div>
          <div className="font-bebas text-[20px] tracking-[0.06em] text-text mb-[18px]">PALETA</div>
          <div className="grid grid-cols-2 gap-[8px]">
            {[
              { bg: '#0a0a08', border: '#2a2a26', wcag: 'AA', wcagBg: 'rgba(200,240,96,.15)', wcagColor: 'var(--color-accent)', name: 'Background', nameColor: '#6b6960', vals: '#0A0A08\nRGB 10,10,8', valsColor: '#6b6960' },
              { bg: '#c8f060', border: 'transparent', wcag: 'AAA', wcagBg: 'rgba(0,0,0,.15)', wcagColor: '#0a0a08', name: 'Primary / CTA', nameColor: '#0a0a08', vals: '#C8F060\nRGB 200,240,96', valsColor: 'rgba(0,0,0,.6)' },
              { bg: '#ff5533', border: 'transparent', wcag: 'AA', wcagBg: 'rgba(0,0,0,.2)', wcagColor: '#fff', name: 'Alert', nameColor: '#fff', vals: '#FF5533\nRGB 255,85,51', valsColor: 'rgba(255,255,255,.7)' },
              { bg: '#4af0c8', border: 'transparent', wcag: 'AAA', wcagBg: 'rgba(0,0,0,.15)', wcagColor: '#0a0a08', name: 'Tertiary', nameColor: '#0a0a08', vals: '#4AF0C8\nRGB 74,240,200', valsColor: 'rgba(0,0,0,.5)' },
              { bg: '#e8e6df', border: 'transparent', wcag: 'AAA', wcagBg: 'rgba(0,0,0,.15)', wcagColor: '#0a0a08', name: 'Text Primary', nameColor: '#0a0a08', vals: '#E8E6DF\nRGB 232,230,223', valsColor: 'rgba(0,0,0,.5)' },
              { bg: '#6b6960', border: '#2a2a26', wcag: 'AA', wcagBg: 'rgba(200,240,96,.15)', wcagColor: 'var(--color-accent)', name: 'Muted', nameColor: '#e8e6df', vals: '#6B6960\nRGB 107,105,96', valsColor: 'rgba(255,255,255,.6)' },
              { bg: '#111110', border: '#2a2a26', wcag: 'AA', wcagBg: 'rgba(200,240,96,.15)', wcagColor: 'var(--color-accent)', name: 'Surface', nameColor: '#6b6960', vals: '#111110\nRGB 17,17,16', valsColor: '#6b6960' },
              { bg: '#2a2a26', border: '#3a3a36', wcag: 'A', wcagBg: 'rgba(200,240,96,.15)', wcagColor: 'var(--color-accent)', name: 'Border', nameColor: '#e8e6df', vals: '#2A2A26\nRGB 42,42,38', valsColor: 'rgba(255,255,255,.5)' }
            ].map((c, i) => (
              <div key={i} onClick={() => copyColor(c.vals.split('\n')[0])} className="aspect-[3/2] rounded-[2px] p-[10px] flex flex-col justify-end relative overflow-hidden cursor-none transition-transform duration-200 hover:scale-[1.03]" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <span className="absolute top-[7px] right-[7px] text-[8px] p-[2px_5px] tracking-[0.08em] uppercase" style={{ background: c.wcagBg, color: c.wcagColor }}>{c.wcag}</span>
                <div className="text-[10px] font-medium tracking-[0.06em] uppercase" style={{ color: c.nameColor }}>{c.name}</div>
                <div className="text-[9px] opacity-70 leading-[1.8] font-mono whitespace-pre-line" style={{ color: c.valsColor }}>{c.vals}</div>
              </div>
            ))}
          </div>
          <div className="mt-[10px] text-[10px] text-muted">↑ Clique para copiar o HEX</div>
        </div>

        {/* Grid & Spacing */}
        <div className="bg-surface border border-border p-[28px]">
          <div className="text-[10px] tracking-[0.2em] uppercase text-accent3 mb-[14px] pb-[10px] border-b border-border">2.3 — Grid & Espaçamento</div>
          <div className="font-bebas text-[20px] tracking-[0.06em] text-text mb-[18px]">GRID</div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[6px]">{gridCols} Colunas — Preview</div>
          
          <div className="relative h-[160px] bg-bg border border-border overflow-hidden flex px-[20px] gap-[8px]">
            {Array.from({ length: gridCols }).map((_, i) => (
              <div key={i} className="flex-1 bg-accent/5 border-x border-accent/10 h-full" />
            ))}
          </div>
          
          <div className="mt-[7px] text-[10px] text-muted leading-[1.9]">
            <span className="text-text">Colunas:</span> {gridCols} &nbsp;|&nbsp; <span className="text-text">Calhas:</span> 24px &nbsp;|&nbsp; <span className="text-text">Margens:</span> 48px<br/>
            <span className="text-text">Base:</span> 8px &nbsp;|&nbsp; <span className="text-text">Baseline:</span> 8px vertical rhythm
          </div>
          
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mt-[18px] mb-[6px]">Escala de Espaçamento</div>
          <div className="flex items-end gap-[8px] flex-wrap py-[12px]">
            {[4, 8, 16, 24, 32, 48, 64].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-[4px]">
                <div className="bg-accent" style={{ width: s, height: s }} />
                <div className="text-[9px] text-muted text-center">{s}</div>
              </div>
            ))}
          </div>
          
          <div className="text-[10px] tracking-[0.25em] uppercase text-accent mt-[18px] mb-[8px]">Tokens de Estilo</div>
          <div className="grid grid-cols-2 gap-[8px]">
            <div className="bg-bg border border-border p-[10px_12px]">
              <div className="text-[10px] text-accent tracking-[0.1em] uppercase mb-[3px]">Border Radius</div>
              <div className="text-[11px] text-text">0 / 2 / 4 / 8px</div>
              <div className="h-[26px] mt-[6px] border border-border flex items-center justify-center text-[10px] text-muted rounded-[4px]">4px default</div>
            </div>
            <div className="bg-bg border border-border p-[10px_12px]">
              <div className="text-[10px] text-accent tracking-[0.1em] uppercase mb-[3px]">Sombra</div>
              <div className="text-[11px] text-text">0 4px 16px rgba(0,0,0,.4)</div>
              <div className="h-[26px] mt-[6px] border border-border flex items-center justify-center text-[10px] text-muted shadow-[0_4px_16px_rgba(0,0,0,0.5)]">preview</div>
            </div>
            <div className="bg-bg border border-border p-[10px_12px]">
              <div className="text-[10px] text-accent tracking-[0.1em] uppercase mb-[3px]">Opacidades</div>
              <div className="text-[11px] text-text">.04 / .08 / .4 / 1</div>
              <div className="flex gap-[4px] mt-[7px]">
                <div className="w-[18px] h-[18px] bg-accent opacity-[0.04] border border-border" />
                <div className="w-[18px] h-[18px] bg-accent opacity-[0.08] border border-border" />
                <div className="w-[18px] h-[18px] bg-accent opacity-40" />
                <div className="w-[18px] h-[18px] bg-accent" />
              </div>
            </div>
            <div className="bg-bg border border-border p-[10px_12px]">
              <div className="text-[10px] text-accent tracking-[0.1em] uppercase mb-[3px]">Iconografia</div>
              <div className="text-[11px] text-text">Outline / Monoline</div>
              <div className="h-[26px] mt-[6px] border border-border flex items-center justify-center text-[10px] text-muted">⬛ ⬡ ▲ ◈</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
