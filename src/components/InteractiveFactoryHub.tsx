import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Workflow, 
  Droplets, 
  Settings2, 
  Tv, 
  Activity, 
  TrendingUp, 
  Truck, 
  Compass, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Zap, 
  Compass as GaugeIcon,
  Play,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Real-world logistical targets originating from Avadhan, Dhule corridor
interface LogisticsNode {
  city: string;
  state: string;
  distance: number; // km
  transitHours: number;
  routeHighlight: string;
}

const REGIONAL_HUBS: LogisticsNode[] = [
  { city: 'Jalgaon', state: 'Maharashtra', distance: 100, transitHours: 3, routeHighlight: 'Via NH 53 (Eastbound corridor)' },
  { city: 'Nashik', state: 'Maharashtra', distance: 160, transitHours: 4.5, routeHighlight: 'Via NH 60 (Agri industrial belt)' },
  { city: 'Indore', state: 'Madhya Pradesh', distance: 220, transitHours: 5.5, routeHighlight: 'Via NH 52 (Malwa distribution link)' },
  { city: 'Aurangabad', state: 'Maharashtra', distance: 180, transitHours: 5, routeHighlight: 'Via Aurangabad - Dhule highway' },
  { city: 'Pune', state: 'Maharashtra', distance: 340, transitHours: 8.5, routeHighlight: 'Via NH 60 bypass link' },
  { city: 'Mumbai', state: 'Maharashtra', distance: 325, transitHours: 8, routeHighlight: 'Via NH 3 central arterial' },
  { city: 'Bhopal', state: 'Madhya Pradesh', distance: 410, transitHours: 10, routeHighlight: 'Via NH 52 & NH 47' },
  { city: 'Surat', state: 'Gujarat', distance: 230, transitHours: 6, routeHighlight: 'Via NH 53 industrial corridor' }
];

// Mock recent quality batch logs
const BATCH_QA_TEMPLATES = [
  { batchId: 'HTG-HD100-9902', material: 'HDPE PE-100', size: '110mm', test: 'Density verification', value: '0.957 g/cm³', margin: 'Conformant to IS:4984' },
  { batchId: 'HTG-HD80-7731', material: 'HDPE PE-80', size: '63mm', test: 'Carbon Black Dispersion', value: '2.1%', margin: 'Perfect absorption' },
  { batchId: 'HTG-UPVC-810', material: 'Rigid uPVC', size: '160mm', test: 'Opacity test deviation', value: '0.04%', margin: 'Below 0.2% ceiling' },
  { batchId: 'HTG-TNK-5000', material: 'LLDPE Tank', size: '5000L', test: 'Impact deflection test', value: 'No rupture', margin: 'Accredited standard' }
];

// Helper to generate a wavy SVG path for turbulent flow fluid streamlines
const generateWavyPath = (yOffset: number, amplitude: number, frequencyMultiplier: number) => {
  let path = `M 25 ${yOffset}`;
  const steps = 16;
  const startX = 25;
  const endX = 215;
  const stepSize = (endX - startX) / steps;
  for (let i = 1; i <= steps; i++) {
    const x = startX + i * stepSize;
    const y = yOffset + Math.sin(i * frequencyMultiplier) * amplitude;
    path += ` L ${x} ${y}`;
  }
  return path;
};

