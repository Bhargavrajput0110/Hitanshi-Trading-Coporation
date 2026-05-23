import { CheckCircle2, ShoppingBag, MessageSquare, ShieldCheck, Award } from 'lucide-react';

interface TechnicalCredentialsProps {
  onOpenQuoteModal: () => void;
}

export default function TechnicalCredentials({ onOpenQuoteModal }: TechnicalCredentialsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative text-on-surface bg-surface">
      <div className="max-w-7xl mx-auto bg-surface-container border border-outline-variant p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Subtle graphic layout indicator background */}
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none select-none" />

        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#8b7355] text-white text-[9px] font-sans font-bold px-3 py-1 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            Rigorous Hydrostatic Audited
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-light font-serif tracking-tight text-primary leading-tight">
              Precision Engineering &amp; <span className="italic">Scale</span>
            </h3>
            <p className="text-sm md:text-base text-on-surface-variant/85 leading-relaxed mt-3 font-sans font-light">
              Our materials undergo rigorous certified testing and independent lab quality auditing to guarantee long-term operational resilience under heavy municipal pressure heads.
            </p>
          </div>

          {/* Grid checkmark specifications */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span className="font-sans text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                BIS CERTIFIED
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span className="font-sans text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                ISO 9001:2015
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span className="font-sans text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                NABL ACCREDITED
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span className="font-sans text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
                ISI MARKED
              </span>
            </div>
          </div>
        </div>

        {/* Dual Actions Side Column */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 w-full lg:w-auto xl:w-[480px]">
          
          {/* Best Price trigger */}
          <button
            onClick={onOpenQuoteModal}
            className="flex-1 bg-secondary text-white hover:bg-primary px-8 py-4.5 font-bold font-sans text-[10px] uppercase tracking-[0.2em] text-center transition-colors duration-300 flex items-center justify-center gap-2.5 cursor-pointer rounded-none"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            Get Best Tariff Price
          </button>

          {/* WhatsApp Direct quote compiler */}
          <button
            onClick={onOpenQuoteModal}
            className="flex-1 bg-primary text-white hover:bg-secondary px-8 py-4.5 font-bold font-sans text-[10px] uppercase tracking-[0.2em] text-center transition-colors duration-300 flex items-center justify-center gap-2.5 cursor-pointer rounded-none"
          >
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            WhatsApp Quote Draft
          </button>

        </div>

      </div>
    </section>
  );
}
