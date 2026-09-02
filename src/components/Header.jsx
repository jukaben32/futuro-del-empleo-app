import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  Bot,
  Radio
} from 'lucide-react';
import { EXECUTIVE_AUDIO_SUMMARY } from '../data/futureJobsData';

export default function Header() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported] = useState(() => 'speechSynthesis' in window);
  const [showTranscript, setShowTranscript] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStartAudio = () => {
    if (!supported) {
      alert('Tu navegador no soporta síntesis de voz (Web Speech API).');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(EXECUTIVE_AUDIO_SUMMARY);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding a natural Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Microsoft')));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    } else {
      const anySpanish = voices.find(v => v.lang.startsWith('es'));
      if (anySpanish) utterance.voice = anySpanish;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePauseAudio = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <header className="relative z-20 border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Brand & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Informe Oficial WEF 2025-2030
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                <Radio className="w-3 h-3 animate-ping text-purple-400" />
                Inteligencia Predictiva
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300">
              Futuro del Empleo en la Era de IA
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Plataforma interactiva de analítica laboral, simulador de automatización de puestos, hoja de ruta de reskilling y calculadora de ROI.
            </p>
          </div>

          {/* Audio Executive Summary Control */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <div className={`relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all ${
              isPlaying 
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                : 'bg-dark-900/90 border-slate-700/60 hover:border-slate-600'
            }`}>
              
              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <div className="flex items-center gap-1 h-5 w-6">
                    <span className="w-1 bg-cyan-400 rounded-full animate-soundwave h-full" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1 bg-cyan-300 rounded-full animate-soundwave h-3/4" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1 bg-cyan-400 rounded-full animate-soundwave h-full" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 bg-cyan-200 rounded-full animate-soundwave h-1/2" style={{ animationDelay: '0.4s' }} />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                    <Volume2 className="w-4 h-4" />
                  </div>
                )}
                
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    Resumen con Voz
                    {isPlaying && <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isPlaying ? 'Reproduciendo briefing...' : isPaused ? 'Audio pausado' : 'Audio ejecutivo 60 seg'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 ml-2">
                {!isPlaying ? (
                  <button
                    onClick={handleStartAudio}
                    className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors flex items-center gap-1 text-xs shadow-md"
                    title="Reproducir resumen ejecutivo"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Escuchar</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseAudio}
                    className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                    title="Pausar audio"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                )}

                {(isPlaying || isPaused) && (
                  <button
                    onClick={handleStopAudio}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Detener audio"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                    showTranscript ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Ver texto del resumen"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Expandable Audio Transcript */}
        {showTranscript && (
          <div className="mt-3 p-4 rounded-xl bg-dark-900/95 border border-purple-500/30 shadow-2xl animate-slide-down">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" />
                Transcripción del Resumen Ejecutivo
              </span>
              <button 
                onClick={() => setShowTranscript(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cerrar
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{EXECUTIVE_AUDIO_SUMMARY}"
            </p>
          </div>
        )}

      </div>
    </header>
  );
}
