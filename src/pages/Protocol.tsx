import React, { useState, useEffect, useRef } from 'react';
import { useNotification } from '../components/NotificationProvider';
import { generateManifestStream } from '../services/geminiService';
import { Field, SelectField } from '../components/Field';

export default function Protocol({ setStatus }: { setStatus: (s: string) => void }) {
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState('briefing');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manifest, setManifest] = useState('');
  const [manifestTitle, setManifestTitle] = useState('Design Manifest');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nome: '', objetivo: '', publico: '', canal: '', formato: '', tom: '', idVisual: '', prazo: '', descricao: '',
    estilo: '', marcas: '', movimentos: '', coresProib: '', fontesObrig: '', fontesProib: '', restricExtra: ''
  });

  const [assets, setAssets] = useState<{name: string, type: string}[]>([]);
  const [refs, setRefs] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<Record<string, boolean>>({
    r1: false, r2: false, r3: false, r4: false, r5: false, r6: false, r7: false, r8: false
  });
  const refInputRef = useRef<HTMLInputElement>(null);

  const reqFields = ['nome', 'objetivo', 'publico', 'canal'];
  const optFields = ['formato', 'tom', 'idVisual', 'prazo', 'descricao'];

  useEffect(() => {
    let filled = 0;
    reqFields.forEach(k => { if (formData[k as keyof typeof formData].trim()) filled += 2; });
    optFields.forEach(k => { if (formData[k as keyof typeof formData].trim()) filled += 1; });
    const max = reqFields.length * 2 + optFields.length;
    setProgress(Math.min(100, Math.round((filled / max) * 100)));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as File[];
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files) as File[]);
    }
  };

  const addFiles = (files: File[]) => {
    const newAssets = files.map(f => ({ name: f.name, type: f.type || 'unknown' }));
    setAssets(prev => {
      const unique = newAssets.filter(na => !prev.find(pa => pa.name === na.name));
      if (unique.length > 0) notify('success', `${unique.length} asset(s) adicionado(s)`);
      return [...prev, ...unique];
    });
  };

  const addRef = () => {
    const val = refInputRef.current?.value.trim();
    if (val) {
      setRefs(prev => [...prev, val]);
      if (refInputRef.current) refInputRef.current.value = '';
    }
  };

  const processBriefing = async () => {
    if (progress < 25) {
      notify('error', 'Preencha pelo menos os campos obrigatórios (*)');
      return;
    }
    setIsProcessing(true);
    setStatus('Processando...');
    setManifest('');
    setError('');
    setManifestTitle(formData.nome || 'Design Manifest');

    const restrictionLabels: Record<string, string> = {
      r1: 'Sem imagens de pessoas / modelos',
      r2: 'Sem fotografia — apenas vetores',
      r3: 'Deve funcionar em P&B (grayscale)',
      r4: 'Acessibilidade WCAG AAA obrigatória',
      r5: 'Safe zones para impressão (3mm bleed)',
      r6: 'Versão dark e light mode necessária',
      r7: 'Responsivo / múltiplos formatos',
      r8: 'Sem gradientes (estética flat)'
    };

    const activeRestrictions = Object.keys(restrictions).filter(k => restrictions[k]).map(k => restrictionLabels[k]);

    const payload = {
      ...formData,
      restrictions: activeRestrictions,
      refs,
      assets: assets.map(a => a.name)
    };

    try {
      const fullText = await generateManifestStream(payload, (chunk) => {
        setManifest(chunk);
      });
      
      const history = JSON.parse(localStorage.getItem('sf_history') || '[]');
      history.unshift({
        id: Date.now(),
        date: new Date().toLocaleString('pt-BR'),
        nome: payload.nome || 'Sem título',
        canal: payload.canal,
        objetivo: payload.objetivo,
        manifest: fullText,
        preview: fullText.slice(0, 200)
      });
      localStorage.setItem('sf_history', JSON.stringify(history.slice(0, 50)));
      
      notify('success', 'Design Manifest gerado com sucesso!');
      setStatus('Manifest Pronto');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar');
      notify('error', 'Erro ao conectar com a API');
      setStatus('Erro');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseSections = (text: string) => {
    const sections = [];
    const patterns = [
      { tag: 'ETAPA 0', title: 'TRIAGEM DA SEMENTE', re: /etapa\s*0|triagem/i },
      { tag: 'ETAPA 1', title: 'ANÁLISE DA SEMENTE', re: /etapa\s*1|an[áa]lise da semente/i },
      { tag: 'ETAPA 2', title: 'DEFINIÇÃO DAS RAÍZES', re: /etapa\s*2|defini[çc][ãa]o das ra[íi]zes|mini design system/i },
      { tag: 'ETAPA 3', title: 'CONSTRUÇÃO DO CAULE', re: /etapa\s*3|constru[çc][ãa]o do caule/i },
      { tag: 'ETAPA 4', title: 'ENTREGA DOS FRUTOS', re: /etapa\s*4|entrega dos frutos|export manifest/i }
    ];
    let cur = null, body = [];
    for (const line of text.split('\n')) {
      const m = patterns.find(p => p.re.test(line) && line.length < 140);
      if (m) {
        if (cur) sections.push({ ...cur, body: body.join('\n').trim() });
        cur = { tag: m.tag, title: m.title };
        body = [];
      } else {
        body.push(line);
      }
    }
    if (cur) sections.push({ ...cur, body: body.join('\n').trim() });
    return sections.filter(s => s.body.length > 10);
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

  const sections = parseSections(manifest);

  return (
    <div className="p-6 md:p-[48px] animate-in fade-in duration-500">
      <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px]">Engine Principal</div>
      <h2 className="font-bebas text-[clamp(36px,5vw,68px)] text-text leading-none tracking-[0.02em] mb-[32px]">BRIEFING PROCESSOR</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-[2px] min-h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="bg-surface border border-border flex flex-col">
          <div className="p-[20px_24px] border-b border-border">
            <div className="font-bebas text-[20px] tracking-[0.06em] text-text mb-[4px]">Input Layer</div>
            <div className="text-[10px] text-muted tracking-[0.1em] uppercase">Preencha para execução completa</div>
          </div>
          
          <div className="flex border-b border-border">
            {[
              { id: 'briefing', label: 'Briefing' },
              { id: 'assets', label: 'Assets' },
              { id: 'refs', label: 'Refs' },
              { id: 'restrict', label: 'Restrições' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 p-[11px_6px] text-center text-[10px] tracking-[0.08em] uppercase cursor-none transition-all bg-transparent font-mono border-b-2 ${activeTab === t.id ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-text'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'briefing' && (
              <div className="p-[18px] flex flex-col gap-[12px]">
                <Field label="Nome do Projeto" req name="nome" value={formData.nome} onChange={handleChange} placeholder="ex: Campanha Verão 2025" />
                <SelectField label="Objetivo Primário" req name="objetivo" value={formData.objetivo} onChange={handleChange} options={['Informar / Educar', 'Converter / Vender', 'Engajar / Emocionar', 'Fortalecer Marca', 'Lançamento de Produto', 'Evento / Convite', 'Relatório / Institucional']} />
                <Field label="Público-Alvo" req name="publico" value={formData.publico} onChange={handleChange} placeholder="ex: Mulheres 25–40, classe B, urbanitas" />
                <SelectField label="Canal de Veiculação" req name="canal" value={formData.canal} onChange={handleChange} options={['Instagram Feed', 'Instagram Stories / Reels', 'LinkedIn', 'Facebook', 'TikTok', 'Site / Landing Page', 'E-mail Marketing', 'Impresso Offset', 'OOH / Outdoor', 'Apresentação / Pitch', 'Múltiplos Canais']} />
                <Field label="Formato / Dimensões" name="formato" value={formData.formato} onChange={handleChange} placeholder="ex: 1080×1080px, A4, 1920×1080px" />
                <SelectField label="Tom de Voz" name="tom" value={formData.tom} onChange={handleChange} options={['Formal / Corporativo', 'Informal / Descontraído', 'Técnico / Especialista', 'Emocional / Aspiracional', 'Urgente / Promocional', 'Minimalista / Clean', 'Arrojado / Disruptivo', 'Luxo / Premium']} />
                <SelectField label="Identidade Visual Existente?" name="idVisual" value={formData.idVisual} onChange={handleChange} options={['Sim — seguir rigorosamente', 'Sim — pode flexibilizar', 'Não — criar do zero', 'Parcial — apenas logo']} />
                <SelectField label="Prazo" name="prazo" value={formData.prazo} onChange={handleChange} options={['Urgente (hoje/amanhã)', 'Curto prazo (esta semana)', 'Médio prazo (2 semanas)', 'Planejado (1 mês+)', 'Conceito / Referência']} />
                <div className="flex flex-col gap-[5px]">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">Descrição Adicional</div>
                  <textarea name="descricao" value={formData.descricao} onChange={handleChange} className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent w-full resize-none min-h-[72px] leading-[1.6]" placeholder="Informações extras, contexto da marca, requisitos especiais..." rows={4} />
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="p-[18px] flex flex-col gap-[12px]">
                <div 
                  className="border-2 border-dashed border-border p-[28px] text-center cursor-none transition-all relative hover:border-accent hover:bg-accent/5"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <input type="file" multiple accept="image/*,.pdf,.ai,.eps,.svg" onChange={handleFileSelect} className="absolute inset-0 opacity-0 cursor-none w-full h-full" />
                  <span className="text-[28px] mb-[10px] block">⬆</span>
                  <div className="text-[12px] text-muted">Arraste arquivos ou clique para selecionar</div>
                  <div className="text-[10px] text-muted opacity-60 mt-[4px]">PNG, JPG, SVG, PDF, AI, EPS — máx. 20MB</div>
                </div>
                <div className="flex flex-col gap-[5px]">
                  {assets.map((a, i) => (
                    <div key={i} className="bg-bg border border-border p-[9px_12px] flex justify-between items-center text-[11px]">
                      <span className="text-text overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{a.name}</span>
                      <span className="text-[9px] text-accent3 tracking-[0.1em] uppercase">{a.type.split('/')[1] || 'file'}</span>
                      <button onClick={() => setAssets(prev => prev.filter((_, idx) => idx !== i))} className="bg-transparent border-none text-muted cursor-none text-[15px] px-[4px] font-mono hover:text-accent2 transition-colors">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'refs' && (
              <div className="p-[18px] flex flex-col gap-[12px]">
                <SelectField label="Estilo Visual" name="estilo" value={formData.estilo} onChange={handleChange} options={['Bauhaus / Construtivista', 'Swiss / Internacional', 'Art Deco / Geométrico', 'Brutalist / Raw', 'Minimalista / Clean', 'Maximalista / Expressivo', 'Retro / Vintage', 'Futurista / Tech', 'Editorial / Magazine', 'Streetwear / Urban', 'Luxo / Premium']} />
                <div className="flex flex-col gap-[5px]">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">URLs de Referência</div>
                  <div className="flex gap-[8px]">
                    <input ref={refInputRef} onKeyDown={e => e.key === 'Enter' && addRef()} type="url" placeholder="https://..." className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent flex-1" />
                    <button onClick={addRef} className="bg-accent text-bg border-none p-[8px_14px] font-bebas text-[14px] tracking-[0.08em] cursor-none whitespace-nowrap hover:bg-text transition-colors">+ ADD</button>
                  </div>
                </div>
                <div className="flex flex-col gap-[5px]">
                  {refs.map((r, i) => (
                    <div key={i} className="bg-bg border border-border p-[9px_12px] flex justify-between items-center text-[11px]">
                      <span className="text-accent3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[220px]">{r}</span>
                      <button onClick={() => setRefs(prev => prev.filter((_, idx) => idx !== i))} className="bg-transparent border-none text-muted cursor-none text-[15px] px-[4px] font-mono hover:text-accent2 transition-colors">✕</button>
                    </div>
                  ))}
                </div>
                <Field label="Marcas de Referência" name="marcas" value={formData.marcas} onChange={handleChange} placeholder="ex: Apple, Airbnb, Veja Magazine" />
                <div className="flex flex-col gap-[5px]">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">Movimentos Visuais</div>
                  <textarea name="movimentos" value={formData.movimentos} onChange={handleChange} className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent w-full resize-none min-h-[72px] leading-[1.6]" placeholder="Estilos, movimentos artísticos ou referências culturais..." rows={3} />
                </div>
              </div>
            )}

            {activeTab === 'restrict' && (
              <div className="p-[18px] flex flex-col gap-[12px]">
                <Field label="Cores Proibidas" name="coresProib" value={formData.coresProib} onChange={handleChange} placeholder="ex: Vermelho, #FF0000, tons quentes" />
                <Field label="Fontes Obrigatórias" name="fontesObrig" value={formData.fontesObrig} onChange={handleChange} placeholder="ex: Helvetica Neue, Garamond" />
                <Field label="Fontes Proibidas" name="fontesProib" value={formData.fontesProib} onChange={handleChange} placeholder="ex: Comic Sans, Impact" />
                <div className="text-[10px] tracking-[0.25em] uppercase text-accent mb-[8px] mt-[14px]">Restrições Gerais</div>
                <div className="flex flex-col gap-[6px]">
                  {[
                    { id: 'r1', label: 'Sem imagens de pessoas / modelos' },
                    { id: 'r2', label: 'Sem fotografia — apenas vetores' },
                    { id: 'r3', label: 'Deve funcionar em P&B (grayscale)' },
                    { id: 'r4', label: 'Acessibilidade WCAG AAA obrigatória' },
                    { id: 'r5', label: 'Safe zones para impressão (3mm bleed)' },
                    { id: 'r6', label: 'Versão dark e light mode necessária' },
                    { id: 'r7', label: 'Responsivo / múltiplos formatos' },
                    { id: 'r8', label: 'Sem gradientes (estética flat)' }
                  ].map(r => (
                    <label key={r.id} className={`flex items-center gap-[10px] p-[9px] border cursor-none transition-colors bg-bg ${restrictions[r.id] ? 'border-border2 text-text' : 'border-border text-muted hover:border-border2'}`}>
                      <input type="checkbox" checked={restrictions[r.id]} onChange={e => setRestrictions(prev => ({ ...prev, [r.id]: e.target.checked }))} className="accent-accent w-[14px] h-[14px] cursor-none" />
                      <span className="text-[11px] cursor-none">{r.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-[5px] mt-[12px]">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-accent3 flex justify-between items-center">Restrições Adicionais</div>
                  <textarea name="restricExtra" value={formData.restricExtra} onChange={handleChange} className="bg-bg border border-border text-text font-mono text-[12px] p-[9px_12px] outline-none transition-colors focus:border-accent w-full resize-none min-h-[72px] leading-[1.6]" placeholder="Outras restrições legais, regulatórias ou criativas..." rows={3} />
                </div>
              </div>
            )}
          </div>

          <div className="p-[14px_18px] border-t border-border flex flex-col gap-[8px]">
            <div className="text-[10px] text-muted flex justify-between">
              <span>Completude do Briefing</span>
              <span>{progress}%</span>
            </div>
            <div className="h-[3px] bg-border relative overflow-hidden">
              <div className="h-full bg-accent transition-all duration-400 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <button 
              onClick={processBriefing} 
              disabled={progress < 25 || isProcessing}
              className="bg-accent text-bg border-none p-[14px] font-bebas text-[17px] tracking-[0.1em] cursor-none transition-all w-full flex items-center justify-center gap-[10px] disabled:bg-border disabled:text-muted hover:not-disabled:bg-text"
            >
              {isProcessing && <span className="w-[16px] h-[16px] border-2 border-bg border-t-transparent rounded-full animate-spin-slow" />}
              <span className={isProcessing ? 'opacity-70' : ''}>{isProcessing ? 'PROCESSANDO...' : 'PROCESSAR BRIEFING →'}</span>
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="bg-bg border border-border flex flex-col">
          <div className="p-[18px_26px] border-b border-border flex justify-between items-center flex-wrap gap-[10px]">
            <div className="font-bebas text-[18px] tracking-[0.06em] text-text">{manifestTitle}</div>
            <div className="flex gap-[6px] flex-wrap">
              <button onClick={() => { navigator.clipboard.writeText(manifest); notify('success', 'Copiado!'); }} className="bg-transparent border border-border text-muted p-[6px_12px] font-mono text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors hover:border-accent hover:text-accent">COPIAR</button>
              <button onClick={() => {
                const blob = new Blob([manifest], {type: 'text/plain;charset=utf-8'});
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${manifestTitle.replace(/\s+/g, '_')}_manifest.txt`;
                a.click();
              }} className="bg-transparent border border-border text-muted p-[6px_12px] font-mono text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors hover:border-accent hover:text-accent">EXPORTAR .TXT</button>
              <button onClick={() => { setManifest(''); setManifestTitle('Design Manifest'); notify('info', 'Output limpo'); }} className="bg-transparent border border-border text-muted p-[6px_12px] font-mono text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors hover:border-accent2 hover:text-accent2">LIMPAR</button>
            </div>
          </div>
          
          <div className="flex-1 p-[26px] overflow-y-auto min-h-[500px]">
            {!manifest && !isProcessing && !error && (
              <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center gap-[16px]">
                <div className="text-[48px] opacity-30">🌱</div>
                <div className="font-fraunces italic text-[18px] text-muted font-light">Aguardando a semente...</div>
                <div className="text-[11px] text-muted opacity-60">Preencha o briefing e processe para gerar o Design Manifest completo.</div>
              </div>
            )}

            {isProcessing && !manifest && (
              <div className="flex flex-col items-center justify-center h-full min-h-[380px] text-center gap-[16px]">
                <div className="inline-block w-[8px] h-[14px] bg-accent animate-blink align-bottom ml-[2px]" />
                <div className="mt-[12px] text-[11px] text-muted">Gerando Design Manifest...</div>
              </div>
            )}

            {error && (
              <div className="p-[18px] bg-[#ff55330d] border border-[#ff553333] mb-[18px]">
                <div className="font-bebas text-[18px] tracking-[0.06em] text-accent2 mb-[10px]">⚠ Erro</div>
                <div className="flex flex-col gap-[6px]">
                  <div className="text-[12px] text-text p-[8px_12px] border-l-2 border-accent2 bg-[#ff55330a]">{error}</div>
                </div>
              </div>
            )}

            {manifest && sections.length > 1 ? (
              <div>
                {sections.map((s, i) => (
                  <details key={i} className="border-b border-border overflow-hidden group" open={i === 0}>
                    <summary className="p-[14px_18px] flex justify-between items-center cursor-none transition-colors bg-surface2 hover:bg-white/5 list-none">
                      <div>
                        <div className="text-[9px] tracking-[0.2em] uppercase text-accent bg-accent/10 p-[3px_7px] mb-[3px] inline-block">{s.tag}</div>
                        <div className="font-bebas text-[17px] tracking-[0.05em] text-text">{s.title}</div>
                      </div>
                      <span className="text-muted text-[18px] transition-transform duration-300 font-mono group-open:rotate-45">+</span>
                    </summary>
                    <div className="p-[18px] bg-bg">
                      <div className="manifest-text" dangerouslySetInnerHTML={formatText(s.body)} />
                      <button onClick={() => { navigator.clipboard.writeText(s.body); notify('success', 'Copiado!'); }} className="mt-[10px] bg-transparent border border-border text-muted p-[5px_12px] text-[10px] tracking-[0.1em] uppercase cursor-none transition-colors font-mono hover:border-accent hover:text-accent">COPIAR SEÇÃO</button>
                    </div>
                  </details>
                ))}
                {isProcessing && <span className="inline-block w-[8px] h-[14px] bg-accent animate-blink align-bottom ml-[2px] mt-[10px]" />}
              </div>
            ) : manifest ? (
              <div className="manifest-text">
                <div dangerouslySetInnerHTML={formatText(manifest)} />
                {isProcessing && <span className="inline-block w-[8px] h-[14px] bg-accent animate-blink align-bottom ml-[2px]" />}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
