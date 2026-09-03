import React, { useState } from 'react';
import { Sparkles, Search, Wand2, AlertTriangle, RotateCcw } from 'lucide-react';
import RoleDiagnosisCard from './RoleDiagnosisCard';
import { supabase } from '../lib/supabaseClient';

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

export default function AIRolePredictor({ onSelectRoleForRoadmap }) {
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState('');

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
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('No pudimos conectar con el servicio de predicción. Verifica tu conexión e intenta de nuevo.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
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

        {/* Success: render the same diagnosis card as the curated simulator */}
        {status === 'success' && result && (
          <RoleDiagnosisCard role={result} onSelectRoleForRoadmap={onSelectRoleForRoadmap} />
        )}

      </div>
    </section>
  );
}
