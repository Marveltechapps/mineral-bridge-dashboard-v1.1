import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Mineral } from "../components/admin/minerals/types";
import type { MineralSubmission } from "../types/sellSubmissions";
import type { UserDetailSet } from "../types/userDetails";
import type { VideoCallEntry } from "../types/userDetails";
import type { VerificationLogEntry, KycVerificationResult } from "../types/verification";
import { initialMinerals } from "../data/initialMinerals";
import { initialSellSubmissions } from "../data/initialSellSubmissions";
import { initialUserDetails } from "../data/initialUserDetails";

// --- Shared types (Mineral Bridge dashboard) ---
/** Details submitted via app before entering (e.g. Request Access form). Shown in dashboard Pre-homepage card. */
export interface PreHomepageDetails {
  company?: string;
  requestedRole?: string;
  reasonOrNotes?: string;
  submittedAt: string;
}

export interface RegistryUserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  flag: string;
  status: string;
  risk: string;
  ltv: string;
  lastActive: string;
  avatar: string;
  detailsVerifiedAt?: string;
  /** Data submitted in app pre-homepage flow (e.g. Request Access). Visible in user detail Overview. */
  preHomepageDetails?: PreHomepageDetails;
}

export interface AccessRequest {
  id: string;
  email: string;
  name: string;
  company: string;
  requestedRole: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface SentToUser {
  type: "transport_link" | "qr_or_bank" | "sample_pickup_link" | "lc_credit";
  label: string;
  date: string;
  channel: string;
  detail?: string;
  /** e.g. "Wise (international)", "SWIFT", "Domestic bank" */
  paymentChannel?: string;
}

/** 3rd party logistics details per order/shipment ID (dashboard input → shown in app as link/QR). */
export interface LogisticsDetails {
  orderId: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl: string;
  /** Payload for QR code (e.g. same as trackingUrl or tracking number). */
  qrPayload: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  /** Optional: shipping / logistics amount for Financial & Support reconciliation. */
  shippingAmount?: string;
  /** Optional: currency for shippingAmount (e.g. USD, EUR). */
  shippingCurrency?: string;
  updatedAt: string;
}

/** Status for 3rd party testing/certification shipment. */
export type PartnerThirdPartyStatus = "Pending" | "In transit" | "Delivered" | "Sample received at lab";

/** 3rd party details for Testing & Certification (submitted by users in the app; displayed in Partners → 3rd Party Details; admin can edit). */
export interface PartnerThirdPartyEntry {
  id: string;
  orderId: string;
  /** 3rd party company name (testing lab / certification body). */
  companyName?: string;
  trackingNumber: string;
  trackingUrl: string;
  /** When the user submitted (e.g. from app). */
  submittedAt?: string;
  contactPhone?: string;
  contactEmail?: string;
  /** Company details (address, registration, etc.). */
  companyDetails?: string;
  /** Document names or URLs uploaded by the user (from user side). */
  uploadedDocuments?: string[];
  status?: PartnerThirdPartyStatus;
  expectedDeliveryDate?: string;
  /** Actual delivered time (when status is Delivered or Sample received at lab). */
  deliveredAt?: string;
  /** Testing partner (e.g. SGS, Other). */
  testingPartner?: string;
  /** Paid amount (e.g. testing/shipping cost). */
  shippingAmount?: string;
  shippingCurrency?: string;
}

/** Testing status for active testing orders. */
export type TestingOrderTestingStatus = "Pending" | "In Progress" | "Completed" | "Failed" | "Re-test Required";
/** Certification status for active testing orders. */
export type TestingOrderCertificationStatus = "Not Issued" | "Issued" | "Rejected";
/** Payment status for testing fee. */
export type TestingOrderPaymentStatus = "Paid" | "Unpaid" | "Partial";

/** Active testing order (Testing & Certification screen). */
export interface ActiveTestingOrder {
  id: string;
  /** Basic */
  orderId: string;
  buyerSellerName: string;
  mineralType: string;
  quantity: string;
  testingPartner: string;
  /** Logistics */
  trackingNumber: string;
  courierCompany: string;
  shipmentStatus: string;
  expectedDeliveryDate: string;
  deliveredDate: string;
  /** Testing */
  sampleReceivedDate: string;
  testingStartDate: string;
  testingStatus: TestingOrderTestingStatus;
  certificationStatus: TestingOrderCertificationStatus;
  /** Financial */
  testingFee: string;
  paymentStatus: TestingOrderPaymentStatus;
  currency: string;
  /** Company details (for detail view) */
  labName: string;
  labRegistrationNumber: string;
  contactPerson: string;
  labPhone: string;
  labEmail: string;
  labAddress: string;
  /** Uploaded documents (for detail view) */
  assayRequest?: string;
  invoice?: string;
  labReportPdf?: string;
  certificatePdf?: string;
  complianceDocuments?: string;
}

/** Step-specific data when admin completes a flow step (e.g. final amount at Price Confirmed) */
export interface OrderFlowStepData {
  priceConfirmed?: { finalAmount: string; currency: string; confirmedAt: string; note?: string };
  paymentInitiated?: { method: string; reference?: string; initiatedAt: string; note?: string };
  orderCompleted?: { completedAt: string; note?: string };
  awaitingTeamContact?: { contactedAt?: string; note?: string };
  sampleTestRequired?: { completedAt?: string; note?: string };
}

/** Contact info captured at checkout (buy flow). */
export interface OrderContactInfo {
  name: string;
  email: string;
  phone: string;
  /** Company name (buy flow – shipping/buyer info). */
  companyName?: string;
  /** Tax ID / EIN (buy flow – shipping/buyer info). */
  taxIdEin?: string;
  /** Institutional buyer category (buy flow – e.g. Institutional Buyer, Large-Scale Buyer). */
  institutionalBuyerCategory?: string;
}

/** Order summary breakdown (buy flow: subtotal, tax, shipping, total). */
export interface OrderSummaryBreakdown {
  subtotal: string;
  /** Optional label for subtotal line (e.g. "Gold Bullion"). */
  subtotalLabel?: string;
  tax?: string;
  shippingCost: string;
  /** Platform fee amount (e.g. "$1,245.00"). */
  platformFee?: string;
  /** Platform fee percentage (e.g. 1). */
  platformFeePercent?: number;
  total: string;
  currency: string;
}

/** Structured delivery location from app (Step 2 – Logistics Details). */
export interface OrderDeliveryLocation {
  facilityName: string;
  streetAddress: string;
  city: string;
  stateRegion: string;
  postalCode: string;
  country: string;
  contactPhone?: string;
  email?: string;
}

export interface Order {
  id: string;
  type: "Buy" | "Sell";
  mineral: string;
  description: string;
  qty: string;
  unit: string;
  facility: { name: string; address: string; country: string; contact: string };
  aiEstimatedAmount: string;
  currency: string;
  status: string;
  createdAt: string;
  flowSteps: { label: string; active: boolean; completed: boolean }[];
  flowStepData?: OrderFlowStepData;
  testingReqs?: { label: string; status: "Pending" | "Uploaded"; uploadedFileName?: string }[];
  /** Communication log: team contact (email/mobile), updates, etc. */
  commLog: { event: string; admin: string; date: string; note?: string; contactMethod?: "Email" | "Mobile" }[];
  sentToUser?: SentToUser[];
  userId?: string;
  /** Buy flow: full shipping address (ship to). */
  shippingAddress?: string;
  /** Buy flow: structured delivery location from app (Facility name, Street, City, State, Postal, Country, Contact, Email). */
  deliveryLocation?: OrderDeliveryLocation;
  /** Buy flow: delivery type – Direct Delivery or Secure Vault. */
  deliveryType?: "Direct Delivery" | "Secure Vault";
  /** Buy flow: estimated delivery date. */
  estimatedDeliveryDate?: string;
  /** Buy flow: payment method used (e.g. Credit Card, Bank Transfer). */
  paymentMethod?: string;
  /** Buy flow: contact info at checkout. */
  contactInfo?: OrderContactInfo;
  /** Buy flow: order summary (subtotal, tax, shipping, platform fee, total). */
  orderSummary?: OrderSummaryBreakdown;
  /** Buy flow: seller of the listing (e.g. Mining Group Ltd). */
  sellerName?: string;
  /** Buy flow: mineral form/type from app (e.g. Raw, Ore, Bar). */
  mineralForm?: string;
  /** Buy flow: institutional permit number from delivery form. */
  institutionalPermitNumber?: string;
  /** Buy flow: whether order is escrow protected (from app review step). */
  escrowProtected?: boolean;
  /** Buyer country (from registry user); used for international classification. */
  buyerCountry?: string;
  /** Seller/facility country; used for international classification. */
  sellerCountry?: string;
  /** Letter of credit reference (Transactions / Sell flow). */
  lcNumber?: string;
  /** Assigned 3rd party testing lab (e.g. SGS Mumbai). */
  testingLab?: string;
  /** Short testing result summary (e.g. "Purity: 98.2% | Weight: 502kg"). */
  testingResultSummary?: string;
  /** International: Incoterms (FOB, CIF, DAP, EXW, etc.). */
  incoterms?: string;
  /** International: Payment terms (T/T 30/70, D/P, D/A, CAD). */
  paymentTerms?: string;
  /** International: SWIFT/BIC of issuing bank. */
  swift?: string;
  /** International: Export license reference (e.g. MB-EXP-GHA-5489). */
  exportLicense?: string;
  /** International: Correspondent/advising bank name or SWIFT. */
  correspondentBank?: string;
  /** International: Escrow status (Reserved, Pending Release, Released). */
  escrowStatus?: "Reserved" | "Pending Release" | "Released";
  /** 6-step flow: 1–3 for Buy (QR, Call, Reserve), 1–3 for Sell (Testing, LC, Release). */
  currentStep?: number;
  /** Sell flow: when our team contacted the seller (from app buy request). */
  teamContactedAt?: string;
  /** Sell flow: negotiation notes. */
  negotiationNotes?: string;
  /** Sell flow: place/location sent to testing team (where they go). */
  testingTeamPlace?: string;
  /** Sell flow: when testing report was received from team. */
  testingReportReceivedAt?: string;
  /** Sell flow: when LC was credited to customer account (after testing success). */
  lcCreditedAt?: string;
  /** Sell flow: when logistics details were sent (minerals to our place). */
  logisticsDetailsSentAt?: string;
  /** Sell flow: transaction shared with (testing_team, logistics, commercial). */
  transactionSharedWith?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  orderType: "Buy" | "Sell";
  mineral: string;
  aiEstimate: string;
  finalAmount: string;
  serviceFee: string;
  netAmount: string;
  currency: string;
  method: "Bank Transfer" | "Wise" | "Blockchain Settlement";
  status: "Pending" | "Completed" | "Failed";
  date: string;
  time: string;
  paymentDetails: {
    accountName?: string;
    bankName?: string;
    maskedAccount?: string;
    reference?: string;
    network?: string;
    hash?: string;
    swiftBic?: string;
  };
  settlementNote: string;
  adminNotes: { admin: string; text: string; date: string }[];
  /** International transaction: payer country (e.g. where funds originate). */
  payerCountry?: string;
  /** International transaction: beneficiary country (e.g. where funds are sent). */
  beneficiaryCountry?: string;
  /** Source currency when FX is applied (e.g. USD). */
  sourceCurrency?: string;
  /** Target/settlement currency when different from source (e.g. GHS). */
  targetCurrency?: string;
  /** FX rate used for conversion (e.g. "12.45"). */
  fxRate?: string;
  /** Date of FX rate used. */
  fxRateDate?: string;
  /** Payment channel: Domestic, SWIFT, Wise, SEPA, Crypto, etc. */
  paymentChannel?: string;
  /** Explicit flag for international settlement. */
  isInternational?: boolean;
  /** Compliance: when sanctions were checked. */
  sanctionsCheckedAt?: string;
  /** Compliance: Clear | Flagged. */
  sanctionsResult?: "Clear" | "Flagged";
  /** Export control note or document ref. */
  exportControlNote?: string;
  /** Optional link to settlement batch / payout for reconciliation. */
  payoutId?: string;
}

/** Settlement batch / payout for reconciliation (match bank movements to transaction batches). */
export interface Payout {
  id: string;
  label: string;
  date: string;
  totalAmount: string;
  currency: string;
  transactionCount: number;
  status: "Settled" | "Pending match" | "Reconciled";
}

export interface Facility {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  status: string;
  isPrimary: boolean;
  isSaved: boolean;
  permitNumber: string;
  addedVia: string;
  addedAt: string;
  usageCount: { buy: number; sell: number };
  usageHistory: { id: string; type: "Buy" | "Sell"; mineral: string; qty: string; status: string; date: string }[];
}

/** Payment/bank method added by user in the app; linked to userId for display on transaction bank details. */
export interface LinkedPaymentMethod {
  id: string;
  label: string;
  maskedNumber: string;
  isPrimary: boolean;
  verified: boolean;
  lastUsed: string;
  /** User who added this in the app – links to order.userId so transaction bank details can show "from app". */
  userId?: string;
  /** Bank details entered in app (when provided). */
  accountName?: string;
  bankName?: string;
  swiftBic?: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  status: string;
  buyer: { name: string; avatar?: string };
  seller: { name: string; avatar?: string };
  mineral: string;
  amount?: string;
  raisedAt?: string;
}

export interface EnquiryReply {
  admin: string;
  text: string;
  at: string;
}

export interface Enquiry {
  id: string;
  userId?: string;
  subject: string;
  preview: string;
  status: string;
  priority: string;
  time: string;
  type: string;
  replies?: EnquiryReply[];
}

/** Activity recorded from the app and dashboard (onboarding, profile, KYC, payments, bulk actions, etc.). */
export interface AppActivity {
  id: string;
  userId: string;
  type: "profile_updated" | "kyc_doc_uploaded" | "onboarding_step" | "listing_created" | "order_submitted" | "app_login" | "settings_updated" | "safety_upload" | "payment_released" | "bulk_export" | "email_sent" | "sms_sent" | "user_status_updated" | "enquiry_replied" | "dashboard_login" | "other";
  description: string;
  at: string;
  metadata?: Record<string, string>;
}

export interface DashboardState {
  registryUsers: RegistryUserRow[];
  accessRequests: AccessRequest[];
  minerals: Mineral[];
  mineralSubmissions: MineralSubmission[];
  buyOrders: Order[];
  sellOrders: Order[];
  transactions: Transaction[];
  /** Settlement batches / payouts for reconciliation. */
  payouts: Payout[];
  facilities: Facility[];
  paymentMethods: LinkedPaymentMethod[];
  suspendedUserIds: Set<string>;
  restrictedUserIds: Set<string>;
  disputes: Dispute[];
  enquiries: Enquiry[];
  appActivities: AppActivity[];
  userDetails: Record<string, UserDetailSet>;
  /** Audit trail: manual vs AI/API verification events */
  verificationLog: VerificationLogEntry[];
  /** Per-user KYC verification result (source, score, last verified) */
  kycVerificationResults: Record<string, KycVerificationResult>;
  /** 3rd party logistics details keyed by order/shipment ID. Dashboard enters; app shows link + QR. */
  logisticsDetails: Record<string, LogisticsDetails>;
  /** 3rd party details for Testing & Certification (input from users in the app; shown in Recent 3rd party details; admin can edit). */
  partnerThirdPartyDetails: PartnerThirdPartyEntry[];
  /** Active testing orders (Testing & Certification screen grid + detail view). */
  activeTestingOrders: ActiveTestingOrder[];
  /** Custom mineral categories created in catalog (e.g. in addition to Precious metals, Base metals, Energy minerals, Other). */
  customCategories: string[];
  /** Custom sell submission categories (e.g. in addition to Raw, Semi-Processed, Processed). */
  customSellCategories: string[];
}

const DEFAULT_USER_ID = "MB-USR-4412-S";

const initialRegistryUsers: RegistryUserRow[] = [
  { id: "MB-USR-4412-S", name: "Samuel Osei", email: "s.osei@ghana-lithium.com", phone: "+233 24 555 0192", role: "Seller / License Holder", country: "Ghana", flag: "🇬🇭", status: "Verified", risk: "Low", ltv: "$4.05M", lastActive: "Today, 09:12 AM", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", detailsVerifiedAt: "Jan 10, 2026", preHomepageDetails: { company: "Samuel Osei Trading Ltd", requestedRole: "Seller / License Holder", reasonOrNotes: "Requesting access to list copper and lithium from Ghana operations.", submittedAt: "Jan 05, 2026" } },
  { id: "MB-USR-8821-B", name: "Kwesi Mensah", email: "kwesi.m@accra-mining.gh", phone: "+233 24 111 2233", role: "Large-Scale Buyer", country: "Ghana", flag: "🇬🇭", status: "Under Review", risk: "Medium", ltv: "$1.2M", lastActive: "Yesterday", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", preHomepageDetails: { company: "Accra Mining Ltd", requestedRole: "Large-Scale Buyer", reasonOrNotes: "Corporate procurement for refinery feedstock.", submittedAt: "Jan 20, 2026" } },
  { id: "MB-USR-3391-S", name: "Amara Okafor", email: "amara.o@corp-ng.com", phone: "+234 80 555 6677", role: "Corporate Seller", country: "Nigeria", flag: "🇳🇬", status: "Suspended", risk: "High", ltv: "$0.8M", lastActive: "2 weeks ago", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" },
  { id: "MB-USR-1102-M", name: "David van Wyk", email: "d.vanwyk@sa-minerals.co.za", phone: "+27 21 444 5566", role: "Mining Operator", country: "South Africa", flag: "🇿🇦", status: "Verified", risk: "Low", ltv: "$2.4M", lastActive: "Today, 10:45 AM", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", detailsVerifiedAt: "Jan 08, 2026", preHomepageDetails: { company: "SA Minerals (Pty) Ltd", requestedRole: "Mining Operator", reasonOrNotes: "Access to list and sell mined minerals.", submittedAt: "Jan 02, 2026" } },
  { id: "MB-USR-5567-B", name: "Elena Petrova", email: "elena.p@zurich-commodities.ch", phone: "+41 44 123 4567", role: "Institutional Buyer", country: "Switzerland", flag: "🇨🇭", status: "Verified", risk: "Low", ltv: "$12.8M", lastActive: "1 hour ago", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "MB-USR-2210-S", name: "Jean-Paul Mbida", email: "jp.mbida@mining-cm.org", phone: "+237 6 789 0123", role: "Artisanal Collector", country: "Cameroon", flag: "🇨🇲", status: "Limited", risk: "Medium", ltv: "$0.15M", lastActive: "3 days ago", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
  { id: "MB-USR-4491-S", name: "Abeba Kibret", email: "abeba.k@mining-co.com", phone: "+251 91 123 4567", role: "Artisanal Collector", country: "Ethiopia", flag: "🇪🇹", status: "Under Review", risk: "Low", ltv: "$0.08M", lastActive: "Today, 11:20 AM", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" },
];

const initialBuyOrders: Order[] = [
  {
    id: "B-ORD-5489",
    type: "Buy",
    mineral: "Copper Cathodes",
    description: "Grade A, 99.9% purity, CIF Terms",
    qty: "1,200",
    unit: "MT",
    facility: { name: "Osei Export Terminal", address: "Industrial Loop 44A, Accra", country: "Ghana", contact: "+233 24 555 0192" },
    aiEstimatedAmount: "$1,120,000",
    currency: "USD",
    status: "Awaiting Team Contact",
    createdAt: "Jan 25, 2026",
    userId: DEFAULT_USER_ID,
    shippingAddress: "Samuel Osei Trading Ltd, Industrial Loop 44A, Accra, Greater Accra, Ghana",
    deliveryType: "Direct Delivery",
    deliveryLocation: {
      facilityName: "Samuel Osei Trading Ltd",
      streetAddress: "Industrial Loop 44A",
      city: "Accra",
      stateRegion: "Greater Accra",
      postalCode: "GA-100",
      country: "Ghana",
      contactPhone: "+233 24 555 0192",
      email: "s.osei@ghana-lithium.com",
    },
    estimatedDeliveryDate: "Feb 15, 2026",
    paymentMethod: "Bank Transfer",
    sellerName: "Osei Export Terminal",
    mineralForm: "Cathodes",
    institutionalPermitNumber: "GH-MIN-2024-8842",
    escrowProtected: true,
    contactInfo: {
      name: "Samuel Osei",
      email: "s.osei@ghana-lithium.com",
      phone: "+233 24 555 0192",
      companyName: "Samuel Osei Trading Ltd",
      taxIdEin: "GH-123456789",
      institutionalBuyerCategory: "Large-Scale Buyer",
    },
    orderSummary: {
      subtotal: "$1,118,500",
      subtotalLabel: "Copper Cathodes",
      tax: "$0",
      shippingCost: "$1,500",
      platformFee: "$11,185",
      platformFeePercent: 1,
      total: "$1,120,000",
      currency: "USD",
    },
    flowSteps: [
      { label: "Order Submitted", active: false, completed: true },
      { label: "Awaiting Team Contact", active: true, completed: false },
      { label: "Price Confirmed", active: false, completed: false },
      { label: "Payment Initiated", active: false, completed: false },
      { label: "Order Completed", active: false, completed: false },
    ],
    testingReqs: [
      { label: "Assay / Quality Certificate", status: "Pending" as const },
      { label: "Commercial Invoice", status: "Uploaded" as const },
      { label: "Bill of Lading", status: "Pending" as const },
    ],
    commLog: [
      { event: "Order Submitted", admin: "System", date: "Jan 25, 10:20 AM" },
      { event: "AI Estimation Generated", admin: "AI-Price-Engine", date: "Jan 25, 10:21 AM" },
    ],
    sentToUser: [
      { type: "qr_or_bank", label: "Bank details / QR for payment", date: "Jan 21, 2026", channel: "App", detail: "Sent after price confirmation" },
      { type: "transport_link", label: "Transport tracking link", date: "Jan 25, 2026", channel: "App", detail: "Armored transport to facility; tracking + QR" },
    ],
    buyerCountry: "Ghana",
    sellerCountry: "Ghana",
    currentStep: 1,
  },
  {
    id: "B-ORD-5512",
    type: "Buy",
    mineral: "Gold Bars 24k",
    description: "24k Pure Gold, LBMA certified, 1kg bars",
    qty: "50",
    unit: "KG",
    facility: { name: "Zurich Vault Hub", address: "Bahnhofstrasse 12, 8001 Zurich", country: "Switzerland", contact: "+41 44 123 4567" },
    aiEstimatedAmount: "$3,245,000",
    currency: "USD",
    status: "Payment Initiated",
    createdAt: "Feb 02, 2026",
    userId: "MB-USR-5567-B",
    shippingAddress: "Elena Petrova, Zurich Commodities AG, Bahnhofstrasse 12, 8001 Zurich, Switzerland",
    deliveryType: "Direct Delivery",
    deliveryLocation: {
      facilityName: "Zurich Commodities AG",
      streetAddress: "Bahnhofstrasse 12",
      city: "Zurich",
      stateRegion: "Zurich",
      postalCode: "8001",
      country: "Switzerland",
      contactPhone: "+41 44 123 4567",
      email: "elena.p@zurich-commodities.ch",
    },
    estimatedDeliveryDate: "Feb 20, 2026",
    paymentMethod: "Bank Transfer",
    sellerName: "Mining Group Ltd",
    mineralForm: "Bar",
    institutionalPermitNumber: "CHE-PERMIT-789",
    escrowProtected: true,
    contactInfo: {
      name: "Elena Petrova",
      email: "elena.p@zurich-commodities.ch",
      phone: "+41 44 123 4567",
      companyName: "Zurich Commodities AG",
      taxIdEin: "CHE-123.456.789",
      institutionalBuyerCategory: "Institutional Buyer",
    },
    orderSummary: {
      subtotal: "$3,240,000",
      subtotalLabel: "Gold Bullion",
      tax: "$5,000",
      shippingCost: "$5,000",
      platformFee: "$32,400",
      platformFeePercent: 1,
      total: "$3,245,000",
      currency: "USD",
    },
    flowSteps: [
      { label: "Order Submitted", active: false, completed: true },
      { label: "Awaiting Team Contact", active: false, completed: true },
      { label: "Price Confirmed", active: false, completed: true },
      { label: "Payment Initiated", active: true, completed: false },
      { label: "Order Completed", active: false, completed: false },
    ],
    testingReqs: [
      { label: "Assay Certificate", status: "Uploaded" as const },
      { label: "Bill of Lading", status: "Pending" as const },
    ],
    commLog: [
      { event: "Order Submitted", admin: "System", date: "Feb 02, 09:15 AM" },
      { event: "Price Confirmed", admin: "Team", date: "Feb 03, 11:00 AM" },
    ],
    sentToUser: [
      { type: "qr_or_bank", label: "Bank details for payment", date: "Feb 03, 2026", channel: "App", detail: "Wise / SEPA details sent", paymentChannel: "Wise (international)" },
    ],
    buyerCountry: "Switzerland",
    sellerCountry: "Switzerland",
    currentStep: 2,
  },
  {
    id: "B-ORD-5520",
    type: "Buy",
    mineral: "Cobalt Concentrate",
    description: "High-grade cobalt concentrate, 15% Co",
    qty: "200",
    unit: "MT",
    facility: { name: "Lubumbashi Logistics Park", address: "Route du Cuivre, Lubumbashi", country: "DRC", contact: "+243 99 123 4567" },
    aiEstimatedAmount: "$1,850,000",
    currency: "USD",
    status: "Order Submitted",
    createdAt: "Feb 08, 2026",
    userId: "MB-USR-8821-B",
    shippingAddress: "Kwesi Mensah, Accra Mining Ltd, Independence Ave 100, Accra, Ghana",
    deliveryType: "Direct Delivery",
    estimatedDeliveryDate: "Mar 05, 2026",
    paymentMethod: "Credit Card",
    sellerName: "Lubumbashi Minerals Co",
    mineralForm: "Concentrate",
    escrowProtected: true,
    contactInfo: {
      name: "Kwesi Mensah",
      email: "kwesi.m@accra-mining.gh",
      phone: "+233 24 111 2233",
      companyName: "Accra Mining Ltd",
      taxIdEin: "GH-987654321",
      institutionalBuyerCategory: "Large-Scale Buyer",
    },
    orderSummary: {
      subtotal: "$1,845,000",
      subtotalLabel: "Cobalt Concentrate",
      tax: "$0",
      shippingCost: "$5,000",
      platformFee: "$18,450",
      platformFeePercent: 1,
      total: "$1,850,000",
      currency: "USD",
    },
    flowSteps: [
      { label: "Order Submitted", active: true, completed: false },
      { label: "Awaiting Team Contact", active: false, completed: false },
      { label: "Price Confirmed", active: false, completed: false },
      { label: "Payment Initiated", active: false, completed: false },
      { label: "Order Completed", active: false, completed: false },
    ],
    testingReqs: [],
    commLog: [
      { event: "Order Submitted", admin: "System", date: "Feb 08, 14:30 PM" },
    ],
    sentToUser: [],
    buyerCountry: "Ghana",
    sellerCountry: "DRC",
  },
];

const initialSellOrders: Order[] = [
  {
    id: "S-ORD-8821",
    type: "Sell",
    mineral: "Gold Dust (92% Purity)",
    description: "Artisanal collection from Bono region site.",
    qty: "12.5",
    unit: "KG",
    facility: { name: "Sunyani Collection Center", address: "Main North Road, Sunyani, Ghana", country: "Ghana", contact: "+233 24 555 9901" },
    aiEstimatedAmount: "$725,000",
    currency: "USD",
    status: "Sample Test Required",
    createdAt: "Feb 04, 2026",
    userId: DEFAULT_USER_ID,
    testingReqs: [
      { label: "Assay Certificate", status: "Uploaded" },
      { label: "Origin Declaration", status: "Uploaded" },
      { label: "Export Compliance", status: "Pending" },
      { label: "Mineral Photos", status: "Uploaded" },
    ],
    flowSteps: [
      { label: "Order Submitted", active: false, completed: true },
      { label: "Sample Test Required", active: true, completed: false },
      { label: "Awaiting Team Contact", active: false, completed: false },
      { label: "Price Confirmed", active: false, completed: false },
      { label: "Payment Initiated", active: false, completed: false },
      { label: "Order Completed", active: false, completed: false },
    ],
    commLog: [
      { event: "Order Submitted", admin: "System", date: "Feb 04, 11:20 AM" },
      { event: "AI Estimation Generated", admin: "AI-Price-Engine", date: "Feb 04, 11:21 AM" },
    ],
    buyerCountry: "Ghana",
    sellerCountry: "Ghana",
    currentStep: 1,
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "TX-9901-MB",
    orderId: "B-ORD-5489",
    orderType: "Buy",
    mineral: "Copper Cathodes",
    aiEstimate: "$1,120,000",
    finalAmount: "$1,118,500",
    serviceFee: "$1,500",
    netAmount: "$1,120,000",
    currency: "USD",
    method: "Bank Transfer",
    status: "Completed",
    date: "Jan 28, 2026",
    time: "02:45 PM",
    paymentDetails: {
      accountName: "Samuel Osei Trading Ltd",
      bankName: "Standard Chartered Ghana",
      maskedAccount: "**** 8821",
      reference: "MB-SETTLE-JAN-88",
    },
    settlementNote: "Funds released after price confirmation.",
    adminNotes: [{ admin: "Miller", text: "Verified bank transfer slip.", date: "Jan 28, 2026" }],
    payerCountry: "Ghana",
    beneficiaryCountry: "Ghana",
    paymentChannel: "Domestic",
    isInternational: false,
    payoutId: "PO-001",
  },
  {
    id: "TX-9912-MB",
    orderId: "S-ORD-8821",
    orderType: "Sell",
    mineral: "Gold Dust (92%)",
    aiEstimate: "$725,000",
    finalAmount: "$724,200",
    serviceFee: "$800",
    netAmount: "$723,400",
    currency: "USD",
    method: "Blockchain Settlement",
    status: "Pending",
    date: "Feb 04, 2026",
    time: "11:30 AM",
    paymentDetails: { network: "USDT (ERC-20)", hash: "0x7a2...f892" },
    settlementNote: "Funds credited after verification.",
    adminNotes: [],
    payerCountry: "Switzerland",
    beneficiaryCountry: "Ghana",
    sourceCurrency: "USD",
    targetCurrency: "USD",
    paymentChannel: "Blockchain Settlement",
    isInternational: true,
    sanctionsCheckedAt: "Feb 04, 2026",
    sanctionsResult: "Clear",
    payoutId: "PO-002",
  },
  {
    id: "TX-9923-MB",
    orderId: "B-ORD-5512",
    orderType: "Buy",
    mineral: "Gold Bars 24k",
    aiEstimate: "$3,245,000",
    finalAmount: "$850,000",
    serviceFee: "$2,100",
    netAmount: "$847,900",
    currency: "USD",
    method: "Bank Transfer",
    status: "Failed",
    date: "Feb 10, 2026",
    time: "03:15 PM",
    paymentDetails: {},
    settlementNote: "Bank rejected – insufficient verification. Retry after KYC refresh.",
    adminNotes: [{ admin: "Miller", text: "Escalated to compliance.", date: "Feb 10, 2026" }],
    payerCountry: "Switzerland",
    beneficiaryCountry: "Ghana",
    isInternational: true,
  },
];

const initialPayouts: Payout[] = [
  { id: "PO-001", label: "Jan 28, 2026 – Bank batch", date: "Jan 28, 2026", totalAmount: "1,118,500", currency: "USD", transactionCount: 1, status: "Reconciled" },
  { id: "PO-002", label: "Feb 04, 2026 – Pending", date: "Feb 04, 2026", totalAmount: "724,200", currency: "USD", transactionCount: 1, status: "Pending match" },
];

const initialFacilities: Facility[] = [
  {
    id: "FAC-1001",
    name: "Osei Export Terminal",
    street: "Industrial Loop 44A",
    city: "Accra",
    state: "Greater Accra",
    postalCode: "GA-221",
    country: "Ghana",
    phone: "+233 24 555 0192",
    email: "terminal@oseimineral.com",
    status: "Active",
    isPrimary: true,
    isSaved: true,
    permitNumber: "GH-88219-X",
    addedVia: "Mobile App (iOS)",
    addedAt: "Jan 12, 2026 • 10:44 AM",
    usageCount: { buy: 2, sell: 1 },
    usageHistory: [],
  },
];

const initialPaymentMethods: LinkedPaymentMethod[] = [
  { id: "pm-1", label: "Standard Chartered Ghana", maskedNumber: "•••• 8821", isPrimary: true, verified: true, lastUsed: "Today, 10:23 AM", userId: DEFAULT_USER_ID, accountName: "Samuel Osei Trading Ltd", bankName: "Standard Chartered Ghana", swiftBic: "SCBLGHAC" },
  { id: "pm-2", label: "Wise (International)", maskedNumber: "•••• 9921", isPrimary: false, verified: true, lastUsed: "Oct 12, 2025", userId: DEFAULT_USER_ID },
  { id: "pm-3", label: "HSBC Switzerland", maskedNumber: "•••• 3344", isPrimary: true, verified: true, lastUsed: "Feb 02, 2026", userId: "MB-USR-5567-B", accountName: "Zurich Commodities AG", bankName: "HSBC Switzerland", swiftBic: "HBSGINZZ" },
];

const initialDisputes: Dispute[] = [
  { id: "D-0456", orderId: "B-ORD-5489", status: "Open", buyer: { name: "Samuel Osei Trading" }, seller: { name: "Platform" }, mineral: "Copper Cathodes 1,200 MT", amount: "$1,118,500", raisedAt: "Feb 01, 2026" },
  { id: "D-0457", orderId: "S-ORD-8821", status: "In Review", buyer: { name: "Platform" }, seller: { name: "Samuel Osei" }, mineral: "Gold Dust (92%) 12.5 KG", amount: "$724,200", raisedAt: "Feb 04, 2026" },
];

/** When a user requests a callback in the app, the app (or backend) should dispatch ADD_ENQUIRY with type: "Callback" and subject "Request callback". It then appears in Enquiry & Support and in the Dashboard "Need support" count. */
const initialEnquiries: Enquiry[] = [
  { id: "TKT-2025", userId: "MB-USR-8821-B", subject: "Request callback", preview: "User requested a callback from the app. Please call back at their preferred time.", status: "Open", priority: "High", time: "5 mins ago", type: "Callback" },
  { id: "TKT-2024", userId: DEFAULT_USER_ID, subject: "Shipment documentation delay", preview: "We have not received the Bill of Lading for order #B-ORD-5489 yet...", status: "Open", priority: "High", time: "10 mins ago", type: "Logistics" },
  { id: "TKT-2023", userId: "MB-USR-8821-B", subject: "Payment verification issue", preview: "Our payment of $50,000 is showing as pending for 24 hours...", status: "In Progress", priority: "Critical", time: "2 hours ago", type: "Finance" },
  { id: "TKT-2021", userId: "MB-USR-3391-S", subject: "New Mineral Listing Question", preview: "What are the specific requirements for listing Lithium Ore Grade A?", status: "Open", priority: "Medium", time: "5 hours ago", type: "General" },
  { id: "TKT-2018", userId: "MB-USR-1102-M", subject: "Account verification failed", preview: "I uploaded my documents but got a rejection email. Why?", status: "Resolved", priority: "Low", time: "1 day ago", type: "General" },
];

export type DashboardAction =
  | { type: "SET_REGISTRY_USERS"; payload: RegistryUserRow[] }
  | { type: "ADD_REGISTRY_USER"; payload: RegistryUserRow }
  | { type: "UPDATE_USER_STATUS"; payload: { userId: string; suspended?: boolean; restricted?: boolean } }
  | { type: "VERIFY_USER_DETAILS"; payload: { userId: string; verifiedAt: string } }
  | { type: "ADD_ACCESS_REQUEST"; payload: AccessRequest }
  | { type: "UPDATE_ACCESS_REQUEST"; payload: { id: string; status: "approved" | "rejected" } }
  | { type: "SET_BUY_ORDERS"; payload: Order[] }
  | { type: "SET_SELL_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "SET_ORDER_LC"; payload: { orderId: string; type: "Buy" | "Sell"; lcNumber: string } }
  | { type: "SET_ORDER_TESTING"; payload: { orderId: string; type: "Buy" | "Sell"; testingLab?: string; testingResultSummary?: string } }
  | { type: "SET_ORDER_CURRENT_STEP"; payload: { orderId: string; type: "Buy" | "Sell"; step: number } }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "SET_FACILITIES"; payload: Facility[] }
  | { type: "ADD_FACILITY"; payload: Facility }
  | { type: "REMOVE_FACILITY"; payload: string }
  | { type: "SET_PAYMENT_METHODS"; payload: LinkedPaymentMethod[] }
  | { type: "REMOVE_PAYMENT_METHOD"; payload: string }
  | { type: "SET_DISPUTES"; payload: Dispute[] }
  | { type: "ADD_DISPUTE"; payload: Dispute }
  | { type: "UPDATE_DISPUTE"; payload: Dispute }
  | { type: "SET_ENQUIRIES"; payload: Enquiry[] }
  | { type: "ADD_ENQUIRY"; payload: Enquiry }
  | { type: "UPDATE_ENQUIRY"; payload: Enquiry }
  | { type: "ADD_APP_ACTIVITY"; payload: AppActivity }
  | { type: "ADD_MINERAL"; payload: Mineral }
  | { type: "UPDATE_MINERAL"; payload: Mineral }
  | { type: "REMOVE_MINERAL"; payload: string }
  | { type: "ADD_MINERAL_SUBMISSION"; payload: MineralSubmission }
  | { type: "UPDATE_MINERAL_SUBMISSION"; payload: MineralSubmission }
  | { type: "REMOVE_MINERAL_SUBMISSION"; payload: string }
  | { type: "RECORD_VERIFICATION"; payload: VerificationLogEntry }
  | { type: "SET_KYC_VERIFICATION"; payload: { userId: string; result: KycVerificationResult } }
  | { type: "SET_LOGISTICS_DETAILS"; payload: LogisticsDetails }
  | { type: "ADD_PARTNER_THIRD_PARTY"; payload: PartnerThirdPartyEntry }
  | { type: "UPDATE_PARTNER_THIRD_PARTY"; payload: PartnerThirdPartyEntry }
  | { type: "ADD_VIDEO_CALL"; payload: { userId: string; entry: VideoCallEntry } }
  | { type: "UPDATE_ARTISANAL_PROFILE_STATUS"; payload: { userId: string; status: "approved" | "rejected" } }
  | { type: "ADD_ARTISANAL_DOCUMENT_REQUEST"; payload: { userId: string; entry: import("../types/userDetails").ArtisanalDocumentRequest } }
  | { type: "UPDATE_ARTISANAL_ASSET_REQUEST"; payload: { userId: string; requestId: string; status: "approved" | "fulfilled" | "rejected"; adminNote?: string } }
  | { type: "ADD_CUSTOM_CATEGORY"; payload: string }
  | { type: "ADD_CUSTOM_SELL_CATEGORY"; payload: string };

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_REGISTRY_USERS":
      return { ...state, registryUsers: action.payload };
    case "ADD_REGISTRY_USER":
      return { ...state, registryUsers: [...state.registryUsers, action.payload] };
    case "UPDATE_USER_STATUS": {
      const { userId, suspended, restricted } = action.payload;
      let nextSuspended = state.suspendedUserIds;
      if (suspended !== undefined) {
        nextSuspended = new Set(state.suspendedUserIds);
        if (suspended) nextSuspended.add(userId);
        else nextSuspended.delete(userId);
      }
      let nextRestricted = state.restrictedUserIds;
      if (restricted !== undefined) {
        nextRestricted = new Set(state.restrictedUserIds);
        if (restricted) nextRestricted.add(userId);
        else nextRestricted.delete(userId);
      }
      return { ...state, suspendedUserIds: nextSuspended, restrictedUserIds: nextRestricted };
    }
    case "VERIFY_USER_DETAILS": {
      const { userId, verifiedAt } = action.payload;
      return {
        ...state,
        registryUsers: state.registryUsers.map((u) =>
          u.id === userId ? { ...u, detailsVerifiedAt: verifiedAt } : u
        ),
      };
    }
    case "ADD_ACCESS_REQUEST":
      return { ...state, accessRequests: [...state.accessRequests, action.payload] };
    case "UPDATE_ACCESS_REQUEST": {
      const { id, status } = action.payload;
      return {
        ...state,
        accessRequests: state.accessRequests.map((r) => (r.id === id ? { ...r, status } : r)),
      };
    }
    case "SET_BUY_ORDERS":
      return { ...state, buyOrders: action.payload };
    case "SET_SELL_ORDERS":
      return { ...state, sellOrders: action.payload };
    case "ADD_ORDER":
      if (action.payload.type === "Buy") return { ...state, buyOrders: [...state.buyOrders, action.payload] };
      return { ...state, sellOrders: [...state.sellOrders, action.payload] };
    case "UPDATE_ORDER": {
      const o = action.payload;
      if (o.type === "Buy") {
        return { ...state, buyOrders: state.buyOrders.map((x) => (x.id === o.id ? o : x)) };
      }
      return { ...state, sellOrders: state.sellOrders.map((x) => (x.id === o.id ? o : x)) };
    }
    case "SET_ORDER_LC": {
      const { orderId, type, lcNumber } = action.payload;
      const upd = (order: Order) => (order.id === orderId ? { ...order, lcNumber } : order);
      if (type === "Buy") return { ...state, buyOrders: state.buyOrders.map(upd) };
      return { ...state, sellOrders: state.sellOrders.map(upd) };
    }
    case "SET_ORDER_TESTING": {
      const { orderId, type, testingLab, testingResultSummary } = action.payload;
      const upd = (order: Order) =>
        order.id === orderId ? { ...order, ...(testingLab !== undefined && { testingLab }), ...(testingResultSummary !== undefined && { testingResultSummary }) } : order;
      if (type === "Buy") return { ...state, buyOrders: state.buyOrders.map(upd) };
      return { ...state, sellOrders: state.sellOrders.map(upd) };
    }
    case "SET_ORDER_CURRENT_STEP": {
      const { orderId, type, step } = action.payload;
      const upd = (order: Order) => (order.id === orderId ? { ...order, currentStep: step } : order);
      if (type === "Buy") return { ...state, buyOrders: state.buyOrders.map(upd) };
      return { ...state, sellOrders: state.sellOrders.map(upd) };
    }
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [...state.transactions, action.payload] };
    case "UPDATE_TRANSACTION": {
      const t = action.payload;
      return { ...state, transactions: state.transactions.map((x) => (x.id === t.id ? t : x)) };
    }
    case "SET_FACILITIES":
      return { ...state, facilities: action.payload };
    case "ADD_FACILITY":
      return { ...state, facilities: [...state.facilities, action.payload] };
    case "REMOVE_FACILITY":
      return { ...state, facilities: state.facilities.filter((f) => f.id !== action.payload) };
    case "SET_PAYMENT_METHODS":
      return { ...state, paymentMethods: action.payload };
    case "REMOVE_PAYMENT_METHOD":
      return { ...state, paymentMethods: state.paymentMethods.filter((p) => p.id !== action.payload) };
    case "SET_DISPUTES":
      return { ...state, disputes: action.payload };
    case "ADD_DISPUTE":
      return { ...state, disputes: [...state.disputes, action.payload] };
    case "UPDATE_DISPUTE": {
      const d = action.payload;
      return { ...state, disputes: state.disputes.map((x) => (x.id === d.id ? d : x)) };
    }
    case "SET_ENQUIRIES":
      return { ...state, enquiries: action.payload };
    case "ADD_ENQUIRY":
      return { ...state, enquiries: [...state.enquiries, action.payload] };
    case "UPDATE_ENQUIRY": {
      const e = action.payload;
      return { ...state, enquiries: state.enquiries.map((x) => (x.id === e.id ? e : x)) };
    }
    case "ADD_APP_ACTIVITY":
      return { ...state, appActivities: [action.payload, ...state.appActivities].slice(0, 200) };
    case "ADD_MINERAL":
      return { ...state, minerals: [...state.minerals, action.payload] };
    case "UPDATE_MINERAL": {
      const m = action.payload;
      return { ...state, minerals: state.minerals.map((x) => (x.id === m.id ? m : x)) };
    }
    case "REMOVE_MINERAL":
      return { ...state, minerals: state.minerals.filter((x) => x.id !== action.payload) };
    case "ADD_CUSTOM_CATEGORY": {
      const name = (action.payload || "").trim();
      if (!name || state.customCategories.includes(name)) return state;
      return { ...state, customCategories: [...state.customCategories, name] };
    }
    case "ADD_CUSTOM_SELL_CATEGORY": {
      const name = (action.payload || "").trim();
      if (!name || state.customSellCategories.includes(name)) return state;
      return { ...state, customSellCategories: [...state.customSellCategories, name] };
    }
    case "ADD_MINERAL_SUBMISSION":
      return { ...state, mineralSubmissions: [...state.mineralSubmissions, action.payload] };
    case "UPDATE_MINERAL_SUBMISSION": {
      const s = action.payload;
      return { ...state, mineralSubmissions: state.mineralSubmissions.map((x) => (x.id === s.id ? s : x)) };
    }
    case "REMOVE_MINERAL_SUBMISSION":
      return { ...state, mineralSubmissions: state.mineralSubmissions.filter((x) => x.id !== action.payload) };
    case "RECORD_VERIFICATION":
      return { ...state, verificationLog: [action.payload, ...state.verificationLog].slice(0, 500) };
    case "SET_KYC_VERIFICATION": {
      const { userId, result } = action.payload;
      return {
        ...state,
        kycVerificationResults: { ...state.kycVerificationResults, [userId]: result },
      };
    }
    case "SET_LOGISTICS_DETAILS": {
      const d = action.payload;
      return {
        ...state,
        logisticsDetails: { ...state.logisticsDetails, [d.orderId]: d },
      };
    }
    case "ADD_PARTNER_THIRD_PARTY": {
      const added = action.payload;
      const logisticsForOrder: LogisticsDetails = {
        orderId: added.orderId,
        carrierName: added.companyName ?? "",
        trackingNumber: added.trackingNumber,
        trackingUrl: added.trackingUrl,
        qrPayload: added.trackingUrl || "",
        contactPhone: added.contactPhone ?? "",
        contactEmail: added.contactEmail ?? "",
        notes: "",
        shippingAmount: added.shippingAmount,
        shippingCurrency: added.shippingCurrency,
        updatedAt: added.submittedAt ?? new Date().toISOString().slice(0, 10),
      };
      return {
        ...state,
        partnerThirdPartyDetails: [...state.partnerThirdPartyDetails, added],
        logisticsDetails: { ...state.logisticsDetails, [added.orderId]: logisticsForOrder },
      };
    }
    case "UPDATE_PARTNER_THIRD_PARTY": {
      const p = action.payload;
      const existingEntry = state.partnerThirdPartyDetails.find((e) => e.id === p.id);
      const existingLog = state.logisticsDetails[p.orderId];
      const logisticsForOrder: LogisticsDetails = {
        orderId: p.orderId,
        carrierName: p.companyName ?? existingLog?.carrierName ?? "",
        trackingNumber: p.trackingNumber,
        trackingUrl: p.trackingUrl,
        qrPayload: (p.trackingUrl || existingLog?.qrPayload) ?? "",
        contactPhone: p.contactPhone ?? existingLog?.contactPhone ?? "",
        contactEmail: p.contactEmail ?? existingLog?.contactEmail ?? "",
        notes: "",
        shippingAmount: p.shippingAmount ?? existingLog?.shippingAmount,
        shippingCurrency: p.shippingCurrency ?? existingLog?.shippingCurrency,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      const nextLogistics = { ...state.logisticsDetails, [p.orderId]: logisticsForOrder };
      if (existingEntry && existingEntry.orderId !== p.orderId) {
        delete nextLogistics[existingEntry.orderId];
      }
      return {
        ...state,
        partnerThirdPartyDetails: state.partnerThirdPartyDetails.map((e) => (e.id === p.id ? p : e)),
        logisticsDetails: nextLogistics,
      };
    }
    case "ADD_VIDEO_CALL": {
      const { userId, entry } = action.payload;
      const existing = state.userDetails[userId] ?? { loginActivity: [], devices: [], securityNotes: [], activityLog: [], videoCalls: [] };
      const videoCalls = [...(existing.videoCalls ?? []), entry];
      return {
        ...state,
        userDetails: { ...state.userDetails, [userId]: { ...existing, videoCalls } },
      };
    }
    case "UPDATE_ARTISANAL_PROFILE_STATUS": {
      const { userId, status } = action.payload;
      const existing = state.userDetails[userId] ?? { loginActivity: [], devices: [], securityNotes: [], activityLog: [], videoCalls: [] };
      return {
        ...state,
        userDetails: { ...state.userDetails, [userId]: { ...existing, artisanalProfileStatus: status } },
        registryUsers: state.registryUsers.map((u) =>
          u.id === userId ? { ...u, status: status === "approved" ? "Verified" : u.status === "Under Review" ? "Limited" : u.status } : u
        ),
      };
    }
    case "ADD_ARTISANAL_DOCUMENT_REQUEST": {
      const { userId, entry } = action.payload;
      const existing = state.userDetails[userId] ?? { loginActivity: [], devices: [], securityNotes: [], activityLog: [], videoCalls: [] };
      const artisanalDocumentRequests = [...(existing.artisanalDocumentRequests ?? []), entry];
      return {
        ...state,
        userDetails: { ...state.userDetails, [userId]: { ...existing, artisanalDocumentRequests } },
      };
    }
    case "UPDATE_ARTISANAL_ASSET_REQUEST": {
      const { userId, requestId, status, adminNote } = action.payload;
      const existing = state.userDetails[userId] ?? { loginActivity: [], devices: [], securityNotes: [], activityLog: [], videoCalls: [] };
      const artisanalAssetRequests = (existing.artisanalAssetRequests ?? []).map((r) =>
        r.id === requestId ? { ...r, status, ...(adminNote !== undefined ? { adminNote } : {}) } : r
      );
      return {
        ...state,
        userDetails: { ...state.userDetails, [userId]: { ...existing, artisanalAssetRequests } },
      };
    }
    default:
      return state;
  }
}

const initialState: DashboardState = {
  registryUsers: initialRegistryUsers,
  accessRequests: [],
  minerals: initialMinerals,
  mineralSubmissions: initialSellSubmissions,
  buyOrders: initialBuyOrders,
  sellOrders: initialSellOrders,
  transactions: initialTransactions,
  payouts: initialPayouts,
  facilities: initialFacilities,
  paymentMethods: initialPaymentMethods,
  suspendedUserIds: new Set(),
  restrictedUserIds: new Set(),
  disputes: initialDisputes,
  enquiries: initialEnquiries,
  userDetails: initialUserDetails,
  verificationLog: [
    { id: "v-1", at: new Date(Date.now() - 86400000).toISOString(), source: "api", kind: "aml_scan", entityId: DEFAULT_USER_ID, entityType: "user", result: "pass", label: "AML Sanction Database Scan Passed", actor: "Refinitiv API" },
    { id: "v-2", at: new Date(Date.now() - 43200000).toISOString(), source: "ai", kind: "face_match", entityId: DEFAULT_USER_ID, entityType: "user", result: "98", label: "Face Match Algorithm Verified (98%)", actor: "System AI" },
    { id: "v-3", at: new Date(Date.now() - 3600000).toISOString(), source: "manual", kind: "kyc_approval", entityId: DEFAULT_USER_ID, entityType: "user", result: "approved", label: "KYC Verification Approved", actor: "S. Miller" },
  ],
  kycVerificationResults: {},
  logisticsDetails: {
    "B-ORD-5489": {
      orderId: "B-ORD-5489",
      carrierName: "DHL Global",
      trackingNumber: "DHL1234567890",
      trackingUrl: "https://track.dhl.com/ref=DHL1234567890",
      qrPayload: "https://track.dhl.com/ref=DHL1234567890",
      contactPhone: "+233 24 555 0192",
      contactEmail: "support@dhl.com",
      notes: "Armored transport to facility",
      updatedAt: "Jan 25, 2026",
    },
    "S-ORD-8821": {
      orderId: "S-ORD-8821",
      carrierName: "Mineral Bridge Logistics",
      trackingNumber: "MB-SELL-8821",
      trackingUrl: "https://track.mineralbridge.com/S-ORD-8821",
      qrPayload: "https://track.mineralbridge.com/S-ORD-8821",
      contactPhone: "+233 24 555 0192",
      contactEmail: "logistics@mineralbridge.com",
      notes: "Minerals to our place (Sunyani → Accra)",
      updatedAt: "Feb 05, 2026",
    },
  },
  /** User-submitted 3rd party details (Testing & Certification); displayed in Recent 3rd party details; admin can edit. */
  partnerThirdPartyDetails: [
    { id: "TP-U-1", orderId: "O-1234", companyName: "SGS Ghana", trackingNumber: "DHL9876543210", trackingUrl: "https://track.dhl.com/ref=DHL9876543210", submittedAt: "Jan 28, 2026", contactPhone: "+233 24 555 0192", contactEmail: "support@dhl.com", companyDetails: "SGS Ghana Ltd, Accra Lab", uploadedDocuments: ["assay_request.pdf", "sample_spec.pdf"], status: "In transit", expectedDeliveryDate: "Feb 05, 2026", deliveredAt: "", testingPartner: "SGS", shippingAmount: "150", shippingCurrency: "USD" },
    { id: "TP-U-2", orderId: "O-1243", companyName: "FedEx Trade Networks", trackingNumber: "FX1234567890", trackingUrl: "https://fedex.com/track/FX1234567890", submittedAt: "Jan 25, 2026", companyDetails: "FedEx Office, Tema", uploadedDocuments: ["invoice.pdf"], status: "Delivered", expectedDeliveryDate: "Jan 28, 2026", deliveredAt: "Jan 28, 2026 14:00", testingPartner: "Other", shippingAmount: "85", shippingCurrency: "USD" },
    { id: "TP-U-3", orderId: "S-ORD-8821", companyName: "SGS", trackingNumber: "MB-SELL-8821", trackingUrl: "https://track.mineralbridge.com/S-ORD-8821", submittedAt: "Feb 05, 2026", companyDetails: "Mineral Bridge Logistics → SGS Lab", uploadedDocuments: ["mineral_spec.pdf"], status: "Sample received at lab", expectedDeliveryDate: "Feb 06, 2026", deliveredAt: "Feb 05, 2026 10:30", testingPartner: "SGS", shippingAmount: "120", shippingCurrency: "USD" },
  ],
  activeTestingOrders: [
    { id: "ATO-1", orderId: "O-1234", buyerSellerName: "Samuel Osei", mineralType: "Gold", quantity: "50 kg", testingPartner: "SGS", trackingNumber: "DHL9876543210", courierCompany: "DHL Global", shipmentStatus: "Delivered", expectedDeliveryDate: "Feb 05, 2026", deliveredDate: "Feb 05, 2026", sampleReceivedDate: "Feb 05, 2026", testingStartDate: "Feb 06, 2026", testingStatus: "In Progress", certificationStatus: "Not Issued", testingFee: "1,250", paymentStatus: "Paid", currency: "USD", labName: "SGS Ghana Ltd", labRegistrationNumber: "LAB-GH-2024-001", contactPerson: "Dr. Kofi Asante", labPhone: "+233 24 555 0192", labEmail: "lab.accra@sgs.com", labAddress: "Industrial Area, Accra, Ghana", assayRequest: "assay_request_o1234.pdf", invoice: "invoice_o1234.pdf", labReportPdf: "", certificatePdf: "", complianceDocuments: "compliance_o1234.pdf" },
    { id: "ATO-2", orderId: "O-1243", buyerSellerName: "Kwesi Mensah", mineralType: "Copper Cathodes", quantity: "1,200 MT", testingPartner: "Bureau Veritas", trackingNumber: "FX1234567890", courierCompany: "FedEx", shipmentStatus: "Delivered", expectedDeliveryDate: "Jan 28, 2026", deliveredDate: "Jan 28, 2026", sampleReceivedDate: "Jan 29, 2026", testingStartDate: "Jan 30, 2026", testingStatus: "Completed", certificationStatus: "Issued", testingFee: "2,800", paymentStatus: "Paid", currency: "USD", labName: "Bureau Veritas Ghana", labRegistrationNumber: "BV-GH-2023-042", contactPerson: "Ama Serwaa", labPhone: "+233 30 123 4567", labEmail: "minerals.gh@bureauveritas.com", labAddress: "Tema Free Zone, Ghana", assayRequest: "assay_o1243.pdf", invoice: "inv_o1243.pdf", labReportPdf: "lab_report_o1243.pdf", certificatePdf: "cert_o1243.pdf", complianceDocuments: "compliance_o1243.pdf" },
    { id: "ATO-3", orderId: "S-ORD-8821", buyerSellerName: "Amara Okafor", mineralType: "Lithium Ore", quantity: "25 MT", testingPartner: "SGS", trackingNumber: "MB-SELL-8821", courierCompany: "Mineral Bridge Logistics", shipmentStatus: "In transit", expectedDeliveryDate: "Feb 10, 2026", deliveredDate: "", sampleReceivedDate: "", testingStartDate: "", testingStatus: "Pending", certificationStatus: "Not Issued", testingFee: "850", paymentStatus: "Partial", currency: "USD", labName: "SGS Ghana Ltd", labRegistrationNumber: "LAB-GH-2024-001", contactPerson: "Dr. Kofi Asante", labPhone: "+233 24 555 0192", labEmail: "lab.accra@sgs.com", labAddress: "Industrial Area, Accra, Ghana", assayRequest: "assay_s8821.pdf", invoice: "", labReportPdf: "", certificatePdf: "", complianceDocuments: "" },
  ],
  appActivities: [
    { id: "app-1", userId: DEFAULT_USER_ID, type: "profile_updated", description: "Profile name and phone updated", at: new Date(Date.now() - 86400000).toISOString() },
    { id: "app-2", userId: DEFAULT_USER_ID, type: "kyc_doc_uploaded", description: "Mining License (Front) uploaded", at: new Date(Date.now() - 43200000).toISOString() },
    { id: "app-3", userId: "MB-USR-8821-B", type: "order_submitted", description: "Buy order created: Copper Cathodes 1,200 MT", at: new Date(Date.now() - 3600000).toISOString(), metadata: { orderId: "MB-BO-1001" } },
    { id: "app-4", userId: "1", type: "payment_released", description: "Payment released for transaction MB-TX-2001", at: new Date(Date.now() - 7200000).toISOString(), metadata: { transactionId: "MB-TX-2001", orderId: "MB-BO-1001" } },
    { id: "app-5", userId: "1", type: "email_sent", description: "Enquiry reply sent to user MB-USR-4412-S", at: new Date(Date.now() - 1800000).toISOString(), metadata: { userId: "MB-USR-4412-S" } },
  ],
  customCategories: [],
  customSellCategories: [],
};

const DashboardStoreContext = createContext<{ state: DashboardState; dispatch: React.Dispatch<DashboardAction> } | null>(null);

export function DashboardStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  return (
    <DashboardStoreContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardStoreContext.Provider>
  );
}

export function useDashboardStore() {
  const ctx = useContext(DashboardStoreContext);
  if (!ctx) throw new Error("useDashboardStore must be used within DashboardStoreProvider");
  return ctx;
}

export function useAllOrders(): Order[] {
  const { state } = useDashboardStore();
  return [...state.buyOrders, ...state.sellOrders];
}

export function getRegistryUserName(registryUsers: RegistryUserRow[], userId?: string): string {
  if (!userId) return "—";
  const u = registryUsers.find((r) => r.id === userId);
  return u ? u.name : "—";
}

/** Derive whether an order is international (cross-border): buyer country ≠ facility/seller country. */
export function getOrderIsInternational(order: Order, registryUsers: RegistryUserRow[]): boolean {
  const buyerCountry = order.buyerCountry ?? (order.userId ? registryUsers.find((r) => r.id === order.userId)?.country : undefined);
  const sellerCountry = order.sellerCountry ?? order.facility?.country ?? order.deliveryLocation?.country;
  if (!buyerCountry || !sellerCountry) return false;
  return buyerCountry.trim() !== sellerCountry.trim();
}

/** Derive whether a transaction is international (from explicit flag or linked order). */
export function getTransactionIsInternational(
  tx: Transaction,
  allOrders: Order[],
  registryUsers: RegistryUserRow[]
): boolean {
  if (tx.isInternational === true) return true;
  const order = allOrders.find((o) => o.id === tx.orderId);
  if (order) return getOrderIsInternational(order, registryUsers);
  return !!(tx.payerCountry && tx.beneficiaryCountry && tx.payerCountry !== tx.beneficiaryCountry);
}

const EMPTY_USER_DETAILS: UserDetailSet = { loginActivity: [], devices: [], securityNotes: [], activityLog: [], videoCalls: [] };

export function getUserDetails(state: DashboardState, userId?: string): UserDetailSet {
  if (!userId) return EMPTY_USER_DETAILS;
  return state.userDetails[userId] ?? EMPTY_USER_DETAILS;
}

export function getVerificationLogForEntity(state: DashboardState, entityId: string, limit = 20): VerificationLogEntry[] {
  return state.verificationLog.filter((e) => e.entityId === entityId).slice(0, limit);
}

export function getKycVerificationResult(state: DashboardState, userId: string): KycVerificationResult | undefined {
  return state.kycVerificationResults[userId];
}

export function getLogisticsDetailsForOrder(state: DashboardState, orderId: string): LogisticsDetails | undefined {
  return state.logisticsDetails[orderId];
}

/** 3rd party (testing & certification) details for an order. Edits in Partners → 3rd Party Details are synced to logisticsDetails so they appear in Order, Financial, and Transaction views. */
export function getPartnerThirdPartyForOrder(state: DashboardState, orderId: string): PartnerThirdPartyEntry | undefined {
  return state.partnerThirdPartyDetails.find((e) => e.orderId === orderId);
}

export function useDashboardStats() {
  const { state } = useDashboardStore();
  const allOrders = [...state.buyOrders, ...state.sellOrders];
  const pendingOrdersList = allOrders.filter((o) => o.status !== "Completed" && o.status !== "Cancelled");
  const pendingOrders = pendingOrdersList.length;
  const completedTx = state.transactions.filter((t) => t.status === "Completed");
  const revenueSum = completedTx.reduce((sum, t) => {
    const n = parseFloat(t.finalAmount.replace(/[^0-9.-]/g, ""));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
  const pendingSettlement = state.transactions.filter((t) => t.status === "Pending").reduce((sum, t) => {
    const n = parseFloat(t.finalAmount.replace(/[^0-9.-]/g, ""));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
  const usersUnderReview = state.registryUsers.filter((u) => u.status === "Under Review").length;
  const totalUsers = state.registryUsers.length;
  const recentOrders = allOrders.slice(0, 5);
  const recentTransactions = state.transactions.slice(0, 5);
  const hasFailedTx = state.transactions.some((t) => t.status === "Failed");
  const openEnquiriesCount = state.enquiries.filter((e) => e.status !== "Resolved").length;
  /** Callback requests from the app (user requested a call back) — shown in Enquiry & Support and on Dashboard. */
  const callbackRequestsCount = state.enquiries.filter((e) => e.type === "Callback" && e.status !== "Resolved").length;
  return {
    totalUsers,
    pendingOrders,
    openEnquiriesCount,
    callbackRequestsCount,
    revenueSum,
    pendingSettlement,
    usersUnderReview,
    recentOrders,
    recentTransactions,
    hasFailedTx,
  };
}
