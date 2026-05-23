import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ShoppingBag, PhoneCall, BookOpen, Menu, X, ArrowRight } from 'lucide-react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';

interface HeaderProps {
  onSearchOpenSpecs: (product: Product) => void;
  onOpenQuoteModal: () => void;
  quoteCount: number;
}

export default function Header({ onSearchOpenSpecs, onOpenQuoteModal, quoteCount }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return ALL_PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.specs.standard && p.specs.standard.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  // Click outside listener for search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (p: Product) => {
    onSearchOpenSpecs(p);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo and Brand details */}
        <div className="flex items-center gap-3">
          <img 
            alt="Hitanshi Trading Corp Logo" 
            className="h-10 w-auto flex-shrink-0" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw7EaDABQfuIxIuBdtl-JCFFjOOZS8eu7ut-WGUGE6B8zwmpjm8vmvVMztfdp4agkVAjWD12CkBL-Ir1pBLBqMkVRkGKYBwt15ROo9pKgOr-KEyteksnKWxqnhsDlaoNRtgehhQHZtEe580PUAue0yFxTauhF5o7mW__WqncTlINJUYkqGMb8zZc1UBxMkNA-fXCqCNACM5tQ9o6Id5UxmkGzTH2j9s-Vm19O2i1zXs_RnqwGluqyQWP6SJekiU1gtqd_G0OGsyA"
            referrerPolicy="no-referrer"
          />
          <div className="leading-tight flex flex-col pt-0.5">
            <span className="font-serif italic font-medium text-xl md:text-2xl tracking-tight text-primary leading-none block">
              Hitanshi
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block leading-none mt-1">
              TRADING &amp; PUMP
            </span>
          </div>
        </div>

        {/* Middle navigation links - Desktop */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#" className="text-secondary font-bold border-b border-secondary pb-1 text-[11px] font-sans uppercase tracking-[0.2em]">
            Home
          </a>
          <a href="#portfolio-section" className="text-on-surface-variant hover:text-primary pt-0.5 transition-colors text-[11px] font-sans uppercase tracking-[0.2em] font-semibold">
            Products
          </a>
          <a href="#sectors-section" className="text-on-surface-variant hover:text-primary pt-0.5 transition-colors text-[11px] font-sans uppercase tracking-[0.2em] font-semibold">
            Projects
          </a>
          <a href="#calculator-section" className="text-on-surface-variant hover:text-primary pt-0.5 transition-colors text-[11px] font-sans uppercase tracking-[0.2em] font-semibold">
            Estimator
          </a>
          <a href="#footer-section" className="text-on-surface-variant hover:text-primary pt-0.5 transition-colors text-[11px] font-sans uppercase tracking-[0.2em] font-semibold">
            Contact
          </a>
        </div>

        {/* Search controls + Quote buttons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          
          {/* Search bar inside header */}
          <div ref={searchRef} className="hidden lg:relative lg:flex items-center bg-surface-container-low px-4 py-2 border border-outline-variant max-w-xs">
            <Search className="text-on-surface-variant w-4 h-4 mr-2" />
            <input 
              type="text"
              placeholder="Search Specifications..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-primary font-semibold w-40"
            />

            {/* Suggestions drop */}
            {showResults && filteredProducts.length > 0 && (
              <div className="absolute top-11 right-0 w-80 bg-white border border-primary shadow-xl z-50 p-2 divide-y divide-outline-variant/50 max-h-60 overflow-y-auto">
                <p className="text-[10px] font-mono font-bold text-secondary uppercase pb-1.5 px-2">Matched Tech Specs</p>
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="w-full text-left p-2 hover:bg-surface-container flex justify-between items-center transition-all cursor-pointer group"
                  >
                    <div>
                      <span className="text-xs font-bold text-primary block group-hover:text-secondary">{p.name}</span>
                      <span className="text-[9px] text-on-surface-variant font-mono">{p.specs.standard} | {p.specs.material}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}
            
            {showResults && searchTerm && filteredProducts.length === 0 && (
              <div className="absolute top-11 right-0 w-80 bg-white border border-primary shadow-xl z-50 p-3 text-center">
                <p className="text-xs text-on-surface-variant font-mono">No matching standards found for "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Interactive Request-a-Quote Basket counter */}
          <button 
            onClick={onOpenQuoteModal}
            className="relative p-2 hover:bg-surface-container transition-all flex items-center justify-center cursor-pointer text-primary"
            aria-label="View Inquiry basket"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            {quoteCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-container text-[10px] w-4.5 h-4.5 font-bold rounded-full flex items-center justify-center animate-pulse">
                {quoteCount}
              </span>
            )}
          </button>

          {/* GET QUOTE button */}
          <button 
            onClick={onOpenQuoteModal}
            className="bg-primary hover:bg-secondary text-white px-5 py-2.5 uppercase text-[10px] sm:text-xs font-sans font-bold tracking-[0.2em] transition-colors duration-300 cursor-pointer select-none rounded-none"
          >
            Get Quote
          </button>

          {/* Mobile menu trigger */}
          <button 
            className="md:hidden p-2 text-primary hover:bg-surface-container cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface p-4 space-y-4 animate-fadeIn">
          {/* Mobile search bar */}
          <div className="relative flex items-center bg-surface-container-low px-3 py-2 border border-outline-variant">
            <Search className="text-on-surface-variant w-4 h-4 mr-2" />
            <input 
              type="text"
              placeholder="Search specifications..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-primary font-semibold w-full"
            />
            {showResults && filteredProducts.length > 0 && (
              <div className="absolute top-11 left-0 right-0 bg-white border border-primary shadow-xl z-50 p-2 divide-y divide-outline-variant/50 max-h-56 overflow-y-auto">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleSelectProduct(p);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-surface-container flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-bold text-primary block">{p.name}</span>
                      <span className="text-[9px] text-on-surface-variant font-mono">{p.specs.standard}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 font-sans font-bold text-sm">
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-secondary py-1 text-primary-color"
            >
              Home
            </a>
            <a 
              href="#portfolio-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface-variant py-1 hover:text-primary"
            >
              Products
            </a>
            <a 
              href="#sectors-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface-variant py-1 hover:text-primary"
            >
              Projects
            </a>
            <a 
              href="#calculator-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface-variant py-1 hover:text-primary"
            >
              Estimator / BOQ
            </a>
            <a 
              href="#footer-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface-variant py-1 hover:text-primary"
            >
              Contact
            </a>
          </div>
          
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuoteModal();
            }}
            className="w-full bg-primary text-white py-3 font-bold uppercase text-xs tracking-wider font-mono cursor-pointer"
          >
            Digital Quote Desk ({quoteCount})
          </button>
        </div>
      )}
    </nav>
  );
}
