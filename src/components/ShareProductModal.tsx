import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  Printer, 
  Download, 
  Terminal, 
  Globe, 
  Layers, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';
import { Product } from '../types';

interface ShareProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ShareProductModal({ product, onClose }: ShareProductModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'bulletin' | 'raw'>('link');

  // Build the direct url. We support opening this specific product on mount using hashes.
  const directUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;

  const copyToClipboard = async (text: string, type: 'link' | 'markdown' | 'json') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else if (type === 'markdown') {
        setCopiedMarkdown(true);
        setTimeout(() => setCopiedMarkdown(false), 2000);
      } else if (type === 'json') {
        setCopiedJSON(true);
        setTimeout(() => setCopiedJSON(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Create technical Markdown datasheet for easy sharing in procurement emails/chats
  const generateMarkdownBulletin = () => {
    return `=== HITANSHI TRADING CORPORATION ===
TECHNICAL COMPLIANCE BULLETIN
Product Ref: ${product.name}
Subsegment: ${product.category}
Compliance Standard: ${product.specs.standard || 'IS / ISO Listed'}

[SPECIFICATIONS SUMMARY]
- Primary Standard: ${product.specs.standard || 'N/A'}
- Material Grade: ${product.specs.material || 'N/A'}
- Operating Rating: ${product.specs.pressure || 'Atmospheric pressure'}
- Dimensional Range: ${product.specs.diameterRange || 'Heavy Duty'}

[OPERATING PROPERTY MATRICES]
${product.technicalDetails.table.map(row => `| ${row.label} : ${row.value}`).join('\n')}

[CERTIFIED ADVANTAGES]
${product.technicalDetails.bullets.map(b => `- ${b}`).join('\n')}

URL Portal Direct Validation Query: ${directUrl}
`;
  };

  // JSON representation for API/database logging
  const generateJSONSchema = () => {
    return JSON.stringify({
      organization: "Hitanshi Trading Corporation",
      product_id: product.id,
      nomenclature: product.name,
      category: product.category,
      certification_standard: product.specs.standard || 'IS Listed',
      parameters: product.technicalDetails.table.reduce((acc, current) => {
        acc[current.label.toLowerCase().replace(/[^a-z0-9]/g, '_')] = current.value;
        return acc;
      }, {} as any),
      digital_signature: `HITANSHI-CERT-${product.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    }, null, 2);
  };

  // 3D Wireframe Canvas Loop customized to match the shared product
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let rotationAngle = 0;

    const resize = () => {
      canvas.width = 300;
      canvas.height = 300;
    };
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      rotationAngle += 0.015;

      // Projection values
      const pitch = -0.3 + Math.sin(rotationAngle * 0.3) * 0.08;
      const yaw = rotationAngle;

      // Project logic
      const projectNode = (x3d: number, y3d: number, z3d: number) => {
        const x1 = x3d * Math.cos(yaw) - z3d * Math.sin(yaw);
        const z1 = x3d * Math.sin(yaw) + z3d * Math.cos(yaw);
        const y2 = y3d * Math.cos(pitch) - z1 * Math.sin(pitch);
        const z2 = y3d * Math.sin(pitch) + z1 * Math.cos(pitch);

        const scale = 1.35;
        // Apply camera perspective shifting
        const fov = 350;
        const depthScale = fov / (fov + z2);

        return {
          sx: cx + x1 * scale * depthScale,
          sy: cy + y2 * scale * depthScale,
          sz: z2
        };
      };

      ctx.lineWidth = 0.65;

      // 1. Draw product-specific wireframe models
      if (product.id === 'hdpe-pipes' || product.id === 'pvc-pipes') {
        // CYLINDER PIPELINE WIREFRAME
        const length = 120;
        const slices = 9;
        const segments = 12;
        const radius = product.id === 'hdpe-pipes' ? 45 : 38;

        const projectedSlices: any[] = [];
        for (let s = 0; s < slices; s++) {
          const zPos = -length / 2 + (s / (slices - 1)) * length;
          const ringPoints: any[] = [];
          for (let seg = 0; seg < segments; seg++) {
            const angle = (seg / segments) * Math.PI * 2;
            ringPoints.push(projectNode(radius * Math.cos(angle), radius * Math.sin(angle), zPos));
          }
          projectedSlices.push(ringPoints);
        }

        // Render slices rings
        projectedSlices.forEach((slicePoints, sliceIdx) => {
          ctx.beginPath();
          slicePoints.forEach((pt: any, idx: number) => {
            if (idx === 0) ctx.moveTo(pt.sx, pt.sy);
            else ctx.lineTo(pt.sx, pt.sy);
          });
          ctx.closePath();
          ctx.strokeStyle = sliceIdx === 0 || sliceIdx === slices - 1 
            ? 'rgba(212, 163, 115, 0.45)' 
            : 'rgba(139, 115, 85, 0.18)';
          ctx.stroke();
        });

        // Longitudinal ribs
        for (let s = 1; s < slices; s++) {
          const prev = projectedSlices[s - 1];
          const curr = projectedSlices[s];
          for (let seg = 0; seg < segments; seg++) {
            ctx.beginPath();
            ctx.moveTo(prev[seg].sx, prev[seg].sy);
            ctx.lineTo(curr[seg].sx, curr[seg].sy);
            const flowLight = (seg + Math.floor(rotationAngle * 8)) % 4 === 0;
            ctx.strokeStyle = flowLight 
              ? 'rgba(14, 165, 233, 0.45)' 
              : 'rgba(255, 255, 255, 0.08)';
            ctx.stroke();
          }
        }

      } else if (product.id === 'industrial-motors') {
        // ROTOR / MOTOR GEAR ASSEMBLY MESH
        const coreLength = 80;
        const coilCount = 8;
        const fanBlades = 6;
        const radius = 32;

        // Render outer rotor barrel
        const ringFront = [];
        const ringBack = [];
        for (let seg = 0; seg < 12; seg++) {
          const angle = (seg / 12) * Math.PI * 2;
          ringFront.push(projectNode(radius * Math.cos(angle), radius * Math.sin(angle), -coreLength / 2));
          ringBack.push(projectNode(radius * Math.cos(angle), radius * Math.sin(angle), coreLength / 2));
        }

        // Draw circles
        ctx.beginPath();
        ringFront.forEach((p, i) => i === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.4)';
        ctx.stroke();

        ctx.beginPath();
        ringBack.forEach((p, i) => i === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.strokeStyle = 'rgba(212, 163, 115, 0.4)';
        ctx.stroke();

        // Longitudinal chassis ribs
        for (let seg = 0; seg < 12; seg++) {
          ctx.beginPath();
          ctx.moveTo(ringFront[seg].sx, ringFront[seg].sy);
          ctx.lineTo(ringBack[seg].sx, ringBack[seg].sy);
          ctx.strokeStyle = seg % 3 === 0 ? 'rgba(14, 165, 233, 0.35)' : 'rgba(255, 255, 255, 0.06)';
          ctx.stroke();
        }

        // Rotating rotor coils
        for (let i = 0; i < coilCount; i++) {
          const coilAngle = (i / coilCount) * Math.PI * 2 + rotationAngle * 0.5;
          const p1 = projectNode(0, 0, -coreLength * 0.6);
          const p2 = projectNode((radius + 15) * Math.cos(coilAngle), (radius + 15) * Math.sin(coilAngle), 0);
          const p3 = projectNode(0, 0, coreLength * 0.6);

          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.strokeStyle = 'rgba(139, 115, 85, 0.2)';
          ctx.stroke();
        }

      } else {
        // WATER TANK SYSTEM MESH
        const height = 90;
        const radius = 45;
        const ribSlices = 7;

        const rings: any[] = [];
        for (let r = 0; r < ribSlices; r++) {
          const ratio = r / (ribSlices - 1);
          // Scale dome shape at top of tank
          const currRad = ratio > 0.7 
            ? radius * (1 - (ratio - 0.7) / 0.3 * 0.4) 
            : radius;
          const yPos = -height / 2 + ratio * height;

          const ringPoints = [];
          for (let seg = 0; seg < 12; seg++) {
            const angle = (seg / 12) * Math.PI * 2;
            ringPoints.push(projectNode(currRad * Math.cos(angle), yPos, currRad * Math.sin(angle)));
          }
          rings.push(ringPoints);
        }

        // Render rings
        rings.forEach((ring, idx) => {
          ctx.beginPath();
          ring.forEach((p: any, i: number) => i === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy));
          ctx.closePath();
          ctx.strokeStyle = idx === rings.length - 1 
            ? 'rgba(212, 163, 115, 0.45)' 
            : 'rgba(139, 115, 85, 0.16)';
          ctx.stroke();
        });

        // Vertical ribs
        for (let seg = 0; seg < 12; seg++) {
          ctx.beginPath();
          for (let r = 0; r < ribSlices; r++) {
            const p = rings[r][seg];
            if (r === 0) ctx.moveTo(p.sx, p.sy);
            else ctx.lineTo(p.sx, p.sy);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.stroke();
        }
      }

      // 2. Blueprint target overlay indicators
      ctx.strokeStyle = 'rgba(139, 115, 85, 0.05)';
      ctx.lineWidth = 0.5;
      
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 105, 0, Math.PI * 2);
      ctx.stroke();

      // Scan scope line
      const scanY = cy + Math.sin(Date.now() / 400) * 85;
      ctx.fillStyle = 'rgba(212, 163, 115, 0.04)';
      ctx.fillRect(cx - 75, scanY - 1, 150, 2);

      // Radar pulse ring
      const pulseS = (Date.now() / 24) % 150;
      ctx.strokeStyle = `rgba(139, 115, 85, ${Math.max(0, 1 - pulseS / 150) * 0.15})`;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseS, 0, Math.PI * 2);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [product]);

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto select-none font-mono">
      {/* Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-[#0b0b0e] border border-secondary/30 w-full max-w-4xl shadow-2xl overflow-hidden rounded-3xl flex flex-col text-white"
      >
        {/* Subtle engineering line in top background */}
        <div 
          className="absolute inset-x-0 h-48 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,115,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,115,85,0.3) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Diagonal industrial striping top boarder */}
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-amber-500 to-secondary animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-white/5 relative z-10 bg-[#0e0e11]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/15 border border-secondary/40 text-secondary">
              <Share2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[8.5px] tracking-[0.25em] text-[#8b7355] font-extrabold block">TECHNICAL CATALOGUE ROUTING</span>
              <h2 className="text-base sm:text-lg font-serif italic text-white leading-normal font-light mt-0.5">
                Share Specifications / {product.name}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all cursor-pointer text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body split to Left (Snapshot / Spec Card Preview) and Right (Sharing Engine) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-6 relative z-10 overflow-y-auto max-h-[70vh]">
          
          {/* LEFT COLUMN: Animated Specimen Blueprint Card Display */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <span className="text-[9px] text-white/40 tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#8b7355]" /> DIGITAL BLUEPRINT SNAPSHOT
            </span>

            {/* Glowing Blueprint Specimen Display Card */}
            <div className="bg-[#111115] border border-secondary/20 p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between aspect-square group shadow-xl">
              <div className="absolute inset-0 bg-radial from-transparent via-[#111115]/50 to-[#111115] z-10 pointer-events-none" />
              
              {/* Spinning 3D Wireframe Canvas Viewport */}
              <div className="absolute inset-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="block pointer-events-none filter brightness-110" />
              </div>

              {/* Stamp markings inside blueprint */}
              <div className="relative z-20 flex justify-between items-start">
                <div className="flex flex-col text-[8px] bg-black/60 backdrop-blur-md border border-white/5 p-2 rounded-lg leading-normal">
                  <span className="text-secondary font-bold">MODEL TYPE</span>
                  <span className="text-white/80 font-mono mt-0.5">{product.category}</span>
                </div>
                <div className="text-right flex flex-col text-[8.5px] leading-relaxed select-all">
                  <span className="text-[6.5px] text-emerald-400 font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                    🔒 GENUINE BIS
                  </span>
                  <span className="text-white/30 text-[7px] font-mono mt-1 font-bold">REV-2026.05.27</span>
                </div>
              </div>

              {/* Bottom tag metrics inside blueprint */}
              <div className="relative z-20 bg-black/75 backdrop-blur-sm border border-white/5 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-white font-serif font-bold italic truncate">{product.technicalDetails.title}</span>
                  <span className="text-[8px] text-secondary font-mono tracking-wide">{product.specs.standard}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px] text-white/60 border-t border-white/5 pt-1.5 font-mono">
                  <span>Standard: {product.specs.standard || 'N/A'}</span>
                  <span>Pressure: {product.specs.pressure || 'Atmospheric'}</span>
                </div>
              </div>
            </div>

            {/* Print release button */}
            <button
              onClick={() => window.print()}
              className="w-full py-2.5 bg-gradient-to-r from-stone-900 to-[#111115] border border-white/10 hover:border-secondary text-[#ebd9c5] hover:text-white transition-all cursor-pointer font-sans text-[10px] uppercase tracking-wider rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Open PDF Datasheet Bulletin
            </button>
          </div>

          {/* RIGHT COLUMN: Configuration Routing Center */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              <span className="text-[9px] text-white/40 tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8b7355]" /> SHARING PROTOCOLS &amp; LINK PIPING
              </span>

              {/* Protocol Tab selector */}
              <div className="flex border-b border-white/5 p-1 bg-black/40 rounded-xl">
                <button
                  onClick={() => setActiveTab('link')}
                  className={`flex-1 py-2 text-center text-[10px] tracking-wide uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'link' 
                      ? 'bg-[#8b7355] text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Direct Link
                </button>
                <button
                  onClick={() => setActiveTab('bulletin')}
                  className={`flex-1 py-2 text-center text-[10px] tracking-wide uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'bulletin' 
                      ? 'bg-[#8b7355] text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Markdown Brochure
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`flex-1 py-2 text-center text-[10px] tracking-wide uppercase font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === 'raw' 
                      ? 'bg-[#8b7355] text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  JSON Spec
                </button>
              </div>

              {/* Protocol View Container */}
              <div className="bg-[#101014] border border-white/5 p-4 rounded-2xl min-h-[160px] flex flex-col justify-between space-y-3">
                {activeTab === 'link' && (
                  <div className="space-y-3.5">
                    <div>
                      <h4 className="text-[10px] text-secondary font-bold uppercase tracking-wider">Secure Deep-Link Verification</h4>
                      <p className="text-[11px] text-white/70 font-sans font-light leading-relaxed mt-1">
                        Use this direct Deep Link. When other procurement officers open the link, the portal will skip background loadings and securely launch this technical catalog sheet immediately.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-stretch">
                      <input 
                        type="text" 
                        readOnly 
                        value={directUrl}
                        className="flex-grow bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-amber-100/90 focus:outline-none focus:ring-1 focus:ring-secondary leading-normal"
                      />
                      <button
                        onClick={() => copyToClipboard(directUrl, 'link')}
                        className={`px-4 rounded-xl cursor-pointer font-sans text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all outline-none ${
                          copiedLink 
                            ? 'bg-emerald-600 text-white border border-transparent' 
                            : 'bg-secondary hover:bg-white text-white hover:text-primary border border-secondary'
                        }`}
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'bulletin' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] text-secondary font-bold uppercase tracking-wider">Industrial Catalog Markdown</h4>
                      <button
                        onClick={() => copyToClipboard(generateMarkdownBulletin(), 'markdown')}
                        className={`px-3 py-1 bg-white/5 hover:bg-white/[0.12] border border-white/10 rounded-lg text-[8.5px] uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                          copiedMarkdown ? 'text-emerald-400' : 'text-white/70'
                        }`}
                      >
                        {copiedMarkdown ? <Check className="w-3 h-3 animate-bounce" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMarkdown ? 'Brochure Copied' : 'Copy Markdown'}</span>
                      </button>
                    </div>
                    <textarea 
                      readOnly
                      rows={5}
                      value={generateMarkdownBulletin()}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[9.5px] font-mono text-emerald-300 leading-normal focus:outline-none h-[115px] select-all overflow-y-auto"
                    />
                  </div>
                )}

                {activeTab === 'raw' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] text-secondary font-bold uppercase tracking-wider">Digital Ledger Record (JSON)</h4>
                      <button
                        onClick={() => copyToClipboard(generateJSONSchema(), 'json')}
                        className={`px-3 py-1 bg-white/5 hover:bg-white/[0.12] border border-white/10 rounded-lg text-[8.5px] uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                          copiedJSON ? 'text-emerald-400' : 'text-white/70'
                        }`}
                      >
                        {copiedJSON ? <Check className="w-3 h-3 animate-bounce" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedJSON ? 'JSON Copied' : 'Copy JSON'}</span>
                      </button>
                    </div>
                    <textarea 
                      readOnly
                      rows={5}
                      value={generateJSONSchema()}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[9.5px] font-mono text-blue-300 leading-normal focus:outline-none h-[115px] select-all overflow-y-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action notices/tips */}
            <div className="p-3 bg-[#111115] border border-yellow-500/10 rounded-xl flex items-start gap-2.5 text-[10px] text-[#ebd9c5] leading-relaxed font-sans mt-auto">
              <span className="text-[12px] shrink-0">💡</span>
              <p>
                <strong className="text-secondary font-bold">Snapshot tip:</strong> Direct link routing supports query parsing. Share this URL with your procurement committee or store it inside standard tender document files for direct specification validations.
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-white/5 bg-[#08080a] flex flex-wrap justify-between items-center gap-3 relative z-10 text-[8px] sm:text-[9px] uppercase tracking-wider text-white/40">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-secondary" /> SECURE INDUSTRIAL COGNITION HANDSHAKE
          </span>
          <span className="italic font-light">
            Hitanshi Trading Corp
          </span>
        </div>

      </motion.div>
    </div>
  );
}
