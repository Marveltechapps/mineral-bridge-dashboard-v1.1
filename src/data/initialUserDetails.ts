import type { UserDetailSet } from "../types/userDetails";

const DEFAULT_USER_ID = "MB-USR-4412-S";
const USER_8821 = "MB-USR-8821-B";
const ARTISANAL_CAMEROON = "MB-USR-2210-S";
const ARTISANAL_ETHIOPIA = "MB-USR-4491-S";

export const initialUserDetails: Record<string, UserDetailSet> = {
  [DEFAULT_USER_ID]: {
    videoCalls: [
      { id: "vc-001", platform: "Google Meet", link: "https://meet.google.com/abc-defg-hij", sentVia: "app", sentAt: "Feb 10, 2026 • 10:00 AM", recordingUrl: "https://drive.example.com/recording-1", note: "KYC verification call" },
      { id: "vc-002", platform: "WhatsApp", link: "https://wa.me/233245550192", sentVia: "email", sentAt: "Feb 08, 2026 • 2:30 PM" },
    ],
    loginActivity: [
      { id: "LG-001", date: "Feb 05, 2026", time: "09:12 AM", method: "Phone + OTP", device: "iPhone 15 Pro", location: "Accra, Ghana", ip: "154.160.XXX.XX", status: "Success" },
      { id: "LG-002", date: "Feb 04, 2026", time: "11:30 PM", method: "Email + OTP", device: "iPhone 15 Pro", location: "Kumasi, Ghana", ip: "154.161.XXX.XX", status: "Success" },
      { id: "LG-003", date: "Feb 03, 2026", time: "04:15 PM", method: "Phone + OTP", device: "iPhone 15 Pro", location: "Accra, Ghana", ip: "154.160.XXX.XX", status: "Success" },
      { id: "LG-004", date: "Feb 02, 2026", time: "08:45 AM", method: "Phone + OTP", device: "MacBook Pro", location: "Accra, Ghana", ip: "192.168.XXX.XX", status: "Success" },
      { id: "LG-005", date: "Jan 31, 2026", time: "10:20 PM", method: "Phone + OTP", device: "iPhone 15 Pro", location: "Lagos, Nigeria", ip: "105.112.XXX.XX", status: "Failed" },
    ],
    devices: [
      { id: "DEV-01", type: "iOS", model: "iPhone 15 Pro", osVersion: "iOS 17.4", appVersion: "v2.4.1 (Build 882)", firstSeen: "Jan 12, 2026", lastActive: "Active Now", status: "Active", isCurrent: true },
      { id: "DEV-02", type: "Web", model: "Chrome / macOS", osVersion: "macOS 14.2", appVersion: "v2.4.0 (Desktop)", firstSeen: "Jan 15, 2026", lastActive: "3 days ago", status: "Expired", isCurrent: false },
    ],
    securityNotes: [
      { admin: "S. Miller", text: "Verified failed login attempt from Lagos; user confirmed they were traveling but had poor signal for OTP.", timestamp: "Feb 01, 2026 • 09:00 AM" },
      { admin: "System", text: "Account status changed to 'Normal' following manual KYC review.", timestamp: "Jan 14, 2026 • 02:30 PM" },
    ],
    activityLog: [
      { id: "EV-001", type: "Admin", title: "Account Marked Under Review", description: "Account access restricted pending further KYC clarification.", source: "Admin Dashboard", date: "Feb 05, 2026", time: "10:30 AM", metadata: { adminName: "S. Miller", fullDetails: "Manual restriction triggered following suspicious login attempt from unrecognized location." }, notes: [{ admin: "S. Miller", text: "Contacted user via secondary email to verify travel status.", timestamp: "Feb 05, 2026 • 10:45 AM" }] },
      { id: "EV-002", type: "User", title: "Buy Order Created", description: "Initiated purchase of 20kg Copper Cathodes.", source: "Mobile App (iOS)", date: "Feb 05, 2026", time: "09:15 AM", relatedId: "B-ORD-5489", relatedType: "Order", metadata: { device: "iPhone 15 Pro", ip: "154.160.XXX.XX", fullDetails: "Order parameters: Grade A, 99.9% purity, CIF Terms." }, notes: [] },
      { id: "EV-003", type: "Compliance", title: "KYC Document Approved", description: "Business Operating Permit verified by compliance team.", source: "System Automation", date: "Feb 04, 2026", time: "02:20 PM", relatedId: "DOC-882", relatedType: "KYC", metadata: { fullDetails: "Automated OCR match 98%. Human secondary review: S. Miller." }, notes: [] },
    ],
  },
  [USER_8821]: {
    videoCalls: [],
    loginActivity: [
      { id: "LG-101", date: "Feb 05, 2026", time: "08:30 AM", method: "Email + OTP", device: "Chrome / Windows", location: "Accra, Ghana", ip: "154.160.XXX.YY", status: "Success" },
    ],
    devices: [
      { id: "DEV-11", type: "Web", model: "Chrome / Windows", osVersion: "Windows 11", appVersion: "v2.4.0 (Desktop)", firstSeen: "Feb 01, 2026", lastActive: "Yesterday", status: "Active", isCurrent: true },
    ],
    securityNotes: [],
    activityLog: [
      { id: "EV-101", type: "User", title: "Profile Updated", description: "Company name and contact details changed.", source: "Mobile App", date: "Feb 04, 2026", time: "03:00 PM", metadata: {}, notes: [] },
    ],
  },
  [ARTISANAL_CAMEROON]: {
    videoCalls: [],
    loginActivity: [],
    devices: [],
    securityNotes: [],
    activityLog: [],
    artisanalProfile: {
      operationType: "Independent Miner",
      country: "Cameroon",
      stateProvince: "East",
      district: "Kadey",
      villageTown: "Batouri",
      gpsLocation: "4.4333° N, 14.3667° E",
      miningAreaType: ["River / Alluvial"],
      mineralType: "Gold",
      miningMethod: "Manual",
      yearsOfExperience: 8,
      numberOfWorkers: 4,
      miningLicenseUploaded: true,
      cooperativeGroup: false,
      childLaborDeclaration: true,
      safePracticesEnvironmental: true,
      submittedAt: "Feb 10, 2026 • 2:15 PM",
    },
    artisanalProfileStatus: "pending",
    artisanalDocumentRequests: [],
    artisanalAssetRequests: [
      { id: "ast-1", assetType: "Certified PPE Kit", priceCap: "$150 • 3 months CAP", requestedAt: "Feb 09, 2026 • 11:20 AM", status: "pending" },
    ],
    artisanalIncidentLog: [],
  },
  [ARTISANAL_ETHIOPIA]: {
    videoCalls: [],
    loginActivity: [],
    devices: [],
    securityNotes: [],
    activityLog: [],
    artisanalProfile: {
      operationType: "Cooperative Group",
      country: "Ethiopia",
      stateProvince: "Oromia",
      district: "West Guji",
      villageTown: "Dawa",
      gpsLocation: "5.5736° N, 38.2510° E",
      miningAreaType: ["Mountain / Hard Rock", "Open Pit"],
      mineralType: "Gold, Gemstones",
      miningMethod: "Semi-Mech",
      yearsOfExperience: 12,
      numberOfWorkers: 18,
      miningLicenseUploaded: true,
      cooperativeGroup: true,
      childLaborDeclaration: true,
      safePracticesEnvironmental: true,
      submittedAt: "Feb 11, 2026 • 9:00 AM",
    },
    artisanalProfileStatus: "pending",
    artisanalDocumentRequests: [],
    artisanalAssetRequests: [
      { id: "ast-2", assetType: "Pneumatic Drill Unit", priceCap: "$850 • 6 months CAP", requestedAt: "Feb 11, 2026 • 2:00 PM", status: "pending" },
    ],
    artisanalIncidentLog: [
      { id: "inc-1", category: "Safety Breach", detailedReport: "Minor equipment malfunction at site; no injuries. Reported for record.", evidenceSubmitted: true, emergencyAlertDispatched: true, dispatchedAt: "Feb 10, 2026 • 4:45 PM", status: "acknowledged" },
    ],
  },
};
