/** Shared types for sell-side mineral submissions (dashboard + app). */

export type VerificationSource = "manual" | "ai";

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: "System" | "Admin" | "Seller";
  immutable: boolean;
}

export interface MineralPhoto {
  id: string;
  url: string;
  timestamp: Date;
  qualityScore: number;
  flags: ("Blur" | "Duplicate" | "Tampering Risk")[];
}

export interface MineralSubmission {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;

  /** Display name (e.g. "Gold", "Lithium Carbonate"). From app catalog or dashboard input. */
  mineralName?: string;
  /** Category (e.g. Raw, Semi-Processed, Processed). From app/dashboard. */
  mineralCategory?: string;
  /** Full description. From app catalog or dashboard input. */
  mineralDescription?: string;
  mineralType: string;
  /** Form / shape (e.g. Nugget, Ore, Dust, Bar, Cathodes). Editable as free text. */
  form: string;
  quantity: number;
  unit: string;
  extractionYear: number;
  location: {
    city: string;
    region: string;
    country: string;
  };

  photos: MineralPhoto[];

  status: "Submitted" | "In Review" | "Approved" | "Rejected" | "Sold" | "Settled";
  aiConfidenceScore: number;
  reviewerNotes: string;
  blockchainProofEnabled: boolean;
  sgsStatus: "Not Sent" | "Sent" | "Received";
  sgsReportUrl?: string;
  /** 3rd party testing partner: SGS or Other. When Other, use verificationPartnerName. */
  verificationPartner?: "SGS" | "Other";
  /** When verificationPartner is "Other", name of the testing/certification partner. */
  verificationPartnerName?: string;

  grossOfferValue: number;
  platformFeePercent: number;
  logisticsCost: number;
  currency: string;

  settlementType: "Guaranteed" | "Standard";
  escrowStatus: "Reserved" | "Released" | "Pending";
  paymentMode: "Instant Transfer" | "Bank Settlement";

  sellerConfirmedAt?: Date;

  auditLog: AuditLogEntry[];

  createdAt: Date;

  /** How this submission was verified (manual review vs AI confidence). */
  verificationSource?: VerificationSource;
  /** When status was last set by admin (e.g. Approved). */
  lastVerifiedAt?: string;
}
