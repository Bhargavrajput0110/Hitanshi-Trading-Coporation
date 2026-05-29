import { Product, ServiceSector } from './types';

export const ALL_PRODUCTS: Product[] = [
  {
    id: 'hdpe-pipes',
    category: 'HDPE',
    name: 'HDPE & MDPE Pipes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClqbmLg_6e5MBqCAzpxhTip_iv2gq5QwnIqaUdoRFurA-nKRlNskQ9hmCN1OCZ4i14n64syOAAgtGwjJhpXYkDKYSOL-IYU_xePi-aNnw732okGIGMpw3gLs1OrIOGJXAlc8cc36wbjSKYY5Z95N01i53hQgwy6ebl2LnjtAPJUxJx-tQq1zQUF_3sH7RtUDZTa0gXSqZxIz-F_wxkvUN24YFzxPaC1dZ1QotbToA1pSX5-De8j-BH02dDKeBVwmhfUYdNFO_hUg',
    tagline: 'Delivering state-scale infrastructure permanence',
    description: 'High-Density Polyethylene pipes crafted from virgin PE100 & PE80 grades. Engineered to withstand high operational pressures and seismic shifts.',
    badge: 'State Certified Supplier',
    specs: {
      standard: 'IS 4984 / 14333',
      pressure: 'PN 2.5 to PN 20',
      application: 'Drinking Water / Gas',
      durability: '50+ Years',
      material: 'PE-100 / PE-80 Virgin Resin',
      diameterRange: '20mm to 1000mm'
    },
    technicalDetails: {
      title: 'High-Density Polyethylene Pipe Specifications (IS:4984 / 14333)',
      table: [
        { label: 'Reference Code', value: 'Indian Standard IS 4984 / IS 14333' },
        { label: 'Size Range', value: '20 mm to 1000 mm outer diameter' },
        { label: 'SDR Ratio Range', value: 'SDR 41, 26, 21, 17, 13.6, 11, 9, 7.4' },
        { label: 'Pressure Classes', value: 'PN 2.5 (0.25 MPa) up to PN 20 (2.0 MPa)' },
        { label: 'Available Lengths', value: 'Coils of 100m/200m (up to 110mm OD) & straight bars of 6m/12m' },
        { label: 'Color Markings', value: 'Jet Black with solid Blue lines (Water) or Yellow lines (Gas/MDPE)' }
      ],
      bullets: [
        '100% resistance to corrosion, scaling, and chemical build-up.',
        'Extremely lightweight compared to concrete/cast iron, cutting transport costs by 70%.',
        'Incredibly flexible jointing via butt-welding (electrofusion) ensuring a zero-leak monoline.',
        'High impact resistance prevents fractures during rough handling and rocky terrain lay.'
      ]
    }
  },
  {
    id: 'industrial-motors',
    category: 'Motors',
    name: 'Industrial Motors',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tagline: 'Premium high-efficiency pumping powerhouses',
    description: 'High-efficiency Floshakti premium electric motors engineered for prolonged, unyielding operation in grueling municipal water intakes.',
    badge: 'Premium Efficiency',
    specs: {
      standard: 'IS 12615 / IEC 60034',
      efficiency: 'IE3 / IE4 Rated',
      application: 'Water Supply / Heavies',
      durability: 'Continuous Duty (S1)',
      material: 'Cast Iron Frame (FC200+)',
      diameterRange: 'Shaft 19mm to 110mm'
    },
    technicalDetails: {
      title: 'Floshakti Premium Pumping Motor Technical Summary',
      table: [
        { label: 'Standard Rating', value: 'IE3 Premium / IE4 Super Premium Efficiency' },
        { label: 'Power Range', value: '3.7 kW to 375 kW (5 HP to 500 HP)' },
        { label: 'Enclosure Rating', value: 'IP55 Dust-tight & Weather-proof' },
        { label: 'Cooling Design', value: 'TEFC (Totally Enclosed Fan Cooled)' },
        { label: 'Voltage Options', value: '415V Three Phase ± 10%, 50Hz/60Hz frequency supply' },
        { label: 'Insulation Class', value: 'Class F with Class B temperature rise limits' }
      ],
      bullets: [
        'Stator cores constructed with cold-rolled silicon steel sheet laminations for ultra-low core loss.',
        'High-grade copper coils featuring double-insulated enameled wires with vacuum pressure impregnation (VPI).',
        'Heavy-duty cast-iron housing designed to eliminate vibration under peak mechanical loads.',
        'Equipped with premium deep-groove ball bearings with high-temperature grease for extended life.'
      ]
    }
  },
  {
    id: 'pvc-pipes',
    category: 'PVC',
    name: 'PVC Infrastructure & Conduits',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKdEjBPdoHm5jHubEUWaRop3CiUm-2afLvqCsmzwkZNgN59UN60tB0mjgATzRpuuiKrrplQsBPSUFj22F-k0bBym1tp9WK9GFOJPKprxvtnbrHKAiGDPX_cbhJvb212NiG8leANJXuEbgorsc1Q7L3v-4TGF6Qz02yFpK0FPgxwbHZiaSDoZAiegKftuI3mMRb03L7GRf8XqFCs09XZiKPTMrvSCCY8br000POxGDz3-TbMojA4sTBfUdMj3QWX6DvOwMZivsaFg',
    tagline: 'Rigid PVC solutions for municipal drainage and conduits',
    description: 'Rigid Unplasticized Polyvinyl Chloride (uPVC) plumbing and casing pipes designed for heavy structural resilience and agricultural distribution.',
    badge: 'High Stiffness',
    specs: {
      standard: 'IS 4985 / 12818',
      pressure: '2.5 to 10 kgf/cm²',
      application: 'Drainage & Agriculture',
      durability: 'Long-term ground burial',
      material: 'uPVC rigid polymer resin',
      diameterRange: '20mm to 315mm'
    },
    technicalDetails: {
      title: 'Rigid PVC Infrastructure Pipes Technical Specifications',
      table: [
        { label: 'Standard Standard Code', value: 'IS 4985:2021 (Pressure Pipes) & IS 12818 (Water Casing)' },
        { label: 'Sizes range', value: '20 mm to 315 mm exterior diameter' },
        { label: 'Pressure Index', value: 'Class 1 (2.5 kg/cm²), Class 2 (4 kg/cm²), Class 3 (6 kg/cm²), Class 4 (10 kg/cm²)' },
        { label: 'Jointing Mechanism', value: 'Self-fit socket or Ring-fit (Elastomeric sealing ring) joints' },
        { label: 'Lead Composition', value: '100% Lead-Free safe for potable agriculture grids' }
      ],
      bullets: [
        'Perfect chemical neutrality: Will not alter water taste or support any bacteriological growth.',
        'High structural stiffness prevents collapse even when buried under dynamic sub-base road loads.',
        'Smooth hydraulic friction factor (Hazen-Williams C = 150) reduces pumping friction and power losses.',
        'Supplied with specialized elastomeric rings ensuring watertight seal under continuous ground settlement.'
      ]
    }
  },
  {
    id: 'water-tanks',
    category: 'Tanks',
    name: 'Bulk Storage Water Tanks',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    tagline: 'Heavy-duty multilayer storage for municipal grids',
    description: 'Advanced rotational-molded high capacity polymer storage tanks with certified food-grade inner liners and carbon-reinforced UV blocks.',
    badge: 'Triple Layer Shield',
    specs: {
      standard: 'IS 12701',
      pressure: 'Atmospheric bulk storage',
      application: 'Municipal & Large Offices',
      durability: '100% UV Protection',
      layers: 'Triple-Layer with Foam Insulator',
      grade: 'Virgin Linear Low-Density LLDPE'
    },
    technicalDetails: {
      title: 'Multilayer Heavy Duty Water Storage Tank Specs',
      table: [
        { label: 'Conformity Metric', value: 'Bureau of Indian Standards IS 12701:1996' },
        { label: 'Volumetric Scale', value: '500 Liters to 10,000 Liters standard supply base' },
        { label: 'Layer Composition', value: 'Outer (UV Protect White/Orange), Middle (Thermal Foam), Inner (Potable Blue Sheet)' },
        { label: 'Thermal Shielding', value: 'Reflects 95% of direct infra-red radiation, keeping stored water cool.' },
        { label: 'Base Support Layout', value: 'Uniform distributed flat concrete plinth setup' }
      ],
      bullets: [
        'Inner-most layer uses 100% food-grade virgin LLDPE with active antimicrobial silver-ion additives.',
        'Engineered ribs design on vertical columns prevents wall bulging when fully stored.',
        'Hermetically threaded threaded caps prevent entry of insects and heavy dust storms.',
        'Built-in lifting brass-molded eyelets for convenient rigging onto high structural roofs.'
      ]
    }
  },
  {
    id: 'di-pipes',
    category: 'DI',
    name: 'Ductile Iron (DI) Pipes & Fittings',
    image: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&w=800&q=80',
    tagline: 'Super-strength conduits for municipal bulk pipelines',
    description: 'Centrifugally cast Ductile Iron pipes of Class K7/K9 standards with high-durability internal cement mortar lining. Designed to master high pressure limits.',
    badge: 'K7 / K9 Premium Class',
    specs: {
      standard: 'IS 8329 / 1536 / 1538',
      pressure: 'Class K7 / K9 Heavy Duty',
      application: 'Water Supply & Sewerage',
      durability: '100+ Years Lifetime',
      material: 'Spheroidal Graphite Cast Iron',
      diameterRange: '80mm to 1200mm'
    },
    technicalDetails: {
      title: 'Centrifugally Cast Ductile Iron Fittings Specification',
      table: [
        { label: 'Standard Rating', value: 'Indian Standards IS 8329 / IS 1536 / IS 1538' },
        { label: 'Quality Classes', value: 'Class K7 and Class K9 high pressure ratings' },
        { label: 'External Coating', value: 'Metallic Zinc coating with blue/black finishing layer' },
        { label: 'Internal Lining', value: 'Portland Cement Mortar lining ensuring clean hydraulic flow' },
        { label: 'End Connections', value: 'Spigot & Socket (Tyton push-on) or Double Flanged (DF) Joints' },
        { label: 'Recommended Use', value: 'High dynamic bulk gravity mains & urban sewage lines' }
      ],
      bullets: [
        'Superb tensile strength and elongation metrics protecting pipeline systems from high earth load shifting.',
        'Mortar active lining creates alkaline medium shielding pipe interior from aggressive soft flow water corroding.',
        'Extremity of impact resistance makes it perfect for overhead river crossings, bridge loops and deep burials.',
        'Complies strictly with certified tender specifications, approved makes, and client-centric designs.'
      ]
    }
  }
];

