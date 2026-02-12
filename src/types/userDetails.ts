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

export interface UserDetailSet {
  loginActivity: LoginAttempt[];
  devices: DeviceSession[];
  securityNotes: SecurityNote[];
  activityLog: ActivityEvent[];
}
