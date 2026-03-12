import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateManifestStream(briefingData: any, onChunk: (text: string) => void) {
  const prompt = buildPrompt(briefingData);
  
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: "Você é um Principal DesignOps Engineer e Art Director sênior. Responda SEMPRE em português do Brasil. Gere Design Manifests completos, técnicos e detalhados seguindo rigorosamente o protocolo SEED→FRUIT com todas as 5 etapas. Use formatação clara com títulos de seção bem marcados.",
    }
  });

  let fullText = '';
  for await (const chunk of responseStream) {
    if (chunk.text) {
      fullText += chunk.text;
      onChunk(fullText);
    }
  }
  return fullText;
}

function buildPrompt(b: any) {
  const missing = [];
  if (!b.nome) missing.push('Nome do Projeto');
  if (!b.objetivo) missing.push('Objetivo Primário');
  if (!b.publico) missing.push('Público-Alvo');
  if (!b.canal) missing.push('Canal de Veiculação');

  return `## BRIEFING RECEBIDO\n\n**ETAPA 0 — TRIAGEM DA SEMENTE**\n${missing.length ? `⚠ Campos faltantes: ${missing.join(', ')}. Liste perguntas de clarificação antes de prosseguir.` : '✅ Briefing suficiente para execução completa.'}\n\n### Dados do Projeto\n- **Nome:** ${b.nome || '[não informado]'}\n- **Objetivo Primário:** ${b.objetivo || '[não informado]'}\n- **Público-Alvo:** ${b.publico || '[não informado]'}\n- **Canal de Veiculação:** ${b.canal || '[não informado]'}\n- **Formato/Dimensões:** ${b.formato || '[não informado]'}\n- **Tom de Voz:** ${b.tom || '[não informado]'}\n- **Identidade Visual:** ${b.idVisual || '[não informado]'}\n- **Prazo:** ${b.prazo || '[não informado]'}\n${b.descricao ? `- **Descrição:** ${b.descricao}\n` : ''}\n### Referências\n- **Estilo Visual:** ${b.estilo || '[não informado]'}\n- **Marcas de Referência:** ${b.marcas || '[não informado]'}\n- **Movimentos Visuais:** ${b.movimentos || '[não informado]'}\n${b.refs.length ? `- **URLs:** ${b.refs.join(', ')}\n` : ''}${b.assets.length ? `- **Assets Fornecidos:** ${b.assets.join(', ')}\n` : ''}\n### Restrições\n- **Cores Proibidas:** ${b.coresProib || 'nenhuma'}\n- **Fontes Obrigatórias:** ${b.fontesObrig || 'nenhuma'}\n- **Fontes Proibidas:** ${b.fontesProib || 'nenhuma'}\n${b.restrictions.length ? `- **Restrições Ativas:** ${b.restrictions.join('; ')}\n` : ''}${b.restricExtra ? `- **Extras:** ${b.restricExtra}\n` : ''}\n---\n\nExecute as ETAPAS 1, 2, 3 e 4 completas do protocolo SEED→FRUIT. Para cada etapa use o título exato em maiúsculas:\n\n## ETAPA 1 — ANÁLISE DA SEMENTE\nObjectivo de comunicação, tom de voz, persona, KPIs implícitos, referências inferidas.\n\n## ETAPA 2 — DEFINIÇÃO DAS RAÍZES (Mini Design System)\nTabela de escala tipográfica (H1→CTA: família, peso, tamanho, leading, tracking), paleta cromática técnica (nome semântico, HEX, RGB, CMYK quando print, uso, contraste WCAG), sistema de grid (colunas, calhas, margens), tokens de estilo.\n\n## ETAPA 3 — CONSTRUÇÃO DO CAULE\nMapeamento composicional, fluxo de leitura, hierarquia visual (peso 1 → N com justificativa), instruções de montagem por elemento com posição/tratamento/blend mode/relação Gestalt. Obrigatório: mínimo 2 DECISÕES REJEITADAS com justificativa.\n\n## ETAPA 4 — ENTREGA DOS FRUTOS\nExport Manifest: convenção de nomeação de arquivos, especificações PNG/JPG/SVG/EPS/PDF com todos os parâmetros técnicos, checklist de entrega.\n\nSeja extremamente técnico, detalhado e preciso. Use terminologia profissional.`;
}
