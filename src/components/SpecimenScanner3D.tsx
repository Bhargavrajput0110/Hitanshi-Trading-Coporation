import { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Activity, 
  Gauge, 
  RotateCw, 
  ShieldAlert, 
  ShieldCheck, 
  CornerDownRight, 
  Eye,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpecimenScanner3DProps {
  materialType: 'HDPE' | 'MDPE' | 'PVC' | 'IRON';
  materialsDatabase: Record<string, {
    name: string;
    standard: string;
    badge: string;
    safeBar: number;
    sdr: string;
    outerColor: string;
    lineColor: string;
    wallThick: number;
    desc: string;
  }>;
}

export default function SpecimenScanner3D({ materialType, materialsDatabase }: SpecimenScanner3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive controls state
  const [testMode, setTestMode] = useState<'flow' | 'pressure' | 'strain'>('flow');
  const [sliderValue, setSliderValue] = useState<number>(50); // General purpose slider (flow value, pressure value, and compression load)
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: -0.4, y: 0.6 });
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number; tempX: number; tempY: number }>({
    isDragging: false, startX: 0, startY: 0, tempX: -0.4, tempY: 0.6
  });

  const activeMat = materialsDatabase[materialType];

  // Specific computed limits
  const computedMaxPressure = activeMat.safeBar * 1.5;
  const currentPressure = testMode === 'pressure' ? Math.round((sliderValue / 100) * computedMaxPressure * 10) / 10 : 8;
  const currentFlow = testMode === 'flow' ? Math.round((sliderValue / 100) * 6.5 * 10) / 10 : 2.5;
  const currentLoad = testMode === 'strain' ? Math.round((sliderValue / 100) * 125) : 40; // kN / sq m

  const isPressureCritical = testMode === 'pressure' && currentPressure > activeMat.safeBar;

  // Track dragging behavior
  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.tempX = rotation.x;
    dragRef.current.tempY = rotation.y;
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    // Scale factor for sensitivity
    const dragSensitivity = 0.007;
    setRotation({
      x: Math.max(-1.2, Math.min(1.2, dragRef.current.tempX + dy * dragSensitivity)),
      y: dragRef.current.tempY + dx * dragSensitivity
    });
  };

  const handleMouseUpOrLeave = () => {
    dragRef.current.isDragging = false;
  };

  // Render Specimen in 3D using mathematical projections
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localAutoYaw = rotation.y;
    let particleOffset = 0;

    // Fluid particles streaming inside
    const fluidParticlesCount = 35;
    const fluidParticles: { offset: number; radiusRatio: number; angle: number; speed: number }[] = [];
    for (let i = 0; i < fluidParticlesCount; i++) {
      fluidParticles.push({
        offset: Math.random() * 2 - 1, // position along cylinder space (-1 to 1)
        radiusRatio: Math.random() * 0.75, // percentage of inner core space
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.015 + 0.008)
      });
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic scale depending on active material to make sure standard dimensions feel balanced
    let baseOuterRadius = 46;
    if (materialType === 'IRON') baseOuterRadius = 49;
    if (materialType === 'PVC') baseOuterRadius = 42;
    
    const wallRatio = activeMat.wallThick / 30; // visual representation scaler
    const innerRadius = baseOuterRadius * (1 - Math.max(0.08, Math.min(0.35, wallRatio)));

    const renderLoop = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      // Auto-rotation handling
      if (isAutoRotating) {
        localAutoYaw += 0.004;
      } else {
        localAutoYaw = rotation.y;
      }

      const pitch = rotation.x;
      const yaw = localAutoYaw;

      const centerX = w / 2;
      const centerY = h / 2 - 12; // slightly shift up to leave room for HUD indicators

      // 3D Projection functions
      const project = (x3d: number, y3d: number, z3d: number) => {
        // Apply rotation around Y (yaw)
        const x1 = x3d * Math.cos(yaw) - z3d * Math.sin(yaw);
        const z1 = x3d * Math.sin(yaw) + z3d * Math.cos(yaw);
        
        // Apply rotation around X (pitch)
        const y2 = y3d * Math.cos(pitch) - z1 * Math.sin(pitch);
        const z2 = y3d * Math.sin(pitch) + z1 * Math.cos(pitch);

        // Orthographic scale & translation
        const viewScale = 1.6;
        return {
          sx: centerX + x1 * viewScale,
          sy: centerY + y2 * viewScale,
          sz: z2, // depth storage for back-to-front rendering sorting
          orig: { x: x3d, y: y3d, z: z3d }
        };
      };

      // Cylinder definition: slices along the longitudinal axis (Z)
      const cylinderLength = 98;
      const slicesCount = 9;
      const segmentsCount = 20;

      // Generate points geometry
      const slices: any[] = [];
      for (let s = 0; s < slicesCount; s++) {
        const zRatio = s / (slicesCount - 1); // 0 to 1
        const originalZ = -cylinderLength / 2 + zRatio * cylinderLength;

        // Apply deflection bend if in strain mode
        let dy = 0;
        if (testMode === 'strain') {
          // Bending formula: parabolic sag at center
          const stretch = Math.sin(zRatio * Math.PI);
          const sagAmount = (sliderValue / 100) * 9.5; 
          dy = -sagAmount * stretch;
        }

        const ringOuter: any[] = [];
        const ringInner: any[] = [];

        for (let seg = 0; seg <= segmentsCount; seg++) {
          const angle = (seg / segmentsCount) * Math.PI * 2;
          
          let actualRad = baseOuterRadius;
          let actualInnerRad = innerRadius;

          // In pressure mode, stretch the pipe slightly under hoop pressure tension
          if (testMode === 'pressure') {
            const expansionFactor = 1 + (currentPressure / computedMaxPressure) * 0.05;
            actualRad *= expansionFactor;
            actualInnerRad *= expansionFactor;
          }

          const ox = actualRad * Math.cos(angle);
          const oy = actualRad * Math.sin(angle) + dy;
          const ix = actualInnerRad * Math.cos(angle);
          const iy = actualInnerRad * Math.sin(angle) + dy;

          ringOuter.push(project(ox, oy, originalZ));
          ringInner.push(project(ix, iy, originalZ));
        }

        slices.push({
          z: originalZ,
          outer: ringOuter,
          inner: ringInner,
          avgDepth: project(0, dy, originalZ).sz
        });
      }

      // Backend sorting or dividing into quadrants to draw proper occlusions
      // Since it's symmetric, drawing from back to front is highly effective
      // Let's sort slices based on depth (which z yields furthest projection distance)
      const sortedSlices = [...slices].sort((a, b) => b.avgDepth - a.avgDepth);

      // Simple cylindrical grid drawer
      // Draw grid lines connecting slices in back-to-front or layout order
      
      // Draw standard blueprint cross-lines first as ambient cyber grids
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.035)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      // Horizontal laser baseline
      ctx.moveTo(centerX - 120, centerY);
      ctx.lineTo(centerX + 120, centerY);
      ctx.stroke();

      // 1. DRAW INNER AND OUTER CYLINDER SHELLS (Stitching slices together)
      for (let s = 1; s < slices.length; s++) {
        const prevSlice = slices[s - 1];
        const currSlice = slices[s];

        // Stitch segments
        for (let seg = 0; seg < segmentsCount; seg++) {
          const nextSeg = (seg + 1) % segmentsCount;

          // Determine lighting based on vertex normal relative to eye
          // Simple fake lighting (using standard cosine of the segment angle relative to yaw direction)
          const currAngle = (seg / segmentsCount) * Math.PI * 2;
          const lightCos = Math.sin(currAngle + yaw) * 0.4 + 0.6; // 0.2 to 1.0

          // Determine Material Coloring
          let baseRgb = '139, 115, 85'; // HDPE / generic
          if (materialType === 'HDPE') baseRgb = '26, 27, 30';
          if (materialType === 'MDPE') baseRgb = '24, 24, 26';
          if (materialType === 'PVC') baseRgb = '80, 82, 90';
          if (materialType === 'IRON') baseRgb = '55, 58, 65';

          // Outer jacket polygon
          ctx.beginPath();
          ctx.moveTo(prevSlice.outer[seg].sx, prevSlice.outer[seg].sy);
          ctx.lineTo(currSlice.outer[seg].sx, currSlice.outer[seg].sy);
          ctx.lineTo(currSlice.outer[nextSeg].sx, currSlice.outer[nextSeg].sy);
          ctx.lineTo(prevSlice.outer[nextSeg].sx, prevSlice.outer[nextSeg].sy);
          ctx.closePath();

          // Normal solid shading
          let fillOpacity = 0.35;
          if (testMode === 'pressure') {
            // Under pressure, thin areas of the pipe glow slightly amber/red based on pressure intensity
            const stressRatio = currentPressure / computedMaxPressure;
            if (isPressureCritical) {
              // Critical stress alert glow
              fillOpacity = 0.45 + Math.sin(Date.now() / 150) * 0.1;
              ctx.fillStyle = `rgba(${Math.round(180 + stressRatio * 75)}, ${Math.round(80 - stressRatio * 60)}, 30, ${fillOpacity * lightCos})`;
            } else {
              // Warm pressure indicators
              ctx.fillStyle = `rgba(${Math.round(100 + stressRatio * 150)}, ${Math.round(115 - stressRatio * 40)}, ${Math.round(85 - stressRatio * 50)}, ${fillOpacity * lightCos})`;
            }
          } else {
            // Normal physical color shading
            if (materialType === 'HDPE' || materialType === 'MDPE') {
              // Dark high-molecular weight polymer with semi-translucency
              ctx.fillStyle = `rgba(18, 19, 21, ${0.85 * lightCos})`;
            } else {
              ctx.fillStyle = `rgba(${baseRgb}, ${fillOpacity * lightCos})`;
            }
          }
          ctx.fill();

          // Outer mesh wireframe line representation
          if (seg % 4 === 0) {
            ctx.strokeStyle = `rgba(139, 115, 85, ${0.11 * lightCos})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          // Stitching co-extrusion visual stripe details to surface (HDPE Blue or MDPE Yellow)
          if ((materialType === 'HDPE' || materialType === 'MDPE') && (seg === 0 || seg === 5 || seg === 10 || seg === 15)) {
            ctx.beginPath();
            ctx.moveTo(prevSlice.outer[seg].sx, prevSlice.outer[seg].sy);
            ctx.lineTo(currSlice.outer[seg].sx, currSlice.outer[seg].sy);
            ctx.strokeStyle = activeMat.lineColor;
            // High visibility aesthetic width
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      // Draw active stress profile rings to emphasize geometric boundaries
      slices.forEach((slice, idx) => {
        if (idx === 0 || idx === slices.length - 1 || idx % 2 === 0) {
          ctx.beginPath();
          slice.outer.forEach((pt: any, i: number) => {
            if (i === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          });
          ctx.closePath();
          
          let ringColor = 'rgba(139, 115, 85, 0.15)';
          if (idx === slices.length - 1) ringColor = 'rgba(255,255,255,0.25)'; // Highlight front inspection face
          if (testMode === 'pressure' && isPressureCritical) ringColor = 'rgba(239, 68, 68, 0.5)';
          
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = idx === slices.length - 1 ? 1.2 : 0.6;
          ctx.stroke();

          // Draw inner bore ring
          ctx.beginPath();
          slice.inner.forEach((pt: any, i: number) => {
            if (i === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          });
          ctx.closePath();
          ctx.strokeStyle = idx === slices.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(139, 115, 85, 0.08)';
          ctx.lineWidth = idx === slices.length - 1 ? 1 : 0.5;
          ctx.stroke();
        }
      });

      // 2. WATER FLOW/PARTICLES SIMULATOR (Drawn inside inner core)
      if (testMode === 'flow') {
        const velocityScalar = sliderValue / 100;
        particleOffset += 0.01 + velocityScalar * 0.04;
        
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        fluidParticles.forEach((part, index) => {
          // Compute moving Z coordinate
          let currentZRatio = part.offset + particleOffset * part.speed;
          // Loop around
          while (currentZRatio > 1) currentZRatio -= 2;
          while (currentZRatio < -1) currentZRatio += 2;

          const zPos = currentZRatio * (cylinderLength / 2);

          const dy = 0; // standard flow geometry has no strain bending loads

          // Compute radial point inside matching internal radius
          const partRadius = innerRadius * part.radiusRatio * 0.95;
          const px = partRadius * Math.cos(part.angle);
          const py = partRadius * Math.sin(part.angle) + dy;

          const pScreen = project(px, py, zPos);

          // Draw little streaming fluid sphere
          ctx.beginPath();
          ctx.arc(pScreen.sx, pScreen.sy, Math.max(0.6, 2 * (1 - part.radiusRatio) * (pScreen.sz + baseOuterRadius) / (baseOuterRadius * 2)), 0, Math.PI * 2);
          
          // Speed particles reflect extra kinetic glows
          ctx.fillStyle = velocityScalar > 0.65 ? 'rgba(147, 197, 253, 0.85)' : 'rgba(96, 165, 250, 0.6)';
          ctx.fill();
        });
      }

      // 3. COMPRESSION FORCE VECTOR ARROWS IN STRAIN MODE
      if (testMode === 'strain') {
        const activeLoadRatio = sliderValue / 100;
        
        // Draw top compression load representation
        const arrowSliceIdx = Math.floor(slicesCount / 2);
        const centralPt = slices[arrowSliceIdx].outer[15]; // peak top point of cylinder
        
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)';
        ctx.lineWidth = 1.5;
        
        // Animated vector line pushing down
        const animArrowOffset = Math.sin(Date.now() / 150) * 2;
        const arrowLen = 22 + activeLoadRatio * 15;
        ctx.beginPath();
        ctx.moveTo(centralPt.sx, centralPt.sy - arrowLen - animArrowOffset);
        ctx.lineTo(centralPt.sx, centralPt.sy - 3 - animArrowOffset);
        
        // Head
        ctx.lineTo(centralPt.sx - 4, centralPt.sy - 8 - animArrowOffset);
        ctx.moveTo(centralPt.sx, centralPt.sy - 3 - animArrowOffset);
        ctx.lineTo(centralPt.sx + 4, centralPt.sy - 8 - animArrowOffset);
        ctx.stroke();

        // Arrow label
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`${currentLoad} kN/m²`, centralPt.sx + 8, centralPt.sy - arrowLen/2 - 2);
      }

      // 4. DYNAMIC ADVANCED DETAILED LEADER LABELS & ANNOTATIONS (Drawn directly on Canvas)
      // We draw these connected to the front face (last slice) for incredibly cinematic tech scanner vibe!
      const frontSlice = slices[slices.length - 1];
      const maxPtIdx = 0; // Outer right point
      const innerPtIdx = 0; // Inner right point

      const refOuter = frontSlice.outer[maxPtIdx];
      const refInner = frontSlice.inner[innerPtIdx];

      ctx.lineWidth = 1;
      
      // Specimen Diameter Leader Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      // Start slightly right of outer boundary
      ctx.moveTo(refOuter.sx, refOuter.sy);
      ctx.lineTo(refOuter.sx + 24, refOuter.sy - 15);
      ctx.lineTo(refOuter.sx + 74, refOuter.sy - 15);
      ctx.stroke();

      // Mini endpoint dot
      ctx.fillStyle = '#8b7355';
      ctx.beginPath();
      ctx.arc(refOuter.sx, refOuter.sy, 2, 0, Math.PI * 2);
      ctx.fill();

      // Outer diameter text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`OD: ${materialType === 'HDPE' ? '110mm' : materialType === 'MDPE' ? '90mm' : materialType === 'PVC' ? '160mm' : '200mm'}`, refOuter.sx + 28, refOuter.sy - 20);
      
      // Wall thickness indicator line
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.5)';
      ctx.beginPath();
      ctx.moveTo((refOuter.sx + refInner.sx) / 2, (refOuter.sy + refInner.sy) / 2);
      ctx.lineTo(refOuter.sx + 15, refOuter.sy + 20);
      ctx.lineTo(refOuter.sx + 65, refOuter.sy + 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc((refOuter.sx + refInner.sx) / 2, (refOuter.sy + refInner.sy) / 2, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = activeMat.lineColor;
      ctx.fill();

      ctx.fillStyle = '#e1dad2';
      ctx.font = '8px sans-serif';
      ctx.fillText(`WALL: ${activeMat.wallThick}mm`, refOuter.sx + 18, refOuter.sy + 14);

      // Core Inspector readout (bottom-left area of canvas)
      ctx.fillStyle = 'rgba(15,15,17,0.8)';
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.15)';
      ctx.lineWidth = 1;
      
      // Draw transparent info overlay in coordinate space
      const hudBoxX = 14;
      const hudBoxY = h - 52;
      const hudBoxW = 120;
      const hudBoxH = 38;
      
      ctx.beginPath();
      ctx.roundRect(hudBoxX, hudBoxY, hudBoxW, hudBoxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#8b7355';
      ctx.font = '6.5px monospace';
      ctx.fillText('CORE DIAGNOSTIC HUD', hudBoxX + 6, hudBoxY + 11);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px monospace';
      if (testMode === 'flow') {
        ctx.fillText(`FLOW: ${currentFlow} m/s`, hudBoxX + 6, hudBoxY + 22);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.85)';
        ctx.fillText(`RATE: ${Math.round(currentFlow * 12.8)} Lit/Sec`, hudBoxX + 6, hudBoxY + 31);
      } else if (testMode === 'pressure') {
        const strainPcnt = Math.round((currentPressure / activeMat.safeBar) * 100);
        ctx.fillStyle = isPressureCritical ? '#f87171' : '#fcd34d';
        ctx.fillText(`LOAD: ${currentPressure} Bar`, hudBoxX + 6, hudBoxY + 22);
        ctx.fillText(`HOOP STRESS: ${strainPcnt}%`, hudBoxX + 6, hudBoxY + 31);
      } else {
        const deflFactor = Math.round((sliderValue / 100) * activeMat.wallThick * 0.18 * 10) / 10;
        ctx.fillText(`FORCE: ${currentLoad} kN`, hudBoxX + 6, hudBoxY + 22);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(`DEFLECTION: ${deflFactor}mm`, hudBoxX + 6, hudBoxY + 31);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [materialType, testMode, sliderValue, rotation, isAutoRotating]);

  return (
    <div className="w-full space-y-4">
      {/* 3D Canvas Rendering Container */}
      <div 
        ref={containerRef}
        className="w-full aspect-[4/3] max-h-[300px] sm:max-h-[340px] bg-neutral-950/90 border border-white/5 rounded-2xl relative overflow-hidden cursor-grab active:cursor-grabbing group shadow-inner"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {/* Status Scanner Overlays */}
        <div className="absolute top-3 left-4 flex items-center gap-1.5 pointer-events-none select-none">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[7.5px] font-mono tracking-widest text-[#dca66c] uppercase font-bold">
            Specimen Scanner Active
          </span>
        </div>

        {/* Compass indicator/rotation lock absolute label */}
        <div className="absolute top-3 right-4 flex items-center gap-3">
          <button 
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg border text-[9px] font-mono tracking-wider transition-all uppercase flex items-center gap-1 ${
              isAutoRotating 
                ? 'bg-[#8b7355]/15 border-[#8b7355]/30 text-secondary' 
                : 'bg-black/60 border-white/5 text-white/55 hover:text-white hover:border-white/20'
            }`}
            title="Toggle Live Specimen Auto-Orbit"
          >
            <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            {isAutoRotating ? 'Auto Orbit' : 'Static View'}
          </button>
        </div>

        {/* Drag Helper Tooltip Overlay */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/80 px-2.5 py-1 border border-white/10 rounded-md text-[8px] text-white/60 font-mono">
            🖱️ Click &amp; Drag Specimen to Rotate Scanner
          </span>
        </div>

        {/* 3D Render Port */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Danger alert overlay for pressure burst tests */}
        <AnimatePresence>
          {isPressureCritical && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-red-950/25 border-2 border-red-500/20 rounded-2xl flex flex-col items-center justify-center pointer-events-none z-10"
            >
              <div className="bg-red-900/90 border border-red-500/35 px-3 py-2 rounded-xl text-center shadow-lg max-w-[80vw] flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-white animate-bounce" />
                <div>
                  <p className="text-[9px] font-mono font-bold tracking-wider text-white uppercase">Critical Hoop Deflection Warning</p>
                  <p className="text-[8px] text-red-200 mt-0.5">SPECIFIED HYDROSTATIC PRESSURE RATING LIMIT EXCEEDED</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Station Panel */}
      <div className="bg-[#111114]/80 border border-white/5 rounded-2xl p-4 space-y-4">
        
        {/* Interactive Mode Picker */}
        <div className="space-y-2">
          <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase block font-bold">
            2. Choose Dynamic Simulation Test
          </span>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Flow Mode */}
            <button
              onClick={() => {
                setTestMode('flow');
                setSliderValue(55);
              }}
              className={`py-2 px-1 rounded-xl border text-[9px] font-mono transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                testMode === 'flow'
                  ? 'bg-blue-950/30 border-blue-500/40 text-blue-300'
                  : 'bg-black/30 border-white/5 text-white/45 hover:border-white/10 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Hydraulic Flow</span>
            </button>

            {/* Pressure Burst Mode */}
            <button
              onClick={() => {
                setTestMode('pressure');
                setSliderValue(50); // Safe ratio: 50%
              }}
              className={`py-2 px-1 rounded-xl border text-[9px] font-mono transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                testMode === 'pressure'
                  ? isPressureCritical 
                    ? 'bg-red-950/30 border-red-500/50 text-red-300 animate-pulse'
                    : 'bg-amber-950/30 border-[#dca66c]/40 text-amber-200'
                  : 'bg-black/30 border-white/5 text-white/45 hover:border-white/10 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Hoop Pressure</span>
            </button>

            {/* Compression Strain Mode */}
            <button
              onClick={() => {
                setTestMode('strain');
                setSliderValue(40);
              }}
              className={`py-2 px-1 rounded-xl border text-[9px] font-mono transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                testMode === 'strain'
                  ? 'bg-purple-950/30 border-purple-500/40 text-purple-300'
                  : 'bg-black/30 border-white/5 text-white/45 hover:border-white/10 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Strain Loading</span>
            </button>
          </div>
        </div>

        {/* Dynamic Parameter Adjustment Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-mono tracking-widest text-[#dca66c] uppercase block font-bold">
              {testMode === 'flow' 
                ? 'Adjust Inflow Velocity' 
                : testMode === 'pressure' 
                ? 'Adjust Hoop Internal Pressure' 
                : 'Adjust Structural Compression Force'}
            </span>
            <span className="text-[10px] font-mono font-bold text-white">
              {testMode === 'flow' 
                ? `${currentFlow} m/s` 
                : testMode === 'pressure' 
                ? `${currentPressure} Bar` 
                : `${currentLoad} kN/m²`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full accent-[#8b7355] bg-black/40 h-1.5 rounded-lg cursor-pointer border border-white/5"
            />
          </div>

          <div className="flex justify-between items-center text-[7.5px] font-mono text-white/35 uppercase tracking-wider">
            {testMode === 'flow' ? (
              <>
                <span>Muted Trickle</span>
                <span>Max Pipeline Cap</span>
              </>
            ) : testMode === 'pressure' ? (
              <>
                <span>At Atmosphere</span>
                <span className={isPressureCritical ? 'text-red-400 font-bold' : ''}>Target Margin limit ({activeMat.safeBar} Bar)</span>
              </>
            ) : (
              <>
                <span>Dead Load Weight</span>
                <span>Critical Seismic Shear</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Safety Audited Readout */}
        <div className="border-t border-white/5 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md ${isPressureCritical ? 'bg-red-950/50 text-red-400 border border-red-500/20' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'}`}>
              {isPressureCritical ? (
                <ShieldAlert className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-[7.5px] font-mono text-[#dca66c] uppercase block tracking-wider font-bold">Simulated Security Index</span>
              <span className={`text-[10px] font-bold ${isPressureCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                {isPressureCritical ? 'WARNING: CRITICAL DEFORMATION' : 'SAFE OPERATIONAL MARGIN'}
              </span>
            </div>
          </div>
          <span className="text-[8px] font-mono text-white/45 bg-white/5 px-2 py-0.5 rounded border border-white/10 select-none uppercase">
            IS Compliance Audited
          </span>
        </div>

      </div>
    </div>
  );
}
