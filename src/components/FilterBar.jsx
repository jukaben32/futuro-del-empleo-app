import React from 'react';
import { 
  Globe, 
  Cpu, 
  TrendingUp, 
  Activity, 
  BookOpen, 
  Zap, 
  ShoppingBag, 
  MapPin, 
  Filter 
} from 'lucide-react';
import { SECTORS_LIST, REGIONS_LIST } from '../data/futureJobsData';

const iconMap = {
  Globe: Globe,
  Cpu: Cpu,
  TrendingUp: TrendingUp,
  Activity: Activity,
  BookOpen: BookOpen,
  Zap: Zap,
  ShoppingBag: ShoppingBag
};

export default function FilterBar({ 
  selectedSector, 
  onSelectSector, 
  selectedRegion, 
  onSelectRegion 
}) {
  return (
    <section className="bg-dark-900/60 border-b border-slate-800/80 sticky top-0 z-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Sector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1 font-medium shrink-0">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sector:</span>
            </div>
            
            {SECTORS_LIST.map((sector) => {
              const Icon = iconMap[sector.icon] || Globe;
              const isSelected = selectedSector === sector.id;
              return (
                <button
                  key={sector.id}
                  onClick={() => onSelectSector(sector.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                      : 'bg-dark-800/70 text-slate-400 hover:text-slate-200 hover:bg-dark-800 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  {sector.name}
                </button>
              );
            })}
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Región:</span>
            </div>
            
            <div className="flex items-center bg-dark-800 rounded-lg p-0.5 border border-slate-700/60">
              {REGIONS_LIST.map((region) => {
                const isSelected = selectedRegion === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => onSelectRegion(region.id)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {region.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
