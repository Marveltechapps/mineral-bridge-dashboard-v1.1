/**
 * Financial & Reporting API layer.
 * When VITE_FINANCIAL_API_URL is set, calls backend /api/financial/*; otherwise uses mock.
 */

import type { DashboardAction } from "../store/dashboardStore";

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as { env?: { VITE_FINANCIAL_API_URL?: string } }).env?.VITE_FINANCIAL_API_URL) ||
  "";
const financialApi = (path: string) => `${API_BASE.replace(/\/$/, "")}/api/financial${path.startsWith("/") ? path : `/${path}`}`;

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

/** Generate QR + send via email/WhatsApp. Calls POST /api/financial/send-qr when VITE_FINANCIAL_API_URL is set. */
export async function sendQr(payload: SendQrPayload): Promise<{ success: boolean; qrData?: string }> {
  const { transactionId, orderId, channel } = payload;
  if (API_BASE) {
    const res = await fetch(financialApi("/send-qr"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, orderId, channel }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Send QR failed");
    return { success: true, qrData: data.qrData };
  }
  await new Promise((r) => setTimeout(r, 600));
  return { success: true, qrData: `https://app.mineralbridge.com/order/${orderId}` };
}

/** Twilio call/SMS + log enquiry. Calls POST /api/financial/call-buyer when VITE_FINANCIAL_API_URL is set. */
export async function callBuyer(payload: CallBuyerPayload): Promise<{ success: boolean }> {
  const { transactionId, orderId, action } = payload;
  if (API_BASE) {
    const res = await fetch(financialApi("/call-buyer"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, orderId, action }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Call buyer failed");
    return { success: true };
  }
  await new Promise((r) => setTimeout(r, 500));
  return { success: true };
}

/** Stripe escrow. Calls POST /api/financial/reserve-escrow when VITE_FINANCIAL_API_URL is set. */
export async function reserveEscrow(payload: ReserveEscrowPayload): Promise<{ success: boolean }> {
  const { transactionId, orderId, amount, currency } = payload;
  if (API_BASE) {
    const res = await fetch(financialApi("/reserve-escrow"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, orderId, amount, currency }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Reserve escrow failed");
    return { success: true };
  }
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
