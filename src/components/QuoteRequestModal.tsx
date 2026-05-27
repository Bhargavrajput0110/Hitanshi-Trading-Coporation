import React, { useState } from 'react';
import { X, Trash2, Mail, Phone, MapPin, Building, FileText, Send, Check } from 'lucide-react';
import { QuoteItem } from '../types';

interface QuoteRequestModalProps {
  onClose: () => void;
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onClearItems: () => void;
}

export default function QuoteRequestModal({ onClose, items, onRemoveItem, onClearItems }: QuoteRequestModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    companyName: '',
    projectRegion: 'Maharashtra',
    notes: ''
  });
  
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quoteNumber, setQuoteNumber] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Generate an authentic look quotation number
    const regionCode = formData.projectRegion === 'Maharashtra' ? 'MH' : formData.projectRegion === 'M.P.' ? 'MP' : 'IN';
    const rand = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().substring(2, 10).replace(/-/g, '');
    setQuoteNumber(`HTC-${regionCode}-${dateStr}-${rand}`);
    setSubmitted(true);
  };

  // Construct WhatsApp redirect string
  const getWhatsAppURL = () => {
    const phoneNum = '917263014111';
    let textStr = `*HITANSHI TRADING CORP REQUISITION INQUIRY*\n`;
    textStr += `*Quote ID:* ${quoteNumber}\n`;
    textStr += `*Client:* ${formData.clientName}\n`;
    textStr += `*Company:* ${formData.companyName}\n`;
    textStr += `*Phone:* ${formData.phone}\n`;
    textStr += `*Delivery Region:* ${formData.projectRegion}\n\n`;
    textStr += `*Requested Pipe Specs:*\n`;
    
    items.forEach((item, index) => {
      textStr += `${index + 1}. *${item.productName}*\n`;
      textStr += `   Detail: ${item.details}\n`;
      textStr += `   Length: ${item.quantity} Meters`;
      if (item.weightEstimate) {
        textStr += ` (~${item.weightEstimate.toLocaleString()} Kg total)\n`;
      } else {
        textStr += `\n`;
      }
    });

    if (formData.notes) {
      textStr += `\n*Project Notes:* ${formData.notes}\n`;
    }

    textStr += `\n_Submitted via Digital Procurement Portal. Please send formal commercial pricing._`;
    return `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(textStr)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-outline-variant/50 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] rounded-3xl overflow-hidden">
        
        {/* Visual Stripe */}
        <div className="h-1.5 bg-secondary" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-secondary text-white rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </span>
            <div className="text-left">
              <h3 className="text-xl font-medium font-serif text-primary tracking-tight">
                {submitted ? 'Formal RFQ Generated' : 'Request Commercial Quotation (RFQ)'}
              </h3>
              <p className="text-[10px] text-on-surface-variant/85 font-sans tracking-wide uppercase mt-0.5">
                {submitted ? 'Verification Document Sheet' : 'Digital bidding support desk - Direct to factory dispatch'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-surface-high rounded-full transition-colors text-on-surface hover:text-secondary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submitted Success View */}
        {submitted ? (
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <div className="bg-emerald-50 border border-emerald-500/30 p-4 text-emerald-950 flex gap-3 text-sm rounded-2xl">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-bold font-sans text-xs uppercase tracking-wider text-emerald-800">Specifications Compiled Successfully!</p>
                <p className="text-xs text-emerald-900/95 mt-1 font-sans font-light leading-relaxed">
                  Your civil works pipeline requisition has been formatted under commercial ID <span className="font-semibold font-sans">{quoteNumber}</span>. Please click below to send direct specifications to Hitanshi Trading Corp on WhatsApp.
                </p>
              </div>
            </div>

            {/* Corporate Summary Sheet preview */}
            <div className="border border-outline-variant/60 p-6 space-y-4 shadow-sm bg-neutral-50/50 rounded-2xl font-sans text-xs">
              <div className="flex justify-between items-start border-b border-outline-variant/60 pb-3 text-primary">
                <div className="text-left">
                  <h4 className="font-bold text-sm font-sans uppercase tracking-wider">Hitanshi Trading Corp</h4>
                  <p className="text-[10px] text-on-surface-variant/85 font-sans font-light">MIDC Phase III, Dhule, MH</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-primary text-white font-sans text-[10px] font-bold tracking-wider select-all rounded-md">{quoteNumber}</span>
                  <p className="text-[9px] text-on-surface-variant/85 mt-1.5 font-sans">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-on-surface-variant/90">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-[#8b7355] block tracking-wider">Client Representative:</span>
                  <p className="font-semibold text-primary text-xs mt-0.5">{formData.clientName}</p>
                  <p className="text-xs mt-0.5 font-light">{formData.companyName}</p>
                </div>
                <div className="text-right sm:text-left">
                  <span className="text-[9px] uppercase font-bold text-[#8b7355] block tracking-wider">Site / Delivery Corridor:</span>
                  <p className="font-semibold text-primary text-xs mt-0.5">{formData.projectRegion} Region</p>
                  <p className="text-xs mt-0.5 font-light">Ph: {formData.phone}</p>
                </div>
              </div>

              {/* Line items list */}
              <div className="border-t border-b border-outline-variant/60 py-3.5 my-4 space-y-3">
                <span className="text-[9px] uppercase font-bold text-[#8b7355] block tracking-[0.15em] mb-1">REQUISITION LINE ITEMS COMPILATION</span>
                {items.map((item, idx) => (
                  <div key={item.id} className="flex justify-between text-[11px] hover:bg-white/40 p-1 transition-colors">
                    <div>
                      <p className="font-semibold text-primary">{idx+1}. {item.productName}</p>
                      <p className="text-on-surface-variant/80 text-[10px] mt-0.5">{item.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{item.quantity} Meters</p>
                      {item.weightEstimate && (
                        <p className="text-on-surface-variant/85 text-[9px] font-sans">Est: {item.weightEstimate.toLocaleString()} Kg</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formData.notes && (
                <div className="text-on-surface-variant/90 italic border-b border-outline-variant/60 pb-3 text-[10px]">
                  <span className="font-bold uppercase text-primary text-[9px] tracking-wider block not-italic">Estimator Comments:</span>
                  "{formData.notes}"
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] text-on-surface-variant/85 pt-2">
                <span className="font-sans font-light">Total Requisitions: {items.length} Category Items</span>
                <span className="font-semibold text-primary">Est. Net Weight: {items.reduce((acc, i) => acc + (i.weightEstimate || 0), 0).toLocaleString()} kg</span>
              </div>
            </div>

            {/* Direct Whatsapp button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppURL()}
                target="_blank"
                rel="noreferrer"
                className="flex-[2] bg-secondary text-white hover:bg-primary py-3 px-4 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer rounded-none transition-colors duration-300"
              >
                <Send className="w-3.5 h-3.5" />
                Transfer Specifications to WhatsApp
              </a>
              <button
                onClick={() => {
                  onClearItems();
                  onClose();
                }}
                className="flex-1 px-4 py-3 border border-outline hover:bg-surface-container font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] cursor-pointer text-primary rounded-none transition-colors duration-300"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden font-sans text-sm">
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Added items review */}
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.15em] text-[#8b7355] block mb-2 font-bold">
                  Review Procurement Basket ({items.length})
                </span>
                
                {items.length === 0 ? (
                  <div className="border border-dashed border-outline-variant p-6 text-center text-on-surface-variant select-none rounded-none">
                    <p className="font-bold">Your quotation parameters are empty.</p>
                    <p className="text-xs mt-1">Please use the BOQ Estimator or click "Specs Sheet" in the catalog to add pipe categories.</p>
                  </div>
                ) : (
                  <div className="border border-outline-variant max-h-48 overflow-y-auto divide-y divide-outline-variant rounded-none">
                    {items.map(item => (
                      <div key={item.id} className="p-3 bg-surface-low flex justify-between gap-4 items-center transition-colors hover:bg-white rounded-none">
                        <div className="min-w-0">
                          <p className="font-semibold text-primary text-xs truncate uppercase font-sans tracking-wide">{item.productName}</p>
                          <p className="text-[10px] text-on-surface-variant/80 font-sans truncate">{item.details}</p>
                          <p className="text-[10px] text-secondary font-sans font-bold mt-1">
                            Length: {item.quantity.toLocaleString()} Meters
                            {item.weightEstimate ? ` (${item.weightEstimate.toLocaleString()} Kg est.)` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-on-surface-variant hover:text-[#8b7355] hover:bg-white p-1.5 rounded-none transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-sans tracking-[0.15em] text-[#8b7355] block mb-1.5 font-bold">
                  Procurement Officer Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase flex items-center gap-1.5 tracking-wide">
                      <FileText className="w-3.5 h-3.5 text-secondary" />
                      Representative Name *
                    </label>
                    <input
                      required
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="e.g. Bhargav Rajput"
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest rounded-none"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase flex items-center gap-1.5 tracking-wide">
                      <Building className="w-3.5 h-3.5 text-secondary" />
                      Company Name / Contractor Unit *
                    </label>
                    <input
                      required
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Civil Infrastructure Ltd"
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase flex items-center gap-1.5 tracking-wide">
                      <Phone className="w-3.5 h-3.5 text-secondary" />
                      Contact Mobile Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 72630 14111"
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest rounded-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase flex items-center gap-1.5 tracking-wide">
                      <Mail className="w-3.5 h-3.5 text-secondary" />
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. purchase@apexcivil.com"
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest rounded-none"
                    />
                  </div>
                </div>

                {/* State Region of installation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase flex items-center gap-1.5 tracking-wide">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      Delivery State *
                    </label>
                    <select
                      name="projectRegion"
                      value={formData.projectRegion}
                      onChange={handleInputChange}
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest rounded-none"
                    >
                      <option value="Maharashtra">Maharashtra (Dhule/Jalgaon Schemes)</option>
                      <option value="M.P.">Madhya Pradesh (Jal Nigam Tenders)</option>
                      <option value="Gujarat">Gujarat (Sujalam Sufalam supply)</option>
                      <option value="Other">Other Region State Supply</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans font-bold text-on-surface-variant uppercase tracking-wide">
                      Additional Specifications / Comments
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Need third party inspection SGS, direct site unloading."
                      rows={1}
                      className="w-full border border-outline-variant p-2.5 text-xs focus:border-secondary focus:ring-0 text-primary font-bold bg-surface-lowest resize-none rounded-none"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-surface-low border-t border-outline-variant flex flex-wrap gap-3 justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-primary font-sans uppercase tracking-[0.1em]">Pre-Hydrostatic Tested</p>
                <p className="text-[9px] text-on-surface-variant/85 font-sans tracking-wide">Quotes follow DIC and MSME limits.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 hover:bg-surface-high font-sans text-[10px] font-bold uppercase tracking-[0.15em] cursor-pointer text-primary rounded-none transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={items.length === 0}
                  className="px-6 py-2.5 bg-primary text-white hover:bg-secondary font-sans text-[10px] font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-40 disabled:hover:bg-primary cursor-pointer rounded-none"
                >
                  Submit specification Set
                </button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