export default function InteractiveFactoryHub() {
  const [activeTab, setActiveTab] = useState<'flow' | 'lab' | 'dispatch'>('flow');

  // --- TAB 1: FLUID DYNAMICS PLAYGROUND STATE ---
  const [odSize, setOdSize] = useState<number>(110); // Standard 110mm
  const [wallThickness, setWallThickness] = useState<number>(6.6); // SDR 17 thickness
  const [fluidSpeed, setFluidSpeed] = useState<number>(1.8); // 1.8 meters per second
  const [pipeMaterial, setPipeMaterial] = useState<'HDPE' | 'PVC' | 'IRON'>('HDPE');
  const [showTurbulence, setShowTurbulence] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'tube' | 'cross'>('tube');
  const [pipe3DRotation, setPipe3DRotation] = useState<number>(-8);
  const dragStartRef = useRef<{ x: number; isDragging: boolean }>({ x: 0, isDragging: false });

  // Hazen-Williams Roughness Coefficient
  const roughnessC = useMemo(() => {
    if (pipeMaterial === 'HDPE') return 150; // Ultra smooth polymer
    if (pipeMaterial === 'PVC') return 150;
    return 100; // Rougher Cast Iron
  }, [pipeMaterial]);

  // Hydraulic Calculations:
  // Internal Diameter (mm) = Outer Diameter - 2 * Wall Thickness
  const internalDiameter = useMemo(() => {
    const id = odSize - (2 * wallThickness);
    return Math.max(10, Number(id.toFixed(1)));
  }, [odSize, wallThickness]);

  // Flow Rate (Liters per second) = Area (m2) * Velocity (m/s) * 1000
  // Area = pi * (ID / 1000)^2 / 4
  const flowMetrics = useMemo(() => {
    const idMeters = internalDiameter / 1000;
    const areaSqM = (Math.PI * Math.pow(idMeters, 2)) / 4;
    const flowLtS = areaSqM * fluidSpeed * 1000; // Liters/second
    const flowM3H = flowLtS * 3.6; // cubic meters/hour

    // Head loss per 100m using Hazen-Williams (approx. formula)
    // h_f = 10.67 * Length * C^-1.852 * D^-4.87 * Q^1.852
    const flowM3S = flowLtS / 1000;
    let headLoss100m = 0;
    if (flowM3S > 0) {
      headLoss100m = 10.67 * 100 * Math.pow(roughnessC, -1.852) * Math.pow(idMeters, -4.87) * Math.pow(flowM3S, 1.852);
    }

    return {
      areaSqM: Number(areaSqM.toFixed(5)),
      litersPerSec: Number(flowLtS.toFixed(1)),
      cubicMeterPerHour: Number(flowM3H.toFixed(1)),
      headLoss: Number(headLoss100m.toFixed(2))
    };
  }, [internalDiameter, fluidSpeed, roughnessC]);

  // Mobile / Desktop gesture handlers for tilting the 3D pipe model on drag
  const handlePipeDragStart = (clientX: number) => {
    dragStartRef.current = { x: clientX, isDragging: true };
  };

  const handlePipeDragMove = (clientX: number) => {
    if (!dragStartRef.current.isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    dragStartRef.current.x = clientX;
    setPipe3DRotation((prev) => {
      const next = prev + deltaX * 0.45;
      return Math.max(-45, Math.min(45, next));
    });
  };

  const handlePipeDragEnd = () => {
    dragStartRef.current.isDragging = false;
  };

  // --- TAB 2: LIVE LABORATORY SIMULATOR STATE ---
  const [labBatchId, setLabBatchId] = useState<string>('HTG-HD100-9902');
  const [testPhase, setTestPhase] = useState<'idle' | 'running' | 'passed'>('idle');
  const [testPsi, setTestPsi] = useState<number>(0);
  const labIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeBatchInfo = useMemo(() => {
    return BATCH_QA_TEMPLATES.find(t => t.batchId === labBatchId) || BATCH_QA_TEMPLATES[0];
  }, [labBatchId]);

  const handleStartLabTest = () => {
    if (testPhase === 'running') return;
    setTestPhase('running');
    setTestPsi(0);

    let currentPsi = 0;
    const targetPsi = odSize > 200 ? 120 : 210; // High pressure burst simulator value (PSI units)

    labIntervalRef.current = setInterval(() => {
      currentPsi += Math.round(Math.random() * 8 + 5);
      if (currentPsi >= targetPsi) {
        setTestPsi(targetPsi);
        setTestPhase('passed');
        if (labIntervalRef.current) clearInterval(labIntervalRef.current);
      } else {
        setTestPsi(currentPsi);
      }
    }, 70);
  };

  useEffect(() => {
    return () => {
      if (labIntervalRef.current) clearInterval(labIntervalRef.current);
    };
  }, []);

  // --- TAB 3: DISPATCH ESTIMATOR TARGET STATE ---
  const [selectedHubIndex, setSelectedHubIndex] = useState<number>(2); // Default to Indore, MP
  const activeHub = REGIONAL_HUBS[selectedHubIndex];

  return (
    <section id="virtual-operations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6">
      
      {/* Container holding the high-contrast dashboard panel */}
      <div className="bg-[#121214] border border-[#8b7355]/25 rounded-3xl overflow-hidden shadow-2xl relative text-left">
        
        {/* Deep branding bar */}
        <div className="bg-[#0b0b0c] border-b border-[#8b7355]/15 px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#8b7355]/15 border border-[#8b7355]/30 rounded-xl text-secondary">
              <Workflow className="w-5 h-5 text-secondary animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[#dca66c] uppercase font-bold block">
                Virtual Factory Control Deck
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight mt-0.5">
                Hitanshi <span className="italic text-secondary">Interactive Operations Center</span>
              </h2>
            </div>
          </div>
          
          {/* Quick Tab Selectors */}
          <div className="flex bg-neutral-900/80 p-1 border border-white/5 rounded-xl self-stretch md:self-auto">
            <button
              onClick={() => { setActiveTab('flow'); }}
              className={`flex-1 md:flex-initial px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'flow'
                  ? 'bg-[#8b7355] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Hydraulic Flow</span>
            </button>
            <button
              onClick={() => { setActiveTab('lab'); }}
              className={`flex-1 md:flex-initial px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'lab'
                  ? 'bg-[#8b7355] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>QA Burst Lab</span>
            </button>
            <button
              onClick={() => { setActiveTab('dispatch'); }}
              className={`flex-1 md:flex-initial px-4 py-2 font-sans text-xs tracking-wider uppercase font-semibold transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'dispatch'
                  ? 'bg-[#8b7355] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics Monitor</span>
            </button>
          </div>
        </div>

        {/* Tab Layouts */}
        <AnimatePresence mode="wait">
          
          {/* 1. FLOW SIMULATOR TAB */}
          {activeTab === 'flow' && (
            <motion.div
              key="flow-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8"
            >
              {/* Sidebar controls column */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-secondary" /> Hydraulic Parameters
                  </h3>
                  <p className="text-[11px] text-white/50 font-sans mt-1">
                    Calibrate flow friction parameters across pipeline polymers in real time.
                  </p>
                </div>

                {/* Material Select */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-secondary block font-bold">A. Pipeline Material Group</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['HDPE', 'PVC', 'IRON'].map((mat) => (
                      <button
                        key={mat}
                        onClick={() => {
                          setPipeMaterial(mat as any);
                          if (mat === 'IRON') {
                            setWallThickness(8.5);
                          } else if (mat === 'PVC') {
                            setWallThickness(4.2);
                          } else {
                            setWallThickness(6.6);
                          }
                        }}
                        className={`py-2 text-[11px] font-mono font-bold tracking-wider rounded-xl border text-center transition-all cursor-pointer ${
                          pipeMaterial === mat
                            ? 'bg-secondary/15 border-secondary text-secondary'
                            : 'bg-[#18181b] border-white/5 text-white/60 hover:border-white/15'
                        }`}
                      >
                        {mat === 'HDPE' ? 'HDPE (S150)' : mat === 'PVC' ? 'uPVC (S150)' : 'D.I. Iron (S100)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* OD Pipe Select */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#dca66c] font-bold">
                    <span>B. Nominal Pipe Diameter</span>
                    <span className="text-white">{odSize} mm</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="315"
                    step="1"
                    value={odSize}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setOdSize(val);
                      // Adjust thickness relative to size so ID stays healthy
                      setWallThickness(Number((val * 0.06).toFixed(1)));
                    }}
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[8.5px] text-white/40 font-mono">
                    <span>Small: 32mm</span>
                    <span>Medium: 110mm</span>
                    <span>Heavy Main: 315mm</span>
                  </div>
                </div>

                {/* SDR wall thickness adjust */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-secondary font-bold">
                    <span>C. Wall Thickness Gauge</span>
                    <span className="text-white">{wallThickness} mm</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="22.0"
                    step="0.1"
                    value={wallThickness}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val < odSize / 2) {
                        setWallThickness(val);
                      }
                    }}
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono">
                    <span>SDR 41 thin-wall</span>
                    <span>SDR 11 massive-thick</span>
                  </div>
                </div>

                {/* Velocity pump adjust */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#dca66c] font-bold">
                    <span>D. Hydraulic Fluid Velocity</span>
                    <span className="text-white">{fluidSpeed} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.1"
                    value={fluidSpeed}
                    onChange={(e) => setFluidSpeed(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[8px] text-white/30 font-mono mb-2">
                    <span>Silt boundary (0.2 m/s)</span>
                    <span>Peak Municipal limit (4.0 m/s)</span>
                  </div>
                </div>

                {/* E. Turbulence Layer Switch */}
                <div className="bg-[#18181b]/70 border border-[#8b7355]/20 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#eae5df] font-bold">Turbulence Layer</span>
                    </div>
                    <button
                      onClick={() => setShowTurbulence(!showTurbulence)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        showTurbulence ? 'bg-[#8b7355]' : 'bg-neutral-800'
                      }`}
                      title="Toggle Turbulence Visualization Layer"
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          showTurbulence ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[9.5px] text-white/50 leading-relaxed font-sans mt-1">
                    Enable real-time fluid vector mapping to study shear stress and boundary transition eddies based on the Hazen-Williams C-factor roughness index ({roughnessC}).
                  </p>
                </div>
              </div>

              {/* Graphical CAD pipe view & computed physics variables */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black/35 p-5 sm:p-6 rounded-2xl border border-white/5">
                
                {/* Visual Pipeline Schematic Flow Simulation */}
                <div 
                  className="flex flex-col items-center justify-center p-3 pt-12 relative bg-[#070708] rounded-2xl border border-white/5 overflow-hidden select-none touch-none"
                  onTouchStart={(e) => {
                    if (e.touches.length === 1) handlePipeDragStart(e.touches[0].clientX);
                  }}
                  onTouchMove={(e) => {
                    if (e.touches.length === 1) handlePipeDragMove(e.touches[0].clientX);
                  }}
                  onTouchEnd={handlePipeDragEnd}
                  onTouchCancel={handlePipeDragEnd}
                  onMouseDown={(e) => handlePipeDragStart(e.clientX)}
                  onMouseMove={(e) => handlePipeDragMove(e.clientX)}
                  onMouseUp={handlePipeDragEnd}
                  onMouseLeave={handlePipeDragEnd}
                  title="Drag horizontally to tilt 3D perspective"
                >
                  {/* Top Header Inside flow viewport */}
                  <div className="absolute top-2.5 inset-x-3.5 flex items-center justify-between z-10">
                    <span className="text-[8px] font-mono tracking-widest text-[#dca66c] block bg-secondary/10 border border-[#8b7355]/30 px-2 py-0.5 rounded leading-none uppercase font-bold">
                      Digital Flow Sandbox
                    </span>

                    {/* Miniature view mode switcher */}
                    <div className="flex bg-neutral-900 border border-white/5 p-0.5 rounded-lg">
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          setViewMode('tube'); 
                        }}
                        className={`px-2 py-0.5 text-[8px] font-mono uppercase font-bold rounded transition-all cursor-pointer ${
                          viewMode === 'tube' ? 'bg-[#8b7355] text-white' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        3D Pipe
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation();
                          setViewMode('cross'); 
                        }}
                        className={`px-2 py-0.5 text-[8px] font-mono uppercase font-bold rounded transition-all cursor-pointer ${
                          viewMode === 'cross' ? 'bg-[#8b7355] text-white' : 'text-white/40 hover:text-white'
                        }`}
                      >
                        2D Bore
                      </button>
                    </div>
                  </div>

                  {viewMode === 'cross' ? (() => {
                    // Normalize standard odSize (32 to 315) onto visual viewport radius map (16 to 45)
                    const crossOuterRadius = 16 + ((odSize - 32) / (315 - 32)) * 29;
                    const strokeWidthMultiplier = 3 + (wallThickness / 20) * 5;
                    const crossInnerRadius = Math.max(9, crossOuterRadius - (wallThickness * 0.45));
                    
                    return (
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-40 h-40 transform rotate-90" viewBox="0 0 100 100">
                          <defs>
                            {/* Linear fluid wave gradient */}
                            <linearGradient id="fluidBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#2563eb" />
                              <stop offset="50%" stopColor="#60a5fa" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>

                          {/* Main pipe wall circle */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            animate={{ 
                              r: crossOuterRadius,
                              strokeWidth: strokeWidthMultiplier,
                              stroke: pipeMaterial === 'IRON' ? '#4a3e35' : pipeMaterial === 'PVC' ? '#3b3d45' : '#1e1b18'
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                            fill="transparent" 
                          />

                          {/* Pipe Inner Skin with fluid boundary */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            animate={{ r: crossInnerRadius }} 
                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                            fill="url(#fluidBlue)" 
                            stroke="#1e3a8a" 
                            strokeWidth="1.5" 
                          />

                          {/* Moving flow particles animation circle dasharray */}
                          <motion.circle 
                            cx="50" 
                            cy="50" 
                            animate={{ r: Math.max(6, crossInnerRadius - 2.5) }} 
                            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                            fill="transparent" 
                            stroke="#93c5fd" 
                            strokeWidth="1.5"
                            strokeDasharray="5,15"
                            style={{
                              animation: `spin ${6 / fluidSpeed}s linear infinite`,
                              transformOrigin: '50px 50px'
                            }}
                          />

                          {/* Boundary Layer Turbulence Layer Overlay */}
                          {showTurbulence && (
                            <>
                              {/* Layer representing Shear Stress friction zone */}
                              <motion.circle 
                                cx="50" 
                                cy="50" 
                                animate={{ r: Math.max(7, crossInnerRadius - 1) }} 
                                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                fill="none" 
                                stroke={roughnessC === 100 ? '#f59e0b' : '#34d399'} 
                                strokeWidth="2.5" 
                                strokeDasharray="2, 6"
                                className="animate-spin"
                                style={{ animationDuration: roughnessC === 100 ? '5s' : '15s', opacity: 0.7 }}
                              />
                              {/* In rough cast iron, add severe shear stress vectors */}
                              {roughnessC === 100 && (
                                <>
                                  <motion.circle 
                                    cx="50" 
                                    cy="50" 
                                    animate={{ r: Math.max(8, crossInnerRadius + 1) }} 
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="0.8" 
                                    strokeDasharray="1, 8" 
                                    className="animate-spin" 
                                    style={{ animationDuration: '3s', animationDirection: 'reverse' }} 
                                  />
                                  <motion.circle 
                                    cx="50" 
                                    cy="50" 
                                    animate={{ r: Math.max(5, crossInnerRadius - 3.5) }} 
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    fill="none" 
                                    stroke="#fb923c" 
                                    strokeWidth="0.8" 
                                    strokeDasharray="3, 7" 
                                    className="animate-spin" 
                                    style={{ animationDuration: '4s' }} 
                                  />
                                </>
                              )}
                            </>
                          )}
                        </svg>

                        {/* Concentric velocity ring */}
                        <div className="absolute font-sans font-black text-[22px] text-white tracking-tighter shadow-sm flex flex-col items-center justify-center -space-y-1 select-all select-none pointer-events-none">
                          <span>{internalDiameter}</span>
                          <span className="text-[10px] font-mono tracking-wider font-semibold text-secondary uppercase">Bore mm</span>
                        </div>
                      </div>
                    );
                  })() : (
                    /* Spectacular 3D longitudinal pipe model with dragging features */
                    <div className="relative w-full h-48 flex items-center justify-center pt-2">
                      <svg className="w-full h-40 max-w-[260px] drop-shadow-lg" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="pipeWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            {pipeMaterial === 'IRON' ? (
                              <>
                                <stop offset="0%" stopColor="#2c241e" />
                                <stop offset="30%" stopColor="#4a3e35" />
                                <stop offset="70%" stopColor="#1c1611" />
                                <stop offset="100%" stopColor="#0f0c0a" />
                              </>
                            ) : (
                              <>
                                <stop offset="0%" stopColor="#24252a" />
                                <stop offset="30%" stopColor="#3b3d45" />
                                <stop offset="70%" stopColor="#17181c" />
                                <stop offset="100%" stopColor="#0d0e10" />
                              </>
                            )}
                          </linearGradient>
                          <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
                          </linearGradient>
                          <linearGradient id="turbulentSpiralsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>

                        <style>{`
                          @keyframes pathOffset {
                            from { stroke-dashoffset: 120; }
                            to { stroke-dashoffset: 0; }
                          }
                          .stream-laminar-path {
                            stroke-dasharray: 24, 16;
                            animation: pathOffset var(--stream-speed, 2s) linear infinite;
                          }
                          .stream-turbulent-path {
                            stroke-dasharray: 10, 8;
                            animation: pathOffset var(--stream-speed, 1.4s) linear infinite;
                          }
                        `}</style>

                        {/* Main Pipe structure with touch drag rotation tilt angle */}
                        <g transform={`rotate(${pipe3DRotation} 120 60)`}>
                          {/* Calculations for local geometric dimensions */}
                          {(() => {
                            const rOuter = Math.min(38, Math.max(15, odSize * 0.12));
                            const rInner = Math.min(35, Math.max(10, (odSize - 2 * wallThickness) * 0.12));
                            const streamSpeed = Math.max(0.4, 4.5 / fluidSpeed);

                            // Wave params for Iron (low C-factor = 100), straight for HDPE/PVC (C = 150)
                            const isTurbulent = showTurbulence && roughnessC === 100;
                            const amp = isTurbulent ? 4.5 : 0;
                            
                            return (
                              <>
                                {/* 3D Outer Cylinder Body */}
                                <motion.path 
                                  animate={{
                                    d: `
                                      M 25 ${60 - rOuter}
                                      L 215 ${60 - rOuter}
                                      A 8 ${rOuter} 0 0 1 215 ${60 + rOuter}
                                      L 25 ${60 + rOuter}
                                      A 8 ${rOuter} 0 0 1 25 ${60 - rOuter}
                                      Z
                                    `
                                  }}
                                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                  fill="url(#pipeWallGrad)" 
                                  stroke={pipeMaterial === 'IRON' ? '#aa9273' : '#4b5563'} 
                                  strokeWidth="1.5"
                                  opacity="0.9"
                                />

                                {/* Transparent Inner Bore fluid channel background */}
                                <motion.path 
                                  animate={{
                                    d: `
                                      M 25 ${60 - rInner}
                                      L 215 ${60 - rInner}
                                      A 6 ${rInner} 0 0 1 215 ${60 + rInner}
                                      L 25 ${60 + rInner}
                                      A 6 ${rInner} 0 0 1 25 ${60 - rInner}
                                      Z
                                    `
                                  }}
                                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                  fill="url(#waterFlowGrad)" 
                                  opacity="0.3" 
                                />

                                {/* Moving streamlines dynamically calculated using sine-wave helper */}
                                <g style={{ '--stream-speed': `${streamSpeed}s` } as React.CSSProperties}>
                                  {/* Streamline 1 (Upper channel) */}
                                  <motion.path 
                                    animate={{ d: generateWavyPath(60 - rInner * 0.5, amp, 1.2) }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    fill="none" 
                                    stroke={isTurbulent ? '#fbbf24' : '#93c5fd'} 
                                    strokeWidth="1.5" 
                                    className={isTurbulent ? 'stream-turbulent-path' : 'stream-laminar-path'}
                                  />
                                  
                                  {/* Streamline 2 (Core centerline) */}
                                  <motion.path 
                                    animate={{ d: generateWavyPath(60, amp * 0.3, 1.8) }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    fill="none" 
                                    stroke={isTurbulent ? '#f59e0b' : '#38bdf8'} 
                                    strokeWidth="2" 
                                    className={isTurbulent ? 'stream-turbulent-path' : 'stream-laminar-path'}
                                  />

                                  {/* Streamline 3 (Lower channel) */}
                                  <motion.path 
                                    animate={{ d: generateWavyPath(60 + rInner * 0.5, amp, 1.2) }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    fill="none" 
                                    stroke={isTurbulent ? '#fbbf24' : '#93c5fd'} 
                                    strokeWidth="1.5" 
                                    className={isTurbulent ? 'stream-turbulent-path' : 'stream-laminar-path'}
                                  />
                                </g>

                                {/* Swirling Turbulence boundary-layer eddies - only if active and material is Iron */}
                                {isTurbulent && (
                                  <>
                                    {/* Eddy vortex 1 (Upper Left) */}
                                    <motion.g 
                                      animate={{ transform: `translate(60, ${60 - rInner + 3})` }}
                                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    >
                                      <circle cx="0" cy="0" r="4.5" fill="none" stroke="url(#turbulentSpiralsGrad)" strokeWidth="1" strokeDasharray="3, 3" className="animate-spin" style={{ animationDuration: '1.5s' }} />
                                      <circle cx="0" cy="0" r="1.5" fill="#ef4444" />
                                    </motion.g>
                                    
                                    {/* Eddy vortex 2 (Lower Middle) */}
                                    <motion.g 
                                      animate={{ transform: `translate(120, ${60 + rInner - 3})` }}
                                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    >
                                      <circle cx="0" cy="0" r="4.5" fill="none" stroke="url(#turbulentSpiralsGrad)" strokeWidth="1" strokeDasharray="3, 3" className="animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }} />
                                      <circle cx="0" cy="0" r="1.5" fill="#f59e0b" />
                                    </motion.g>

                                    {/* Eddy vortex 3 (Upper Right) */}
                                    <motion.g 
                                      animate={{ transform: `translate(170, ${60 - rInner + 3})` }}
                                      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                    >
                                      <circle cx="0" cy="0" r="4" fill="none" stroke="url(#turbulentSpiralsGrad)" strokeWidth="1" strokeDasharray="2, 2" className="animate-spin" style={{ animationDuration: '1.2s' }} />
                                      <circle cx="0" cy="0" r="1" fill="#ef4444" />
                                    </motion.g>
                                  </>
                                )}

                                {/* Inner Bore structural circular ends overlay to prove hollowing */}
                                <motion.ellipse 
                                  cx="25" 
                                  cy="60" 
                                  rx="6" 
                                  animate={{ ry: rInner }} 
                                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                  fill="none" 
                                  stroke="#2563eb" 
                                  strokeWidth="1" 
                                  opacity="0.4" 
                                />
                                <motion.ellipse 
                                  cx="215" 
                                  cy="60" 
                                  rx="6" 
                                  animate={{ ry: rInner }} 
                                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                  fill="none" 
                                  stroke="#2563eb" 
                                  strokeWidth="1.2" 
                                  opacity="0.5" 
                                />
                              </>
                            );
                          })()}
                        </g>
                      </svg>

                      {/* Micro interaction swipe prompt */}
                      <span className="absolute bottom-2.5 right-3 text-[7.5px] font-mono text-white/40 tracking-wider flex items-center gap-1.5 select-none pointer-events-none">
                        <span>🔄 Swipe / Drag tube to rotate 3D</span>
                      </span>
                    </div>
                  )}

                  {/* Realtime C-Factor turbulence states list banner */}
                  {showTurbulence && (
                    <div className="absolute bottom-2.5 inset-x-2 px-2.5 py-1.5 bg-[#0e0c0a]/90 backdrop-blur-sm border border-[#4a3e35]/30 rounded-xl flex items-center justify-between text-[8px] font-mono select-none pointer-events-none z-10">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${roughnessC === 100 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                        <span className="text-white/45">FLOW REGIME:</span>
                        <span className={`font-black ${roughnessC === 100 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {roughnessC === 100 ? 'Boundary Turbulence' : 'Smooth Laminar'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/45">C-FACTOR:</span>
                        <span className="text-secondary font-black ml-1">{roughnessC}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full text-center mt-3 text-[10px] font-sans text-white/50">
                  {viewMode === 'cross' ? (
                    <span>Pipe Interior Cross-Section (OD: <strong className="text-white">{odSize}mm</strong> • wall: <strong className="text-white">{wallThickness}mm</strong> • Bore ID: <strong className="text-white">{internalDiameter}mm</strong>)</span>
                  ) : (
                    <span>Holographic 3D Pipeline (OD: <strong className="text-white">{odSize}mm</strong> • Roughness C-Factor: <strong className="text-white text-secondary">{roughnessC}</strong>)</span>
                  )}
                </div>

                {/* Physics telemetry display layout */}
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-white/10 pb-2">
                      <span className="text-[9px] font-mono text-secondary uppercase tracking-widest font-black block">Computed Telemetry</span>
                      <h4 className="text-base font-serif text-white mt-0.5">Hydraulic Pipeline Mass Output</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Flow volume rate */}
                      <div className="bg-[#18181b]/80 border border-white/5 p-3 rounded-xl">
                        <span className="text-[8.5px] font-mono text-white/40 uppercase tracking-widest">Hydraulic Discharge</span>
                        <div className="flex items-baseline gap-1 mt-1 text-white">
                          <span className="text-2xl font-sans font-bold text-secondary tracking-tight">{flowMetrics.litersPerSec}</span>
                          <span className="text-[9px] font-mono uppercase text-white/50">L/s</span>
                        </div>
                        <span className="text-[9.5px] text-white/60 font-sans block mt-1 leading-snug">
                          ~ {flowMetrics.cubicMeterPerHour} m³/hour
                        </span>
                      </div>

                      {/* Head friction loss */}
                      <div className="bg-[#18181b]/80 border border-white/5 p-3 rounded-xl">
                        <span className="text-[8.5px] font-mono text-white/40 uppercase tracking-widest">Friction Head Loss</span>
                        <div className="flex items-baseline gap-1 mt-1 text-white">
                          <span className={`text-2xl font-sans font-bold tracking-tight ${flowMetrics.headLoss > 9 ? 'text-amber-400' : 'text-emerald-400'}`}>{flowMetrics.headLoss}</span>
                          <span className="text-[9px] font-mono uppercase text-white/50">M</span>
                        </div>
                        <span className="text-[9.5px] text-white/50 font-sans block mt-1 leading-snug">
                          Meter head loss per 100m.
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-white uppercase font-serif italic">
                        <Zap className="w-3.5 h-3.5 text-secondary" />
                        Engineering Optimization Pattern
                      </div>
                      <p className="text-[11px] text-white/70 font-sans leading-relaxed mt-1 block">
                        {pipeMaterial === 'IRON' ? (
                          `Ductile Iron has a high-resistance skin drag coefficient (C-Factor = ${roughnessC}), triggering heavy friction shear and turbulent eddy losses near the boundaries. Toggle the Turbulence Layer in 3D Mode to view these chaotic, wavy flow paths. Upgrading to smooth polymers limits line head loss.`
                        ) : (
                          `Smooth polymers boast a high coefficient (C-Factor = ${roughnessC}). Fluid slips over the inner wall frictionlessly, preserving pristine laminar streamlines. Toggle the Turbulence Layer to verify the stable, parallel slip flow paths.`
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-[8.5px] font-mono text-[#eae5df]/30 uppercase block text-right tracking-widest select-none">
                    *FORMULA: Hazen-Williams Empirical Loss Metric under 27°C
                  </span>
                </div>

              </div>

            </motion.div>
          )}

          {/* 2. LAB BURST SIMULATOR TAB */}
          {activeTab === 'lab' && (
            <motion.div
              key="lab-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8"
            >
              {/* Batch list select */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-secondary" /> Direct Laboratory Batch Audit
                  </h3>
                  <p className="text-[11px] text-white/50 font-sans mt-1">
                    Simulate real Bureau of Indian Standards (BIS) hydrostatic compression and density scans before procurement dispatch notes.
                  </p>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {BATCH_QA_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.batchId}
                      onClick={() => {
                        setLabBatchId(tmpl.batchId);
                        setTestPhase('idle');
                        setTestPsi(0);
                      }}
                      className={`w-full p-3.5 text-left rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        labBatchId === tmpl.batchId
                          ? 'border-secondary bg-secondary/5 text-white ring-1 ring-secondary/20'
                          : 'bg-neutral-900/60 border-white/5 text-white/60 hover:bg-[#18181b]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#8b7355] rounded-full inline-block" />
                          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{tmpl.batchId}</span>
                        </div>
                        <p className="text-[10px] text-white/50 font-sans leading-none pl-3.5">
                          {tmpl.material} • Joint size {tmpl.size}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-secondary uppercase bg-secondary/15 px-2 py-0.5 rounded leading-none">
                        Active Specs
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lab Burst Chamber Simulator Graphic */}
              <div className="lg:col-span-7 bg-black/45 border border-white/5 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="border-b border-white/10 pb-3 flex justify-between items-center bg-black/10 px-4 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bgColor-secondary/10 text-secondary border border-secondary/25 text-[9px] font-mono font-black uppercase rounded tracking-widest leading-none bg-neutral-900">
                      QA STAMP
                    </span>
                    <span className="text-[11px] font-mono text-white/70 font-semibold">{activeBatchInfo.batchId}</span>
                  </div>
                  
                  {/* Phase labels */}
                  {testPhase === 'idle' && (
                    <span className="text-[9px] font-mono font-bold text-white/40 tracking-widest uppercase">CHAMBER PREPPED</span>
                  )}
                  {testPhase === 'running' && (
                    <span className="text-[9px] font-mono font-bold text-amber-400 tracking-widest uppercase animate-pulse">PRESSURIZING CORRIDOR</span>
                  )}
                  {testPhase === 'passed' && (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> CERTIFIED PASSED
                    </span>
                  )}
                </div>

                <div className="py-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                  {/* Dial Gauge */}
                  <div className="relative w-36 h-36 flex items-center justify-center bg-neutral-950 p-2.5 rounded-full border border-white/5 shadow-xl shadow-black/40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1c1d22" strokeWidth="6" strokeDasharray="180 360" strokeLinecap="round" />
                      {/* Dynamic gauge needle trajectory */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent" 
                        stroke={testPhase === 'passed' ? '#10b981' : '#8b7355'} 
                        strokeWidth="6" 
                        strokeDasharray={`${(testPsi / 280) * 180} 360`} 
                        strokeLinecap="round" 
                      />
                    </svg>

                    {/* Numeric pressure marker */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                      <span className="text-3xl font-light font-serif text-white tracking-tighter">{testPsi}</span>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 leading-none">BURST PSI</span>
                    </div>
                  </div>

                  {/* Diagnostic telemetry notes */}
                  <div className="text-left space-y-3.5 flex-1 max-w-sm">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono text-white/40 uppercase block">Active Audit Routine</span>
                      <p className="text-sm font-semibold text-white font-serif">{activeBatchInfo.test}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[8px] font-mono text-white/30 uppercase block">Recorded Delta</span>
                        <span className="text-xs font-mono font-bold text-white">{testPhase === 'idle' ? '0.00' : activeBatchInfo.value}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono text-white/30 uppercase block">BIS Tolerance Margin</span>
                        <span className="text-xs font-mono font-semibold text-secondary">{activeBatchInfo.margin}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/60 font-sans leading-relaxed">
                      {testPhase === 'idle' && 'Load the spec parameters on hydrostatic pressure test. Standard target is to sustain 2.15x design pressure without dimensional deformation.'}
                      {testPhase === 'running' && 'Hydrostatic chamber sealed. Increasing water compression velocity to trigger elastic boundary check... Monitoring for micro-weeping fractures.'}
                      {testPhase === 'passed' && 'Inspection complete: 100% molecular bonding structural stability. Joint cohesion sustained without pipe wall bulging or stress cracking. Certified for immediate tender allocation.'}
                    </p>
                  </div>
                </div>

                {/* Lab Button Controller Actions */}
                <div className="flex gap-3 mt-4 border-t border-white/5 pt-4">
                  {testPhase !== 'idle' && (
                    <button
                      onClick={() => {
                        setTestPhase('idle');
                        setTestPsi(0);
                      }}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 rounded-xl cursor-pointer transition-colors"
                      title="Reset Simulator"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <button
                    onClick={handleStartLabTest}
                    disabled={testPhase === 'running'}
                    className={`flex-1 py-3 px-6 font-bold uppercase tracking-[0.2em] text-xs font-sans rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                      testPhase === 'running'
                        ? 'bg-neutral-800 text-white/40'
                        : testPhase === 'passed'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                        : 'bg-[#8b7355] hover:bg-white hover:text-black text-white'
                    }`}
                  >
                    {testPhase === 'idle' && (
                      <>
                        <Play className="w-3.5 h-3.5 text-white fill-white" /> Run Test Core Suite
                      </>
                    )}
                    {testPhase === 'running' && 'Compressing Test Chamber...'}
                    {testPhase === 'passed' && (
                      <>
                        ✓ Test Suite Approved • IS:4984 compliant
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. LOGISTICS DISPATCH TARGET TAB */}
          {activeTab === 'dispatch' && (
            <motion.div
              key="dispatch-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 text-left"
            >
              {/* Route List select node */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4 text-secondary" /> Highway Transit Allocation Matrix
                  </h3>
                  <p className="text-[11px] text-white/50 font-sans mt-1">
                    Select a target sector distribution grid to calculate distance, route highways, and average dispatch transit duration.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {REGIONAL_HUBS.map((node, idx) => (
                    <button
                      key={node.city}
                      onClick={() => setSelectedHubIndex(idx)}
                      className={`p-3 text-left border rounded-xl flex flex-col transition-all cursor-pointer ${
                        selectedHubIndex === idx
                          ? 'border-secondary bg-[#8b7355]/10 text-white shadow-md'
                          : 'bg-neutral-900/60 border-white/5 text-white/50 hover:bg-[#18181b] hover:text-white'
                      }`}
                    >
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#8b7355] font-black">{node.state}</span>
                      <span className="text-xs font-bold mt-1 font-sans">{node.city} Grid</span>
                      <span className="text-[10px] font-mono text-white/30 tracking-tight mt-1">{node.distance} Kilometers</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic dispatch router and live delivery countdown */}
              <div className="lg:col-span-7 bg-black/45 border border-white/5 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden text-left space-y-6">
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <div className="p-2 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg">
                      <Compass className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest block leading-none">Source Logistics Node</span>
                      <span className="text-sm font-sans font-extrabold text-white">Dhule Manufacturing Hub Corridor (Plot 42, Avadhan)</span>
                    </div>
                  </div>

                  {/* Route Visual diagram */}
                  <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between text-xs font-sans text-white/80">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                        <span className="font-semibold text-white">Dhule HQ</span>
                      </div>
                      
                      {/* Animating truck route line vector */}
                      <div className="flex-1 px-4 relative flex items-center">
                        <div className="h-[2px] bg-white/10 w-full relative">
                          <motion.div 
                            className="absolute inset-y-0 left-0 bg-secondary"
                            animate={{ width: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        </div>
                        <motion.div
                          animate={{ x: [-8, 120, -8] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Truck className="w-4 h-4 text-secondary rotate-y-180 relative z-10" />
                        </motion.div>
                      </div>

                      <div className="flex items-center gap-1.5 text-right">
                        <span className="font-semibold text-white">{activeHub.city} Hub</span>
                        <MapPin className="w-3.5 h-3.5 text-[#eae5df]" />
                      </div>
                    </div>

                    <div className="text-[11px] text-white/60 font-mono text-center flex justify-between px-1">
                      <span>ORIGIN</span>
                      <span className="text-secondary tracking-widest uppercase font-bold">{activeHub.routeHighlight}</span>
                      <span>DESTINATION</span>
                    </div>
                  </div>

                  {/* Supply variables list table layout */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl text-left">
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Core Highway</span>
                      <span className="text-xs font-bold text-white block mt-1 font-sans">{activeHub.routeHighlight.split(' ')[1] || 'State HW'}</span>
                    </div>

                    <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl text-left">
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Total Route Distance</span>
                      <span className="text-xs font-bold text-secondary block mt-1 font-sans">{activeHub.distance} Km</span>
                    </div>

                    <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl text-left">
                      <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest block">Est. Transit Time</span>
                      <span className="text-xs font-bold text-white block mt-1 font-sans">~ {activeHub.transitHours} Hours</span>
                    </div>
                  </div>

                  <p className="text-[10px] sm:text-xs text-white/70 font-sans leading-relaxed pt-1 select-all">
                    Direct-factory logistics dispatches leave our Avadhan plant twice daily. Supplies destined for <strong className="text-white font-semibold">{activeHub.city} ({activeHub.state})</strong> are coupled under dedicated heavy flatbed networks. This avoids depot sorting delay structures and secures immediate on-site offloading within hours from order clearance stamps.
                  </p>
                </div>

                <div className="p-3 bg-[#fe6000]/10 border border-[#fe6000]/20 rounded-xl flex items-center gap-3 text-xs text-white/80 select-none">
                  <div className="p-1 px-1.5 bg-[#fe6000]/20 rounded text-[#fe6000] font-mono font-bold text-[9px] uppercase tracking-wide">
                    Live Note
                  </div>
                  <span className="leading-snug text-white/90">
                    Municipal procurement desks can authorize specialized freight trucks matching direct canal layouts or pipe coils bundle logistics layouts.
                  </span>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </section>
  );
}
