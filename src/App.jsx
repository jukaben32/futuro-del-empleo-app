import React, { useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import HeroStats from './components/HeroStats';
import JobsComparison from './components/JobsComparison';
import FutureSkills from './components/FutureSkills';
import RoleSimulator from './components/RoleSimulator';
import HeadToHeadComparator from './components/HeadToHeadComparator';
import ReskillingRoadmap from './components/ReskillingRoadmap';
import RoiCalculator from './components/RoiCalculator';
import Footer from './components/Footer';

export default function App() {
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('global');
  
  // Cross-component state bridges
  const [comparatorJobA, setComparatorJobA] = useState(null);
  const [comparatorJobB, setComparatorJobB] = useState(null);
  const [roadmapPathTarget, setRoadmapPathTarget] = useState(null);

  const handleSelectJobForComparison = (job) => {
    if (!comparatorJobA) {
      setComparatorJobA(job);
    } else {
      setComparatorJobB(job);
    }
    // Smooth scroll to comparator
    const el = document.getElementById('comparator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRoleTransitionToRoadmap = (targetRole) => {
    setRoadmapPathTarget(targetRole);
    const el = document.getElementById('reskilling');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header & Voice Summary */}
        <Header />

        {/* Global Filter Bar */}
        <FilterBar 
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Main Content Sections */}
        <main className="flex-1 space-y-4">
          
          {/* 1. Hero Stats (WEF 2025-2030) */}
          <HeroStats 
            selectedSector={selectedSector}
            selectedRegion={selectedRegion}
          />

          {/* 2. Top 5 Growing vs Top 5 Declining Jobs */}
          <JobsComparison 
            selectedSector={selectedSector}
            onSelectForComparison={handleSelectJobForComparison}
          />

          {/* 3. Top Skills of the Future */}
          <FutureSkills />

          {/* 4. Personalized Role Simulator */}
          <RoleSimulator 
            onSelectRoleForRoadmap={handleRoleTransitionToRoadmap}
          />

          {/* 5. Head-to-Head Job Comparator */}
          <HeadToHeadComparator 
            preselectedJobA={comparatorJobA}
            preselectedJobB={comparatorJobB}
          />

          {/* 6. Reskilling Action Plan & Roadmap */}
          <ReskillingRoadmap
            targetRole={roadmapPathTarget}
          />

          {/* 7. ROI Learning & Salary Growth Calculator */}
          <RoiCalculator />

        </main>

        {/* Footer */}
        <Footer />
      </div>

    </div>
  );
}