export const STRATEGIC_SECTORS: ServiceSector[] = [
  {
    id: 'jjm',
    code: '01',
    name: 'JJM',
    fullTitle: 'Jal Jeevan Mission',
    description: 'Providing functional household tap connections (FHTC) to rural residences. Hitanshi supplies custom HDPE pipelines to connect village intake pumps directly to overhead steel containers.',
    missionDetails: [
      'Supplied over 8 Lakh meters of high-durability PE100 pipes in 63mm to 110mm diameters for village networks.',
      'Active supply in Jalgaon, Dhule, and Nashik rural distribution grids.',
      'Approved manufacturer list across national drinking water project contractors.'
    ]
  },
  {
    id: 'mjp',
    code: '02',
    name: 'MJP',
    fullTitle: 'Maharashtra Jeevan Pradhikaran',
    description: 'Modernizing state water supply systems and sewage treatments. We coordinate supply with top-tier registered civil contractors to ensure quick dispatch to project sites.',
    missionDetails: [
      'Approved partner for major urban water supply schemes spanning urban corridors.',
      'Robust logistics matching strict timeline requirements of municipal councils.',
      'Includes mandatory third-party inspection (SGS, TUV, Bureau Veritas) documentation compliance.'
    ]
  },
  {
    id: 'irrigation',
    code: '03',
    name: 'IRRIGATION',
    fullTitle: 'Agri Infrastructure Support',
    description: 'Delivering resilient, crack-free PVC and HDPE micro-sprinkler and drip line mains for high-efficiency sub-surface agricultural networks across central India.',
    missionDetails: [
      'Enables high pressure irrigation flows without rupture, reducing water loss in canal distributions.',
      'High resistance to dynamic temperature swings typical in dryland farm areas of MP & Maharashtra.',
      'Helps dryland farmers optimize pump power via friction-reduced interior flows.'
    ]
  },
  {
    id: 'nu',
    code: '04',
    name: 'NU',
    fullTitle: 'Nagar Utthan Mission',
    description: 'Supplying raw material to civic corporations for stormwater drainage systems, utility protective casing, and core urban development grids.',
    missionDetails: [
      'Supplying high stiffness rigid PVC conduits for underground high voltage transmission wire casing.',
      'Specialized double walled corrugation structures for heavy urban sewer loads.',
      'On-demand emergency supplies to municipal breakdown zones.'
    ]
  },
  {
    id: 'midc',
    code: '05',
    name: 'MIDC',
    fullTitle: 'Industrial Development Corp',
    description: 'Fulfilling specialized heavy-duty pipeline infrastructure for liquid industrial chemical drains and process water loops in industrial zones.',
    missionDetails: [
      'Process chemical routing pipes in dense industrial corridors.',
      'Supply of IE3/IE4 heavy-duty electric motor driven raw water pumping plants.',
      'Certified compliant with strict chemical effluent discharge standards.'
    ]
  },
  {
    id: 'wdc',
    code: '06',
    name: 'WDC',
    fullTitle: 'Water Resources Dept',
    description: 'Contributing heavy-duty piping systems for massive river river link schemes, dam spillway intake motors, and secondary irrigation canals.',
    missionDetails: [
      'Bulk supply of Large Diameter (up to 630mm) PE100 high-pressure distribution lines.',
      'Extreme weathering resistance for above-ground pipes on riverbanks.',
      'Long-term durability validation testing documentation logs.'
    ]
  },
  {
    id: 'mpjnm',
    code: '07',
    name: 'MPJNM',
    fullTitle: 'M.P. Jal Nigam Maryadit',
    description: 'Expanding pure drinking water grids across rural Madhya Pradesh. We manage rapid delivery corridors of top quality pipes directly to Malwa and Nimar divisions.',
    missionDetails: [
      'Supplied more than 10 Lakh meters of ISI marked pipes for multi-village schemes (MVS).',
      'Dedicated logistics tracking to remote rural installation coordinates.',
      'Pre-tested batches backed by government lab hydrostatic compression stamps.'
    ]
  }
];

