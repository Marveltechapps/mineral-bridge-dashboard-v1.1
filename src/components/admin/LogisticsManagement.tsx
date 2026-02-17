import React, { useState, useMemo, useEffect } from "react";
import { 
  Truck, 
  Ship, 
  Plane, 
  MapPin, 
  Globe, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  Navigation, 
  History, 
  MoreVertical,
  Layers,
  Shield,
  Zap,
  Eye,
  Trash2,
  ExternalLink,
  Map as MapIcon,
  Phone,
  Mail,
  Box,
  CreditCard,
  Link2,
  Share2,
  Upload,
  FileCheck,
  User,
  ArrowLeft,
  X,
  FlaskConical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useAllOrders, useDashboardStore, getRegistryUserName, getLogisticsDetailsForOrder, getPartnerThirdPartyForOrder, getUserDetails, getKycVerificationResult } from "../../store/dashboardStore";
import type { LogisticsDetails } from "../../store/dashboardStore";
import { QRCodeSVG } from "qrcode.react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from "recharts";

const PERFORMANCE_HISTORY = [
  { month: "Aug", delivery: 92, capacity: 65, damage: 0.9 },
  { month: "Sep", delivery: 94, capacity: 68, damage: 0.7 },
  { month: "Oct", delivery: 91, capacity: 72, damage: 1.1 },
  { month: "Nov", delivery: 95, capacity: 75, damage: 0.8 },
  { month: "Dec", delivery: 96, capacity: 80, damage: 0.6 },
  { month: "Jan", delivery: 94, capacity: 78, damage: 0.8 },
];

const SHIPMENTS = [
  { 
    id: "LS-0789", 
    orderId: "O-2345", 
    route: "Mumbai → Dubai", 
    mineral: "Gold 100kg", 
    value: "$2.1M", 
    carrier: "DHL Global", 
    carrierAvatar: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 65, 
    eta: "Feb 2", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0790", 
    orderId: "O-2346", 
    route: "Lubumbashi → Antwerp", 
    mineral: "Cobalt 50t", 
    value: "$1.2M", 
    carrier: "Maersk Line", 
    carrierAvatar: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=100&h=100&fit=crop",
    status: "At Sea", 
    progress: 40, 
    eta: "Feb 15", 
    delayRisk: "Medium" 
  },
  { 
    id: "LS-0791", 
    orderId: "O-2347", 
    route: "Perth → Shenzhen", 
    mineral: "Iron Ore 500t", 
    value: "$450K", 
    carrier: "Local Trucking", 
    carrierAvatar: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=100&h=100&fit=crop",
    status: "Loading", 
    progress: 10, 
    eta: "Feb 5", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0792", 
    orderId: "O-2348", 
    route: "Santiago → London", 
    mineral: "Copper 20t", 
    value: "$180K", 
    carrier: "DHL Global", 
    carrierAvatar: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=100&h=100&fit=crop",
    status: "Delivered", 
    progress: 100, 
    eta: "Done", 
    delayRisk: "None" 
  },
  { 
    id: "LS-0793", 
    orderId: "O-2349", 
    route: "Mumbai → Zurich", 
    mineral: "Diamonds 1000ct", 
    value: "$5.4M", 
    carrier: "DHL Global", 
    carrierAvatar: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 85, 
    eta: "Feb 1", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0794", 
    orderId: "O-2350", 
    route: "Lagos → Rotterdam", 
    mineral: "Lithium 5t", 
    value: "$95K", 
    carrier: "Maersk Line", 
    carrierAvatar: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=100&h=100&fit=crop",
    status: "Delayed", 
    progress: 30, 
    eta: "Feb 20", 
    delayRisk: "High" 
  },
  { 
    id: "LS-0795", 
    orderId: "O-2351", 
    route: "Delhi → Mumbai", 
    mineral: "Silver 200kg", 
    value: "$150K", 
    carrier: "Local Trucking", 
    carrierAvatar: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 95, 
    eta: "Today", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0796", 
    orderId: "O-2352", 
    route: "Brisbane → Tokyo", 
    mineral: "Nickel 10t", 
    value: "$110K", 
    carrier: "Maersk Line", 
    carrierAvatar: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 50, 
    eta: "Feb 10", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0797", 
    orderId: "O-2353", 
    route: "Mumbai → Singapore", 
    mineral: "Gold 50kg", 
    value: "$1.1M", 
    carrier: "DHL Global", 
    carrierAvatar: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=100&h=100&fit=crop",
    status: "Customs Clear", 
    progress: 90, 
    eta: "Feb 2", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0798", 
    orderId: "O-2354", 
    route: "Lubumbashi → Durban", 
    mineral: "Cobalt 100t", 
    value: "$2.4M", 
    carrier: "Maersk Line", 
    carrierAvatar: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 25, 
    eta: "Feb 28", 
    delayRisk: "Medium" 
  },
  { 
    id: "LS-0799", 
    orderId: "O-2355", 
    route: "Santiago → New York", 
    mineral: "Copper 10t", 
    value: "$90K", 
    carrier: "DHL Global", 
    carrierAvatar: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=100&h=100&fit=crop",
    status: "In Transit", 
    progress: 70, 
    eta: "Feb 4", 
    delayRisk: "Low" 
  },
  { 
    id: "LS-0800", 
    orderId: "O-2356", 
    route: "Perth → Chennai", 
    mineral: "Iron Ore 1kt", 
    value: "$850K", 
    carrier: "Maersk Line", 
    carrierAvatar: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=100&h=100&fit=crop",
    status: "At Sea", 
    progress: 35, 
    eta: "Feb 22", 
    delayRisk: "Medium" 
  },
];

export interface LogisticsManagementProps {
  initialOrderId?: string;
  /** Open full order detail page (Buyer/Seller management). */
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
  /** Open Orders & Settlements (Transactions) page for this transaction. Pass transaction id. */
  onNavigateToTransaction?: (transactionId: string) => void;
  /** Open Orders & Settlements page (all transactions). */
  onNavigateToTransactionsPage?: () => void;
}

