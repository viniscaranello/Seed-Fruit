import React from 'react';

export default function Manifest() {
  return (
    <div className="p-6 md:p-[48px] animate-in fade-in duration-500">
      <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Etapa 04 — Entrega dos Frutos</div>
      <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] mb-[8px]">EXPORT MANIFEST</h2>
      <p className="text-muted text-[12px] mb-0">Especificações técnicas completas para cada formato de entrega.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-[48px]">
        {[
          {
            fmt: 'PNG', sub: 'Raster com Alpha / Web & Print',
            specs: [
              { k: 'Web Resolution', v: '72 dpi' },
              { k: 'Apresentação', v: '150 dpi' },
              { k: 'Print-Ready', v: '300 dpi' },
              { k: 'Espaço de Cor', v: 'sRGB IEC61966-2.1', tag: true },
              { k: 'Canal Alpha', v: 'Conforme necessidade' },
              { k: 'Compressão', v: 'Nível 6–8 (equilibrado)' },
              { k: 'Entrega', v: '@1x e @2x (retina)' }
            ]
          },
          {
            fmt: 'JPG', sub: 'Raster Comprimido / Fotografia',
            specs: [
              { k: 'Web Qualidade', v: '60–70%' },
              { k: 'Arquivo', v: '85–95%' },
              { k: 'Perfil', v: 'sRGB embutido', tag: true },
              { k: 'Subsampling Web', v: '4:2:0' },
              { k: 'Subsampling Print', v: '4:4:4' },
              { k: 'Progressivo', v: 'Sim (web) / Não (print)' },
              { k: 'Metadados EXIF', v: 'Remover para web' }
            ]
          },
          {
            fmt: 'SVG', sub: 'Vetor Escalável / Web & Branding',
            specs: [
              { k: 'Fonts', v: 'Convertidas em outlines' },
              { k: 'ViewBox', v: 'Definido para responsividade' },
              { k: 'IDs', v: 'Semânticos, sem prefixos AI' },
              { k: 'Otimização', v: 'SVGO (remover metadados)', tag: true },
              { k: 'Grupos', v: 'Nomeados por camada funcional' },
              { k: 'Classes CSS', v: 'Limpas para uso em código' }
            ]
          },
          {
            fmt: 'EPS / AI', sub: 'Vetor Editável / Master File',
            specs: [
              { k: 'Compatibilidade', v: 'CS6 / CC' },
              { k: 'Fontes', v: 'Embedadas ou em curvas' },
              { k: 'Imagens', v: 'Embutidas ou linkadas' },
              { k: 'Cores Spot', v: 'Declaradas se Pantone' }
            ],
            layers: [
              { n: '5', name: 'Overlays / FX', desc: '— efeitos, transparências' },
              { n: '4', name: 'Typography', desc: '— todos os textos' },
              { n: '3', name: 'Graphic Elements', desc: '— vetores, formas' },
              { n: '2', name: 'Photography / Raster', desc: '— imagens bitmap' },
              { n: '1', name: 'Background', desc: '— fundo base' }
            ]
          }
        ].map((c, i) => (
          <div key={i} className="bg-surface border border-border p-[32px] relative overflow-hidden transition-colors duration-300 hover:border-accent group cursor-none">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent scale-y-0 origin-top transition-transform duration-400 ease-out group-hover:scale-y-100" />
            <div className="font-bebas text-[38px] tracking-[0.05em] text-text mb-[6px]">{c.fmt}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-[22px]">{c.sub}</div>
            <div className="flex flex-col gap-0">
              {c.specs.map((s, j) => (
                <div key={j} className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]">
                  <span className="text-muted">{s.k}</span>
                  <span className={s.tag ? 'text-accent3' : 'text-text'}>{s.v}</span>
                </div>
              ))}
            </div>
            {c.layers && (
              <>
                <div className="text-[10px] tracking-[0.25em] uppercase text-accent mt-[18px] mb-[8px]">Estrutura de Camadas</div>
                <div className="flex flex-col gap-[3px] mt-[14px]">
                  {c.layers.map((l, j) => (
                    <div key={j} className="p-[7px_12px] border border-border text-[11px] flex items-center gap-[10px] transition-all duration-200 hover:border-accent hover:translate-x-[6px]">
                      <span className="font-bebas text-[16px] text-muted w-[18px]">{l.n}</span>
                      <span className="text-text">{l.name}</span>
                      <span className="text-muted text-[10px]">{l.desc}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
        
        <div className="col-span-1 md:col-span-2 bg-surface border border-border p-[32px] relative overflow-hidden transition-colors duration-300 hover:border-accent group cursor-none">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent scale-y-0 origin-top transition-transform duration-400 ease-out group-hover:scale-y-100" />
          <div className="font-bebas text-[38px] tracking-[0.05em] text-text mb-[6px]">PDF / X-4</div>
          <div className="text-[10px] tracking-[0.15em] uppercase text-muted mb-[22px]">Impressão Profissional / Padrão Internacional</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Perfil Offset EU</span><span className="text-accent3">Coated FOGRA39</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Perfil Offset US</span><span className="text-accent3">GRACoL 2006</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Digital / Screen</span><span className="text-accent3">sRGB</span></div>
            </div>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Marcas de Corte</span><span className="text-text">Sim</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Sangria (Bleed)</span><span className="text-text">3mm (padrão Europa)</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Overprint</span><span className="text-text">Verificar preto 100% K</span></div>
            </div>
            <div className="flex flex-col gap-0">
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Resolução Rasters</span><span className="text-text">Mínimo 300 dpi</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Fontes</span><span className="text-text">Subset embedding</span></div>
              <div className="grid grid-cols-[140px_1fr] border-b border-border2 py-[7px] text-[11px]"><span className="text-muted">Padrão</span><span className="text-accent3">PDF/X-4</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
