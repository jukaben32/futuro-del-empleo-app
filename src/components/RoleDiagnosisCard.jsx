import React, { useState } from 'react';
import { Bot, User, Sparkles, ArrowRight, CheckCircle2, Share2, Check } from 'lucide-react';
import { getScoreColor } from '../lib/scoreColor';
import { createSharedDiagnosis } from '../lib/userData';

// userId solo llega cuando el diagnostico se muestra dentro de la app logueada
// (RoleSimulator/AIRolePredictor). En la pagina publica de un enlace compartido
// (SharedDiagnosisView) no se pasa, y el boton de compartir se oculta solo,
// igual que ya hace onSelectRoleForRoadmap.
export default function RoleDiagnosisCard({ role, onSelectRoleForRoadmap, isGeneratingRoadmap = false, roadmapError = '', userId }) {
  const scoreTheme = getScoreColor(role.automationScore);
  // Curated roles (SIMULATOR_ROLES) carry their own hand-tuned badgeColor string.
  // AI-generated roles don't (the model is never trusted to emit CSS classes) —
  // fall back to a badge computed from the same score thresholds as the gauge.
  const badgeClass = role.badgeColor || `${scoreTheme.bg}/20 ${scoreTheme.text} ${scoreTheme.border}`;

  const [shareStatus, setShareStatus] = useState('idle'); // idle | sharing | copied | error
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async () => {
    if (!userId || shareStatus === 'sharing') return;
    setShareStatus('sharing');

    const id = await createSharedDiagnosis(userId, { jobTitle: role.title, diagnosis: role });
    if (!id) {
      setShareStatus('error');
      return;
    }

    const url = `${window.location.origin}/share/${id}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // El portapapeles puede fallar (permisos, contexto no seguro) — igual
      // mostramos el enlace como texto para copiarlo a mano.
    }
    setShareStatus('copied');
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 border ${scoreTheme.border} relative overflow-hidden transition-all duration-300 shadow-2xl ${scoreTheme.glow}`}>

      {/* Top Banner with Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-800/80">

        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
              Nivel de Riesgo: {role.riskLevel}
            </span>
            <span className="text-xs text-slate-400">
              Sector: <strong className="text-slate-200 capitalize">{role.sector}</strong>
            </span>

            {userId && (
              <button
                onClick={handleShare}
                disabled={shareStatus === 'sharing'}
                className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-dark-900 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-60"
                title="Copiar un enlace público a este diagnóstico"
              >
                {shareStatus === 'copied' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>
                  {shareStatus === 'sharing' ? 'Generando enlace...' : shareStatus === 'copied' ? '¡Enlace copiado!' : 'Compartir'}
                </span>
              </button>
            )}
          </div>

          {shareStatus === 'copied' && shareUrl && (
            <p className="text-[11px] text-slate-500 mb-2 break-all">{shareUrl}</p>
          )}
          {shareStatus === 'error' && (
            <p className="text-[11px] text-rose-400 mb-2">No pudimos generar el enlace. Intenta de nuevo.</p>
          )}

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {role.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {role.summary}
          </p>
        </div>

        {/* Score Visual Gauge (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-dark-900/90 border border-slate-800/90">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Índice de Automatización
          </div>

          <div className="relative flex items-center justify-center w-28 h-28 my-1">
            {/* SVG circular gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-dark-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={scoreTheme.text}
                strokeDasharray={`${role.automationScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${scoreTheme.text}`}>
                {role.automationScore}%
              </span>
              <span className="text-[9px] text-slate-400 uppercase">Impacto IA</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center">
            {role.automationScore > 70
              ? 'Alta urgencia de reskilling hacia tareas analíticas o humanas.'
              : role.automationScore > 40
              ? 'Evolución a rol aumentado con herramientas de IA.'
              : 'Alta resiliencia. El juicio humano sigue siendo el eje central.'}
          </div>
        </div>

      </div>

      {/* 2-Column Task Breakdown: AI will do vs Humans will do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">

        {/* Left: Tareas que la IA asumirá */}
        <div className="rounded-xl p-4 bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm">
            <Bot className="w-4 h-4" />
            <span>Tareas que la IA asumirá o automatiza:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {role.aiWillDo.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5 font-bold">✕</span>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Tareas que seguirán siendo humanas */}
        <div className="rounded-xl p-4 bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-sm">
            <User className="w-4 h-4" />
            <span>Tareas donde el criterio humano es irreemplazable:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {role.humanWillDo.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Survival Strategy & Transition Action */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-900/60 p-4 rounded-xl">
        <div>
          <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Estrategia Táctica de Supervivencia:
          </div>
          <p className="text-xs text-slate-300">
            {role.survivalAdvice}
          </p>
        </div>

        {onSelectRoleForRoadmap && (
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <button
              onClick={() => onSelectRoleForRoadmap(role.targetTransitionRole)}
              disabled={isGeneratingRoadmap}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-wait text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>{isGeneratingRoadmap ? 'Generando plan personalizado...' : 'Ver Plan de Reskilling'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {roadmapError && (
              <span className="text-[11px] text-rose-400 max-w-xs text-right">{roadmapError}</span>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
