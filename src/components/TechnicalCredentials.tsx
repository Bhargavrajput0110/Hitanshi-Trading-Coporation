import { CheckCircle2, ShoppingBag, MessageSquare, ShieldCheck, Award } from 'lucide-react';

interface TechnicalCredentialsProps {
  onOpenQuoteModal: () => void;
}

export default function TechnicalCredentials({ onOpenQuoteModal }: TechnicalCredentialsProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative text-on-surface bg-surface">
      <div className="max-w-7xl mx-auto bg-white border border-outline-variant/60 shadow-xl shadow-secondary/5 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10 transition-all hover:shadow-2xl duration-500">
        
        {/* Subtle graphic layout indicator background */}
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-secondary/5 to-transparent pointer-events-none select-none" />

        <div className="max-w-xl text-left space-y-6">
          <div className="inline-flex items-center gap-1 bg-[#8b7355] text-white text-[8px] font-sans font-bold px-2.5 py-1 uppercase tracking-[0.15em] rounded-md">
            <ShieldCheck className="w-3 h-3 text-white" />
            Quality Audited
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-serif tracking-tight text-primary leading-tight font-semibold">
              Audited Quality Standards
            </h3>
            <p className="text-xs md:text-sm text-on-surface-variant/75 leading-relaxed mt-2 font-sans font-light">
              Our materials undergo certified hydrostatic testing to ensure long-term operational resilience under heavy municipal pressure heads.
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
            className="flex-1 bg-secondary text-white hover:bg-primary px-8 py-5 font-bold font-sans text-xs uppercase tracking-[0.2em] text-center transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer rounded-2xl shadow-md hover:translate-y-[-2px] hover:shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            Get Best Tariff Price
          </button>

          {/* WhatsApp Direct quote compiler */}
          <button
            onClick={onOpenQuoteModal}
            className="flex-1 bg-primary text-white hover:bg-secondary px-8 py-5 font-bold font-sans text-xs uppercase tracking-[0.2em] text-center transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer rounded-2xl shadow-md hover:translate-y-[-2px] hover:shadow-lg"
          >
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            WhatsApp Quote Draft
          </button>

        </div>

      </div>
    </section>
  );
}
