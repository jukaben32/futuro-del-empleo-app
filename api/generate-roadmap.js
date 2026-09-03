import { z } from 'zod';
import { RESKILLING_PATHS } from '../src/data/futureJobsData.js';
import { DAILY_LIMIT, getSupabaseAdmin, normalizeTitle, VALID_COUNTRIES } from './predict-role.js';

const MODEL = 'google/gemini-2.5-flash-lite';

export const reskillingRoadmapSchema = z
  .object({
    fromTitle: z.string().min(3).max(120),
    toTitle: z.string().min(3).max(120),
    overview: z.string().min(10).max(300),
    estimatedMonths: z.string().min(3).max(40),
    salaryIncrease: z.string().min(2).max(20),
    keySoftSkills: z.array(z.string().min(2).max(60)).min(3).max(5),
    phases: z
      .array(
        z.object({
          step: z.number().int().min(1).max(3),
          title: z.string().min(3).max(120),
          duration: z.string().min(3).max(40),
          topics: z.array(z.string().min(2).max(160)).min(3).max(5),
          tools: z.array(z.string().min(1).max(60)).min(2).max(5),
          recommendedCourse: z.string().min(5).max(200),
        })
      )
      .length(3),
  })
  // Las 3 fases se indexan por numero en la UI (completedSteps[`${id}-${step}`]);
  // si el modelo repite o salta un numero, dos fases colisionan en la misma clave.
  .refine(
    (data) => data.phases.map((p) => p.step).sort().join(',') === '1,2,3',
    { message: 'Las fases deben numerarse exactamente 1, 2 y 3, sin repetir.' }
  );

function buildRoadmapSystemPrompt(diagnosis, countryLabel) {
  const example1 = RESKILLING_PATHS.find((p) => p.id === 'path-data-analyst');
  const example2 = RESKILLING_PATHS.find((p) => p.id === 'path-operations-ai');

  return `Eres un diseñador de planes de reskilling profesional basado en el World Economic Forum Future of Jobs Report 2025-2030. Dado el diagnóstico de un puesto de trabajo ya generado, crea un plan de transición de 3 fases hacia el rol futuro sugerido, con el mismo rigor y formato que estos ejemplos de referencia:

EJEMPLO 1 (${example1.fromTitle} → ${example1.toTitle}):
- overview: "${example1.overview}"
- estimatedMonths: "${example1.estimatedMonths}", salaryIncrease: "${example1.salaryIncrease}"
- Fase 1 "${example1.phases[0].title}" (${example1.phases[0].duration}): topics ${JSON.stringify(example1.phases[0].topics)}, tools ${JSON.stringify(example1.phases[0].tools)}, recommendedCourse: "${example1.phases[0].recommendedCourse}"
- keySoftSkills: ${JSON.stringify(example1.keySoftSkills)}

EJEMPLO 2 (${example2.fromTitle} → ${example2.toTitle}):
- overview: "${example2.overview}"
- estimatedMonths: "${example2.estimatedMonths}", salaryIncrease: "${example2.salaryIncrease}"
- Fase 1 "${example2.phases[0].title}" (${example2.phases[0].duration}): topics ${JSON.stringify(example2.phases[0].topics)}, tools ${JSON.stringify(example2.phases[0].tools)}, recommendedCourse: "${example2.phases[0].recommendedCourse}"
- keySoftSkills: ${JSON.stringify(example2.keySoftSkills)}

DIAGNÓSTICO A TRANSFORMAR EN PLAN:
- Puesto actual: "${diagnosis.title}" (sector: ${diagnosis.sector}, riesgo: ${diagnosis.riskLevel}, automationScore: ${diagnosis.automationScore})
- Resumen del impacto: "${diagnosis.summary}"
- Rol futuro objetivo: "${diagnosis.targetTransitionRole}"
- Consejo de supervivencia ya dado: "${diagnosis.survivalAdvice}"
- Contexto geográfico: ${countryLabel}

Instrucciones:
- "fromTitle" debe ser el puesto actual ("${diagnosis.title}") y "toTitle" el rol futuro objetivo ("${diagnosis.targetTransitionRole}"), o una redacción muy cercana.
- Las 3 fases deben ser ESPECÍFICAS a la transición de "${diagnosis.title}" hacia "${diagnosis.targetTransitionRole}" — nunca genéricas de oficina ni copiadas de los ejemplos. Si el puesto es un oficio de cara al público, del sector salud, educación, campo, manufactura, etc., las herramientas y cursos deben reflejar ESE sector.
- Numera las fases exactamente step: 1, 2, 3 en orden cronológico creciente de duración.
- "recommendedCourse" debe nombrar cursos o certificaciones plausibles de plataformas reales y reconocibles (Coursera, edX, Google, Microsoft Learn, LinkedIn Learning, DeepLearning.AI, Udemy, o el organismo de formación docente/profesional correspondiente al sector) — no inventes URLs, solo nombres de curso y plataforma, igual que en los ejemplos.
- "estimatedMonths" y "salaryIncrease" deben ser realistas para esta transición concreta, no copiados de los ejemplos.
- Responde siempre en español.
- Usa la herramienta "emit_reskilling_roadmap" para entregar tu respuesta. No respondas con texto libre.`;
}

