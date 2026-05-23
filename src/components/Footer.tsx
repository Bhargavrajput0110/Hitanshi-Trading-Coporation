import { useState, useEffect, useCallback } from 'react';
import { Globe, Mail, Phone, ChevronRight, Award, ChevronLeft, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

const testimonials = [
  {
    quote: "Hitanshi Trading Corp's IS 4984 certified HDPE pipes proved critical for our rugged pipeline layouts across Jalgaon district. Outstanding hydrostatic durability under complex, high municipal pressure grids.",
    author: "Shri R. K. Deshmukh",
    role: "Executive Engineer, MJP Division",
    project: "Jal Jeevan Mission (Rural Water Supply)",
    region: "Maharashtra",
    badge: "Jal Jeevan Approved"
  },
  {
    quote: "Floshakti Pumping Units and water infrastructure systems delivered on time despite steep geographical challenges. Impeccable engineering expertise with highly resilient heavy-duty discharge.",
    author: "Vikramaditya Singh",
    role: "Project Director",
    project: "Madhya Pradesh Jal Nigam Scheme",
    region: "Madhya Pradesh",
    badge: "Jal Nigam Tender"
  },
  {
    quote: "Our wholesale procurement of PVC & MDPE conduits with customized SDR ratings met strict lab audits. Outstanding logistical dispatch coordination and reliable operational backing.",
    author: "Ananya Iyer",
    role: "Lead Infrastructure Consultant",
    project: "Smart Municipal Water Grid Initiative",
    region: "Karnataka",
    badge: "Municipal Utility"
  }
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -50 : 50,
    opacity: 0
  })
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <footer id="footer-section" className="bg-primary text-white border-t border-[#8b7355]/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Testimonial Carousel Section */}
        <div id="testimonials-carousel" className="border-b border-white/10 pb-12 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 text-left">
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block">
                Civil Requisition Endorsements
              </span>
              <h4 className="text-xl md:text-2xl font-light font-serif text-white tracking-tight mt-1">
                Field Quality &amp; <span className="italic">Project Testimonials</span>
              </h4>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-colors cursor-pointer rounded-none text-white/50 hover:text-white"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-colors cursor-pointer rounded-none text-white/50 hover:text-white"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Testimonial Card */}
          <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-between min-h-[220px] text-left">
            {/* Absolute quote background watermark */}
            <div className="absolute top-2 right-4 text-white/[0.03] font-serif text-8xl pointer-events-none select-none">
              “
            </div>

            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full flex flex-col md:flex-row gap-6 justify-between items-stretch"
              >
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] bg-[#8b7355] text-white font-sans font-bold px-2.5 py-1 uppercase tracking-wider">
                      {testimonials[activeIndex].badge}
                    </span>
                    <span className="text-[10px] text-white/50 font-sans uppercase tracking-[0.1em]">
                      {testimonials[activeIndex].region} Division
                    </span>
                  </div>
                  
                  <p className="text-sm sm:text-base text-white/95 font-serif leading-relaxed italic pr-6">
                    "{testimonials[activeIndex].quote}"
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 min-w-[260px]">
                  <div className="inline-flex items-center gap-2 mb-2 text-secondary">
                    <Quote className="w-3.5 h-3.5 text-secondary fill-secondary/10" />
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-sans">Verified Delivery</span>
                  </div>
                  <p className="font-serif italic text-base text-white font-medium">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-[11px] text-white/50 font-sans tracking-wide mt-0.5">
                    {testimonials[activeIndex].role}
                  </p>
                  <p className="text-[10px] text-[#8b7355] font-sans font-bold mt-1.5 uppercase tracking-wider">
                    {testimonials[activeIndex].project}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-1 transition-all duration-300 rounded-none cursor-pointer ${
                  idx === activeIndex ? 'w-8 bg-[#8b7355]' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10 text-left">
          
          {/* Column 1: Company Profile (width 4 on large) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-serif italic font-medium text-2xl tracking-tight text-white block leading-none">
                Hitanshi
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block mt-1.5">
                TRADING &amp; PUMP
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-on-primary-container leading-relaxed font-sans font-light max-w-sm">
              Authorized Manufacturers and Wholesale Traders specializing in large-scale water and electrical infrastructure solutions.
            </p>

            {/* Micro-interaction Social Circle icons */}
            <div className="flex gap-3 pt-2">
              <a 
                href="https://wa.me/c/917263014111" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-all text-on-primary-container hover:text-white"
                aria-label="Official portal link"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="mailto:rajputbhargav001@gmail.com" 
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-all text-on-primary-container hover:text-white"
                aria-label="Email address direct link"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a 
                href="tel:+917263014111" 
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-all text-on-primary-container hover:text-white"
                aria-label="Direct dial phone option"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Products Links (width 2) */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-4">
              Products
            </h5>
            <ul className="space-y-2.5 text-xs text-on-primary-container font-sans font-light">
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  HDPE Pipes
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  MDPE Pipes
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  uPVC Pipes
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  Casing Pipes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Equipment links (width 2) */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-4">
              Equipment
            </h5>
            <ul className="space-y-2.5 text-xs text-on-primary-container font-sans font-light">
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  Industrial Motors
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  Water Tanks
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  Pumping Systems
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  Flow Gauges
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Address Contact info (width 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans">
              Contact Information
            </h5>
            
            <div className="space-y-3 text-xs text-on-primary-container leading-relaxed font-sans font-light">
              <p>
                <span className="font-semibold text-white block">Dhule Manufacturing Office:</span>
                Plot 42, MIDC Phase III, Dhule, Maharashtra
              </p>
              <p>
                <span className="font-semibold text-white block">Direct Desk Phone:</span>
                +91 72630 14111
              </p>
              <p>
                <span className="font-semibold text-white block">Official Dispatch Mail:</span>
                rajputbhargav001@gmail.com
              </p>
            </div>

            {/* Dhule Office Google Map / Fallback section */}
            <div className="overflow-hidden mt-3 shadow-md">
              {hasValidKey ? (
                <div className="w-full h-[140px] border border-white/10 relative">
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      defaultCenter={{ lat: 21.0117, lng: 74.7749 }} // MIDC Avadhan, Dhule approx coordinates
                      defaultZoom={14}
                      mapId="DEMO_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                      disableDefaultUI={true}
                      zoomControl={true}
                    >
                      <AdvancedMarker position={{ lat: 21.0117, lng: 74.7749 }} title="Hitanshi Manufacturing Office">
                        <Pin background="#8b7355" borderColor="#ffffff" glyphColor="#ffffff" scale={0.8} />
                      </AdvancedMarker>
                    </Map>
                  </APIProvider>
                </div>
              ) : (
                <div className="w-full h-[140px] bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center p-3 text-center select-none relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-[#8b7355]/20 flex items-center justify-center border border-[#8b7355]/40 text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-serif italic text-white/90">Plot 42, MIDC Phase III, Dhule</p>
                      <p className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">Google Maps Ready</p>
                    </div>
                    <p className="text-[9px] text-[#8b7355] leading-normal font-sans text-center max-w-[250px]">
                      Add <code className="bg-white/5 px-1 py-0.5 text-[8px] text-white">GOOGLE_MAPS_PLATFORM_KEY</code> to Secrets to load live radar mapping.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bureau markings and legal compliance statements */}
            <div className="p-4 bg-white/2 border border-white/10 flex items-center gap-3">
              <Award className="w-4 h-4 text-secondary flex-shrink-0 animate-pulse" />
              <p className="text-[10px] font-sans tracking-wide text-primary-fixed-dim leading-relaxed">
                Registered under MSME and DIC standards. Batch sample pressure reports certified under ISO 9001.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom footer credit bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-on-primary-container font-sans tracking-wide">
          <p className="text-center sm:text-left">
            © {currentYear} Hitanshi Trading Corporation &amp; Floshakti Pump. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white underline decoration-secondary transition-all">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white underline decoration-secondary transition-all">
              Terms of Supply
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
