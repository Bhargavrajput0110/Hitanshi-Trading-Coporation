import { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';
import { 
  ArrowRightLeft, 
  Check, 
  HelpCircle, 
  Download, 
  Plus, 
  FileCheck, 
  ShieldAlert, 
  Flame, 
  Droplet,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductComparerProps {
  onAddToQuote: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

interface MatrixPipe {
  material: 'HDPE' | 'PVC';
  od: number;
  sdr: number;
  pn: string;
  thickness: number;
  weight: number;
  pressureValue: number;
  priceEfficiency: number;
}

const ALL_PIPE_COMBINATIONS: MatrixPipe[] = [
  // HDPE
  { material: 'HDPE', od: 20, sdr: 17, pn: 'PN 6', thickness: 1.2, weight: 0.076, pressureValue: 6, priceEfficiency: 88 },
  { material: 'HDPE', od: 20, sdr: 11, pn: 'PN 10', thickness: 1.9, weight: 0.110, pressureValue: 10, priceEfficiency: 92 },
  { material: 'HDPE', od: 20, sdr: 9, pn: 'PN 16', thickness: 2.3, weight: 0.133, pressureValue: 16, priceEfficiency: 96 },
  { material: 'HDPE', od: 32, sdr: 21, pn: 'PN 5', thickness: 1.6, weight: 0.158, pressureValue: 5, priceEfficiency: 82 },
  { material: 'HDPE', od: 32, sdr: 17, pn: 'PN 6', thickness: 1.9, weight: 0.187, pressureValue: 6, priceEfficiency: 84 },
  { material: 'HDPE', od: 32, sdr: 13.6, pn: 'PN 8', thickness: 2.4, weight: 0.231, pressureValue: 8, priceEfficiency: 89 },
  { material: 'HDPE', od: 32, sdr: 11, pn: 'PN 10', thickness: 3.0, weight: 0.283, pressureValue: 10, priceEfficiency: 91 },
  { material: 'HDPE', od: 32, sdr: 9, pn: 'PN 16', thickness: 3.6, weight: 0.332, pressureValue: 16, priceEfficiency: 95 },
  { material: 'HDPE', od: 63, sdr: 26, pn: 'PN 4', thickness: 2.5, weight: 0.491, pressureValue: 4, priceEfficiency: 80 },
  { material: 'HDPE', od: 63, sdr: 21, pn: 'PN 5', thickness: 3.0, weight: 0.584, pressureValue: 5, priceEfficiency: 82 },
  { material: 'HDPE', od: 63, sdr: 17, pn: 'PN 6', thickness: 3.8, weight: 0.731, pressureValue: 6, priceEfficiency: 85 },
  { material: 'HDPE', od: 63, sdr: 11, pn: 'PN 10', thickness: 5.8, weight: 1.082, pressureValue: 10, priceEfficiency: 90 },
  { material: 'HDPE', od: 63, sdr: 9, pn: 'PN 16', thickness: 7.1, weight: 1.291, pressureValue: 16, priceEfficiency: 94 },
  { material: 'HDPE', od: 63, sdr: 7.4, pn: 'PN 20', thickness: 8.6, weight: 1.517, pressureValue: 20, priceEfficiency: 98 },
  { material: 'HDPE', od: 110, sdr: 41, pn: 'PN 2.5', thickness: 2.7, weight: 0.941, pressureValue: 2.5, priceEfficiency: 78 },
  { material: 'HDPE', od: 110, sdr: 26, pn: 'PN 4', thickness: 4.2, weight: 1.442, pressureValue: 4, priceEfficiency: 81 },
  { material: 'HDPE', od: 110, sdr: 17, pn: 'PN 6', thickness: 6.6, weight: 2.213, pressureValue: 6, priceEfficiency: 86 },
  { material: 'HDPE', od: 110, sdr: 11, pn: 'PN 10', thickness: 10.0, weight: 3.236, pressureValue: 10, priceEfficiency: 91 },
  { material: 'HDPE', od: 110, sdr: 9, pn: 'PN 16', thickness: 12.3, weight: 3.895, pressureValue: 16, priceEfficiency: 94 },
  { material: 'HDPE', od: 110, sdr: 7.4, pn: 'PN 20', thickness: 15.1, weight: 4.643, pressureValue: 20, priceEfficiency: 97 },

  // PVC
  { material: 'PVC', od: 63, sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 1.5, weight: 0.421, pressureValue: 2.5, priceEfficiency: 85 },
  { material: 'PVC', od: 63, sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 2.5, weight: 0.682, pressureValue: 4, priceEfficiency: 88 },
  { material: 'PVC', od: 63, sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 3.8, weight: 1.011, pressureValue: 6, priceEfficiency: 91 },
  { material: 'PVC', od: 63, sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 5.7, weight: 1.464, pressureValue: 10, priceEfficiency: 95 },
  { material: 'PVC', od: 110, sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 2.5, weight: 1.281, pressureValue: 2.5, priceEfficiency: 84 },
  { material: 'PVC', od: 110, sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 4.2, weight: 2.112, pressureValue: 4, priceEfficiency: 87 },
  { material: 'PVC', od: 110, sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 6.1, weight: 2.986, pressureValue: 6, priceEfficiency: 90 },
  { material: 'PVC', od: 110, sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 9.5, weight: 4.542, pressureValue: 10, priceEfficiency: 94 }
];

// Custom rating parameters for the 4 products to present a gorgeous mechanical scorecard
const PRODUCT_SCORES: Record<string, {
  flexibility: number;       // 1-10
  tensileStrength: number;   // 1-10
  ringStiffness: number;     // 1-10
  thermalInsulation: number; // 1-10
  corrosionResistance: number; // 1-10
  pros: string[];
}> = {
  'hdpe-pipes': {
    flexibility: 10,
    tensileStrength: 8,
    ringStiffness: 7,
    thermalInsulation: 5,
    corrosionResistance: 10,
    pros: ['Monolithic welded joints', 'Excellent soil shifting tolerance', 'Superb elastic deflection']
  },
  'pvc-pipes': {
    flexibility: 4,
    tensileStrength: 9,
    ringStiffness: 9,
    thermalInsulation: 6,
    corrosionResistance: 9,
    pros: ['Very high rigid ring stiffness', 'Simple socket jointing system', 'Excellent cost-to-stiffness ratio']
  },
  'industrial-motors': {
    flexibility: 2,
    tensileStrength: 10,
    ringStiffness: 10,
    thermalInsulation: 8,
    corrosionResistance: 7,
    pros: ['Continuous 24/7 heavy duty (S1)', 'IE4 high efficiency premium specs', 'IP55 waterproof rating']
  },
  'water-tanks': {
    flexibility: 5,
    tensileStrength: 7,
    ringStiffness: 8,
    thermalInsulation: 10,
    corrosionResistance: 10,
    pros: ['Multi-layer food grade LLDPE', 'Anti-microbial silver-ion liner', 'Up to 10°C thermal delta shield']
  }
};

export default function ProductComparer({ onAddToQuote, onSelectProduct }: ProductComparerProps) {
  // Let A default to hdpe-pipes, B default to pvc-pipes
  const [productAId, setProductAId] = useState<string>('hdpe-pipes');
  const [productBId, setProductBId] = useState<string>('pvc-pipes');

  const productA = ALL_PRODUCTS.find(p => p.id === productAId) || ALL_PRODUCTS[0];
  const productB = ALL_PRODUCTS.find(p => p.id === productBId) || ALL_PRODUCTS[2];

  // Set preset comparisons
  const setPreset = (idA: string, idB: string) => {
    setProductAId(idA);
    setProductBId(idB);
  };

  // Switch A and B positions
  const handleSwap = () => {
    const temp = productAId;
    setProductAId(productBId);
    setProductBId(temp);
  };

  // Decision matrix controls
  const [matrixSizeFilter, setMatrixSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [matrixPressureFilter, setMatrixPressureFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [matrixSortBy, setMatrixSortBy] = useState<'default' | 'sizeAsc' | 'sizeDesc' | 'pressureDesc' | 'efficiencyDesc'>('default');

  const sortedMatrixPipes = useMemo(() => {
    let list = [...ALL_PIPE_COMBINATIONS];

    // Filter by size
    if (matrixSizeFilter === 'small') {
      list = list.filter(p => p.od <= 63);
    } else if (matrixSizeFilter === 'medium') {
      list = list.filter(p => p.od > 63 && p.od <= 160);
    } else if (matrixSizeFilter === 'large') {
      list = list.filter(p => p.od >= 200);
    }

    // Filter by pressure
    if (matrixPressureFilter === 'low') {
      list = list.filter(p => p.pressureValue <= 5);
    } else if (matrixPressureFilter === 'medium') {
      list = list.filter(p => p.pressureValue >= 6 && p.pressureValue <= 10);
    } else if (matrixPressureFilter === 'high') {
      list = list.filter(p => p.pressureValue >= 16);
    }

    // Sort options
    if (matrixSortBy === 'sizeAsc') {
      list.sort((a, b) => a.od - b.od);
    } else if (matrixSortBy === 'sizeDesc') {
      list.sort((a, b) => b.od - a.od);
    } else if (matrixSortBy === 'pressureDesc') {
      list.sort((a, b) => b.pressureValue - a.pressureValue);
    } else if (matrixSortBy === 'efficiencyDesc') {
      list.sort((a, b) => b.priceEfficiency - a.priceEfficiency);
    }

    return list;
  }, [matrixSizeFilter, matrixPressureFilter, matrixSortBy]);

  const maxEfficiency = useMemo(() => {
    if (sortedMatrixPipes.length === 0) return 0;
    return Math.max(...sortedMatrixPipes.map(p => p.priceEfficiency));
  }, [sortedMatrixPipes]);

  const scoresA = PRODUCT_SCORES[productA.id] || { flexibility: 5, tensileStrength: 5, ringStiffness: 5, thermalInsulation: 5, corrosionResistance: 5, pros: [] };
  const scoresB = PRODUCT_SCORES[productB.id] || { flexibility: 5, tensileStrength: 5, ringStiffness: 5, thermalInsulation: 5, corrosionResistance: 5, pros: [] };

  // All spec rows to render
  const comparisonRows = [
    { label: 'Indian Standard', key: 'standard', icon: '📜' },
    { label: 'Major Material', key: 'material', icon: '🧱' },
    { label: 'Pressure Range', key: 'pressure', icon: '🎚️' },
    { label: 'Core Applications', key: 'application', icon: '🎯' },
    { label: 'Diameters Available', key: 'diameterRange', icon: '📏' },
    { label: 'Design Lifespan', key: 'durability', icon: '⏳' },
    { label: 'Sub-Layer Design', key: 'layers', icon: '🥞' },
    { label: 'Material Grade', key: 'grade', icon: '💎' }
  ];

  return (
    <section id="comparison-section" className="bg-surface py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Decorative Divider */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="h-[1px] bg-gradient-to-r from-transparent to-[#8b7355]/30 flex-1" />
        <ArrowRightLeft className="w-5 h-5 text-secondary animate-pulse" />
        <div className="h-[1px] bg-gradient-to-l from-transparent to-[#8b7355]/30 flex-1" />
      </div>

      <div className="bg-[#111113] border border-[#8b7355]/20 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8b7355]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Content Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
          <span className="text-[8px] uppercase tracking-[0.2em] text-[#dca66c] font-mono font-bold bg-[#8b7355]/15 px-2.5 py-1 rounded-md border border-[#8b7355]/20">
            Specifications Matrix
          </span>
          <h3 className="text-xl sm:text-2.5xl font-light font-serif tracking-tight text-white mt-2.5">
            Specifications <span className="italic font-normal text-secondary">Comparison</span>
          </h3>
          <p className="text-xs text-white/50 font-sans mt-2">
            Compare material coefficients, standards compliance, and performance ratings side-by-side.
          </p>

          {/* Preset Buttons for high-speed use */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest mr-2">Quick Presets:</span>
            <button
              onClick={() => setPreset('hdpe-pipes', 'pvc-pipes')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide cursor-pointer border transition-all ${
                productAId === 'hdpe-pipes' && productBId === 'pvc-pipes'
                  ? 'bg-[#8b7355] text-white border-transparent shadow-lg'
                  : 'bg-white/5 text-white/75 border-white/5 hover:bg-white/10'
              }`}
            >
              HDPE vs uPVC Pipes
            </button>
            <button
              onClick={() => setPreset('pvc-pipes', 'water-tanks')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide cursor-pointer border transition-all ${
                productAId === 'pvc-pipes' && productBId === 'water-tanks'
                  ? 'bg-[#8b7355] text-white border-transparent shadow-lg'
                  : 'bg-white/5 text-white/75 border-white/5 hover:bg-white/10'
              }`}
            >
              uPVC Wall vs Tanks
            </button>
            <button
              onClick={() => setPreset('hdpe-pipes', 'industrial-motors')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wide cursor-pointer border transition-all ${
                productAId === 'hdpe-pipes' && productBId === 'industrial-motors'
                  ? 'bg-[#8b7355] text-white border-transparent shadow-lg'
                  : 'bg-white/5 text-white/75 border-white/5 hover:bg-white/10'
              }`}
            >
              Pipes vs Motors
            </button>
          </div>
        </div>

        {/* The Selector Panels */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
          
          {/* Select A box */}
          <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#8b7355]">Compare Product A</label>
            <select
              value={productAId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === productBId) {
                  // Swap if selected same
                  handleSwap();
                } else {
                  setProductAId(val);
                }
              }}
              className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl py-2.5 px-3 font-sans text-sm focus:border-secondary focus:outline-none cursor-pointer"
            >
              {ALL_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.category})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button Circle */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button 
              onClick={handleSwap}
              title="Swap Roles"
              className="p-3 bg-neutral-900 hover:bg-[#8b7355] text-[#8b7355] hover:text-white rounded-full border border-white/5 hover:border-transparent cursor-pointer transition-all hover:scale-110 shadow-lg"
            >
              <Shuffle className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Select B box */}
          <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-secondary">Compare Product B</label>
            <select
              value={productBId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === productAId) {
                  // Swap if selected same
                  handleSwap();
                } else {
                  setProductBId(val);
                }
              }}
              className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl py-2.5 px-3 font-sans text-sm focus:border-secondary focus:outline-none cursor-pointer"
            >
              {ALL_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.category})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Side-By-Side Technical Specs Table */}
        <div className="relative z-10 overflow-x-auto border border-white/5 rounded-2xl bg-black/45">
          <table className="w-full border-collapse text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01]">
                <th className="p-4 text-[10px] text-white/50 font-mono uppercase tracking-wider w-1/4">Key Parameters</th>
                
                {/* Column A Header */}
                <th className="p-4 w-3/8 text-left bg-[#867053]/5 border-r border-white/5 align-top">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-3 bg-[#8b7355] rounded-full inline-block" />
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#8b7355] font-bold">Standard Spec A</span>
                  </div>
                  <h4 className="text-base text-white font-serif">{productA.name}</h4>
                  <p className="text-[10px] text-white/40 font-sans mt-0.5 mb-2.5">{productA.tagline}</p>
                  
                  {productA.image && (
                    <div className="w-full h-20 rounded-xl overflow-hidden border border-white/10 select-none pointer-events-none relative">
                      <img 
                        src={productA.image} 
                        alt={productA.name} 
                        className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                </th>

                {/* Column B Header */}
                <th className="p-4 w-3/8 text-left bg-secondary/5 align-top">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-3 bg-secondary rounded-full inline-block" />
                    <span className="text-[9px] uppercase tracking-widest font-mono text-secondary font-bold">Standard Spec B</span>
                  </div>
                  <h4 className="text-base text-white font-serif">{productB.name}</h4>
                  <p className="text-[10px] text-white/40 font-sans mt-0.5 mb-2.5">{productB.tagline}</p>
                  
                  {productB.image && (
                    <div className="w-full h-20 rounded-xl overflow-hidden border border-white/10 select-none pointer-events-none relative">
                      <img 
                        src={productB.image} 
                        alt={productB.name} 
                        className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {comparisonRows.map((row) => {
                const valA = productA.specs[row.key as keyof typeof productA.specs];
                const valB = productB.specs[row.key as keyof typeof productB.specs];

                // Skip rows where BOTH products lack that specification field (e.g. layers, grade values)
                if (!valA && !valB) return null;

                return (
                  <tr key={row.key} className="hover:bg-white/[0.01] transition-colors">
                    {/* Label */}
                    <td className="p-4 font-medium text-white/95 flex items-center gap-2">
                      <span className="text-sm select-none">{row.icon}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">{row.label}</span>
                    </td>

                    {/* Spec A */}
                    <td className="p-4 text-xs text-[#eae5df] bg-[#867053]/2 bg-opacity-10 border-r border-white/5">
                      {valA ? (
                        <div className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                          <span>{valA}</span>
                        </div>
                      ) : (
                        <span className="text-white/20 italic font-mono uppercase text-[9px] tracking-wider">Not Applicable / N.A.</span>
                      )}
                    </td>

                    {/* Spec B */}
                    <td className="p-4 text-xs text-[#eae5df]">
                      {valB ? (
                        <div className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                          <span>{valB}</span>
                        </div>
                      ) : (
                        <span className="text-white/20 italic font-mono uppercase text-[9px] tracking-wider">Not Applicable / N.A.</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual Engineering Capability Ratings Map (Bar Scores) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 pt-8 border-t border-white/5">
          
          {/* Progress Ratings comparison bar deck */}
          <div className="bg-black/25 border border-white/5 p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-3">
              📐 Mechanical Engineering Coefficients
            </h4>

            {/* Score item loops */}
            {[
              { label: 'Pipe Elastic Flexibility', scoreA: scoresA.flexibility, scoreB: scoresB.flexibility },
              { label: 'Ultimate Tensile Strength', scoreA: scoresA.tensileStrength, scoreB: scoresB.tensileStrength },
              { label: 'External Ring Stiffness', scoreA: scoresA.ringStiffness, scoreB: scoresB.ringStiffness },
              { label: 'Thermal Degradation Block', scoreA: scoresA.thermalInsulation, scoreB: scoresB.thermalInsulation },
              { label: 'Severe Chemical Neutrality', scoreA: scoresA.corrosionResistance, scoreB: scoresB.corrosionResistance },
            ].map((skill, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
                  <span>{skill.label}</span>
                  <div className="flex gap-2">
                    <span className="text-secondary font-bold">A: {skill.scoreA}/10</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/80 font-bold">B: {skill.scoreB}/10</span>
                  </div>
                </div>

                {/* Overlapped Double-Colored Progress bar */}
                <div className="h-2 bg-neutral-900 rounded-full overflow-hidden relative border border-white/5">
                  {/* Progress bar A */}
                  <motion.div 
                    key={`scoreA-${productAId}-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.scoreA * 10}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#dca66c]/30 to-[#8b7355] rounded-full"
                  />
                </div>
                <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden relative">
                  {/* Progress bar B */}
                  <motion.div 
                    key={`scoreB-${productBId}-${index}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.scoreB * 10}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="h-full bg-gradient-to-r from-secondary/30 to-secondary rounded-full"
                  />
                </div>
              </div>
            ))}

            <p className="text-[10px] text-white/40 italic font-sans leading-relaxed pt-2">
              *Ratings indices are calculated using lab models relative to standard pipe classes.
            </p>
          </div>

          {/* Side-by-side Highlights Panel */}
          <div className="space-y-6 flex flex-col justify-between">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pros Box A */}
              <div className="bg-[#8b7355]/5 border border-[#8b7355]/20 p-5 rounded-2xl text-left">
                <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-widest block mb-1">Advantages (A)</span>
                <span className="text-sm font-serif font-medium text-white block mb-3 truncate">{productA.name}</span>
                <ul className="space-y-2">
                  {scoresA.pros.map((pro, index) => (
                    <li key={index} className="text-[11px] font-sans text-white/80 flex items-start gap-1.5">
                      <span className="text-secondary font-sans text-xs">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros Box B */}
              <div className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl text-left">
                <span className="text-[9px] font-mono font-bold text-white/50 uppercase tracking-widest block mb-1">Advantages (B)</span>
                <span className="text-sm font-serif font-medium text-white block mb-3 truncate">{productB.name}</span>
                <ul className="space-y-2">
                  {scoresB.pros.map((pro, index) => (
                    <li key={index} className="text-[11px] font-sans text-white/80 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-sans text-xs">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Quick action triggers footer */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="text-left space-y-1 sm:max-w-[60%]">
                <span className="text-[9px] font-mono text-secondary uppercase tracking-[0.15em] font-extrabold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-secondary" /> Technical Guides
                </span>
                <p className="text-[11px] text-white/60 font-sans leading-normal">
                  Download installation codes or compile both parameters directly to your RFQ basket.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onSelectProduct(productA)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 hover:bg-white hover:text-black border border-white/10 text-white font-mono text-[10px] tracking-wider uppercase font-bold transition-all rounded-xl cursor-pointer"
                >
                  Inspect A
                </button>
                <button
                  onClick={() => onSelectProduct(productB)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 hover:bg-white hover:text-black border border-white/10 text-white font-mono text-[10px] tracking-wider uppercase font-bold transition-all rounded-xl cursor-pointer"
                >
                  Inspect B
                </button>
                <button
                  onClick={() => {
                    onAddToQuote(productA);
                    onAddToQuote(productB);
                  }}
                  className="flex-1 sm:flex-not-initialized px-3.5 py-2 bg-secondary hover:bg-secondary-container text-white font-mono text-[10px] tracking-wider uppercase font-black transition-all rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-1.5 hover:scale-102"
                >
                  <Plus className="w-3.5 h-3.5" /> Both to RFQ
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Pipe Options Sorter/Filter Grid for Procurement Officers */}
        <div id="portfolio-section" className="mt-12 pt-10 border-t border-white/10 relative z-10 text-left">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="text-left select-none">
              <span className="text-[9px] uppercase tracking-[0.25em] text-secondary font-mono font-bold bg-secondary/15 px-2.5 py-1 rounded-full border border-secondary/20">
                Decision Matrix Tool
              </span>
              <h4 className="text-xl font-serif text-white mt-1.5 font-light">
                Unified Pipe Specifications <span className="italic font-normal text-secondary">Registry</span>
              </h4>
              <p className="text-[11px] text-white/50 font-sans mt-1">
                Filter and rank all standard pipe specifications by operational pressure, weight class, or weight-to-pressure cost efficiency.
              </p>
            </div>

            {/* Dynamic Filter / Sort Menu */}
            <div className="flex flex-wrap gap-2.5 bg-black/40 p-2.5 border border-white/5 rounded-2xl w-full lg:w-auto">
              <div className="flex flex-col gap-1 w-full sm:w-auto text-left">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">Size Filter</span>
                <select
                  value={matrixSizeFilter}
                  onChange={(e) => setMatrixSizeFilter(e.target.value as any)}
                  className="bg-neutral-900 border border-white/10 text-white rounded-xl py-1 px-2 font-sans text-xs focus:outline-none cursor-pointer w-full sm:w-44"
                >
                  <option value="all">All Diameters</option>
                  <option value="small">Small (20-63mm)</option>
                  <option value="medium">Medium (90-160mm)</option>
                  <option value="large">Large (200-315mm)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-auto text-left">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest pl-1 font-bold">Pressure Class</span>
                <select
                  value={matrixPressureFilter}
                  onChange={(e) => setMatrixPressureFilter(e.target.value as any)}
                  className="bg-neutral-900 border border-white/10 text-white rounded-xl py-1 px-2 font-sans text-xs focus:outline-none cursor-pointer w-full sm:w-44"
                >
                  <option value="all">All Classes</option>
                  <option value="low">Low (&lt;= 5 Bar / PN 5)</option>
                  <option value="medium">Medium (6 - 10 Bar / PN 6-10)</option>
                  <option value="high">High (&gt;= 16 Bar / PN 16+)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-auto text-left">
                <span className="text-[8px] font-mono text-[#dca66c] uppercase tracking-widest pl-1 font-bold">Sort Option</span>
                <select
                  value={matrixSortBy}
                  onChange={(e) => setMatrixSortBy(e.target.value as any)}
                  className="bg-neutral-900 border border-[#8b7355]/40 text-secondary rounded-xl py-1 px-2 font-sans text-xs focus:outline-none cursor-pointer w-full sm:w-48 font-bold"
                >
                  <option value="default">Default Catalog</option>
                  <option value="sizeAsc">Size (Small to Large)</option>
                  <option value="sizeDesc">Size (Large to Small)</option>
                  <option value="pressureDesc">Pressure Class (Highest First)</option>
                  <option value="efficiencyDesc">Price/Weight Efficiency (Peak Rating)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid / Table */}
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-black/35 max-h-[350px] overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs min-w-[650px]">
              <thead className="sticky top-0 bg-neutral-950/90 backdrop-blur-md z-10 border-b border-white/10">
                <tr className="select-none">
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">Type</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">Outer Diameter</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">SDR Ratio</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">Pressure Rating</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">Wall Thickness</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider">Unit Weight</th>
                  <th className="p-3 text-[9px] text-secondary font-mono uppercase tracking-wider">Price/Weight Efficiency</th>
                  <th className="p-3 text-[9px] text-white/40 font-mono uppercase tracking-wider text-right">Draft Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {sortedMatrixPipes.map((pipe) => {
                  const isHdpe = pipe.material === 'HDPE';
                  const isMostEfficient = pipe.priceEfficiency === maxEfficiency && maxEfficiency > 0;
                  return (
                    <tr 
                      key={`${pipe.material}-${pipe.od}-${pipe.sdr}`} 
                      className={`hover:bg-white/[0.04] transition-colors group relative ${
                        isMostEfficient 
                          ? 'bg-emerald-950/20 border-l-[3px] border-emerald-500 shadow-[inset_1px_0_0_0_rgba(16,185,129,0.2)]' 
                          : ''
                      }`}
                    >
                      {/* Material Type Badge */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold ${
                          isHdpe 
                            ? 'bg-[#8b7355]/20 text-[#eae5df] border border-[#8b7355]/30' 
                            : 'bg-secondary/10 text-secondary border border-secondary/20'
                        }`}>
                          {pipe.material}
                        </span>
                      </td>

                      {/* OD */}
                      <td className="p-3 font-sans font-bold">
                        <span className={isMostEfficient ? 'text-emerald-400 font-extrabold flex items-center gap-1.5' : 'text-white'}>
                          {isMostEfficient && <span className="text-[10px] animate-bounce">★</span>}
                          {pipe.od} mm
                        </span>
                      </td>

                      {/* SDR */}
                      <td className="p-3 text-white/70">
                        {isHdpe ? `SDR ${pipe.sdr}` : 'N.A. rigid'}
                      </td>

                      {/* Pressure */}
                      <td className="p-3 font-semibold text-secondary">
                        {pipe.pn}
                      </td>

                      {/* Thickness */}
                      <td className="p-3 text-white/80 font-sans">
                        {pipe.thickness} mm
                      </td>

                      {/* Weight */}
                      <td className="p-3 text-white/60 font-sans">
                        {pipe.weight.toFixed(3)} kg/m
                      </td>

                      {/* Price Efficiency Index */}
                      <td className="p-3 font-sans">
                        <div className="flex items-center gap-1.5">
                          {isMostEfficient && (
                            <span className="bg-emerald-500/25 text-emerald-400 text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase shrink-0 animate-pulse">
                              ★ Peak Value
                            </span>
                          )}
                          {/* Colored dynamic dots based on efficiency rating */}
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            pipe.priceEfficiency >= 93 
                              ? 'bg-emerald-400' 
                              : pipe.priceEfficiency >= 86 
                              ? 'bg-amber-400' 
                              : 'bg-neutral-400'
                          }`} />
                          <span className={`font-semibold text-xs ${isMostEfficient ? 'text-emerald-400 font-bold' : 'text-white'}`}>
                            {pipe.priceEfficiency}%
                          </span>
                          <span className="text-[9px] text-white/35 italic">
                            ({pipe.priceEfficiency >= 93 ? 'Highly Cost-Efficient' : pipe.priceEfficiency >= 86 ? 'High Economy' : 'Standard'})
                          </span>
                        </div>
                      </td>

                      {/* Fast Add Action */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            const standardProd = ALL_PRODUCTS.find(p => p.id === (isHdpe ? 'hdpe-pipes' : 'pvc-pipes'))!;
                            onAddToQuote({
                              ...standardProd,
                              name: `${pipe.material} Infra Pipe (${pipe.od}mm OD, ${pipe.pn})`
                            });
                          }}
                          className="px-2.5 py-1.5 bg-white/5 group-hover:bg-[#8b7355] text-white hover:text-white rounded-lg text-[9px] transition-all cursor-pointer font-sans"
                        >
                          + Add to RFQ
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {sortedMatrixPipes.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/40 font-sans">
                      No unified pipe options matched the current procurement filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </section>
  );
}
