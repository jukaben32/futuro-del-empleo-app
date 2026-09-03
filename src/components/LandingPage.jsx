import React from 'react';
import {
  Sparkles,
  Wand2,
  Compass,
  GitCompare,
  Map,
  History,
  Calculator,
  Share2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Globe,
  Shield,
  BookOpen
} from 'lucide-react';
import { HERO_GLOBAL_STATS } from '../data/futureJobsData';

const FEATURES = [
  {
    icon: Wand2,
    color: 'purple',
    title: 'Diagnóstico con IA para cualquier profesión',
    description: 'Escribe cualquier puesto de trabajo, sin importar qué tan específico o poco común sea, y recibe un análisis estructurado de impacto de IA al instante.'
  },
  {
    icon: Compass,
    color: 'rose',
    title: 'Simulador de 9 roles curados',
    description: 'Contador, desarrollador, médico, docente y más — diagnósticos de referencia listos para explorar sin esperar nada.'
  },
  {
    icon: GitCompare,
    color: 'cyan',
    title: 'Comparador cabeza a cabeza',
    description: 'Enfrenta dos puestos de trabajo y contrasta su nivel de riesgo, tareas automatizables y proyección futura.'
  },
  {
    icon: Map,
    color: 'emerald',
    title: 'Plan de reskilling personalizado',
    description: 'La IA genera un plan de 3 fases específico a tu transición — herramientas, cursos y duración propios de tu sector, no genéricos.'
  },
  {
    icon: History,
    color: 'purple',
    title: 'Tu historial y progreso, guardados',
    description: 'Cada diagnóstico y cada casilla marcada en tu plan de reskilling se guarda en tu cuenta — recarga la página y sigue donde quedaste.'
  },
  {
    icon: Calculator,
    color: 'amber',
    title: 'Calculadora de ROI',
    description: 'Estima el retorno de invertir en formación: incremento salarial esperado frente al tiempo y costo de cada ruta.'
  }
];

const COLOR_CLASSES = {
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
};

export default function LandingPage({ onContinue }) {
  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 selection:bg-cyan-500 selection:text-black relative overflow-hidden">

      {/* Background ambient lighting (matches the rest of the app) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10">

        {/* Top bar */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-sm font-extrabold text-white hidden sm:inline">
              Futuro del Empleo en la Era de IA
            </span>
          </div>
          <button
            onClick={onContinue}
            className="px-4 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold transition-all"
          >
            Iniciar sesión
          </button>
        </header>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Informe Oficial WEF 2025-2030
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300 mb-5">
            ¿Tu trabajo tiene futuro en la era de la IA?
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Escribe tu profesión y recibe un diagnóstico generado por IA sobre qué tareas automatizará, dónde tu criterio humano sigue siendo indispensable y un plan de transición a medida — basado en las proyecciones del World Economic Forum para 2025-2030.
          </p>

          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 py-3 px-7 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <span>Generar mi diagnóstico gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-slate-500 mt-3">
            Sin contraseñas. Inicias sesión con un enlace de un solo uso a tu correo.
          </p>
        </section>

        {/* Stat strip — datos reales del WEF, no marketing inventado */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-2xl font-black">{HERO_GLOBAL_STATS.newRolesCreated}</span>
              </div>
              <div className="text-[11px] text-slate-400">roles nuevos proyectados a 2030</div>
            </div>
            <div className="glass-panel rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-400 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-2xl font-black">{HERO_GLOBAL_STATS.displacedJobs}</span>
              </div>
              <div className="text-[11px] text-slate-400">roles desplazados a 2030</div>
            </div>
            <div className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-cyan-400 mb-1">{HERO_GLOBAL_STATS.tasksAutomated2030}%</div>
              <div className="text-[11px] text-slate-400">de tareas automatizadas para 2030</div>
            </div>
            <div className="glass-panel rounded-2xl p-5 text-center">
              <div className="text-2xl font-black text-amber-400 mb-1">{HERO_GLOBAL_STATS.skillChurnPercent}%</div>
              <div className="text-[11px] text-slate-400">de habilidades clave cambiarán</div>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-3">{HERO_GLOBAL_STATS.sourceReport}</p>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
            Todo lo que puedes hacer al entrar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-panel glass-panel-hover rounded-2xl p-5">
                  <div className={`inline-flex p-2 rounded-xl border mb-3 ${COLOR_CLASSES[feature.color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
          <div className="glass-panel rounded-2xl p-8 border border-cyan-500/20">
            <Share2 className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Tu diagnóstico, listo para compartir
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-5 max-w-md mx-auto">
              Cada resultado se puede compartir con un enlace público — sin costo, sin tarjeta de crédito.
            </p>
            <button
              onClick={onContinue}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Comenzar ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Minimal footer — sin enlaces a secciones internas, esas viven solo dentro de la app logueada */}
        <footer className="border-t border-slate-800 py-8 text-slate-500 text-[11px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-400" /> World Economic Forum</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-purple-400" /> OECD AI Employment Observatory</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Datos 2025-2030</span>
            </div>
            <span>Diseñado con React, Vite y Tailwind CSS.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
