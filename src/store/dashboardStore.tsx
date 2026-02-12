import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Mineral } from "../components/admin/minerals/types";
import type { MineralSubmission } from "../types/sellSubmissions";
import type { UserDetailSet } from "../types/userDetails";
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
  updatedAt: string;
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
  testingReqs?: { label: string; status: "Pending" | "Uploaded" }[];
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
  };
  settlementNote: string;
  adminNotes: { admin: string; text: string; date: string }[];
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

export interface LinkedPaymentMethod {
  id: string;
  label: string;
  maskedNumber: string;
  isPrimary: boolean;
  verified: boolean;
  lastUsed: string;
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

/** Activity recorded from the app (onboarding, profile, KYC, etc.) so the dashboard reflects every small detail. */
export interface AppActivity {
  id: string;
  userId: string;
  type: "profile_updated" | "kyc_doc_uploaded" | "onboarding_step" | "listing_created" | "order_submitted" | "app_login" | "settings_updated" | "safety_upload" | "other";
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
      { type: "qr_or_bank", label: "Bank details for payment", date: "Feb 03, 2026", channel: "App", detail: "Wise / SEPA details sent" },
    ],
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
  },
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
  { id: "pm-1", label: "Commercial Bank of Ethiopia", maskedNumber: "•••• 4829", isPrimary: true, verified: true, lastUsed: "Today, 10:23 AM" },
  { id: "pm-2", label: "Wise (International)", maskedNumber: "•••• 9921", isPrimary: false, verified: true, lastUsed: "Oct 12, 2025" },
];

const initialDisputes: Dispute[] = [
  { id: "D-0456", orderId: "B-ORD-5489", status: "Open", buyer: { name: "Samuel Osei Trading" }, seller: { name: "Platform" }, mineral: "Copper Cathodes 1,200 MT", amount: "$1,118,500", raisedAt: "Feb 01, 2026" },
  { id: "D-0457", orderId: "S-ORD-8821", status: "In Review", buyer: { name: "Platform" }, seller: { name: "Samuel Osei" }, mineral: "Gold Dust (92%) 12.5 KG", amount: "$724,200", raisedAt: "Feb 04, 2026" },
];

const initialEnquiries: Enquiry[] = [
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
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
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
  | { type: "SET_LOGISTICS_DETAILS"; payload: LogisticsDetails };

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
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [...state.transactions, action.payload] };
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
  facilities: initialFacilities,
  paymentMethods: initialPaymentMethods,
  suspendedUserIds: new Set(),
  restrictedUserIds: new Set(),
  disputes: initialDisputes,
  enquiries: initialEnquiries,
  userDetails: initialUserDetails,
  verificationLog: [
    { id: "v-1", at: new Date(Date.now() - 86400000).toISOString(), source: "api", kind: "aml_scan", entityId: DEFAULT_USER_ID, entityType: "user", result: "pass", label: "Refinitiv: Pass", actor: "Refinitiv API" },
    { id: "v-2", at: new Date(Date.now() - 43200000).toISOString(), source: "ai", kind: "face_match", entityId: DEFAULT_USER_ID, entityType: "user", result: "98", label: "Face match 98%", actor: "System AI" },
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
  },
  appActivities: [
    { id: "app-1", userId: DEFAULT_USER_ID, type: "profile_updated", description: "Profile name and phone updated", at: new Date(Date.now() - 86400000).toISOString() },
    { id: "app-2", userId: DEFAULT_USER_ID, type: "kyc_doc_uploaded", description: "Mining License (Front) uploaded", at: new Date(Date.now() - 43200000).toISOString() },
    { id: "app-3", userId: "MB-USR-8821-B", type: "order_submitted", description: "Buy order created: Copper Cathodes 1,200 MT", at: new Date(Date.now() - 3600000).toISOString() },
  ],
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

const EMPTY_USER_DETAILS: UserDetailSet = { loginActivity: [], devices: [], securityNotes: [], activityLog: [] };

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
  return {
    totalUsers,
    pendingOrders,
    revenueSum,
    pendingSettlement,
    usersUnderReview,
    recentOrders,
    recentTransactions,
    hasFailedTx,
  };
}
