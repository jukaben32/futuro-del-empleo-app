import React, { useState } from 'react';
import { Sparkles, Mail, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setStatus('sending');
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: { emailRedirectTo: window.location.origin }
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('sent');
    }
  };

  const handleUseAnotherEmail = () => {
    setStatus('idle');
    setEmail('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 flex flex-col items-center justify-center px-4 selection:bg-cyan-500 selection:text-black relative overflow-hidden">

      {/* Background ambient lighting (matches App.jsx) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Informe Oficial WEF 2025-2030
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300">
            Futuro del Empleo en la Era de IA
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Inicia sesión con tu correo para acceder a la plataforma completa, sin costo.
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/90">
          {status === 'sent' ? (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-sm font-bold text-white mb-1.5">Revisa tu correo</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enviamos un enlace de acceso a <strong className="text-slate-200">{email}</strong>. Ábrelo desde este mismo dispositivo para entrar.
              </p>
              <button
                onClick={handleUseAnotherEmail}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Tu correo electrónico
              </label>
              <div className="relative mb-4">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  disabled={status === 'sending'}
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-60"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage || 'No pudimos enviar el enlace. Intenta de nuevo.'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>{status === 'sending' ? 'Enviando enlace...' : 'Enviar enlace mágico'}</span>
                {status !== 'sending' && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-4">
                Sin contraseñas. Te enviamos un enlace de un solo uso para entrar.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
