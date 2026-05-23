import { useState, useEffect } from 'react';
import { QuoteItem, Product } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import BentoPortfolio from './components/BentoPortfolio';
import ServiceSectors from './components/ServiceSectors';
import SpecsCalculator from './components/SpecsCalculator';
import TechnicalCredentials from './components/TechnicalCredentials';
import Footer from './components/Footer';
import SpecsDialog from './components/SpecsDialog';
import QuoteRequestModal from './components/QuoteRequestModal';
import { ALL_PRODUCTS } from './data';
import { ShoppingBag, Check, Info } from 'lucide-react';

export default function App() {
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
    <div className="min-h-screen bg-surface font-sans text-on-surface flex flex-col antialiased">
      
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
      <main className="flex-grow">
        
        {/* 3. Hero Header block */}
        <Hero 
          onExploreClick={() => handleScrollToSection('portfolio-section')}
          onOpenEstimatorClick={() => handleScrollToSection('calculator-section')}
        />

        {/* Informative Quality notice */}
        <div className="bg-[#dee8ff] py-4 px-4 sm:px-6 lg:px-8 border-b border-outline-variant">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-primary text-xs font-mono font-bold">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-secondary shrink-0" />
              <span>LOGISTICS ALERT: Direct-factory logistics channels active to Maharashtra (Dhule site corridors) &amp; Madhya Pradesh.</span>
            </div>
            <span className="bg-primary text-white text-[10px] px-2.5 py-1 tracking-widest uppercase shrink-0">
              MSME ID certified
            </span>
          </div>
        </div>

        {/* 4. Bento Portfolio Grid */}
        <BentoPortfolio 
          onSelectProduct={(p) => setActiveInspectProduct(p)}
          onSelectProductById={(id) => {
            const matched = ALL_PRODUCTS.find(p => p.id === id);
            if (matched) setActiveInspectProduct(matched);
          }}
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
      <Footer />

      {/* Floating action quote draft reminder */}
      {quoteItems.length > 0 && !quoteModalOpen && (
        <button 
          onClick={() => setQuoteModalOpen(true)}
          className="fixed bottom-6 right-6 z-30 bg-[#fe6b00] text-white p-4 uppercase font-mono font-black text-xs tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-primary transition-all duration-300 transform hover:scale-105"
        >
          <ShoppingBag className="w-5 h-5 animate-bounce" />
          <span>Active RFQ ({quoteItems.length})</span>
        </button>
      )}

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

    </div>
  );
}
