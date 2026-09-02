import React, { useState } from 'react';
import {
  Award,
  Brain,
  Cpu,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { TOP_SKILLS } from '../data/futureJobsData';

export default function FutureSkills() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSkill, setActiveSkill] = useState(TOP_SKILLS[0]);

  const filteredSkills = selectedCategory === 'all'
    ? TOP_SKILLS
    : TOP_SKILLS.filter(s => s.category === selectedCategory);

  return (
    <section className="py-8 sm:py-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-1">
              <Award className="w-3.5 h-3.5" />
              Capital Humano & Empleabilidad
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Top Habilidades del Futuro (2025–2030)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Las competencias cognitivas, tecnológicas y humanas más priorizadas por directores de RRHH a nivel global.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center bg-dark-900 rounded-xl p-1 border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas las Habilidades
            </button>
            <button
              onClick={() => setSelectedCategory('cognitive')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'cognitive' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              Cognitivas
            </button>
            <button
              onClick={() => setSelectedCategory('technological')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'technological' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Tecnológicas
            </button>
            <button
              onClick={() => setSelectedCategory('human')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'human' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Humanas / Agilidad
            </button>
          </div>
        </div>

        {/* Main Grid: Bar Chart on Left, Selected Skill Deep Dive on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Interactive Bar Chart (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Demanda por parte de Empleadores (% Encuestados WEF)
              </span>
              <span className="text-[11px] text-cyan-400">
                Haz clic en una habilidad para ver detalles
              </span>
            </div>

            <div className="space-y-4">
              {filteredSkills.map((skill) => {
                const isSelected = activeSkill.id === skill.id;
                return (
                  <div 
                    key={skill.id}
                    onClick={() => setActiveSkill(skill)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-dark-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                        : 'bg-dark-900/50 border-slate-800/70 hover:border-slate-700 hover:bg-dark-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-dark-950 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-slate-700">
                          {skill.importanceRank}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-100">
                          {skill.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {skill.growthRate}
                        </span>
                        <span className="text-xs font-extrabold text-white">
                          {skill.demandPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-dark-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-700`}
                        style={{ width: `${skill.demandPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <span className="capitalize">{skill.categoryLabel}</span>
                      <span className="text-slate-500">Prioridad Estratégica #{skill.importanceRank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep Dive on Active Skill (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-purple-500/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {activeSkill.categoryLabel}
                </span>
                <span className="text-xs text-slate-400">
                  Ranking #{activeSkill.importanceRank} Global
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white mb-3">
                {activeSkill.name}
              </h3>

              <div className="p-3.5 rounded-xl bg-dark-900/90 border border-slate-800 mb-4">
                <div className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                  Definición & Alcance Clave
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeSkill.description}
                </p>
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Demanda de mercado:</strong> El <strong className="text-white">{activeSkill.demandPercent}%</strong> de los líderes empresariales la consideran prioritaria para contrataciones inmediatas.</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Aceleración interanual:</strong> Crecimiento estimado del <strong className="text-emerald-400">{activeSkill.growthRate}</strong> en los planes de capacitación corporativos.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Sinergia con IA:</strong> Es una habilidad que la IA no puede replicar por sí sola, sino que actúa como amplificador.</span>
                </div>
              </div>
            </div>

            {/* Strategic Prompt Action */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-1">
                ¿Cómo entrenar esta habilidad hoy?
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Dedica 3 a 5 horas semanales a proyectos prácticos donde resuelvas casos abiertos guiados por pensamiento crítico.
              </p>
              <a
                href="#reskilling"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all"
              >
                Ver Hoja de Ruta de Aprendizaje
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
