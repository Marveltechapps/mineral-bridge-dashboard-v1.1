/** Manual vs AI/API verification – shared across KYC, minerals, compliance. */

export type VerificationSource = "manual" | "ai" | "api";

export interface VerificationLogEntry {
  id: string;
  at: string;
  source: VerificationSource;
  /** e.g. "kyc_approval", "biometric_override", "mineral_review", "aml_scan" */
  kind: string;
  /** User or entity this verification applies to */
  entityId: string;
  /** Optional: "user" | "submission" | "order" */
  entityType?: string;
  /** Pass/fail or score (e.g. 98) */
  result: string;
  /** Short label e.g. "Refinitiv: Pass", "Face match 98%" */
  label: string;
  /** Who triggered or system name */
  actor: string;
  metadata?: Record<string, string>;
}

export interface KycVerificationResult {
  source: VerificationSource;
  score?: number;
  lastVerifiedAt: string;
  biometricSource?: "manual" | "ai" | "override";
}