// Technical specifications density database for computation engine:
// PE-100 density is around 0.95-0.96 g/cm³ (use 960 kg/m³ for formula or 0.955)
// PVC density is around 1.4-1.45 g/cm³ (use 1400 kg/m³)
// Standard pipe weight formula: Weight (kg/m) = pi * e * (e_d - e) * density / 1000
// where: e = mean wall thickness (mm), e_d = outer diameter (mm), density is in g/cm³ (approx. 0.95 for HDPE, 1.4 for PVC).
// This is an extremely valuable tool for project estimators. Let's provide exact parameters.

export interface PipeSpecOption {
  od: number;
  sdrOptions: {
    sdr: number;
    pn: string;
    thickness: number; // mm
  }[];
}

export const HDPE_SPEC_CATALOG: PipeSpecOption[] = [
  {
    od: 20,
    sdrOptions: [
      { sdr: 17, pn: 'PN 6', thickness: 1.2 },
      { sdr: 11, pn: 'PN 10', thickness: 1.9 },
      { sdr: 9, pn: 'PN 16', thickness: 2.3 }
    ]
  },
  {
    od: 32,
    sdrOptions: [
      { sdr: 21, pn: 'PN 5', thickness: 1.6 },
      { sdr: 17, pn: 'PN 6', thickness: 1.9 },
      { sdr: 13.6, pn: 'PN 8', thickness: 2.4 },
      { sdr: 11, pn: 'PN 10', thickness: 3.0 },
      { sdr: 9, pn: 'PN 16', thickness: 3.6 }
    ]
  },
  {
    od: 63,
    sdrOptions: [
      { sdr: 26, pn: 'PN 4', thickness: 2.5 },
      { sdr: 21, pn: 'PN 5', thickness: 3.0 },
      { sdr: 17, pn: 'PN 6', thickness: 3.8 },
      { sdr: 13.6, pn: 'PN 8', thickness: 4.7 },
      { sdr: 11, pn: 'PN 10', thickness: 5.8 },
      { sdr: 9, pn: 'PN 16', thickness: 7.1 },
      { sdr: 7.4, pn: 'PN 20', thickness: 8.6 }
    ]
  },
  {
    od: 90,
    sdrOptions: [
      { sdr: 41, pn: 'PN 2.5', thickness: 2.2 },
      { sdr: 26, pn: 'PN 4', thickness: 3.5 },
      { sdr: 17, pn: 'PN 6', thickness: 5.4 },
      { sdr: 11, pn: 'PN 10', thickness: 8.2 },
      { sdr: 9, pn: 'PN 16', thickness: 10.1 },
      { sdr: 7.4, pn: 'PN 20', thickness: 12.3 }
    ]
  },
  {
    od: 110,
    sdrOptions: [
      { sdr: 41, pn: 'PN 2.5', thickness: 2.7 },
      { sdr: 26, pn: 'PN 4', thickness: 4.2 },
      { sdr: 21, pn: 'PN 5', thickness: 5.3 },
      { sdr: 17, pn: 'PN 6', thickness: 6.6 },
      { sdr: 13.6, pn: 'PN 8', thickness: 8.1 },
      { sdr: 11, pn: 'PN 10', thickness: 10.0 },
      { sdr: 9, pn: 'PN 16', thickness: 12.3 },
      { sdr: 7.4, pn: 'PN 20', thickness: 15.1 }
    ]
  },
  {
    od: 160,
    sdrOptions: [
      { sdr: 41, pn: 'PN 2.5', thickness: 4.0 },
      { sdr: 26, pn: 'PN 4', thickness: 6.2 },
      { sdr: 17, pn: 'PN 6', thickness: 9.5 },
      { sdr: 11, pn: 'PN 10', thickness: 14.6 },
      { sdr: 9, pn: 'PN 16', thickness: 17.9 },
      { sdr: 7.4, pn: 'PN 20', thickness: 21.9 }
    ]
  },
  {
    od: 200,
    sdrOptions: [
      { sdr: 41, pn: 'PN 2.5', thickness: 4.9 },
      { sdr: 26, pn: 'PN 4', thickness: 7.7 },
      { sdr: 17, pn: 'PN 6', thickness: 11.9 },
      { sdr: 11, pn: 'PN 10', thickness: 18.2 },
      { sdr: 9, pn: 'PN 16', thickness: 22.4 },
      { sdr: 7.4, pn: 'PN 20', thickness: 27.4 }
    ]
  },
  {
    od: 315,
    sdrOptions: [
      { sdr: 41, pn: 'PN 2.5', thickness: 7.7 },
      { sdr: 26, pn: 'PN 4', thickness: 12.1 },
      { sdr: 17, pn: 'PN 6', thickness: 18.7 },
      { sdr: 11, pn: 'PN 10', thickness: 28.6 },
      { sdr: 9, pn: 'PN 16', thickness: 35.2 }
    ]
  }
];

export const PVC_SPEC_CATALOG: PipeSpecOption[] = [
  {
    od: 63,
    sdrOptions: [
      { sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 1.5 },
      { sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 2.5 },
      { sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 3.8 },
      { sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 5.7 }
    ]
  },
  {
    od: 90,
    sdrOptions: [
      { sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 2.1 },
      { sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 3.5 },
      { sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 5.3 },
      { sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 8.0 }
    ]
  },
  {
    od: 110,
    sdrOptions: [
      { sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 2.5 },
      { sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 4.2 },
      { sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 6.1 },
      { sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 9.5 }
    ]
  },
  {
    od: 160,
    sdrOptions: [
      { sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 3.5 },
      { sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 5.7 },
      { sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 8.4 },
      { sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 12.0 }
    ]
  },
  {
    od: 200,
    sdrOptions: [
      { sdr: 41, pn: 'Class 1 (2.5 kg)', thickness: 4.3 },
      { sdr: 26, pn: 'Class 2 (4.0 kg)', thickness: 7.0 },
      { sdr: 17, pn: 'Class 3 (6.0 kg)', thickness: 10.3 },
      { sdr: 11, pn: 'Class 4 (10.0 kg)', thickness: 14.7 }
    ]
  }
];
