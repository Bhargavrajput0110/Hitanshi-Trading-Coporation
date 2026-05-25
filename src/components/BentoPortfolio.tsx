import { useState } from 'react';
import { Settings2, ArrowRight, Droplets, Wrench, Sparkles } from 'lucide-react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';
import { motion } from 'motion/react';

interface BentoPortfolioProps {
  onSelectProduct: (product: Product) => void;
  onSelectProductById: (id: string) => void;
}

export default function BentoPortfolio({ onSelectProduct, onSelectProductById }: BentoPortfolioProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Extract specific products to place them in their respective grid layouts
  const hdpeProduct = ALL_PRODUCTS.find(p => p.id === 'hdpe-pipes');
  const motorProduct = ALL_PRODUCTS.find(p => p.id === 'industrial-motors');
  const pvcProduct = ALL_PRODUCTS.find(p => p.id === 'pvc-pipes');
  const tankProduct = ALL_PRODUCTS.find(p => p.id === 'water-tanks');

  return (
    <section id="portfolio-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-on-surface">
      
      {/* Grid Header with glowing accent */}
      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b7355] font-sans font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-secondary animate-pulse" /> Direct-Wholesale Inventory Catalog
          </span>
          <h2 className="text-3xl sm:text-5xl font-light font-serif tracking-tight text-primary mt-1">Industrial Product <span className="italic block sm:inline">Portfolio</span></h2>
          <div className="h-[2px] w-24 bg-secondary mt-3" />
        </div>
        <p className="text-secondary/80 font-mono text-[10px] uppercase tracking-[0.2em] font-extrabold bg-[#8b7355]/5 px-3 py-1 border border-secondary/15">
          Standardized Supply &amp; Equipment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 1. HDPE & MDPE Pipes (Large, col-span-8) */}
        {hdpeProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            onMouseEnter={() => setHoveredCard('hdpe-pipes')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProduct(hdpeProduct)}
            className="md:col-span-8 group relative overflow-hidden bg-primary p-8 min-h-[420px] flex flex-col justify-end border border-primary/20 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Visual background Image with responsive filter overlays */}
            <div className="absolute inset-0 opacity-45 group-hover:scale-[1.03] transition-transform duration-700">
              <img 
                className="w-full h-full object-cover" 
                alt="Technical close-up of HDPE pipelines project trench installation" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClqbmLg_6e5MBqCAzpxhTip_iv2gq5QwnIqaUdoRFurA-nKRlNskQ9hmCN1OCZ4i14n64syOAAgtGwjJhpXYkDKYSOL-IYU_xePi-aNnw732okGIGMpw3gLs1OrIOGJXAlc8cc36wbjSKYY5Z95N01i53hQgwy6ebl2LnjtAPJUxJx-tQq1zQUF_3sH7RtUDZTa0gXSqZxIz-F_wxkvUN24YFzxPaC1dZ1QotbToA1pSX5-De8j-BH02dDKeBVwmhfUYdNFO_hUg"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Absolute gradient overlay to maintain high contrast for the text */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-transparent opacity-95" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#8b7355] text-white text-[9px] font-sans font-bold tracking-[0.2em] px-3 py-1 uppercase inline-block">
                  Tender Grade Standard
                </span>
                <span className="text-[10px] font-mono text-white/50 tracking-wider">IS 4984 CERTIFIED</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-light font-serif italic text-white tracking-tight">HDPE &amp; MDPE Pipes</h3>
              <p className="text-xs sm:text-sm text-surface-dim max-w-xl font-sans font-light tracking-wide leading-relaxed">
                Manufacturer of high-stability piping systems for underground potable water grids and state gas schemes, secured by precise electrofusion welding techniques.
              </p>
              
              {/* Expand details action bar */}
              <div className="flex items-center gap-3">
                <button
                  id="toggle-hdpe-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(expandedCard === 'hdpe-pipes' ? null : 'hdpe-pipes');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase text-secondary hover:text-white border border-[#8b7355]/30 bg-[#8b7355]/5 hover:bg-[#8b7355]/20 transition-all rounded-none select-none shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-secondary animate-pulse shrink-0" />
                  {expandedCard === 'hdpe-pipes' || hoveredCard === 'hdpe-pipes' ? 'Quick Specs Added' : 'Expand Details'}
                </button>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Dynamic specifications list on hover or manual expanded click */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: (expandedCard === 'hdpe-pipes' || hoveredCard === 'hdpe-pipes') ? 'auto' : 0, 
                  opacity: (expandedCard === 'hdpe-pipes' || hoveredCard === 'hdpe-pipes') ? 1 : 0
                }}
                className="overflow-hidden"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="w-full text-white/95 font-sans text-xs border-t border-white/10 pt-4 mt-1 font-light">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/60">Standard:</span>
                      <span className="font-semibold">{hdpeProduct.specs.standard}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-white/60">Pressure:</span>
                      <span className="font-semibold">{hdpeProduct.specs.pressure}</span>
                    </div>
                    <div className="flex justify-between border-b/0 border-white/5">
                      <span className="text-white/60">Applications:</span>
                      <span className="font-semibold">{hdpeProduct.specs.application}</span>
                    </div>
                    <div className="flex justify-between border-b/0 border-white/5">
                      <span className="text-white/60">Material:</span>
                      <span className="font-semibold">{hdpeProduct.specs.material}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action indicator */}
              <div className="pt-3 flex items-center justify-between text-white text-xs font-sans tracking-[0.15em] border-t border-white/5 mt-4">
                <span className="uppercase font-bold border-b border-secondary/40 pb-1 group-hover:border-secondary transition-all cursor-pointer">
                  Inspect Technical Sheet
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 text-secondary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Industrial Motors (col-span-4) */}
        {motorProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
            onMouseEnter={() => setHoveredCard('industrial-motors')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProduct(motorProduct)}
            className="md:col-span-4 bg-[#141416]/95 border border-[#8b7355]/20 p-6 md:p-8 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="p-3 bg-[#8b7355]/10 border border-[#8b7355]/25 text-secondary rounded-none w-fit inline-block">
                <Settings2 className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-light font-serif text-white leading-none">Industrial Motors</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-secondary mt-1.5">IS 12615 Approved</p>
              </div>
              <p className="text-white/70 font-sans font-light text-sm leading-relaxed mt-2">
                High-efficiency Floshakti premium electric motors crafted for continuous heavy Duty pumping schemes.
              </p>

              {/* Expand details action bar */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="toggle-motors-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(expandedCard === 'industrial-motors' ? null : 'industrial-motors');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase text-secondary hover:text-white border border-[#8b7355]/30 bg-[#8b7355]/5 hover:bg-[#8b7355]/20 transition-all rounded-none select-none shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-secondary animate-pulse shrink-0" />
                  {expandedCard === 'industrial-motors' || hoveredCard === 'industrial-motors' ? 'Quick Specs Added' : 'Expand Details'}
                </button>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Dynamic details drawer */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: (expandedCard === 'industrial-motors' || hoveredCard === 'industrial-motors') ? 'auto' : 0, 
                  opacity: (expandedCard === 'industrial-motors' || hoveredCard === 'industrial-motors') ? 1 : 0
                }}
                className="overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <div className="w-full text-white/90 font-sans text-xs border-t border-white/10 pt-3 space-y-2 font-light">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Standard:</span>
                    <span className="font-semibold text-white/95">{motorProduct.specs.standard}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Duty Cycle:</span>
                    <span className="font-semibold text-white/95">{motorProduct.specs.durability}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Efficiency:</span>
                    <span className="font-semibold text-[#8b7355]">{motorProduct.specs.efficiency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Shaft OD:</span>
                    <span className="font-semibold text-white/95">{motorProduct.specs.diameterRange}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3">
                <span className="font-sans text-[10px] tracking-wide font-bold uppercase text-white/50">Efficiency Class</span>
                <span className="text-secondary font-sans font-bold tracking-[0.1em] text-[10px] bg-secondary/10 px-2 py-0.5 border border-secondary/20 select-none">
                  IE3 / IE4 Premium
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(motorProduct);
                }}
                className="w-full py-3 bg-[#8b7355] hover:bg-white hover:text-primary text-white font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-350 rounded-none cursor-pointer"
              >
                Inspect specs
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. PVC Infrastructure (col-span-4) */}
        {pvcProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -4 }}
            onMouseEnter={() => setHoveredCard('pvc-pipes')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProduct(pvcProduct)}
            className="md:col-span-4 bg-[#141416]/95 border border-[#8b7355]/20 p-6 md:p-8 flex flex-col justify-between cursor-pointer hover:shadow-2xl transition-all duration-300 group shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-light font-serif text-white leading-none">PVC Conduit</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-secondary mt-1.5">uPVC Structural</p>
                </div>
                <Wrench className="text-white/40 group-hover:text-secondary transition-colors w-5 h-5" />
              </div>
              <p className="text-white/70 font-sans font-light text-sm leading-relaxed">
                Rigid uPVC solutions for drainage pipelines, chemical conduits, and cable protection arrays.
              </p>

              {/* Expand details action bar */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  id="toggle-pvc-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(expandedCard === 'pvc-pipes' ? null : 'pvc-pipes');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase text-secondary hover:text-white border border-[#8b7355]/30 bg-[#8b7355]/5 hover:bg-[#8b7355]/20 transition-all rounded-none select-none shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-secondary animate-pulse shrink-0" />
                  {expandedCard === 'pvc-pipes' || hoveredCard === 'pvc-pipes' ? 'Quick Specs Added' : 'Expand Details'}
                </button>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Dynamic details drawer */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: (expandedCard === 'pvc-pipes' || hoveredCard === 'pvc-pipes') ? 'auto' : 0, 
                  opacity: (expandedCard === 'pvc-pipes' || hoveredCard === 'pvc-pipes') ? 1 : 0
                }}
                className="overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                <div className="w-full text-white/90 font-sans text-xs border-t border-white/10 pt-3 space-y-2 font-light">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Standard:</span>
                    <span className="font-semibold text-white/95">{pvcProduct.specs.standard}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Class Limit:</span>
                    <span className="font-semibold text-white/95">{pvcProduct.specs.pressure}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/50">Durability:</span>
                    <span className="font-semibold text-white/95">Ground Burial Shield</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">OD Range:</span>
                    <span className="font-semibold text-[#8b7355]">{pvcProduct.specs.diameterRange}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="overflow-hidden border border-white/5 aspect-video relative">
                <img 
                  className="w-full h-full object-cover filter contrast-110 saturate-[0.8] brightness-90 group-hover:scale-[1.03] duration-700 transition-all" 
                  alt="Stylized PVC structure tubes" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKdEjBPdoHm5jHubEUWaRop3CiUm-2afLvqCsmzwkZNgN59UN60tB0mjgATzRpuuiKrrplQsBPSUFj22F-k0bBym1tp9WK9GFOJPKprxvtnbrHKAiGDPX_cbhJvb212NiG8leANJXuEbgorsc1Q7L3v-4TGF6Qz02yFpK0FPgxwbHZiaSDoZAiegKftuI3mMRb03L7GRf8XqFCs09XZiKPTMrvSCCY8br000POxGDz3-TbMojA4sTBfUdMj3QWX6DvOwMZivsaFg"
                  referrerPolicy="no-referrer"
                />
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4 }}
            onMouseEnter={() => setHoveredCard('water-tanks')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProduct(tankProduct)}
            className="md:col-span-8 bg-[#8b7355] text-white p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Absolute Water Drop Vector Icon Accent on bottom right */}
            <div className="absolute right-0 bottom-0 opacity-15 translate-x-1/4 translate-y-1/4 pointer-events-none select-none">
              <Droplets className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 max-w-xl space-y-4">
              <span className="bg-[#111] text-[#eae5df] text-[9px] font-sans font-bold tracking-[0.2em] px-3.5 py-1.5 uppercase inline-block border border-white/5">
                Bulk Storage Standard
              </span>
              <h3 className="text-3xl sm:text-4xl font-light font-serif tracking-tight leading-tight">Bulk Liquid Storage Tanks</h3>
              <p className="text-sm text-[#fdfcfb]/90 font-sans font-light tracking-wide leading-relaxed">
                Heavy-duty rotational molded multilayer reservoirs engineered for high-volume municipal supply lines and private industrial networks.
              </p>

              {/* Expand details action bar */}
              <div className="flex items-center gap-2 pt-1 max-w-xl">
                <button
                  id="toggle-tanks-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedCard(expandedCard === 'water-tanks' ? null : 'water-tanks');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase text-white hover:text-white border border-white/30 bg-[#111]/10 hover:bg-[#111]/30 transition-all rounded-none select-none shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-white animate-pulse shrink-0" />
                  {expandedCard === 'water-tanks' || hoveredCard === 'water-tanks' ? 'Quick Specs Added' : 'Expand Details'}
                </button>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Dynamic specifications list on hover or manual expanded click */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: (expandedCard === 'water-tanks' || hoveredCard === 'water-tanks') ? 'auto' : 0, 
                  opacity: (expandedCard === 'water-tanks' || hoveredCard === 'water-tanks') ? 1 : 0
                }}
                className="overflow-hidden"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="w-full text-white/95 font-sans text-xs border-t border-white/10 pt-4 mt-1 font-light">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/70">Standard:</span>
                      <span className="font-semibold">{tankProduct.specs.standard}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-1">
                      <span className="text-white/70">Layers:</span>
                      <span className="font-semibold">{tankProduct.specs.layers}</span>
                    </div>
                    <div className="flex justify-between border-b/0 border-white/10">
                      <span className="text-white/70">Material Grade:</span>
                      <span className="font-semibold">{tankProduct.specs.grade}</span>
                    </div>
                    <div className="flex justify-between border-b/0 border-white/10">
                      <span className="text-white/70">Durability Limit:</span>
                      <span className="font-semibold">{tankProduct.specs.durability}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-2.5">
              <span className="px-4 py-1.5 bg-[#4e402e] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/5">
                Triple Layer Carbon Shield
              </span>
              <span className="px-4 py-1.5 bg-[#4e402e] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/5">
                100% UV Stabilized
              </span>
              <span className="px-4 py-1.5 bg-[#4e402e] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/5">
                Food Grade LLDPE
              </span>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
