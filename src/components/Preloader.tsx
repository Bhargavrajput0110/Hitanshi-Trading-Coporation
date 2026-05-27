import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cpu, Database, Activity, CornerDownRight } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [activeStage, setActiveStage] = useState('Probed telemetry...');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Highly professional industrial logs to match a state-of-the-art procurement portal
  const loadingLogs = [
    { text: 'CALIBRATING STRUCTURAL CAD ENVIRONMENT...', stage: 'CAD Boot' },
    { text: 'FETCHING SEISMIC HEAVE DEVIATION MATRICES...', stage: 'Seismic Specs' },
    { text: 'CACHING HIGH-INTEGRITY POLYMER COMPLIANCE...', stage: 'Material Sync' },
    { text: 'INITIALIZING HYDROSTATIC HOOP COMPRESSION LAB...', stage: 'Lab HUD' },
    { text: 'VALIDATING BIS BUREAU OF INDIAN STANDARDS DATABASES...', stage: 'Standards check' },
    { text: 'SECURING TRILAYER THERMAL FOAM COEFFICIENTS...', stage: 'Thermal DB' },
    { text: 'READYING DIRECT PROCUREMENT PIPELINE COGNITION...', stage: 'Network ready' },
  ];

  const logIndexRef = useRef(0);

  // Handle progress counter and scrolling logs
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const startTime = Date.now();
    const duration = 2100; // 2.1 seconds for a punchy, ultra-slick intro

    const updateLoader = () => {
      const elapsed = Date.now() - startTime;
      const computedProg = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.round(computedProg));

      // Update active logs/stages based on elapsed progress decimal
      const currentLog = Math.min(loadingLogs.length - 1, Math.floor((computedProg / 100) * loadingLogs.length));
      if (currentLog !== logIndexRef.current) {
        logIndexRef.current = currentLog;
        setLogIndex(currentLog);
        setActiveStage(loadingLogs[currentLog].stage);
      }

      if (computedProg < 100) {
        timer = setTimeout(updateLoader, 24);
      } else {
        // Unlock and trigger fade out
        setIsUnlocked(true);
        setTimeout(() => {
          onComplete();
        }, 500); // give 500ms for unlock laser wipe expansion
      }
    };

    updateLoader();
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Mathematical 3D wireframe pipeline canvas loops inside the preloader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;

    const resize = () => {
      canvas.width = 240;
      canvas.height = 240;
    };
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Spin faster at first, then settle into a smooth inspection rate
      rotationAngle += 0.02 + (1 - progress / 100) * 0.04;

      const pitch = -0.35 + Math.sin(rotationAngle * 0.4) * 0.08;
      const yaw = rotationAngle;

      const projectNode = (x3d: number, y3d: number, z3d: number) => {
        // Rotate around Y-axis (yaw)
        const x1 = x3d * Math.cos(yaw) - z3d * Math.sin(yaw);
        const z1 = x3d * Math.sin(yaw) + z3d * Math.cos(yaw);

        // Rotate around X-axis (pitch)
        const y2 = y3d * Math.cos(pitch) - z1 * Math.sin(pitch);
        const z2 = y3d * Math.sin(pitch) + z1 * Math.cos(pitch);

        const scale = 1.35;
        return {
          sx: cx + x1 * scale,
          sy: cy + y2 * scale,
          sz: z2
        };
      };

      // Create a 3D Cylinder Pipe consisting of circular segments
      const cylinderLength = 110;
      const slices = 8;
      const segments = 12;
      const radius = 42;

      const projectedSlices: any[] = [];

      for (let s = 0; s < slices; s++) {
        const zPos = -cylinderLength / 2 + (s / (slices - 1)) * cylinderLength;
        const ringPoints: any[] = [];
        for (let seg = 0; seg < segments; seg++) {
          const angle = (seg / segments) * Math.PI * 2;
          const px = radius * Math.cos(angle);
          const py = radius * Math.sin(angle);
          ringPoints.push(projectNode(px, py, zPos));
        }
        projectedSlices.push(ringPoints);
      }

      // Draw faint laser grids connecting the pipe nodes to create a beautiful hologram mesh
      ctx.lineWidth = 0.55;

      // Vertical loop slices
      projectedSlices.forEach((slicePoints, sliceIdx) => {
        ctx.beginPath();
        slicePoints.forEach((pt: any, idx: number) => {
          if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        });
        ctx.closePath();
        
        const isEnds = sliceIdx === 0 || sliceIdx === slices - 1;
        ctx.strokeStyle = isEnds 
          ? `rgba(139, 115, 85, ${0.45 + (progress / 200)})` 
          : `rgba(139, 115, 85, 0.16)`;
        ctx.stroke();
      });

      // Longitudinal lines connecting slices together
      for (let s = 1; s < slices; s++) {
        const prevS = projectedSlices[s - 1];
        const currS = projectedSlices[s];
        for (let seg = 0; seg < segments; seg++) {
          ctx.beginPath();
          ctx.moveTo(prevS[seg].sx, prevS[seg].sy);
          ctx.lineTo(currS[seg].sx, currS[seg].sy);
          
          // Speed flowing amber stripes along the lines
          const flowingHighlight = (seg + Math.floor(rotationAngle * 10)) % 4 === 0;
          ctx.strokeStyle = flowingHighlight 
            ? 'rgba(212, 163, 115, 0.45)' 
            : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = flowingHighlight ? 0.95 : 0.45;
          ctx.stroke();
        }
      }

      // Interactive blueprint grid surrounding the scanning bounds
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.03)';
      ctx.stroke();

      // Scan scope brackets
      const laserPulse = 10 + Math.sin(Date.now() / 150) * 1.5;
      ctx.strokeStyle = 'rgba(223, 166, 108, 0.45)';
      ctx.lineWidth = 1;

      // Top-left brace
      ctx.beginPath();
      ctx.moveTo(cx - 65, cy - 65 + laserPulse);
      ctx.lineTo(cx - 65, cy - 65);
      ctx.lineTo(cx - 65 + laserPulse, cy - 65);
      ctx.stroke();

      // Bottom-right brace
      ctx.beginPath();
      ctx.moveTo(cx + 65, cy + 65 - laserPulse);
      ctx.lineTo(cx + 65, cy + 65);
      ctx.lineTo(cx + 65 - laserPulse, cy + 65);
      ctx.stroke();

      // Core scanning bar passing vertically
      const scanY = cy + Math.sin(Date.now() / 330) * 65;
      ctx.fillStyle = 'rgba(139, 115, 85, 0.08)';
      ctx.fillRect(cx - 65, scanY - 1, 130, 2);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-[#070709] w-full h-full z-[100] flex flex-col justify-center items-center overflow-hidden font-mono select-none">
      
      {/* Absolute Blueprint Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,115,85, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,115,85, 0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Cybernetic Circle HUD element in top background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] max-w-[500px] aspect-square rounded-full border border-[#8b7355]/5 filter blur-sm pointer-events-none" />

      {/* Main Holographic Container */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center max-w-lg w-full px-6 relative z-10"
      >
        
        {/* Glowing CAD Canvas Specimen */}
        <div className="relative mb-6">
          <canvas ref={canvasRef} className="block relative z-10" />
          <div className="absolute inset-0 bg-radial from-transparent to-[#070709] pointer-events-none z-20" />
          
          {/* Pulsing micro-dot inside core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#f4a261] animate-ping" />
        </div>

        {/* Brand/Slogan layout */}
        <div className="text-center space-y-1.5 w-full">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#8b7355] font-extrabold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary inline" />
            Hitanshi Trading Corp
          </span>
          <h2 className="text-base sm:text-lg font-serif italic text-white normal-case font-light">
            Infrastructure Sourcing Digital Engine
          </h2>
        </div>

        {/* Realtime progress tracker */}
        <div className="w-full mt-8 space-y-3 bg-[#111115]/80 border border-white/5 p-4 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-[#8b7355] tracking-widest uppercase font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-secondary" />
              Process: {activeStage}
            </span>
            <span className="text-amber-400 font-bold font-mono">
              {progress === 100 ? 'SUCCESS' : `${progress}%`}
            </span>
          </div>

          {/* Glowing bar */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#8b7355] via-amber-400 to-[#dfdad3]"
              style={{ width: `${progress}%` }}
              layoutId="preloaderProgressBar"
            />
          </div>

          {/* Subtitle technical readout log line */}
          <div className="h-6 overflow-hidden relative border-t border-white/[0.03] pt-2 mt-1 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={logIndex}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[8.5px] text-white/50 tracking-wider text-left truncate flex items-center gap-1.5"
              >
                <CornerDownRight className="w-3 h-3 text-[#fca5a5] shrink-0" />
                {loadingLogs[logIndex]?.text || 'INITIALIZING GRIDS...'}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center text-[7px] text-white/25 pt-1">
            <span>SDR RATE: COMPLIANT</span>
            <span>PORT 3000 CONDUIT LIVE</span>
          </div>
        </div>

        {/* Mini security/compliance status indicator at bottom of block */}
        <div className="mt-6 flex items-center gap-4 text-[8px] text-white/30 tracking-widest uppercase font-extrabold select-none">
          <span className="flex items-center gap-1">
            <Database className="w-2.5 h-2.5 text-[#8b7355]" />
            NABL ISO/IEC 17025
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <span className="flex items-center gap-1">
            <Activity className="w-2.5 h-2.5 text-[#8b7355]" />
            Seismic Class III
          </span>
        </div>

      </motion.div>

      {/* Transition unlock laser-sweep reveal overlay */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div 
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-50 pointer-events-none bg-radial from-transparent via-[#070709] to-[#070709] flex flex-col justify-center items-center"
          >
            {/* Horizontal glowing laser swipe line */}
            <motion.div 
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: 350, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full h-0.5 bg-amber-200 shadow-[0_0_20px_#f5b041] origin-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
