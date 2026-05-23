import { Settings2, ArrowRight, Droplets, Wrench, FileSearch, HelpCircle } from 'lucide-react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';

interface BentoPortfolioProps {
  onSelectProduct: (product: Product) => void;
  onSelectProductById: (id: string) => void;
}

export default function BentoPortfolio({ onSelectProduct, onSelectProductById }: BentoPortfolioProps) {
  // Extract specific products to place them in their respective grid layouts
  const hdpeProduct = ALL_PRODUCTS.find(p => p.id === 'hdpe-pipes');
  const motorProduct = ALL_PRODUCTS.find(p => p.id === 'industrial-motors');
  const pvcProduct = ALL_PRODUCTS.find(p => p.id === 'pvc-pipes');
  const tankProduct = ALL_PRODUCTS.find(p => p.id === 'water-tanks');

  return (
    <section id="portfolio-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-on-surface">
      
      {/* Grid Header */}
      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-outline-variant pb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight text-primary">Industrial Product <span className="italic block sm:inline">Portfolio</span></h2>
          <div className="h-px w-24 bg-secondary mt-3" />
        </div>
        <p className="text-[#8b7355] font-sans text-xs uppercase tracking-[0.2em] font-bold">
          Category: Equipment &amp; Supply
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 1. HDPE & MDPE Pipes (Large, col-span-8) */}
        {hdpeProduct && (
          <div 
            onClick={() => onSelectProduct(hdpeProduct)}
            className="md:col-span-8 group relative overflow-hidden bg-primary p-8 min-h-[400px] flex flex-col justify-end border border-primary cursor-pointer shadow-lg hover:shadow-xl transition-all duration-350"
          >
            {/* Visual background Image with responsive filter overlays */}
            <div className="absolute inset-0 opacity-45 group-hover:scale-105 transition-transform duration-700">
              <img 
                className="w-full h-full object-cover" 
                alt="Technical close-up of HDPE pipelines project trench installation" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClqbmLg_6e5MBqCAzpxhTip_iv2gq5QwnIqaUdoRFurA-nKRlNskQ9hmCN1OCZ4i14n64syOAAgtGwjJhpXYkDKYSOL-IYU_xePi-aNnw732okGIGMpw3gLs1OrIOGJXAlc8cc36wbjSKYY5Z95N01i53hQgwy6ebl2LnjtAPJUxJx-tQq1zQUF_3sH7RtUDZTa0gXSqZxIz-F_wxkvUN24YFzxPaC1dZ1QotbToA1pSX5-De8j-BH02dDKeBVwmhfUYdNFO_hUg"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Absolute gradient overlay to maintain high contrast for the text */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-85" />

            <div className="relative z-10 space-y-4">
              <span className="bg-[#8b7355] text-white text-[9px] font-sans font-bold tracking-[0.2em] px-3 py-1 uppercase inline-block">
                Tender Grade Standard
              </span>
              <h3 className="text-3xl font-light font-serif italic text-white tracking-tight">HDPE &amp; MDPE Pipes</h3>
              <p className="text-xs sm:text-sm text-surface-dim max-w-xl font-sans font-light tracking-wide leading-relaxed">
                Manufacturer of high-stability piping systems for underground potable water grids and state gas schemes, secured by precise electrofusion welding techniques.
              </p>
              
              {/* Overlay specification stats */}
              <div className="w-full text-white/95 font-sans text-xs border-t border-white/10 pt-4 mt-2 font-light">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span className="text-white/60">Standard:</span>
                    <span className="font-semibold">IS 4984 / 14333</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1">
                    <span className="text-white/60">Pressure:</span>
                    <span className="font-semibold">PN 2.5 to PN 20</span>
                  </div>
                  <div className="flex justify-between border-b/0 border-white/10">
                    <span className="text-white/60">Applications:</span>
                    <span className="font-semibold">Drinking Water / Gas</span>
                  </div>
                  <div className="flex justify-between border-b/0 border-white/10">
                    <span className="text-white/60">Durability:</span>
                    <span className="font-semibold">50+ Years (S1-Scale)</span>
                  </div>
                </div>
              </div>

              {/* Action indicator */}
              <div className="pt-3 flex items-center justify-between text-white text-xs font-sans tracking-[0.15em]">
                <span className="uppercase font-bold border-b border-secondary/40 pb-1 hover:border-white transition-all cursor-pointer">
                  Inspect Technical Sheet
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300 text-secondary" />
              </div>
            </div>
          </div>
        )}

        {/* 2. Industrial Motors (col-span-4) */}
        {motorProduct && (
          <div 
            onClick={() => onSelectProduct(motorProduct)}
            className="md:col-span-4 bg-surface-high border border-outline-variant p-6 md:p-8 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="p-3 bg-primary text-white rounded-none w-fit inline-block">
                <Settings2 className="w-8 h-8 text-[#eae5df]" />
              </div>
              <div>
                <h3 className="text-2xl font-light font-serif text-primary leading-none">Industrial Motors</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-secondary mt-1.5">IS 12615 Approved</p>
              </div>
              <p className="text-on-surface-variant font-sans font-light text-sm leading-relaxed mt-2">
                High-efficiency Floshakti premium electric motors crafted for continuous heavy Duty pumping schemes.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center bg-surface border border-outline-variant p-3">
                <span className="font-sans text-[10px] tracking-wide font-bold uppercase text-primary">Efficiency Class</span>
                <span className="text-secondary font-sans font-bold tracking-[0.1em] text-[10px] bg-secondary/5 px-2 py-0.5 border border-secondary/20 select-none">
                  IE3 / IE4 Premium
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProduct(motorProduct);
                }}
                className="w-full py-3 bg-primary hover:bg-[#8b7355] text-white font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 rounded-none cursor-pointer"
              >
                Inspect specs
              </button>
            </div>
          </div>
        )}

        {/* 3. PVC Infrastructure (col-span-4) */}
        {pvcProduct && (
          <div 
            onClick={() => onSelectProduct(pvcProduct)}
            className="md:col-span-4 bg-surface-low border border-outline-variant p-6 md:p-8 flex flex-col justify-between cursor-pointer hover:border-secondary hover:shadow-xl transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-light font-serif text-primary leading-none">PVC Conduit</h3>
                  <p className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-secondary mt-1.5">uPVC Structural</p>
                </div>
                <Wrench className="text-on-surface-variant group-hover:text-secondary transition-colors w-5 h-5" />
              </div>
              <p className="text-on-surface-variant font-sans font-light text-sm leading-relaxed">
                Rigid uPVC solutions for drainage pipelines, chemical conduits, and cable protection arrays.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="overflow-hidden border border-outline-variant aspect-video">
                <img 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                  alt="Stylized PVC structure tubes" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKdEjBPdoHm5jHubEUWaRop3CiUm-2afLvqCsmzwkZNgN59UN60tB0mjgATzRpuuiKrrplQsBPSUFj22F-k0bBym1tp9WK9GFOJPKprxvtnbrHKAiGDPX_cbhJvb212NiG8leANJXuEbgorsc1Q7L3v-4TGF6Qz02yFpK0FPgxwbHZiaSDoZAiegKftuI3mMRb03L7GRf8XqFCs09XZiKPTMrvSCCY8br000POxGDz3-TbMojA4sTBfUdMj3QWX6DvOwMZivsaFg"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-primary font-sans tracking-[0.15em] pt-2">
                <span className="font-bold border-b border-transparent group-hover:border-secondary transition-colors uppercase">
                  Download PVC Specs
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* 4. Storage Water Tanks (col-span-8) */}
        {tankProduct && (
          <div 
            onClick={() => onSelectProduct(tankProduct)}
            className="md:col-span-8 bg-[#8b7355] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-350"
          >
            {/* Absolute Water Drop Vector Icon Accent on bottom right */}
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none select-none">
              <Droplets className="w-96 h-96 text-white" />
            </div>

            <div className="relative z-10 max-w-xl space-y-4">
              <span className="bg-primary text-[#eae5df] text-[9px] font-sans font-bold tracking-[0.2em] px-3.5 py-1.5 uppercase inline-block border border-white/10">
                Bulk Storage Standard
              </span>
              <h3 className="text-3xl font-light font-serif tracking-tight leading-tight">Bulk Liquid Storage Tanks</h3>
              <p className="text-sm text-[#fdfcfb]/80 font-sans font-light tracking-wide leading-relaxed">
                Heavy-duty rotational molded multilayer reservoirs engineered for high-volume municipal supply lines and private industrial networks.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-2.5">
              <span className="px-4 py-1.5 bg-[#64523c] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/10">
                Triple Layer Carbon Shield
              </span>
              <span className="px-4 py-1.5 bg-[#64523c] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/10">
                100% UV Stabilized
              </span>
              <span className="px-4 py-1.5 bg-[#64523c] text-white text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-white/10">
                Food Grade LLDPE
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
