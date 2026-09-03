import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Wand2, AlertTriangle, RotateCcw, History, X } from 'lucide-react';
import RoleDiagnosisCard from './RoleDiagnosisCard';
import { AI_CUSTOM_PATH_ID } from './ReskillingRoadmap';
import { supabase } from '../lib/supabaseClient';
import {
  getUserProfile,
  saveUserProfile,
  listDiagnosisHistory,
  saveDiagnosisHistory,
  deleteDiagnosisHistoryEntry,
  buildCustomProgressKey,
} from '../lib/userData';

const COUNTRY_OPTIONS = [
  { id: '', label: 'Global / Otro' },
  { id: 'argentina', label: 'Argentina' },
  { id: 'brasil', label: 'Brasil' },
  { id: 'colombia', label: 'Colombia' },
  { id: 'mexico', label: 'México' },
  { id: 'latam', label: 'América Latina (general)' },
];

// Minimal shape guard — belt-and-suspenders alongside the server-side zod validation,
// so a malformed response can never reach RoleDiagnosisCard's .map() calls.
function isValidRole(role) {
  return (
    role &&
    typeof role.title === 'string' &&
    typeof role.automationScore === 'number' &&
    typeof role.riskLevel === 'string' &&
    Array.isArray(role.aiWillDo) &&
    Array.isArray(role.humanWillDo) &&
    typeof role.survivalAdvice === 'string'
  );
}

// Mismo criterio de guardia minima que isValidRole, para el roadmap generado
// por api/generate-roadmap.js.
function isValidRoadmap(roadmap) {
  return (
    roadmap &&
    typeof roadmap.toTitle === 'string' &&
    typeof roadmap.fromTitle === 'string' &&
    Array.isArray(roadmap.phases) &&
    roadmap.phases.length === 3 &&
    Array.isArray(roadmap.keySoftSkills)
  );
}

