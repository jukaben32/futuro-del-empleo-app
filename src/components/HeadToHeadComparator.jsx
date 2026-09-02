import React, { useState } from 'react';
import {
  GitCompare,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { TOP_GROWING_JOBS, TOP_DECLINING_JOBS } from '../data/futureJobsData';

export default function HeadToHeadComparator({ preselectedJobA, preselectedJobB }) {
  // Combine all jobs for comparison
  const allRoles = [
    ...TOP_GROWING_JOBS.map(j => ({ ...j, type: 'growing' })),
    ...TOP_DECLINING_JOBS.map(j => ({ ...j, type: 'declining' }))
  ];

  const [roleAId, setRoleAId] = useState(preselectedJobA ? preselectedJobA.id : allRoles[0].id);
  const [roleBId, setRoleBId] = useState(preselectedJobB ? preselectedJobB.id : allRoles[allRoles.length - 1].id);

  // Adjust selection during render when the user picks a new job from JobsComparison
  // (avoids an extra effect-driven render pass; see React docs on "adjusting state when a prop changes")
  const [lastPreselectedA, setLastPreselectedA] = useState(preselectedJobA);
  if (preselectedJobA !== lastPreselectedA) {
    setLastPreselectedA(preselectedJobA);
    if (preselectedJobA) setRoleAId(preselectedJobA.id);
  }

  const [lastPreselectedB, setLastPreselectedB] = useState(preselectedJobB);
  if (preselectedJobB !== lastPreselectedB) {
    setLastPreselectedB(preselectedJobB);
    if (preselectedJobB) setRoleBId(preselectedJobB.id);
  }

  const roleA = allRoles.find(r => r.id === roleAId) || allRoles[0];
  const roleB = allRoles.find(r => r.id === roleBId) || allRoles[allRoles.length - 1];

  return (
    <section id="comparator" className="py-8 sm:py-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            Análisis Comparativo Head-to-Head
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Modo Comparador Lado a Lado
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enfrenta dos profesiones para contrastar su demanda laboral, rango salarial, exposición a la IA y viabilidad a largo plazo.
          </p>
        </div>

        {/* Dual Selector Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Selector Rol A */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/30">
            <label className="text-xs font-bold text-cyan-300 block mb-2">
              Selecciona Rol #1 (Puesto A):
            </label>
            <select
              value={roleAId}
              onChange={(e) => setRoleAId(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
            >
              {allRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.type === 'growing' ? '🟢' : '🔴'} {r.name} ({r.growthRate})
                </option>
              ))}
            </select>
          </div>

          {/* Selector Rol B */}
          <div className="glass-panel p-4 rounded-xl border border-purple-500/30">
            <label className="text-xs font-bold text-purple-300 block mb-2">
              Selecciona Rol #2 (Puesto B):
            </label>
            <select
              value={roleBId}
              onChange={(e) => setRoleBId(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-purple-500"
            >
              {allRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.type === 'growing' ? '🟢' : '🔴'} {r.name} ({r.growthRate})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Card Rol A */}
          <div className={`glass-panel rounded-2xl p-6 border ${roleA.type === 'growing' ? 'border-emerald-500/30' : 'border-rose-500/30'} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                roleA.type === 'growing' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {roleA.type === 'growing' ? 'Rol en Auge (+)' : 'Rol en Declive (-)'}
              </span>
              <span className="text-lg font-black text-white">
                {roleA.growthRate}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              {roleA.name}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {roleA.description}
            </p>

            {/* Metrics List */}
            <div className="space-y-2.5 text-xs bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Salario estimado:
                </span>
                <span className="font-bold text-white">{roleA.avgSalaryUSD}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Riesgo de IA:
                </span>
                <span className={`font-bold ${roleA.type === 'growing' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {roleA.automationRisk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Demanda global:
                </span>
                <span className="font-bold text-white">{roleA.demandLevel || roleA.riskLevel}</span>
              </div>
            </div>

            {/* Role specific detail */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
              {roleA.type === 'growing' ? (
                <div>
                  <span className="text-slate-400 font-semibold">Habilidades clave:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {roleA.keySkills?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-dark-800 text-cyan-300 text-[10px] border border-cyan-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 font-semibold">Tareas más vulnerables:</span>
                  <ul className="list-disc list-inside text-rose-300/80 text-[11px] mt-1 space-y-0.5">
                    {roleA.vulnerableTasks?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Card Rol B */}
          <div className={`glass-panel rounded-2xl p-6 border ${roleB.type === 'growing' ? 'border-emerald-500/30' : 'border-rose-500/30'} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                roleB.type === 'growing' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {roleB.type === 'growing' ? 'Rol en Auge (+)' : 'Rol en Declive (-)'}
              </span>
              <span className="text-lg font-black text-white">
                {roleB.growthRate}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              {roleB.name}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {roleB.description}
            </p>

            {/* Metrics List */}
            <div className="space-y-2.5 text-xs bg-dark-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Salario estimado:
                </span>
                <span className="font-bold text-white">{roleB.avgSalaryUSD}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Riesgo de IA:
                </span>
                <span className={`font-bold ${roleB.type === 'growing' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {roleB.automationRisk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Demanda global:
                </span>
                <span className="font-bold text-white">{roleB.demandLevel || roleB.riskLevel}</span>
              </div>
            </div>

            {/* Role specific detail */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
              {roleB.type === 'growing' ? (
                <div>
                  <span className="text-slate-400 font-semibold">Habilidades clave:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {roleB.keySkills?.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-dark-800 text-cyan-300 text-[10px] border border-cyan-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 font-semibold">Tareas más vulnerables:</span>
                  <ul className="list-disc list-inside text-rose-300/80 text-[11px] mt-1 space-y-0.5">
                    {roleB.vulnerableTasks?.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Comparative Verdict Box */}
        <div className="glass-panel p-5 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-700/80">
          <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Veredicto Estratégico Comparado
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {roleA.type === 'growing' && roleB.type === 'declining' ? (
              <>
                <strong>{roleA.name}</strong> ofrece una clara ventaja de estabilidad a largo plazo y salarios hasta 3 veces superiores respecto a <strong>{roleB.name}</strong>. Si actualmente operas en el rol de {roleB.name}, adquirir competencias en automatización o análisis de datos es la mejor estrategia de transición.
              </>
            ) : roleA.type === 'declining' && roleB.type === 'growing' ? (
              <>
                <strong>{roleB.name}</strong> presenta un horizonte de expansión laboral del {roleB.growthRate} frente a la contracción del {roleA.growthRate} de <strong>{roleA.name}</strong>. La inversión en formación para migrar hacia {roleB.name} tiene un ROI proyectado sumamente elevado.
              </>
            ) : roleA.type === 'growing' && roleB.type === 'growing' ? (
              <>
                Ambos roles están en plena expansión tecnológica con excelente proyección. <strong>{roleA.name}</strong> destaca en {roleA.aiRole}, mientras que <strong>{roleB.name}</strong> complementa con alta resiliencia salarial.
              </>
            ) : (
              <>
                Ambas profesiones enfrentan presiones de automatización severas (&gt;70% de tareas computables). Es crítico que los profesionales de ambas áreas se capaciten inmediatamente en orquestación de herramientas de IA o habilidades humanas no replicables.
              </>
            )}
          </p>
        </div>

      </div>
    </section>
  );
}
