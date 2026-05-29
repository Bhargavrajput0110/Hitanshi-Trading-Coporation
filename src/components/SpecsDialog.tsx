import { useState } from 'react';
import { X, CheckCircle2, FileText, Download, Share2, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface SpecsDialogProps {
  product: Product;
  onClose: () => void;
  onAddToQuoteClick?: (product: Product) => void;
}

export default function SpecsDialog({ product, onClose, onAddToQuoteClick }: SpecsDialogProps) {
  const [zoomState, setZoomState] = useState({ x: 50, y: 50, isZoomed: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomState({ x, y, isZoomed: true });
  };

  const handleMouseLeave = () => {
    setZoomState({ x: 50, y: 50, isZoomed: false });
  };

  // Let's create a print handler to allow generating a PDF locally
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative bg-surface-lowest border border-outline-variant w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] text-on-surface"
        id="print-area"
      >
        {/* Editorial Accent Line */}
        <div className="h-1 bg-secondary" />
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-outline-variant">
          <div>
            <div className="inline-flex items-center bg-secondary text-white text-[9px] font-sans font-bold px-3 py-1 mb-2 tracking-[0.2em] uppercase">
              {product.specs.standard || 'Industrial Standard'}
            </div>
            <h2 className="text-2xl font-light font-serif tracking-tight text-primary">
              {product.technicalDetails.title}
            </h2>
            <p className="text-xs text-on-surface-variant/80 mt-1 font-sans font-light">
              Technical Datasheet | Hitanshi Trading Corporation
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-none transition-colors text-on-surface hover:text-secondary focus:outline-none cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 font-sans">
          
          {/* Top Info section & image side by side */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {product.image && (
              <div 
                className="md:col-span-5 h-48 md:h-48 md:max-h-[220px] rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm relative shrink-0 cursor-zoom-in group select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.02] transition-transform duration-75 ease-out" 
                  style={{
                    transform: zoomState.isZoomed ? 'scale(2.5)' : 'scale(1)',
                    transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
                  }}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual HUD overlay indicating status */}
                <div className="absolute top-2.5 right-2.5 bg-[#121216]/90 border border-white/10 px-2 py-1 rounded-lg text-[8px] font-mono font-bold tracking-wider text-white/90 shadow-lg pointer-events-none flex items-center gap-1.5 transition-all duration-200 group-hover:border-[#818cf8]/50">
                  <ZoomIn className={`w-3.5 h-3.5 transition-colors duration-200 ${zoomState.isZoomed ? 'text-[#818cf8] animate-pulse' : 'text-zinc-400'}`} />
                  <span>{zoomState.isZoomed ? 'MAGS 2.5X ACTIVE' : 'HOVER TO MAGNIFY'}</span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-[#121216]/65 border-t border-white/5 backdrop-blur-[2px] p-2.5 pointer-events-none">
                  <span className="text-[9px] font-mono text-white/90 font-bold uppercase tracking-wider">{product.name}</span>
                </div>
              </div>
            )}
            <div className={product.image ? 'md:col-span-7 flex flex-col justify-between' : 'md:col-span-12'}>
              <div className="space-y-3">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-secondary block">Segment Overview &amp; Duty Profile</span>
                <p className="text-xs sm:text-sm font-sans font-light text-on-surface-variant leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-2">
                {product.badge && (
                  <span className="text-[9px] font-mono font-bold uppercase bg-[#8b7355]/15 text-[#8b7355] border border-[#8b7355]/30 px-2.5 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/5 text-primary border border-outline-variant/30 px-2.5 py-1 rounded">
                  {product.category} Segment
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-1 rounded animate-pulse">
                  Govt Approved
                </span>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-low p-5 border border-outline-variant">
            <div>
              <span className="text-[9px] text-on-surface-variant/80 uppercase font-sans tracking-[0.15em] block mb-1">Standard</span>
              <p className="font-bold text-primary font-sans text-xs">{product.specs.standard || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[9px] text-on-surface-variant/80 uppercase font-sans tracking-[0.15em] block mb-1">Pressure Range</span>
              <p className="font-bold text-primary font-sans text-xs">{product.specs.pressure || 'Atmospheric'}</p>
            </div>
            <div>
              <span className="text-[9px] text-on-surface-variant/80 uppercase font-sans tracking-[0.15em] block mb-1">Material Grade</span>
              <p className="font-bold text-primary font-sans text-xs">{product.specs.material || 'Premium PVC/LLDPE'}</p>
            </div>
            <div>
              <span className="text-[9px] text-on-surface-variant/80 uppercase font-sans tracking-[0.15em] block mb-1">Size Range</span>
              <p className="font-bold text-primary font-sans text-xs">{product.specs.diameterRange || 'Heavy duty'}</p>
            </div>
          </div>

          {/* Table */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-3.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-secondary" />
              Dimensions &amp; Operating Margins
            </h3>
            <div className="border border-outline-variant overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-primary text-white font-sans text-[10px] uppercase tracking-[0.15em] border-b border-primary">
                    <th className="py-2.5 px-4 font-bold">Parameters / Property</th>
                    <th className="py-2.5 px-4 font-bold text-right">Value Specifications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-sans font-light">
                  {product.technicalDetails.table.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-lowest' : 'bg-surface-low'}>
                      <td className="py-2.5 px-4 text-primary font-medium">{row.label}</td>
                      <td className="py-2.5 px-4 text-on-surface-variant text-right font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engineering Advantages */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-3.5">
              Certified Structural Performance
            </h3>
            <ul className="space-y-3">
              {product.technicalDetails.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  <span className="flex-shrink-0 mt-0.5 text-secondary">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="font-sans font-light">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance stamps */}
          <div className="p-4 bg-surface-low border border-dashed border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase font-sans">Quality Compliance Stamped</p>
              <p className="text-xs text-on-surface-variant/80 font-sans font-light mt-0.5">Hydrostatic test batch approved. Sourced under Bureau of Indian Standards (BIS) supervision.</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-surface-lowest border border-outline-variant text-[9px] font-sans font-bold tracking-[0.1em]">IS 4984</span>
              <span className="px-2.5 py-1 bg-surface-lowest border border-outline-variant text-[9px] font-sans font-bold tracking-[0.1em]">ISO 9001</span>
              <span className="px-2.5 py-1 bg-surface-lowest border border-outline-variant text-[9px] font-sans font-bold tracking-[0.1em]">NABL</span>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-6 bg-surface-low border-t border-outline-variant flex flex-wrap gap-3 justify-end items-center">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-transparent border border-primary text-primary font-sans text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-primary hover:text-white transition-colors duration-300 flex items-center gap-2 cursor-pointer rounded-none"
          >
            <Download className="w-3.5 h-3.5" />
            Print Datasheet
          </button>
          
          {onAddToQuoteClick && (
            <button 
              onClick={() => {
                onAddToQuoteClick(product);
                onClose();
              }}
              className="px-5 py-2.5 bg-secondary text-white font-sans text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-primary transition-colors duration-300 cursor-pointer rounded-none"
            >
              Add to Quote Config
            </button>
          )}

          <button 
            onClick={onClose}
            className="px-4 py-2 hover:bg-surface-high font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-colors text-on-surface cursor-pointer rounded-none"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
