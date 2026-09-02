import React from 'react';
import { Sparkles, Globe, Shield, ArrowUp, BookOpen } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-dark-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-base font-extrabold text-white">
                Futuro del Empleo en la Era de IA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Herramienta de visualización analítica construida para orientar a profesionales, estudiantes y líderes organizacionales en la transición hacia la economía aumentada por Inteligencia Artificial (2025–2030).
            </p>
            <div className="text-[11px] text-slate-500">
              Datos basados en el <strong className="text-slate-300">World Economic Forum (Future of Jobs Report)</strong> e investigaciones de adopción de IA Generativa.
            </div>
          </div>

          {/* Methodology */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Fuentes & Metodología
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>World Economic Forum (WEF)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                <span>OECD AI Employment Observatory</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coursera & DeepLearning.AI Trends</span>
              </li>
            </ul>
          </div>

          {/* Quick navigation */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Módulos Interactivos
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#simulator" className="hover:text-cyan-300 transition-colors">Simulador de Rol Personal</a></li>
              <li><a href="#comparator" className="hover:text-cyan-300 transition-colors">Comparador Lado a Lado</a></li>
              <li><a href="#reskilling" className="hover:text-cyan-300 transition-colors">Mapa de Ruta de Reskilling</a></li>
              <li><a href="#roi-calculator" className="hover:text-cyan-300 transition-colors">Calculadora de ROI Salarial</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            Diseñado con React, Vite y Tailwind CSS. Proyecciones orientativas basadas en datos del WEF.
          </p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 text-slate-300 text-xs border border-slate-800 hover:border-slate-700 transition-all"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