const EMIT_TOOL = {
  type: 'function',
  function: {
    name: 'emit_reskilling_roadmap',
    description: 'Emite el plan de reskilling de 3 fases para la transición de rol dada.',
    parameters: {
      type: 'object',
      properties: {
        fromTitle: { type: 'string' },
        toTitle: { type: 'string' },
        overview: { type: 'string', description: 'Resumen de 1-2 frases de la transición.' },
        estimatedMonths: { type: 'string', description: 'Ej. "4 a 6 meses".' },
        salaryIncrease: { type: 'string', description: 'Ej. "+40%".' },
        keySoftSkills: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 5 },
        phases: {
          type: 'array',
          minItems: 3,
          maxItems: 3,
          items: {
            type: 'object',
            properties: {
              step: { type: 'integer', enum: [1, 2, 3] },
              title: { type: 'string' },
              duration: { type: 'string', description: 'Ej. "Mes 1 - 2".' },
              topics: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 5 },
              tools: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
              recommendedCourse: { type: 'string' },
            },
            required: ['step', 'title', 'duration', 'topics', 'tools', 'recommendedCourse'],
          },
        },
      },
      required: ['fromTitle', 'toTitle', 'overview', 'estimatedMonths', 'salaryIncrease', 'keySoftSkills', 'phases'],
    },
  },
};

async function callOpenRouterForRoadmap(diagnosis, country) {
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
        { role: 'system', content: buildRoadmapSystemPrompt(diagnosis, countryLabel) },
        { role: 'user', content: `Genera el plan de reskilling para: "${diagnosis.title}" → "${diagnosis.targetTransitionRole}".` },
      ],
      tools: [EMIT_TOOL],
      tool_choice: { type: 'function', function: { name: 'emit_reskilling_roadmap' } },
    }),
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

async function generateValidatedRoadmap(diagnosis, country) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rawInput = await callOpenRouterForRoadmap(diagnosis, country);
      const parsed = reskillingRoadmapSchema.safeParse(rawInput);
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
    res.status(400).json({ error: 'Puesto de trabajo inválido.' });
    return;
  }

  const normalizedCountry = VALID_COUNTRIES.includes(country) ? country : 'global';

  const authHeader = req.headers.authorization || '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!accessToken) {
    res.status(401).json({ error: 'Debes iniciar sesión para generar un plan de reskilling.' });
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
  const { data: cachedRoadmap, error: roadmapCacheReadError } = await supabaseAdmin
    .from('reskilling_roadmaps')
    .select('roadmap')
    .eq('normalized_title', normalizedTitle)
    .eq('country', normalizedCountry)
    .maybeSingle();

  if (roadmapCacheReadError) {
    console.error('reskilling_roadmaps read failed (is supabase/schema.sql applied?):', roadmapCacheReadError.message);
  }

  if (cachedRoadmap) {
    res.status(200).json({ source: 'cache', roadmap: cachedRoadmap.roadmap });
    return;
  }

  // 2. El roadmap se construye a partir del diagnostico ya cacheado para este
  // (puesto, pais) — nunca confiamos en datos de contexto enviados por el cliente.
  const { data: diagnosisRow, error: diagnosisReadError } = await supabaseAdmin
    .from('role_predictions')
    .select('prediction')
    .eq('normalized_title', normalizedTitle)
    .eq('country', normalizedCountry)
    .maybeSingle();

  if (diagnosisReadError) {
    console.error('role_predictions read failed while building roadmap:', diagnosisReadError.message);
  }

  if (!diagnosisRow) {
    res.status(409).json({ error: 'Genera primero el diagnóstico de este puesto antes de pedir el plan de reskilling.' });
    return;
  }

  // 3. Check daily usage limit (comparte el mismo cupo que el diagnostico: ambos son llamadas al LLM)
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
    res.status(429).json({ error: `Alcanzaste el límite de ${DAILY_LIMIT} generaciones con IA por día. Intenta de nuevo mañana.` });
    return;
  }

  // 4. Generate
  const roadmap = await generateValidatedRoadmap(diagnosisRow.prediction, normalizedCountry);
  if (!roadmap) {
    res.status(502).json({ error: 'No pudimos generar un plan válido para esta transición. Intenta de nuevo.' });
    return;
  }

  // 5. Persist cache + usage (best-effort; no fallar la respuesta si esto falla, pero
  // registrarlo en logs — un fallo silencioso aqui significa que el cache nunca ahorra).
  const { error: roadmapCacheWriteError } = await supabaseAdmin
    .from('reskilling_roadmaps')
    .upsert(
      { normalized_title: normalizedTitle, country: normalizedCountry, roadmap, model_used: MODEL },
      { onConflict: 'normalized_title,country' }
    );
  if (roadmapCacheWriteError) {
    console.error('reskilling_roadmaps upsert failed (is supabase/schema.sql applied?):', roadmapCacheWriteError.message);
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

  res.status(200).json({ source: 'llm', roadmap });
}