export function LogisticsManagement({ initialOrderId, onOpenOrderDetail, onNavigateToTransaction, onNavigateToTransactionsPage }: LogisticsManagementProps = {}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState("all");
  /** Selected order ID for logistics shipment detail view (same pattern as Testing & Certification 3rd party detail). */
  const [selectedLogisticsShipmentForDetail, setSelectedLogisticsShipmentForDetail] = useState<string | null>(null);
  /** Edit form for 3rd party logistics inside the shipment detail page (carrier, tracking, amount, QR). */
  const [detailLogisticsEditForm, setDetailLogisticsEditForm] = useState<Omit<LogisticsDetails, "orderId" | "updatedAt"> | null>(null);

  const { state, dispatch } = useDashboardStore();
  const allOrders = useAllOrders();
  const [thirdPartyTabOrderId, setThirdPartyTabOrderId] = useState<string>("");
  const [sendTxOrderId, setSendTxOrderId] = useState<string | null>(null);
  const [sendTxEmail, setSendTxEmail] = useState("");
  const [thirdPartyForm, setThirdPartyForm] = useState<Omit<LogisticsDetails, "orderId" | "updatedAt">>({
    carrierName: "",
    trackingNumber: "",
    trackingUrl: "",
    qrPayload: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    shippingAmount: "",
    shippingCurrency: "USD",
  });
  const [proofDocNames, setProofDocNames] = useState<string[]>([]);
  const [paymentLink, setPaymentLink] = useState("");
  const [logisticsLink, setLogisticsLink] = useState("");
  const proofFileInputRef = React.useRef<HTMLInputElement>(null);
  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const names = Array.from(files).map((f) => f.name);
      setProofDocNames((prev) => [...prev, ...names]);
      toast.success("Document uploaded for proof", { description: names.join(", ") });
    }
    e.target.value = "";
  };
  const handleSendPaymentLink = () => {
    const link = paymentLink.trim();
    if (!link) {
      toast.error("Enter a payment link", { description: "Paste the payment URL to send to the partner." });
      return;
    }
    toast.success("Payment link sent", { description: "Link sent to partner for payment." });
    setPaymentLink("");
  };
  const handleSendLogisticsLink = () => {
    const link = logisticsLink.trim();
    if (!link) {
      toast.error("Enter a logistics link", { description: "Paste the tracking or logistics URL to send to the partner." });
      return;
    }
    toast.success("Logistics link sent", { description: "Link sent to partner for shipment tracking." });
    setLogisticsLink("");
  };
  const shipmentsFromStore = useMemo(
    () =>
      allOrders.map((o) => ({
        id: o.id,
        orderId: o.id,
        route: o.facility?.address || [o.facility?.name, o.facility?.country].filter(Boolean).join(" → ") || "—",
        mineral: `${o.mineral} ${o.qty} ${o.unit}`,
        value: o.aiEstimatedAmount,
        carrier: "Platform",
        carrierAvatar: "",
        status: o.status,
        progress: o.status === "Completed" ? 100 : 40,
        eta: o.createdAt,
        delayRisk: "Low" as const,
      })),
    [allOrders]
  );
  const displayShipments = shipmentsFromStore.length ? shipmentsFromStore : SHIPMENTS;

  /** Shipment details table: rows from saved 3rd party details (database). */
  const shipmentDetailsFromDb = useMemo(() => {
    return Object.entries(state.logisticsDetails).map(([orderId, details]) => {
      const order = allOrders.find((o) => o.id === orderId);
      return {
        orderId,
        userName: order ? getRegistryUserName(state.registryUsers, order.userId) : "—",
        routeMaterial: order ? `${order.mineral} ${order.qty} ${order.unit}` : "—",
        carrier: details.carrierName || "—",
        status: order?.status ?? "—",
        risk: order ? "Low" as const : "—",
        updatedAt: details.updatedAt,
      };
    });
  }, [state.logisticsDetails, allOrders, state.registryUsers]);

  /** 3rd party overview stats for summary cards on Logistics 3rd Party Details tab (same as Testing & Certification). */
  const logisticsThirdPartyOverviewStats = useMemo(() => {
    const entries = shipmentDetailsFromDb;
    const inTransit = entries.filter((e) => e.status === "In transit").length;
    const delivered = entries.filter((e) => e.status === "Delivered" || e.status === "Completed").length;
    const testing = entries.filter((e) => e.status === "Sample received at lab").length;
    const pending = entries.filter((e) => {
      const s = e.status;
      return !s || s === "—" || s === "Pending" || (s !== "In transit" && s !== "Delivered" && s !== "Completed" && s !== "Sample received at lab");
    }).length;
    return {
      total: entries.length,
      inTransit,
      delivered,
      testing,
      pending,
    };
  }, [shipmentDetailsFromDb]);

  const handleTrackLive = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsTrackingModalOpen(true);
  };

  const handleSaveLogisticsDetails = () => {
    const orderId = thirdPartyTabOrderId || allOrders[0]?.id;
    if (!orderId) {
      toast.error("Select an Order / Shipment ID");
      return;
    }
    const payload: LogisticsDetails = {
      orderId,
      ...thirdPartyForm,
      qrPayload: thirdPartyForm.qrPayload || thirdPartyForm.trackingUrl || "",
      updatedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    dispatch({ type: "SET_LOGISTICS_DETAILS", payload });
    toast.success("3rd party details saved", { description: `Order ${orderId}. Link/QR will appear in customer app.` });
    setThirdPartyForm({ carrierName: "", trackingNumber: "", trackingUrl: "", qrPayload: "", contactPhone: "", contactEmail: "", notes: "", shippingAmount: "", shippingCurrency: "USD" });
    setThirdPartyTabOrderId("");
  };

  const transactionForOrder = sendTxOrderId ? state.transactions.find((t) => t.orderId === sendTxOrderId) : null;
  const orderForSendTx = sendTxOrderId ? allOrders.find((o) => o.id === sendTxOrderId) : null;

  const handleCopyTransactionDetails = () => {
    if (!transactionForOrder || !orderForSendTx) return;
    const userName = getRegistryUserName(state.registryUsers, orderForSendTx.userId);
    const lines = [
      `Transaction: ${transactionForOrder.id}`,
      `Order: ${transactionForOrder.orderId}`,
      `Counterparty: ${userName}`,
      `Type: ${transactionForOrder.orderType}`,
      `Mineral: ${transactionForOrder.mineral}`,
      `Amount: ${transactionForOrder.finalAmount} ${transactionForOrder.currency}`,
      `Fee: ${transactionForOrder.serviceFee ?? "—"}`,
      `Net: ${transactionForOrder.netAmount ?? "—"}`,
      `Method: ${transactionForOrder.method}`,
      `Status: ${transactionForOrder.status}`,
      `Date: ${transactionForOrder.date} ${transactionForOrder.time}`,
      transactionForOrder.settlementNote ? `Note: ${transactionForOrder.settlementNote}` : "",
    ].filter(Boolean);
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => toast.success("Transaction details copied to clipboard"));
  };

  const handleSendTransactionByEmail = () => {
    const email = sendTxEmail.trim();
    if (!transactionForOrder) return;
    if (email) {
      toast.success("Transaction details sent", { description: `Sent to ${email} for ${transactionForOrder.id}` });
    } else {
      toast.success("Transaction details ready to send", { description: `Order ${sendTxOrderId} — add email and use your mail client or integration.` });
    }
    setSendTxOrderId(null);
    setSendTxEmail("");
  };

  const loadExistingForOrder = (orderId: string) => {
    const existing = getLogisticsDetailsForOrder(state, orderId);
    if (existing) {
      setThirdPartyForm({
        carrierName: existing.carrierName,
        trackingNumber: existing.trackingNumber,
        trackingUrl: existing.trackingUrl,
        qrPayload: existing.qrPayload,
        contactPhone: existing.contactPhone,
        contactEmail: existing.contactEmail,
        notes: existing.notes,
        shippingAmount: existing.shippingAmount ?? "",
        shippingCurrency: existing.shippingCurrency ?? "USD",
      });
    }
    setThirdPartyTabOrderId(orderId);
  };

  useEffect(() => {
    if (!initialOrderId) return;
    loadExistingForOrder(initialOrderId);
    setActiveTab("third-party");
  }, [initialOrderId]);

  /** Sync edit form when opening/closing a shipment detail. */
  useEffect(() => {
    if (selectedLogisticsShipmentForDetail) {
      const d = state.logisticsDetails[selectedLogisticsShipmentForDetail];
      setDetailLogisticsEditForm(d ? {
        carrierName: d.carrierName,
        trackingNumber: d.trackingNumber,
        trackingUrl: d.trackingUrl,
        qrPayload: d.qrPayload,
        contactPhone: d.contactPhone,
        contactEmail: d.contactEmail,
        notes: d.notes,
        shippingAmount: d.shippingAmount ?? "",
        shippingCurrency: d.shippingCurrency ?? "USD",
      } : {
        carrierName: "",
        trackingNumber: "",
        trackingUrl: "",
        qrPayload: "",
        contactPhone: "",
        contactEmail: "",
        notes: "",
        shippingAmount: "",
        shippingCurrency: "USD",
      });
    } else {
      setDetailLogisticsEditForm(null);
    }
  }, [selectedLogisticsShipmentForDetail, state.logisticsDetails]);

  const orderForLink = initialOrderId ? allOrders.find((o) => o.id === initialOrderId) : null;

  return (
    <div className="p-6 space-y-6">
      {!selectedLogisticsShipmentForDetail && (
      <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Logistics Partners - Active Shipments</h1>
          <p className="text-muted-foreground">Manage carriers, shipments, and logistics performance.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {orderForLink && onOpenOrderDetail && (
            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200" onClick={() => onOpenOrderDetail(orderForLink.id, orderForLink.type === "Buy" ? "buy" : "sell")}>
              Open order detail
            </Button>
          )}
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[120px] h-9 text-xs">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="eu">EU</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Tracking
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            Assign Carrier
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Overview</TabsTrigger>
          <TabsTrigger value="active-shipments" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">Active Shipments <Badge variant="secondary" className="h-5 px-1.5">{displayShipments.length}</Badge></TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Performance</TabsTrigger>
          <TabsTrigger value="financials" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Financials</TabsTrigger>
          <TabsTrigger value="coverage" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Coverage</TabsTrigger>
          <TabsTrigger value="third-party" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">3rd Party Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Partner Profiles (Left) */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Rated Partners</h3>
                
                {[
                  { name: "DHL Global", icon: Plane, coverage: "Asia / EU", capacity: "500mt/mo", sla: "96%", color: "emerald", img: "https://images.unsplash.com/photo-1590483734724-383b853b237d?w=200&h=150&fit=crop" },
                  { name: "Maersk Line", icon: Ship, coverage: "Africa Specialist", capacity: "1.2k mt/mo", sla: "92%", color: "blue", img: "https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=200&h=150&fit=crop" },
                  { name: "Local Trucking", icon: Truck, coverage: "India Domestic", capacity: "300mt/mo", sla: "85%", color: "amber", img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=150&fit=crop" }
                ].map((partner, i) => (
                  <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white dark:bg-slate-900 group">
                    <CardContent className="p-0 flex">
                      <div className="w-32 h-32 relative hidden sm:block">
                        <ImageWithFallback src={partner.img} alt={partner.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="flex-1 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                              <partner.icon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none">{partner.name}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{partner.coverage}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px]">Tier 1</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Capacity</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{partner.capacity}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">SLA Score</p>
                            <p className="text-xs font-bold text-emerald-600">{partner.sla}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 border-dashed p-6 rounded-3xl flex items-center justify-center group cursor-pointer">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">Onboard New Logistics Partner</p>
                  </div>
                </Card>
              </div>

              {/* Coverage Map + Capacity (Right) */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Global Coverage & Capacity</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">Real-time utilization across active trade corridors.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Asia</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Africa</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase text-slate-500">EU</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[400px] relative bg-slate-50 dark:bg-slate-800/50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800 group">
                    <MapIcon className="w-32 h-32 text-slate-200 dark:text-slate-700 opacity-50 group-hover:scale-110 transition-transform duration-[3s]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       {/* Animated Pings */}
                       <div className="absolute top-1/3 left-1/4">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                        </span>
                       </div>
                       <div className="absolute top-1/2 left-2/3">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                       </div>
                       <div className="absolute top-1/4 left-1/2">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                        </span>
                       </div>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-black uppercase text-slate-400">Fleet Utilization Index</p>
                            <span className="text-lg font-black text-emerald-600">78%</span>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-500">Total Capacity Used (2,500mt goal)</span>
                                <span className="text-slate-900 dark:text-white">1,950 MT</span>
                              </div>
                              <Progress value={78} className="h-2 bg-emerald-500" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </Card>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="active-shipments" className="mt-4">
          <div className="space-y-6">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Active Mineral Shipments</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">Live tracking of high-value mineral transit globally.</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Search Shipment, Order, Carrier..." 
                        className="pl-10 h-10 w-[300px] bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
                      <Filter className="w-4 h-4 text-slate-500" />
                    </Button>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="w-12 px-8">
                          <Checkbox id="all-shipments" />
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Details</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User (Registry)</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route & Mineral</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carrier</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status & ETA</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayShipments.map((shipment) => (
                        <TableRow 
                          key={shipment.id} 
                          className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800"
                        >
                          <TableCell className="px-8">
                            <Checkbox id={shipment.id} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-slate-900 dark:text-white">{shipment.id}</span>
                              <span className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer flex items-center gap-1">
                                {shipment.orderId}
                                <ArrowUpRight className="w-2 h-2" />
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {getRegistryUserName(state.registryUsers, allOrders.find((o) => o.id === shipment.id)?.userId)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Navigation className="w-3 h-3 text-emerald-500" />
                                {shipment.route}
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-emerald-100 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-black uppercase tracking-tighter">
                                  {shipment.mineral}
                                </Badge>
                                <span className="text-[10px] font-black text-slate-400">{shipment.value}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8 rounded-lg border border-slate-100 dark:border-slate-800">
                                <AvatarImage src={shipment.carrierAvatar} />
                                <AvatarFallback className="text-[10px] font-black bg-emerald-50 text-emerald-600">
                                  {shipment.carrier[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{shipment.carrier}</span>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[200px]">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-black">
                                <span className={shipment.status === 'Delayed' ? 'text-red-500' : 'text-slate-600'}>{shipment.status}</span>
                                <span className="text-slate-400">ETA: {shipment.eta}</span>
                              </div>
                              <div className="relative h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`absolute left-0 top-0 h-full rounded-full ${shipment.status === 'Delayed' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${shipment.progress}%` }}
                                />
                                {shipment.status !== 'Delivered' && (
                                  <motion.div 
                                    className="absolute h-full w-4 bg-white/30 blur-sm"
                                    animate={{ left: ["-20%", "120%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    style={{ left: "-20%" }}
                                  />
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                             <Badge 
                                className={`border-none font-black text-[9px] uppercase tracking-tighter ${
                                  shipment.delayRisk === 'High' ? 'bg-red-100 text-red-700' : 
                                  shipment.delayRisk === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                                  shipment.delayRisk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 
                                  'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {shipment.delayRisk} Risk
                              </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleTrackLive(shipment)}
                              >
                                Track Live
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                                  <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Logistics Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg" onClick={() => setSendTxOrderId(shipment.orderId)}>
                                    <Mail className="w-4 h-4 text-[#A855F7]" />
                                    <span className="font-bold text-sm">Send transaction details</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg">
                                    <History className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-sm">Reroute Shipment</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                    <span className="font-bold text-sm">Hold Shipment</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg text-red-600 focus:bg-red-50">
                                    <Shield className="w-4 h-4" />
                                    <span className="font-bold text-sm">File Claim</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Showing 12 of 245 active shipments</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 border-slate-200 text-xs font-bold px-3">Prev</Button>
                    <div className="flex gap-1">
                      <Button size="sm" className="h-8 w-8 bg-emerald-600 text-white font-bold p-0">1</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 font-bold p-0">2</Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 font-bold p-0">3</Button>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 border-slate-200 text-xs font-bold px-3">Next</Button>
                  </div>
                </CardFooter>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "On-Time Delivery", value: "94%", trend: "+2%", color: "text-emerald-500", icon: Clock },
                  { label: "Avg Transit Time", value: "4.2d", trend: "-0.5d", color: "text-emerald-600", icon: Navigation },
                  { label: "Damage Rate", value: "0.8%", trend: "-0.2%", color: "text-emerald-500", icon: Package },
                  { label: "SLA Breaches", value: "3", trend: "+1", color: "text-red-500", icon: AlertCircle },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl overflow-hidden group">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend.startsWith('+') && stat.label === 'SLA Breaches' ? 'text-red-500' : stat.trend.startsWith('-') && stat.label === 'Damage Rate' ? 'text-emerald-500' : stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {stat.trend} <span className="text-slate-400 font-bold uppercase ml-1">vs target</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Capacity Utilization Trend</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">Monthly tonnage usage across all logistics partners.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">OPTIMIZED</Badge>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PERFORMANCE_HISTORY}>
                        <defs>
                          <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="capacity" 
                          stroke="#10B981" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorCap)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Damage Rate Frequency</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">Incidents reported per 100 shipments.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <span className="text-[10px] font-black text-slate-400">ALERT THRESHOLD: 1%</span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PERFORMANCE_HISTORY}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: '#F1F5F9' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }}
                        />
                        <Bar dataKey="damage" radius={[10, 10, 0, 0]}>
                          {PERFORMANCE_HISTORY.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.damage > 1.0 ? '#F43F5E' : '#10B981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase">System Insights</span>
                      </div>
                      <h3 className="text-2xl font-black">Regional Performance Alert</h3>
                      <p className="text-slate-400 text-sm font-medium max-w-md">
                        On-time delivery in the Africa corridor has dropped by 12% due to port congestion. Suggest rerouting high-priority Gold shipments via Air Freight (DHL).
                      </p>
                      <div className="flex gap-3 pt-2">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-8">Auto-Reroute Rules</Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 font-bold h-11 px-8 border border-white/20">Review Regional SLA</Button>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase">Africa OTD</p>
                        <p className="text-xl font-black text-red-500 mt-1">82%</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase">System Target</p>
                        <p className="text-xl font-black text-emerald-500 mt-1">94%</p>
                      </div>
                   </div>
                </div>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-4">
          <div className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Freight Costs (MTD)</p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white">$145k</h3>
                      <p className="text-sm font-bold text-emerald-500">+8% vs last mo.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Projected Spend</span>
                        <span className="text-slate-900 dark:text-white">$185k</span>
                      </div>
                      <Progress value={78} className="h-1.5 bg-emerald-500" />
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl relative overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pending Invoices</p>
                    <div className="flex items-baseline gap-2 mb-6">
                      <h3 className="text-4xl font-black text-slate-900 dark:text-white">$28k</h3>
                      <p className="text-sm font-bold text-orange-500">4 Overdue</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl h-11">Review All</Button>
                      <Button size="icon" variant="outline" className="h-11 w-11 rounded-xl border-slate-200">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-3xl border border-dashed border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-6 text-center">Average Cost per KG</h4>
                    <div className="space-y-4">
                      {[
                        { mineral: "Gold", cost: "$45.00", carrier: "Air / DHL" },
                        { mineral: "Iron Ore", cost: "$12.00", carrier: "Sea / Maersk" },
                        { mineral: "Cobalt", cost: "$22.00", carrier: "Sea / Maersk" },
                        { mineral: "Diamonds", cost: "$120.00", carrier: "Air / Secure" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm font-bold">
                          <div className="flex flex-col">
                            <span className="text-slate-700 dark:text-slate-300">{item.mineral}</span>
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest">{item.carrier}</span>
                          </div>
                          <span className="text-emerald-600">{item.cost}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
               </div>

               <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <CardHeader className="px-8 py-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Recent Logistics Invoices</CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-500 mt-1">Direct integration with Partner ERP for automated reconciliation.</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-emerald-600 font-black text-xs gap-2">
                      Financial Hub
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </CardHeader>
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice ID</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "INV-9921", partner: "DHL Global", shipment: "LS-0789", amount: "$12,450.00", due: "Feb 10", status: "Paid" },
                        { id: "INV-9922", partner: "Maersk Line", shipment: "LS-0790", amount: "$45,200.00", due: "Jan 25", status: "Overdue" },
                        { id: "INV-9923", partner: "Local Trucking", shipment: "LS-0791", amount: "$1,850.00", due: "Feb 15", status: "Pending" },
                        { id: "INV-9924", partner: "DHL Global", shipment: "LS-0793", amount: "$8,900.00", due: "Feb 12", status: "Pending" },
                      ].map((inv) => (
                        <TableRow key={inv.id} className="border-slate-100 dark:border-slate-800">
                          <TableCell className="px-8 font-black text-slate-900 dark:text-white text-sm">{inv.id}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">{inv.partner}</TableCell>
                          <TableCell className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">{inv.shipment}</TableCell>
                          <TableCell className="text-sm font-black text-slate-900 dark:text-white">{inv.amount}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-500">{inv.due}</TableCell>
                          <TableCell className="text-right px-8">
                            <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                              inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {inv.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </Card>
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
          <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                      <Plane className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">Air Freight Hubs</h4>
                    <p className="text-xs font-medium text-slate-500 mt-2 max-w-[200px]">Active in 12 global airports including Mumbai, Dubai, and Zurich.</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                       {["BOM", "DXB", "ZRH", "LHR", "JFK"].map(hub => (
                         <Badge key={hub} variant="outline" className="rounded-full text-[10px] font-black border-slate-100">{hub}</Badge>
                       ))}
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                      <Ship className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">Sea Corridors</h4>
                    <p className="text-xs font-medium text-slate-500 mt-2 max-w-[200px]">Strategic deep-water access for bulk minerals via 8 global ports.</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                       {["Antwerp", "Rotterdam", "Durban", "Perth", "Santos"].map(port => (
                         <Badge key={port} variant="outline" className="rounded-full text-[10px] font-black border-slate-100">{port}</Badge>
                       ))}
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                      <Truck className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">Ground Networks</h4>
                    <p className="text-xs font-medium text-slate-500 mt-2 max-w-[200px]">Domestic "Last-Mile" trucking available in 5 major mining clusters.</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                       {["India", "DRC", "Australia", "Chile", "Brazil"].map(net => (
                         <Badge key={net} variant="outline" className="rounded-full text-[10px] font-black border-slate-100">{net}</Badge>
                       ))}
                    </div>
                  </Card>
               </div>

               <Card className="border-none shadow-sm bg-slate-900 text-white rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-20">
                     <ImageWithFallback 
                        src="https://images.unsplash.com/photo-1579546671235-a6754664f64d?w=1600&h=800&fit=crop" 
                        alt="Global Network"
                        className="w-full h-full object-cover"
                     />
                  </div>
                  <div className="relative z-10 text-center space-y-6 max-w-2xl px-8">
                     <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <Globe className="w-10 h-10 text-emerald-400" />
                     </div>
                     <h3 className="text-4xl font-black">Interactive Coverage Explorer</h3>
                     <p className="text-slate-300 text-lg">
                        Select a region or trade corridor to view real-time carrier availability, estimated transit times, and historical cost data.
                     </p>
                     <div className="flex flex-wrap gap-4 justify-center pt-4">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 h-12 rounded-xl text-lg">Launch Map View</Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 font-black px-8 h-12 rounded-xl text-lg border border-white/20">Download Catalog</Button>
                     </div>
                  </div>
               </Card>
          </div>
        </TabsContent>

        <TabsContent value="third-party" className="mt-4">
          {/* 3rd Party Details overview cards — same as Testing & Certification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3rd party entries</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{logisticsThirdPartyOverviewStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In transit</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{logisticsThirdPartyOverviewStats.inTransit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testing</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{logisticsThirdPartyOverviewStats.testing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivered</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{logisticsThirdPartyOverviewStats.delivered}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{logisticsThirdPartyOverviewStats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents, payments & logistics — connected to verification details */}
          <div className="w-full min-w-full overflow-visible mb-6">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden w-full" style={{ width: "100%" }}>
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-words">Documents, payments & logistics</CardTitle>
                    <CardDescription className="text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-relaxed break-words">
                      Upload proof documents and send payment or logistics links. Tied to 3rd party verification details (documents uploaded, verified).
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8">
                {(state.partnerThirdPartyDetails ?? []).length > 0 && (
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                    <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Verification details (documents uploaded & verified)
                    </h4>
                    <ul className="space-y-2 max-h-32 overflow-y-auto">
                      {(state.partnerThirdPartyDetails ?? []).slice(0, 10).map((entry: { id: string; orderId: string; uploadedDocuments?: string[]; status?: string }) => {
                        const docs = entry.uploadedDocuments ?? [];
                        const verified = entry.status === "Sample received at lab" || entry.status === "Delivered";
                        return (
                          <li key={entry.id} className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <span className="font-black text-slate-900 dark:text-white">{entry.orderId}</span>
                            {docs.length > 0 ? <span className="text-slate-600 dark:text-slate-400">— {docs.join(", ")}</span> : null}
                            <Badge className={`border-none font-black text-[9px] uppercase ${verified ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                              {verified ? "Verified" : entry.status || "Pending"}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:flex-wrap md:gap-6">
                  <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      </div>
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider break-words">Upload document for proof</h4>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed break-words">Certificates, invoices, or compliance proof. PDF, DOC, images.</p>
                    <input ref={proofFileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple className="hidden" onChange={handleProofUpload} />
                    <Button variant="outline" className="w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-20 sm:h-24 flex flex-col gap-2 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 bg-white dark:bg-slate-800/50" onClick={() => proofFileInputRef.current?.click()}>
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">Choose file(s)</span>
                    </Button>
                    {proofDocNames.length > 0 && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 sm:p-4 space-y-2 min-w-0">
                        <p className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Uploaded ({proofDocNames.length})</p>
                        <ul className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 space-y-1.5 max-h-20 overflow-y-auto">
                          {proofDocNames.slice(-5).map((name, i) => (
                            <li key={i} className="flex items-center gap-2 break-all" title={name}>
                              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-slate-400" />
                              {name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      </div>
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider break-words">Send payment link</h4>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed break-words">Share payment or invoice URL with the partner.</p>
                    <Input placeholder="https://..." value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium h-10 sm:h-11 w-full min-w-0" />
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-10 sm:h-11 font-semibold text-xs sm:text-sm" onClick={handleSendPaymentLink}>
                      <Link2 className="w-4 h-4 shrink-0" />
                      Send link to partner
                    </Button>
                  </div>
                  <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                      </div>
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider break-words">Send logistics link</h4>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed break-words">Share tracking or shipment URL with the partner.</p>
                    <Input placeholder="https://..." value={logisticsLink} onChange={(e) => setLogisticsLink(e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-medium h-10 sm:h-11 w-full min-w-0" />
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-10 sm:h-11 font-semibold text-xs sm:text-sm" onClick={handleSendLogisticsLink}>
                      <Link2 className="w-4 h-4 shrink-0" />
                      Send link to partner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipment details table — click row or View Details to open detail page */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Shipment details</h4>
              {onNavigateToTransactionsPage && (
                <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 gap-1" onClick={onNavigateToTransactionsPage}>
                  <Link2 className="h-4 w-4" />
                  All transactions
                </Button>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">Shipment details</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">User</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">Route material</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">Carrier</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400">Risk</TableHead>
                    <TableHead className="text-xs font-medium text-slate-600 dark:text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentDetailsFromDb.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-sm text-muted-foreground text-center py-8">
                        No shipment details saved yet. Open a shipment from the Logistics tab or add 3rd party details in a shipment detail page. Saved records will appear here.
                      </TableCell>
                    </TableRow>
                  ) : (
                    shipmentDetailsFromDb.map((row) => {
                      const riskColor = row.risk === "Medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
                      return (
                        <TableRow
                          key={row.orderId}
                          className="border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          onClick={() => setSelectedLogisticsShipmentForDetail(row.orderId)}
                        >
                          <TableCell className="text-sm font-medium text-slate-900 dark:text-white">
                            <span className="font-mono">{row.orderId}</span>
                            {row.updatedAt && (
                              <span className="block text-xs font-normal text-muted-foreground mt-0.5">Saved {row.updatedAt}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-slate-700 dark:text-slate-300">{row.userName}</TableCell>
                          <TableCell className="text-sm text-slate-700 dark:text-slate-300">{row.routeMaterial}</TableCell>
                          <TableCell className="text-sm text-slate-700 dark:text-slate-300">{row.carrier}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs font-medium">{row.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {row.risk !== "—" ? (
                              <Badge variant="secondary" className={`text-xs font-medium ${riskColor}`}>{row.risk}</Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                                onClick={() => setSelectedLogisticsShipmentForDetail(row.orderId)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-emerald-600 hover:text-emerald-700 font-medium h-auto p-0"
                                onClick={() => {
                                  loadExistingForOrder(row.orderId);
                                  toast.success("Send Tracking URL", { description: `Order ${row.orderId} — tracking form ready.` });
                                }}
                              >
                                Send Tracking URL
                              </Button>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-[#A855F7] hover:text-purple-600 font-medium h-auto p-0 gap-1"
                                onClick={() => setSendTxOrderId(row.orderId)}
                              >
                                <Mail className="h-3.5 w-3.5" />
                                Send transaction details
                              </Button>
                              {onNavigateToTransaction && (() => {
                                const tx = state.transactions.find((t) => t.orderId === row.orderId);
                                if (!tx) return null;
                                return (
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium h-auto p-0"
                                    onClick={() => onNavigateToTransaction(tx.id)}
                                  >
                                    View transaction
                                  </Button>
                                );
                              })()}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 3rd Party Logistics Details form removed — use shipment detail page to edit per order. */}
        </TabsContent>
      </Tabs>
      </>
      )}

      {/* Logistics shipment detail — inline (side nav visible), same pattern as Testing & Certification 3rd party detail */}
      {selectedLogisticsShipmentForDetail && (() => {
        const orderId = selectedLogisticsShipmentForDetail;
        const details = state.logisticsDetails[orderId];
        const order = allOrders.find((o) => o.id === orderId);
        const linkedUser = order?.userId ? state.registryUsers.find((u) => u.id === order.userId) : null;
        const activeTesting = (state.activeTestingOrders ?? []).find((a) => a.orderId === orderId);
        const partnerThirdParty = getPartnerThirdPartyForOrder(state, orderId);
        const transaction = state.transactions.find((t) => t.orderId === orderId);
        const userDetailsSet = getUserDetails(state, linkedUser?.id);
        const kycResult = linkedUser ? getKycVerificationResult(state, linkedUser.id) : undefined;
        const entry = details ?? { orderId, carrierName: "", trackingNumber: "", trackingUrl: "", qrPayload: "", contactPhone: "", contactEmail: "", notes: "", updatedAt: "" };
        const statusFromOrder = order?.status ?? partnerThirdParty?.status ?? "Active";
        const shipmentStatusLabel = statusFromOrder === "Delivered" || statusFromOrder === "Completed" ? "DELIVERED" : statusFromOrder === "In transit" ? "IN TRANSIT" : statusFromOrder === "Sample received at lab" ? "TESTING" : (statusFromOrder ?? "ACTIVE").toUpperCase().replace(/ /g, "_");
        return (
          <div className="flex flex-col w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0 bg-white dark:bg-slate-900 flex flex-col gap-2 relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full h-9 w-9 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setSelectedLogisticsShipmentForDetail(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="absolute top-4 left-6 rounded-xl gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold" onClick={() => setSelectedLogisticsShipmentForDetail(null)} aria-label="Back to list">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Back
              </Button>
              <div className="flex flex-col gap-2 pr-12 pt-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
                  <span>{orderId}</span>
                  <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${shipmentStatusLabel === "DELIVERED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : shipmentStatusLabel === "IN TRANSIT" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                    {shipmentStatusLabel}
                  </Badge>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">{entry.carrierName || partnerThirdParty?.companyName || "—"}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tracking: {entry.trackingNumber || partnerThirdParty?.trackingNumber || "—"}</span>
                </h2>
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedLogisticsShipmentForDetail(null)}>Close</Button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50 dark:bg-slate-950">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Card: User details */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">User details</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Buyer/seller linked to this shipment.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order ID</span>{orderId}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Mineral type</span>{order?.mineral ?? activeTesting?.mineralType ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Carrier / Partner</span>{entry.carrierName ?? partnerThirdParty?.companyName ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order creation date</span>{order?.createdAt ?? partnerThirdParty?.submittedAt ?? "—"}</div>
                    </div>
                    {linkedUser ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">User name</span>{linkedUser.name}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Company name</span>{order?.contactInfo?.companyName ?? linkedUser.preHomepageDetails?.company ?? "—"}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Email</span>{linkedUser.email}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Phone</span>{linkedUser.phone}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">KYC status</span>{kycResult ? (kycResult.score ? `Verified (${kycResult.score}%)` : "Verified") : linkedUser.status}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Role (Buyer / Seller)</span>{order?.type ?? linkedUser.role}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Account status</span>{linkedUser.status}</div>
                        <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Registration date</span>{linkedUser.preHomepageDetails?.submittedAt ?? linkedUser.detailsVerifiedAt ?? "—"}</div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">No registry user linked to order {orderId}.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Card: Transaction details */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Transaction details</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Payment related to this shipment.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Invoice number</span>{activeTesting?.invoice ?? transaction?.id ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Testing / shipping fee</span>{activeTesting?.testingFee ? `${activeTesting.testingFee} ${activeTesting.currency ?? ""}`.trim() : entry.shippingAmount ? `${entry.shippingAmount} ${entry.shippingCurrency ?? "USD"}`.trim() : "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Paid amount</span>{entry.shippingAmount ? `${entry.shippingAmount} ${entry.shippingCurrency ?? "USD"}`.trim() : transaction?.finalAmount ? `${transaction.finalAmount} ${transaction.currency}` : "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Balance amount</span>{activeTesting?.paymentStatus === "Partial" ? "Partial balance" : activeTesting?.paymentStatus === "Unpaid" ? (activeTesting?.testingFee ?? "—") : "0"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Currency</span>{activeTesting?.currency ?? entry.shippingCurrency ?? transaction?.currency ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Payment status</span>{activeTesting?.paymentStatus ?? (entry.shippingAmount ? "Paid" : transaction?.status ?? "—")}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Payment method</span>{transaction?.method ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Transaction ID</span>{transaction?.id ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Payment date</span>{transaction?.date ? `${transaction.date} ${transaction.time ?? ""}`.trim() : "—"}</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-4">
                      <Download className="w-3.5 h-3.5" /> Receipt download
                    </Button>
                    {onNavigateToTransaction && transaction && (
                      <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 mt-2 ml-2" onClick={() => { onNavigateToTransaction(transaction.id); setSelectedLogisticsShipmentForDetail(null); }}>
                        Open in Transactions
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Card: Documents, payments & logistics (subsection) */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Documents, payments & logistics</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Upload proof documents and send payment or logistics links for this shipment. Tied to verification details.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5 space-y-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Verification (this order)
                      </h4>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {orderId} — {((partnerThirdParty?.uploadedDocuments ?? []).length > 0 ? (partnerThirdParty?.uploadedDocuments ?? []).join(", ") : "No documents yet")} · <Badge className={`border-none font-black text-[9px] uppercase ml-1 ${(partnerThirdParty?.status === "Sample received at lab" || partnerThirdParty?.status === "Delivered") ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{partnerThirdParty?.status ?? "Pending"}</Badge>
                      </p>
                    </div>
                    <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:flex-wrap md:gap-6">
                      <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <Upload className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload document for proof</h4>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Certificates, invoices, or compliance proof. PDF, DOC, images.</p>
                        <input ref={proofFileInputRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" multiple className="hidden" onChange={handleProofUpload} />
                        <Button variant="outline" className="w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 h-20 flex flex-col gap-2 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 bg-white dark:bg-slate-800/50" onClick={() => proofFileInputRef.current?.click()}>
                          <Upload className="w-5 h-5 text-slate-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose file(s)</span>
                        </Button>
                        {proofDocNames.length > 0 && (
                          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-3 space-y-2 min-w-0">
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Uploaded ({proofDocNames.length})</p>
                            <ul className="text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1.5 max-h-20 overflow-y-auto">
                              {proofDocNames.slice(-5).map((name, i) => (
                                <li key={i} className="flex items-center gap-2 break-all" title={name}>
                                  <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                                  {name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Send payment link</h4>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Share payment or invoice URL with the partner.</p>
                        <Input placeholder="https://..." value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium h-10 w-full min-w-0" />
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-10 font-semibold text-xs" onClick={handleSendPaymentLink}>
                          <Link2 className="w-4 h-4 shrink-0" />
                          Send link to partner
                        </Button>
                      </div>
                      <div className="flex-1 w-full min-w-[260px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <Truck className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Send logistics link</h4>
                        </div>
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Share tracking or shipment URL with the partner.</p>
                        <Input placeholder="https://..." value={logisticsLink} onChange={(e) => setLogisticsLink(e.target.value)} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium h-10 w-full min-w-0" />
                        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-10 font-semibold text-xs" onClick={handleSendLogisticsLink}>
                          <Link2 className="w-4 h-4 shrink-0" />
                          Send link to partner
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Card: Documents uploaded */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Documents uploaded</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Documents submitted for this shipment. View, Download, Delete (Admin only), Upload new version.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    {(() => {
                      const docList = partnerThirdParty?.uploadedDocuments ?? [];
                      const docRows = [
                        { label: "Assay Request PDF", value: activeTesting?.assayRequest ?? docList.find((d) => /assay|request/i.test(d)) },
                        { label: "Sample Specification", value: docList.find((d) => /sample|spec/i.test(d)) },
                        { label: "Commercial Invoice", value: activeTesting?.invoice ?? docList.find((d) => /invoice/i.test(d)) },
                        { label: "Shipping Documents", value: docList.find((d) => /shipping|bill|lad/i.test(d)) },
                        { label: "Lab Report", value: activeTesting?.labReportPdf ?? docList.find((d) => /lab|report/i.test(d)) },
                        { label: "Final Certificate", value: activeTesting?.certificatePdf ?? docList.find((d) => /certificate|cert/i.test(d)) },
                      ];
                      const allRows = docRows.some((r) => r.value) ? docRows.filter((r) => r.value) : docRows.map((r) => ({ label: r.label }));
                      return (
                        <ul className="space-y-3">
                          {allRows.map((row, i) => (
                            <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                                {"value" in row && row.value && <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{row.value}</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={() => toast.info("View", { description: (row as { value?: string }).value ?? row.label })}>View</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={() => toast.info("Download", { description: (row as { value?: string }).value ?? row.label })}>Download</Button>
                                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => toast.info("Delete (Admin only)", { description: row.label })}>Delete</Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg">Upload new version</Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Card: Logistics */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Logistics</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Courier, tracking and shipment timeline.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order ID</span>{orderId}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Mineral type</span>{order?.mineral ?? activeTesting?.mineralType ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Carrier / Partner</span>{entry.carrierName ?? partnerThirdParty?.companyName ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order creation date</span>{order?.createdAt ?? partnerThirdParty?.submittedAt ?? "—"}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Courier name</span>{entry.carrierName ?? activeTesting?.courierCompany ?? partnerThirdParty?.companyName ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Tracking number</span>{entry.trackingNumber || (partnerThirdParty?.trackingNumber ?? "—")}</div>
                      <div className="sm:col-span-2"><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Tracking URL</span>{entry.trackingUrl ? <a href={entry.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline truncate block max-w-full">{entry.trackingUrl}</a> : partnerThirdParty?.trackingUrl ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Dispatch date</span>{partnerThirdParty?.submittedAt ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Expected delivery date</span>{partnerThirdParty?.expectedDeliveryDate ?? activeTesting?.expectedDeliveryDate ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Delivered date</span>{partnerThirdParty?.deliveredAt ?? activeTesting?.deliveredDate ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Current location</span>{partnerThirdParty?.status === "Sample received at lab" ? "Lab" : partnerThirdParty?.status === "Delivered" ? "Delivered" : partnerThirdParty?.status === "In transit" ? "In transit" : "—"}</div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Shipment status timeline</p>
                      <ul className="space-y-2 text-xs">
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Saved — {entry.updatedAt ?? "—"}</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Submitted — {partnerThirdParty?.submittedAt ?? "—"}</li>
                        <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">{statusFromOrder === "Delivered" || statusFromOrder === "Completed" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />} Delivered — {partnerThirdParty?.deliveredAt ?? activeTesting?.deliveredDate ?? "—"}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Card: Edit 3rd Party Logistics Details (form + QR) */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">3rd Party Logistics Details by Order / Shipment ID</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Enter carrier and tracking details for this order. The tracking link and QR will appear in the end customer app.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5 space-y-6">
                    {(() => {
                      const initialForm = {
                        carrierName: entry.carrierName ?? "",
                        trackingNumber: entry.trackingNumber ?? "",
                        trackingUrl: entry.trackingUrl ?? "",
                        qrPayload: entry.qrPayload ?? "",
                        contactPhone: entry.contactPhone ?? "",
                        contactEmail: entry.contactEmail ?? "",
                        notes: entry.notes ?? "",
                        shippingAmount: entry.shippingAmount ?? "",
                        shippingCurrency: (entry.shippingCurrency ?? "USD") as string,
                      };
                      const form = detailLogisticsEditForm ?? initialForm;
                      const setForm = (next: Partial<typeof form>) => setDetailLogisticsEditForm((prev) => ({ ...(prev ?? initialForm), ...next }));
                      const handleSaveDetailLogistics = () => {
                        const payload: LogisticsDetails = {
                          orderId,
                          ...form,
                          qrPayload: form.qrPayload || form.trackingUrl || "",
                          updatedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
                        };
                        dispatch({ type: "SET_LOGISTICS_DETAILS", payload });
                        toast.success("3rd party details saved", { description: `Order ${orderId}. Link/QR will appear in customer app.` });
                      };
                      return (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Order / Shipment ID</label>
                            <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{orderId}</p>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Carrier Name</label>
                              <Input placeholder="e.g. DHL Global" value={form.carrierName} onChange={(e) => setForm({ carrierName: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tracking Number</label>
                              <Input placeholder="e.g. DHL1234567890" value={form.trackingNumber} onChange={(e) => setForm({ trackingNumber: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tracking URL (shown as link in app)</label>
                            <Input placeholder="https://track.carrier.com/..." value={form.trackingUrl} onChange={(e) => setForm({ trackingUrl: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Phone</label>
                              <Input placeholder="+1 234 567 8900" value={form.contactPhone} onChange={(e) => setForm({ contactPhone: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Email</label>
                              <Input type="email" placeholder="support@carrier.com" value={form.contactEmail} onChange={(e) => setForm({ contactEmail: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
                            <Input placeholder="Optional notes" value={form.notes} onChange={(e) => setForm({ notes: e.target.value })} className="rounded-xl border-slate-200 dark:border-slate-700" />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                Shipping / logistics amount
                              </label>
                              <Input
                                placeholder="e.g. 1250.00"
                                value={form.shippingAmount}
                                onChange={(e) => setForm({ shippingAmount: e.target.value })}
                                className="rounded-xl border-slate-200 dark:border-slate-700"
                              />
                              <p className="text-xs text-muted-foreground">Used in Financial & Support for reconciliation and reporting.</p>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                              <Select
                                value={form.shippingCurrency}
                                onValueChange={(v) => setForm({ shippingCurrency: v })}
                              >
                                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="GHS">GHS</SelectItem>
                                  <SelectItem value="CHF">CHF</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-emerald-600" />
                                  Transaction payment
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  QR code for the <strong>Tracking URL</strong> above. {form.shippingAmount ? (
                                    <span className="text-emerald-600 font-medium">Amount: {form.shippingAmount} {form.shippingCurrency}</span>
                                  ) : "Enter shipping amount above for Financial & Support."} Save with the button below.</p>
                              </div>
                              {onNavigateToTransactionsPage && (
                                <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl" onClick={onNavigateToTransactionsPage}>
                                  <Link2 className="h-4 w-4" />
                                  Open Transactions page
                                </Button>
                              )}
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4">
                              <div className="flex flex-wrap items-start gap-6">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                  <QRCodeSVG value={(form.trackingUrl || "").trim() || `order:${orderId}`} size={200} className="mx-auto" />
                                  <p className="text-xs text-muted-foreground mt-2 text-center max-w-[200px]">
                                    {(form.trackingUrl || "").trim() ? "Scan for tracking link" : "QR code — enter Tracking URL above to update"}
                                  </p>
                                </div>
                                {transaction && onNavigateToTransaction && (
                                  <Button variant="outline" size="sm" className="gap-2 shrink-0 rounded-xl" onClick={() => { onNavigateToTransaction(transaction.id); setSelectedLogisticsShipmentForDetail(null); }}>
                                    <Link2 className="h-4 w-4" />
                                    View this transaction
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold" onClick={handleSaveDetailLogistics}>
                            Save 3rd Party Details
                          </Button>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Send transaction details modal */}
      <Dialog open={!!sendTxOrderId} onOpenChange={(open) => { if (!open) { setSendTxOrderId(null); setSendTxEmail(""); } }}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-none bg-white dark:bg-slate-950">
          <DialogHeader className="sr-only">
            <DialogTitle>Send transaction details</DialogTitle>
            <DialogDescription>View and send transaction details for this order to carrier or partner.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#A855F7]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Transaction details</h3>
                <p className="text-xs text-slate-500">Order ID: {sendTxOrderId ?? "—"}</p>
              </div>
            </div>
            {transactionForOrder ? (
              <>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{transactionForOrder.id}</span>
                    <span className="text-slate-500">Order</span>
                    <span className="font-medium">{transactionForOrder.orderId}</span>
                    <span className="text-slate-500">Type</span>
                    <span className="font-medium">{transactionForOrder.orderType}</span>
                    <span className="text-slate-500">Mineral</span>
                    <span className="font-medium">{transactionForOrder.mineral}</span>
                    <span className="text-slate-500">Amount</span>
                    <span className="font-medium">{transactionForOrder.finalAmount} {transactionForOrder.currency}</span>
                    <span className="text-slate-500">Fee / Net</span>
                    <span className="font-medium">{transactionForOrder.serviceFee ?? "—"} / {transactionForOrder.netAmount ?? "—"}</span>
                    <span className="text-slate-500">Method</span>
                    <span className="font-medium">{transactionForOrder.method}</span>
                    <span className="text-slate-500">Status</span>
                    <span><Badge variant="secondary" className="text-xs">{transactionForOrder.status}</Badge></span>
                    <span className="text-slate-500">Date</span>
                    <span className="font-medium">{transactionForOrder.date} {transactionForOrder.time}</span>
                  </div>
                  {orderForSendTx && (
                    <>
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2" />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <span className="text-slate-500">Counterparty</span>
                        <span className="font-medium">{getRegistryUserName(state.registryUsers, orderForSendTx.userId) || "—"}</span>
                      </div>
                    </>
                  )}
                  {transactionForOrder.settlementNote && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700"><span className="font-medium">Note:</span> {transactionForOrder.settlementNote}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Send to email (optional)</label>
                  <Input
                    type="email"
                    placeholder="carrier@example.com"
                    value={sendTxEmail}
                    onChange={(e) => setSendTxEmail(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold" onClick={handleSendTransactionByEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    {sendTxEmail.trim() ? "Send to email" : "Confirm send"}
                  </Button>
                  <Button variant="outline" className="rounded-xl font-bold" onClick={handleCopyTransactionDetails}>
                    Copy details
                  </Button>
                  <Button variant="ghost" className="rounded-xl" onClick={() => { setSendTxOrderId(null); setSendTxEmail(""); }}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-200">
                No transaction found for order <span className="font-mono font-bold">{sendTxOrderId}</span>. Add or complete a transaction for this order first.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tracking Modal */}
      <Dialog open={isTrackingModalOpen} onOpenChange={setIsTrackingModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none bg-white dark:bg-slate-950">
           <DialogHeader className="sr-only">
              <DialogTitle>Shipment Tracking</DialogTitle>
              <DialogDescription>Live tracking and route information for the selected mineral shipment.</DialogDescription>
           </DialogHeader>
           <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-8 bg-slate-100 dark:bg-slate-900 min-h-[400px] relative overflow-hidden group">
                 {/* Mock Map */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Navigation className="w-24 h-24 text-slate-300 dark:text-slate-800 animate-pulse" />
                    <div className="absolute bottom-8 left-8 right-8">
                       <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/20">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[10px] font-black uppercase text-slate-400">Current Position</p>
                             <Badge className="bg-emerald-500 text-white border-none text-[8px]">Live GPS</Badge>
                          </div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">Transit Point: Arabian Sea Corridor</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">Speed: 18.5 Knots | Heading: 285° NW</p>
                       </div>
                    </div>
                 </div>
                 {/* Track line */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M100,300 Q200,100 400,250" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="8 8" className="animate-[dash_20s_linear_infinite]" />
                 </svg>
              </div>
              <div className="md:col-span-4 p-8 bg-white dark:bg-slate-950 flex flex-col">
                 <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Carrier</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{selectedShipment?.carrier}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Milestones</p>
                       <div className="space-y-4">
                          {[
                            { label: "Origin Pickup", date: "Jan 24", status: "complete" },
                            { label: "Port Clearance", date: "Jan 26", status: "complete" },
                            { label: "Loaded & In Transit", date: "Jan 27", status: "active" },
                            { label: "Destination Arrival", date: "Feb 02", status: "pending" },
                          ].map((step, i) => (
                            <div key={i} className="flex gap-4 relative">
                               {i !== 3 && <div className="absolute left-[11px] top-6 w-0.5 h-6 bg-slate-100 dark:bg-slate-800" />}
                               <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                                 step.status === 'complete' ? 'bg-emerald-500 text-white' : 
                                 step.status === 'active' ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-500' : 
                                 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                               }`}>
                                 {step.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                               </div>
                               <div>
                                  <p className={`text-xs font-black ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>{step.label}</p>
                                  <p className="text-[10px] font-bold text-slate-500">{step.date}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black rounded-xl h-12"
                      onClick={() => setIsTrackingModalOpen(false)}
                    >
                      Close Tracker
                    </Button>
                 </div>
              </div>
           </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
}
