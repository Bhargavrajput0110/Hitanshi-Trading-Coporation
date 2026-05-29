import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Zap, 
  Award, 
  CheckCircle, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  Layers, 
  Gauge, 
  RotateCw, 
  Waves, 
  HelpCircle,
  Activity,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SpecimenScanner3D from './SpecimenScanner3D';

interface HeroProps {
  onExploreClick: () => void;
  onOpenEstimatorClick: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
}

export default function Hero({ onExploreClick, onOpenEstimatorClick }: HeroProps) {
  // --- CANVAS PARTICLE STATE & REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false });

  // --- DYNAMIC SPECIMEN SIMULATOR STATES ---
  const [selectedMaterial, setSelectedMaterial] = useState<'HDPE' | 'MDPE' | 'PVC' | 'IRON'>('HDPE');
  const [pressureBar, setPressureBar] = useState<number>(8);
  const [activeView, setActiveView] = useState<'isometric' | 'cross-section' | 'stress'>('isometric');
  const [isWaterFlowing, setIsWaterFlowing] = useState<boolean>(true);

  // Material Specimen DB
  const materialsDatabase = {
    HDPE: {
      name: 'PE-100 HDPE Conduit',
      standard: 'IS 4984 compliant',
      badge: 'Municipal Grade PE-100',
      safeBar: 16,
      sdr: 'SDR 11 Extra-Thick',
      outerColor: '#1a1b1e',
      lineColor: '#2563eb',
      wallThick: 6.6,
      desc: 'Formulated with virgin PE-100 resins to counter water hammers and earth-shifting stress lines.'
    },
    MDPE: {
      name: 'MDPE Gas Pipeline',
      standard: 'IS 14885 compliant',
      badge: 'Gas-Grid Premium',
      safeBar: 10,
      sdr: 'SDR 13.6 Yellow-Stripe',
      outerColor: '#1c1c1f',
      lineColor: '#eab308',
      wallThick: 5.2,
      desc: 'Highly flexible yellow co-extruded trunking designed for safe municipal fuel gas grids.'
    },
    PVC: {
      name: 'uPVC Rigid Sewer Casing',
      standard: 'IS 4985 compliant',
      badge: 'Cast Heavy-Stiffness',
      safeBar: 6,
      sdr: 'Class 3 Rigid Core',
      outerColor: '#30323a',
      lineColor: '#78716c',
      wallThick: 4.5,
      desc: 'Lead-free unplasticized material providing excellent structural hoop stiffness underground.'
    },
    IRON: {
      name: 'Ductile Iron Class K9',
      standard: 'IS 8329 compliant',
      badge: 'Heavy Utility Alloy',
      safeBar: 25,
      sdr: 'Class K9 Mortar-Lined',
      outerColor: '#2d3039',
      lineColor: '#818cf8',
      wallThick: 8.8,
      desc: 'Rugged alloy conduit protected internally with cement mortar lining to resist heavy silt wear.'
    }
  };

  const activeMaterial = materialsDatabase[selectedMaterial];
  const stressRatio = Math.min(100, Math.round((pressureBar / activeMaterial.safeBar) * 100));
  const isSafetyExceeded = pressureBar > activeMaterial.safeBar;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let yaw = 0.2;
    let pitch = 0.15;
    let flowAnim = 0;

    // Structure flow particles travelling through 3D conduits
    interface FlowParticle {
      t: number;          // progression along conduit (0 to 1)
      angle: number;      // circumferential angle
      speed: number;      // velocity along conduit
      spiral: number;     // spiral rotation velocity
      conduitType: 0 | 1; // Primary or Secondary pipeline
      radRatio: number;   // radial distance from core center (0 to 1)
      brightness: number; // custom alpha multiplier
      size: number;       // base radius size
    }

    const particles: FlowParticle[] = [];
    const maxParticles = 90;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        t: Math.random(),
        angle: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.002,
        spiral: 0.01 + Math.random() * 0.02,
        conduitType: i % 2 === 0 ? 0 : 1,
        radRatio: 0.2 + Math.random() * 0.65,
        brightness: 0.4 + Math.random() * 0.6,
        size: 0.6 + Math.random() * 1.5
      });
    }

    // Use ResizeObserver to ensure the canvas is responsive
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovered = true;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Settle scene angles into active state + slow passive loop
      flowAnim += 0.003;
      const baseYaw = flowAnim * 0.15;
      const basePitch = 0.2 + Math.sin(flowAnim * 0.3) * 0.04;

      const isHovered = mouseRef.current.isHovered;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const centerX = w / 2;
      const centerY = h / 2;

      // 3D Projection Engine with real Perspective Depth Shifting
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Center-oriented rotation
        const dx = x3d - centerX;
        const dy = y3d - centerY;

        // Apply dynamic yaw/pitch rotation around relative screen center
        const x1 = dx * Math.cos(baseYaw) - z3d * Math.sin(baseYaw);
        const z1 = dx * Math.sin(baseYaw) + z3d * Math.cos(baseYaw);

        const y2 = dy * Math.cos(basePitch) - z1 * Math.sin(basePitch);
        const z2 = dy * Math.sin(basePitch) + z1 * Math.cos(basePitch);

        // Perspective configuration
        const viewDistance = 1400;
        const fovScale = 1600;
        const scale = fovScale / (viewDistance + z2);

        return {
          sx: centerX + x1 * scale,
          sy: centerY + y2 * scale,
          sz: z2, // Depth tracking
          scale,
          orig: { x: x3d, y: y3d, z: z3d }
        };
      };

      // Define double-helix curves for secondary/primary water and gas conduit pipelines
      const slicesCount = 13;
      const segmentsCount = 10;
      const baseRadius = w > 1024 ? 110 : 65;

      const primaryConduitSlices: any[] = [];
      const secondaryConduitSlices: any[] = [];

      // Generate 3D geometry vertices for pipelines
      for (let s = 0; s < slicesCount; s++) {
        const ratio = s / (slicesCount - 1); // 0 to 1
        
        // Curve centers flowing elegantly across the screen background
        const xPosPrimary = -w * 0.1 + ratio * (w * 1.25);
        const yPosPrimary = h * 0.45 + Math.sin(ratio * Math.PI * 2 + flowAnim) * (h * 0.18);
        const zPosPrimary = Math.cos(ratio * Math.PI * 1.5 + flowAnim) * 160;

        const xPosSecondary = -w * 0.1 + ratio * (w * 1.25);
        const yPosSecondary = h * 0.55 + Math.cos(ratio * Math.PI * 2 + flowAnim) * (h * 0.18);
        const zPosSecondary = Math.sin(ratio * Math.PI * 1.5 + flowAnim) * 160;

        const pRing: any[] = [];
        const sRing: any[] = [];

        for (let seg = 0; seg < segmentsCount; seg++) {
          const theta = (seg / segmentsCount) * Math.PI * 2;
          
          // Outer vertices relative to dynamic curves
          const px = xPosPrimary + baseRadius * Math.cos(theta);
          const py = yPosPrimary + baseRadius * Math.sin(theta);
          const pz = zPosPrimary;

          const sx = xPosSecondary + (baseRadius * 0.75) * Math.cos(theta + Math.PI);
          const sy = yPosSecondary + (baseRadius * 0.75) * Math.sin(theta + Math.PI);
          const sz = zPosSecondary;

          const pProj = project(px, py, pz);
          const sProj = project(sx, sy, sz);

          // Interactive dynamic distortion ripples: Repel mesh nodes slightly away from cursor placement
          if (isHovered) {
            const pdx = mx - pProj.sx;
            const pdy = my - pProj.sy;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (pDist < 180) {
              const pushFactor = (180 - pDist) / 180;
              pProj.sx -= (pdx / pDist) * pushFactor * 14;
              pProj.sy -= (pdy / pDist) * pushFactor * 14;
            }

            const sdx = mx - sProj.sx;
            const sdy = my - sProj.sy;
            const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
            if (sDist < 180) {
              const pushFactor = (180 - sDist) / 180;
              sProj.sx -= (sdx / sDist) * pushFactor * 12;
              sProj.sy -= (sdy / sDist) * pushFactor * 12;
            }
          }

          pRing.push(pProj);
          sRing.push(sProj);
        }

        primaryConduitSlices.push({
          sliceIdx: s,
          nodes: pRing,
          center: project(xPosPrimary, yPosPrimary, zPosPrimary)
        });

        secondaryConduitSlices.push({
          sliceIdx: s,
          nodes: sRing,
          center: project(xPosSecondary, yPosSecondary, zPosSecondary)
        });
      }

      // Draw faint diagnostic telemetry lines/brackets at extreme edges
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.04)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      // Crosshair details
      ctx.moveTo(centerX - 30, centerY); ctx.lineTo(centerX + 30, centerY);
      ctx.moveTo(centerX, centerY - 30); ctx.lineTo(centerX, centerY + 30);
      ctx.stroke();

      // Top edge tracking readouts
      ctx.fillStyle = 'rgba(139, 115, 85, 0.1)';
      ctx.font = '7px monospace';
      ctx.fillText(`GEO_W_SCALE_3D: ${w}X${h}`, 20, 24);
      ctx.fillText(`YAW_OFFSET: ${baseYaw.toFixed(4)} RAD`, 20, 34);
      ctx.fillText(`CAD_INTEGRITY: NOMINAL 100%`, 20, 44);

      // RENDERING MESH FOR SECONDARY PIPELINE (thinner background pipe)
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.12)';
      ctx.lineWidth = 0.4;
      for (let s = 0; s < slicesCount; s++) {
        const slice = secondaryConduitSlices[s];
        
        ctx.beginPath();
        for (let seg = 0; seg < segmentsCount; seg++) {
          const pt = slice.nodes[seg];
          if (seg === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.closePath();
        
        // Depth-based attenuation (farther slices are dimmer)
        const avgDepth = slice.center.sz;
        const normDepthAlpha = Math.max(0.01, Math.min(0.25, (300 - avgDepth) / 1100));
        ctx.strokeStyle = `rgba(139, 115, 85, ${normDepthAlpha * 0.4})`;
        ctx.stroke();

        // Connect longitude lines to subsequent slice
        if (s < slicesCount - 1) {
          const nextSlice = secondaryConduitSlices[s + 1];
          for (let seg = 0; seg < segmentsCount; seg++) {
            if (seg % 2 === 0) { // thin out wireframe lines for performance & purity
              ctx.beginPath();
              ctx.moveTo(slice.nodes[seg].sx, slice.nodes[seg].sy);
              ctx.lineTo(nextSlice.nodes[seg].sx, nextSlice.nodes[seg].sy);
              ctx.strokeStyle = `rgba(80, 80, 85, ${normDepthAlpha * 0.18})`;
              ctx.stroke();
            }
          }
        }
      }

      // RENDERING MESH FOR PRIMARY PIPELINE (larger foreground pipe)
      for (let s = 0; s < slicesCount; s++) {
        const slice = primaryConduitSlices[s];
        const avgDepth = slice.center.sz;
        const normDepthAlpha = Math.max(0.01, Math.min(0.35, (400 - avgDepth) / 1000));
        
        // Draw slice ring
        ctx.beginPath();
        for (let seg = 0; seg < segmentsCount; seg++) {
          const pt = slice.nodes[seg];
          if (seg === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }
        ctx.closePath();
        
        // Highlight active rings close to cursor with warm golden aura
        let isSliceProximity = false;
        if (isHovered) {
          const sDist = Math.sqrt((mx - slice.center.sx) ** 2 + (my - slice.center.sy) ** 2);
          if (sDist < 160) {
            isSliceProximity = true;
            ctx.strokeStyle = `rgba(223, 166, 108, ${(160 - sDist) / 160 * 0.35})`;
            ctx.lineWidth = 0.85;
          } else {
            ctx.strokeStyle = `rgba(139, 115, 85, ${normDepthAlpha * 0.38})`;
            ctx.lineWidth = 0.45;
          }
        } else {
          ctx.strokeStyle = `rgba(139, 115, 85, ${normDepthAlpha * 0.28})`;
          ctx.lineWidth = 0.4;
        }
        ctx.stroke();

        // Connect longitudinal lines to adjacent slices
        if (s < slicesCount - 1) {
          const nextSlice = primaryConduitSlices[s + 1];
          for (let seg = 0; seg < segmentsCount; seg++) {
            ctx.beginPath();
            ctx.moveTo(slice.nodes[seg].sx, slice.nodes[seg].sy);
            ctx.lineTo(nextSlice.nodes[seg].sx, nextSlice.nodes[seg].sy);
            
            // Faintly color HDPE stripes along key axes
            if (seg === 0 || seg === Math.floor(segmentsCount / 2)) {
              ctx.strokeStyle = isSliceProximity 
                ? 'rgba(223, 166, 108, 0.25)' 
                : `rgba(139, 115, 85, ${normDepthAlpha * 0.3})`;
              ctx.lineWidth = 1;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${normDepthAlpha * 0.08})`;
              ctx.lineWidth = 0.35;
            }
            ctx.stroke();
          }
        }
      }

      // STREAM AND PROGRESS PARTICLES in 3D Conduit wave trajectories
      particles.forEach((p) => {
        // Increment particle positioning safely
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.angle = Math.random() * Math.PI * 2;
        }
        p.angle += p.spiral;

        // Trace pipeline centers
        const sliceIdxFloat = p.t * (slicesCount - 1);
        const lowerS = Math.floor(sliceIdxFloat);
        const upperS = Math.min(slicesCount - 1, lowerS + 1);
        const localT = sliceIdxFloat - lowerS;

        const useConduits = p.conduitType === 0 ? primaryConduitSlices : secondaryConduitSlices;
        const lowCenter = useConduits[lowerS].center.orig;
        const highCenter = useConduits[upperS].center.orig;

        // Interpolated centerline position
        const interpX = lowCenter.x + (highCenter.x - lowCenter.x) * localT;
        const interpY = lowCenter.y + (highCenter.y - lowCenter.y) * localT;
        const interpZ = lowCenter.z + (highCenter.z - lowCenter.z) * localT;

        // Compute offset particle radius position around center ring direction
        const currentRad = baseRadius * p.radRatio * (p.conduitType === 0 ? 1 : 0.75);
        const px = interpX + currentRad * Math.cos(p.angle);
        const py = interpY + currentRad * Math.sin(p.angle);
        const pz = interpZ;

        const projP = project(px, py, pz);

        // Repel particles slightly based on hover aura
        if (isHovered) {
          const pdx = mx - projP.sx;
          const pdy = my - projP.sy;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pDist < 130) {
            const pushFactor = (130 - pDist) / 130;
            projP.sx -= (pdx / pDist) * pushFactor * 12;
            projP.sy -= (pdy / pDist) * pushFactor * 12;
          }
        }

        // Depth scale check
        const avgDepth = projP.sz;
        const alphaDepth = Math.max(0.05, Math.min(0.9, (450 - avgDepth) / 1000));

        // Render traveling visual point
        ctx.beginPath();
        ctx.arc(projP.sx, projP.sy, p.size * projP.scale * 0.8, 0, Math.PI * 2);

        // Styling flow conduits: Faint teals and warm gold pipeline emissions
        if (p.conduitType === 0) {
          // Primary Conduit flow -> Clean Hydrographic Teal Blue
          ctx.fillStyle = `rgba(14, 165, 233, ${p.brightness * alphaDepth * 0.75})`;
        } else {
          // Secondary Conduit flow -> Soft Conduit Amber Gold
          ctx.fillStyle = `rgba(223, 166, 108, ${p.brightness * alphaDepth * 0.6})`;
        }
        ctx.fill();

        // Draw dynamic laser telemetry connector line from cursor to nearest foreground particle
        if (isHovered && p.conduitType === 0 && p.brightness > 0.85) {
          const pdx = mx - projP.sx;
          const pdy = my - projP.sy;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pDist < 120) {
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(projP.sx, projP.sy);
            ctx.strokeStyle = `rgba(223, 166, 108, ${(120 - pDist) / 120 * 0.22})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();

            // Draw a tiny target tracking circle around particle
            ctx.beginPath();
            ctx.arc(projP.sx, projP.sy, p.size * projP.scale * 3.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(14, 165, 233, ${(120 - pDist) / 120 * 0.4})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      // Frame continuation loop
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <header 
      ref={containerRef}
      className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#8b7355]/20 bg-[#0c0c0e] overflow-hidden"
    >
      
      {/* Interactive Floating Data-Flow Engineering Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 select-none pointer-events-none opacity-40 transition-opacity duration-500 mix-blend-screen"
      />

      {/* Atmospheric Video under absolute overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <motion.div 
          className="w-full h-full"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover object-center filter contrast-125 brightness-75 saturate-[0.7]"
            poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e2d09eb0482dc437a3536785dc9&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
        
        {/* Dynamic Multi-layered high-contrast overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/98 via-[#0b0c0e]/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/40 to-[#030303]/50 z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b7355]/10 rounded-full filter blur-[140px] pointer-events-none mix-blend-screen animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-14 lg:gap-16 relative z-20">
        
        {/* Left Column Text & Infographics with staggered micro-entrances */}
        <div className="w-full lg:w-1/2 text-left space-y-6">
          
          {/* Active specifications laboratory badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-[#8b7355]/10 border border-[#8b7355]/20 px-2.5 py-1 rounded-md select-none gap-2 z-20"
          >
            <div className="w-1 h-1 rounded-full bg-[#8b7355]" />
            <span className="font-mono text-[8px] tracking-[0.15em] font-bold uppercase text-white">
              National Supply Conduit
            </span>
          </motion.div>

          {/* Majestic Heading Typography */}
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans tracking-tight leading-none text-white font-bold uppercase"
            >
              <span className="font-serif italic font-light lowercase text-[#dfdad3] block leading-normal border-l border-[#8b7355] pl-3 normal-case text-base sm:text-lg lg:text-xl">
                certified manufacturer &amp; wholesaler
              </span>
              <span className="font-sans font-black text-white block tracking-tighter text-2xl sm:text-3xl lg:text-[40px] mt-1.5 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                HIGH INTEGRITY PIPELINE INFRASTRUCTURE
              </span>
            </motion.h1>
          </div>

          {/* Captivating details paragraph */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm text-white/60 max-w-lg leading-relaxed font-sans font-light tracking-wide pr-2"
          >
            Certified polymer conduits and pumping networks engineered for municipal waterworks, built in strict conformity with Bureau of Indian Standards (BIS) specifications.
          </motion.p>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-16 h-[1px] bg-[#8b7355] origin-left"
          />

          {/* Navigation Action Buttons Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            
            <button
              onClick={onExploreClick}
              className="bg-[#8b7355] hover:bg-white text-white hover:text-black border border-[#8b7355] hover:border-white px-5 py-3 font-sans text-[10px] tracking-[0.15em] font-bold uppercase transition-all duration-300 cursor-pointer rounded-xl flex items-center hover:scale-[1.01] shadow-md"
            >
              Explore Catalog
              <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenEstimatorClick}
              className="px-4 py-3 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/5 hover:border-[#8b7355]/40 font-sans text-[10px] tracking-[0.1em] font-bold uppercase transition-all duration-300 cursor-pointer rounded-xl flex items-center gap-1.5 hover:scale-[1.01]"
            >
              <Layers className="w-3.5 h-3.5 text-[#dca66c]" />
              Sizing Calculator
            </button>

          </motion.div>

          {/* Beautiful real-time delivery statistics */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-3 pt-4 max-w-md border-t border-white/10"
          >
            <div className="flex flex-col">
              <p className="text-xl sm:text-2xl font-serif italic text-white leading-none">22.8L<span className="text-[10px] not-italic font-sans font-bold text-secondary ml-0.5">METERS</span></p>
              <p className="text-[7.5px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.15em] mt-1">Conduits Deployed</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xl sm:text-2xl font-serif italic text-white leading-none">1.2K<span className="text-[10px] not-italic font-sans font-bold text-secondary ml-0.5">GRIDS</span></p>
              <p className="text-[7.5px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.15em] mt-1">Active Networks</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xl sm:text-2xl font-serif italic text-white leading-none">100%<span className="text-[10px] not-italic font-sans font-bold text-secondary ml-0.5">NABL</span></p>
              <p className="text-[7.5px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.15em] mt-1">Audit Compliant</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Pristine Minimalist Material Standards Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full lg:w-1/2 flex justify-center h-full relative"
        >
          {/* Main interactive showcase card */}
          <div className="bg-[#0f0f11] border border-[#8b7355]/20 rounded-3xl overflow-hidden p-6 sm:p-7 w-full max-w-xl shadow-2xl relative text-left select-none space-y-6">
            
            {/* Top diagnostic header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#8b7355]/10 border border-[#8b7355]/25 text-secondary rounded-xl">
                  <Award className="w-4.5 h-4.5 text-secondary" />
                </div>
                <div>
                  <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase font-bold block">
                    Material Specification
                  </span>
                  <span className="text-xs font-serif italic text-white/95 mt-0.5 block">
                    {activeMaterial.name}
                  </span>
                </div>
              </div>

              {/* Verified standard badge */}
              <span className="text-[8px] font-mono bg-[#8b7355]/15 text-secondary font-bold border border-[#8b7355]/30 px-2.5 py-1 uppercase tracking-wider rounded">
                BIS Certified
              </span>
            </div>

            {/* Selector Material presets tabs */}
            <div className="space-y-2">
              <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase block font-bold">
                1. Select Piping System
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['HDPE', 'MDPE', 'PVC', 'IRON'] as const).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => {
                      setSelectedMaterial(mat);
                    }}
                    className={`py-2 text-[10px] font-mono font-bold tracking-wider rounded-xl border text-center transition-all cursor-pointer ${
                      selectedMaterial === mat
                        ? 'bg-[#8b7355]/15 border-[#8b7355] text-secondary'
                        : 'bg-neutral-900/60 border-white/5 text-white/50 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {mat === 'IRON' ? 'DI Pipe' : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Specimen Interactive Inspection Lab HUD */}
            <SpecimenScanner3D 
              materialType={selectedMaterial} 
              materialsDatabase={materialsDatabase} 
            />

            {/* Specimen Recommendation Quote */}
            <p className="text-xs text-white/60 font-sans leading-relaxed pt-4 border-t border-white/5 select-all">
              <span className="text-[#8b7355] font-semibold text-[10px] uppercase font-mono tracking-wider block mb-1">Application Suitability:</span>
              {activeMaterial.desc}
            </p>

          </div>
        </motion.div>

      </div>
    </header>
  );
}
