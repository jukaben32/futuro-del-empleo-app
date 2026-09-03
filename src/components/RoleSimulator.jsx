import React, { useState } from 'react';
import {
  Compass,
  Search,
  User
} from 'lucide-react';
import { SIMULATOR_ROLES } from '../data/futureJobsData';
import RoleDiagnosisCard from './RoleDiagnosisCard';

export default function RoleSimulator({ onSelectRoleForRoadmap }) {
  const [selectedRoleId, setSelectedRoleId] = useState(SIMULATOR_ROLES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeRole = SIMULATOR_ROLES.find(r => r.id === selectedRoleId) || SIMULATOR_ROLES[0];

  const filteredRoles = SIMULATOR_ROLES.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <RoleDiagnosisCard role={activeRole} onSelectRoleForRoadmap={onSelectRoleForRoadmap} />

      </div>
    </section>
  );
}