export default function AIRolePredictor({ onSelectRoleForRoadmap, userId }) {
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const [submittedTitle, setSubmittedTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState('');
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState('');
  const [history, setHistory] = useState([]);

  // Al montar: precarga el ultimo puesto/pais consultado (perfil minimo) y el
  // historial de diagnosticos previos, para no repreguntarle al usuario cada visita.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const [profile, hist] = await Promise.all([getUserProfile(userId), listDiagnosisHistory(userId)]);
      if (cancelled) return;

      if (profile) {
        setJobTitle((prev) => prev || profile.current_job_title || '');
        setCountry((prev) => prev || (profile.country && profile.country !== 'global' ? profile.country : ''));
      }
      setHistory(hist);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = jobTitle.trim();
    if (!trimmedTitle || status === 'loading') return;

    // Guard against duplicate submits (double-click) on the exact same query
    const submissionKey = `${trimmedTitle.toLowerCase()}|${country}`;
    if (submissionKey === lastSubmitted && status === 'success') return;
    setLastSubmitted(submissionKey);

    setStatus('loading');
    setErrorMessage('');
    setRoadmapError('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch('/api/predict-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ jobTitle: trimmedTitle, country: country || null }),
      });

      if (response.status === 429) {
        setStatus('error');
        setErrorMessage('Alcanzaste el límite diario de predicciones. Intenta de nuevo mañana.');
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setStatus('error');
        setErrorMessage(body.error || 'No pudimos generar la predicción. Intenta de nuevo.');
        return;
      }

      const body = await response.json();
      if (!isValidRole(body.role)) {
        setStatus('error');
        setErrorMessage('Recibimos una respuesta inesperada. Intenta de nuevo.');
        return;
      }

      setResult(body.role);
      setSubmittedTitle(trimmedTitle);
      setStatus('success');

      // Guardado best-effort: no bloquea ni condiciona mostrar el diagnostico.
      if (userId) {
        saveUserProfile(userId, { currentRole: trimmedTitle, country });
        saveDiagnosisHistory(userId, { jobTitle: trimmedTitle, country, diagnosis: body.role }).then((savedRow) => {
          if (!savedRow) return;
          setHistory((prev) => [savedRow, ...prev.filter((h) => h.id !== savedRow.id)].slice(0, 20));
        });
      }
    } catch {
      setStatus('error');
      setErrorMessage('No pudimos conectar con el servicio de predicción. Verifica tu conexión e intenta de nuevo.');
    }
  };

  // Genera un plan de reskilling a medida para el puesto ya diagnosticado (en vez
  // de encajarlo en una de las 3 rutas fijas de RESKILLING_PATHS). Usa el mismo
  // patron cache-primero + limite diario que /api/predict-role.
  const handleGenerateRoadmap = async (targetRole) => {
    if (generatingRoadmap) return;
    setGeneratingRoadmap(true);
    setRoadmapError('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ jobTitle: submittedTitle, country: country || null }),
      });

      if (response.status === 429) {
        setRoadmapError('Alcanzaste el límite diario de generaciones con IA. Intenta de nuevo mañana.');
        return;
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setRoadmapError(body.error || 'No pudimos generar el plan de reskilling. Intenta de nuevo.');
        return;
      }

      const body = await response.json();
      if (!isValidRoadmap(body.roadmap)) {
        setRoadmapError('Recibimos un plan con formato inesperado. Intenta de nuevo.');
        return;
      }

      onSelectRoleForRoadmap(targetRole, AI_CUSTOM_PATH_ID, body.roadmap, buildCustomProgressKey(submittedTitle, country));

      if (userId) {
        saveDiagnosisHistory(userId, { jobTitle: submittedTitle, country, diagnosis: result, roadmap: body.roadmap }).then((savedRow) => {
          if (!savedRow) return;
          setHistory((prev) => [savedRow, ...prev.filter((h) => h.id !== savedRow.id)].slice(0, 20));
        });
      }
    } catch {
      setRoadmapError('No pudimos conectar con el servicio. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
    setRoadmapError('');
  };

  // Reabre un diagnostico guardado sin volver a llamar al LLM. Si ese diagnostico
  // ya tenia un roadmap generado, lo restaura tambien de inmediato.
  const handleReopenHistoryEntry = (entry) => {
    const entryCountry = entry.country === 'global' ? '' : entry.country;
    setJobTitle(entry.job_title);
    setCountry(entryCountry);
    setSubmittedTitle(entry.job_title);
    setResult(entry.diagnosis);
    setStatus('success');
    setErrorMessage('');
    setRoadmapError('');
    setLastSubmitted(`${entry.job_title.toLowerCase()}|${entryCountry}`);

    if (entry.roadmap) {
      onSelectRoleForRoadmap(
        entry.diagnosis.targetTransitionRole,
        AI_CUSTOM_PATH_ID,
        entry.roadmap,
        buildCustomProgressKey(entry.job_title, entry.country)
      );
    }
  };

  const handleDeleteHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    deleteDiagnosisHistoryEntry(id);
  };

  return (
    <section id="ai-predictor" className="py-8 sm:py-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-1">
            <Wand2 className="w-3.5 h-3.5" />
            Predictor con Inteligencia Artificial
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            ¿Tu profesión no está en la lista? Pregúntale a la IA
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Escribe cualquier puesto de trabajo — sin importar qué tan específico o poco común sea — y genera un diagnóstico de impacto de IA al instante, igual de detallado que los roles curados.
          </p>
        </div>

        {/* Input Form */}
        <div className="glass-panel rounded-2xl p-5 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Escribe tu profesión u oficio
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ej. chofer de plataformas, community manager, veterinario..."
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="sm:w-56">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                País (opcional)
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                {COUNTRY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!jobTitle.trim() || status === 'loading'}
              className="shrink-0 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-purple-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{status === 'loading' ? 'Analizando...' : 'Generar diagnóstico'}</span>
            </button>
          </form>
        </div>

        {/* Historial: solo se muestra en reposo, para no competir con un resultado activo */}
        {status === 'idle' && history.length > 0 && (
          <div className="glass-panel rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-purple-300" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tu historial de consultas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl bg-dark-900 border border-slate-800 hover:border-purple-500/50 transition-all"
                >
                  <button
                    onClick={() => handleReopenHistoryEntry(entry)}
                    className="text-xs text-slate-200 hover:text-white font-medium"
                  >
                    {entry.job_title}
                  </button>
                  <button
                    onClick={() => handleDeleteHistoryEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                    title="Eliminar del historial"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/90 animate-pulse-slow">
            <div className="h-6 w-2/3 bg-dark-800 rounded mb-4" />
            <div className="h-4 w-full bg-dark-800 rounded mb-2" />
            <div className="h-4 w-5/6 bg-dark-800 rounded" />
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="glass-panel rounded-2xl p-5 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-rose-300 font-semibold mb-2">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}

        {/* Success: render the same diagnosis card as the curated simulator. The roadmap
            button here generates a plan a medida via /api/generate-roadmap instead of
            picking one of the 3 fixed RESKILLING_PATHS. */}
        {status === 'success' && result && (
          <RoleDiagnosisCard
            role={result}
            onSelectRoleForRoadmap={handleGenerateRoadmap}
            isGeneratingRoadmap={generatingRoadmap}
            roadmapError={roadmapError}
            userId={userId}
          />
        )}

      </div>
    </section>
  );
}
