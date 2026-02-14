/**
 * Financial & Reporting API layer.
 * Uses dashboard store for state; replace with fetch('/api/...') when backend is available.
 */

import type { DashboardAction } from "../store/dashboardStore";

export type FinancialFlowStep =
  | "send-qr"
  | "call-buyer"
  | "reserve-escrow"
  | "testing"
  | "lc-issued"
  | "release";

export const FLOW_STEPS: { id: FinancialFlowStep; label: string }[] = [
  { id: "send-qr", label: "Send QR" },
  { id: "call-buyer", label: "Call Buyer" },
  { id: "reserve-escrow", label: "Reserve Escrow" },
  { id: "testing", label: "Testing" },
  { id: "lc-issued", label: "LC Issued" },
  { id: "release", label: "Release Payment" },
];

export interface SendQrPayload {
  transactionId: string;
  orderId: string;
  channel: "email" | "whatsapp";
  dispatch: React.Dispatch<DashboardAction>;
}
export interface CallBuyerPayload {
  transactionId: string;
  orderId: string;
  action: "voice" | "sms";
  dispatch: React.Dispatch<DashboardAction>;
}
export interface ReserveEscrowPayload {
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  dispatch: React.Dispatch<DashboardAction>;
}
export interface TestingPayload {
  transactionId: string;
  orderId: string;
  orderType: "Buy" | "Sell";
  lab: string;
  resultSummary?: string;
  dispatch: React.Dispatch<DashboardAction>;
}
export interface LcIssuePayload {
  transactionId: string;
  orderId: string;
  orderType: "Buy" | "Sell";
  lcNumber: string;
  dispatch: React.Dispatch<DashboardAction>;
}
export interface ReleasePayload {
  transactionId: string;
  orderId: string;
  dispatch: React.Dispatch<DashboardAction>;
}

/** Generate QR + send via email/WhatsApp (mock – in production calls POST /api/send-qr). */
export async function sendQr(payload: SendQrPayload): Promise<{ success: boolean; qrData?: string }> {
  const { dispatch } = payload;
  await new Promise((r) => setTimeout(r, 600));
  // In production: const res = await fetch('/api/send-qr', { method: 'POST', body: JSON.stringify({...}) });
  return { success: true, qrData: `https://app.mineralbridge.com/order/${payload.orderId}` };
}

/** Twilio call/SMS + log enquiry (mock – in production POST /api/call-buyer). */
export async function callBuyer(payload: CallBuyerPayload): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true };
}

/** Stripe escrow (mock – in production POST /api/reserve-escrow). */
export async function reserveEscrow(payload: ReserveEscrowPayload): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 800));
  return { success: true };
}

/** SGS/lab assignment + compliance (mock – in production POST /api/testing). */
export async function submitTesting(payload: TestingPayload): Promise<{ success: boolean }> {
  const { orderId, orderType, lab, resultSummary, dispatch } = payload;
  dispatch({
    type: "SET_ORDER_TESTING",
    payload: {
      orderId,
      type: orderType,
      testingLab: lab,
      testingResultSummary: resultSummary ?? `Lab: ${lab}`,
    },
  });
  return { success: true };
}

/** LC PDF + SWIFT (mock – in production POST /api/lc-issue). */
export async function issueLc(payload: LcIssuePayload): Promise<{ success: boolean }> {
  const { orderId, orderType, lcNumber, dispatch } = payload;
  dispatch({
    type: "SET_ORDER_LC",
    payload: { orderId, type: orderType, lcNumber },
  });
  await new Promise((r) => setTimeout(r, 400));
  return { success: true };
}

/** Stripe payout + mark complete (mock – in production POST /api/release). Caller should dispatch UPDATE_TRANSACTION with updated tx. */
export async function releasePayment(_payload: ReleasePayload): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 500));
  return { success: true };
}
