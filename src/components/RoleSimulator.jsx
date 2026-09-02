import React, { useState } from 'react';
import {
  Bot,
  User,
  Sparkles,
  Compass,
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { SIMULATOR_ROLES } from '../data/futureJobsData';

export default function RoleSimulator({ onSelectRoleForRoadmap }) {
  const [selectedRoleId, setSelectedRoleId] = useState(SIMULATOR_ROLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeRole = SIMULATOR_ROLES.find(r => r.id === selectedRoleId) || SIMULATOR_ROLES[0];

  const filteredRoles = SIMULATOR_ROLES.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic risk styling
  const getScoreColor = (score) => {
    if (score < 40) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' };
    if (score < 70) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/40', glow: 'shadow-rose-500/20' };
  };

  const scoreTheme = getScoreColor(activeRole.automationScore);

  return (
    <section id="simulator" className="py-8 sm:py-10 border-t border-slate-800/80 bg-gradient-to-b from-transparent via-dark-950/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Simulador de Impacto Personalizado
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            ¿Qué tan reemplazable es mi rol por la IA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Selecciona tu profesión para calcular tu nivel de exposición frente a los algoritmos y descubrir exactamente qué tareas pasarán a la IA y dónde tu criterio humano es insustituible.
          </p>
        </div>

        {/* Role Selector Grid / Search */}
        <div className="glass-panel rounded-2xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              Selecciona o busca tu puesto de trabajo actual:
            </label>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar rol (ej. Médico, Programador)..."
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Role Pill Buttons */}
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 scrollbar-thin">
            {filteredRoles.map((role) => {
              const isSelected = role.id === activeRole.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20 scale-105'
                      : 'bg-dark-900/90 text-slate-300 hover:text-white hover:bg-dark-800 border border-slate-800'
                  }`}
                >
                  <span>{role.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black font-bold' : 'bg-dark-800 text-slate-400'}`}>
                    {role.automationScore}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnosis & Detailed Comparison Card */}
        <div className={`glass-panel rounded-2xl p-6 border ${scoreTheme.border} relative overflow-hidden transition-all duration-300 shadow-2xl ${scoreTheme.glow}`}>
          
          {/* Top Banner with Score Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-slate-800/80">
            
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeRole.badgeColor}`}>
                  Nivel de Riesgo: {activeRole.riskLevel}
                </span>
                <span className="text-xs text-slate-400">
                  Sector: <strong className="text-slate-200 capitalize">{activeRole.sector}</strong>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {activeRole.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeRole.summary}
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
                    strokeDasharray={`${activeRole.automationScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-2xl font-black ${scoreTheme.text}`}>
                    {activeRole.automationScore}%
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase">Impacto IA</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center">
                {activeRole.automationScore > 70 
                  ? 'Alta urgencia de reskilling hacia tareas analíticas o humanas.' 
                  : activeRole.automationScore > 40 
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
                {activeRole.aiWillDo.map((task, idx) => (
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
                {activeRole.humanWillDo.map((task, idx) => (
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
                {activeRole.survivalAdvice}
              </p>
            </div>

            {onSelectRoleForRoadmap && (
              <button
                onClick={() => onSelectRoleForRoadmap(activeRole.targetTransitionRole)}
                className="shrink-0 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
              >
                <span>Ver Plan de Reskilling</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
