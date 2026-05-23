import { ArrowRight, Zap, Award, CheckCircle } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenEstimatorClick: () => void;
}

export default function Hero({ onExploreClick, onOpenEstimatorClick }: HeroProps) {
  return (
    <header className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 industrial-grid border-b border-outline-variant bg-surface overflow-hidden">
      
      {/* Absolute technical aesthetic grids */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#cfdaf2]/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
        
        {/* Left column info */}
        <div className="w-full lg:w-3/5 text-left space-y-6">
          
          {/* Badge indicator */}
          <div className="inline-flex items-center bg-secondary text-white px-3.5 py-1.5 select-none">
            <Award className="w-4 h-4 mr-1.5 text-white" />
            <span className="font-sans text-[10px] tracking-[0.25em] font-bold uppercase">
              Certified Industrial Supplier
            </span>
          </div>

          {/* Main Title Typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-none font-serif text-primary">
            <span className="italic block font-light">22.80 Lakh Meter</span>
            <span className="font-bold not-italic text-secondary block mt-2">
              Infrastructure Pipes
            </span>
          </h1>

          {/* Detailed Paragraph */}
          <p className="text-sm sm:text-base text-on-surface-variant/80 max-w-2xl leading-relaxed font-sans font-light tracking-wide">
            Manufacturer. Wholesaler. Trader. Delivering unyielding structural permanence for state-level infrastructure grids. We couple refined technical precision with HDPE, MDPE, PVC, and certified fluid pumping systems.
          </p>

          <div className="w-24 h-px bg-[#8b7355] my-2"></div>

          {/* Buttons and Info block */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            
            {/* Smooth transition buttons */}
            <button
              onClick={onExploreClick}
              className="bg-primary hover:bg-secondary text-white border border-transparent px-8 py-4 font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer rounded-none flex items-center"
            >
              Explore Catalogue
              <ArrowRight className="ml-2.5 w-4 h-4" />
            </button>

            {/* Rapid Supply box */}
            <div className="flex items-center gap-3 px-6 py-3.5 bg-surface-container border border-outline-variant flex-1 sm:flex-none">
              <div className="p-2 bg-secondary text-white rounded-none flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-sans tracking-[0.25em] uppercase text-on-surface-variant font-extrabold leading-none">
                  Rapid Supply
                </p>
                <p className="text-xs font-bold text-primary truncate tracking-wide mt-1">
                  Corporate Tariff
                </p>
              </div>
            </div>

          </div>

          {/* Project statistics summary grid */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-xl border-t border-outline-variant">
            <div className="flex flex-col">
              <p className="text-3xl sm:text-4xl font-serif italic text-primary leading-none">22.8<span className="text-lg sm:text-2xl not-italic font-normal">L+</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Meters Shipped</p>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl sm:text-4xl font-serif italic text-primary leading-none">1,200<span className="text-lg sm:text-2xl not-italic font-normal">+</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Active Grids</p>
            </div>
            <div className="flex flex-col">
              <p className="text-3xl sm:text-4xl font-serif italic text-primary leading-none">100<span className="text-lg sm:text-2xl not-italic font-normal">%</span></p>
              <p className="text-[9px] text-[#8b7355] font-sans font-bold uppercase tracking-[0.2em] mt-2">Tested Standards</p>
            </div>
          </div>

        </div>

        {/* Right column graphic with responsive layered borders */}
        <div className="w-full lg:w-2/5 flex justify-center">
          <div className="relative group w-full max-w-md">
            
            {/* Background design elements */}
            <div className="absolute -inset-1.5 bg-[#8b7355]/20 opacity-20 blur-md transition duration-1000 group-hover:opacity-35" />
            
            {/* The main picture with robust framing */}
            <div className="relative bg-white border-[12px] border-white shadow-xl overflow-hidden aspect-square">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Stacked high-density industrial polyethylene HDPE pipes highlighting professional corporate infrastructure scale" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsVXsOK9QNcE9LoVICY6kIbX0VhSLtfhD9eIpFkI2bufpiCI1IuZBOYJKSYVQgLu5SUhX0JtqH_IkX9WQTa-08X-HEIqvw-52hJ5N4hU8mH11-OP186WYA419uxfDzSgRA2CPBj4d4BAa7finzOzdN_t8IIujjlDDXk16G5lY-SzD2BUS1X06Zq6dp69ows1sxCUlb0LXJE-guudNWpTwIQLQhhVk_QYpUF67cjEm3vwDTuaQr24_JoRoDZUTxZCDUKxdnxUkwMw"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay quality indicator badge */}
              <div className="absolute bottom-4 left-4 bg-primary text-white p-3 flex items-center gap-2 max-w-xs shadow-lg font-sans">
                <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span className="text-[9px] leading-tight font-sans font-bold tracking-[0.25em] uppercase">
                  Batch Code #HDPE-9001
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
