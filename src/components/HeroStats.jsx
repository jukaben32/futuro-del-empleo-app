import React from 'react';
import {
  TrendingUp,
  Bot,
  RefreshCw,
  BrainCircuit,
  ArrowUpRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { HERO_GLOBAL_STATS, REGIONAL_METRICS, SECTORS_LIST } from '../data/futureJobsData';

export default function HeroStats({ selectedSector, selectedRegion }) {
  const currentRegion = REGIONAL_METRICS[selectedRegion] || REGIONAL_METRICS.global;
  const sectorObj = SECTORS_LIST.find(s => s.id === selectedSector);

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Hero Stats: Impacto Global del Empleo hacia 2030
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Métricas consolidadas de creación, desplazamiento y reequilibrio de tareas hombre-máquina.
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-800 border border-slate-700/80 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Filtro activo: <strong className="text-white">{sectorObj?.name}</strong> • <strong className="text-purple-300">{selectedRegion.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* 4 Main Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: Creación Neta de Empleos */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Balance Positivo
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              {currentRegion.netCreation}
            </div>
            <div className="text-xs font-semibold text-slate-200">Creación Neta de Empleos</div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {selectedRegion === 'global' ? (
                <>
                  <strong className="text-emerald-300">+170M</strong> puestos nuevos proyectados frente a <strong className="text-rose-300">92M</strong> desplazados por automatización a nivel global.
                </>
              ) : (
                <>Cifra regional para <strong className="text-purple-300">{selectedRegion.toUpperCase()}</strong>. El desglose de +170M/92M corresponde al total global.</>
              )}
            </p>
          </div>

          {/* Card 2: Balance de Tareas 2030 (IA vs Humanos) */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Bot className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                Horizonte 2030
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              {HERO_GLOBAL_STATS.tasksAutomated2030}% <span className="text-xs font-normal text-slate-400">IA</span> / {HERO_GLOBAL_STATS.tasksHuman2030}% <span className="text-xs font-normal text-slate-400">Humano</span>
            </div>
            <div className="text-xs font-semibold text-slate-200">Distribución de Tareas Operativas</div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              En 2023 la IA ejecutaba el 34%. Hacia 2030 casi la mitad de horas laborales operativas serán computacionales.
            </p>
          </div>

          {/* Card 3: Obsolescencia de Habilidades (Skill Churn) */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <RefreshCw className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Urgencia Reskilling
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              {HERO_GLOBAL_STATS.skillChurnPercent}%
            </div>
            <div className="text-xs font-semibold text-slate-200">Habilidades Núcleo a Transformarse</div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              4 de cada 10 competencias técnicas actuales requerirán reciclaje profesional antes de 2030 para mantener empleabilidad.
            </p>
          </div>

          {/* Card 4: Adopción Empresarial de GenAI */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Adopción Masiva
              </span>
            </div>
            
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              {HERO_GLOBAL_STATS.aiAdoptionCompanies}%
            </div>
            <div className="text-xs font-semibold text-slate-200">Empresas Transformando su Operación</div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              El 63% reporta que la falta de talento calificado en IA es su principal barrera para la transformación.
            </p>
          </div>

        </div>

        {/* Detailed Interactive Comparison: Evolución de Tareas 2023 vs 2030 & Regional Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Evolución Visual de Tareas */}
          <div className="glass-panel rounded-2xl p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  Evolución del Trabajo: Máquinas vs Humanos (2023 vs 2030)
                </h3>
                <p className="text-xs text-slate-400">
                  Porcentaje de tareas totales ejecutadas por algoritmos/IA vs intervención humana.
                </p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded bg-dark-800 text-slate-400 border border-slate-700">
                Proyección WEF
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* 2023 Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300 font-semibold">Línea Base (2023)</span>
                  <span className="text-slate-400">
                    IA: <strong className="text-cyan-400">34%</strong> • Humano: <strong className="text-emerald-400">66%</strong>
                  </span>
                </div>
                <div className="h-5 w-full bg-dark-900 rounded-lg overflow-hidden flex p-0.5 border border-slate-700/60">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-l transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ width: '34%' }}
                  >
                    34% IA
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ width: '66%' }}
                  >
                    66% Humano
                  </div>
                </div>
              </div>

              {/* 2030 Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-white font-semibold flex items-center gap-1">
                    Proyección (2030)
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                  </span>
                  <span className="text-slate-300">
                    IA: <strong className="text-cyan-400">48%</strong> (+14%) • Humano: <strong className="text-emerald-400">52%</strong>
                  </span>
                </div>
                <div className="h-6 w-full bg-dark-900 rounded-lg overflow-hidden flex p-0.5 border border-cyan-500/40 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-l transition-all duration-1000 flex items-center justify-center text-[11px] font-extrabold text-white"
                    style={{ width: '48%' }}
                  >
                    48% IA & Automatización
                  </div>
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-r transition-all duration-1000 flex items-center justify-center text-[11px] font-extrabold text-black"
                    style={{ width: '52%' }}
                  >
                    52% Criterio Humano
                  </div>
                </div>
              </div>
            </div>

            {/* Quick takeaways */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>El humano no desaparece:</strong> El 52% restante exige juicio crítico, ética, empatía y síntesis interdisciplinaria.</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong>El nuevo rol es el de orquestador:</strong> El profesional que delega a agentes IA rinde hasta 3x más que el manual.</span>
              </div>
            </div>
          </div>

          {/* Regional & Sector Spotlight Card */}
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Foco Regional: {selectedRegion.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {currentRegion.automationRate} Automatizable
                </span>
              </div>
              
              <h4 className="text-base font-bold text-white mb-2">
                {currentRegion.growthLeader}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {currentRegion.insight}
              </p>
            </div>

            <div className="bg-dark-900/80 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Puestos vulnerables en región:</span>
                <span className="font-semibold text-rose-400">{currentRegion.vulnerableShare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sector analizado:</span>
                <span className="font-semibold text-cyan-300">{sectorObj?.name}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
