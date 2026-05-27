import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Activity, 
  Thermometer, 
  Gauge, 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  HeartPulse, 
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Live simulated feed events
const LOG_MESSAGES = [
  "Extrusion Core #4: Stabilized at 202°C (+0.4°C drift)",
  "QA Hydrostatic: Batch #HD100-3882 passed 22.0 Bar/80Min core test",
  "NABL Inspector: Calibrated carbon dispersion scan - 100% compliant",
  "Dispatch Note: Dispatch prepped for Aurangabad Canal Grid scheme",
  "Tender Queue: Received active commercial RFQ for 12,000m MDPE conduits",
  "Stator Cooling: Shaft pump active in heavy-duty raw basin #1",
  "Lot Registry: PVC 160mm Grade A load approved by Lead Metallurgist"
];

interface SectionItem {
  id: string;
  label: string;
  description: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'app-top', label: 'Top Operations', description: 'Real-time telemetry feeds' },
  { id: 'portfolio-section', label: 'Interactive Catalog', description: 'Simulate pipe dimensions and specs' },
  { id: 'virtual-operations', label: 'Virtual Factory Center', description: 'Run QA burst tests and hydraulic speeds' },
  { id: 'comparison-section', label: 'Specifications Comparison', description: 'Side-by-side product table' },
  { id: 'sectors-section', label: 'Strategic Projects', description: 'Browse delivered national grids' },
  { id: 'calculator-section', label: 'BOQ payload Estimator', description: 'Mass and weight calculations' },
  { id: 'footer-section', label: 'Contact Requisition', description: 'Secure commercial bid submissions' }
];

