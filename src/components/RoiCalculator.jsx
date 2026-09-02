import React, { useState } from 'react';
import {
  Calculator,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { ROI_SKILLS_DATA } from '../data/futureJobsData';

export default function RoiCalculator() {
  const [currentSalaryMonthly, setCurrentSalaryMonthly] = useState(2500); // USD
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(10); // Hours/week
  const [selectedSkillId, setSelectedSkillId] = useState(ROI_SKILLS_DATA[0].id);

  const activeSkill = ROI_SKILLS_DATA.find(s => s.id === selectedSkillId) || ROI_SKILLS_DATA[0];

  // Mathematical Projections
  const salaryIncreasePercent = Math.round((activeSkill.baseSalaryMultiplier - 1) * 100);
  const newSalaryMonthly = Math.round(currentSalaryMonthly * activeSkill.baseSalaryMultiplier);
  const monthlySalaryGain = newSalaryMonthly - currentSalaryMonthly;
  const annualSalaryGain = monthlySalaryGain * 12;
  const threeYearsGain = annualSalaryGain * 3;

  // Weeks needed to complete the course hours based on weekly pace
  const weeksToComplete = Math.ceil(activeSkill.studyHoursNeeded / Math.max(1, studyHoursPerWeek));
  const monthsToComplete = (weeksToComplete / 4.3).toFixed(1);

  // Time in days of post-course work to recoup cost
  const dailyGain = monthlySalaryGain / 22; // 22 work days
  const daysToRecoup = Math.max(1, Math.ceil(activeSkill.costUSD / dailyGain));

  return (
    <section id="roi-calculator" className="py-8 sm:py-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            Simulación Financiera de Capacitación
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Calculadora de Retorno de Inversión (ROI) en Aprendizaje
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Descubre el incremento salarial real y la plusvalía económica a 3 años al capacitarte en una de las habilidades tecnológicas clave.
          </p>
        </div>

        {/* 2-Column Grid: Inputs & Sliders on Left, Visual Output Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls / Inputs (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-6">
            
            {/* Skill Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                1. Selecciona la Habilidad que deseas adquirir:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ROI_SKILLS_DATA.map((skill) => {
                  const isSelected = skill.id === activeSkill.id;
                  const percent = Math.round((skill.baseSalaryMultiplier - 1) * 100);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10' 
                          : 'bg-dark-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">
                          {skill.name}
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          +{percent}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {skill.category} • Costo est. ${skill.costUSD} USD
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Salary Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  2. Tu Salario Mensual Actual (USD):
                </label>
                <span className="text-lg font-extrabold text-cyan-400 bg-dark-900 px-3 py-1 rounded-lg border border-slate-800">
                  ${currentSalaryMonthly.toLocaleString()} USD/mes
                </span>
              </div>
              <input
                type="range"
                min="600"
                max="10000"
                step="100"
                value={currentSalaryMonthly}
                onChange={(e) => setCurrentSalaryMonthly(Number(e.target.value))}
                className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>$600 USD</span>
                <span>$5,000 USD</span>
                <span>$10,000 USD</span>
              </div>
            </div>

            {/* Study Hours Dedicated per Week */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  3. Horas semanales que puedes dedicar al estudio:
                </label>
                <span className="text-lg font-extrabold text-purple-400 bg-dark-900 px-3 py-1 rounded-lg border border-slate-800">
                  {studyHoursPerWeek} hrs / semana
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="25"
                step="1"
                value={studyHoursPerWeek}
                onChange={(e) => setStudyHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>4 hrs (Ritmo suave)</span>
                <span>12 hrs (Ritmo ideal)</span>
                <span>25 hrs (Inmersión intensiva)</span>
              </div>
            </div>

            {/* Timing Estimation Box */}
            <div className="p-3.5 rounded-xl bg-dark-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Tiempo para dominar la habilidad con tu ritmo:</span>
              </div>
              <span className="font-bold text-cyan-300 text-sm">
                ~{monthsToComplete} meses ({weeksToComplete} semanas)
              </span>
            </div>

          </div>

          {/* Real-time ROI Financial Output (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Crecimiento Salarial Estimado: +{salaryIncreasePercent}%
                </span>
                <span className="text-[11px] text-slate-400">
                  Proyección WEF
                </span>
              </div>

              {/* Monthly New Salary */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                  Nuevo Salario Proyectado Mensual
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  ${newSalaryMonthly.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD/mes</span>
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                  +${monthlySalaryGain.toLocaleString()} USD extras cada mes
                </div>
              </div>

              {/* Accumulative Gains Table */}
              <div className="space-y-3 bg-dark-900/90 p-4 rounded-xl border border-slate-800 mb-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Plusvalía neta anual (12 meses):</span>
                  <span className="font-extrabold text-white text-sm">
                    +${annualSalaryGain.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-300 font-semibold">Beneficio Acumulado a 3 Años:</span>
                  <span className="font-black text-emerald-400 text-base">
                    +${threeYearsGain.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Recuperación del costo (${activeSkill.costUSD} USD):</span>
                  <span className="font-bold text-cyan-300">
                    En tan sólo {daysToRecoup} días laborales
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom summary advice */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-300 mb-1 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Por qué esta habilidad vale la pena:
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                {activeSkill.highlight}
              </p>
              
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 text-center font-bold">
                Retorno de Inversión superior al {Math.round((threeYearsGain / activeSkill.costUSD) * 100)}% a 36 meses
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
