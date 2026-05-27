import { useState, useEffect } from 'react';
import { QuoteItem, Product } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import BentoPortfolio from './components/BentoPortfolio';
import ProductComparer from './components/ProductComparer';
import ServiceSectors from './components/ServiceSectors';
import SpecsCalculator from './components/SpecsCalculator';
import TechnicalCredentials from './components/TechnicalCredentials';
import Footer from './components/Footer';
import SpecsDialog from './components/SpecsDialog';
import QuoteRequestModal from './components/QuoteRequestModal';
import AIChatbot from './components/AIChatbot';
import Preloader from './components/Preloader';
import { ALL_PRODUCTS } from './data';
import { ShoppingBag, Check, Info, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // Preloader tracking state
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  // Quote basket state management
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  
  // Inspect dialog state
  const [activeInspectProduct, setActiveInspectProduct] = useState<Product | null>(null);
  
  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  
  // Scroll progress state
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Scroll monitoring logic
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Deep-link direct catalog verification checker
  useEffect(() => {
    if (isPreloading) return;
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product') || window.location.hash.replace('#', '');
    if (prodId) {
      const match = ALL_PRODUCTS.find(p => p.id === prodId);
      if (match) {
        setActiveInspectProduct(match);
      }
    }
  }, [isPreloading]);

  // Handlers for Quote Basket Action
  const handleAddProductToQuote = (product: Product) => {
    const newItem: QuoteItem = {
      id: `${product.id}-${Date.now()}`,
      productName: product.name,
      category: product.category,
      details: `${product.specs.standard || 'General Spec'}, Grade: ${product.specs.material || 'Standard'}`,
      quantity: 100 // Default to 100 meters
    };
    setQuoteItems((prev) => [...prev, newItem]);
  };

  const handleCustomBOQAdd = (boqItem: {
    productName: string;
    category: string;
    details: string;
    quantity: number;
    weightEstimate: number;
  }) => {
    const newItem: QuoteItem = {
      id: `boq-${Date.now()}`,
      productName: boqItem.productName,
      category: boqItem.category,
      details: boqItem.details,
      quantity: boqItem.quantity,
      weightEstimate: boqItem.weightEstimate
    };
    setQuoteItems((prev) => [...prev, newItem]);
  };

  const handleRemoveQuoteItem = (itemId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearQuoteBasket = () => {
    setQuoteItems([]);
  };

  // Safe trigger for explore scroll
  const handleScrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isPreloading ? (
        <Preloader key="preloader" onComplete={() => setIsPreloading(false)} />
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="min-h-screen bg-surface font-sans text-on-surface flex flex-col antialiased overflow-x-hidden"
        >
          
          {/* 1. Scroll Progress Indicator bar */}
          <div 
            className="fixed top-0 left-0 h-1.5 bg-secondary-container z-50 transition-all duration-75 origin-left"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* 2. Top Navigation header */}
          <Header 
            onSearchOpenSpecs={(p) => setActiveInspectProduct(p)}
            onOpenQuoteModal={() => setQuoteModalOpen(true)}
            quoteCount={quoteItems.length}
          />

          {/* Main Body block */}
          <main className="flex-grow animate-[fadeIn_0.8s_ease-out]">
            
            {/* 3. Hero Header block */}
            <Hero 
              onExploreClick={() => handleScrollToSection('portfolio-section')}
              onOpenEstimatorClick={() => handleScrollToSection('calculator-section')}
            />

            {/* Subtle, Full-Width Custom Section Divider */}
            <div className="w-full relative py-6 overflow-hidden select-none z-10 animate-[fadeIn_1.4s_ease-out]">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[#e1dad2]/60" />
              </div>
              <div className="relative flex justify-center">
                <div className="bg-[#faf7f3] px-4 py-1 text-[8px] font-mono tracking-[0.25em] text-[#8b7355]/80 uppercase font-bold border border-[#e1dad2] rounded-full shadow-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#8b7355]" />
                  Quality Standards Division
                  <span className="w-1 h-1 rounded-full bg-[#8b7355]" />
                </div>
              </div>
            </div>

            {/* Informative Quality notice - Minimalist and Clean */}
            <div className="px-4 sm:px-6 lg:px-8 mt-2 mb-2 font-sans relative z-20 animate-[fadeIn_1.2s_ease-out]">
              <div className="max-w-7xl mx-auto bg-[#faf7f3]/80 border border-[#e1dad2] px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#8b7355] shrink-0" />
                  <p className="text-[#5c554e] text-left">
                    <span className="text-[#8b7355] font-bold mr-1.5 font-mono uppercase tracking-wider text-[10px]">Logistics:</span>
                    Direct supply operational to Maharashtra, Madhya Pradesh, and adjacent municipalities.
                  </p>
                </div>
                <div className="flex items-[#8b7355] items-center gap-2 shrink-0 select-none">
                  <span className="text-[8px] text-[#8b7355] font-mono border border-[#8b7355]/20 px-2 py-0.5 uppercase tracking-wider font-bold rounded">
                    MSME Registered
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Bento Portfolio Grid */}
            <BentoPortfolio 
              onSelectProduct={(p) => setActiveInspectProduct(p)}
              onAddProductToQuote={handleAddProductToQuote}
              onSelectProductById={(id) => {
                const matched = ALL_PRODUCTS.find(p => p.id === id);
                if (matched) setActiveInspectProduct(matched);
              }}
            />

            {/* 4.1 Side-by-Side Product Specifications Comparison Table */}
            <ProductComparer 
              onAddToQuote={handleAddProductToQuote}
              onSelectProduct={(p) => setActiveInspectProduct(p)}
            />

            {/* 5. Strategic service sectors map checklist */}
            <ServiceSectors />

            {/* 6. Estimation Calculator for Procurement Officers */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <SpecsCalculator onAddToQuote={handleCustomBOQAdd} />
            </section>

            {/* 7. Audited technical credentials banner */}
            <TechnicalCredentials onOpenQuoteModal={() => setQuoteModalOpen(true)} />

          </main>

          {/* 8. Structural footer contacts block */}
          <Footer onOpenQuoteModal={() => setQuoteModalOpen(true)} />

          {/* 8.1. Premium Hita AI Procurement & Pipeline Assistant */}
          <AIChatbot />

          {/* Floating action quote draft reminder (Stacked beautifully above the WhatsApp button) */}
          {quoteItems.length > 0 && !quoteModalOpen && (
            <button 
              onClick={() => setQuoteModalOpen(true)}
              className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-30 bg-[#fe6b00] text-white p-3.5 sm:p-4 uppercase font-mono font-black text-[10px] sm:text-xs tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-primary transition-all duration-300 transform hover:scale-105"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 animate-bounce" />
              <span>Active RFQ ({quoteItems.length})</span>
            </button>
          )}

          {/* Floating persistent WhatsApp chat button for instant sales assistance */}
          <a 
            href="https://wa.me/917263014111?text=Hello%20Hitanshi%20Trading%20Group!%20I%20am%20interested%20in%20a%20pipeline%20or%20HDPE%20procurement%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-30 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 sm:p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group"
            title="Chat on WhatsApp with Instant Sales Desk"
          >
            <span className="absolute -left-36 bg-black/80 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              Instant Sales Chat
            </span>
            <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
            <MessageCircle className="w-6 h-6 text-white" />
          </a>

          {/* Modal overlays */}
          {/* 9. Tech Specs datasheet modal */}
          {activeInspectProduct && (
            <SpecsDialog 
              product={activeInspectProduct}
              onClose={() => setActiveInspectProduct(null)}
              onAddToQuoteClick={handleAddProductToQuote}
            />
          )}

          {/* 10. Quote parameters desk modal */}
          {quoteModalOpen && (
            <QuoteRequestModal 
              onClose={() => setQuoteModalOpen(false)}
              items={quoteItems}
              onRemoveItem={handleRemoveQuoteItem}
              onClearItems={handleClearQuoteBasket}
            />
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
