export interface Mineral {
  id: string;
  // 1. Name & Description
  name: string;
  description: string;
  /** Sub product description (shown below mineral name in form). */
  subProductDescription?: string;
  
  // 2. Media
  heroImage: string | null;
  additionalImages: string[];
  
  // 3. Classification & Badges
  tags: string[];
  /** Mineral types (e.g. Lithium, Cobalt). Add, edit, or delete per listing. */
  mineralTypes: string[];
  badges: string[];
  /** Category for buy list grouping (e.g. Precious metals, Base metals, Energy minerals). */
  category?: string;
  
  // 4. Origin Details
  country: string;
  region: string;
  sourceType: "Artisanal" | "Industrial" | "Cooperative";
  
  // 5. Purity & Quality
  purity: number; // Percentage
  purityCertificationId?: string;
  grade?: string;
  
  // 6. Due Diligence
  blockchainRecordEnabled: boolean;
  blockchainHash?: string;
  verificationStatus: "Verified" | "Pending" | "Rejected";
  marketInsightsEnabled: boolean;
  demandIndicator: "Low" | "Medium" | "High";
  
  // 7. Allocation & Availability
  availableQuantity: number; // MT
  minAllocation: number; // MT
  allocationLockDuration: number; // Hours
  instantAllocation: boolean;
  
  // 8. Pricing
  basePrice: number;
  currency: string;
  priceVisibility: boolean;
  /** AI estimate: platform fee % for order summary (e.g. 1 = 1%). Used in app buy flow. */
  platformFeePercent?: number;
  /** AI estimate: default transport amount (fixed, in same currency as basePrice). Used in app buy flow. */
  defaultTransportAmount?: number;

  // 9. Compliance
  kycRequired: boolean;
  regionRestrictions: string[];
  visibleTo: string[];
  /** Target institutional buyer categories for this listing (e.g. Institutional Buyer, Large-Scale Buyer). */
  institutionalBuyerCategories?: string[];
  
  // 10. CTA
  ctaEnabled: boolean;
  ctaLabel: string;
  
  // Metadata
  createdAt: Date;
}

export const initialMineralState: Omit<Mineral, 'id' | 'createdAt'> = {
  name: "",
  description: "",
  subProductDescription: "",
  heroImage: null,
  additionalImages: [],
  tags: [],
  mineralTypes: [],
  badges: [],
  country: "",
  region: "",
  sourceType: "Industrial",
  purity: 99.9,
  purityCertificationId: "",
  grade: "",
  blockchainRecordEnabled: false,
  verificationStatus: "Pending",
  marketInsightsEnabled: true,
  demandIndicator: "Medium",
  availableQuantity: 0,
  minAllocation: 10,
  allocationLockDuration: 24,
  instantAllocation: false,
  basePrice: 0,
  currency: "USD",
  priceVisibility: true,
  platformFeePercent: 1,
  defaultTransportAmount: 0,
  kycRequired: true,
  regionRestrictions: [],
  visibleTo: ["Buyers", "Institutions"],
  institutionalBuyerCategories: [],
  ctaEnabled: true,
  ctaLabel: "Proceed to Allocation",
  category: ""
};
