import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, MapPin, FileText, CheckCircle2, Gem } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDashboardStore } from "../../store/dashboardStore";
import type { Order, OrderContactInfo, OrderDeliveryLocation, OrderSummaryBreakdown } from "../../store/dashboardStore";
import type { Mineral } from "../admin/minerals/types";
import { format } from "date-fns";

const BUY_FLOW_STEPS = [
  { id: "mineral", label: "Select mineral", icon: Gem },
  { id: "address", label: "Address & contact", icon: MapPin },
  { id: "review", label: "Review & AI estimate", icon: FileText },
  { id: "success", label: "Order received", icon: CheckCircle2 },
];

function generateOrderId(): string {
  return `B-ORD-${String(Date.now()).slice(-6)}`;
}

function formatCurrency(amount: number, currency: string): string {
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (currency === "USD") return `$${formatted}`;
  return `${currency} ${formatted}`;
}

/** Build full AI-estimated order summary from mineral (platform fee %, transport) and quantity. */
function buildOrderSummary(
  mineral: Mineral | null,
  quantityNum: number,
  unit: string
): OrderSummaryBreakdown | null {
  if (!mineral || quantityNum <= 0) return null;
  const currency = mineral.currency ?? "USD";
  const subtotalNum = mineral.basePrice * quantityNum;
  const transportNum =
    typeof mineral.defaultTransportAmount === "number" && !Number.isNaN(mineral.defaultTransportAmount)
      ? mineral.defaultTransportAmount
      : 0;
  const feePercent =
    typeof mineral.platformFeePercent === "number" && !Number.isNaN(mineral.platformFeePercent)
      ? mineral.platformFeePercent
      : 1;
  const feeNum = subtotalNum * (feePercent / 100);
  const totalNum = subtotalNum + transportNum + feeNum;
  return {
    subtotal: formatCurrency(subtotalNum, currency),
    subtotalLabel: mineral.name,
    tax: formatCurrency(0, currency),
    shippingCost: formatCurrency(transportNum, currency),
    platformFee: formatCurrency(feeNum, currency),
    platformFeePercent: feePercent,
    total: formatCurrency(totalNum, currency),
    currency,
  };
}

export interface BuyFlowProps {
  /** Pre-selected mineral id from catalog (e.g. from Mineral Management). */
  initialMineralId?: string;
  onBack: () => void;
  onOrderPlaced?: (orderId: string) => void;
}

