import { useState } from 'react';
import { 
  Settings2, 
  ArrowRight, 
  Droplets, 
  Wrench, 
  Sparkles,
  Zap,
  Waves,
  ShieldCheck,
  Sun,
  Thermometer,
  Activity,
  Cpu,
  Gauge,
  Truck,
  Layers,
  Award,
  Maximize2,
  Share2
} from 'lucide-react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import ShareProductModal from './ShareProductModal';
import AmazonCatalog from './AmazonCatalog';

// Custom hook to handle high-fidelity 3D tilt effect organically on mouse movement
function use3DTilt(maxTilt = 7) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 140 };
  const tiltXSpring = useSpring(tiltX, springConfig);
  const tiltYSpring = useSpring(tiltY, springConfig);

  const rotateX = useTransform(tiltYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(tiltXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(xVal);
    tiltY.set(yVal);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 55 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
} as const;

interface BentoPortfolioProps {
  onSelectProduct: (product: Product) => void;
  onSelectProductById: (id: string) => void;
  onAddProductToQuote?: (product: Product) => void;
}

export default function BentoPortfolio({ onSelectProduct, onSelectProductById, onAddProductToQuote }: BentoPortfolioProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLaymanMode, setIsLaymanMode] = useState(true);
  const [portfolioViewMode, setPortfolioViewMode] = useState<'cad' | 'amazon'>('amazon');
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

  const handleOpenShare = (p: Product) => {
    setSharingProduct(p);
  };

  // Initialize 3D tilt hooks for each card
  const hdpeTilt = use3DTilt(5);
  const motorTilt = use3DTilt(7);
  const pvcTilt = use3DTilt(7);
  const tankTilt = use3DTilt(5);

  // Extract specific products
  const hdpeProduct = ALL_PRODUCTS.find(p => p.id === 'hdpe-pipes');
  const motorProduct = ALL_PRODUCTS.find(p => p.id === 'industrial-motors');
  const pvcProduct = ALL_PRODUCTS.find(p => p.id === 'pvc-pipes');
  const tankProduct = ALL_PRODUCTS.find(p => p.id === 'water-tanks');

  // HDPE Pipe Simulator State
  const hdpeSimOptions = [
    { od: 63, thickness: 5.8, flow: '12.5 L/s', label: '63 mm Branch Pipe', weight: '1.05 kg/m' },
    { od: 110, thickness: 10.0, flow: '44.2 L/s', label: '110 mm Main Supply', weight: '3.12 kg/m' },
    { od: 160, thickness: 14.6, flow: '108.5 L/s', label: '16 trunk Line', weight: '6.64 kg/m' },
    { od: 200, thickness: 18.2, flow: '178.0 L/s', label: '200 mm Outfall Trunk', weight: '10.36 kg/m' }
  ];
  const [activeHdpeIdx, setActiveHdpeIdx] = useState(1); // 110 mm as default

  // uPVC Pipe Simulator State
  const pvcSimOptions = [
    { od: 75, thickness: 3.6, label: '75 mm Conduit Only', weight: '1.18 kg/m' },
    { od: 110, thickness: 5.3, label: '110 mm Casing Well', weight: '2.56 kg/m' },
    { od: 160, thickness: 7.7, label: '160 mm Sewer Casing', weight: '5.39 kg/m' },
    { od: 250, thickness: 11.9, label: '250 mm Bore Socket', weight: '13.15 kg/m' }
  ];
  const [activePvcIdx, setActivePvcIdx] = useState(1); // 110 mm as default

  // Motor Simulator State
  const [motorSpeed, setMotorSpeed] = useState<'low' | 'high'>('high');
  const [isMotorSpinning, setIsMotorSpinning] = useState(true);

  // PVC Burial stress simulator State
  const [burialDepth, setBurialDepth] = useState<'shallow' | 'standard' | 'deep'>('standard');
  const [isTruckPassing, setIsTruckPassing] = useState(false);
  const [deflectionMetric, setDeflectionMetric] = useState(0.25);

  // Water tank layers state
  const [selectedTankLayer, setSelectedTankLayer] = useState<'outer' | 'middle' | 'inner'>('middle');

  // 3D CSS Model visualization states
  const [show3DHDPE, setShow3DHDPE] = useState(false);
  const [show3DMotor, setShow3DMotor] = useState(false);
  const [show3DPVC, setShow3DPVC] = useState(false);
  const [show3DTank, setShow3DTank] = useState(false);

  // Triggering the truck stress animation on PVC card
  const handleSimulateTruck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTruckPassing) return;
    setIsTruckPassing(true);
    setDeflectionMetric(burialDepth === 'shallow' ? 0.95 : burialDepth === 'standard' ? 0.38 : 0.12);
    
    setTimeout(() => {
      setIsTruckPassing(false);
    }, 1800);
  };

  return (
    <section id="portfolio-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-on-surface">
      <style>{`
        @keyframes spin3D {
          from { transform: rotateX(-22deg) rotateY(0deg); }
          to { transform: rotateX(-22deg) rotateY(360deg); }
        }
        .animate-spin-3d {
          animation: spin3D 15s linear infinite;
        }
      `}</style>
      
      {/* Grid Header with glowing accent */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/35 pb-6">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#8b7355] font-sans font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-secondary" /> Wholesale Directory
          </span>
          <h2 className="text-2xl sm:text-3.5xl font-light font-serif tracking-tight text-primary mt-1.5">
            Industrial Product <span className="italic font-normal">Catalog</span>
          </h2>
          <p className="text-xs text-on-surface-variant/80 font-sans font-light mt-2 max-w-xl">
            Choose between standard high-fidelity engineer blueprints and an everyday Amazon-style procurement catalog.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Segmented Selector for View Style */}
          <div className="flex bg-[#0f0f12] border border-[#aa9273]/20 p-1 rounded-xl shadow-inner shrink-0 select-none">
            <button
              onClick={() => setPortfolioViewMode('amazon')}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                portfolioViewMode === 'amazon'
                  ? 'bg-[#8b7355] text-white shadow-md'
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              <span>🛒 Easy Catalog</span>
            </button>
            <button
              onClick={() => setPortfolioViewMode('cad')}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                portfolioViewMode === 'cad'
                  ? 'bg-neutral-800 text-amber-300 border border-white/5 shadow-inner'
                  : 'bg-transparent text-white/50 hover:text-white'
              }`}
            >
              <span>💻 Interactive CAD</span>
            </button>
          </div>

          <button
            onClick={() => setIsLaymanMode(!isLaymanMode)}
            className={`px-4 py-2 border rounded-xl text-xs font-sans font-bold tracking-wide uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isLaymanMode
                ? 'bg-amber-400/15 border-amber-500/55 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span className={isLaymanMode ? 'animate-bounce' : ''}>💡</span>
            <span>{isLaymanMode ? 'Plain English: ON' : '💡 Non-Technical Guide'}</span>
          </button>
          
          <p className="text-secondary/80 font-mono text-[9px] uppercase tracking-[0.15em] font-bold bg-[#8b7355]/5 px-3.5 py-1.5 border border-secondary/15 rounded-md shrink-0 select-none">
            State Compliant
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {portfolioViewMode === 'cad' ? (
          <motion.div 
            key="cad-grid-view"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
        
        {/* 1. HDPE & MDPE Pipes (Large - col-span-8) */}
        {hdpeProduct && (
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              borderColor: "rgba(220, 166, 108, 0.55)",
              boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(220, 166, 108, 0.35)"
            }}
            onMouseEnter={() => setHoveredCard('hdpe-pipes')}
            onMouseMove={hdpeTilt.handleMouseMove}
            onMouseLeave={() => {
              hdpeTilt.handleMouseLeave();
              setHoveredCard(null);
            }}
            style={{ 
              rotateX: hdpeTilt.rotateX, 
              rotateY: hdpeTilt.rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="lg:col-span-8 premium-card group relative overflow-hidden bg-[#0a0a0c] p-6 sm:p-8 min-h-[520px] flex flex-col justify-between border border-[#aa9273]/25 shadow-lg hover:shadow-2xl hover:shadow-[#8b7355]/15 transition-all duration-500 rounded-3xl"
          >
            {/* Slim, semi-transparent specification summary Hover Overlay */}
            <AnimatePresence>
              {hoveredCard === 'hdpe-pipes' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute top-4 inset-x-4 z-40 bg-black/85 backdrop-blur-md rounded-2xl border border-[#aa9273]/45 p-3.5 hidden lg:flex items-center justify-between shadow-2xl pointer-events-none select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase font-bold">Specs QuickView</span>
                    <span className="text-xs text-white/90 font-medium font-serif mt-0.5">HDPE Pipe Profile</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-center">
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Active Diameter</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-[#dca66c] mt-0.5">
                        {hdpeSimOptions[activeHdpeIdx].od} mm
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Wall Thickness</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-white mt-0.5">
                        {hdpeSimOptions[activeHdpeIdx].thickness.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Polymer Grade</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-emerald-400 mt-0.5">PE-100 (0.955 g/cm³)</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col items-center bg-[#8b7355]/20 border border-[#8b7355]/40 px-2 py-0.5 rounded-lg">
                      <span className="text-[6.5px] font-mono text-[#dca66c] uppercase tracking-wider font-extrabold">⚖️ Weight per Meter</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-amber-300 mt-0.5 animate-pulse">
                        {(Math.PI * (hdpeSimOptions[activeHdpeIdx].od - hdpeSimOptions[activeHdpeIdx].thickness) * hdpeSimOptions[activeHdpeIdx].thickness * 0.955 / 1000).toFixed(2)} kg/m
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Visual background Image with dark contrast overlay */}
            {hdpeProduct.image && (
              <div className="absolute inset-0 opacity-20 group-hover:scale-[1.03] transition-transform duration-1000 select-none pointer-events-none">
                <img 
                  className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]" 
                  alt="Technical close-up of HDPE pipelines project trench installation" 
                  src={hdpeProduct.image}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            {/* Dark cosmic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#111115]/50 z-0 pointer-events-none" />

            {/* Content Container - Split into description & interactive block */}
            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              
              {/* Left Column: Product Branding & Descriptions */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    <span className="bg-[#8b7355]/20 text-[#dca66c] text-[9px] font-sans font-bold tracking-[0.2em] px-3 py-1 uppercase rounded-full border border-[#8b7355]/30">
                      Standard: IS 4984 / ISO 4427
                    </span>
                    <span className="text-[10px] font-mono text-white/40 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TENDER APPROVED
                    </span>
                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase md:ml-auto">
                      <Award className="w-3 h-3 text-yellow-400" /> GRADE: PE-100 PREMIUM
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-light font-serif text-white tracking-tight">
                    HDPE &amp; MDPE <span className="italic sm:inline text-secondary font-semibold">Pipes</span>
                  </h3>
                  <p className="text-xs text-[#b4b4b8] font-sans font-light leading-relaxed">
                    High-density polymer pipes crafted from virgin PE-100 resin. Engineered to withstand extreme hydrostatic pressure and ground shifts for long-term municipal service.
                  </p>
                  
                  {isLaymanMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed font-sans"
                    >
                      <span className="text-[14px] shrink-0 mt-0.5">💡</span>
                      <div>
                        <strong className="text-amber-300 font-bold">Plain English:</strong> These are high-strength, flexible heavy-duty plastic pipes. They are laid underground to carry drinking water. Unlike old metal pipes, they never rust and can bend without breaking if the ground moves.
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Simulated Spec Controller */}
                <div className="bg-[#121216]/90 border border-white/5 p-4 rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-secondary" /> Flow Simulator
                  </span>
                  
                  {/* Selector circles */}
                  <div className="grid grid-cols-4 gap-2">
                    {hdpeSimOptions.map((opt, idx) => (
                      <button
                        key={opt.od}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHdpeIdx(idx);
                        }}
                        className={`py-2 text-center text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
                          activeHdpeIdx === idx
                            ? 'bg-[#8b7355] text-white shadow-lg shadow-[#8b7355]/15 scale-102 border-transparent'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                        }`}
                      >
                        {opt.od} mm
                      </button>
                    ))}
                  </div>

                  {isLaymanMode && (
                    <div className="text-[10px] text-emerald-300 font-sans mt-2 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl flex items-center gap-1.5 leading-snug">
                      <span className="text-[12px] shrink-0">🎯</span>
                      <span>
                        {activeHdpeIdx === 0 && "63 mm pipe is perfect for bringing clean water into a separate home or small villa."}
                        {activeHdpeIdx === 1 && "110 mm pipe is ideal for main water distribution lines across a street or building."}
                        {activeHdpeIdx === 2 && "160 mm pipe is engineered for connecting large supply systems across neighborhoods."}
                        {activeHdpeIdx === 3 && "200 mm pipe is a massive main conduit for handling city trunk lines or major reservoirs."}
                      </span>
                    </div>
                  )}

                  {/* Realtime computed details panel */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                    <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/40 uppercase block tracking-wider font-sans">Wall Size</span>
                      <span className="text-xs font-mono font-bold text-white mt-1 block">
                        {hdpeSimOptions[activeHdpeIdx].thickness.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      <span className="text-[8px] text-white/40 uppercase block tracking-wider font-sans">Unit Weight</span>
                      <span className="text-xs font-mono font-bold text-secondary mt-1 block">
                        {hdpeSimOptions[activeHdpeIdx].weight}
                      </span>
                    </div>
                    <div className="bg-[#8b7355]/10 p-2.5 rounded-lg border border-[#aa9273]/20">
                      <span className="text-[8px] text-secondary uppercase block tracking-wider font-sans">Max Flow</span>
                      <span className="text-xs font-mono font-bold text-[#f7cb99] mt-1 block">
                        {hdpeSimOptions[activeHdpeIdx].flow}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D-Like SVG Cross-Section Renderer / 3D CSS Casing */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/40 p-5 rounded-3xl border border-white/5 relative min-h-[300px]">
                
                {/* 3D Product Preview Overlay Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow3DHDPE(!show3DHDPE);
                  }}
                  className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-[#8b7355]/20 hover:bg-[#8b7355]/85 text-secondary hover:text-white border border-[#aa9273]/35 rounded-xl text-[9px] font-mono tracking-wider uppercase font-extrabold flex items-center gap-1.5 transition-all duration-300 shadow-md hover:scale-105 cursor-pointer pointer-events-auto"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
                  </span>
                  {show3DHDPE ? '2D Projection' : 'Interactive 3D Casing'}
                </button>

                {show3DHDPE ? (
                  <div className="relative w-full h-[210px] flex items-center justify-center select-none" style={{ perspective: '800px' }} onClick={(e) => e.stopPropagation()}>
                    {/* Rotating 3D CSS volumetric pipe model */}
                    <div 
                      className="relative w-32 h-32 flex items-center justify-center animate-spin-3d"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {Array.from({ length: 14 }).map((_, i) => {
                        const isStripe = i % 3 === 0;
                        return (
                          <div
                            key={i}
                            className="absolute rounded-full border-[3px] border-[#3182ce]/80 flex items-center justify-center"
                            style={{
                              width: '100px',
                              height: '100px',
                              transform: `translateZ(${(i - 7) * 9}px)`,
                              transformStyle: 'preserve-3d',
                              background: 'radial-gradient(circle, rgba(16,16,19,0.2) 60%, rgba(30,30,36,0.92) 100%)',
                              boxShadow: '0 0 15px rgba(49, 130, 206, 0.15)',
                            }}
                          >
                            {/* Blue Warning Stripe Extrusion */}
                            {isStripe && (
                              <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-secondary shadow-lg shadow-secondary/90 animate-pulse" />
                            )}
                            
                            {/* PE-100 thick wall layering */}
                            <div 
                              className="rounded-full border-[1.5px] border-secondary/30 flex items-center justify-center"
                              style={{
                                width: '84px',
                                height: '84px',
                                background: 'rgba(9, 9, 11, 0.95)',
                              }}
                            >
                              {/* Glowing Inner drinking fluid core */}
                              <div 
                                className="rounded-full bg-gradient-to-tr from-blue-700/60 to-cyan-500/50 border border-blue-400 animate-pulse"
                                style={{
                                  width: '68px',
                                  height: '68px',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[8px] font-mono tracking-widest text-[#8b7355]/90 bg-[#8b7355]/10 px-2 py-1 rounded-md">
                      <Activity className="w-3 h-3 text-secondary" />
                      REAL-TIME SIMULATION
                    </div>

                    {/* SVG Visual Circle representation of HDPE with active co-extruded stripes */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                        <defs>
                          <linearGradient id="solidWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e1e24" />
                            <stop offset="100%" stopColor="#0b0b0e" />
                          </linearGradient>
                          <linearGradient id="innerWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e3a5f" />
                            <stop offset="100%" stopColor="#2c5282" />
                          </linearGradient>
                        </defs>

                        {/* Outer Pipe Wall Circle */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r={36 + activeHdpeIdx * 10} 
                          fill="url(#solidWallGrad)" 
                          stroke="#8b7355" 
                          strokeWidth="1.5" 
                        />

                        {/* Blue Stripes at 0, 90, 180, 270 degrees on outer ring */}
                        <g className="text-[#3182ce]">
                          <line x1="80" y1={80 - (36 + activeHdpeIdx * 10)} x2="80" y2={80 - (36 + activeHdpeIdx * 10) + 4} stroke="#3182ce" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="80" y1={80 + (36 + activeHdpeIdx * 10)} x2="80" y2={80 + (36 + activeHdpeIdx * 10) - 4} stroke="#3182ce" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1={80 - (36 + activeHdpeIdx * 10)} y1="80" x2={80 - (36 + activeHdpeIdx * 10) + 4} y2="80" stroke="#3182ce" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1={80 + (36 + activeHdpeIdx * 10)} y1="80" x2={80 + (36 + activeHdpeIdx * 10) - 4} y2="80" stroke="#3182ce" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                        {/* Inner Fluid/Bore Hole Circle cutout */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r={36 + activeHdpeIdx * 10 - (hdpeSimOptions[activeHdpeIdx].thickness * 1.5)} 
                          fill="url(#innerWaterGrad)" 
                          stroke="#4299e1" 
                          strokeWidth="1" 
                        />

                        {/* Concentric helper line */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r={36 + activeHdpeIdx * 10 - (hdpeSimOptions[activeHdpeIdx].thickness * 1.5) - 3} 
                          fill="none" 
                          stroke="rgba(255,255,255,0.08)" 
                          strokeWidth="0.75" 
                          strokeDasharray="3 3"
                        />
                      </svg>

                      {/* Pulsing Core Ripple on center */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-10 h-10 bg-blue-400/20 rounded-full animate-ping absolute" />
                        <span className="text-[10px] font-mono text-blue-200 mt-1 uppercase tracking-widest font-bold">FLOW OK</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-4 text-center">
                  <span className="text-[9px] text-[#8b7355] font-mono uppercase tracking-[0.2em] font-extrabold block">
                    Bore Space Efficiency
                  </span>
                  <p className="text-white text-xs font-sans mt-0.5">
                    ~ {(((36 + activeHdpeIdx * 10 - (hdpeSimOptions[activeHdpeIdx].thickness * 1.5)) / (36 + activeHdpeIdx * 10)) * 100).toFixed(0)}% Cross-Bore Yield Outer Diameter Ratio
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Panel: Dynamic Actions */}
            <div className="pt-5 border-t border-white/5 mt-6 relative z-10 flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(hdpeProduct);
                    }}
                    className="px-6 py-2.5 bg-[#8b7355] hover:bg-white text-white hover:text-primary font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-xl cursor-pointer shadow-md border border-[#8b7355]/40 hover:border-white"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenShare(hdpeProduct);
                    }}
                    className="p-2.5 bg-white/5 hover:bg-secondary text-white/80 hover:text-white border border-white/10 hover:border-transparent transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center shadow-sm"
                    title="Share HDPE/MDPE specifications datasheet"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="uppercase text-[10px] font-mono font-bold tracking-widest text-[#8b7355] group-hover:text-secondary transition-colors underline decoration-secondary flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5" /> Open Hydrostatic Test Reports
                </span>
              </div>
              <div className="flex items-center gap-1 text-white text-xs font-sans tracking-wide">
                <span className="border-b border-white/10 group-hover:border-secondary pb-0.5 transition-colors font-bold uppercase text-[10px] tracking-widest">
                  View Custom Quote Sheet
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 text-secondary" />
              </div>
            </div>

          </motion.div>
        )}

        {/* 2. Industrial Motors (col-span-4) */}
        {motorProduct && (
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              borderColor: "rgba(220, 166, 108, 0.55)",
              boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(220, 166, 108, 0.35)"
            }}
            onMouseEnter={() => setHoveredCard('industrial-motors')}
            onMouseMove={motorTilt.handleMouseMove}
            onMouseLeave={() => {
              motorTilt.handleMouseLeave();
              setHoveredCard(null);
            }}
            style={{ 
              rotateX: motorTilt.rotateX, 
              rotateY: motorTilt.rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="lg:col-span-4 premium-card bg-[#141416]/95 border border-[#8b7355]/20 p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-[#8b7355]/15 transition-all duration-500 rounded-3xl min-h-[520px]"
          >
            {/* Slim, semi-transparent specification summary Hover Overlay */}
            <AnimatePresence>
              {hoveredCard === 'industrial-motors' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute top-4 inset-x-4 z-40 bg-black/85 backdrop-blur-md rounded-2xl border border-[#8b7355]/45 p-3.5 hidden lg:flex items-center justify-between shadow-2xl pointer-events-none select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase font-bold">Specs QuickView</span>
                    <span className="text-xs text-white/90 font-medium font-serif mt-0.5">Rotor Induction</span>
                  </div>
                  <div className="flex items-center gap-3 text-center sm:gap-5">
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Frameset</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-[#dca66c] mt-0.5">IE3 &amp; IE4</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Service Mode</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-white mt-0.5">S1 Continuous</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Efficiency Class</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-emerald-400 mt-0.5">96.5% Peak</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              
              {/* Card Title Header */}
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#8b7355]/10 border border-[#8b7355]/25 text-secondary rounded-2xl w-fit">
                  <Settings2 className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex flex-col items-end gap-1.5 text-right font-sans">
                  <span className="bg-secondary/15 text-secondary text-[9px] font-sans font-extrabold px-3 py-1 uppercase rounded-full border border-secondary/25 select-none">
                    IE3 / IE4 PREMIUM
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded text-[8px] font-mono font-bold tracking-wider uppercase">
                    <Zap className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> EFFICIENCY: 96.5% IE4
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif text-white leading-none">
                  Industrial <span className="italic font-light">Motors</span>
                </h3>
                <p className="text-[8px] uppercase tracking-[0.15em] font-sans font-bold text-secondary mt-1.5">IS 12615 Approved</p>
                <p className="text-white/55 font-sans font-light text-xs leading-relaxed mt-2.5">
                  High-efficiency cast-iron induction motors built for continuous duty in civic waterworks and pumping treatments.
                </p>
                
                {isLaymanMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed font-sans mt-3"
                  >
                    <span className="text-[14px] shrink-0 mt-0.5">💡</span>
                    <div>
                      <strong className="text-amber-300 font-bold">Plain English:</strong> This is a powerful electrical engine designed to run water pumps. It is built from heavy cast iron to run 24 hours a day without stopping or overheating so that local communities get water pressure.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Animated Pumping efficiency Dial Widget */}
              <div className="bg-black/30 p-4 border border-white/5 rounded-2xl relative min-h-[190px] flex flex-col justify-between">
                
                {/* 3D Product Preview Overlay Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow3DMotor(!show3DMotor);
                  }}
                  className="absolute top-2 right-2 z-20 px-2 py-1 bg-[#8b7355]/20 hover:bg-[#8b7355]/85 text-secondary hover:text-white border border-[#aa9273]/30 rounded-lg text-[8px] font-mono tracking-wider uppercase font-bold flex items-center gap-1 transition-all duration-300 cursor-pointer pointer-events-auto"
                >
                  {show3DMotor ? '2D Specs' : 'View 3D Rotor'}
                </button>

                {show3DMotor ? (
                  <div className="relative w-full h-[120px] flex items-center justify-center overflow-hidden" style={{ perspective: '600px' }} onClick={(e) => e.stopPropagation()}>
                    {/* Rotating 3D CSS motor rotor */}
                    <div 
                      className="relative w-24 h-24 flex items-center justify-center animate-spin-3d"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute border border-neutral-700 flex items-center justify-center rounded-xl font-mono text-[7px]"
                          style={{
                            width: '56px',
                            height: '56px',
                            transform: `translateZ(${(i - 4) * 11}px)`,
                            transformStyle: 'preserve-3d',
                            background: 'linear-gradient(135deg, #1b1c20 0%, #0d0d0f 100%)',
                            boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                          }}
                        >
                          {/* Copper stator coil */}
                          <div 
                            className="w-8 h-8 rounded-full border border-orange-500/45 flex items-center justify-center"
                            style={{ background: 'radial-gradient(circle, #b45309 30%, transparent 80%)' }}
                          >
                            {/* Rotating polished axle */}
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-white/50 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Simulated spinning motor core graphic */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative w-16 h-16 bg-neutral-900 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        
                        {/* Rotating lines representation for cooling stator */}
                        <svg 
                          className={`w-12 h-12 text-[#8b7355] ${
                            isMotorSpinning 
                              ? motorSpeed === 'high' 
                                ? 'animate-[spin_0.8s_linear_infinite]' 
                                : 'animate-[spin_2s_linear_infinite]'
                              : ''
                          }`} 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                        >
                          <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                        </svg>

                        <div className="absolute w-5 h-5 bg-neutral-950 rounded-full border border-white/10 flex items-center justify-center">
                          <Cpu className="w-2.5 h-2.5 text-secondary" />
                        </div>
                      </div>

                      {/* Settings toggle controls */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase text-white/50">
                          <span>Live Shaft Duty:</span>
                          <span className={isMotorSpinning ? 'text-emerald-500' : 'text-rose-500'}>
                            {isMotorSpinning ? 'ACTIVE' : 'STANDBY'}
                          </span>
                        </div>

                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setMotorSpeed('low')}
                            className={`flex-1 py-1 text-[9px] font-mono font-bold rounded-lg transition-transform hover:scale-[1.01] active:translate-y-0.5 ${
                              motorSpeed === 'low'
                                ? 'bg-[#8b7355]/40 text-secondary font-bold ring-1 ring-secondary/40'
                                : 'bg-white/5 text-white/70'
                            }`}
                          >
                            1450 RPM
                          </button>
                          <button
                            onClick={() => setMotorSpeed('high')}
                            className={`flex-1 py-1 text-[9px] font-mono font-bold rounded-lg transition-transform hover:scale-[1.01] active:translate-y-0.5 ${
                              motorSpeed === 'high'
                                ? 'bg-[#8b7355] text-white shadow-md'
                                : 'bg-white/5 text-white/70'
                            }`}
                          >
                            2900 RPM
                          </button>
                        </div>
                        
                        {isLaymanMode && (
                          <div className="text-[9px] text-amber-200 font-sans leading-relaxed mt-1 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                            RPM = Rotations Per Minute. 1450 is like a moderate ceiling fan speed. 2900 runs twice as fast to pump double the amount of water per hour!
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                )}

                {/* Micro efficiency meter gauge */}
                <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between text-xs font-mono font-light text-white/90">
                  <span className="flex items-center gap-1.5 text-[10px] text-white/50">
                    <Gauge className="w-3.5 h-3.5 text-secondary" />
                    IE4 Efficiency Target
                  </span>
                  <span className="font-bold text-emerald-400">96.5% Peak</span>
                </div>

              </div>

            </div>

            <div className="flex gap-2.5 mt-8">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(motorProduct);
                }}
                className="flex-grow py-4 bg-[#8b7355] hover:bg-white hover:text-primary text-white font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl cursor-pointer shadow-md shadow-black/10"
              >
                Inspect
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenShare(motorProduct);
                }}
                className="px-4.5 bg-white/5 hover:bg-secondary text-white/80 hover:text-white border border-white/10 hover:border-transparent transition-all duration-300 rounded-2xl cursor-pointer flex items-center justify-center shadow-sm"
                title="Share Industrial Motors specifications datasheet"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. PVC Infrastructure (col-span-4) */}
        {pvcProduct && (
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              borderColor: "rgba(220, 166, 108, 0.55)",
              boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(220, 166, 108, 0.35)"
            }}
            onMouseEnter={() => setHoveredCard('pvc-pipes')}
            onMouseMove={pvcTilt.handleMouseMove}
            onMouseLeave={() => {
              pvcTilt.handleMouseLeave();
              setHoveredCard(null);
            }}
            style={{ 
              rotateX: pvcTilt.rotateX, 
              rotateY: pvcTilt.rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="lg:col-span-4 premium-card bg-[#141416]/95 border border-[#8b7355]/20 p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#8b7355]/15 transition-all duration-500 group shadow-lg rounded-3xl min-h-[520px]"
          >
            {/* Slim, semi-transparent specification summary Hover Overlay */}
            <AnimatePresence>
              {hoveredCard === 'pvc-pipes' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute top-4 inset-x-4 z-40 bg-black/85 backdrop-blur-md rounded-2xl border border-[#8b7355]/45 p-3.5 hidden lg:flex items-center justify-between shadow-2xl pointer-events-none select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase font-bold">Specs QuickView</span>
                    <span className="text-xs text-white/90 font-medium font-serif mt-0.5">uPVC Conduit</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-center">
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Active Diameter</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-[#dca66c] mt-0.5">
                        {pvcSimOptions[activePvcIdx].od} mm
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Wall Thickness</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-white mt-0.5">
                        {pvcSimOptions[activePvcIdx].thickness.toFixed(1)} mm
                      </span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Compound Grade</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-emerald-400 mt-0.5">uPVC (1.42 g/cm³)</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col items-center bg-[#8b7355]/20 border border-[#8b7355]/40 px-2 py-0.5 rounded-lg">
                      <span className="text-[6.5px] font-mono text-[#dca66c] uppercase tracking-wider font-extrabold">⚖️ Weight per Meter</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-amber-300 mt-0.5 animate-pulse">
                        {(Math.PI * (pvcSimOptions[activePvcIdx].od - pvcSimOptions[activePvcIdx].thickness) * pvcSimOptions[activePvcIdx].thickness * 1.42 / 1000).toFixed(2)} kg/m
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              
              {/* Card Title Header */}
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#8b7355]/10 border border-[#8b7355]/25 text-secondary rounded-2xl w-fit">
                  <Wrench className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex flex-col items-end gap-1.5 text-right font-sans">
                  <span className="bg-secondary/15 text-secondary text-[9px] font-sans font-extrabold px-3 py-1 uppercase rounded-full border border-secondary/25 select-none">
                    HIGH RING STIFFNESS
                  </span>
                  <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded text-[8px] font-mono font-bold tracking-wider uppercase">
                    <Award className="w-2.5 h-2.5 text-yellow-400" /> STIFFNESS: SN8 HEAVY
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif text-white leading-none">
                  uPVC <span className="italic font-sans text-secondary text-base">Conduit &amp; Casing</span>
                </h3>
                <p className="text-[8px] uppercase tracking-[0.15em] font-sans font-bold text-secondary mt-1.5">IS 4985 Certified</p>
                <p className="text-white/55 font-sans font-light text-xs leading-relaxed mt-2.5">
                  Rigid uPVC conduits optimized for sub-surface drainage, agricultural bore casings, and telecommunication ducting.
                </p>
                
                {isLaymanMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-200/90 leading-relaxed font-sans mt-3"
                  >
                    <span className="text-[14px] shrink-0 mt-0.5">💡</span>
                    <div>
                      <strong className="text-amber-300 font-bold">Plain English:</strong> These are tough, super-rigid plastic tubes. They are buried underground to construct water wells, or used to shield delicate under-road electrical and internet wires from being crushed.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Simulated Spec Controller / Size Selector */}
              <div className="bg-[#121216]/90 border border-white/5 p-4 rounded-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-[0.15em] flex items-center gap-1.5">
                  📐 uPVC Diameter Selection
                </span>
                
                {/* Selector circles */}
                <div className="grid grid-cols-4 gap-2">
                  {pvcSimOptions.map((opt, idx) => (
                    <button
                      key={opt.od}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePvcIdx(idx);
                      }}
                      className={`py-2 text-center text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
                        activePvcIdx === idx
                          ? 'bg-[#8b7355] text-white shadow-lg shadow-[#8b7355]/15 scale-102 border-transparent'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                      }`}
                    >
                      {opt.od} mm
                    </button>
                  ))}
                </div>

                {/* Realtime computed details panel */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                  <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    <span className="text-[8px] text-white/40 uppercase block tracking-wider font-sans">Wall Size</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">
                      {pvcSimOptions[activePvcIdx].thickness.toFixed(1)} mm
                    </span>
                  </div>
                  <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    <span className="text-[8px] text-white/40 uppercase block tracking-wider font-sans">Unit Weight</span>
                    <span className="text-xs font-mono font-bold text-secondary mt-1 block">
                      {pvcSimOptions[activePvcIdx].weight}
                    </span>
                  </div>
                  <div className="bg-[#8b7355]/10 p-2.5 rounded-lg border border-[#aa9273]/20">
                    <span className="text-[8px] text-secondary uppercase block tracking-wider font-sans">Logistics Weight</span>
                    <span className="text-xs font-mono font-bold text-[#f7cb99] mt-1 block">
                      {(Math.PI * (pvcSimOptions[activePvcIdx].od - pvcSimOptions[activePvcIdx].thickness) * pvcSimOptions[activePvcIdx].thickness * 1.42 / 1000).toFixed(2)} kg/m
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Underground Depth Burial Stress Simulator */}
              <div 
                className="bg-[#0f0f12] p-4.5 border border-[#aa9273]/25 rounded-2xl relative space-y-4 shadow-inner"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Visual Label Section */}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-sans font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-secondary" /> Sub-Surface Strength Sandbox
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShow3DPVC(!show3DPVC);
                      }}
                      className="px-2.5 py-0.5 bg-[#8b7355]/20 hover:bg-[#8b7355]/85 text-secondary hover:text-white border border-[#aa9273]/30 rounded-md text-[8.5px] font-sans uppercase font-bold transition-all duration-300 cursor-pointer pointer-events-auto"
                    >
                      {show3DPVC ? '2D Map View' : '3D Wireframe'}
                    </button>
                    <span className="text-[8.5px] font-mono px-2 py-0.5 bg-[#25d366]/10 text-emerald-400 border border-[#25d366]/20 rounded-full font-bold">
                      Heavy SN8 Rated
                    </span>
                  </div>
                </div>

                {/* Casual explanation for average visitors */}
                <div className="bg-[#8b7355]/5 border border-white/5 p-3 rounded-xl space-y-1">
                  <span className="text-[9.5px] font-bold text-amber-300 block uppercase tracking-wider">🔬 Interactive Stress Lab</span>
                  <p className="text-[10px] text-white/70 font-sans leading-relaxed">
                    Underground pipes must support heavy city traffic. Change the depth buttons below and roll a <strong className="text-secondary">10-Ton Moving Truck</strong> overhead to see how our rigid uPVC pipe perfectly survives underground weight!
                  </p>
                </div>

                {/* Sub-surface level mockup visuals */}
                {show3DPVC ? (
                  <div className="relative h-32 w-full flex items-center justify-center overflow-hidden bg-[#241a12]/20 border border-orange-950/30 rounded-xl shadow-inner" style={{ perspective: '400px' }} onClick={(e) => e.stopPropagation()}>
                    {/* Glowing background grid lines */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:10px_10px]" />
                    <div 
                      className="relative w-14 h-14 flex items-center justify-center animate-spin-3d"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {Array.from({ length: 11 }).map((_, i) => {
                        // Calculate color gradients for stress representation
                        let ringColor = '#b59a7a'; // Default classy gold/brass
                        let ringGlow = 'rgba(181, 154, 122, 0.2)';
                        
                        if (isTruckPassing) {
                          // Center of pipeline takes maximum stress
                          const distFromCenter = Math.abs(i - 5);
                          if (distFromCenter === 0) {
                            ringColor = burialDepth === 'shallow' ? '#ef4444' : burialDepth === 'standard' ? '#f97316' : '#eab308';
                            ringGlow = burialDepth === 'shallow' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(249, 115, 22, 0.6)';
                          } else if (distFromCenter <= 1) {
                            ringColor = burialDepth === 'shallow' ? '#f97316' : burialDepth === 'standard' ? '#eab308' : '#84cc16';
                            ringGlow = 'rgba(249, 115, 22, 0.4)';
                          } else if (distFromCenter <= 2) {
                            ringColor = burialDepth === 'shallow' ? '#eab308' : '#84cc16';
                            ringGlow = 'rgba(234, 179, 8, 0.2)';
                          } else {
                            ringColor = '#3b82f6'; // Safe blue edge
                            ringGlow = 'rgba(59, 130, 246, 0.15)';
                          }
                        } else {
                          // Static ambient blueprint shading
                          const pulse = Math.sin((Date.now() / 300) + i * 0.5) * 0.15 + 0.35;
                          ringColor = `rgba(181, 154, 122, ${pulse})`;
                          ringGlow = 'rgba(181, 154, 122, 0.05)';
                        }

                        return (
                          <div
                            key={i}
                            className="absolute rounded-full border-[2.5px] flex items-center justify-center transition-all duration-300"
                            style={{
                              width: '42px',
                              height: '42px',
                              transform: `translateZ(${(i - 5) * 7.5}px)`,
                              transformStyle: 'preserve-3d',
                              background: 'rgba(11, 11, 14, 0.75)',
                              borderColor: ringColor,
                              boxShadow: `0 0 12px ${ringGlow}`,
                            }}
                          >
                            <div className="w-6 h-6 rounded-full border border-orange-950 bg-black/90 flex items-center justify-center">
                              <span className="text-[5px] text-[#ae9e8c] font-mono select-none">SN8</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="relative h-36 bg-[#110e0c] border border-[#8b7355]/20 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between">
                    
                    {/* GEOLOGICAL EARTH LAYERS (COLOR GRADIENTS) */}
                    <div className="absolute inset-0 flex flex-col w-full h-full pointer-events-none">
                      {/* 1. Asphalt Road Layer */}
                      <div className="h-6 w-full bg-gradient-to-b from-neutral-800 to-neutral-750 border-b border-[#111] relative flex items-center">
                        <div className="absolute inset-x-0 h-0.5 border-t border-dashed border-amber-400/70" />
                        <span className="absolute left-3 text-[7.5px] font-sans text-neutral-400 uppercase tracking-widest font-black">
                          Asphalt Level
                        </span>
                      </div>
                      
                      {/* 2. Loose Earth / Fill Dirt Layer (Warm-Tone Clay Soil) */}
                      <div className="h-10 w-full bg-gradient-to-b from-[#3d2716] to-[#25170d] border-b border-yellow-950/20 relative">
                        <span className="absolute left-3 bottom-0.5 text-[7.5px] font-sans text-stone-500 uppercase tracking-widest">
                          0.8m Fill Dirt
                        </span>
                      </div>

                      {/* 3. Recommended Dense Backfill Layer */}
                      <div className="h-10 w-full bg-gradient-to-b from-[#21140a] to-[#160d06] border-b border-black/30 relative">
                        <span className="absolute left-3 bottom-0.5 text-[7.5px] font-sans text-stone-600 uppercase tracking-widest">
                          1.5m Dense Clay
                        </span>
                      </div>

                      {/* 4. Deep Shielded Bedding (Solid Rock Base) */}
                      <div className="flex-grow w-full bg-gradient-to-b from-[#130903] to-[#0a0501] relative">
                        <span className="absolute left-3 bottom-1 text-[7.5px] font-sans text-stone-700 uppercase tracking-widest">
                          2.5m Gravel Bedding
                        </span>
                      </div>
                    </div>

                    {/* Depth grid scale coordinates */}
                    <div className="absolute right-3.5 inset-y-0 flex flex-col justify-between py-6 text-white/30 text-[7px] font-mono font-bold select-none text-right z-10 pointer-events-none">
                      <div>DEPTH: 0.0m</div>
                      <div className={burialDepth === 'shallow' ? 'text-amber-300 scale-105 font-extrabold' : ''}>— SLOW BURY: 0.8m</div>
                      <div className={burialDepth === 'standard' ? 'text-[#25d366] scale-105 font-extrabold' : ''}>— OPTIMAL: 1.5m</div>
                      <div className={burialDepth === 'deep' ? 'text-sky-400 scale-105 font-extrabold' : ''}>— DEEP: 2.5m</div>
                    </div>

                    {/* Interactive Moving truck on top of the road */}
                    <div className="relative w-full h-6 z-20">
                      <div className={`absolute top-[1px] left-0 transition-all duration-[1.8s] ease-linear ${isTruckPassing ? 'translate-x-[260%] opacity-100' : 'translate-x-0 opacity-45'}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-[17px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🚚</span>
                          <span className="text-[5.5px] tracking-wider font-mono font-black text-rose-500 bg-black/80 px-1 py-0.2 rounded mt-0.5 border border-red-500/20">
                            10-TON LOAD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* REAL-TIME DYNAMIC PRESSURE WAVES (POWERFUL GRADIENTS & COLOR SPECTRUMS) */}
                    <AnimatePresence>
                      {isTruckPassing && (
                        <motion.div 
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ originY: 0 }}
                          className={`absolute inset-x-0 top-6 bottom-0 pointer-events-none z-10 transition-all duration-300 ${
                            burialDepth === 'shallow' 
                              ? 'bg-gradient-to-b from-[#ef4444]/65 via-[#f97316]/50 to-transparent' 
                              : burialDepth === 'standard' 
                                ? 'bg-gradient-to-b from-[#eab308]/45 via-[#f59e0b]/25 to-transparent' 
                                : 'bg-gradient-to-b from-[#22c55e]/20 via-[#10b981]/10 to-transparent'
                          }`}
                        >
                          {/* Radial force ripple ring representing real pressure */}
                          <div 
                            className={`absolute inset-x-0 mx-auto w-36 h-36 rounded-full blur-xl border-2 animate-ping ${
                              burialDepth === 'shallow' 
                                ? 'border-[#ef4444]/25 bg-[#ef4444]/5' 
                                : burialDepth === 'standard' 
                                  ? 'border-[#eab308]/15 bg-[#eab308]/2' 
                                  : 'border-[#22c55e]/5 bg-transparent'
                            }`}
                            style={{ 
                              top: burialDepth === 'shallow' ? '10px' : burialDepth === 'standard' ? '40px' : '75px' 
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Embedded PVC Tube cross section physically sliding up/down based on selected depth */}
                    <div className="absolute inset-x-0 bottom-0 top-6 z-20 flex justify-center pointer-events-none">
                      <motion.div
                        animate={
                          isTruckPassing 
                            ? {
                                y: burialDepth === 'shallow' ? 14 : burialDepth === 'standard' ? 42 : 72,
                                scaleX: burialDepth === 'shallow' ? 0.92 : burialDepth === 'standard' ? 0.97 : 0.99,
                                scaleY: burialDepth === 'shallow' ? 1.05 : burialDepth === 'standard' ? 1.02 : 1.01,
                                borderColor: burialDepth === 'shallow' ? '#ef4444' : burialDepth === 'standard' ? '#f97316' : '#22c55e',
                                boxShadow: burialDepth === 'shallow' 
                                  ? '0 0 20px rgba(239, 68, 68, 0.75)' 
                                  : burialDepth === 'standard' 
                                    ? '0 0 15px rgba(249, 115, 22, 0.45)' 
                                    : '0 0 8px rgba(34, 197, 94, 0.35)',
                                backgroundColor: '#18120e'
                              }
                            : {
                                y: burialDepth === 'shallow' ? 14 : burialDepth === 'standard' ? 42 : 72,
                                scaleX: 1,
                                scaleY: 1,
                                borderColor: '#8b7355',
                                boxShadow: '0 0 5px rgba(139, 115, 85, 0.25)',
                                backgroundColor: '#07070a'
                              }
                        }
                        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                        className="w-11 h-11 rounded-full border-[3px] flex flex-col items-center justify-center relative cursor-help pointer-events-auto"
                        title={`uPVC Infrastructure Tube at ${burialDepth === 'shallow' ? '0.8m (Shallow)' : burialDepth === 'standard' ? '1.5m (Recommended)' : '2.5m (Deep)'}`}
                      >
                        <span className="text-[7px] font-mono font-black text-[#ead3c6] tracking-tighter">uPVC</span>
                        <span 
                          className={`text-[5.5px] font-mono font-bold leading-none mt-0.5 ${
                            isTruckPassing 
                              ? burialDepth === 'shallow' 
                                ? 'text-[#ef4444]' 
                                : burialDepth === 'standard' 
                                  ? 'text-amber-300' 
                                  : 'text-emerald-400'
                              : 'text-stone-400'
                          }`}
                        >
                          {isTruckPassing 
                            ? burialDepth === 'shallow' 
                              ? 'STRESS' 
                              : burialDepth === 'standard' 
                                ? 'MID LOAD' 
                                : 'SAFE'
                            : 'STATIC'
                          }
                        </span>

                        {/* Top stress marker arrow indicating active overhead pressure */}
                        {isTruckPassing && (
                          <div 
                            className={`absolute top-[-9px] text-[7px] font-bold animate-bounce ${
                              burialDepth === 'shallow' ? 'text-red-500' : burialDepth === 'standard' ? 'text-amber-500' : 'text-emerald-500'
                            }`}
                          >
                            ▼
                          </div>
                        )}
                      </motion.div>
                    </div>

                  </div>
                )}

                {/* Burial Simulator Controls */}
                <div className="grid grid-cols-3 gap-1.5">
                  {(['shallow', 'standard', 'deep'] as const).map((depth) => (
                    <button
                      key={depth}
                      onClick={() => setBurialDepth(depth)}
                      className={`py-2 text-[9px] font-sans font-medium rounded-xl transition-all capitalize border ${
                        burialDepth === depth
                          ? 'bg-[#8b7355] text-white border-[#aa9273]/40 shadow-md scale-102'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/5'
                      }`}
                    >
                      <div className="font-bold text-[10.5px]">
                        {depth === 'shallow' ? '🔥 0.8 meters' : depth === 'standard' ? '💚 1.5 meters' : '🛡️ 2.5 meters'}
                      </div>
                      <div className="text-[7.5px] opacity-85 mt-0.5 tracking-wide uppercase">
                        {depth === 'shallow' ? 'Shallow Bury' : depth === 'standard' ? 'Recommended' : 'Deep Shield'}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Real-time Dynamic Plain English Explanations */}
                <div className="bg-[#121217] border border-white/5 p-3 rounded-xl space-y-1.5 shadow-inner">
                  <span className="text-[8.5px] tracking-wider text-secondary uppercase font-bold block">
                    📊 Dynamic Laboratory Analysis
                  </span>
                  <div className="text-[10.5px] text-[#f7cb99] font-sans leading-relaxed">
                    {burialDepth === 'shallow' && (
                      <p>
                        ⚠️ <strong>Shallow Depth (0.8m):</strong> Sits close to street level. Under heavy traffic, our high-strength uPVC pipe squeezes by just <strong className="text-emerald-400 font-mono">0.95%</strong>. This is <strong>100% safe</strong>, because BIS standards permit up to 5.00% deflection!
                      </p>
                    )}
                    {burialDepth === 'standard' && (
                      <p>
                        ✅ <strong>Recommended Depth (1.5m):</strong> The ideal installation depth. The dense surrounding soil spreads and disperses the heavy truck weight evenly, reducing deflection to a microscopic <strong className="text-emerald-400 font-mono">0.38%</strong>.
                      </p>
                    )}
                    {burialDepth === 'deep' && (
                      <p>
                        ✅ <strong>Deep Shielded Depth (2.5m):</strong> Buried deeply. The massive ground cushion completely absorbs and cushions traffic weights, maintaining structural deflection at a near-zero <strong className="text-emerald-400 font-mono">0.12%</strong>!
                      </p>
                    )}
                  </div>
                </div>

                {/* Simulation trigger button */}
                <button
                  onClick={handleSimulateTruck}
                  disabled={isTruckPassing}
                  className={`w-full py-3 text-[10.5px] font-sans font-bold uppercase rounded-xl transition-all cursor-pointer ${
                    isTruckPassing
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-secondary hover:bg-white text-white hover:text-stone-950 border border-transparent shadow-lg shadow-secondary/15 hover:shadow-white/10 scale-[1.01] hover:scale-[1.02]'
                  }`}
                >
                  {isTruckPassing ? '🚚 Testing Compressive Strength Now...' : '⚡ Roll 10-Ton Truck Over Pipe'}
                </button>

                {/* Deflection outputs */}
                <div className="flex justify-between items-center text-[10px] font-sans text-white/50 border-t border-white/5 pt-2.5 mt-1.5">
                  <span className="flex items-center gap-1">
                    📉 Pipe Squeeze State:
                  </span>
                  <span className={`font-mono text-[11px] font-bold ${isTruckPassing ? 'text-amber-300 animate-pulse' : 'text-emerald-400'}`}>
                    {isTruckPassing ? `${deflectionMetric.toFixed(2)}% Deflection (Safe, BIS Limit: 5%)` : '0.00% Static'}
                  </span>
                </div>

              </div>

            </div>

            <div className="space-y-4 mt-6 w-full relative z-10">
              <div className="flex gap-2.5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(pvcProduct);
                  }}
                  className="flex-grow py-4 bg-[#8b7355] hover:bg-white hover:text-primary text-white font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-2xl cursor-pointer shadow-md shadow-black/10"
                >
                  Inspect
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenShare(pvcProduct);
                  }}
                  className="px-4.5 bg-white/5 hover:bg-secondary text-white/80 hover:text-white border border-white/10 hover:border-transparent transition-all duration-300 rounded-2xl cursor-pointer flex items-center justify-center shadow-sm"
                  title="Share PVC Infrastructure specifications datasheet"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-[#eae5df] font-sans tracking-[0.15em] pt-2">
                <span className="font-bold border-b border-transparent group-hover:border-secondary transition-colors uppercase">
                  Download PVC Specs
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-secondary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. Storage Water Tanks (col-span-8) */}
        {tankProduct && (
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03, 
              y: -8,
              borderColor: "rgba(255, 255, 255, 0.5)",
              boxShadow: "0 40px 80px -15px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 255, 255, 0.2)"
            }}
            onMouseEnter={() => setHoveredCard('water-tanks')}
            onMouseMove={tankTilt.handleMouseMove}
            onMouseLeave={() => {
              tankTilt.handleMouseLeave();
              setHoveredCard(null);
            }}
            style={{ 
              rotateX: tankTilt.rotateX, 
              rotateY: tankTilt.rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="lg:col-span-8 premium-card bg-[#8b7355] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#8b7355]/20 transition-all duration-500 rounded-3xl min-h-[520px]"
          >
            {/* Slim, semi-transparent specification summary Hover Overlay */}
            <AnimatePresence>
              {hoveredCard === 'water-tanks' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute top-4 inset-x-4 z-40 bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 p-3.5 hidden lg:flex items-center justify-between shadow-2xl pointer-events-none select-none text-white"
                >
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase font-bold">Specs QuickView</span>
                    <span className="text-xs text-white/95 font-medium font-serif mt-0.5">Multilayer Reservoir</span>
                  </div>
                  <div className="flex items-center gap-3 text-center sm:gap-5">
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Capacity Range</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-[#dca66c] mt-0.5">500 - 10000 L</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">System Type</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-white mt-0.5">Atmospheric</span>
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[7px] sm:text-[7.5px] font-mono text-white/40 uppercase tracking-wider">Sanitary Spec</span>
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-bold text-emerald-300 mt-0.5">Food Grade LLDPE</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Absolute Water Drop Vector Icon Accent on bottom right */}
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none select-none">
              <Droplets className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
              
              {/* Left Column: Product Info & Layer Details */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#111] text-[#eae5df] text-[9px] font-sans font-bold tracking-[0.2em] px-3.5 py-1.5 uppercase inline-block border border-white/10 rounded-full">
                      Bulk Storage Standard: IS 12701
                    </span>
                    <span className="inline-flex items-center gap-1 bg-yellow-500/15 text-yellow-300 border border-yellow-500/25 px-2.5 py-1 rounded text-[9px] font-mono font-bold tracking-wider uppercase">
                      <Award className="w-3 h-3 text-yellow-300" /> GRADE: PATENTED TRIPLE LAYER
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-light font-serif tracking-tight leading-tight">
                    Bulk Liquid <span className="italic block sm:inline font-normal font-sans text-stone-100 text-2xl">Storage Tanks</span>
                  </h3>
                  <p className="text-xs text-[#fdfcfb]/80 font-sans font-light leading-relaxed">
                    Rotational-molded multilayer reservoirs built for municipal water reserves, featuring an insulated thermal core to maintain cool, clean storage.
                  </p>
                  
                  {isLaymanMode && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-amber-500/15 border border-amber-500/35 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-100/90 leading-relaxed font-sans mt-3"
                    >
                      <span className="text-[14px] shrink-0 mt-0.5">💡</span>
                      <div>
                        <strong className="text-amber-200 font-bold">Plain English:</strong> These are high-quality household & municipal water storage tanks. They feature three separate layers: a tough outer block against hot sun rays, a cozy foam blanket to keep water cool, and a hygienic inner lining that stops germs and slime.
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Carbon foam triple layer selection visual stats */}
                <div className="bg-[#111115]/90 border border-white/5 p-4 rounded-2xl space-y-4">
                  <span className="text-[9px] font-mono font-bold text-secondary uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-secondary" /> Insulation Inspector
                  </span>

                  {/* Layer Tabs */}
                  <div className="grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                    {(['outer', 'middle', 'inner'] as const).map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setSelectedTankLayer(layer)}
                        className={`py-2 px-1 text-[10px] font-sans font-bold rounded-xl transition-all cursor-pointer truncate ${
                          selectedTankLayer === layer
                            ? 'bg-[#8b7355] text-white shadow-md'
                            : 'bg-white/5 text-white/70'
                        }`}
                      >
                        <span className="sm:inline hidden">
                          {layer === 'outer' ? '1. Carbon UV Shield' : layer === 'middle' ? '2. Thermal Foam' : '3. Bio-Shield Liner'}
                        </span>
                        <span className="inline sm:hidden">
                          {layer === 'outer' ? '1. UV Shield' : layer === 'middle' ? '2. Foam' : '3. Bio-Liner'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Informative specs drawer */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-left overflow-hidden min-h-[92px] relative">
                    <AnimatePresence mode="wait">
                      {selectedTankLayer === 'outer' && (
                        <motion.p
                          key="layer-outer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-[11px] text-[#f2e6d9] leading-relaxed absolute inset-3"
                        >
                          <strong className="text-secondary font-mono mr-1.5 uppercase tracking-wider block mb-1">Outer Shield:</strong> Carbon-black infused LLDPE outer core blocks ultra-violet UV-15 radiations. Prevents thermal cracking and molecular failure of tank walls under baking Indian summers.
                        </motion.p>
                      )}
                      {selectedTankLayer === 'middle' && (
                        <motion.p
                          key="layer-middle"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-[11px] text-[#f2e6d9] leading-relaxed absolute inset-3"
                        >
                          <strong className="text-secondary font-mono mr-1.5 uppercase tracking-wider block mb-1">Insulation Core:</strong> Advanced expanded polystyrene foam barrier. Restricts external thermal transfer coefficients keeping inner reservoir water up to 10°C cooler compared to single layer configurations.
                        </motion.p>
                      )}
                      {selectedTankLayer === 'inner' && (
                        <motion.p
                          key="layer-inner"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="text-[11px] text-[#f2e6d9] leading-relaxed absolute inset-3"
                        >
                          <strong className="text-secondary font-mono mr-1.5 uppercase tracking-wider block mb-1">Food Grade Liner:</strong> 100% active antimicrobial silver-ion compounds extruded inside FDA-approved LLDPE sheets. Eliminates bacterial cultivation, mold sprouts, and structural odor.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>

              {/* Right Column: Graphical Sliced Representation of the 3 Layers */}
              <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center bg-black/40 p-5 rounded-3xl border border-white/5 relative min-h-[300px]">
                
                {/* 3D Product Preview Overlay Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow3DTank(!show3DTank);
                  }}
                  className="absolute top-3 right-3 z-20 px-3 py-1.5 bg-[#8b7355]/20 hover:bg-[#8b7355]/85 text-secondary hover:text-white border border-[#aa9273]/30 rounded-xl text-[9px] font-mono tracking-wider uppercase font-extrabold flex items-center gap-1.5 transition-all duration-300 cursor-pointer pointer-events-auto"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
                  </span>
                  {show3DTank ? '2D Layers' : '3D Reservoirs'}
                </button>

                {show3DTank ? (
                  <div className="relative w-full h-[200px] flex items-center justify-center select-none" style={{ perspective: '800px' }} onClick={(e) => e.stopPropagation()}>
                    {/* Rotating 3D CSS Water Tank Model */}
                    <div 
                      className="relative w-24 h-24 flex items-center justify-center animate-spin-3d"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            width: '72px',
                            height: '72px',
                            transform: `translateY(${(i - 5) * 8.5}px) rotateX(90deg)`,
                            transformStyle: 'preserve-3d',
                            border: selectedTankLayer === 'outer' 
                              ? '3.5px solid #292930' 
                              : selectedTankLayer === 'middle' 
                                ? '2.5px solid #dca66c' 
                                : '1.5px solid #3b82f6',
                            background: selectedTankLayer === 'outer'
                              ? 'rgba(24, 24, 28, 0.45)'
                              : selectedTankLayer === 'middle'
                                ? 'rgba(220, 166, 108, 0.3)'
                                : 'rgba(59, 130, 246, 0.2)',
                            boxShadow: selectedTankLayer === 'inner' ? '0 0 10px rgba(59,130,246,0.3)' : 'none',
                          }}
                        >
                          <div className="w-9 h-9 rounded-full border border-white/10 bg-neutral-900/90" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-3 left-3 flex items-center gap-1 text-[8.5px] font-mono tracking-widest text-[#f0caa6] bg-white/5 px-2.5 py-1 rounded-full">
                      <Award className="w-3.5 h-3.5 text-[#f0caa6]" />
                      TRIPLE LAYER STRUCTURE
                    </div>

                    {/* Sliced representation stack */}
                    <div className="w-full space-y-2 mt-10">
                      
                      {/* Outer Layer Card Bar */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setSelectedTankLayer('outer'); }}
                        className={`p-2.5 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                          selectedTankLayer === 'outer'
                            ? 'bg-stone-800 border-[#f0caa6] ring-1 ring-[#f0caa6]/30'
                            : 'bg-stone-900/55 border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-stone-700 border border-white/30" />
                          <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-white">Outer Carbon Shield</span>
                        </div>
                        <Sun className={`w-4 h-4 text-orange-400 ${selectedTankLayer === 'outer' ? 'animate-pulse' : ''}`} />
                      </div>

                      {/* Middle Layer Card Bar */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setSelectedTankLayer('middle'); }}
                        className={`p-2.5 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                          selectedTankLayer === 'middle'
                            ? 'bg-[#8b7355]/30 border-[#f0caa6] ring-1 ring-[#f0caa6]/30'
                            : 'bg-stone-900/55 border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-orange-200 border border-white/40" />
                          <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-white">Thermo Foam Barrier</span>
                        </div>
                        <Thermometer className={`w-4 h-4 text-amber-200 ${selectedTankLayer === 'middle' ? 'animate-bounce' : ''}`} />
                      </div>

                      {/* Inner Layer Card Bar */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setSelectedTankLayer('inner'); }}
                        className={`p-2.5 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                          selectedTankLayer === 'inner'
                            ? 'bg-blue-950/40 border-[#f0caa6] ring-1 ring-[#f0caa6]/30'
                            : 'bg-stone-900/55 border-transparent hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-blue-300/30 animate-pulse" />
                          <span className="text-[10px] font-mono font-bold tracking-wide uppercase text-white">Pure Silver-Ion Liner</span>
                        </div>
                        <Droplets className={`w-4 h-4 text-blue-400 ${selectedTankLayer === 'inner' ? 'animate-[pulse_1s_infinite]' : ''}`} />
                      </div>

                    </div>
                  </>
                )}

                <div className="mt-4 text-center">
                  <span className="text-[8.5px] text-[#eae5df] font-mono uppercase tracking-[0.2em] block font-bold">
                    Safe Drinking Water Standard
                  </span>
                  <p className="text-white/80 text-[11px] font-sans mt-0.5">
                    Hygienic inner matrix prevents bacterial settlement up to 99.9%.
                  </p>
                </div>
              </div>

            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-2.5">
                <span className="px-4 py-2 bg-[#4e402e]/70 backdrop-blur-sm text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/15 rounded-xl shadow-sm">
                  Triple Layer Carbon Shield
                </span>
                <span className="px-4 py-2 bg-[#4e402e]/70 backdrop-blur-sm text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/15 rounded-xl shadow-sm">
                  100% UV Stabilized
                </span>
                <span className="px-4 py-2 bg-[#4e402e]/70 backdrop-blur-sm text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/15 rounded-xl shadow-sm">
                  Food Grade LLDPE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProduct(tankProduct);
                  }}
                  className="px-6 py-2.5 bg-white hover:bg-stone-900 text-stone-900 hover:text-white font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-xl cursor-pointer shadow-md inline-flex items-center gap-1.5"
                >
                  Inspect
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenShare(tankProduct);
                  }}
                  className="p-2.5 bg-white/10 hover:bg-white hover:text-stone-900 text-white border border-white/20 hover:border-transparent transition-all duration-300 rounded-xl cursor-pointer flex items-center justify-center shadow-sm"
                  title="Share Water Storage specifications datasheet"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </motion.div>
        ) : (
          <motion.div
            key="amazon-procure-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <AmazonCatalog 
              onAddProductToQuote={onAddProductToQuote || (() => {})}
              onSelectProduct={onSelectProduct}
              onOpenShare={handleOpenShare}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Technical Datasheet Blueprint Modal overlay */}
      <AnimatePresence>
        {sharingProduct && (
          <ShareProductModal 
            product={sharingProduct} 
            onClose={() => setSharingProduct(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