export default function OperationsHUD() {
  const [activeSection, setActiveSection] = useState<string>('app-top');
  const [liveLog, setLiveLog] = useState<string>(LOG_MESSAGES[0]);
  const [logIndex, setLogIndex] = useState(0);

  // Live Simulated Sensors (Industry 4.0 IoT Twin)
  const [coreTemp, setCoreTemp] = useState<number>(202.4);
  const [statorRpm, setStatorRpm] = useState<number>(1420);
  const [extrusionPressure, setExtrusionPressure] = useState<number>(182.5);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);

  // Auto-update sensors on interval to give an active live-state feel
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      // Gentle drifts
      setCoreTemp(prev => Number((prev + (Math.random() - 0.5) * 0.8).toFixed(1)));
      setStatorRpm(prev => {
        const drift = Math.round((Math.random() - 0.5) * 15);
        return Math.max(1390, Math.min(1450, prev + drift));
      });
      setExtrusionPressure(prev => Number((prev + (Math.random() - 0.5) * 1.5).toFixed(1)));

      // Event probability
      if (Math.random() > 0.85) {
        setLogIndex(prev => {
          const next = (prev + 1) % LOG_MESSAGES.length;
          setLiveLog(LOG_MESSAGES[next]);
          return next;
        });
      }
    }, 1500);

    return () => clearInterval(sensorInterval);
  }, []);

  // Monitor Scroll position to highlight active section on the Sidebar dot navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <>
      {/* 1. TOP SCROLL-TRACKING FLOATING VERTICAL DOT NAVIGATION SIDEBAR */}
      <nav className="fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-5 bg-[#09090b]/80 backdrop-blur-md border border-[#8b7355]/20 p-4 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center gap-1 border-b border-white/10 pb-3 mb-2">
          <Activity className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-[7.5px] font-mono tracking-widest text-[#8b7355] uppercase font-bold text-center">
            NAV DECK
          </span>
        </div>

        {SECTIONS.map((section) => {
          const isSelected = activeSection === section.id;
          return (
            <div key={section.id} className="relative group flex items-center justify-center">
              
              {/* Dot trigger */}
              <button
                onClick={() => handleScrollTo(section.id)}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 relative cursor-pointer ${
                  isSelected
                    ? 'bg-secondary border-secondary scale-125 shadow-[0_0_12px_rgba(139,115,85,0.8)]'
                    : 'bg-neutral-900 border-white/20 hover:border-secondary'
                }`}
                aria-label={`Scroll to ${section.label}`}
              >
                {isSelected && (
                  <span className="absolute inset-[-4px] border border-secondary/35 rounded-full animate-ping" />
                )}
              </button>

              {/* Sophisticated tooltips on mouse hover */}
              <div className="absolute left-7 bg-[#0f0f11] text-white p-3 rounded-xl border border-[#8b7355]/30 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none w-48 text-left z-50">
                <span className="text-[8px] font-mono tracking-widest text-[#dca66c] block uppercase font-bold">
                  {section.description}
                </span>
                <span className="text-xs font-serif font-bold text-white mt-1 block">
                  {section.label}
                </span>
                <div className="w-12 h-[1.5px] bg-[#8b7355] mt-1.5" />
              </div>
            </div>
          );
        })}
      </nav>

      {/* 2. REAL-TIME FACTORY TELEMETRY COMMAND DECK (At top under header) */}
      <section id="app-top" className="pt-24 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
        <div className="bg-[#0b0b0c] border border-[#8b7355]/20 rounded-2xl overflow-hidden p-4 sm:p-5 flex flex-col lg:flex-row items-stretch justify-between gap-6 shadow-xl shadow-black/20 text-left">
          
          {/* A. Live Status & Header Indicator */}
          <div className="flex items-start gap-4 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-5">
            <div className="p-3 bg-[#8b7355]/15 border border-[#8b7355]/25 text-secondary rounded-xl flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-secondary animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#dca66c] uppercase font-bold leading-none">
                  IoT Direct Twin Console
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-1 tracking-tight">
                Dhule Manufacturing Corridor
              </h3>
              <p className="text-[10px] text-white/50 font-sans mt-1 leading-snug">
                Streaming live raw-material extrusion statuses and structural hydrostatic telemetry parameters.
              </p>
            </div>
          </div>

          {/* B. Live Telemetry Feed Ticker in Center */}
          <div className="flex-1 flex flex-col justify-between space-y-3 lg:px-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-widest text-[#8b7355] uppercase font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-secondary" /> Active Operations Logs
              </span>
              <span className="text-[8.5px] font-mono text-white/30">
                AUTO-SECURE FEED
              </span>
            </div>

            {/* Glowing Log Screen simulating an active industrial machine terminal */}
            <div className="bg-black/60 border border-white/5 rounded-xl p-3.5 flex items-center justify-between min-h-[58px] relative overflow-hidden font-mono text-xs">
              
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-transparent pointer-events-none select-none z-10" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={liveLog}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex items-center gap-2 text-emerald-400 font-medium select-all"
                >
                  <span className="text-secondary select-none">&gt;&gt;</span>
                  <span>{liveLog}</span>
                </motion.div>
              </AnimatePresence>

              <div className="text-[9px] text-[#eae5df]/30 font-bold shrink-0 ml-4 font-sans select-none tracking-wider">
                100% SUCCESS
              </div>
            </div>

            {/* Simulated Live Feed Stats */}
            <div className="flex gap-4 text-[9.5px] font-mono text-white/45 pl-1">
              <span className="flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-[#dca66c]" /> System Health: <strong className="text-[#eae5df]">99.8%</strong>
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-secondary" /> Daily Tons Shipped: <strong className="text-[#eae5df]">148.4 MT</strong>
              </span>
            </div>
          </div>

          {/* C. Interactive Gauge Controls */}
          <div className="lg:w-1/4 flex flex-col justify-between space-y-3 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-5">
            <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase block font-bold leading-none">
              IoT Sensor Telemetries
            </span>

            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Sensor 1: Core Temp */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 hover:border-[#8b7355]/30 transition-all">
                <span className="text-[8px] text-white/45 font-sans uppercase">Extruder Core</span>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-lg font-bold text-white tracking-tight">{coreTemp}</span>
                  <span className="text-[8px] font-mono text-[#8b7355]">°C</span>
                </div>
                <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#8b7355] h-full" style={{ width: `${(coreTemp / 240) * 100}%` }} />
                </div>
              </div>

              {/* Sensor 2: Extrusion PSI */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 hover:border-[#8b7355]/30 transition-all">
                <span className="text-[8px] text-white/45 font-sans uppercase">Pressure Seal</span>
                <div className="flex items-baseline gap-0.5 mt-1">
                  <span className="text-lg font-bold text-white tracking-tight">{extrusionPressure}</span>
                  <span className="text-[8.5px] font-mono text-[#8b7355]">BAR</span>
                </div>
                <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(extrusionPressure / 250) * 100}%` }} />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
