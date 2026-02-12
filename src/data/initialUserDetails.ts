import type { UserDetailSet } from "../types/userDetails";

const DEFAULT_USER_ID = "MB-USR-4412-S";
const USER_8821 = "MB-USR-8821-B";

export const initialUserDetails: Record<string, UserDetailSet> = {
  [DEFAULT_USER_ID]: {
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
};