export function BuyFlow({ initialMineralId, onBack, onOrderPlaced }: BuyFlowProps) {
  const { state, dispatch } = useDashboardStore();
  const minerals = state.minerals;

  const [step, setStep] = useState<"mineral" | "address" | "review" | "success">(
    initialMineralId ? "address" : "mineral"
  );
  const [mineralId, setMineralId] = useState<string>(initialMineralId ?? "");
  const [quantity, setQuantity] = useState<string>("1");
  const [unit, setUnit] = useState<string>("MT");

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const hasDispatchedOrder = useRef(false);

  const selectedMineral = useMemo(
    () => minerals.find((m) => m.id === mineralId) ?? null,
    [minerals, mineralId]
  );
  const quantityNum = useMemo(() => Math.max(0, Number(quantity) || 0), [quantity]);
  const orderSummary = useMemo(
    () => buildOrderSummary(selectedMineral, quantityNum, unit),
    [selectedMineral, quantityNum, unit]
  );
  const aiEstimatedAmount = orderSummary?.total ?? "$0.00";

  const shippingAddressLine = useMemo(() => {
    const parts = [
      companyName || contactName,
      streetAddress,
      [city, stateRegion, postalCode].filter(Boolean).join(", "),
      country,
    ].filter(Boolean);
    return parts.join(", ");
  }, [companyName, contactName, streetAddress, city, stateRegion, postalCode, country]);

  const deliveryLocation: OrderDeliveryLocation | undefined = useMemo(() => {
    if (!streetAddress && !city && !country) return undefined;
    return {
      facilityName: companyName || contactName || "—",
      streetAddress: streetAddress || "—",
      city: city || "—",
      stateRegion: stateRegion || "—",
      postalCode: postalCode || "—",
      country: country || "—",
      contactPhone: contactPhone || undefined,
      email: contactEmail || undefined,
    };
  }, [
    companyName,
    contactName,
    streetAddress,
    city,
    stateRegion,
    postalCode,
    country,
    contactPhone,
    contactEmail,
  ]);

  const contactInfo: OrderContactInfo = useMemo(
    () => ({
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      companyName: companyName || undefined,
    }),
    [contactName, contactEmail, contactPhone, companyName]
  );

  const canGoToAddress = mineralId && quantityNum > 0;
  const canGoToReview =
    canGoToAddress &&
    streetAddress.trim() &&
    city.trim() &&
    country.trim() &&
    contactName.trim() &&
    contactEmail.trim() &&
    contactPhone.trim();

  // On success step: create order once
  useEffect(() => {
    if (step !== "success" || hasDispatchedOrder.current || !selectedMineral) return;
    hasDispatchedOrder.current = true;
    const orderId = generateOrderId();
    const now = format(new Date(), "MMM dd, yyyy");
    const nowShort = format(new Date(), "MMM dd, h:mm a");

    const order: Order = {
      id: orderId,
      type: "Buy",
      mineral: selectedMineral.name,
      description: selectedMineral.description ?? "",
      qty: quantityNum.toLocaleString("en-US"),
      unit,
      facility: {
        name: selectedMineral.name,
        address: [selectedMineral.region, selectedMineral.country].filter(Boolean).join(", "),
        country: selectedMineral.country,
        contact: contactPhone,
      },
      aiEstimatedAmount,
      currency: selectedMineral.currency ?? "USD",
      status: "Order Submitted",
      createdAt: now,
      userId: "MB-USR-4412-S",
      shippingAddress: shippingAddressLine,
      deliveryType: "Direct Delivery",
      deliveryLocation,
      estimatedDeliveryDate: format(new Date(Date.now() + 14 * 86400000), "MMM dd, yyyy"),
      paymentMethod: "Bank Transfer",
      sellerName: selectedMineral.name,
      mineralForm: selectedMineral.mineralTypes?.[0] ?? "—",
      escrowProtected: true,
      contactInfo,
      orderSummary: orderSummary ?? {
        subtotal: aiEstimatedAmount,
        subtotalLabel: selectedMineral.name,
        tax: "$0.00",
        shippingCost: "$0.00",
        platformFee: "$0.00",
        total: aiEstimatedAmount,
        currency: selectedMineral.currency ?? "USD",
      },
      flowSteps: [
        { label: "Order Submitted", active: true, completed: true },
        { label: "Awaiting Team Contact", active: false, completed: false },
        { label: "Price Confirmed", active: false, completed: false },
        { label: "Payment Initiated", active: false, completed: false },
        { label: "Order Completed", active: false, completed: false },
      ],
      testingReqs: [
        { label: "Assay / Quality Certificate", status: "Pending" },
        { label: "Commercial Invoice", status: "Pending" },
        { label: "Bill of Lading", status: "Pending" },
      ],
      commLog: [
        { event: "Order Submitted", admin: "System", date: nowShort },
        { event: "AI Estimation Generated", admin: "AI-Price-Engine", date: nowShort },
      ],
      sentToUser: [],
      buyerCountry: country,
      sellerCountry: selectedMineral.country,
      currentStep: 1,
    };

    dispatch({ type: "ADD_ORDER", payload: order });
    setPlacedOrderId(orderId);
    onOrderPlaced?.(orderId);
  }, [
    step,
    selectedMineral,
    quantityNum,
    unit,
    orderSummary,
    aiEstimatedAmount,
    shippingAddressLine,
    deliveryLocation,
    contactInfo,
    dispatch,
    onOrderPlaced,
  ]);

  const currentStepIndex = BUY_FLOW_STEPS.findIndex((s) => s.id === step);
  const stepList = BUY_FLOW_STEPS.map((s, i) => ({
    ...s,
    active: i === currentStepIndex,
    completed: i < currentStepIndex,
    clickable: i <= currentStepIndex && step !== "success",
  }));

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Buy mineral</h1>
          <p className="text-sm text-muted-foreground">
            Select mineral, enter address, review AI estimate, and place order.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {stepList.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (s.clickable && step !== "success") setStep(s.id as typeof step);
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                s.active
                  ? "bg-emerald-600 text-white"
                  : s.completed
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              } ${s.clickable ? "cursor-pointer hover:opacity-90" : "cursor-default"}`}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
            {i < stepList.length - 1 && (
              <div className="w-6 h-px bg-slate-200 dark:bg-slate-700" aria-hidden />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === "mineral" && (
        <Card>
          <CardHeader>
            <CardTitle>Select mineral</CardTitle>
            <CardDescription>Choose from the catalog and quantity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Mineral</Label>
              <Select value={mineralId} onValueChange={setMineralId}>
                <SelectTrigger><SelectValue placeholder="Select mineral" /></SelectTrigger>
                <SelectContent>
                  {minerals.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} · {m.basePrice?.toLocaleString("en-US")} {m.currency ?? "USD"}/{m.minAllocation ?? 1} {m.availableQuantity ? `(up to ${m.availableQuantity})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="grams">grams</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setStep("address")}
              disabled={!canGoToAddress}
            >
              Continue to address
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "address" && (
        <Card>
          <CardHeader>
            <CardTitle>Address & contact</CardTitle>
            <CardDescription>Shipping address and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Street address</Label>
              <Input
                placeholder="Street, number"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>State / Region</Label>
                <Input placeholder="State or region" value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Postal code</Label>
                <Input placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Country</Label>
                <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Contact name</Label>
              <Input placeholder="Full name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input placeholder="+1 234 567 8900" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Company (optional)</Label>
              <Input placeholder="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("mineral")}>
                Back
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setStep("review")}
                disabled={!canGoToReview}
              >
                Review order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && selectedMineral && (
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
            <CardDescription>Review details and AI estimated cost before placing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
              <p className="font-medium text-slate-900 dark:text-white">{selectedMineral.name}</p>
              <p className="text-sm text-muted-foreground">{selectedMineral.description}</p>
              <p className="text-sm">
                Quantity: <span className="font-medium">{quantityNum.toLocaleString("en-US")} {unit}</span>
              </p>
              <p className="text-sm">
                Ship to: <span className="font-medium">{shippingAddressLine || "—"}</span>
              </p>
              <p className="text-sm">
                Contact: <span className="font-medium">{contactName}, {contactEmail}, {contactPhone}</span>
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 space-y-2">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                AI estimated breakdown
              </p>
              {orderSummary && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{orderSummary.subtotal} {orderSummary.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transport</span>
                    <span className="font-medium">{orderSummary.shippingCost} {orderSummary.currency}</span>
                  </div>
                  {orderSummary.platformFee != null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fee{orderSummary.platformFeePercent != null ? ` (${orderSummary.platformFeePercent}%)` : ""}</span>
                      <span className="font-medium">{orderSummary.platformFee} {orderSummary.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-emerald-900 dark:text-emerald-100 pt-1 border-t border-emerald-200 dark:border-emerald-800">
                    <span>Total Due</span>
                    <span>{orderSummary.total} {orderSummary.currency}</span>
                  </div>
                </>
              )}
              {!orderSummary && <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{aiEstimatedAmount}</p>}
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                Same amounts will appear on your order in the dashboard after placement.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("address")}>
                Back
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setStep("success")}
              >
                Place order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "success" && (
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-6 w-6" />
              Order received
            </CardTitle>
            <CardDescription>
              Your buy order has been created and appears in Buyer management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {placedOrderId && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold text-slate-900 dark:text-white">{placedOrderId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Total Due: <span className="font-medium text-slate-900 dark:text-white">{aiEstimatedAmount}</span>
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              You can track this order from <strong>Buyer management</strong> → Users' buy list, or from Dashboard recent activity.
            </p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={onBack}>
              Back to dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
