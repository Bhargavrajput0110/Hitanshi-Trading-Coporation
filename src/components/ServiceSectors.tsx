import { useState } from 'react';
import { STRATEGIC_SECTORS } from '../data';
import { Target, CheckSquare, Layers, Award } from 'lucide-react';

export default function ServiceSectors() {
  const [selectedSector, setSelectedSector] = useState<string>('jjm'); // Default to showing JJM on load

  const activeSector = STRATEGIC_SECTORS.find(s => s.id === selectedSector) || STRATEGIC_SECTORS[0];

  return (
    <section id="sectors-section" className="bg-primary py-16 text-white border-y border-outline relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pb-6 border-b border-white/10">
          <div>
            <h2 className="text-3xl md:text-4xl font-light font-serif tracking-tight text-white mb-1">
              Strategic Service <span className="italic block sm:inline">Sectors</span>
            </h2>
            <p className="text-[10px] font-sans tracking-[0.2em] text-[#8b7355] uppercase font-bold mt-1.5 animate-pulse">
              National Infrastructure Footprints
            </p>
          </div>
          <p className="text-on-primary-container text-xs sm:text-sm max-w-xl border-l border-secondary pl-6 leading-relaxed font-sans font-light select-none">
            Supplying essential infrastructure components to major government and private development missions across India. Click on any segment block below to review project details.
          </p>
        </div>

        {/* 7 Columns Grid Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {STRATEGIC_SECTORS.map((sector) => {
            const isSelected = sector.id === selectedSector;
            return (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(sector.id)}
                className={`flex flex-col items-center p-5 border cursor-pointer text-center group transition-all duration-300 ${
                  isSelected
                    ? 'bg-secondary border-secondary text-white transform scale-102 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-secondary/50 hover:bg-white/10 text-surface-dim'
                }`}
              >
                {/* Visual sequence number */}
                <span className={`font-serif italic text-3xl font-light pb-1 ${
                  isSelected ? 'text-white' : 'text-secondary/70 group-hover:text-secondary group-hover:opacity-100'
                }`}>
                  {sector.code}
                </span>
                
                {/* Short identifier */}
                <span className="font-sans font-bold text-[10px] tracking-[0.15em] uppercase block mt-2 text-white/90">
                  {sector.name}
                </span>
                
                {/* Under label */}
                <span className={`text-[9px] mt-1.5 line-clamp-2 block leading-snug font-sans font-light ${
                  isSelected ? 'text-white/80' : 'text-on-primary-container'
                }`}>
                  {sector.fullTitle}
                </span>

                {/* Micro-interaction small dot */}
                <div className={`w-1 h-1 rounded-none mt-3 transition-colors ${
                  isSelected ? 'bg-white' : 'bg-transparent group-hover:bg-secondary'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Active Mission Details Expansion Frame */}
        {activeSector && (
          <div className="mt-8 bg-white/5 border border-white/10 p-6 md:p-8 rounded-none grid grid-cols-1 md:grid-cols-12 gap-6 animate-fadeIn text-left">
            
            {/* Mission profile summary */}
            <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <div className="inline-flex items-center gap-2 text-[#8b7355] font-sans text-[9px] uppercase font-bold tracking-[0.2em]">
                <Target className="w-4 h-4" />
                Selected Sector Profile
              </div>
              <div>
                <span className="text-secondary font-serif font-light text-2xl select-all">
                  {activeSector.code}
                </span>
                <h3 className="text-lg font-bold font-serif italic text-white tracking-tight leading-tight uppercase mt-1">
                  {activeSector.fullTitle}
                </h3>
              </div>
              <p className="text-xs text-on-primary-container leading-relaxed font-sans font-light">
                {activeSector.description}
              </p>
            </div>

            {/* Logistics supply validation checklist */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-4 md:pl-4">
              <div className="inline-flex items-center gap-2 text-[#8b7355] font-sans text-[9px] uppercase font-bold tracking-[0.2em]">
                <Layers className="w-4 h-4" />
                Project Allocation Logs &amp; Delivered Batches
              </div>
              
              <div className="space-y-3.5">
                {activeSector.missionDetails.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="p-1 bg-white/10 text-secondary rounded-none mt-0.5 flex-shrink-0">
                      <CheckSquare className="w-3.5 h-3.5" />
                    </span>
                    <p className="text-xs sm:text-sm text-surface-dim font-sans font-light leading-relaxed select-all">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Verified Quality statement */}
              <div className="pt-2 flex items-center gap-2 text-[10px] font-sans tracking-wide text-[#7586a5] bg-white/2 bg-opacity-10 p-3 border border-white/5 select-none">
                <Award className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span>Pre-dispatched &amp; approved via direct lab hydrostatic pressure certificates for {activeSector.name} tenders.</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
