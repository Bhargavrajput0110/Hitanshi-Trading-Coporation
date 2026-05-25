import { useEffect, useRef } from 'react';
import { ArrowRight, Zap, Award, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isHovered: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 55;
    const connectionRadius = 125;

    // Use ResizeObserver to ensure the canvas is responsive
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
        initParticles(width, height);
      }
    });

    resizeObserver.observe(container);

    function initParticles(w: number, h: number) {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        const baseAlpha = Math.random() * 0.45 + 0.15;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.8 + 0.8,
          alpha: baseAlpha,
          baseAlpha
        });
      }
    }

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isHovered = mouseRef.current.isHovered;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw subtle micro digital grid background on hover
      if (isHovered) {
        const gridSpacing = 90;
        ctx.strokeStyle = 'rgba(139, 115, 85, 0.025)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let currentVx = p.vx;
        let currentVy = p.vy;

        if (isHovered) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const force = (220 - dist) / 220;
            currentVx += (dx / dist) * force * 0.18;
            currentVy += (dy / dist) * force * 0.18;
            p.alpha = Math.min(0.85, p.baseAlpha + force * 0.5);
          } else {
            p.alpha = p.baseAlpha;
          }
        } else {
          p.alpha = p.baseAlpha;
        }

        // Apply slight drag and drift
        p.x += currentVx;
        p.y += currentVy;

        // Wrap around boundaries
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;

        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        if (i % 3 === 0) {
          ctx.fillStyle = `rgba(139, 115, 85, ${p.alpha})`; // Brand secondary gold
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.65})`; // Clean light gray/white
        }
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionRadius) {
            const alpha = (1 - dist / connectionRadius) * 0.14 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 115, 85, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw dynamic stream connection to pointer
        if (isHovered) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.22;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(223, 218, 211, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

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
      className="relative pt-36 pb-28 px-4 sm:px-6 lg:px-8 border-b border-primary-container bg-[#0e0e0f] overflow-hidden"
    >
      
      {/* 2. Interactive Floating Data-Flow Engineering Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 select-none pointer-events-none opacity-40 transition-opacity duration-500 mix-blend-screen"
      />

      {/* 1. Immersive Atmospheric Backdrop Video with Motion Zoom-In & Gentle Pulse */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <motion.div 
          className="w-full h-full"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.38 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center filter contrast-125 brightness-90 saturate-[0.85]"
            poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e2d09eb0482dc437a3536785dc9&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-heavy-industry-factory-with-pipes-and-smoke-41712-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
        
        {/* Dynamic Multi-layered High-contrast Overlay (Deep gold highlights, charcoal washes, soft radial glow) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/95 via-[#0e0e0f]/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0f] via-transparent to-[#000000]/40 z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8b7355]/15 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
      </div>

      {/* Decorative Technical Digital Grid lines */}
      <div className="absolute inset-0 z-10 opacity-15 select-none pointer-events-none industrial-grid" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20 relative z-20">
        
        {/* Left Column Text & Infographics with staggered micro-entrances */}
        <div className="w-full lg:w-3/5 text-left space-y-6">
          
          {/* Elite Badge Indicator with Amber light indicator */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full select-none gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <Award className="w-3.5 h-3.5 text-secondary" />
            <span className="font-sans text-[9px] tracking-[0.25em] font-extrabold uppercase text-white/95">
              Certified Industrial Supplier
            </span>
          </motion.div>

          {/* Main Title Typography - Upgraded with premium high-contrast display styling */}
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-sans tracking-tight leading-none text-white font-extrabold uppercase"
            >
              <span className="font-serif italic font-light lowercase text-[#dfdad3] block leading-normal mt-1 border-l-2 border-secondary pl-4 normal-case text-3xl sm:text-4xl lg:text-5xl">
                22.80 Lakh Meter
              </span>
              <span className="font-sans font-black text-white block tracking-tighter text-4xl sm:text-5xl lg:text-6xl mt-3 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                Infrastructure Pipes
              </span>
            </motion.h1>
          </div>

          {/* Detailed Paragraph with elegant legibility */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed font-sans font-light tracking-wide pr-4"
          >
            Authorized Manufacturer, Wholesaler, and Government Contractor. Delivering unyielding structural permanence for state-level municipal water grids and gas networks. We couple certified laboratory precision with heavy-duty HDPE, MDPE, PVC conduits, and high-discharge Floshakti pumping networks.
          </motion.p>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-24 h-[2px] bg-secondary origin-left"
          ></motion.div>

          {/* Buttons and Estimation Tools panel */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            
            {/* Smooth glowing action buttons */}
            <button
              onClick={onExploreClick}
              className="bg-secondary hover:bg-white text-white hover:text-primary border border-secondary hover:border-white px-8 py-4 font-sans text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 cursor-pointer rounded-none flex items-center hover:scale-[1.02] shadow-lg shadow-secondary/10"
            >
              Explore Catalogue
              <ArrowRight className="ml-2.5 w-4 h-4" />
            </button>

            {/* Interactive Rapid Supply & Estimator action card */}
            <div 
              onClick={onOpenEstimatorClick}
              className="flex items-center gap-3.5 px-5 py-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-secondary/40 transition-all duration-300 cursor-pointer flex-1 sm:flex-none hover:scale-[1.01]"
              title="Click to Open Digital Estimator Tool"
            >
              <div className="p-2.5 bg-[#8b7355] text-white rounded-none flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="min-w-0 pr-3">
                <p className="text-[8px] font-sans tracking-[0.25em] uppercase text-white/45 font-black leading-none">
                  Rapid Calculator
                </p>
                <span className="text-xs font-bold text-white tracking-wide mt-1 inline-flex items-center gap-1">
                  BOQ Estimator <ChevronRight className="w-3 h-3 text-secondary" />
                </span>
              </div>
            </div>

          </motion.div>

          {/* Project statistics summary grid containing golden ratings */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-8 max-w-xl border-t border-white/10"
          >
            <div className="flex flex-col">
              <p className="text-2xl sm:text-4xl font-serif italic text-white leading-none">22.8<span className="text-base sm:text-xl not-italic font-normal text-secondary">L+</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Meters Shipped</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl sm:text-4xl font-serif italic text-white leading-none">1,200<span className="text-base sm:text-xl not-italic font-normal text-secondary">+</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Active Grids</p>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl sm:text-4xl font-serif italic text-white leading-none">100<span className="text-base sm:text-xl not-italic font-normal text-secondary">%</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Tested Batches</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column Grid graphic - High elegance image borders & layered glowing shadows */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full lg:w-2/5 flex justify-center"
        >
          <div className="relative group w-full max-w-md">
            
            {/* Background luxury glowing aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#8b7355] to-secondary rounded-none opacity-20 blur-xl transition duration-1000 group-hover:opacity-40" />
            
            {/* The main picture with majestic layered border frame */}
            <div className="relative bg-[#151517] border-[12px] border-[#222225] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden aspect-square">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Stacked high-density industrial polyethylene HDPE pipes highlighting professional corporate infrastructure scale" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsVXsOK9QNcE9LoVICY6kIbX0VhSLtfhD9eIpFkI2bufpiCI1IuZBOYJKSYVQgLu5SUhX0JtqH_IkX9WQTa-08X-HEIqvw-52hJ5N4hU8mH11-OP186WYA419uxfDzSgRA2CPBj4d4BAa7finzOzdN_t8IIujjlDDXk16G5lY-SzD2BUS1X06Zq6dp69ows1sxCUlb0LXJE-guudNWpTwIQLQhhVk_QYpUF67cjEm3vwDTuaQr24_JoRoDZUTxZCDUKxdnxUkwMw"
                referrerPolicy="no-referrer"
              />
              
              {/* Glossy gradient reflection panel on image hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Overlay quality indicator badge with animated spark */}
              <div className="absolute bottom-4 left-4 bg-primary/95 text-white p-3 flex items-center gap-2 max-w-xs shadow-2xl font-sans border border-white/5">
                <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span className="text-[9px] leading-tight font-sans font-bold tracking-[0.25em] uppercase text-white/90 inline-flex items-center gap-1">
                  Batch Code #HDPE-9001 <Sparkles className="w-2.5 h-2.5 text-secondary" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </header>
  );
}
