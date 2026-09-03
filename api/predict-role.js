import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { SIMULATOR_ROLES } from '../src/data/futureJobsData.js';

export const DAILY_LIMIT = 10;
// google/gemini-2.5-flash-lite via OpenRouter: ~$0.10 / $0.40 per million input/output
// tokens as of 2026, the cheapest Gemini tier with reliable function/tool-calling support —
// picked specifically for this high-volume, low-cost, structured-JSON-generation workload.
const MODEL = 'google/gemini-2.5-flash-lite';
// Sin esto, un fetch colgado (red o proveedor) espera hasta el limite de la
// funcion serverless (300s) sin dar ninguna senal al usuario — el boton se ve
// "pensando" para siempre. Con el timeout, aborta rapido y el reintento de
// generateValidatedRole tiene una segunda oportunidad real.
export const OPENROUTER_TIMEOUT_MS = 25000;

export const VALID_COUNTRIES = ['argentina', 'brasil', 'colombia', 'mexico', 'latam', 'global'];
const VALID_SECTORS = ['tech', 'finance', 'health', 'education', 'industry', 'retail'];
const VALID_RISK_LEVELS = ['Bajo', 'Medio', 'Alto', 'Crítico'];

export const rolePredictionSchema = z.object({
  title: z.string().min(2).max(120),
  sector: z.enum(VALID_SECTORS),
  automationScore: z.number().int().min(0).max(100),
  riskLevel: z.enum(VALID_RISK_LEVELS),
  summary: z.string().min(10).max(400),
  aiWillDo: z.array(z.string().min(3)).min(3).max(4),
  humanWillDo: z.array(z.string().min(3)).min(3).max(4),
  survivalAdvice: z.string().min(10).max(400),
  targetTransitionRole: z.string().min(3).max(120),
});

export function getSupabaseAdmin() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function normalizeTitle(jobTitle) {
  return jobTitle.trim().toLowerCase().replace(/\s+/g, ' ');
}

function buildSystemPrompt() {
  const example1 = SIMULATOR_ROLES.find((r) => r.id === 'contador');
  const example2 = SIMULATOR_ROLES.find((r) => r.id === 'software-dev');

  return `Eres un motor de análisis basado en el World Economic Forum Future of Jobs Report 2025-2030. Dado un puesto de trabajo en español, genera una predicción de impacto de IA con el mismo rigor, tono y nivel de detalle que estos ejemplos de referencia:

EJEMPLO 1 (rol: ${example1.title}):
- riskLevel: "${example1.riskLevel}", automationScore: ${example1.automationScore}
- summary: "${example1.summary}"
- aiWillDo: ${JSON.stringify(example1.aiWillDo)}
- humanWillDo: ${JSON.stringify(example1.humanWillDo)}
- survivalAdvice: "${example1.survivalAdvice}"

EJEMPLO 2 (rol: ${example2.title}):
- riskLevel: "${example2.riskLevel}", automationScore: ${example2.automationScore}
- summary: "${example2.summary}"
- aiWillDo: ${JSON.stringify(example2.aiWillDo)}
- humanWillDo: ${JSON.stringify(example2.humanWillDo)}
- survivalAdvice: "${example2.survivalAdvice}"

Instrucciones:
- Genera exactamente 3 o 4 elementos en "aiWillDo" y en "humanWillDo", tareas concretas y específicas al rol (no genéricas).
- "sector" debe ser uno de: ${VALID_SECTORS.join(', ')}.
- "riskLevel" debe ser uno de: ${VALID_RISK_LEVELS.join(', ')}, coherente con "automationScore" (Bajo <40, Medio 40-69, Alto/Crítico >=70).
- "targetTransitionRole" debe ser un rol futuro concreto y específico a este puesto (no un rol genérico de otro sector) — el plan de reskilling hacia ese rol se genera después, en una llamada separada.
- Si se provee un país o región en el mensaje del usuario, ajusta el análisis con matices reales del reporte WEF para ese contexto (marco regulatorio local, informalidad laboral, nivel de adopción tecnológica, brechas de habilidades reportadas para esa región) en vez de dar una respuesta genérica global. Si no se provee país, da una respuesta neutral/global.
- Responde siempre en español.
- Usa la herramienta "emit_role_prediction" para entregar tu respuesta. No respondas con texto libre.`;
}

// OpenRouter uses the OpenAI-compatible "function" tool format, not Anthropic's "tool" format.
const EMIT_TOOL = {
  type: 'function',
  function: {
    name: 'emit_role_prediction',
    description: 'Emite el diagnóstico estructurado de impacto de IA para el puesto de trabajo dado.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Nombre formal y claro del puesto, en español.' },
        sector: { type: 'string', enum: VALID_SECTORS },
        automationScore: { type: 'integer', minimum: 0, maximum: 100 },
        riskLevel: { type: 'string', enum: VALID_RISK_LEVELS },
        summary: { type: 'string', description: 'Resumen de 1-2 frases del impacto de la IA en este rol.' },
        aiWillDo: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
        humanWillDo: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 4 },
        survivalAdvice: { type: 'string', description: 'Consejo táctico de transición profesional, 1-2 frases.' },
        targetTransitionRole: { type: 'string', description: 'Nombre del rol futuro hacia el que debería evolucionar.' },
      },
      required: ['title', 'sector', 'automationScore', 'riskLevel', 'summary', 'aiWillDo', 'humanWillDo', 'survivalAdvice', 'targetTransitionRole'],
    },
  },
};

