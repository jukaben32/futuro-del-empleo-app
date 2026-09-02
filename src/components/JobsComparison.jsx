import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  GitCompare
} from 'lucide-react';
import { TOP_GROWING_JOBS, TOP_DECLINING_JOBS } from '../data/futureJobsData';

export default function JobsComparison({ selectedSector, onSelectForComparison }) {
  const [activeTab, setActiveTab] = useState('both'); // 'both', 'growing', 'declining'

  // Filter jobs based on sector if not 'all'
  const filteredGrowing = selectedSector === 'all'
    ? TOP_GROWING_JOBS
    : TOP_GROWING_JOBS.filter(j => j.sector === selectedSector);

  const filteredDeclining = selectedSector === 'all'
    ? TOP_DECLINING_JOBS
    : TOP_DECLINING_JOBS.filter(j => j.sector === selectedSector);

  return (
    <section className="py-8 sm:py-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Dinámica del Mercado Laboral 2025-2030
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Top 5 Empleos en Auge vs. Top 5 en Declive
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Contraste directo entre los roles con mayor demanda exponencial y los puestos de mayor absorción algorítmica.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-dark-900 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'both' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Comparativa Lado a Lado
            </button>
            <button
              onClick={() => setActiveTab('growing')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'growing' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sólo en Auge (+%)
            </button>
            <button
              onClick={() => setActiveTab('declining')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'declining' ? 'bg-rose-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sólo en Declive (-%)
            </button>
          </div>
        </div>

        {/* Visual Bar Comparison Chart (Overview) */}
        <div className="glass-panel rounded-2xl p-5 mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Tasas de Crecimiento y Caída Proyectadas (% a 2030)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Growing Bar Chart */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-emerald-500/20">
                <TrendingUp className="w-4 h-4" /> Top Empleos en Auge (Expansión Neta)
              </div>
              {filteredGrowing.slice(0, 5).map((job) => (
                <div key={job.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200 truncate pr-2">{job.name}</span>
                    <span className="text-emerald-400 font-bold shrink-0">{job.growthRate}</span>
                  </div>
                  <div className="h-2.5 w-full bg-dark-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                      style={{ width: `${job.growthValue * 1.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Declining Bar Chart */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 pb-1 border-b border-rose-500/20">
                <TrendingDown className="w-4 h-4" /> Top Empleos en Declive (Desplazamiento)
              </div>
              {filteredDeclining.slice(0, 5).map((job) => (
                <div key={job.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-200 truncate pr-2">{job.name}</span>
                    <span className="text-rose-400 font-bold shrink-0">{job.growthRate}</span>
                  </div>
                  <div className="h-2.5 w-full bg-dark-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${job.declineValue * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Interactive Cards Comparison Grid */}
        <div className={`grid grid-cols-1 ${activeTab === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          
          {/* Top Growing Column */}
          {(activeTab === 'both' || activeTab === 'growing') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  Roles Emergentes & En Auge
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredGrowing.length} roles identificados
                </span>
              </div>

              <div className="space-y-3">
                {filteredGrowing.length === 0 && (
                  <div className="glass-panel rounded-xl p-4 border border-slate-800 text-xs text-slate-400 text-center">
                    No hay roles en auge identificados para este sector.
                  </div>
                )}
                {filteredGrowing.map((job) => (
                  <div
                    key={job.id}
                    className="glass-panel glass-panel-hover rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer"
                    onClick={() => onSelectForComparison && onSelectForComparison(job)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                            {job.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                          {job.growthRate}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Crecimiento anual</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1 text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">{job.avgSalaryUSD}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        Riesgo de automatización: <strong className="text-slate-200">{job.automationRisk}</strong>
                      </div>

                      {onSelectForComparison && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectForComparison(job);
                          }}
                          className="px-2 py-1 rounded bg-dark-800 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-semibold flex items-center gap-1 border border-cyan-500/30 ml-auto"
                        >
                          <GitCompare className="w-3 h-3" />
                          Comparar Lado a Lado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Declining Column */}
          {(activeTab === 'both' || activeTab === 'declining') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                  <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                    <TrendingDown className="w-4 h-4" />
                  </span>
                  Roles Vulnerables & En Declive
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredDeclining.length} roles en contracción
                </span>
              </div>

              <div className="space-y-3">
                {filteredDeclining.length === 0 && (
                  <div className="glass-panel rounded-xl p-4 border border-slate-800 text-xs text-slate-400 text-center">
                    No hay roles en declive identificados para este sector.
                  </div>
                )}
                {filteredDeclining.map((job) => (
                  <div
                    key={job.id}
                    className="glass-panel glass-panel-hover rounded-xl p-4 border border-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer"
                    onClick={() => onSelectForComparison && onSelectForComparison(job)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white group-hover:text-rose-300">
                            {job.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                          {job.description}
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                          {job.growthRate}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">Contracción neta</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1 text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-slate-300">{job.avgSalaryUSD}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        Riesgo: <strong className="text-rose-300">{job.automationRisk}</strong>
                      </div>

                      {onSelectForComparison && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectForComparison(job);
                          }}
                          className="px-2 py-1 rounded bg-dark-800 hover:bg-rose-500/20 text-rose-400 text-[10px] font-semibold flex items-center gap-1 border border-rose-500/30 ml-auto"
                        >
                          <GitCompare className="w-3 h-3" />
                          Comparar Lado a Lado
                        </button>
                      )}
                    </div>

                    {/* Transition recommendation pill */}
                    <div className="mt-2.5 p-2 rounded-lg bg-dark-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-400">Ruta de reskilling sugerida:</span>
                      <span className="font-semibold text-cyan-300 flex items-center gap-1">
                        {job.bestReskillingTarget}
                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
