import React, { useState, useEffect } from 'react';
import {
  Map,
  Circle,
  Sparkles,
  Clock,
  TrendingUp,
  BookOpen,
  Check,
  PartyPopper,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RESKILLING_PATHS } from '../data/futureJobsData';
import { getRoadmapProgress, saveRoadmapProgress } from '../lib/userData';

// Id sintetico para el roadmap generado por IA (api/generate-roadmap.js). Nunca
// colisiona con los 3 ids fijos de RESKILLING_PATHS, que siempre empiezan con "path-".
export const AI_CUSTOM_PATH_ID = 'ai-custom';

// Maps the free-text target role from RoleSimulator to the closest matching reskilling path.
// Only 3 paths exist (path-data-analyst, path-ai-specialist, path-operations-ai) but 9 possible
// target roles, so non-exact matches are chosen based on each role's survivalAdvice in
// futureJobsData.js (e.g. the accountant's advice explicitly recommends BI tools).
const TARGET_ROLE_TO_PATH_ID = {
  'Analista de Datos & Business Intelligence': 'path-data-analyst',
  'Consultor Estratégico Financiero & Auditor de IA': 'path-data-analyst', // advice: Power BI/Tableau
  'Arquitecto de Software & Agentes de IA': 'path-ai-specialist',
  'Diseñador de Interacción Humano-IA (UI/UX)': 'path-ai-specialist', // advice: AI prompt/design tools
  'Specialist en Customer Success B2B & Conversational AI': 'path-ai-specialist', // conversational AI design
  'Especialista en Medicina de Precisión Asistida por IA': 'path-ai-specialist', // AI-assisted diagnosis
  'Growth & AI Strategy Director': 'path-ai-specialist', // advice: autonomous agents for funnels
  'Consultor LegalTech & Compliance en IA': 'path-operations-ai', // advice: integrate AI into workflows
  'Diseñador Pedagógico de Aprendizaje Aumentado': 'path-operations-ai', // advice: AI tools for personalization
};

