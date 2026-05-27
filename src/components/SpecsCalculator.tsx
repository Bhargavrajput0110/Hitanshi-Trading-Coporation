import { useState, useMemo } from 'react';
import { Ruler, Award, Plus, Calculator, Check, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HDPE_SPEC_CATALOG, PVC_SPEC_CATALOG } from '../data';

interface SpecsCalculatorProps {
  onAddToQuote: (item: {
    productName: string;
    category: string;
    details: string;
    quantity: number;
    weightEstimate: number;
  }) => void;
}

export default function SpecsCalculator({ onAddToQuote }: SpecsCalculatorProps) {
  const [material, setMaterial] = useState<'HDPE' | 'PVC'>('HDPE');
  const [diameterIdx, setDiameterIdx] = useState<number>(4); // Default to 110mm
  const [sdrIdx, setSdrIdx] = useState<number>(3); // Default to SDR 17 / PN6
  const [length, setLength] = useState<number>(500); // 500 meters default
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Sorting & Filtering parameter hooks
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [pressureFilter, setPressureFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'pressure' | 'size' | 'efficiency'>('default');

  // Pick the catalog based on material selection
  const catalog = useMemo(() => {
    return material === 'HDPE' ? HDPE_SPEC_CATALOG : PVC_SPEC_CATALOG;
  }, [material]);

  // Filtered and sorted list inside the active catalog
  const processedPipes = useMemo(() => {
    let list = catalog.map((pipe, originalIdx) => {
      const maxPressure = Math.max(...pipe.sdrOptions.map(opt => {
        const match = opt.pn.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
      }));
      const minPressure = Math.min(...pipe.sdrOptions.map(opt => {
        const match = opt.pn.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
      }));
      const refWeight = Math.PI * pipe.sdrOptions[0].thickness * (pipe.od - pipe.sdrOptions[0].thickness) * (material === 'HDPE' ? 0.955 : 1.40) / 1000;
      return {
        pipe,
        originalIdx,
        maxPressure,
        minPressure,
        refWeight
      };
    });

    // Filter by size range
    if (sizeFilter === 'small') {
      list = list.filter(item => item.pipe.od <= 63);
    } else if (sizeFilter === 'medium') {
      list = list.filter(item => item.pipe.od > 63 && item.pipe.od <= 160);
    } else if (sizeFilter === 'large') {
      list = list.filter(item => item.pipe.od >= 160);
    }

    // Filter by operating pressure class
    if (pressureFilter === 'low') {
      list = list.filter(item => item.minPressure <= 5);
    } else if (pressureFilter === 'medium') {
      list = list.filter(item => item.pipe.sdrOptions.some(opt => {
        const match = opt.pn.match(/[\d.]+/);
        const p = match ? parseFloat(match[0]) : 0;
        return p >= 6 && p <= 10;
      }));
    } else if (pressureFilter === 'high') {
      list = list.filter(item => item.maxPressure >= 16);
    }

    // Sort by criteria
    if (sortBy === 'size') {
      list.sort((a, b) => a.pipe.od - b.pipe.od);
    } else if (sortBy === 'pressure') {
      list.sort((a, b) => b.maxPressure - a.maxPressure);
    } else if (sortBy === 'efficiency') {
      // Lightest relative unit weight is optimal
      list.sort((a, b) => a.refWeight - b.refWeight);
    }

    return list;
  }, [catalog, sizeFilter, pressureFilter, sortBy, material]);

  // Safely resolve active processed item
  const activeProcessedItem = useMemo(() => {
    const item = processedPipes.find(p => p.originalIdx === diameterIdx);
    if (item) return item;
    return processedPipes[0] || null;
  }, [processedPipes, diameterIdx]);

  const currentPipeSpec = useMemo(() => {
    return activeProcessedItem?.pipe || catalog[0];
  }, [activeProcessedItem, catalog]);

  const currentSdrSpec = useMemo(() => {
    const sdr = currentPipeSpec?.sdrOptions[sdrIdx] || currentPipeSpec?.sdrOptions[0];
    return sdr;
  }, [currentPipeSpec, sdrIdx]);

  // When material swaps, safely correct indexes
  const handleMaterialChange = (newMaterial: 'HDPE' | 'PVC') => {
    setMaterial(newMaterial);
    setDiameterIdx(material === 'HDPE' ? 2 : 2); // default safely
    setSdrIdx(0);
  };

  const handlePipeChange = (idx: number) => {
    setDiameterIdx(idx);
    setSdrIdx(0); // reset thickness choice to prevent overflow indexes
  };

  // Math-heavy Calculations:
  // Weight per meter (kg/m) = pi * thickness * (OD - thickness) * density / 1000
  // HDPE density: 0.955 g/cm³
  // PVC density: 1.40 g/cm³
  const computedValues = useMemo(() => {
    if (!currentPipeSpec || !currentSdrSpec) {
      return { kgPerMeter: 0, weightPerBar: 0, totalWeightKg: 0, totalWeightTonnes: 0 };
    }
    const od = currentPipeSpec.od;
    const thickness = currentSdrSpec.thickness;
    const density = material === 'HDPE' ? 0.955 : 1.40;

    const kgPerMeter = Math.PI * thickness * (od - thickness) * density / 1000;
    const weightPerBar = kgPerMeter * 6; // Standard 6 meter bar
    const totalWeightKg = kgPerMeter * length;
    const totalWeightTonnes = totalWeightKg / 1000;

    return {
      kgPerMeter: Number(kgPerMeter.toFixed(3)),
      weightPerBar: Number(weightPerBar.toFixed(2)),
      totalWeightKg: Math.round(totalWeightKg),
      totalWeightTonnes: Number(totalWeightTonnes.toFixed(2))
    };
  }, [currentPipeSpec, currentSdrSpec, material, length]);

  const handleAddToQuoteBag = () => {
    if (!currentPipeSpec || !currentSdrSpec) return;
    
    const details = `${currentPipeSpec.od}mm OD, Wall Thickness: ${currentSdrSpec.thickness}mm, Rating: ${currentSdrSpec.pn} (SDR ${currentSdrSpec.sdr})`;
    onAddToQuote({
      productName: `${material} High Performance Infrastructure Pipe`,
      category: material,
      details,
      quantity: length,
      weightEstimate: computedValues.totalWeightKg
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  return (
    <div id="calculator-section" className="bg-white border border-outline-variant/50 shadow-xl shadow-secondary/5 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all hover:shadow-2xl hover:shadow-secondary/10 duration-500">
      
      {/* Input controls panel */}
      <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
        <div>
          <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.15em] font-bold bg-[#8b7355]/8 px-2.5 py-1 rounded-md border border-[#8b7355]/20">BOQ Calculator</span>
          <h3 className="text-xl sm:text-2xl font-medium font-serif tracking-tight text-primary mt-2.5">
            Sizing &amp; BOQ <span className="italic">Estimator</span>
          </h3>
          <p className="text-xs text-on-surface-variant/75 font-sans font-light mt-1.5">
            Estimate real-time shipment load weights for logistics planning.
          </p>
        </div>

        {/* Material Selection */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-black">
            1. Select Infrastructure Medium
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleMaterialChange('HDPE')}
              className={`p-4 text-left border flex items-center justify-between cursor-pointer transition-all duration-300 rounded-2xl ${
                material === 'HDPE'
                  ? 'border-secondary bg-secondary/5 text-primary font-bold shadow-md shadow-secondary/5 ring-1 ring-secondary/30'
                  : 'border-outline-variant/70 hover:border-secondary/40 text-on-surface-variant bg-surface-lowest hover:bg-neutral-50/50'
              }`}
            >
              <div>
                <p className="text-sm font-bold font-sans">HDPE (PE-100)</p>
                <p className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] mt-1 font-bold">Standard: IS 4984</p>
              </div>
              <span className="text-[10px] bg-primary text-white font-mono font-semibold px-2 py-0.5 rounded-lg">0.955</span>
            </button>

            <button
              onClick={() => handleMaterialChange('PVC')}
              className={`p-4 text-left border flex items-center justify-between cursor-pointer transition-all duration-300 rounded-2xl ${
                material === 'PVC'
                  ? 'border-secondary bg-secondary/5 text-primary font-bold shadow-md shadow-secondary/5 ring-1 ring-secondary/30'
                  : 'border-outline-variant/70 hover:border-secondary/40 text-on-surface-variant bg-surface-lowest hover:bg-neutral-50/50'
              }`}
            >
              <div>
                <p className="text-sm font-bold font-sans">Rigid PVC (uPVC)</p>
                <p className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] mt-1 font-bold">Standard: IS 4985</p>
              </div>
              <span className="text-[10px] bg-primary text-white font-mono font-semibold px-2 py-0.5 rounded-lg">1.400</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pipeline Sorter & Filter Dock */}
        <div className="bg-[#faf8f5] border border-[#8b7355]/15 p-4 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2.5 border-b border-outline-variant/30">
            <div className="flex items-center gap-2 select-none">
              <span className="p-1 px-2 bg-[#8b7355]/10 text-secondary border border-[#8b7355]/20 rounded-lg text-[9px] font-mono font-extrabold tracking-wider">
                FILTER CODES
              </span>
              <p className="text-[11px] font-bold text-primary font-sans">
                Procurement Optimization Dock
              </p>
            </div>
            
            {(sizeFilter !== 'all' || pressureFilter !== 'all' || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSizeFilter('all');
                  setPressureFilter('all');
                  setSortBy('default');
                }}
                className="text-[9px] font-mono text-secondary hover:underline cursor-pointer flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-outline-variant"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Filter by Size Range */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#8b7355] block">
                Size Range
              </label>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value as any)}
                className="w-full bg-white border border-outline-variant text-[#1a1a1e] rounded-xl py-1 px-1.5 font-sans text-[11px] focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (20-63mm)</option>
                <option value="medium">Medium (90-110mm)</option>
                <option value="large">Large (160-315mm)</option>
              </select>
            </div>

            {/* Filter by Operating Pressure Duty */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#8b7355] block">
                Pressure Class
              </label>
              <select
                value={pressureFilter}
                onChange={(e) => setPressureFilter(e.target.value as any)}
                className="w-full bg-white border border-outline-variant text-[#1a1a1e] rounded-xl py-1 px-1.5 font-sans text-[11px] focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">All Pressures</option>
                <option value="low">Light (&lt;= PN 5)</option>
                <option value="medium">Standard (PN 6 - PN 10)</option>
                <option value="high">High Surge (PN 16+)</option>
              </select>
            </div>

            {/* Sort Pipe Options */}
            <div className="space-y-1 text-left">
              <label className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#8b7355] block">
                Sort Options By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-outline-variant text-[#1a1a1e] rounded-xl py-1 px-1.5 font-sans text-[11px] focus:ring-1 focus:ring-secondary focus:outline-none cursor-pointer font-medium"
              >
                <option value="default">Default Order</option>
                <option value="size">Size Scope (Asc)</option>
                <option value="pressure">Pressure (Desc)</option>
                <option value="efficiency">Price/Weight Efficiency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Outer Diameter (OD) */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-black font-sans">
            2. Outer Diameter (OD Size)
          </label>
          <div className="grid grid-cols-2 min-[390px]:grid-cols-3 sm:grid-cols-4 gap-2">
            {processedPipes.map((item) => (
              <button
                key={item.pipe.od}
                onClick={() => handlePipeChange(item.originalIdx)}
                className={`py-3 rounded-xl border font-sans text-xs font-semibold cursor-pointer flex flex-col items-center justify-center transition-all duration-200 group ${
                  diameterIdx === item.originalIdx
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-outline-variant/70 hover:border-primary hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="font-sans font-bold">{item.pipe.od} mm</span>
                {sortBy === 'efficiency' && (
                  <span className={`text-[8.5px] mt-0.5 font-mono font-medium ${diameterIdx === item.originalIdx ? 'text-white/80' : 'text-[#8b7355]'}`}>
                    {item.refWeight.toFixed(2)} kg/m
                  </span>
                )}
                {sortBy === 'pressure' && (
                  <span className={`text-[8px] mt-0.5 font-mono font-bold ${diameterIdx === item.originalIdx ? 'text-white/85' : 'text-secondary'}`}>
                    Max: {item.maxPressure} PN
                  </span>
                )}
              </button>
            ))}

            {processedPipes.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-on-surface-variant font-sans font-light bg-neutral-50 rounded-xl border border-dashed border-outline-variant">
                No specifications match the filters.
                <button
                  onClick={() => {
                    setSizeFilter('all');
                    setPressureFilter('all');
                    setSortBy('default');
                  }}
                  className="block mt-1 mx-auto text-xs font-bold text-secondary underline hover:no-underline cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SDR/Pressure Ratings */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-black">
            3. Standard Dimension Ratio (SDR) & Operating Pressure Rating
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentPipeSpec?.sdrOptions.map((opt, idx) => (
              <button
                key={opt.sdr}
                onClick={() => setSdrIdx(idx)}
                className={`p-3.5 text-left border flex items-center justify-between transition-all duration-200 cursor-pointer rounded-xl ${
                  sdrIdx === idx
                    ? 'border-secondary bg-secondary/5 text-primary ring-1 ring-secondary/30 shadow-sm shadow-secondary/5'
                    : 'border-outline-variant/70 hover:border-primary text-on-surface-variant bg-surface-lowest'
                }`}
              >
                <div>
                  <p className="text-[13px] font-bold text-primary font-sans tracking-wide">{opt.pn}</p>
                  <p className="text-[10px] text-[#8b7355] font-sans uppercase tracking-wider mt-0.5">SDR Rating: {opt.sdr}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary font-sans font-bold block">{opt.thickness} mm</span>
                  <span className="text-[9px] text-on-surface-variant uppercase font-sans tracking-wide">Thickness</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Project Pipeline Length */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant font-black">
              4. Project Pipe Quantity (Meters)
            </label>
            <span className="text-xs font-sans font-bold text-primary bg-neutral-100/80 px-3.5 py-1.5 border border-outline-variant/50 rounded-lg">
              {length.toLocaleString()} Meters
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1.5 bg-outline-variant/60 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <input
              type="number"
              min="1"
              value={length}
              onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
              className="w-full sm:w-28 border border-outline-variant/80 px-3 py-2 text-xs text-right font-sans focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none text-primary font-bold rounded-lg transition-all"
            />
          </div>
        </div>

      </div>

      {/* Output results panel */}
      <div className="lg:col-span-5 bg-[#faf8f5] border-t lg:border-t-0 lg:border-l border-outline-variant/50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
        
        {/* Decorative blueprint Grid markings */}
        <div className="absolute inset-0 select-none pointer-events-none opacity-[0.03] bg-[radial-gradient(#8b7355_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-4 text-primary">
            <div className="flex items-center gap-2">
              <Calculator className="w-4.5 h-4.5 text-[#8b7355]" />
              <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] font-sans">Blueprint Lab Specs</h4>
            </div>
            <span className="text-[9px] font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20 animate-pulse uppercase">
              Live Feed
            </span>
          </div>

          {/* Dynamic SVG Blueprint Schematic */}
          {currentPipeSpec && currentSdrSpec && (
            <div className="bg-neutral-950 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
              <span className="absolute top-2.5 right-2.5 text-[8px] font-mono tracking-widest text-[#8b7355] block bg-[#8b7355]/10 px-1.5 py-0.5 rounded">
                DYNAMIC CAD v1.4
              </span>
              <div className="flex flex-col items-center justify-center py-4 relative min-h-[160px]">
                {/* Visualizing the pipe in high-fidelity industrial CAD look */}
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 160 160">
                  <defs>
                    <radialGradient id="pipeShine" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                      <stop offset="0%" stopColor="#2c2c35" />
                      <stop offset="70%" stopColor="#121215" />
                      <stop offset="100%" stopColor="#050508" />
                    </radialGradient>
                    <linearGradient id="fluidFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e40af" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>

                  {/* Outer pipeline wall circle */}
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r="55" 
                    fill="url(#pipeShine)" 
                    stroke={material === 'HDPE' ? '#dca66c' : '#a1a1aa'} 
                    strokeWidth="1.5"
                    animate={{ scale: [0.98, 1.02, 0.98] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />

                  {/* Inside fluid content ring based on computed thickness */}
                  <motion.circle 
                    cx="80" 
                    cy="80" 
                    r={Math.max(25, 55 - (currentSdrSpec.thickness * 2))} 
                    fill="url(#fluidFlow)" 
                    stroke={material === 'HDPE' ? '#f59e0b' : '#3b82f6'} 
                    strokeWidth="1"
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />

                  {/* Dynamic Dimension line pointers */}
                  {/* Outer diameter annotation */}
                  <line x1="80" y1="18" x2="80" y2="142" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.75" strokeDasharray="2 2" />
                  <circle cx="80" cy="18" r="2.5" fill="#8b7355" />
                  <circle cx="80" cy="142" r="2.5" fill="#8b7355" />

                  {/* Inner Water Grid particle system elements inside the SVG */}
                  <circle cx="80" cy="80" r="3" fill="#ffffff" opacity="0.6" className="animate-ping" />
                </svg>

                {/* Dimension overlay metrics labels */}
                {/* Wall size label */}
                <span className="absolute left-3 bottom-3 text-[9px] font-mono text-white/50 text-left">
                  <span className="text-[#8b7355] block">THICKNESS</span>
                  <span className="text-white font-bold">{currentSdrSpec.thickness} mm</span>
                </span>

                {/* OD Size dynamic label */}
                <span className="absolute right-3 bottom-3 text-[9px] font-mono text-white/50 text-right">
                  <span className="text-secondary block">DIAMETER (OD)</span>
                  <span className="text-white font-bold">{currentPipeSpec.od} mm</span>
                </span>
                
                {/* Bore yield percentage bar info */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Bore Area</span>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">
                    ~ {Math.round(Math.pow(Math.max(25, 55 - (currentSdrSpec.thickness * 2)) / 55, 2) * 100)}% Yield
                  </span>
                </div>
              </div>

              {/* Laser scan horizontal glow line simulation */}
              <motion.div 
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent pointer-events-none"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {/* Results specs display - staggered animate */}
          <div className="space-y-3 bg-neutral-50/70 p-4 border border-outline-variant/40 rounded-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-light font-sans">Class Standard</span>
              <span className="text-xs font-bold text-primary font-mono tracking-wider">
                {material === 'HDPE' ? 'IS 4984 : 2016' : 'IS 4985 : 2021'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-light font-sans">Nominal Diameter</span>
              <span className="text-xs font-bold text-primary font-sans flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full inline-block" />
                {currentPipeSpec?.od} mm (OD Size)
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-light font-sans">PN Pressure Code</span>
              <span className="text-xs font-bold text-[#8b7355] font-mono">
                {currentSdrSpec?.pn}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <span className="text-xs text-on-surface-variant font-light font-sans">Estimated Weight (Meter)</span>
              <span className="text-xs font-bold text-primary font-mono bg-white px-2 py-0.5 border border-outline-variant/30 rounded-md">
                {computedValues.kgPerMeter} kg / m
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-light font-sans">Standard Length Bar (6m)</span>
              <span className="text-xs font-bold text-primary font-mono">
                ~ {computedValues.weightPerBar} kg / joint
              </span>
            </div>
          </div>

          {/* Huge Payload weight container with glow */}
          <div className="bg-white p-5 border border-outline-variant/50 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
            {/* Background glowing sweep radial panel */}
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-transparent z-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300" />
            
            <span className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] block font-black relative z-10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" /> Cumulative Payload Weight
            </span>
            <div className="flex items-baseline gap-2 relative z-10">
              <motion.span 
                key={computedValues.totalWeightKg}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-5xl font-light font-serif text-primary select-all font-serif"
              >
                {computedValues.totalWeightKg.toLocaleString()}
              </motion.span>
              <span className="text-xs text-on-surface-variant font-bold font-sans uppercase tracking-widest font-mono">Kg</span>
            </div>
            <div className="text-[11px] text-on-surface-variant/85 leading-relaxed font-sans font-light relative z-10">
              Equates to approx. <span className="font-semibold text-primary">{computedValues.totalWeightTonnes} Metric Tonnes</span> of raw pipeline polymer material.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3 relative z-10">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToQuoteBag}
            className={`w-full py-4 px-6 font-bold uppercase tracking-[0.2em] text-xs font-sans transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-xl shadow-md ${
              addedSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                : 'bg-primary hover:bg-[#8b7355] text-white shadow-primary/10 hover:shadow-secondary/15'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Added successfully!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add BOQ To Quote Draft
              </>
            )}
          </motion.button>
          <p className="text-[9px] text-center text-on-surface-variant/75 font-sans tracking-wide leading-relaxed">
            *Theoretical mass base calculation values under ambient 27°C. Actual structural weights may vary by ±1.2%.
          </p>
        </div>

      </div>

    </div>
  );
}
