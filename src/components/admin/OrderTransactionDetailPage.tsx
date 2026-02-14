import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ArrowLeft, CreditCard, ExternalLink, Gem, Mail, MapPin, Phone, User } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";
import type { Order, Transaction } from "../../store/dashboardStore";
import { Stepper6 } from "./orders/Stepper6";
import { BuyFlow6 } from "./orders/BuyFlow6";
import { SellFlow6 } from "./orders/SellFlow6";
import { toast } from "sonner";

const BUY_FLOW_LABELS = ["Order Submitted", "Awaiting Team Contact", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;
const SELL_FLOW_LABELS = ["Order Submitted", "Awaiting Team Contact", "Sample Test Required", "Price Confirmed", "Payment Initiated", "Order Completed"] as const;

export interface OrderTransactionDetailPageProps {
  orderId: string;
  type: "buy" | "sell";
  onBack: () => void;
  /** Switch to full order detail (Overview, Communication, Testing, etc.). Back there goes to Buy/Sell Management. */
  onOpenFullOrderDetail?: () => void;
}

export function OrderTransactionDetailPage({ orderId, type, onBack, onOpenFullOrderDetail }: OrderTransactionDetailPageProps) {
  const { state, dispatch } = useDashboardStore();
  const [orderForReserve, setOrderForReserve] = useState<Order | null>(null);
  const [releaseConfirmTx, setReleaseConfirmTx] = useState<Transaction | null>(null);
  const [retryingSettlement, setRetryingSettlement] = useState(false);

  const orders = type === "sell" ? state.sellOrders : state.buyOrders;
  const order = orders.find((o) => o.id === orderId) ?? null;
  const relatedTx = order ? state.transactions.find((t) => t.orderId === order.id) : null;
  const registryUser = order ? state.registryUsers.find((u) => u.id === order.userId) : null;
  const displayPhone = order?.contactInfo?.phone ?? registryUser?.phone;
  const displayEmail = order?.contactInfo?.email ?? registryUser?.email;
  const currentStep = order?.currentStep ?? 1;
  const globalStep = type === "buy" ? currentStep : 3 + currentStep;

  const handleCallBuyer = (o: Order) => {
    const phone = o.contactInfo?.phone ?? state.registryUsers.find((u) => u.id === o.userId)?.phone;
    const name = o.contactInfo?.name ?? state.registryUsers.find((u) => u.id === o.userId)?.name ?? "Buyer";
    if (phone?.trim()) {
      window.open(`tel:${phone.trim().replace(/\s/g, "")}`, "_self");
      dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: o.id, type: "Buy", step: 2 } });
      toast.success(`Opening call to ${name}`, { description: "Step 2 in progress" });
    } else {
      toast.error("No phone number", { description: "Add buyer phone in order or registry to call." });
    }
  };

  const handleReserveConfirm = () => {
    if (!orderForReserve) return;
    const value = orderForReserve.orderSummary?.total ?? orderForReserve.aiEstimatedAmount ?? "—";
    dispatch({
      type: "UPDATE_ORDER",
      payload: { ...orderForReserve, escrowStatus: "Reserved", currentStep: 3 },
    });
    dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: orderForReserve.id, type: "Buy", step: 3 } });
    toast.success(`${value} reserved`, { description: "Escrow reserved. Step 3 complete." });
    setOrderForReserve(null);
  };

  const handleReleasePayment = (tx: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: { ...tx, status: "Completed" } });
    const ord = orders.find((o) => o.id === tx.orderId);
    if (ord) {
      const labels = ord.type === "Buy" ? [...BUY_FLOW_LABELS] : [...SELL_FLOW_LABELS];
      const flowSteps = labels.map((label) => ({ label, completed: true, active: false }));
      dispatch({
        type: "UPDATE_ORDER",
        payload: { ...ord, status: "Completed", flowSteps, currentStep: 6 },
      });
    }
    setReleaseConfirmTx(null);
    toast.success("Payment released", { description: `${tx.finalAmount} sent. Order ${tx.orderId} completed.` });
  };

  const handleCompleteStep2To3 = () => {
    if (!order || type !== "buy" || (order.currentStep ?? 1) !== 2) return;
    const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";
    dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: 3 } });
    toast.success("Step 2 completed!", { description: `Reserve ${value} (Step 3) unlocked` });
  };

  const handleRetrySettlement = async (tx: Transaction) => {
    setRetryingSettlement(true);
    await new Promise((r) => setTimeout(r, 2000));
    dispatch({ type: "UPDATE_TRANSACTION", payload: { ...tx, status: "Pending" } });
    toast.success(`TX-${tx.id} RETRIED! Now Pending`);
    setRetryingSettlement(false);
  };

  const setActiveStep6 = (step: number) => {
    if (order && type === "buy") {
      const stepClamped = Math.min(Math.max(step, 1), 3);
      dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Buy", step: stepClamped } });
    }
    if (order && type === "sell") {
      const stepClamped = Math.min(Math.max(step - 3, 1), 3);
      dispatch({ type: "SET_ORDER_CURRENT_STEP", payload: { orderId: order.id, type: "Sell", step: stepClamped } });
    }
  };

  if (!order) {
    return (
      <div className="p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button" onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-emerald-600">
                  Orders & Settlements
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbPage className="text-xs font-medium">Order {orderId}</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Order not found.</p>
            <Button variant="outline" className="mt-4" onClick={onBack}>
              Back to Orders & Settlements
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-medium text-muted-foreground hover:text-emerald-600 flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Orders & Settlements
              </button>
              </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">{order.id}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{order.id}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {getRegistryUserName(state.registryUsers, order.userId)} · {order.type} · {order.mineral}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={order.type === "Buy" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20"}>
              {order.type}
            </Badge>
            <Badge
              className={
                order.status === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30"
              }
            >
              {order.status}
            </Badge>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{order.aiEstimatedAmount}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {onOpenFullOrderDetail && (
            <Button variant="outline" size="sm" onClick={onOpenFullOrderDetail} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Full order detail
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders & Settlements
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-medium">Overview</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-4 pb-4 text-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 shrink-0" />
              <span>{getRegistryUserName(state.registryUsers, order.userId)}</span>
            </div>
            {displayPhone && (
              <a href={`tel:${displayPhone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[#A855F7] hover:underline">
                <Phone className="h-4 w-4 shrink-0" />
                {displayPhone}
              </a>
            )}
            {displayEmail && (
              <a href={`mailto:${displayEmail}`} className="flex items-center gap-2 text-[#A855F7] hover:underline">
                <Mail className="h-4 w-4 shrink-0" />
                {displayEmail}
              </a>
            )}
            {order.facility?.name && (
              <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{order.facility.name}{order.facility.address ? ` · ${order.facility.address}` : ""}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-muted-foreground">Amount: <span className="font-medium text-slate-900 dark:text-white">{order.aiEstimatedAmount}</span></span>
            <span className="text-muted-foreground">Created: {order.createdAt}</span>
          </div>
        </CardContent>
      </Card>

      <Stepper6 activeStep={globalStep} onStepChange={(s) => setActiveStep6(s)} />

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gem className="h-4 w-4 text-[#A855F7]" />
            {order.type === "Buy" ? "Buy flow (Steps 1–3)" : "Sell flow (Steps 4–6)"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.type === "Buy" ? (
            <BuyFlow6
              order={order}
              onStepComplete={(s) => setActiveStep6(s + 1)}
              onCallBuyer={handleCallBuyer}
              onReserveEscrow={(o) => setOrderForReserve(o)}
              dispatch={dispatch}
            />
          ) : (
            <SellFlow6
              order={order}
              onStepComplete={(s) => setActiveStep6(3 + s)}
              dispatch={dispatch}
            />
          )}
        </CardContent>
      </Card>

      {order.type === "Buy" && currentStep === 2 && (
        <Button
          onClick={handleCompleteStep2To3}
          className="w-full h-14 text-base bg-emerald-600 hover:bg-emerald-700"
        >
          Complete Step 2/3 → Reserve {order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—"}
        </Button>
      )}

      {relatedTx && relatedTx.status === "Failed" && (
        <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <CardTitle className="text-base font-bold text-red-800 dark:text-red-300">
                {relatedTx.id} Failed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-1">
              <p><strong>Amount:</strong> {relatedTx.finalAmount}</p>
              <p><strong>Method:</strong> {relatedTx.method ?? "—"}</p>
              <p><strong>Date:</strong> {relatedTx.date ?? "—"}</p>
            </div>
            <Button
              onClick={() => handleRetrySettlement(relatedTx)}
              disabled={retryingSettlement}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {retryingSettlement ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Retrying...
                </>
              ) : (
                "Retry Settlement"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {relatedTx && relatedTx.status !== "Failed" && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#A855F7]" />
              Settlement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-mono text-muted-foreground">{relatedTx.id}</span>
              <span className="font-medium">{relatedTx.finalAmount}</span>
              <Badge variant="secondary" className={relatedTx.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>
                {relatedTx.status}
              </Badge>
            </div>
            {(relatedTx.method || relatedTx.date) && (
              <p className="text-xs text-muted-foreground">
                {[relatedTx.method, relatedTx.date].filter(Boolean).join(" · ")}
              </p>
            )}
            {relatedTx.status === "Pending" && (
              <Button
                size="sm"
                className="bg-[#A855F7] hover:bg-purple-600"
                onClick={() => setReleaseConfirmTx(relatedTx)}
              >
                Release Payment
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!orderForReserve} onOpenChange={(open) => { if (!open) setOrderForReserve(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reserve in escrow?</AlertDialogTitle>
            <AlertDialogDescription>
              {orderForReserve && (
                <>
                  Reserve {orderForReserve.orderSummary?.total ?? orderForReserve.aiEstimatedAmount ?? "—"} for order {orderForReserve.id}?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReserveConfirm} className="bg-[#A855F7] hover:bg-purple-600">
              Reserve $
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!releaseConfirmTx} onOpenChange={(open) => { if (!open) setReleaseConfirmTx(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {releaseConfirmTx && (
                <>
                  Release {releaseConfirmTx.finalAmount} to seller for order {releaseConfirmTx.orderId}? This will complete the settlement.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => releaseConfirmTx && handleReleasePayment(releaseConfirmTx)} className="bg-emerald-600 hover:bg-emerald-700">
              Release Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
