export type ProductSubCategory = 'HDPE' | 'MDPE' | 'PVC' | 'Motors' | 'Tanks' | 'Pumps' | 'DI';

export interface ProductSpec {
  [key: string]: string | number | string[];
}

export interface Product {
  id: string;
  category: ProductSubCategory;
  name: string;
  image?: string;
  tagline: string;
  description: string;
  badge?: string;
  specs: {
    standard?: string;
    pressure?: string;
    application?: string;
    durability?: string;
    efficiency?: string;
    material?: string;
    diameterRange?: string;
    layers?: string;
    grade?: string;
  };
  technicalDetails: {
    title: string;
    table: { label: string; value: string }[];
    bullets: string[];
  };
}

export interface ServiceSector {
  id: string;
  code: string;
  name: string;
  fullTitle: string;
  description: string;
  missionDetails: string[];
}

export interface QuoteItem {
  id: string;
  productName: string;
  category: string;
  details: string; // e.g., "110mm PN10 SDR17, 120 meters"
  quantity: number;
  weightEstimate?: number; // Kg
}

export interface QuoteRequest {
  clientName: string;
  email: string;
  phone: string;
  companyName: string;
  projectRegion: string; // e.g., Maharashtra, M.P.
  items: QuoteItem[];
  notes?: string;
}