async function callOpenRouter(jobTitle, country) {
  const countryLabel = country
    ? { argentina: 'Argentina', brasil: 'Brasil', colombia: 'Colombia', mexico: 'México', latam: 'América Latina (general)', global: 'Global' }[country]
    : 'Global';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://futuro-del-empleo-app.vercel.app',
      'X-Title': 'Futuro del Empleo en la Era de IA',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: `Puesto: "${jobTitle}". Contexto geográfico: ${countryLabel}.` },
      ],
      tools: [EMIT_TOOL],
      tool_choice: { type: 'function', function: { name: 'emit_role_prediction' } },
    }),
    signal: AbortSignal.timeout(OPENROUTER_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenRouter API error ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    throw new Error('No tool_call in OpenRouter response');
  }
  return JSON.parse(toolCall.function.arguments);
}

async function generateValidatedRole(jobTitle, country) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rawInput = await callOpenRouter(jobTitle, country);
      const parsed = rolePredictionSchema.safeParse(rawInput);
      if (parsed.success) return parsed.data;
    } catch {
      // fall through to retry
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const { jobTitle, country } = req.body || {};

  if (typeof jobTitle !== 'string' || jobTitle.trim().length < 2 || jobTitle.trim().length > 80) {
    res.status(400).json({ error: 'Escribe un puesto de trabajo válido (2 a 80 caracteres).' });
    return;
  }

  // Always a concrete string (never null) — Postgres treats NULL as distinct in unique
  // constraints, which would break the (normalized_title, country) cache key.
  const normalizedCountry = VALID_COUNTRIES.includes(country) ? country : 'global';

  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!accessToken) {
    res.status(401).json({ error: 'Debes iniciar sesión para usar el predictor.' });
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Sesión inválida o expirada. Vuelve a iniciar sesión.' });
    return;
  }
  const userId = userData.user.id;

  const normalizedTitle = normalizeTitle(jobTitle);

  // 1. Check cache
  const { data: cached, error: cacheReadError } = await supabaseAdmin
    .from('role_predictions')
    .select('prediction')
    .eq('normalized_title', normalizedTitle)
    .eq('country', normalizedCountry)
    .maybeSingle();

  if (cacheReadError) {
    // Don't fail the request over a cache problem — but surface it loudly in logs,
    // since a silently-broken cache/table means every request re-hits the paid LLM.
    console.error('role_predictions read failed (is supabase/schema.sql applied?):', cacheReadError.message);
  }

  if (cached) {
    res.status(200).json({ source: 'cache', role: cached.prediction });
    return;
  }

  // 2. Check daily usage limit
  const today = new Date().toISOString().slice(0, 10);
  const { data: usageRow, error: usageReadError } = await supabaseAdmin
    .from('usage_daily')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (usageReadError) {
    console.error('usage_daily read failed (is supabase/schema.sql applied?):', usageReadError.message);
  }

  if (usageRow && usageRow.count >= DAILY_LIMIT) {
    res.status(429).json({ error: `Alcanzaste el límite de ${DAILY_LIMIT} predicciones por día. Intenta de nuevo mañana.` });
    return;
  }

  // 3. Call the model
  const role = await generateValidatedRole(jobTitle.trim(), normalizedCountry);
  if (!role) {
    res.status(502).json({ error: 'No pudimos generar un diagnóstico válido para ese puesto. Intenta reformularlo.' });
    return;
  }

  // 4. Persist cache + usage (best-effort; don't fail the response if these writes fail,
  // but log loudly — a silent failure here means the cache/rate-limit never actually works).
  const { error: cacheWriteError } = await supabaseAdmin
    .from('role_predictions')
    .upsert(
      { normalized_title: normalizedTitle, country: normalizedCountry, prediction: role, model_used: MODEL },
      { onConflict: 'normalized_title,country' }
    );
  if (cacheWriteError) {
    console.error('role_predictions upsert failed (is supabase/schema.sql applied?):', cacheWriteError.message);
  }

  const { error: usageWriteError } = await supabaseAdmin
    .from('usage_daily')
    .upsert(
      { user_id: userId, date: today, count: (usageRow?.count || 0) + 1 },
      { onConflict: 'user_id,date' }
    );
  if (usageWriteError) {
    console.error('usage_daily upsert failed (is supabase/schema.sql applied?):', usageWriteError.message);
  }

  res.status(200).json({ source: 'llm', role });
}
