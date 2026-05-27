import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Star, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Sparkles, 
  PhoneCall, 
  Info, 
  ThumbsUp, 
  ChevronDown, 
  Share2, 
  Tag, 
  Store 
} from 'lucide-react';
import { ALL_PRODUCTS } from '../data';
import { Product } from '../types';

interface AmazonCatalogProps {
  onAddProductToQuote: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenShare: (product: Product) => void;
}

export default function AmazonCatalog({ onAddProductToQuote, onSelectProduct, onOpenShare }: AmazonCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Pipes' | 'Motors' | 'Tanks'>('All');
  const [selectedDiameter, setSelectedDiameter] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [addedProductIds, setAddedProductIds] = useState<Record<string, boolean>>({});

  // Naive scenarios selector options
  const scenarios = [
    {
      id: 'drinking-water',
      title: '🚰 Village Drinking Water System',
      description: 'I need to connect fresh drinking water from well-pumps to domestic village faucets.',
      recommendation: 'hdpe-pipes',
      explanation: 'Our HDPE Pipes are 100% certified food-grade and lead-free. They do not leak and are trusted by Jal Jeevan Mission projects.'
    },
    {
      id: 'drainage-farms',
      title: '🌾 Farm Irrigation & Drainage',
      description: 'I need sturdy, low-cost pipes to distribute well-water to farm soil or carry away wastewater.',
      recommendation: 'pvc-pipes',
      explanation: 'Our uPVC Rigid Pipes are ideal! They have a super-slippery interior so water flows quickly using less pump electricity.'
    },
    {
      id: 'high-rise',
      title: '🏢 Heavy-Duty Industrial Pumping',
      description: 'I need high-efficiency pumping motors to pump municipal water up towers or factories.',
      recommendation: 'industrial-motors',
      explanation: 'Our Premium IE3 Electric Motors are built with cold-rolled silicon steel. Runs continuously without overheating.'
    },
    {
      id: 'bulk-storage',
      title: '🪨 Large Volume Overhead Water Storage',
      description: 'I need to store up to 5,000+ Liters of reserve water safely outside under the blazing sun.',
      recommendation: 'water-tanks',
      explanation: 'Our Triple-Layer LLDPE Tanks features dynamic Thermal Foam that reflects 95% of heat, keeping stored water cool.'
    }
  ];

  // Simulated Amazon reviews data
  const amazonReviews: Record<string, { rating: number; count: number; sellerRank: string; highlight: string }> = {
    'hdpe-pipes': {
      rating: 4.9,
      count: 142,
      sellerRank: '#1 Best Seller in JJM Water Infrastructure',
      highlight: '“Incredibly flexible. We rolled out 500 meters across rocky hills without a single weld joint leak!”'
    },
    'industrial-motors': {
      rating: 4.8,
      count: 98,
      sellerRank: '#1 Highly Recommended in Municipal Intake Pumps',
      highlight: '“Saves around 12% on our monthly electricity statement compared to old cast local motors.”'
    },
    'pvc-pipes': {
      rating: 4.9,
      count: 126,
      sellerRank: '#1 Best Seller in Rigidbody Farm Casing Pipes',
      highlight: '“Extremely stiff and durable. High structural rating survived a 10-ton road truck loading beautifully.”'
    },
    'water-tanks': {
      rating: 4.7,
      count: 84,
      sellerRank: '#1 Choice in Multi-Layer Sunlight Protection',
      highlight: '“The middle layer foam is amazing. Even in Nagpur summer at 45°C, the water stays reasonably cool!”'
    }
  };

  // Naive / Plain-English translations of core industrial metrics
  const plainEnglishSpecs: Record<string, string[]> = {
    'hdpe-pipes': [
      '✅ 100% Rust-Proof: Chemical scaling & mud will never stick to inner walls.',
      '✅ Earth-Flex: Super bendy plastic curves around rocks & resists minor earthquake shifts.',
      '✅ Lifetime Leak Guarantee: Fuses into one single joint-free length at installation.',
      '✅ 50+ Years Durability: Safe, long-term drinking water supply for families.'
    ],
    'industrial-motors': [
      '⚡ IE3 Premium Efficiency: Tested to reduce commercial electricity costs up to 12%.',
      '⚡ Dust & Splash-Proof: IP55 certified to operate safely outdoors & damp pump pits.',
      '⚡ Pure Class F Insulation: Double insulated internal stator coils prevent overload burnout.',
      '⚡ Fan-Cooled Chamber: Heavy-duty cast iron body eliminates high-stress vibration.'
    ],
    'pvc-pipes': [
      '🌱 Zero Contamination: Lead-free polymer keeps agricultural and drinking water clean.',
      '🌱 High Crush Rating: Rigid SN8 hardness supports heavy agricultural and soil depth weight.',
      '🌱 Ultra-Slippery Interior: Minimizes flow-friction so water runs faster with less pumping.',
      '🌱 Simple Joint Seals: Tight leak-proof gasket rings slide together in minutes without glue.'
    ],
    'water-tanks': [
      '🛡️ Three-Layer Thermal Block: Outer sunscreen guard, middle heat-insulating foam, inner pure liner.',
      '🛡️ Anti-Algae Sheet: Smooth dark interior restricts sunlight blocks to stop green slime growth.',
      '🛡️ Safe To Drink: 100% BPA-free food-safe premium liner keeps stored water smelling fresh.',
      '🛡️ Anti-Bulge Column Ribs: Structural vertical panels keep shape when water tank is full.'
    ]
  };

  // Plain-English FAQs matching naive user queries
  const plainEnglishFaqs = [
    {
      question: "❓ What does 'BIS & ISI marked' actually mean for my project?",
      answer: "It means the government has officially certified these products for durability. They are subjected to intense laboratory testing—like squeezing pipes at high temperatures—to ensure they won't crack under roads. Essential for government JJM or MJP tenders."
    },
    {
      question: "❓ Can these pipes handle heavy truck traffic overhead when buried?",
      answer: "Yes! Our uPVC pipes have Class-4 (10 kg pressure) and heavy stiffness SN8 ratings. If buried at standard depths of 1.5 meters, the surrounding earth completely distributes weight, meaning 10-ton traffic won't crack or compromise the pipe structures."
    },
    {
      question: "❓ How do I receive a price estimate since these are industrial bulk materials?",
      answer: "Because pipe sizing and shipping distance affect cost, we follow a wholesale quoting system. Simply add whichever elements you need to your Quote Basket, type your project specifications, and our engineering desk will email you a structured commercial bill of quantities (BOQ) with custom bulk discounts!"
    }
  ];

  // Filtering products
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      // 1. Text Search matching
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.tagline.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Category filtering
      if (activeCategory === 'All') {
        if (selectedDiameter) {
          if (product.id !== 'hdpe-pipes' && product.id !== 'pvc-pipes') {
            return false;
          }
        }
      } else if (activeCategory === 'Pipes') {
        if (product.category !== 'HDPE' && product.category !== 'PVC') return false;
      } else if (activeCategory === 'Motors') {
        if (product.category !== 'Motors') return false;
        if (selectedDiameter) return false; // Motors have no selected pipe diameter
      } else if (activeCategory === 'Tanks') {
        if (product.category !== 'Tanks') return false;
        if (selectedDiameter) return false; // Tanks have no selected pipe diameter
      }
      
      return true;
    });
  }, [searchTerm, activeCategory, selectedDiameter]);

  const handleAddToCartWithAnimation = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddProductToQuote(product);
    setAddedProductIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds(prev => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-12">
      
      {/* Search & Simplified Action Hub */}
      <div className="bg-[#faf7f3] border border-[#dca66c]/30 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative grid background for high craftsmanship */}
        <div 
          className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,115,85,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(139,115,85,0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          
          {/* Section Introduction */}
          <div>
            <h3 className="text-sm font-sans font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1.5">
              <Store className="w-4 h-4 text-secondary animate-pulse" /> NAIVE-FRIENDLY DIGITAL WAREHOUSE
            </h3>
            <p className="text-[11.5px] text-[#5c554e] font-sans leading-relaxed mt-1.5 max-w-xl">
              We translated advanced engineer metrics into <strong className="text-stone-900">plain human terms</strong>. Choose the category you need, check straightforward advantages, and instantly add to your procurement cart.
            </p>
          </div>

          {/* Quick contact / Support box */}
          <div className="bg-white/95 border border-[#aa9273]/25 p-3 rounded-xl flex items-center gap-3.5 shadow-sm w-full md:w-auto md:max-w-sm shrink-0">
            <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600">
              <PhoneCall className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[8px] font-black text-[#8b7355] block uppercase tracking-[0.1em]">Need Instant Expert Help?</span>
              <a href="tel:+919834164802" className="text-xs font-bold text-stone-900 hover:underline">
                +91 98341 64802
              </a>
              <span className="text-[9.5px] text-stone-500 block leading-none">Engineering Advisor Available</span>
            </div>
          </div>

        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 pt-5 border-t border-[#dca66c]/20 relative z-10">
          
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]/60" />
            <input 
              type="text" 
              placeholder="Search by keywords (e.g. drinking water, farms, pvc, 5HP motor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#aa9273]/30 hover:border-secondary focus:border-secondary rounded-xl pl-10 pr-4 py-2.5 text-[11.5px] text-stone-800 placeholder-[#8b7355]/45 select-text focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="md:col-span-7 flex flex-wrap gap-2 items-center">
            {(['All', 'Pipes', 'Motors', 'Tanks'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat !== 'Pipes' && cat !== 'All') {
                    setSelectedDiameter(null);
                  }
                }}
                className={`px-4 py-2 text-[10.5px] font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer border ${
                  activeCategory === cat 
                    ? 'bg-[#8b7355] text-white border-transparent shadow shadow-secondary/20' 
                    : 'bg-white border-[#aa9273]/20 text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat === 'All' ? '🌐 View Everything' : cat === 'Pipes' ? '🚰 Water & Gas Pipes' : cat === 'Motors' ? '⚡ Electric Motors' : '🛢️ Water Tanks'}
              </button>
            ))}
          </div>

        </div>

        {/* Quick Pipe Diameter Chips */}
        <div className="mt-5 pt-4 border-t border-[#dca66c]/15 relative z-10 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-[10px] font-sans font-black text-amber-800 tracking-wider uppercase shrink-0 flex items-center gap-1.5 select-none">
            <span className="text-amber-600">📐</span> Quick Pipe Diameter:
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setSelectedDiameter(null)}
              className={`px-3.5 py-1.5 text-[9.5px] font-sans font-bold uppercase rounded-xl transition-all cursor-pointer border ${
                selectedDiameter === null
                  ? 'bg-amber-800 text-white border-transparent shadow-sm'
                  : 'bg-white border-[#aa9273]/25 text-stone-600 hover:bg-stone-50'
              }`}
            >
              All Diameters
            </button>
            {[63, 110, 200].map((dia) => {
              const label = dia === 63 ? '63mm (2" Inch)' : dia === 110 ? '110mm (4" Inch)' : '200mm (8" Inch)';
              return (
                <button
                  key={dia}
                  onClick={() => {
                    setSelectedDiameter(dia);
                    setActiveCategory('Pipes'); // Auto-switch focus to pipes
                  }}
                  className={`px-3.5 py-1.5 text-[9.5px] font-sans font-bold uppercase rounded-xl transition-all cursor-pointer border flex items-center gap-1 ${
                    selectedDiameter === dia
                      ? 'bg-secondary text-white border-transparent shadow shadow-secondary/25 scale-[1.02]'
                      : 'bg-white border-[#aa9273]/25 text-stone-600 hover:bg-stone-50 hover:border-[#8b7355]/45'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
          <span className="text-[9px] text-[#8b7355]/70 italic select-none">
            Clicking a diameter instantly isolates compliant pipelines.
          </span>
        </div>

      </div>

      {/* QUICK ASSISTANT / DECISION MATRICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Case Recommender Box */}
        <div className="lg:col-span-4 bg-stone-900 text-white rounded-2xl p-5 border border-white/5 flex flex-col justify-between shadow-lg relative">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4 className="text-xs font-sans font-black tracking-wider text-amber-300 uppercase leading-normal">
                Simplified Buying Assistant
              </h4>
            </div>
            <p className="text-[11px] text-white/70 font-sans leading-relaxed">
              Don't know about SDR wall thickness or HP output stats? <strong>Tell us what you are building</strong>, and our system will highlight the exact material matches instantly:
            </p>

            <div className="space-y-2 pt-2.5 select-none">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(selectedScenario === sc.id ? null : sc.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                    selectedScenario === sc.id 
                      ? 'bg-[#8b7355] border-transparent text-white scale-[1.01] shadow-md' 
                      : 'bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="font-bold flex justify-between items-center">
                    <span>{sc.title}</span>
                    <span className="text-[9px] opacity-80">{selectedScenario === sc.id ? 'Active' : 'Select'}</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-1 font-sans font-light">
                    {sc.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedScenario && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 bg-white/10 border border-amber-400/25 rounded-xl space-y-1 text-[11px] text-amber-100"
              >
                <div className="font-bold text-amber-400 uppercase tracking-wide text-[9.5px]">
                  💡 Recommended: {ALL_PRODUCTS.find(p => p.id === scenarios.find(s => s.id === selectedScenario)?.recommendation)?.name}
                </div>
                <p className="font-sans leading-relaxed text-white/90">
                  {scenarios.find(s => s.id === selectedScenario)?.explanation}
                </p>
                <button
                  onClick={() => {
                    const recId = scenarios.find(s => s.id === selectedScenario)?.recommendation;
                    const matched = ALL_PRODUCTS.find(p => p.id === recId);
                    if (matched) onSelectProduct(matched);
                  }}
                  className="text-[#f7cb99] font-bold text-[10px] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                >
                  Inspect Detailed Blueprints <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AMAZON BRANDED PRODUCT CARDS LIST */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#faf7f3] border border-[#dca66c]/20 rounded-2xl p-10 text-center"
              >
                <Info className="w-8 h-8 text-[#8b7355] mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-stone-800">No matching products found</p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your keywords search terms or clear filters to see all wholesale products.
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('All'); setSelectedDiameter(null); }}
                  className="mt-4 px-4 py-2 bg-[#8b7355] text-white rounded-xl text-xs font-bold leading-normal cursor-pointer"
                >
                  Reset Filtering Settings
                </button>
              </motion.div>
            ) : (
              filteredProducts.map((product) => {
                const reviews = amazonReviews[product.id] || { rating: 4.8, count: 110, sellerRank: 'Certified Supply', highlight: '' };
                const plainBullets = plainEnglishSpecs[product.id] || [];
                const isAdded = addedProductIds[product.id];

                // Highlights matching on scenario selector
                const isMatchingRecom = selectedScenario && scenarios.find(s => s.id === selectedScenario)?.recommendation === product.id;

                return (
                  <motion.div
                    key={product.id}
                    layoutId={`cat-card-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all duration-300 relative flex flex-col md:flex-row gap-6 ${
                      isMatchingRecom 
                        ? 'ring-2 ring-secondary border-transparent shadow-xl shadow-[#8b7355]/15 scale-101' 
                        : 'border-[#aa9273]/20 hover:border-[#8b7355]/55 shadow-sm hover:shadow-md'
                    }`}
                  >
                    
                    {/* Recommender badge */}
                    {isMatchingRecom && (
                      <span className="absolute -top-3 left-4 bg-[#8b7355] text-white text-[8.5px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-30">
                        ⭐ Buying assistant recommendation
                      </span>
                    )}

                    {/* Left: Product Image & Badges */}
                    <div className="w-full md:w-48 xl:w-56 shrink-0 flex flex-col justify-between items-stretch">
                      
                      {/* Product Image Frame */}
                      <div className="aspect-square bg-slate-50 border border-stone-100 rounded-2xl overflow-hidden relative group">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-sm text-amber-300 text-[8px] font-black tracking-widest px-2.5 py-0.5 rounded-lg border border-amber-500/30 select-none">
                          {product.category}
                        </div>
                      </div>

                      {/* Prime and Trust Badges */}
                      <div className="mt-4 bg-slate-50/80 border border-slate-100 rounded-xl p-3 space-y-2 text-[9.5px]">
                        <div className="flex items-center gap-1.5 text-neutral-800">
                          <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                          <div>
                            <span className="text-sky-600 font-extrabold block text-[8px] leading-tight select-none">TRUCK DELIVERY</span>
                            <span className="font-medium text-stone-600"> नागपुर Factory Direct Route</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-800 pt-1.5 border-t border-stone-100">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <div>
                            <span className="text-emerald-500 font-black block text-[8.5px] leading-tight select-none">Government Listed</span>
                            <span className="font-bold text-stone-700 font-mono text-[8.5px]">{product.specs.standard}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right: Technical Specs translated into simple buyer terms */}
                    <div className="flex-grow flex flex-col justify-between space-y-4">
                      
                      {/* Title & Ratings */}
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
                          <span className="text-[10px] text-amber-700 uppercase tracking-widest font-extrabold">
                            {reviews.sellerRank}
                          </span>
                          <span className="text-[8.5px] text-[#25d366] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-black">
                            MSME STAMPED
                          </span>
                        </div>
                        
                        <h4 className="text-base sm:text-lg font-serif font-medium text-stone-900 mt-1 leading-normal">
                          {product.name}
                        </h4>

                        {/* Customer Star Rating */}
                        <div className="flex items-center gap-1.5 mt-1.5 select-none font-sans">
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 fill-current ${
                                  i < Math.floor(reviews.rating) ? 'opacity-100' : 'opacity-35'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-extrabold text-[#8b7355] font-mono">{reviews.rating}</span>
                          <span className="text-[11px] text-stone-500">({reviews.count} verified municipal bids)</span>
                        </div>
                      </div>

                      {/* Plain-English Bullet advantages */}
                      <div className="bg-[#faf7f3]/55 border border-[#aa9273]/15 rounded-2xl p-4 space-y-2">
                        <span className="text-[9px] text-[#8b7355]/85 tracking-widest uppercase font-black block select-none">
                          🛡️ CORE USER ADVANTAGES:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] font-sans">
                          {plainBullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-stone-700 leading-relaxed">
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Active Diameter Spec Highlight */}
                      {selectedDiameter && (product.id === 'hdpe-pipes' || product.id === 'pvc-pipes') && (
                        <div className="bg-amber-50/70 border border-amber-500/25 rounded-2xl p-4 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-sans font-black text-amber-900 uppercase tracking-wider flex items-center gap-1 select-none">
                              🔍 Active Size Spec: {selectedDiameter}mm
                            </span>
                            <span className="text-[8.5px] bg-[#8b7355] text-white px-2 py-0.5 rounded font-bold uppercase select-none">
                              {selectedDiameter === 63 ? '2" Inch Nominal' : selectedDiameter === 110 ? '4" Inch Nominal' : '8" Inch Nominal'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10.5px]">
                            <div className="bg-white border border-[#aa9273]/15 rounded-xl p-2.5">
                              <span className="text-[8.5px] font-bold text-stone-500 uppercase block leading-none mb-0.5">Wall Thickness</span>
                              <span className="font-bold text-[#8b7355]">
                                {product.id === 'hdpe-pipes' 
                                  ? (selectedDiameter === 63 ? '3.8mm (PN6) - 5.8mm (PN10)' : selectedDiameter === 110 ? '6.6mm (PN6) - 10.0mm (PN10)' : '11.9mm (PN6) - 18.2mm (PN10)')
                                  : (selectedDiameter === 63 ? '2.5mm (Cl.2) - 5.7mm (Cl.4)' : selectedDiameter === 110 ? '4.2mm (Cl.2) - 9.5mm (Cl.4)' : '7.0mm (Cl.2) - 14.7mm (Cl.4)')
                                }
                              </span>
                            </div>
                            <div className="bg-white border border-[#aa9273]/15 rounded-xl p-2.5">
                              <span className="text-[8.5px] font-bold text-stone-500 uppercase block leading-none mb-0.5">Est. Net Weight</span>
                              <span className="font-bold text-[#8b7355] font-mono">
                                {product.id === 'hdpe-pipes'
                                  ? (selectedDiameter === 63 ? '0.73 - 1.05 kg/m' : selectedDiameter === 110 ? '2.15 - 3.10 kg/m' : '7.15 - 10.45 kg/m')
                                  : (selectedDiameter === 63 ? '0.70 - 1.30 kg/m' : selectedDiameter === 110 ? '2.05 - 4.25 kg/m' : '6.80 - 12.80 kg/m')
                                }
                              </span>
                            </div>
                            <div className="bg-white border border-[#aa9273]/15 rounded-xl p-2.5">
                              <span className="text-[8.5px] font-bold text-stone-500 uppercase block leading-none mb-0.5">Government Utility Role</span>
                              <span className="text-stone-700 block text-[9.5px] leading-tight">
                                {selectedDiameter === 63 
                                  ? 'Household tap / Drip farm sub' 
                                  : selectedDiameter === 110 
                                    ? 'JJM rural distribution line' 
                                    : 'Water supply major pipeline mains'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Representative pricing and actions list */}
                      <div className="pt-4 border-t border-stone-100 flex flex-wrap justify-between items-center gap-4">
                        
                        <div>
                          <span className="text-[8.5px] tracking-[0.08em] select-none text-stone-400 block uppercase font-bold font-mono">Wholesale Industrial Quoting Plan:</span>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-sm font-sans text-stone-400">Estimate Rate:</span>
                            <span className="text-lg font-mono font-black text-[#8b7355] leading-none">
                              {product.id === 'hdpe-pipes' ? '₹240 - ₹4,800' 
                               : product.id === 'pvc-pipes' ? '₹85 - ₹1,420' 
                               : product.id === 'industrial-motors' ? 'Starting ₹38,000' 
                               : 'Wholesale Standard Pricing'}
                            </span>
                            <span className="text-[10px] text-stone-500 font-sans">
                              {product.id === 'industrial-motors' ? 'per unit' : 'per meter'}
                            </span>
                          </div>
                          <p className="text-[9.5px] leading-relaxed text-emerald-600 font-sans mt-1">
                            ✔️ Standard government discount frames applied dynamically in the basket process.
                          </p>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="flex-1 sm:flex-none text-center px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 hover:border-stone-400 font-sans text-[10.5px] font-bold rounded-xl cursor-pointer transition-all uppercase tracking-wide"
                            title="Inspect engineering specifications"
                          >
                            Specs Sheet
                          </button>
                          
                          <button
                            onClick={(e) => onOpenShare(product)}
                            className="p-2.5 hover:bg-stone-50 text-stone-600 hover:text-[#8b7355] border border-[#aa9273]/20 hover:border-secondary rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                            title="Share as PDF/Markdown Bulletin"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleAddToCartWithAnimation(product, e)}
                            className={`flex-1 sm:flex-none justify-center px-5 py-2.5 rounded-xl font-sans text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                              isAdded 
                                ? 'bg-emerald-600 text-white shadow-emerald-500/10 scale-102 hover:scale-102 border border-transparent' 
                                : 'bg-secondary hover:bg-stone-900 border border-transparent text-white hover:text-white hover:shadow'
                            }`}
                          >
                            {isAdded ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                            <span>{isAdded ? 'Added to Quote!' : 'Add to Basket'}</span>
                          </button>
                        </div>

                      </div>

                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* DETAILED SIDE-BY-SIDE BUYER BENEFIT MATRIX TABLE */}
      <div className="bg-white border border-[#aa9273]/15 rounded-3xl p-5 sm:p-6 shadow-sm overflow-hidden select-none">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-amber-700" />
          <h4 className="text-xs font-sans font-black uppercase text-stone-900 tracking-wider leading-none">
            Plain-English Comparison Matrix ("Which one do I need?")
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-stone-100 text-[#8b7355] font-sans font-bold uppercase text-[9px] tracking-wide select-none bg-slate-50">
                <th className="py-2.5 px-4 rounded-l-xl">Factor</th>
                <th className="py-2.5 px-4 font-black">HDPE / MDPE Pipes</th>
                <th className="py-2.5 px-4 font-black">uPVC Rigid Pipes</th>
                <th className="py-2.5 px-4 font-black rounded-r-xl">Industrial Motors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-sans leading-relaxed">
              <tr>
                <td className="py-3 px-4 font-bold text-stone-900">Primary Strength</td>
                <td className="py-3 px-4">Super flexy & earthquake-safe. Highly resilient to rough soil shifting.</td>
                <td className="py-3 px-4">Super rigid & stands heavy vertical pressure, great under concrete loads.</td>
                <td className="py-3 px-4">Continuous duty. Pure electrical stator cooling avoids thermal shutdowns.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-stone-900">Common Setup Use</td>
                <td className="py-3 px-4">Drinking water pipelines or high-pressure gas city layouts.</td>
                <td className="py-3 px-4">Agricultural irrigation loops, municipal sewers or borehole columns.</td>
                <td className="py-3 px-4">Driving deep well-head intake pumps or high-rise water chambers.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-stone-900">How They Connect</td>
                <td className="py-3 px-4">Butt heat welded—fuses to create single 100% leakless continuous lines.</td>
                <td className="py-3 px-4">Easy seal gaskets slide-fit rings together without solvent glue.</td>
                <td className="py-3 px-4">Standard standardized shaft couples with water supply pump heads.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-stone-900">Price Metric</td>
                <td className="py-3 px-4">Medium to High (Value matching its extreme lifetime flex).</td>
                <td className="py-3 px-4">Extremely Cost-Effective (Most budget-friendly for heavy layouts).</td>
                <td className="py-3 px-4">Enterprise CapEx investment (IE3 design pays back in cheaper electricity).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMPLIFIED CONVERSATIONAL PROCUREMENT FAQs */}
      <div className="bg-[#faf7f3]/65 border border-[#dca66c]/15 rounded-3xl p-5 sm:p-6 relative">
        <h4 className="text-xs font-sans font-black tracking-wider text-amber-800 uppercase flex items-center gap-1.5 mb-4">
          <HelpCircle className="w-4 h-4 text-amber-700" /> Naive Customer Procurement FAQ
        </h4>
        <div className="space-y-2 max-w-4xl">
          {plainEnglishFaqs.map((faq, idx) => {
            const isOpen = openFaqId === idx;
            return (
              <div 
                key={idx} 
                className="bg-white border border-stone-200/60 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex justify-between items-center cursor-pointer hover:bg-stone-50 select-none"
                >
                  <span className="text-[11.5px] font-sans font-bold text-stone-800">
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#8b7355] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-stone-100"
                    >
                      <p className="p-4 text-[11px] text-stone-600 font-sans leading-relaxed bg-[#faf7f3]/25">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
