import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Mail, Phone, ChevronRight, Award, ChevronLeft, Quote, ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const API_KEY =
  (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_PLATFORM_KEY : '') ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && 
  API_KEY !== 'YOUR_API_KEY' && 
  API_KEY !== 'undefined' && 
  API_KEY !== 'null' && 
  API_KEY.trim() !== '' && 
  /^[A-Za-z0-9_-]{30,60}$/.test(API_KEY.trim());

class MapErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Map loading error handled gracefully:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function MapMarkerWithInfoWindow() {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: 21.0117, lng: 74.7749 }}
        title="Hitanshi Manufacturing Office"
        onClick={() => setInfoWindowShown(true)}
      >
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex items-center justify-center cursor-pointer pointer-events-auto"
        >
          {/* Subtle expanding pulse aura */}
          <motion.div
            animate={{
              scale: [0.9, 1.5, 0.9],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -inset-3 rounded-full border-2 border-[#8b7355]/40 pointer-events-none"
          />
          <Pin background="#8b7355" borderColor="#ffffff" glyphColor="#ffffff" scale={0.8} />
        </motion.div>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
        >
          <div className="text-white p-1 min-w-[185px] font-sans">
            <div className="flex items-center gap-1.5 border-b border-[#8b7355]/30 pb-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b7355] animate-pulse" />
              <h6 className="font-serif italic font-medium text-xs text-[#8b7355]">Hitanshi Mfg. Office</h6>
            </div>
            <p className="text-[10px] text-white/90 font-light leading-relaxed">
              Plot 42, MIDC Phase III, Avadhan<br />
              Dhule, Maharashtra 424006
            </p>
            <p className="text-[8px] text-[#8b7355]/75 mt-1.5 uppercase tracking-widest font-mono">
              ★ ISO 9001:2015 Facility
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

const testimonialsTranslations = {
  en: [
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
  ],
  hi: [
    {
      quote: "जलगाँव जिले में उबड़-खाबड़ और दुर्गम परियोजना जल लेआउट के लिए हितांशी ट्रेडिंग कॉर्पोरेशन के IS 4984 प्रमाणित एचडीपीई पाइप अत्यंत महत्वपूर्ण सिद्ध हुए। जटिल, उच्च दबाव नगर निगम ग्रिड के तहत उत्कृष्ट प्रदर्शन और असाधारण हाइड्रोस्टैटिक स्थायित्व।",
      author: "श्री आर. के. देशमुख",
      role: "अधिशासी अभियंता, एमजेपी डिवीजन",
      project: "जल जीवन मिशन (ग्रामीण जल आपूर्ति)",
      region: "महाराष्ट्र",
      badge: "जल जीवन स्वीकृत"
    },
    {
      quote: "कठिन भौगोलिक चुनौतियों और दुर्गमता के बावजूद फ्लोशक्ति पंपिंग इकाइयां और जल अवसंरचना प्रणालियां निर्धारित समय पर वितरित की गईं। भारी-भरकम डिस्चार्ज क्षमता के साथ कंपनी की इंजीनियरिंग विशेषज्ञता वास्तव में सराहनीय है।",
      author: "विक्रमादित्य सिंह",
      role: "परियोजना निदेशक",
      project: "मध्य प्रदेश जल निगम योजना",
      region: "मध्य प्रदेश",
      badge: "जल निगम निविदा"
    },
    {
      quote: "अनुकूलित SDR रेटिंग और उच्च गुणवत्ता मानकों के साथ पीवीसी और एमडीपीई पाइप प्रणालियों की हमारी थोक खरीद ने सरकारी लैब ऑडिट मानकों को सफलतापूर्वक पूरा किया। उत्कृष्ट रसद परिवहन समन्वय और विश्वसनीय समर्थन प्रदान किया गया।",
      author: "अनन्या अय्यर",
      role: "मुख्य अवसंरचना सलाहकार",
      project: "स्मार्ट नगर निगम जल ग्रिड पहल",
      region: "कर्नाटक",
      badge: "नगर निगम उपयोगिता"
    }
  ]
};

const faqItemsTranslations = {
  en: [
    {
      question: "Is Hitanshi Trading Corporation registered under MSME? How does it benefit public procurement?",
      answer: "Yes, Hitanshi Trading Corporation is fully registered under both MSME (Udyam Registration) and DIC (District Industries Centre) guidelines. This enables civil and municipal contractors to leverage government purchase preferences, tender fee waivers, relaxed earnest money deposits (EMD), and simplified processing for government tenders like water supply layouts under the Jal Jeevan Mission."
    },
    {
      question: "What are your standard logistics and delivery timelines for large-volume consignments?",
      answer: "For standard warehouse inventory, dispatches are scheduled within 2 to 4 business days. For customized pressure ratings, high-density SDR configurations, or custom length fabrications, processing timelines take from 7 to 14 working days. We coordinate complete transport logistics to key municipal project sites across Maharashtra, Madhya Pradesh, and neighboring states with certified carriers."
    },
    {
      question: "Which hydrostatic testing and quality benchmarks do your supply pipelines meet?",
      answer: "Every batch of pipelines supplied—specifically highlighting our premium IS 4984 (HDPE Water Mains) and IS 14333 (Sewerage Conduits) ratings—undergoes meticulous Quality Assurance testing prior to loading. This includes on-field hydrostatic burst testing at 1.5 times the specified PN pressure rating to confirm long-term wall stability, leakage resistance, and structural joint endurance under high-stress conditions."
    }
  ],
  hi: [
    {
      question: "क्या हितांशी ट्रेडिंग कॉर्पोरेशन MSME के तहत पंजीकृत है? सरकारी खरीद (Procurement) में इसका क्या लाभ है?",
      answer: "हाँ, हितांशी ट्रेडिंग कॉर्पोरेशन MSME (उद्यम पंजीकरण) और DIC (जिला उद्योग केंद्र) दिशानिर्देशों के तहत पूरी तरह से पंजीकृत है। यह सिविल और नगर निगम ठेकेदारों को सरकारी खरीद प्राथमिकताओं, निविदा (tender) शुल्क छूट, बयाना जमा राशि (EMD) में रियायत, और जल जीवन मिशन के तहत पेयजल आपूर्ति जैसी सरकारी निविदाओं के सरलीकृत प्रसंस्करण का लाभ उठाने में सक्षम बनाता है।"
    },
    {
      question: "बड़े स्तर की खेप (consignment) के लिए आपके मानक रसद (logistics) और वितरण समय-सीमा क्या हैं?",
      answer: "मानक गोदाम तैयार स्टॉक के लिए, प्रेषण 2 से 4 कार्य दिवसों के भीतर निर्धारित किया जाता है। अनुकूलित दबाव रेटिंग, उच्च घनत्व SDR विन्यास, या विशेष लंबाई निर्माण के लिए, प्रसंस्करण में 7 से 14 कार्य दिवस लगते हैं। हम प्रमाणित कार्गो वाहकों के साथ महाराष्ट्र, मध्य प्रदेश और अन्य पड़ोसी राज्यों में प्रमुख नगर निगम परियोजना स्थलों तक पूर्ण सुरक्षित परिवहन रसद का समन्वय करते हैं।"
    },
    {
      question: "आपकी आपूर्ति पाइपलाइनें किन हाइड्रोस्टैटिक परीक्षण और गुणवत्ता बेंचमार्क को पूरा करती हैं?",
      answer: "आपूर्ति की जाने वाली पाइपलाइनों का प्रत्येक बैच (विशेष रूप से हमारे प्रीमियम IS 4984 एचडीपीई वाटर मेन्स और IS 14333 सीवरेज कंड्यूट्स रेटिंग) लोडिंग से पहले कड़े गुणवत्ता आश्वासन (Quality Assurance) परीक्षणों से गुजरता है। इसमें उच्च-तनाव स्थितियों में रिसाव प्रतिरोध, संयुक्त मजबूती और दीर्घकालिक स्थिरता की पुष्टि के लिए निर्धारित PN दबाव रेटिंग के 1.5 गुना पर ऑन-फील्ड हाइड्रोस्टैटिक दबाव परीक्षण शामिल है।"
    }
  ]
};

const footerTranslations = {
  en: {
    portalTitle: "Accessibility Desk: Maharashtra, Madhya Pradesh & Regional Offices",
    testimonialsBadge: "Civil Requisition Endorsements",
    testimonialsTitle: "Field Quality & ",
    testimonialsSubtitle: "Project Testimonials",
    verifiedDeliveryBadge: "Verified Delivery",
    companyTitle: "Hitanshi",
    companySubtitle: "TRADING & PUMP",
    companyDescription: "Authorized Manufacturers and Wholesale Traders specializing in large-scale water and electrical infrastructure solutions.",
    colProductsHeading: "Products",
    colEquipmentHeading: "Equipment",
    colContactHeading: "Contact Information",
    mfgOfficeLabel: "Dhule Manufacturing Office:",
    deskPhoneLabel: "Direct Desk Phone:",
    dispatchMailLabel: "Official Dispatch Mail:",
    msmeLabel: "Registered under MSME and DIC standards. Batch sample pressure reports certified under ISO 9001.",
    faqBadge: "Procurement Desk Support",
    faqTitle: "Common Procurement & ",
    faqTitleItalic: "Technical Standards",
    faqDescription: "Frequently asked questions on our certifications, direct logistics, and rigorous material testing benchmarks.",
    stillHaveQuestions: "Still have questions? Contact us",
    contactProcurementDesk: "Contact Procurement Desk",
    directCall: "Direct Call",
    privacyPolicy: "Privacy Policy",
    termsOfSupply: "Terms of Supply"
  },
  hi: {
    portalTitle: "पहुंच सुगमता डेस्क: महाराष्ट्र, मध्य प्रदेश और क्षेत्रीय कार्यालय",
    testimonialsBadge: "नागरिक मांग पत्र समर्थन",
    testimonialsTitle: "क्षेत्रीय गुणवत्ता और ",
    testimonialsSubtitle: "परियोजना प्रशंसापत्र",
    verifiedDeliveryBadge: "सत्यापित वितरण",
    companyTitle: "हितांशी",
    companySubtitle: "ट्रेडिंग और पंप",
    companyDescription: "बड़े पैमाने पर जल और विद्युत अवसंरचना (infrastructure) समाधानों में विशेषज्ञता प्राप्त अधिकृत निर्माता और थोक व्यापारी।",
    colProductsHeading: "उत्पाद",
    colEquipmentHeading: "उपकरण",
    colContactHeading: "संपर्क जानकारी",
    mfgOfficeLabel: "धुले विनिर्माण कार्यालय:",
    deskPhoneLabel: "सीधा फोन:",
    dispatchMailLabel: "आधिकारिक प्रेषण मेल:",
    msmeLabel: "MSME और DIC दिशानिर्देशों के तहत पंजीकृत। ISO 9001 के तहत प्रमाणित बैच नमूना दबाव रिपोर्ट।",
    faqBadge: "सरकारी खरीद डेस्क सहायता",
    faqTitle: "सामान्य खरीद एवं ",
    faqTitleItalic: "तकनीकी मानक",
    faqDescription: "प्रमाणपत्रों, प्रत्यक्ष रसद और कठोर सामग्री परीक्षण मानदंडों पर अक्सर पूछे जाने वाले सरकारी खरीद संबंधी प्रश्न।",
    stillHaveQuestions: "अभी भी प्रश्न हैं? हमसे संपर्क करें",
    contactProcurementDesk: "प्रोक्योरमेंट डेस्क से संपर्क करें",
    directCall: "सीधा फोन मिलाएँ",
    privacyPolicy: "गोपनीयता नीति",
    termsOfSupply: "आपूर्ति की शर्तें"
  }
};

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

interface FooterProps {
  onOpenQuoteModal?: () => void;
}

export default function Footer({ onOpenQuoteModal }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();
  const [lang, setLang] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('hitanshi_lang');
      return (saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeTestimonials = testimonialsTranslations[lang];
  const activeFaqItems = faqItemsTranslations[lang];
  const t = footerTranslations[lang];

  const changeLanguage = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    try {
      localStorage.setItem('hitanshi_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % activeTestimonials.length);
  }, [activeTestimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  }, [activeTestimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <footer 
      id="footer-section" 
      className="bg-primary text-white border-t border-[#8b7355]/20 font-sans overflow-x-hidden"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >

        {/* Language Quick Access Toggle Bar to serve local procurement desks in Maharashtra and MP */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/[0.02] border border-white/5 px-6 py-4 mb-10 gap-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <Globe className="w-4.5 h-4.5 text-secondary animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] block uppercase font-mono tracking-wider text-secondary font-bold">
                Local Procurement Accessibility Desk
              </span>
              <p className="text-[11px] text-white/60 font-sans">
                {t.portalTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest hidden md:inline animate-fade-in">
              {lang === 'hi' ? 'भाषा चयन:' : 'Select Language:'}
            </span>
            <div className="flex items-center p-0.5 bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 font-mono text-[10px] tracking-wider uppercase transition-all duration-300 cursor-pointer rounded-lg ${
                  lang === 'en'
                    ? 'bg-[#8b7355] text-white font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title="Switch to English"
              >
                ENGLISH
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-3 py-1 font-sans text-[10px] tracking-wide font-medium transition-all duration-300 cursor-pointer rounded-lg ${
                  lang === 'hi'
                    ? 'bg-[#8b7355] text-white font-bold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
        
        {/* Testimonial Carousel Section */}
        <div id="testimonials-carousel" className="border-b border-white/10 pb-12 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 text-left">
            <div>
              <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block">
                {t.testimonialsBadge}
              </span>
              <h4 className="text-xl md:text-2xl font-light font-serif text-white tracking-tight mt-1">
                {t.testimonialsTitle}<span className="italic">{t.testimonialsSubtitle}</span>
              </h4>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-all cursor-pointer rounded-full text-white/50 hover:text-white hover:scale-105"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="p-2 border border-white/10 hover:border-secondary hover:bg-white/5 transition-all cursor-pointer rounded-full text-white/50 hover:text-white hover:scale-105"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Testimonial Card */}
          <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-between min-h-[220px] text-left rounded-3xl shadow-xl backdrop-blur-md">
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
                    <span className="text-[9px] bg-[#8b7355] text-white font-sans font-bold px-2.5 py-1 uppercase tracking-wider rounded-full">
                      {activeTestimonials[activeIndex].badge}
                    </span>
                    <span className="text-[10px] text-white/50 font-sans uppercase tracking-[0.1em]">
                      {activeTestimonials[activeIndex].region} {lang === 'hi' ? 'प्रभाग' : 'Division'}
                    </span>
                  </div>
                  
                  <p className="text-sm sm:text-base text-white/95 font-serif leading-relaxed italic pr-6 pb-2">
                    "{activeTestimonials[activeIndex].quote}"
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 min-w-[260px]">
                  <div className="inline-flex items-center gap-2 mb-2 text-secondary">
                    <Quote className="w-3.5 h-3.5 text-secondary fill-secondary/10" />
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase font-sans">{t.verifiedDeliveryBadge}</span>
                  </div>
                  <p className="font-serif italic text-base text-white font-medium">
                    {activeTestimonials[activeIndex].author}
                  </p>
                  <p className="text-[11px] text-white/50 font-sans tracking-wide mt-0.5 animate-fade-in">
                    {activeTestimonials[activeIndex].role}
                  </p>
                  <p className="text-[10px] text-[#8b7355] font-sans font-bold mt-1.5 uppercase tracking-wider">
                    {activeTestimonials[activeIndex].project}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {activeTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1);
                  setActiveIndex(idx);
                }}
                className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
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
                {t.companyTitle}
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block mt-1.5">
                {t.companySubtitle}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-on-primary-container leading-relaxed font-sans font-light max-w-sm">
              {t.companyDescription}
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
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-4 animate-fade-in">
              {t.colProductsHeading}
            </h5>
            <ul className="space-y-2.5 text-xs text-on-primary-container font-sans font-light">
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform animate-pulse" />
                  {lang === 'hi' ? 'एचडीपीई पाइप्स (HDPE)' : 'HDPE Pipes'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'एमडीपीई पाइप्स (MDPE)' : 'MDPE Pipes'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'यूपीवीसी पाइप्स (uPVC)' : 'uPVC Pipes'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'केसिंग पाइप्स (Casing)' : 'Casing Pipes'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Equipment links (width 2) */}
          <div className="lg:col-span-2">
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans mb-4 animate-fade-in">
              {t.colEquipmentHeading}
            </h5>
            <ul className="space-y-2.5 text-xs text-on-primary-container font-sans font-light">
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform animate-pulse" />
                  {lang === 'hi' ? 'औद्योगिक मोटर्स (Motors)' : 'Industrial Motors'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'पानी की टंकियां (Tanks)' : 'Water Tanks'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'पंपिंग सिस्टम (Pumping)' : 'Pumping Systems'}
                </a>
              </li>
              <li>
                <a href="#portfolio-section" className="hover:text-white transition-all inline-flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-secondary group-hover:translate-x-1 transition-transform" />
                  {lang === 'hi' ? 'प्रवाह गेज (Gauges)' : 'Flow Gauges'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Address Contact info (width 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="font-bold text-[11px] uppercase tracking-[0.2em] text-[#8b7355] font-sans animate-fade-in">
              {t.colContactHeading}
            </h5>
            
            <div className="space-y-3 text-xs text-on-primary-container leading-relaxed font-sans font-light">
              <p>
                <span className="font-semibold text-white block">{t.mfgOfficeLabel}</span>
                {lang === 'hi' ? 'प्लॉट ४२, एमआईडीसी फेज III, धुले, महाराष्ट्र' : 'Plot 42, MIDC Phase III, Dhule, Maharashtra'}
              </p>
              <p>
                <span className="font-semibold text-white block">{t.deskPhoneLabel}</span>
                +91 72630 14111
              </p>
              <p>
                <span className="font-semibold text-white block">{t.dispatchMailLabel}</span>
                rajputbhargav001@gmail.com
              </p>
            </div>

            {/* Dhule Office Google Map / Fallback section */}
            <div className="overflow-hidden mt-3 shadow-md">
              <MapErrorBoundary fallback={
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
              }>
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
                        <MapMarkerWithInfoWindow />
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
              </MapErrorBoundary>
            </div>

            {/* Bureau markings and legal compliance statements */}
            <div className="p-4 bg-white/2 border border-white/10 flex items-center gap-3">
              <Award className="w-4 h-4 text-secondary flex-shrink-0 animate-pulse" />
              <p className="text-[10px] font-sans tracking-wide text-primary-fixed-dim leading-relaxed">
                {t.msmeLabel}
              </p>
            </div>
          </div>

        </div>

        {/* Procurement FAQ Accordion Section */}
        <div id="procurement-faq" className="border-b border-white/10 pb-12 mb-10 pt-4">
          <div className="max-w-3xl mb-8">
            <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold text-secondary block animate-fade-in">
              {t.faqBadge}
            </span>
            <h4 className="text-xl md:text-2xl font-light font-serif text-white tracking-tight mt-1 animate-fade-in">
              {t.faqTitle}<span className="italic">{t.faqTitleItalic}</span>
            </h4>
            <p className="text-xs text-white/50 leading-relaxed font-sans font-light mt-2 max-w-xl animate-fade-in">
              {t.faqDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 max-w-4xl">
            {activeFaqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: -15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
                  className="border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] hover:border-secondary/40 transition-all rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-secondary/50 group"
                    aria-expanded={isOpen}
                    id={`faq-btn-${idx}`}
                  >
                    <div className="flex gap-4 items-start pr-4">
                      <HelpCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <span className="font-serif italic text-sm md:text-base text-white/95 group-hover:text-white transition-colors">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-white/40 group-hover:text-white shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-secondary' : ''}`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`faq-content-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: { type: "spring", stiffness: 220, damping: 25 },
                          opacity: { duration: 0.25, ease: "easeInOut" }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 md:p-5 pt-0 border-t border-white/5 text-xs md:text-sm text-white/75 leading-relaxed font-sans font-light">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* High usability contact procurement team block underneath FAQ list */}
          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl bg-white/[0.01] border border-dashed border-[#8b7355]/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
            <div>
              <h5 className="font-serif italic text-sm text-white/90">
                {t.stillHaveQuestions}
              </h5>
              <p className="text-[11px] text-white/50 font-sans font-light mt-1">
                {lang === 'hi'
                  ? 'विशेष सामग्री विवरणिका, अनुकूलित पाइप आयाम या थोक आदेशों के लिए सीधे प्रोक्योरमेंट डेस्क से परामर्श करें।'
                  : 'Consult the procurement desk directly for custom material catalogs, custom pressure dimensions, or bulk orders details.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {onOpenQuoteModal && (
                <button
                  onClick={onOpenQuoteModal}
                  className="px-4 py-2.5 bg-[#8b7355] hover:bg-[#a68c6c] text-white font-sans font-bold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] shrink-0 rounded-xl"
                >
                  <span>{t.contactProcurementDesk}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <a
                href="tel:+917263014111"
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-sans font-bold text-[11px] uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-1.5 hover:scale-[1.02] shrink-0 rounded-xl"
              >
                <Phone className="w-3.5 h-3.5 text-secondary" />
                <span>{t.directCall}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom footer credit bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-on-primary-container font-sans tracking-wide">
          <p className="text-center sm:text-left">
            © {currentYear} Hitanshi Trading Corporation &amp; Floshakti Pump. {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white underline decoration-secondary transition-all">
              {t.privacyPolicy}
            </a>
            <a href="#" className="hover:text-white underline decoration-secondary transition-all">
              {t.termsOfSupply}
            </a>
          </div>
        </div>

      </motion.div>
    </footer>
  );
}