export default function ReskillingRoadmap({ targetRole, pathIdOverride, customRoadmap, customRoadmapKey, userId }) {
  const [selectedPathId, setSelectedPathId] = useState(RESKILLING_PATHS[0].id);
  const [completedSteps, setCompletedSteps] = useState({}); // { pathId-stepIndex: boolean }

  // Cuando el predictor de IA genera un plan a medida (customRoadmap, desde
  // api/generate-roadmap.js), se añade como una 4ª pestaña junto a las 3 fijas
  // en vez de reemplazarlas — asi el usuario puede seguir comparando con las curadas.
  // progressKey identifica el plan para persistir el progreso: los 3 fijos usan su
  // propio id ("path-data-analyst", etc.), pero "ai-custom" es SIEMPRE el mismo id
  // sin importar la profesion, asi que el progreso de dos profesiones distintas
  // colisionaria bajo esa misma clave — customRoadmapKey (armado en AIRolePredictor
  // a partir del puesto+pais normalizados) evita esa colision.
  const paths = customRoadmap
    ? [...RESKILLING_PATHS, { ...customRoadmap, id: AI_CUSTOM_PATH_ID, progressKey: customRoadmapKey || AI_CUSTOM_PATH_ID }]
    : RESKILLING_PATHS;

  // Adjust selection during render when a new target role arrives from RoleSimulator or
  // the AI predictor. pathIdOverride (from the AI predictor, a literal path id chosen by
  // the model) takes priority over the free-text TARGET_ROLE_TO_PATH_ID dictionary lookup.
  const [lastTargetRole, setLastTargetRole] = useState(targetRole);
  const [lastPathIdOverride, setLastPathIdOverride] = useState(pathIdOverride);
  const [lastCustomRoadmap, setLastCustomRoadmap] = useState(customRoadmap);
  if (targetRole !== lastTargetRole || pathIdOverride !== lastPathIdOverride || customRoadmap !== lastCustomRoadmap) {
    setLastTargetRole(targetRole);
    setLastPathIdOverride(pathIdOverride);
    setLastCustomRoadmap(customRoadmap);
    const mappedId = pathIdOverride || (targetRole && TARGET_ROLE_TO_PATH_ID[targetRole]);
    if (mappedId) setSelectedPathId(mappedId);
  }

  const activePath = paths.find(p => p.id === selectedPathId) || paths[0];
  const progressKey = activePath.progressKey || activePath.id;

  // Carga el progreso guardado de ESTE plan cada vez que cambia de pestaña (o al
  // montar). No se re-lee el resto de rutas: cada una se carga la primera vez que
  // se selecciona, igual que ya hacia la UI antes de tener persistencia.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const saved = await getRoadmapProgress(userId, progressKey);
      if (cancelled) return;
      setCompletedSteps((prev) => {
        // Limpia cualquier entrada previa bajo el mismo prefijo de activePath.id —
        // evita que el progreso de otra profesion se vea por un instante bajo el
        // mismo id sintetico "ai-custom" mientras llega la respuesta real.
        const cleaned = Object.fromEntries(
          Object.entries(prev).filter(([k]) => !k.startsWith(`${activePath.id}-`))
        );
        return {
          ...cleaned,
          [`${activePath.id}-1`]: !!saved[1],
          [`${activePath.id}-2`]: !!saved[2],
          [`${activePath.id}-3`]: !!saved[3],
        };
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, progressKey, activePath.id]);

  const toggleStep = (stepNumber) => {
    const key = `${activePath.id}-${stepNumber}`;
    const nextState = !completedSteps[key];
    const newCompleted = { ...completedSteps, [key]: nextState };
    setCompletedSteps(newCompleted);

    // Check if all 3 steps of current path are completed
    const step1 = newCompleted[`${activePath.id}-1`];
    const step2 = newCompleted[`${activePath.id}-2`];
    const step3 = newCompleted[`${activePath.id}-3`];

    if (step1 && step2 && step3) {
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti is a non-critical visual flourish; ignore failures (e.g. reduced-motion environments)
      }
    }

    // Persistencia optimista: la UI ya se actualizo arriba, esto solo la guarda
    // para que sobreviva un recargo de pagina. No bloquea la interaccion.
    if (userId) {
      saveRoadmapProgress(userId, progressKey, {
        1: !!step1,
        2: !!step2,
        3: !!step3,
      });
    }
  };

  // Calculate progress percentage
  const doneCount = [1, 2, 3].filter(num => completedSteps[`${activePath.id}-${num}`]).length;
  const progressPercent = Math.round((doneCount / 3) * 100);

  return (
    <section id="reskilling" className="py-8 sm:py-10 border-t border-slate-800/80 bg-dark-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
            <Map className="w-3.5 h-3.5" />
            Plan de Acción & Reskilling Guiado
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Mapa de Ruta de Reskilling Profesional
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Transiciones estratégicas paso a paso desde roles vulnerables hacia puestos de alta demanda tecnológica, con cursos acreditados y habilidades indispensables.
          </p>
        </div>

        {/* Path Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {paths.map((path) => {
            const isSelected = path.id === activePath.id;
            const isAiCustom = path.id === AI_CUSTOM_PATH_ID;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? isAiCustom
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20 font-bold'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-black shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-dark-900 text-slate-300 hover:text-white hover:bg-dark-800 border border-slate-800'
                }`}
              >
                {isAiCustom && <Wand2 className="w-3.5 h-3.5" />}
                <span>{path.toTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-black/20 text-current' : 'bg-dark-800 text-emerald-400'
                }`}>
                  {path.salaryIncrease}
                </span>
              </button>
            );
          })}
        </div>

        {/* Path Card Overview Banner */}
        <div className="glass-panel rounded-2xl p-6 mb-6 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              {activePath.id === AI_CUSTOM_PATH_ID && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2">
                  <Wand2 className="w-3.5 h-3.5" />
                  Generado por IA para tu profesión
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span>Desde: <strong className="text-rose-400">{activePath.fromTitle}</strong></span>
                <span>→</span>
                <span>Hacia: <strong className="text-emerald-400">{activePath.toTitle}</strong></span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                {activePath.toTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
                {activePath.overview}
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="flex items-center gap-3 shrink-0 bg-dark-900/90 p-3 rounded-xl border border-slate-800">
              <div className="text-center px-2">
                <div className="text-xs text-slate-400">Duración Est.</div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {activePath.estimatedMonths}
                </div>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div className="text-center px-2">
                <div className="text-xs text-slate-400">Incremento Salarial</div>
                <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {activePath.salaryIncrease}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5 font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                Progreso del Plan: <strong className="text-emerald-400">{doneCount} de 3 fases completadas</strong>
              </span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full bg-dark-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressPercent === 100 && (
              <div className="mt-2 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-1.5 animate-bounce">
                <PartyPopper className="w-4 h-4 text-emerald-400" />
                ¡Felicitaciones! Has trazado tu preparación para el nuevo perfil profesional.
              </div>
            )}
          </div>
        </div>

        {/* 3 Step Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {activePath.phases.map((phase) => {
            const isCompleted = !!completedSteps[`${activePath.id}-${phase.step}`];
            return (
              <div 
                key={phase.step}
                className={`glass-panel rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
                  isCompleted 
                    ? 'border-emerald-500/60 bg-emerald-950/10 shadow-lg shadow-emerald-500/10' 
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-dark-800 text-cyan-300 border border-slate-700">
                      {phase.duration}
                    </span>

                    {/* Step Checkbox Button */}
                    <button
                      onClick={() => toggleStep(phase.step)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 text-black shadow-md'
                          : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                      title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Listo</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5" />
                          <span>Pendiente</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">
                    {phase.title}
                  </h4>

                  {/* Topics covered */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Competencias a Desarrollar:
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {phase.topics.map((t, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Herramientas Prácticas:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.tools.map((tool, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-dark-900 text-slate-200 text-[10px] border border-slate-800">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommended Course Box */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-cyan-400" /> Curso Certificado Sugerido:
                  </div>
                  <div className="text-xs text-cyan-300 font-medium leading-tight">
                    {phase.recommendedCourse}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Essential Soft Skills Bar */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-medium">
              <strong>Habilidades Blandas Indispensables para esta transición:</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePath.keySoftSkills.map((soft, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-xs">
                {soft}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
