/** Per-user detail types for User Management (security, devices, notes, activity log). */

export interface LoginAttempt {
  id: string;
  date: string;
  time: string;
  method: string;
  device: string;
  location: string;
  ip: string;
  status: "Success" | "Failed";
}

export interface DeviceSession {
  id: string;
  type: string;
  model: string;
  osVersion: string;
  appVersion: string;
  firstSeen: string;
  lastActive: string;
  status: "Active" | "Expired";
  isCurrent: boolean;
}

export interface SecurityNote {
  admin: string;
  text: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  type: "System" | "User" | "Admin" | "Compliance";
  title: string;
  description: string;
  source: string;
  date: string;
  time: string;
  relatedId?: string;
  relatedType?: "Order" | "Facility" | "KYC" | "Note";
  metadata: { device?: string; ip?: string; adminName?: string; fullDetails?: string };
  notes: { admin: string; text: string; timestamp: string }[];
}

/** Video call/chat link sent to user (WhatsApp, Google Meet, Zoom, etc.). Link sent via app notification or email. Recordings stored per user. */
export interface VideoCallEntry {
  id: string;
  /** Platform: WhatsApp, Google Meet, Zoom, or Other */
  platform: "WhatsApp" | "Google Meet" | "Zoom" | "Other";
  /** Meeting or chat link */
  link: string;
  /** How the link was sent to the user */
  sentVia: "app" | "email";
  /** When the link was sent */
  sentAt: string;
  /** Optional: link to recording (all videos recorded in user data) */
  recordingUrl?: string;
  /** Optional admin note */
  note?: string;
}

/** ASM (Artisanal & Small-Scale Mining) regulatory onboarding data collected from app (7 steps). Sellers only — small-scale miners, cooperatives, or individuals (African only). */
export interface ArtisanalProfile {
  /** Step 1: Operation type */
  operationType: "Independent Miner" | "Cooperative Group" | "Supporting NGO";
  /** Step 2: Location */
  country: string;
  stateProvince?: string;
  district?: string;
  villageTown?: string;
  gpsLocation?: string;
  miningAreaType: ("River / Alluvial" | "Open Pit" | "Mountain / Hard Rock" | "Underground")[];
  /** Step 3: Operation details */
  mineralType?: string;
  miningMethod?: "Manual" | "Semi-Mech" | "Mechanized";
  yearsOfExperience?: number;
  numberOfWorkers?: number;
  /** Step 5: Compliance & trust */
  miningLicenseUploaded?: boolean;
  miningLicenseUrl?: string;
  cooperativeGroup?: boolean;
  childLaborDeclaration: boolean;
  safePracticesEnvironmental?: boolean;
  sitePhotoUrl?: string;
  shortVideoUrl?: string;
  /** When the profile was submitted from app */
  submittedAt: string;
}

/** Document request sent to artisanal user after they enter homepage. Sent via app notification or email; when sent via app, received in app and shown in dashboard. */
export interface ArtisanalDocumentRequest {
  id: string;
  /** Type of document requested (aligned with Figma: Mining License, ASM Verification, PPE/Equipment, Incident Report, etc.) */
  documentType: "Mining License" | "ASM Verification Bundle" | "Certified PPE Kit Receipt" | "Equipment Receipt (Drill/Pump)" | "Incident Report / Evidence" | "Safety Compliance Document" | "Other";
  /** Optional message to the user */
  message?: string;
  /** Sent via app notification (user receives in app) or email */
  sentVia: "app" | "email";
  sentAt: string;
  /** sent = delivered to channel; viewed = user opened in app; submitted = user uploaded document */
  status: "sent" | "viewed" | "submitted";
  submittedAt?: string;
  /** Optional admin note after review */
  note?: string;
}

/** Asset Hub (Figma 3046-5512): when artisanal user taps REQUEST in app for Certified PPE Kit, Pneumatic Drill Unit, or Institutional Pump — reflects in dashboard. */
export interface ArtisanalAssetRequest {
  id: string;
  assetType: "Certified PPE Kit" | "Pneumatic Drill Unit" | "Institutional Pump";
  /** e.g. "$150 • 3 months CAP", "$850 • 6 months CAP", "$1,200 • 8 months CAP" */
  priceCap: string;
  requestedAt: string;
  status: "pending" | "approved" | "fulfilled" | "rejected";
  adminNote?: string;
}

/** Incident Log (Figma 3046-5768): when user is in emergency and submits incident / dispatches emergency alert — reflects in dashboard. Part of their profile. */
export interface ArtisanalIncidentEntry {
  id: string;
  /** e.g. Safety Breach */
  category: string;
  detailedReport?: string;
  evidenceSubmitted?: boolean;
  /** When they tapped DISPATCH EMERGENCY ALERT */
  emergencyAlertDispatched: boolean;
  dispatchedAt: string;
  status: "submitted" | "acknowledged" | "resolved";
  adminNote?: string;
}

export interface UserDetailSet {
  loginActivity: LoginAttempt[];
  devices: DeviceSession[];
  securityNotes: SecurityNote[];
  activityLog: ActivityEvent[];
  /** Video call/chat links sent to this user; recordings stored here */
  videoCalls: VideoCallEntry[];
  /** ASM onboarding profile (artisanal sellers only). Status for admin approve/reject. */
  artisanalProfile?: ArtisanalProfile;
  artisanalProfileStatus?: "pending" | "approved" | "rejected";
  /** Document requests sent to this artisanal user (via app notification or email); received in app when sent via notification. */
  artisanalDocumentRequests?: ArtisanalDocumentRequest[];
  /** Asset Hub: when user requests equipment (PPE Kit, Drill Unit, Pump) in the app, it reflects here. */
  artisanalAssetRequests?: ArtisanalAssetRequest[];
  /** Incident Log: when user submits an incident or dispatches emergency alert in the app, it reflects here. */
  artisanalIncidentLog?: ArtisanalIncidentEntry[];
}
