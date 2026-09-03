import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
import RoleDiagnosisCard from './RoleDiagnosisCard';
import { getSharedDiagnosis } from '../lib/userData';

// Pagina publica para un diagnostico compartido (/share/:id). No requiere sesion:
// se renderiza ANTES del gate de login en App.jsx. RoleDiagnosisCard oculta solo
// sus botones de accion (Ver Plan / Compartir) porque no recibe onSelectRoleForRoadmap
// ni userId aqui — es una lectura de solo texto, autocontenida.
export default function SharedDiagnosisView({ shareId }) {
  const [status, setStatus] = useState('loading'); // loading | found | notfound
  const [shared, setShared] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await getSharedDiagnosis(shareId);
      if (cancelled) return;
      if (data) {
        setShared(data);
        setStatus('found');
      } else {
        setStatus('notfound');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shareId]);

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 flex flex-col items-center px-4 py-10 sm:py-16 selection:bg-cyan-500 selection:text-black relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Diagnóstico compartido
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Futuro del Empleo en la Era de IA
          </h1>
        </div>

        {status === 'loading' && (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/90 animate-pulse-slow h-48" />
        )}

        {status === 'notfound' && (
          <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-300">Este enlace no existe o ya no está disponible.</p>
          </div>
        )}

        {status === 'found' && shared && (
          <>
            <RoleDiagnosisCard role={shared.diagnosis} />
            <div className="mt-6 text-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Genera tu propio diagnóstico</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
