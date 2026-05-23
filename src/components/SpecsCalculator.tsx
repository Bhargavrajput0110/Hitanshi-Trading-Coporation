import { useState, useMemo } from 'react';
import { Ruler, Award, Plus, Calculator, Check, ShoppingBag } from 'lucide-react';
import { HDPE_SPEC_CATALOG, PVC_SPEC_CATALOG } from '../data';

interface SpecsCalculatorProps {
  onAddToQuote: (item: {
    productName: string;
    category: string;
    details: string;
    quantity: number;
    weightEstimate: number;
  }) => void;
}

export default function SpecsCalculator({ onAddToQuote }: SpecsCalculatorProps) {
  const [material, setMaterial] = useState<'HDPE' | 'PVC'>('HDPE');
  const [diameterIdx, setDiameterIdx] = useState<number>(4); // Default to 110mm
  const [sdrIdx, setSdrIdx] = useState<number>(3); // Default to SDR 17 / PN6
  const [length, setLength] = useState<number>(500); // 500 meters default
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Pick the catalog based on material selection
  const catalog = useMemo(() => {
    return material === 'HDPE' ? HDPE_SPEC_CATALOG : PVC_SPEC_CATALOG;
  }, [material]);

  // Adjust SDR selection if catalog index out of bounds on material toggle
  const currentPipeSpec = useMemo(() => {
    const pipe = catalog[diameterIdx] || catalog[0];
    return pipe;
  }, [catalog, diameterIdx]);

  const currentSdrSpec = useMemo(() => {
    const sdr = currentPipeSpec?.sdrOptions[sdrIdx] || currentPipeSpec?.sdrOptions[0];
    return sdr;
  }, [currentPipeSpec, sdrIdx]);

  // When material swaps, safely correct indexes
  const handleMaterialChange = (newMaterial: 'HDPE' | 'PVC') => {
    setMaterial(newMaterial);
    setDiameterIdx(material === 'HDPE' ? 2 : 2); // default safely
    setSdrIdx(0);
  };

  const handlePipeChange = (idx: number) => {
    setDiameterIdx(idx);
    setSdrIdx(0); // reset thickness choice to prevent overflow indexes
  };

  // Math-heavy Calculations:
  // Weight per meter (kg/m) = pi * thickness * (OD - thickness) * density / 1000
  // HDPE density: 0.955 g/cm³
  // PVC density: 1.40 g/cm³
  const computedValues = useMemo(() => {
    if (!currentPipeSpec || !currentSdrSpec) {
      return { kgPerMeter: 0, weightPerBar: 0, totalWeightKg: 0, totalWeightTonnes: 0 };
    }
    const od = currentPipeSpec.od;
    const thickness = currentSdrSpec.thickness;
    const density = material === 'HDPE' ? 0.955 : 1.40;

    const kgPerMeter = Math.PI * thickness * (od - thickness) * density / 1000;
    const weightPerBar = kgPerMeter * 6; // Standard 6 meter bar
    const totalWeightKg = kgPerMeter * length;
    const totalWeightTonnes = totalWeightKg / 1000;

    return {
      kgPerMeter: Number(kgPerMeter.toFixed(3)),
      weightPerBar: Number(weightPerBar.toFixed(2)),
      totalWeightKg: Math.round(totalWeightKg),
      totalWeightTonnes: Number(totalWeightTonnes.toFixed(2))
    };
  }, [currentPipeSpec, currentSdrSpec, material, length]);

  const handleAddToQuoteBag = () => {
    if (!currentPipeSpec || !currentSdrSpec) return;
    
    const details = `${currentPipeSpec.od}mm OD, Wall Thickness: ${currentSdrSpec.thickness}mm, Rating: ${currentSdrSpec.pn} (SDR ${currentSdrSpec.sdr})`;
    onAddToQuote({
      productName: `${material} High Performance Infrastructure Pipe`,
      category: material,
      details,
      quantity: length,
      weightEstimate: computedValues.totalWeightKg
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  return (
    <div id="calculator-section" className="bg-surface-lowest border border-outline-variant overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      
      {/* Input controls panel */}
      <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
        <div>
          <span className="text-secondary font-sans text-xs uppercase tracking-[0.2em] font-bold">Procurement Helper</span>
          <h3 className="text-2xl font-light font-serif tracking-tight text-primary mt-1.5">
            Pipeline Bill-of-Quantities (BOQ) <span className="italic">Estimator</span>
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant/85 font-sans font-light mt-1.5">
            Compute real-time structural payload weights for tender submission layouts.
          </p>
        </div>

        {/* Material Selection */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-bold">
            1. Select Infrastructure Medium
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleMaterialChange('HDPE')}
              className={`p-3 text-left border flex items-center justify-between cursor-pointer transition-all rounded-none ${
                material === 'HDPE'
                  ? 'border-primary bg-surface-container text-primary font-bold'
                  : 'border-outline-variant hover:border-primary text-on-surface-variant bg-surface-lowest'
              }`}
            >
              <div>
                <p className="text-sm font-semibold font-sans">HDPE (PE-100)</p>
                <p className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] mt-1 font-bold">Standard: IS 4984</p>
              </div>
              <span className="text-[9px] bg-primary text-white font-sans px-1.5 py-0.5 uppercase tracking-wider">0.955</span>
            </button>

            <button
              onClick={() => handleMaterialChange('PVC')}
              className={`p-3 text-left border flex items-center justify-between cursor-pointer transition-all rounded-none ${
                material === 'PVC'
                  ? 'border-primary bg-surface-container text-primary font-bold'
                  : 'border-outline-variant hover:border-primary text-on-surface-variant bg-surface-lowest'
              }`}
            >
              <div>
                <p className="text-sm font-semibold font-sans">Rigid PVC (uPVC)</p>
                <p className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] mt-1 font-bold">Standard: IS 4985</p>
              </div>
              <span className="text-[9px] bg-primary text-white font-sans px-1.5 py-0.5 uppercase tracking-wider">1.400</span>
            </button>
          </div>
        </div>

        {/* Outer Diameter (OD) */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-bold">
            2. Outer Diameter (OD Size)
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {catalog.map((pipe, idx) => (
              <button
                key={pipe.od}
                onClick={() => handlePipeChange(idx)}
                className={`py-2 text-center border font-sans text-[11px] font-semibold transition-all cursor-pointer rounded-none ${
                  diameterIdx === idx
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant hover:border-primary hover:bg-surface-container text-on-surface'
                }`}
              >
                {pipe.od} mm
              </button>
            ))}
          </div>
        </div>

        {/* SDR/Pressure Ratings */}
        <div>
          <label className="block text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant mb-2.5 font-bold">
            3. Standard Dimension Ratio (SDR) & Operating Pressure Rating
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPipeSpec?.sdrOptions.map((opt, idx) => (
              <button
                key={opt.sdr}
                onClick={() => setSdrIdx(idx)}
                className={`p-3 text-left border flex items-center justify-between transition-all cursor-pointer rounded-none ${
                  sdrIdx === idx
                    ? 'border-primary bg-surface-low text-primary ring-1 ring-primary'
                    : 'border-outline-variant hover:border-primary text-on-surface-variant bg-surface-lowest'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-primary font-sans tracking-wide">{opt.pn}</p>
                  <p className="text-[9px] text-[#8b7355] font-sans uppercase tracking-wider">SDR Rating: {opt.sdr}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary font-sans font-bold block">{opt.thickness} mm</span>
                  <span className="text-[8px] text-on-surface-variant uppercase font-sans tracking-wide">Thickness</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Project Pipeline Length */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[10px] font-sans tracking-[0.15em] uppercase text-on-surface-variant font-bold">
              4. Project Pipe Quantity (Meters)
            </label>
            <span className="text-xs font-sans font-bold text-primary bg-surface-container px-3 py-1 border border-outline-variant">
              {length.toLocaleString()} Meters
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1 bg-outline-variant rounded-none appearance-none cursor-pointer accent-secondary"
            />
            <input
              type="number"
              min="1"
              value={length}
              onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
              className="w-24 border border-outline-variant px-2 py-1.5 text-xs text-right font-sans focus:border-primary active:border-primary text-primary font-bold rounded-none"
            />
          </div>
        </div>

      </div>

      {/* Output results panel */}
      <div className="lg:col-span-5 bg-surface-low border-t lg:border-t-0 lg:border-l border-outline-variant p-6 md:p-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-outline-variant/60 pb-3 text-primary">
            <Calculator className="w-4 h-4 text-secondary" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Calculated Specifications</h4>
          </div>

          {/* Results specs display */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-light font-sans">Class Standard</span>
              <span className="text-xs font-bold text-primary font-sans">
                {material === 'HDPE' ? 'IS 4984 : 2016' : 'IS 4985 : 2021'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-light font-sans">Nominal Diameter</span>
              <span className="text-xs font-bold text-primary font-sans">
                {currentPipeSpec?.od} mm (OD Size)
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-light font-sans">PN Pressure Code</span>
              <span className="text-xs font-bold text-secondary font-sans tracking-wide">
                {currentSdrSpec?.pn}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-light font-sans">Estimated Weight (Meter)</span>
              <span className="text-sm font-semibold text-primary font-sans">
                {computedValues.kgPerMeter} kg / meter
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
              <span className="text-xs text-on-surface-variant font-light font-sans">Standard Length Bar (6m)</span>
              <span className="text-xs font-semibold text-primary font-sans">
                ~ {computedValues.weightPerBar} kg / joint
              </span>
            </div>
          </div>

          {/* Huge Payload weight container */}
          <div className="bg-surface-lowest p-5 border border-outline-variant space-y-2.5">
            <span className="text-[9px] uppercase font-sans tracking-[0.15em] text-[#8b7355] block font-bold">
              Cumulative Payload Weight
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-light font-serif text-primary select-all">
                {computedValues.totalWeightKg.toLocaleString()}
              </span>
              <span className="text-xs text-on-surface-variant font-bold font-sans uppercase tracking-widest">Kg</span>
            </div>
            <div className="text-[11px] text-on-surface-variant/85 leading-relaxed font-sans font-light">
              Equates to approx. <span className="font-semibold text-primary">{computedValues.totalWeightTonnes} Metric Tonnes</span> of raw pipeline polymer material.
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleAddToQuoteBag}
            className={`w-full py-4 px-6 font-semibold uppercase tracking-[0.2em] text-[10px] sm:text-xs font-sans transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-none ${
              addedSuccess
                ? 'bg-emerald-600 text-white border border-transparent'
                : 'bg-primary hover:bg-[#8b7355] text-white border border-transparent'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added successfully!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add BOQ To Quote Draft
              </>
            )}
          </button>
          <p className="text-[9px] text-center text-on-surface-variant/75 font-sans tracking-wide">
            *Theoretical mass base calculation values under ambient 27°C. Actual structural weights may vary by ±1.2%.
          </p>
        </div>

      </div>

    </div>
  );
}
