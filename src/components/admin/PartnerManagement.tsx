import React, { useState } from "react";
import { 
  Shield, 
  Globe, 
  Database, 
  FileText, 
  FileEdit,
  Activity, 
  DollarSign, 
  ChevronRight, 
  Download, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  FlaskConical,
  Scale,
  Truck,
  Zap,
  MoreVertical,
  Calendar,
  Eye,
  Trash2,
  Share2,
  FileCheck,
  TrendingUp,
  History,
  Info,
  Upload,
  Link2,
  Lock,
  Bell,
  MessageSquare,
  Box,
  User,
  X,
  ArrowLeft,
  Send
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
  DialogTrigger,
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
import { Label } from "../ui/label";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useDashboardStore, getRegistryUserName, getUserDetails, getVerificationLogForEntity, getKycVerificationResult, type PartnerThirdPartyEntry, type PartnerThirdPartyStatus, type ActiveTestingOrder } from "../../store/dashboardStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Checkbox } from "../ui/checkbox";
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

const PERFORMANCE_DATA = [
  { month: "Aug", score: 88, tat: 23, retest: 2.5, volume: 120 },
  { month: "Sep", score: 90, tat: 22, retest: 2.3, volume: 135 },
  { month: "Oct", score: 85, tat: 25, retest: 3.1, volume: 128 },
  { month: "Nov", score: 92, tat: 21, retest: 2.0, volume: 142 },
  { month: "Dec", score: 94, tat: 19, retest: 1.8, volume: 138 },
  { month: "Jan", score: 92, tat: 22, retest: 2.1, volume: 145 },
];

const TEST_REQUESTS = [
  { 
    id: "TR-0456", 
    orderId: "O-1234", 
    mineral: "Gold 50kg", 
    type: "Purity + Weight", 
    status: "Sample Received", 
    progress: 60, 
    location: "Mumbai Lab", 
    priority: "High", 
    requested: "2d ago", 
    remaining: "24h" 
  },
  { 
    id: "TR-0457", 
    orderId: "O-1235", 
    mineral: "Cobalt 100t", 
    type: "Full Assay", 
    status: "Testing", 
    progress: 45, 
    location: "Lubumbashi Lab", 
    priority: "Medium", 
    requested: "1d ago", 
    remaining: "48h" 
  },
  { 
    id: "TR-0458", 
    orderId: "O-1236", 
    mineral: "Diamonds 500ct", 
    type: "Clarity + Cut", 
    status: "In Transit", 
    progress: 20, 
    location: "Antwerp Lab", 
    priority: "Critical", 
    requested: "5h ago", 
    remaining: "12h" 
  },
  { 
    id: "TR-0459", 
    orderId: "O-1237", 
    mineral: "Iron Ore 5kt", 
    type: "Composition", 
    status: "Completed", 
    progress: 100, 
    location: "Perth Lab", 
    priority: "Low", 
    requested: "4d ago", 
    remaining: "Done" 
  },
  { 
    id: "TR-0460", 
    orderId: "O-1238", 
    mineral: "Copper 20t", 
    type: "Purity", 
    status: "Awaiting Sample", 
    progress: 5, 
    location: "Santiago Lab", 
    priority: "Medium", 
    requested: "1w ago", 
    remaining: "72h" 
  },
  { 
    id: "TR-0461", 
    orderId: "O-1239", 
    mineral: "Lithium 10t", 
    type: "Concentration", 
    status: "Sample Received", 
    progress: 55, 
    location: "Mumbai Lab", 
    priority: "High", 
    requested: "3d ago", 
    remaining: "18h" 
  },
  { 
    id: "TR-0462", 
    orderId: "O-1240", 
    mineral: "Silver 200kg", 
    type: "Standard Assay", 
    status: "Testing", 
    progress: 80, 
    location: "Antwerp Lab", 
    priority: "Medium", 
    requested: "2d ago", 
    remaining: "6h" 
  },
  { 
    id: "TR-0463", 
    orderId: "O-1241", 
    mineral: "Zinc 50t", 
    type: "Full Analysis", 
    status: "Delayed", 
    progress: 30, 
    location: "Lubumbashi Lab", 
    priority: "High", 
    requested: "5d ago", 
    remaining: "EXPIRED" 
  },
  { 
    id: "TR-0464", 
    orderId: "O-1242", 
    mineral: "Nickel 5t", 
    type: "Purity", 
    status: "Completed", 
    progress: 100, 
    location: "Perth Lab", 
    priority: "Low", 
    requested: "6d ago", 
    remaining: "Done" 
  },
  { 
    id: "TR-0465", 
    orderId: "O-1243", 
    mineral: "Gold 10kg", 
    type: "Fast Track Purity", 
    status: "Testing", 
    progress: 90, 
    location: "Mumbai Lab", 
    priority: "Critical", 
    requested: "12h ago", 
    remaining: "2h" 
  },
];

const REPORTS = [
  { id: "C-001", issueDate: "Jan 28, 2026", expiryDate: "Jan 30, 2027", mineral: "Gold", status: "Active" },
  { id: "C-002", issueDate: "Jan 15, 2026", expiryDate: "Jan 15, 2027", mineral: "Cobalt", status: "Active" },
  { id: "C-003", issueDate: "Dec 20, 2025", expiryDate: "Dec 20, 2026", mineral: "Diamond", status: "Active" },
  { id: "C-004", issueDate: "Nov 05, 2025", expiryDate: "Feb 10, 2026", mineral: "Iron Ore", status: "Expiring Soon" },
];

type TestRequestRow = (typeof TEST_REQUESTS)[number];
type ReportRow = (typeof REPORTS)[number];

type TestingPartner = "SGS" | "Other";

export interface PartnerManagementProps {
  /** Navigate to Compliance & Verification (e.g. after batch verification). */
  onNavigateToCompliance?: () => void;
  /** Open Logistics page, optionally for a specific order. */
  onNavigateToLogistics?: (orderId?: string) => void;
  /** Open Orders & Settlements (Transactions) page, optionally for a transaction. */
  onNavigateToTransactions?: (transactionId?: string) => void;
  /** Open order detail (Buy or Sell). */
  onOpenOrderDetail?: (orderId: string, type: "buy" | "sell") => void;
}

export function PartnerManagement({ onNavigateToCompliance, onNavigateToLogistics, onNavigateToTransactions, onOpenOrderDetail }: PartnerManagementProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPartner, setSelectedPartner] = useState<TestingPartner>("SGS");
  const [otherPartnerName, setOtherPartnerName] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TestRequestRow | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [regionFilter, setRegionFilter] = useState("all");
  const [testRequests, setTestRequests] = useState<TestRequestRow[]>(() => [...TEST_REQUESTS]);
  const [isNewTestRequestOpen, setIsNewTestRequestOpen] = useState(false);
  const [newTestForm, setNewTestForm] = useState({
    orderId: "",
    mineral: "",
    type: "Purity + Weight",
    location: "Mumbai Lab",
    priority: "Medium" as const,
    partner: "SGS" as TestingPartner,
    otherPartnerName: "",
  });
  const [selectedReport, setSelectedReport] = useState<ReportRow | null>(null);
  const [reportSelection, setReportSelection] = useState<Set<string>>(new Set());
  const [performanceChartView, setPerformanceChartView] = useState<"score" | "volume">("score");
  const [slaExpandDialogOpen, setSlaExpandDialogOpen] = useState(false);
  const [capacityAuditDialogOpen, setCapacityAuditDialogOpen] = useState(false);
  const [batchVerificationDialogOpen, setBatchVerificationDialogOpen] = useState(false);
  const [selectedTestingOrder, setSelectedTestingOrder] = useState<ActiveTestingOrder | null>(null);
  const [testingOrderDetailOpen, setTestingOrderDetailOpen] = useState(false);
  const [selectedTestingOrderForDetail, setSelectedTestingOrderForDetail] = useState<ActiveTestingOrder | null>(null);
  const [testingOrderDetailTab, setTestingOrderDetailTab] = useState("overview");

  const activeTestingOrders = state.activeTestingOrders ?? [];

  type FinanceEntry = { id: string; date: string; desc: string; amount: string; status: string; method: string };
  const INITIAL_FINANCE_TRANSACTIONS: FinanceEntry[] = [
    { id: "TXN-8821", date: "Jan 28, 2026", desc: "Batch Assay Fee - O-1234", amount: "$1,200.00", status: "Paid", method: "Settlement" },
    { id: "TXN-8820", date: "Jan 25, 2026", desc: "Expedited Testing - O-1243", amount: "$450.00", status: "Pending", method: "Direct Debit" },
    { id: "TXN-8819", date: "Jan 20, 2026", desc: "Retest Verification - O-1236", amount: "$150.00", status: "Paid", method: "Settlement" },
    { id: "TXN-8818", date: "Jan 18, 2026", desc: "SLA Tier Upgrade - Q1", amount: "$5,000.00", status: "Paid", method: "Wire" },
  ];
  const [financeTransactions, setFinanceTransactions] = useState<FinanceEntry[]>(INITIAL_FINANCE_TRANSACTIONS);
  const [editingFinanceId, setEditingFinanceId] = useState<string | null>(null);
  const [financeForm, setFinanceForm] = useState({ desc: "", amount: "", date: "", method: "Settlement", status: "Pending" });

  const handleFinanceRowClick = (txn: FinanceEntry) => {
    setEditingFinanceId(txn.id);
    setFinanceForm({
      desc: txn.desc,
      amount: txn.amount.replace(/^\$/, ""),
      date: txn.date,
      method: txn.method,
      status: txn.status,
    });
  };

  const saveFinanceDetail = () => {
    const trimmedDesc = financeForm.desc.trim();
    const trimmedAmount = financeForm.amount.trim();
    const trimmedDate = financeForm.date.trim();
    if (!trimmedDesc || !trimmedAmount || !trimmedDate) {
      toast.error("Missing fields", { description: "Please fill Description, Amount, and Date." });
      return;
    }
    const amountDisplay = trimmedAmount.startsWith("$") ? trimmedAmount : `$${trimmedAmount}`;
    if (editingFinanceId) {
      setFinanceTransactions((prev) =>
        prev.map((t) =>
          t.id === editingFinanceId
            ? { ...t, date: trimmedDate, desc: trimmedDesc, amount: amountDisplay, status: financeForm.status, method: financeForm.method }
            : t
        )
      );
      toast.success("Changes saved", { description: `${editingFinanceId} — ${trimmedDesc}` });
    } else {
      const id = `TXN-${9000 + financeTransactions.length}`;
      setFinanceTransactions((prev) => [
        ...prev,
        { id, date: trimmedDate, desc: trimmedDesc, amount: amountDisplay, status: financeForm.status, method: financeForm.method },
      ]);
      toast.success("Finance detail added", { description: `${id} — ${trimmedDesc}` });
    }
    setFinanceForm({ desc: "", amount: "", date: "", method: "Settlement", status: "Pending" });
    setEditingFinanceId(null);
  };

  const cancelEditFinance = () => {
    setEditingFinanceId(null);
    setFinanceForm({ desc: "", amount: "", date: "", method: "Settlement", status: "Pending" });
  };

  const [paymentLink, setPaymentLink] = useState("");
  const [logisticsLink, setLogisticsLink] = useState("");
  const [proofDocNames, setProofDocNames] = useState<string[]>([]);
  const [accountManagerLogsOpen, setAccountManagerLogsOpen] = useState(false);

  const handleExportPartnerData = () => {
    const escapeCsv = (v: string | undefined) => {
      const s = String(v ?? "").replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows: string[] = [
      ["Partner", "Region Filter", "Order ID", "Company", "Status", "Tracking", "Submitted", "Delivery", "Documents"].map(escapeCsv).join(","),
      ...partnerThirdPartyDetails.map((e) =>
        [
          displayPartnerName,
          regionFilter,
          e.orderId,
          e.companyName ?? "",
          e.status ?? "",
          e.trackingNumber ?? "",
          e.submittedAt ?? "",
          e.expectedDeliveryDate ?? e.deliveredAt ?? "",
          (e.uploadedDocuments ?? []).join("; "),
        ].map(escapeCsv).join(",")
      ),
    ];
    if (partnerThirdPartyDetails.length === 0) {
      rows.push([displayPartnerName, regionFilter, "—", "—", "—", "—", "—", "—", "No entries"].map(escapeCsv).join(","));
    }
    const csv = rows.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Partner-Export-${displayPartnerName.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started", { description: `${partnerThirdPartyDetails.length} 3rd party entries exported as CSV.` });
  };
  const proofFileInputRef = React.useRef<HTMLInputElement>(null);
  /** For "Upload new version" in Documents uploaded card: which row is being replaced (ref so handler always sees latest). */
  const documentUploadForRowRef = React.useRef<{ entryId: string; label: string; currentValue?: string } | null>(null);
  const documentUploadRef = React.useRef<HTMLInputElement>(null);

  const handleDocumentNewVersionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const target = documentUploadForRowRef.current;
    if (!file || !target) return;
    documentUploadForRowRef.current = null;
    const entry = state.partnerThirdPartyDetails.find((x) => x.id === target.entryId);
    if (!entry) return;
    const docs = entry.uploadedDocuments ?? [];
    const newName = file.name;
    const updated = target.currentValue
      ? docs.map((d) => (d === target.currentValue ? newName : d))
      : [...docs, newName];
    dispatch({ type: "UPDATE_PARTNER_THIRD_PARTY", payload: { ...entry, uploadedDocuments: updated } });
    const isCertificate = /final certificate|certificate/i.test(target.label);
    const isLabReport = /lab report/i.test(target.label);
    if ((isCertificate || isLabReport) && entry.orderId) {
      const order = [...(state.buyOrders ?? []), ...(state.sellOrders ?? [])].find((o) => o.id === entry.orderId);
      if (order) {
        const sentType = isCertificate ? ("testing_certificate" as const) : ("lab_report" as const);
        const label = isCertificate ? "Final Certificate" : "Lab Report";
        const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
        const newSent = { type: sentType, label: `${label}: ${newName}`, date: dateStr, channel: "Dashboard", detail: `Uploaded in Testing & Certification for order ${entry.orderId}` };
        const existing = order.sentToUser ?? [];
        const updatedSent = [...existing, newSent];
        dispatch({ type: "UPDATE_ORDER", payload: { ...order, sentToUser: updatedSent } });
        toast.success("Document uploaded and sent to end user", { description: `${target.label} will appear in the app for order ${entry.orderId}.` });
      } else {
        toast.success("New version uploaded", { description: `${target.label}: ${newName}. Link order ${entry.orderId} in Orders to send to user.` });
      }
    } else {
      toast.success("New version uploaded", { description: `${target.label}: ${newName}` });
    }
    e.target.value = "";
  };
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
    toast.success("Payment link sent", { description: `Link sent to ${displayPartnerName}. Partner can use it for payment.` });
    setPaymentLink("");
  };
  const handleSendLogisticsLink = () => {
    const link = logisticsLink.trim();
    if (!link) {
      toast.error("Enter a logistics link", { description: "Paste the tracking or logistics URL to send to the partner." });
      return;
    }
    toast.success("Logistics link sent", { description: `Link sent to ${displayPartnerName}. Partner can use it for shipment tracking.` });
    setLogisticsLink("");
  };

  const emptyThirdPartyForm = {
    orderId: "", companyName: "", trackingNumber: "", trackingUrl: "",
    contactPhone: "", contactEmail: "", companyDetails: "", uploadedDocuments: "",
    status: "Pending" as PartnerThirdPartyStatus,
    expectedDeliveryDate: "", deliveredAt: "", testingPartner: "SGS",
    shippingAmount: "", shippingCurrency: "USD",
  };
  const [editingThirdPartyId, setEditingThirdPartyId] = useState<string | null>(null);
  const [thirdPartyForm, setThirdPartyForm] = useState(emptyThirdPartyForm);
  const [selectedThirdPartyForDetail, setSelectedThirdPartyForDetail] = useState<PartnerThirdPartyEntry | null>(null);
  const partnerThirdPartyDetails = state.partnerThirdPartyDetails ?? [];
  /** 3rd party overview stats for summary cards on Overview and 3rd Party Details tabs. */
  const thirdPartyOverviewStats = React.useMemo(() => {
    const inTransit = partnerThirdPartyDetails.filter((e) => e.status === "In transit").length;
    const delivered = partnerThirdPartyDetails.filter((e) => e.status === "Delivered").length;
    const testing = partnerThirdPartyDetails.filter((e) => e.status === "Sample received at lab").length;
    const pending = partnerThirdPartyDetails.filter((e) => !e.status || e.status === "Pending" || (e.status !== "In transit" && e.status !== "Delivered" && e.status !== "Sample received at lab")).length;
    return {
      total: partnerThirdPartyDetails.length,
      inTransit,
      delivered,
      testing,
      pending,
    };
  }, [partnerThirdPartyDetails]);

  const handleThirdPartyRowClick = (entry: PartnerThirdPartyEntry) => {
    setEditingThirdPartyId(entry.id);
    setThirdPartyForm({
      orderId: entry.orderId,
      companyName: entry.companyName ?? "",
      trackingNumber: entry.trackingNumber,
      trackingUrl: entry.trackingUrl,
      contactPhone: entry.contactPhone ?? "",
      contactEmail: entry.contactEmail ?? "",
      companyDetails: entry.companyDetails ?? "",
      uploadedDocuments: (entry.uploadedDocuments ?? []).join(", "),
      status: (entry.status ?? "Pending") as PartnerThirdPartyStatus,
      expectedDeliveryDate: entry.expectedDeliveryDate ?? "",
      deliveredAt: entry.deliveredAt ?? "",
      testingPartner: entry.testingPartner ?? "SGS",
      shippingAmount: entry.shippingAmount ?? "",
      shippingCurrency: entry.shippingCurrency ?? "USD",
    });
  };

  const saveThirdPartyDetails = () => {
    const orderId = thirdPartyForm.orderId.trim();
    if (!orderId) {
      toast.error("Order / Shipment ID required", { description: "Enter an order or shipment ID." });
      return;
    }
    const docList = thirdPartyForm.uploadedDocuments.trim().split(",").map((s) => s.trim()).filter(Boolean);
    const payload: Partial<PartnerThirdPartyEntry> & { id?: string; orderId: string; trackingNumber: string; trackingUrl: string } = {
      orderId,
      companyName: thirdPartyForm.companyName.trim() || undefined,
      trackingNumber: thirdPartyForm.trackingNumber.trim(),
      trackingUrl: thirdPartyForm.trackingUrl.trim(),
      contactPhone: thirdPartyForm.contactPhone.trim() || undefined,
      contactEmail: thirdPartyForm.contactEmail.trim() || undefined,
      companyDetails: thirdPartyForm.companyDetails.trim() || undefined,
      uploadedDocuments: docList.length ? docList : undefined,
      status: thirdPartyForm.status,
      expectedDeliveryDate: thirdPartyForm.expectedDeliveryDate.trim() || undefined,
      deliveredAt: thirdPartyForm.deliveredAt.trim() || undefined,
      testingPartner: thirdPartyForm.testingPartner || undefined,
      shippingAmount: thirdPartyForm.shippingAmount.trim() || undefined,
      shippingCurrency: thirdPartyForm.shippingCurrency || undefined,
    };
    if (editingThirdPartyId) {
      const existing = partnerThirdPartyDetails.find((e) => e.id === editingThirdPartyId);
      if (existing) {
        dispatch({ type: "UPDATE_PARTNER_THIRD_PARTY", payload: { ...existing, ...payload } });
        toast.success("3rd party details updated", { description: `${orderId} — changes saved.` });
      }
    } else {
      const id = `TP-${Date.now()}`;
      dispatch({
        type: "ADD_PARTNER_THIRD_PARTY",
        payload: { ...payload, id, submittedAt: new Date().toISOString().slice(0, 10) } as PartnerThirdPartyEntry,
      });
      toast.success("3rd party details saved", { description: `${orderId} — recorded.` });
    }
    setThirdPartyForm(emptyThirdPartyForm);
    setEditingThirdPartyId(null);
  };

  const cancelEditThirdParty = () => {
    setEditingThirdPartyId(null);
    setThirdPartyForm(emptyThirdPartyForm);
  };

  const displayPartnerName = selectedPartner === "SGS" ? "SGS" : (otherPartnerName.trim() || "Other");

  const handleReportViewDetails = (report: ReportRow) => setSelectedReport(report);
  const handleReportDownload = (report: ReportRow) => {
    toast.success("Download started", { description: `Certificate ${report.id} (${report.mineral}) is being downloaded.` });
  };
  const toggleReportSelection = (id: string) => {
    setReportSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const handleSelectAllReports = (checked: boolean) => {
    setReportSelection(checked ? new Set(REPORTS.map((r) => r.id)) : new Set());
  };
  const handleBatchVerification = () => {
    if (reportSelection.size === 0) {
      toast.error("Select at least one report", { description: "Use the checkboxes to select reports for batch verification." });
      return;
    }
    setBatchVerificationDialogOpen(true);
  };
  const handleConfirmBatchVerification = () => {
    const count = reportSelection.size;
    setBatchVerificationDialogOpen(false);
    setReportSelection(new Set());
    toast.success("Batch verification started", {
      description: `${count} certificate(s) queued for verification. Track status in Compliance & Verification.`,
      action: onNavigateToCompliance ? { label: "View in Compliance", onClick: onNavigateToCompliance } : undefined,
    });
  };
  const handleArchive = () => {
    toast.success("Archive opened", { description: "Filter or export archived reports from the archive view." });
  };

  const handlePerformanceStatClick = (label: string, value: string, trend: string) => {
    toast.success(`${label}: ${value}`, { description: trend ? `${trend} vs last 30 days` : "View details in dashboard." });
  };
  const handleExpandSLA = () => setSlaExpandDialogOpen(true);
  const handleSubmitSLAExpand = () => {
    toast.success("SLA expansion request submitted", { description: `${displayPartnerName} — request sent to partner.` });
    setSlaExpandDialogOpen(false);
  };
  const handleReviewCapacityAudit = () => setCapacityAuditDialogOpen(true);
  const handleExportCapacityAudit = () => {
    toast.success("Capacity audit exported", { description: "PDF download started." });
    setCapacityAuditDialogOpen(false);
  };
  const handleExportPerformance = () => {
    toast.success("Performance report exported", { description: "Last 6 months — CSV download started." });
  };

  const handleAddTestRequest = () => {
    if (!newTestForm.orderId.trim() || !newTestForm.mineral.trim()) {
      toast.error("Enter Order ID and Mineral");
      return;
    }
    const partnerLabel = newTestForm.partner === "SGS" ? "SGS" : (newTestForm.otherPartnerName.trim() || "Other");
    const nextIdNum = (455 + testRequests.length + 1).toString().padStart(4, "0");
    const newReq: TestRequestRow = {
      id: `TR-${nextIdNum}`,
      orderId: newTestForm.orderId.trim(),
      mineral: newTestForm.mineral.trim(),
      type: newTestForm.type,
      status: "Awaiting Sample",
      progress: 5,
      location: newTestForm.location,
      priority: newTestForm.priority,
      requested: "Just now",
      remaining: "72h",
    };
    setTestRequests((prev) => [newReq, ...prev]);
    toast.success("Test request created", { description: `${newReq.id} sent to ${partnerLabel}.` });
    setIsNewTestRequestOpen(false);
    setNewTestForm({ orderId: "", mineral: "", type: "Purity + Weight", location: "Mumbai Lab", priority: "Medium", partner: "SGS", otherPartnerName: "" });
    setActiveTab("test-requests");
  };

  const handleEscalate = (id: string) => {
    toast.error(`Escalation triggered for ${id}. Priority bumped to Critical.`);
  };

  const handleReassign = (id: string) => {
    toast.info(`Requesting alternative lab options for ${id}...`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-8 space-y-6 max-w-[1920px] mx-auto">
      {!selectedThirdPartyForDetail && !selectedTestingOrderForDetail && (
      <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Testing & Certification Partners</h1>
          <p className="text-muted-foreground">3rd party testing lab partners: manage profile, requests, reports, and performance.</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground">Partner:</span>
            <Select value={selectedPartner} onValueChange={(v) => setSelectedPartner(v as TestingPartner)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SGS">SGS (3rd party)</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {selectedPartner === "Other" && (
              <Input
                placeholder="Other partner name"
                value={otherPartnerName}
                onChange={(e) => setOtherPartnerName(e.target.value)}
                className="h-8 w-[180px] text-xs"
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Platform users (User Management): <span className="font-medium text-emerald-600">{state.registryUsers.length}</span></p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportPartnerData}>
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => setIsNewTestRequestOpen(true)}>
            New Test Request
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg flex-wrap lg:flex-nowrap">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="test-requests" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Test Requests <Badge variant="secondary" className="h-5 px-1.5">{testRequests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active-testing-orders" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Active Testing Orders <Badge variant="secondary" className="h-5 px-1.5">{activeTestingOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            Reports & Certificates
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            Performance & SLA
          </TabsTrigger>
          <TabsTrigger value="financials" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            Financials
          </TabsTrigger>
          <TabsTrigger value="third-party" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            3rd Party Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {/* 3rd Party Details overview cards — at top / header (compact) */}
          <div className="w-full min-w-full overflow-visible mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <CardContent className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <FileCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">3rd party entries</p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-none">{thirdPartyOverviewStats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <CardContent className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Truck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">In transit</p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-none">{thirdPartyOverviewStats.inTransit}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <CardContent className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Testing</p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-none">{thirdPartyOverviewStats.testing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <CardContent className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Delivered</p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-none">{thirdPartyOverviewStats.delivered}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
                <CardContent className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Pending</p>
                      <p className="text-base font-black text-slate-900 dark:text-white leading-none">{thirdPartyOverviewStats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">
              {/* Profile Card */}
              <div className="lg:col-span-5 space-y-6 lg:space-y-8">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Shield className="w-32 h-32 text-emerald-500" />
                  </div>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800 relative shadow-inner overflow-hidden">
                          <ImageWithFallback 
                            src="https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?w=200&h=200&fit=crop"
                            className="w-full h-full object-cover opacity-80"
                            alt="SGS Logo"
                          />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                            {selectedPartner === "SGS" ? "SGS - Global Testing Leader" : (otherPartnerName.trim() || "Other") + " (3rd party)"}
                          </h2>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-none font-bold">3rd party</Badge>
                            <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-none font-bold">Testing Lab</Badge>
                            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-none font-bold">Certification Body</Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <ExternalLink className="w-5 h-5 text-slate-400" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Regional Coverage</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Asia-Pacific", "Africa-West", "European Union", "Latin America"].map(region => (
                          <div key={region} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                            <MapPin className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{region}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Core Services</h3>
                        <div className="space-y-2">
                          {["Quality Assaying", "Quantity Verification", "Traceability Certification", "ESG Compliance Audit"].map(service => (
                            <div key={service} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              {service}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">Contract Status</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Active until Dec 2027</p>
                          <p className="text-xs text-slate-500 font-medium mt-1">SLA Tier: Priority Platinum</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white dark:border-slate-800 shadow-sm">
                          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">Account Manager</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">John Doe</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-slate-200 hover:bg-slate-50 h-10 w-10"
                          onClick={() => { window.location.href = `mailto:account-manager@${selectedPartner === "SGS" ? "sgs" : "partner"}.com?subject=Partner inquiry - ${encodeURIComponent(displayPartnerName)}`; toast.success("Opening email client"); }}
                          aria-label="Email account manager"
                        >
                          <Mail className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-slate-200 hover:bg-slate-50 h-10 w-10"
                          onClick={() => { window.location.href = "tel:+1234567890"; toast.success("Opening phone dialer"); }}
                          aria-label="Call account manager"
                        >
                          <Phone className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 h-10 rounded-xl flex items-center gap-2"
                          onClick={() => setAccountManagerLogsOpen(true)}
                        >
                          <History className="w-4 h-4" />
                          Logs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Escalation Alert */}
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-800 dark:text-amber-300">Escalation Policy Active</h4>
                    <p className="text-xs text-amber-700/70 dark:text-amber-400/70 font-medium mt-1 leading-relaxed">
                      Platinum tier partners guarantee a 24h response for all high-priority escalations. Automated alerts will trigger if TAT exceeds 36h.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Coverage Grid */}
              <div className="lg:col-span-7 space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 xl:gap-6">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-black flex items-center gap-2 text-slate-800 dark:text-slate-200">
                          <Database className="w-4 h-4 text-emerald-500" />
                          Supported Minerals
                        </CardTitle>
                        <Badge variant="outline" className="rounded-full text-[10px] border-slate-200">12 Total</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-3">
                        {["Gold", "Diamonds", "Cobalt", "Iron Ore", "Copper", "Lithium", "Nickel", "Zinc", "Silver"].map(min => (
                          <div key={min} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group/item">
                            <FlaskConical className={`w-5 h-5 mb-2 ${min === 'Gold' ? 'text-amber-500' : min === 'Diamonds' ? 'text-emerald-400' : 'text-slate-400'} group-hover/item:scale-110 transition-transform`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{min}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-black flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Test Types & TAT
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                      {[
                        { name: "Purity Analysis", target: "24h", current: "22h", color: "bg-emerald-500" },
                        { name: "Weight Verification", target: "12h", current: "10h", color: "bg-emerald-600" },
                        { name: "Origin Assaying", target: "48h", current: "52h", color: "bg-orange-500" },
                        { name: "ESG Certification", target: "7d", current: "6.2d", color: "bg-teal-500" },
                      ].map(test => (
                        <div key={test.name} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{test.name}</span>
                            <span className={`font-black ${test.current > test.target ? 'text-orange-500' : 'text-emerald-500'}`}>
                              {test.current} <span className="text-slate-400 font-medium">/ {test.target}</span>
                            </span>
                          </div>
                          <Progress value={85} className={`h-1.5 ${test.color}`} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-emerald-600 text-white rounded-3xl relative overflow-hidden">
                    <CardContent className="p-8 space-y-6 relative z-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-2">Capacity Utilization</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-5xl font-black">78%</h3>
                          <p className="text-sm font-bold text-emerald-200">Used this month</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold text-emerald-100">
                          <span>117 / 150 Monthly Tests</span>
                          <span className="flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            +12% vs last mo.
                          </span>
                        </div>
                        <div className="h-2 w-full bg-emerald-500/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            className="h-full bg-white rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                      <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-2xl h-12">
                        Expand Allocation
                      </Button>
                    </CardContent>
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl flex flex-col justify-center text-center p-8 group">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-slate-800 mx-auto flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-500">
                      <Layers className="w-10 h-10 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none">85%</h3>
                    <p className="text-sm font-bold text-slate-500 mt-2">Platform minerals covered by {displayPartnerName} catalog</p>
                    <Button variant="link" className="text-emerald-500 font-bold text-xs mt-6">Request Catalog Expansion</Button>
                  </Card>
                </div>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="test-requests" className="mt-4">
          <div className="space-y-6">
            {/* Documents, payments & logistics — connected to verification (testing & certification) */}
            <div className="w-full min-w-full overflow-visible">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden w-full" style={{ width: "100%" }}>
                <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-words">Documents, payments & logistics</CardTitle>
                      <CardDescription className="text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-relaxed break-words">
                        Upload proof documents and send payment or logistics links to {displayPartnerName}. Linked to testing & certification verification.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  {partnerThirdPartyDetails.length > 0 && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Verification details (documents uploaded & verified)
                      </h4>
                      <ul className="space-y-2 max-h-32 overflow-y-auto">
                        {partnerThirdPartyDetails.slice(0, 10).map((entry) => {
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

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Active Test Requests</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">Real-time status of all mineral verification requests with {displayPartnerName} labs.</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Search ID, Order, Mineral..." 
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
                        <TableHead className="w-12 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Checkbox id="all" />
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Details</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral Type</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Location</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testRequests.map((request, i) => (
                        <TableRow 
                          key={request.id} 
                          className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer border-slate-100 dark:border-slate-800"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <TableCell className="px-8" onClick={(e) => e.stopPropagation()}>
                            <Checkbox id={request.id} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-slate-900 dark:text-white">{request.id}</span>
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:underline cursor-pointer">
                                {request.orderId}
                                <ArrowUpRight className="w-2 h-2" />
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{request.mineral}</span>
                              <Badge variant="outline" className="w-fit text-[9px] h-4 px-1.5 border-slate-200 text-slate-500 bg-white font-black uppercase tracking-tighter">{request.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[180px]">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className={`font-black ${request.status === 'Delayed' ? 'text-orange-600' : 'text-slate-600'}`}>{request.status}</span>
                                <span className="font-black text-slate-400">{request.progress}%</span>
                              </div>
                              <Progress 
                                value={request.progress} 
                                className={`h-1 rounded-full ${request.progress === 100 ? 'bg-emerald-500' : request.status === 'Delayed' ? 'bg-orange-500' : 'bg-emerald-600'}`} 
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                <FlaskConical className="w-4 h-4 text-slate-400" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{request.location}</span>
                                <Badge 
                                  className={`w-fit text-[8px] h-3.5 px-1 border-none font-black uppercase tracking-tighter mt-0.5 ${
                                    request.priority === 'High' ? 'bg-orange-100 text-orange-700' : 
                                    request.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
                                    'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {request.priority}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{request.requested}</span>
                              <div className="flex items-center gap-1.5">
                                <Clock className={`w-3 h-3 ${request.remaining === 'EXPIRED' ? 'text-red-500' : 'text-slate-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${request.remaining === 'EXPIRED' ? 'text-red-500' : 'text-slate-400'}`}>
                                  {request.remaining}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-100 dark:border-slate-800">
                                  <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Quick Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleReassign(request.id)} className="cursor-pointer gap-2 py-2.5 rounded-lg focus:bg-slate-50">
                                    <Truck className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-sm">Reassign SGS Lab</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEscalate(request.id)} className="cursor-pointer gap-2 py-2.5 rounded-lg focus:bg-red-50">
                                    <Zap className="w-4 h-4 text-orange-500" />
                                    <span className="font-bold text-sm text-red-600">Escalate Delay</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg text-red-600 focus:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="font-bold text-sm">Cancel Request</span>
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
                  <p className="text-xs font-bold text-slate-500">Showing 10 of 156 requests</p>
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

        <TabsContent value="active-testing-orders" className="mt-4">
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Active Testing Orders</CardTitle>
                  <CardDescription className="text-xs font-medium text-slate-500 mt-1">Orders in testing pipeline. Click a row or View to open the full detail page (3rd party lab, documents, logistics, transaction, delivery, financial). Use Open in Logistics / Transactions to jump to those sections.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search order, buyer, mineral..." className="pl-10 h-10 w-[260px] bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-semibold" />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 h-10 rounded-xl">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap px-4">Order / Shipment ID</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Buyer / Seller</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Mineral Type</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Quantity</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Lab Name</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Testing Partner</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tracking #</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Courier</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Shipment Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Expected Del.</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Delivered</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Sample Rec'd</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Testing Start</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Testing Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Cert. Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Testing Fee</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Payment</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Currency</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap px-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTestingOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={19} className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">
                          No active testing orders. Data will appear when orders enter the testing pipeline.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeTestingOrders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer"
                          onClick={() => { setSelectedTestingOrderForDetail(order); setTestingOrderDetailTab("overview"); }}
                        >
                          <TableCell className="px-4 font-black text-slate-900 dark:text-white text-xs whitespace-nowrap">{order.orderId}</TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{order.buyerSellerName}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.mineralType}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.quantity}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-[140px] truncate" title={order.labName}>{order.labName || "—"}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.testingPartner}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-500 dark:text-slate-500 whitespace-nowrap">{order.trackingNumber || "—"}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.courierCompany || "—"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge variant="outline" className={`text-[9px] font-bold border-none ${order.shipmentStatus === "Delivered" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : order.shipmentStatus === "In transit" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{order.shipmentStatus || "—"}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.expectedDeliveryDate || "—"}</TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.deliveredDate || "—"}</TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.sampleReceivedDate || "—"}</TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.testingStartDate || "—"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className={`text-[9px] font-bold border-none ${order.testingStatus === "Completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : order.testingStatus === "In Progress" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : order.testingStatus === "Failed" || order.testingStatus === "Re-test Required" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{order.testingStatus}</Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className={`text-[9px] font-bold border-none ${order.certificationStatus === "Issued" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : order.certificationStatus === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{order.certificationStatus}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{order.testingFee || "—"}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Badge className={`text-[9px] font-bold border-none ${order.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : order.paymentStatus === "Partial" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{order.paymentStatus}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.currency}</TableCell>
                          <TableCell className="text-right px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1 flex-wrap">
                              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600" onClick={() => { setSelectedTestingOrderForDetail(order); setTestingOrderDetailTab("overview"); }}>
                                <Eye className="w-3.5 h-3.5 mr-1" /> View
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => toast.info("Upload Report", { description: order.orderId })}>
                                <Upload className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold" onClick={() => toast.info("Issue Certificate", { description: order.orderId })}>
                                <FileCheck className="w-3.5 h-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4 text-slate-500" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                                  <DropdownMenuItem onClick={() => toast.info("Update Status", { description: order.orderId })} className="gap-2 cursor-pointer">
                                    <Activity className="w-4 h-4" /> Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.info("Download Certificate", { description: order.orderId })} className="gap-2 cursor-pointer">
                                    <Download className="w-4 h-4" /> Download Certificate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {activeTestingOrders.length > 0 && (
                <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-8 py-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Showing {activeTestingOrders.length} order(s)</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl">Export</Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="space-y-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Reports & certificates</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">247</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Reports</p>
                  </div>
                </Card>
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-4 border-l-4 border-l-red-500">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">12</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Expiring Soon</p>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Certificate list</h3>
                  <Button variant="outline" className="rounded-xl border-slate-200 gap-2 h-10 font-semibold px-4" onClick={handleArchive}>
                    <History className="w-4 h-4" />
                    Archive
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-800/30">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {reportSelection.size > 0 ? `${reportSelection.size} selected` : "Select certificates below for batch verification"}
                    </span>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-9 font-semibold px-4 shadow-lg" onClick={handleBatchVerification}>
                      <ArrowUpRight className="w-4 h-4" />
                      Batch Verification
                      {reportSelection.size > 0 && (
                        <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0">{reportSelection.size}</Badge>
                      )}
                    </Button>
                  </div>
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 w-10">
                          <Checkbox
                            checked={reportSelection.size === REPORTS.length}
                            onCheckedChange={(c) => handleSelectAllReports(c === true)}
                            aria-label="Select all reports"
                          />
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">Certificate ID</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue Date</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expires On</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {REPORTS.map((report) => (
                        <TableRow key={report.id} className="border-slate-100 dark:border-slate-800">
                          <TableCell className="px-6 w-10">
                            <Checkbox
                              checked={reportSelection.has(report.id)}
                              onCheckedChange={() => toggleReportSelection(report.id)}
                              aria-label={`Select ${report.id}`}
                            />
                          </TableCell>
                          <TableCell className="px-8 font-black text-slate-900 dark:text-white text-sm">{report.id}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-500">{report.issueDate}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-500">{report.expiryDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FlaskConical className="w-3 h-3 text-slate-400" />
                              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{report.mineral}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${report.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100" onClick={() => handleReportViewDetails(report)} title="View details">
                                <Eye className="w-4 h-4 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-emerald-50 text-emerald-500" onClick={() => handleReportDownload(report)} title="Download">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                <Card className="lg:col-span-4 border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-black flex items-center gap-2 text-slate-800 dark:text-slate-200">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Latest Report Previews
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {[
                      { title: "Gold Assay Report #1029", date: "Jan 28", img: "https://images.unsplash.com/photo-1705073703601-eed67020c5ee?w=400&h=200&fit=crop" },
                      { title: "Cobalt Purity Certificate", date: "Jan 25", img: "https://images.unsplash.com/photo-1570800384563-47b66b89d5df?w=400&h=200&fit=crop" },
                      { title: "ESG Compliance Scorecard", date: "Jan 22", img: "https://images.unsplash.com/photo-1532187875605-2fe358a71e48?w=400&h=200&fit=crop" },
                    ].map((preview, i) => (
                      <div
                        key={i}
                        className="group relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer"
                      >
                        <div className="flex">
                          <div className="w-24 h-24 flex-shrink-0 rounded-l-2xl overflow-hidden">
                            <ImageWithFallback
                              src={preview.img}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              alt={preview.title}
                            />
                          </div>
                          <div className="flex-1 min-w-0 p-3 flex flex-col justify-center">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{preview.title}</p>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">SGS Mumbai Lab • {preview.date}, 2026</p>
                          </div>
                          <div className="flex items-center pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                </div>
              </div>
          </div>
        </TabsContent>

        {/* Report view details dialog */}
        <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Certificate details</DialogTitle>
              <DialogDescription>View and verify certificate information.</DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Certificate ID</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Mineral</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.mineral}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Issue date</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Expires on</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedReport.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <Badge className={`border-none text-xs ${selectedReport.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {selectedReport.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Lab</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{displayPartnerName} Mumbai Lab</p>
                  </div>
                </div>
                <DialogFooter className="gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { handleReportDownload(selectedReport); setSelectedReport(null); }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Batch verification dialog – leads to Compliance & Verification */}
        <Dialog open={batchVerificationDialogOpen} onOpenChange={setBatchVerificationDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Batch verification</DialogTitle>
              <DialogDescription>
                {reportSelection.size} certificate(s) will be sent for verification to {displayPartnerName}. Track status and results in Compliance & Verification.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Selected certificates</p>
                <div className="flex flex-wrap gap-2">
                  {REPORTS.filter((r) => reportSelection.has(r.id)).map((r) => (
                    <Badge key={r.id} variant="secondary" className="font-mono text-xs">{r.id}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                After starting, go to <strong>Compliance & Verification</strong> in the sidebar to view verification queue and status.
              </p>
              <DialogFooter className="gap-2 pt-2">
                <Button variant="outline" onClick={() => setBatchVerificationDialogOpen(false)}>Cancel</Button>
                <Button className="bg-slate-900 hover:bg-slate-800" onClick={handleConfirmBatchVerification}>
                  Start verification
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        <TabsContent value="performance" className="mt-4">
          <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "SLA Adherence", value: "94%", trend: "+2%", color: "text-emerald-500", icon: Shield },
                  { label: "Avg TAT", value: "22h", trend: "-2h", color: "text-emerald-600", icon: Clock },
                  { label: "Delayed Requests", value: "3", trend: "0", color: "text-orange-500", icon: AlertCircle },
                  { label: "Monthly Score", value: "92/100", trend: "+4", color: "text-teal-500", icon: Activity },
                ].map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl overflow-hidden group cursor-pointer hover:ring-2 hover:ring-emerald-500/20 transition-all" onClick={() => handlePerformanceStatClick(stat.label, stat.value, stat.trend)}>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                        <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend.startsWith('-') ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : stat.trend.startsWith('-') ? <ArrowDownRight className="w-3 h-3" /> : null}
                          {stat.trend} <span className="text-slate-400 font-bold uppercase ml-1">vs L30D</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
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
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {performanceChartView === "score" ? "Monthly Performance Score" : "Test Volume (MTD)"}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        {performanceChartView === "score" ? "Weighted index of TAT, accuracy, and re-test rates." : "Number of tests completed per month."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className={`h-8 font-black text-[10px] uppercase ${performanceChartView === "score" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "opacity-50"}`} onClick={() => setPerformanceChartView("score")}>Score</Button>
                      <Button variant="ghost" size="sm" className={`h-8 font-black text-[10px] uppercase ${performanceChartView === "volume" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30" : "opacity-50"}`} onClick={() => setPerformanceChartView("volume")}>Volume</Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1 ml-2" onClick={handleExportPerformance}>
                        <Download className="w-3.5 h-3.5" /> Export
                      </Button>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PERFORMANCE_DATA}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
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
                          dataKey={performanceChartView === "score" ? "score" : "volume"} 
                          stroke={performanceChartView === "score" ? "#10B981" : "#6366F1"} 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill={performanceChartView === "score" ? "url(#colorScore)" : "url(#colorVolume)"} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Re-test Rate (%)</h3>
                      <p className="text-xs font-bold text-slate-500 mt-1">Target: Below 2.5% for Platinum status.</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px]">IN TARGET</Badge>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PERFORMANCE_DATA}>
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
                        <Bar dataKey="retest" radius={[10, 10, 0, 0]}>
                          {PERFORMANCE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.retest > 2.5 ? '#F43F5E' : '#10B981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <Card className="border-none shadow-sm bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black">Ready to scale {displayPartnerName} partnership?</h3>
                    <p className="text-slate-400 text-sm font-medium max-w-md">
                      Current performance metrics indicate that {displayPartnerName} Lubumbashi lab is at 95% capacity. Automated re-routing to Perth lab is suggested for iron ore batches.
                    </p>
                    <div className="flex gap-3 pt-2">
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-8" onClick={handleExpandSLA}>Expand Global SLA</Button>
                      <Button variant="ghost" className="text-white hover:bg-white/10 font-bold h-11 px-8 border border-white/20" onClick={handleReviewCapacityAudit}>Review Capacity Audit</Button>
                    </div>
                  </div>
                  <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border-4 border-emerald-500/50 border-t-emerald-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
              </Card>
          </div>
        </TabsContent>

        {/* SLA expansion dialog */}
        <Dialog open={slaExpandDialogOpen} onOpenChange={setSlaExpandDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Expand Global SLA</DialogTitle>
              <DialogDescription>Request expanded SLA terms with {displayPartnerName}. Your request will be sent to the partner account manager.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">Current tier: Priority Platinum. Requesting capacity and region expansion.</p>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSlaExpandDialogOpen(false)}>Cancel</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmitSLAExpand}>Submit request</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Capacity audit dialog */}
        <Dialog open={capacityAuditDialogOpen} onOpenChange={setCapacityAuditDialogOpen}>
          <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Capacity Audit</DialogTitle>
              <DialogDescription>Review lab capacity and re-routing recommendations for {displayPartnerName}.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2 text-sm">
                <p className="font-medium text-slate-900 dark:text-white">Lubumbashi Lab — 95% capacity</p>
                <p className="text-muted-foreground">Iron ore batches: re-route to Perth lab suggested.</p>
                <p className="text-muted-foreground">Gold / Cobalt: within capacity.</p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setCapacityAuditDialogOpen(false)}>Close</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleExportCapacityAudit}>
                  <Download className="w-4 h-4 mr-2" /> Export PDF
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Account Manager activity logs dialog */}
        <Dialog open={accountManagerLogsOpen} onOpenChange={setAccountManagerLogsOpen}>
          <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Activity logs</DialogTitle>
              <DialogDescription>Recent activity with {displayPartnerName} account manager (John Doe).</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3 max-h-[320px] overflow-y-auto">
              {[
                { date: "Feb 16, 2026 10:30", action: "Contract status reviewed", type: "SLA" },
                { date: "Feb 14, 2026 14:00", action: "Monthly capacity report shared", type: "Report" },
                { date: "Feb 12, 2026 09:15", action: "Escalation response — TAT within 24h", type: "Escalation" },
                { date: "Feb 10, 2026 16:45", action: "Catalog expansion request acknowledged", type: "Request" },
                { date: "Feb 08, 2026 11:00", action: "Quarterly review meeting scheduled", type: "Meeting" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-slate-100 dark:border-slate-800 p-3 text-sm">
                  <History className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{log.date} · {log.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAccountManagerLogsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TabsContent value="financials" className="mt-4">
          <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tests Billed (MTD)</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">156</h3>
                    <p className="text-sm font-bold text-emerald-500">+14% vs last mo.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Total Revenue to SGS</span>
                      <span className="text-slate-900 dark:text-white">$24,500.00</span>
                    </div>
                    <Progress value={65} className="h-1.5 bg-emerald-500" />
                  </div>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pending Invoices</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">$3,200.00</h3>
                    <p className="text-sm font-bold text-orange-500">Due in 5d</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl h-11">Review Invoice</Button>
                    <Button size="icon" variant="outline" className="h-11 w-11 rounded-xl border-slate-200">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                <Card className="border-none shadow-sm bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Standard Service Rates</h4>
                  <div className="space-y-4">
                    {[
                      { name: "Purity Analysis", price: "$150" },
                      { name: "Weight Verification", price: "$80" },
                      { name: "Full Assay Report", price: "$450" },
                      { name: "Fast Track Fee", price: "+$50" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm font-bold">
                        <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                        <span className="text-slate-900 dark:text-white">{item.price}</span>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-emerald-500 font-bold text-xs pt-2">View Full Price List</Button>
                  </div>
                </Card>
              </div>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="px-8 py-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Recent Financial Transactions</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">Audit trail of all payments and billing requests processed for SGS.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="font-bold text-emerald-500 gap-2">
                    View Financial Hub
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">Transaction ID</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financeTransactions.map((txn) => (
                        <TableRow
                          key={txn.id}
                          className={`border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${editingFinanceId === txn.id ? "bg-emerald-50 dark:bg-emerald-900/20 ring-inset ring-1 ring-emerald-200 dark:ring-emerald-800" : ""}`}
                          onClick={() => handleFinanceRowClick(txn)}
                        >
                          <TableCell className="px-8 font-black text-slate-900 dark:text-white text-sm">{txn.id}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-500">{txn.date}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">{txn.desc}</TableCell>
                          <TableCell className="text-xs font-black text-slate-900 dark:text-white">{txn.amount}</TableCell>
                          <TableCell>
                            <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${txn.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                              {txn.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">{txn.method}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-black flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    {editingFinanceId ? "Edit finance detail" : "Add finance detail"}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {editingFinanceId
                      ? `Editing ${editingFinanceId}. Change the fields below and click Save changes.`
                      : "Click a row in the table above to edit it, or add a new transaction here."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</Label>
                      <Input
                        placeholder="e.g. Batch Assay Fee - O-1234"
                        value={financeForm.desc}
                        onChange={(e) => setFinanceForm((f) => ({ ...f, desc: e.target.value }))}
                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</Label>
                      <Input
                        placeholder="e.g. 1200 or $1,200.00"
                        value={financeForm.amount}
                        onChange={(e) => setFinanceForm((f) => ({ ...f, amount: e.target.value }))}
                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</Label>
                      <Input
                        placeholder="e.g. Jan 28, 2026"
                        value={financeForm.date}
                        onChange={(e) => setFinanceForm((f) => ({ ...f, date: e.target.value }))}
                        className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</Label>
                      <Select value={financeForm.method} onValueChange={(v) => setFinanceForm((f) => ({ ...f, method: v }))}>
                        <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Settlement">Settlement</SelectItem>
                          <SelectItem value="Direct Debit">Direct Debit</SelectItem>
                          <SelectItem value="Wire">Wire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</Label>
                      <Select value={financeForm.status} onValueChange={(v) => setFinanceForm((f) => ({ ...f, status: v }))}>
                        <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl gap-2 h-10 font-semibold px-5" onClick={saveFinanceDetail}>
                      <DollarSign className="w-4 h-4" />
                      {editingFinanceId ? "Save changes" : "Add to details"}
                    </Button>
                    {editingFinanceId && (
                      <Button variant="outline" className="rounded-xl h-10 font-semibold px-5 border-slate-200" onClick={cancelEditFinance}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="third-party" className="mt-4">
          <div className="space-y-6">
            {/* 3rd Party Details overview cards — summary at top of tab */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3rd party entries</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{thirdPartyOverviewStats.total}</p>
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
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{thirdPartyOverviewStats.inTransit}</p>
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
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{thirdPartyOverviewStats.testing}</p>
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
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{thirdPartyOverviewStats.delivered}</p>
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
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{thirdPartyOverviewStats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents, payments & logistics — connected to verification details */}
            <div className="w-full min-w-full overflow-visible">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden w-full" style={{ width: "100%" }}>
                <CardHeader className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-words">Documents, payments & logistics</CardTitle>
                      <CardDescription className="text-xs sm:text-sm font-medium text-slate-500 mt-1 leading-relaxed break-words">
                        Upload proof documents and send payment or logistics links to {displayPartnerName}. Tied to 3rd party verification details below.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  {/* Verification summary — documents uploaded & verified status from 3rd party entries */}
                  {partnerThirdPartyDetails.length > 0 && (
                    <div className="mb-6 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                      <h4 className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Verification details (documents uploaded & verified)
                      </h4>
                      <ul className="space-y-2 max-h-32 overflow-y-auto">
                        {partnerThirdPartyDetails.slice(0, 10).map((entry) => {
                          const docs = entry.uploadedDocuments ?? [];
                          const verified = entry.status === "Sample received at lab" || entry.status === "Delivered";
                          return (
                            <li key={entry.id} className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span className="font-black text-slate-900 dark:text-white">{entry.orderId}</span>
                              {docs.length > 0 ? (
                                <span className="text-slate-600 dark:text-slate-400">— {docs.join(", ")}</span>
                              ) : null}
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

            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg font-black text-slate-900 dark:text-white">3rd Party List</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 mt-1">Main listing before opening a detail. Click a row or View Details to open the 3rd Party Details screen.</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none">
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">Order / Shipment ID</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testing Partner</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral Type</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certification Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Delivery Date</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerThirdPartyDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                          No 3rd party records yet. Use the form above to add details by order or shipment ID.
                        </TableCell>
                      </TableRow>
                    ) : (
                      partnerThirdPartyDetails.map((entry) => {
                        const order = [...(state.buyOrders ?? []), ...(state.sellOrders ?? [])].find((o) => o.id === entry.orderId);
                        const activeTesting = (state.activeTestingOrders ?? []).find((a) => a.orderId === entry.orderId);
                        const shipmentLabel = entry.status === "In transit" ? "In Transit" : entry.status === "Sample received at lab" ? "Testing" : entry.status === "Delivered" ? "Delivered" : entry.status || "Pending";
                        return (
                          <TableRow
                            key={entry.id}
                            className={`border-slate-100 dark:border-slate-800 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${editingThirdPartyId === entry.id ? "bg-emerald-50 dark:bg-emerald-900/20 ring-inset ring-1 ring-emerald-200 dark:ring-emerald-800" : ""}`}
                            onClick={() => { setSelectedThirdPartyForDetail(entry); handleThirdPartyRowClick(entry); }}
                          >
                            <TableCell className="px-8 font-black text-slate-900 dark:text-white text-sm">{entry.orderId}</TableCell>
                            <TableCell className="text-xs font-bold text-slate-700 dark:text-slate-300">{entry.testingPartner || entry.companyName || "—"}</TableCell>
                            <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">{order?.mineral ?? activeTesting?.mineralType ?? "—"}</TableCell>
                            <TableCell>
                              <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${entry.status === "Sample received at lab" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" : entry.status === "Delivered" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : entry.status === "In transit" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                                {shipmentLabel}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">{activeTesting?.certificationStatus ?? "—"}</TableCell>
                            <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">{activeTesting?.paymentStatus ?? (entry.shippingAmount ? "Paid" : "—")}</TableCell>
                            <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">{entry.expectedDeliveryDate || "—"}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-xl gap-1.5" onClick={(e) => { e.stopPropagation(); setSelectedThirdPartyForDetail(entry); handleThirdPartyRowClick(entry); }}>
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </>
      )}

      {/* 3rd Party Entry Detail — inline (side nav visible), not full-screen overlay */}
      {selectedThirdPartyForDetail && (() => {
        const entry = selectedThirdPartyForDetail;
        const order = [...(state.buyOrders ?? []), ...(state.sellOrders ?? [])].find((o) => o.id === entry.orderId);
        const linkedUser = order?.userId ? state.registryUsers.find((u) => u.id === order.userId) : null;
        const activeTesting = (state.activeTestingOrders ?? []).find((a) => a.orderId === entry.orderId);
        const transaction = state.transactions.find((t) => t.orderId === entry.orderId);
        const userDetailsSet = getUserDetails(state, linkedUser?.id);
        const kycResult = linkedUser ? getKycVerificationResult(state, linkedUser.id) : undefined;
        const logisticsDetails = state.logisticsDetails?.[entry.orderId];
        const shipmentStatusLabel = entry.status === "In transit" ? "IN TRANSIT" : entry.status === "Sample received at lab" ? "TESTING" : entry.status === "Delivered" ? "DELIVERED" : (entry.status ?? "PENDING").toUpperCase().replace(/ /g, "_");
        return (
          <div className="flex flex-col w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0 bg-white dark:bg-slate-900 flex flex-col gap-2 relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full h-9 w-9 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" onClick={() => setSelectedThirdPartyForDetail(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="absolute top-4 left-6 rounded-xl gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold" onClick={() => setSelectedThirdPartyForDetail(null)} aria-label="Back to list">
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Back
              </Button>
              <div className="flex flex-col gap-2 pr-12 pt-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
                  <span>{entry.orderId}</span>
                  <Badge className={`border-none font-black text-[9px] uppercase tracking-tighter ${entry.status === "Sample received at lab" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" : entry.status === "Delivered" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : entry.status === "In transit" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                    {shipmentStatusLabel}
                  </Badge>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">{entry.testingPartner || entry.companyName || "—"}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tracking: {entry.trackingNumber || "—"}</span>
                </h2>
              </div>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedThirdPartyForDetail(null)}>Close</Button>
              </div>
            </header>

            {/* Single screen — card sections (Photo Evidence / Verification Pipeline style) */}
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
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Buyer/seller who created the test request.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order ID</span>{entry.orderId}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Mineral type</span>{order?.mineral ?? activeTesting?.mineralType ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Testing partner</span>{entry.testingPartner ?? activeTesting?.testingPartner ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Order creation date</span>{order?.createdAt ?? entry.submittedAt ?? "—"}</div>
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
                      <p className="text-sm text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">No registry user linked to order {entry.orderId}.</p>
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
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Payment related to this test.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Invoice number</span>{activeTesting?.invoice ?? transaction?.id ?? "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Testing fee</span>{activeTesting?.testingFee ? `${activeTesting.testingFee} ${activeTesting.currency ?? ""}`.trim() : entry.shippingAmount ? `${entry.shippingAmount} ${entry.shippingCurrency ?? ""}`.trim() : "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium uppercase tracking-wider">Paid amount</span>{entry.shippingAmount ? `${entry.shippingAmount} ${entry.shippingCurrency ?? activeTesting?.currency ?? "USD"}`.trim() : transaction?.finalAmount ? `${transaction.finalAmount} ${transaction.currency}` : "—"}</div>
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
                    {onNavigateToTransactions && transaction && (
                      <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 mt-2 ml-2" onClick={() => { onNavigateToTransactions(transaction.id); setSelectedThirdPartyForDetail(null); }}>
                        Open in Transactions
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Card: Send to end user — certificate / lab report visible in app */}
                {order && (
                  <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-black text-slate-900 dark:text-white">Send to end user</CardTitle>
                          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Notify the buyer/seller in the app. Certificate and lab report will appear under &quot;Links & details sent to you&quot; in their order.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 py-5 flex flex-wrap gap-2">
                      {(() => {
                        const docs = entry.uploadedDocuments ?? [];
                        const hasCert = activeTesting?.certificatePdf ?? docs.some((d) => /certificate|cert/i.test(d));
                        const hasLab = activeTesting?.labReportPdf ?? docs.some((d) => /lab|report/i.test(d));
                        const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                        const sendToUser = (type: "testing_certificate" | "lab_report", label: string) => {
                          const existing = order.sentToUser ?? [];
                          if (existing.some((s) => s.type === type && s.date === dateStr)) {
                            toast.info("Already sent", { description: `${label} was already sent to the end user.` });
                            return;
                          }
                          const newSent = { type, label: `${label} — Testing & Certification`, date: dateStr, channel: "Dashboard", detail: `Sent for order ${entry.orderId}` };
                          dispatch({ type: "UPDATE_ORDER", payload: { ...order, sentToUser: [...existing, newSent] } });
                          toast.success("Sent to end user", { description: `${label} will appear in the app for this order.` });
                        };
                        return (
                          <>
                            <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 gap-2" disabled={!hasCert} onClick={() => sendToUser("testing_certificate", "Final Certificate")}>
                              <Send className="w-4 h-4" /> Send certificate to end user
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-xl gap-2" disabled={!hasLab} onClick={() => sendToUser("lab_report", "Lab Report")}>
                              <Send className="w-4 h-4" /> Send lab report to end user
                            </Button>
                            {!hasCert && !hasLab && <span className="text-xs text-slate-500 dark:text-slate-400 self-center">Upload a certificate or lab report in Documents uploaded below first.</span>}
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}

                {/* Card: Documents, payments & logistics (subsection) */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Documents, payments & logistics</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Upload proof documents and send payment or logistics links for this order. Tied to verification details.</CardDescription>
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
                        {entry.orderId} — {(entry.uploadedDocuments ?? []).length > 0 ? (entry.uploadedDocuments ?? []).join(", ") : "No documents yet"} · <Badge className={`border-none font-black text-[9px] uppercase ml-1 ${entry.status === "Sample received at lab" || entry.status === "Delivered" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{entry.status ?? "Pending"}</Badge>
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
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Documents submitted for testing. Each file: View, Download, Delete (Admin only), Upload new version.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 py-5">
                    {(() => {
                      const docRows: { label: string; value?: string }[] = [
                        { label: "Assay Request PDF", value: activeTesting?.assayRequest ?? (entry.uploadedDocuments ?? []).find((d) => /assay|request/i.test(d)) },
                        { label: "Sample Specification", value: (entry.uploadedDocuments ?? []).find((d) => /sample|spec/i.test(d)) },
                        { label: "Commercial Invoice", value: activeTesting?.invoice ?? (entry.uploadedDocuments ?? []).find((d) => /invoice/i.test(d)) },
                        { label: "Shipping Documents", value: (entry.uploadedDocuments ?? []).find((d) => /shipping|bill|lad/i.test(d)) },
                        { label: "Lab Report", value: activeTesting?.labReportPdf ?? (entry.uploadedDocuments ?? []).find((d) => /lab|report/i.test(d)) },
                        { label: "Final Certificate", value: activeTesting?.certificatePdf ?? (entry.uploadedDocuments ?? []).find((d) => /certificate|cert/i.test(d)) },
                      ].filter((r) => r.value);
                      const anyDocs = docRows.length > 0 || (entry.uploadedDocuments ?? []).length > 0;
                      const allRows = docRows.length > 0 ? docRows : [
                        { label: "Assay Request PDF" }, { label: "Sample Specification" }, { label: "Commercial Invoice" }, { label: "Shipping Documents" }, { label: "Lab Report" }, { label: "Final Certificate" },
                      ];
                      return (
                        <>
                          <input
                            ref={documentUploadRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={handleDocumentNewVersionUpload}
                            aria-hidden
                          />
                          <ul className="space-y-3">
                            {allRows.map((row, i) => (
                              <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                                  {row.value && <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{row.value}</span>}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={() => toast.info("View", { description: row.value ?? row.label })}>View</Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg" onClick={() => toast.info("Download", { description: row.value ?? row.label })}>Download</Button>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => toast.info("Delete (Admin only)", { description: row.label })}>Delete</Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs font-semibold rounded-lg"
                                    onClick={() => {
                                      documentUploadForRowRef.current = { entryId: entry.id, label: row.label, currentValue: row.value };
                                      documentUploadRef.current?.click();
                                    }}
                                  >
                                    Upload new version
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Card: Edit 3rd Party Details */}
                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FileEdit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white">Edit 3rd Party Details</CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Change fields and click Save, or Cancel to clear.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order / Shipment ID</Label>
                              <Input placeholder="e.g. O-1234" value={thirdPartyForm.orderId} onChange={(e) => setThirdPartyForm((f) => ({ ...f, orderId: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3rd party company name</Label>
                              <Input placeholder="e.g. SGS Ghana" value={thirdPartyForm.companyName} onChange={(e) => setThirdPartyForm((f) => ({ ...f, companyName: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking number</Label>
                              <Input placeholder="e.g. DHL1234567890" value={thirdPartyForm.trackingNumber} onChange={(e) => setThirdPartyForm((f) => ({ ...f, trackingNumber: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking URL</Label>
                            <Input placeholder="https://track.carrier.com/..." value={thirdPartyForm.trackingUrl} onChange={(e) => setThirdPartyForm((f) => ({ ...f, trackingUrl: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company details</Label>
                            <Input placeholder="Address, registration, lab name, etc." value={thirdPartyForm.companyDetails} onChange={(e) => setThirdPartyForm((f) => ({ ...f, companyDetails: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploaded documents (from user)</Label>
                            <Input placeholder="Comma-separated e.g. assay_request.pdf, invoice.pdf" value={thirdPartyForm.uploadedDocuments} onChange={(e) => setThirdPartyForm((f) => ({ ...f, uploadedDocuments: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact phone</Label>
                              <Input placeholder="+1 234 567 8900" value={thirdPartyForm.contactPhone} onChange={(e) => setThirdPartyForm((f) => ({ ...f, contactPhone: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact email</Label>
                              <Input type="email" placeholder="support@company.com" value={thirdPartyForm.contactEmail} onChange={(e) => setThirdPartyForm((f) => ({ ...f, contactEmail: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</Label>
                              <Select value={thirdPartyForm.status} onValueChange={(v) => setThirdPartyForm((f) => ({ ...f, status: v as PartnerThirdPartyStatus }))}>
                                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In transit">In transit</SelectItem>
                                  <SelectItem value="Delivered">Delivered</SelectItem>
                                  <SelectItem value="Sample received at lab">Sample received at lab</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected delivery date</Label>
                              <Input placeholder="e.g. Feb 05, 2026" value={thirdPartyForm.expectedDeliveryDate} onChange={(e) => setThirdPartyForm((f) => ({ ...f, expectedDeliveryDate: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivered time</Label>
                              <Input placeholder="e.g. Feb 10, 2026 14:30" value={thirdPartyForm.deliveredAt} onChange={(e) => setThirdPartyForm((f) => ({ ...f, deliveredAt: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testing partner</Label>
                              <Select value={thirdPartyForm.testingPartner} onValueChange={(v) => setThirdPartyForm((f) => ({ ...f, testingPartner: v }))}>
                                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SGS">SGS</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Paid amount
                              </Label>
                              <Input placeholder="e.g. 150.00" value={thirdPartyForm.shippingAmount} onChange={(e) => setThirdPartyForm((f) => ({ ...f, shippingAmount: e.target.value }))} className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</Label>
                              <Select value={thirdPartyForm.shippingCurrency} onValueChange={(v) => setThirdPartyForm((f) => ({ ...f, shippingCurrency: v }))}>
                                <SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-10"><SelectValue /></SelectTrigger>
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
                          <div className="flex flex-wrap gap-3 pt-2">
                            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold px-6 h-10" onClick={() => saveThirdPartyDetails()}>
                              {editingThirdPartyId ? "Save changes" : "Save 3rd Party Details"}
                            </Button>
                            {editingThirdPartyId && (
                              <Button variant="outline" className="rounded-xl h-10 font-semibold px-5 border-slate-200 dark:border-slate-700" onClick={() => cancelEditThirdParty()}>
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Active Testing Order — inline detail (side nav visible), not full-screen */}
      {selectedTestingOrderForDetail && (() => {
        const order = selectedTestingOrderForDetail;
        const transaction = state.transactions.find((t) => t.orderId === order.orderId);
        const buyOrSellOrder = [...(state.buyOrders ?? []), ...(state.sellOrders ?? [])].find((o) => o.id === order.orderId);
        return (
          <div className="flex flex-col w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0 bg-white dark:bg-slate-900 flex flex-col gap-2 relative">
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full h-9 w-9 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200" onClick={() => setSelectedTestingOrderForDetail(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="absolute top-4 left-6 rounded-xl gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-semibold" onClick={() => setSelectedTestingOrderForDetail(null)}>
                <ArrowLeft className="w-4 h-4 shrink-0" />
                Back to Active Testing Orders
              </Button>
              <div className="flex flex-col gap-2 pr-12 pt-10">
                <p className="text-xs font-medium text-muted-foreground">Testing & Certification — Order detail</p>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 flex-wrap">
                  <span>{order.orderId}</span>
                  <Badge className="text-[9px] font-bold border-none bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{order.testingPartner}</Badge>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">{order.buyerSellerName}</span>
                  <span className="text-sm font-medium text-slate-500">· {order.mineralType} {order.quantity}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Testing: {order.testingStatus} · Cert: {order.certificationStatus} · Payment: {order.paymentStatus}
                </p>
              </div>
            </header>

            <Tabs value={testingOrderDetailTab} onValueChange={setTestingOrderDetailTab} className="flex-1 flex flex-col min-h-0">
              <TabsList className="w-full justify-start h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg mx-6 mt-4 shrink-0 overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <User className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="company" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <FlaskConical className="w-4 h-4" /> Company / Lab
                </TabsTrigger>
                <TabsTrigger value="documents" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <FileText className="w-4 h-4" /> Uploaded documents
                </TabsTrigger>
                <TabsTrigger value="logistics" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <Truck className="w-4 h-4" /> Logistics
                </TabsTrigger>
                <TabsTrigger value="transaction" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <DollarSign className="w-4 h-4" /> Transaction
                </TabsTrigger>
                <TabsTrigger value="delivery-testing" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <FileCheck className="w-4 h-4" /> Delivery & testing
                </TabsTrigger>
                <TabsTrigger value="financial" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 shrink-0 gap-1.5">
                  <DollarSign className="w-4 h-4" /> Financial
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <TabsContent value="overview" className="mt-0 space-y-6">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Order & 3rd party summary</CardTitle>
                      <CardDescription className="text-xs">Basic details and testing partner for this active testing order.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Order ID</span>{order.orderId}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Buyer / Seller</span>{order.buyerSellerName}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Mineral</span>{order.mineralType} {order.quantity}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Testing partner</span>{order.testingPartner}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Lab name</span>{order.labName || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Shipment status</span>{order.shipmentStatus || "—"}</div>
                    </CardContent>
                  </Card>
                  {onNavigateToLogistics && (
                    <Button variant="outline" className="rounded-xl gap-2" onClick={() => { onNavigateToLogistics(order.orderId); setSelectedTestingOrderForDetail(null); }}>
                      <Truck className="w-4 h-4" /> Open in Logistics
                    </Button>
                  )}
                  {onNavigateToTransactions && transaction && (
                    <Button variant="outline" className="rounded-xl gap-2 ml-2" onClick={() => { onNavigateToTransactions(transaction.id); setSelectedTestingOrderForDetail(null); }}>
                      <DollarSign className="w-4 h-4" /> Open in Transactions
                    </Button>
                  )}
                  {onOpenOrderDetail && buyOrSellOrder && (
                    <Button variant="outline" className="rounded-xl gap-2 ml-2" onClick={() => { onOpenOrderDetail(order.orderId, buyOrSellOrder.type === "Sell" ? "sell" : "buy"); setSelectedTestingOrderForDetail(null); }}>
                      <Box className="w-4 h-4" /> View order (Buy / Sell)
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="company" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Company details (3rd party lab)</CardTitle>
                      <CardDescription className="text-xs">Lab name, registration, contact person, phone, email, address.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-800/30 text-sm">
                      <div><Label className="text-[10px] font-black text-slate-400 uppercase">Lab name</Label><p className="font-bold text-slate-900 dark:text-white">{order.labName || "—"}</p></div>
                      <div><Label className="text-[10px] font-black text-slate-400 uppercase">Lab registration number</Label><p className="font-semibold text-slate-700 dark:text-slate-300">{order.labRegistrationNumber || "—"}</p></div>
                      <div><Label className="text-[10px] font-black text-slate-400 uppercase">Contact person</Label><p className="font-semibold text-slate-700 dark:text-slate-300">{order.contactPerson || "—"}</p></div>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span>{order.labPhone || "—"}</span></div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="truncate max-w-[280px]">{order.labEmail || "—"}</span></div>
                      </div>
                      <div><Label className="text-[10px] font-black text-slate-400 uppercase">Lab address</Label><p className="font-medium text-slate-600 dark:text-slate-400">{order.labAddress || "—"}</p></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Uploaded documents</CardTitle>
                      <CardDescription className="text-xs">Assay request, invoice, lab report, certificate, compliance documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {[
                          { label: "Assay request", value: order.assayRequest },
                          { label: "Invoice", value: order.invoice },
                          { label: "Lab report PDF", value: order.labReportPdf },
                          { label: "Certificate PDF", value: order.certificatePdf },
                          { label: "Compliance documents", value: order.complianceDocuments },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
                            {value ? (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={value}>{value}</span>
                                <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-emerald-600 shrink-0" onClick={() => toast.info("Download", { description: value })}>Download</Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Not uploaded</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="logistics" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Logistics & shipment</CardTitle>
                      <CardDescription className="text-xs">Tracking number, courier, status, expected and delivered dates.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Tracking number</span>{order.trackingNumber || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Courier company</span>{order.courierCompany || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Shipment status</span>{order.shipmentStatus || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Expected delivery date</span>{order.expectedDeliveryDate || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Delivered date</span>{order.deliveredDate || "—"}</div>
                    </CardContent>
                  </Card>
                  {onNavigateToLogistics && (
                    <Button variant="outline" className="rounded-xl gap-2 mt-4" onClick={() => { onNavigateToLogistics(order.orderId); setSelectedTestingOrderForDetail(null); }}>
                      <Truck className="w-4 h-4" /> Open in Logistics section
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="transaction" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Transaction details</CardTitle>
                      <CardDescription className="text-xs">Settlement/transaction linked to this order.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transaction ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Transaction ID</span>{transaction.id}</div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Type</span>{transaction.orderType}</div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Mineral</span>{transaction.mineral}</div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Final amount</span>{transaction.finalAmount} {transaction.currency}</div>
                          <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Status</span>{transaction.status}</div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No transaction found for this order.</p>
                      )}
                    </CardContent>
                  </Card>
                  {onNavigateToTransactions && transaction && (
                    <Button variant="outline" className="rounded-xl gap-2 mt-4" onClick={() => { onNavigateToTransactions(transaction.id); setSelectedTestingOrderForDetail(null); }}>
                      <DollarSign className="w-4 h-4" /> Open in Transactions
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="delivery-testing" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Delivery & testing info</CardTitle>
                      <CardDescription className="text-xs">Sample received, testing start, testing status, certification status.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Sample received date</span>{order.sampleReceivedDate || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Testing start date</span>{order.testingStartDate || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Testing status</span><Badge className="text-[9px] font-bold border-none">{order.testingStatus}</Badge></div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Certification status</span><Badge className="text-[9px] font-bold border-none">{order.certificationStatus}</Badge></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="mt-0">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black text-slate-900 dark:text-white">Financial info</CardTitle>
                      <CardDescription className="text-xs">Testing fee, payment status, currency.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Testing fee</span>{order.testingFee || "—"}</div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Payment status</span><Badge className="text-[9px] font-bold border-none">{order.paymentStatus}</Badge></div>
                      <div><span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Currency</span>{order.currency || "—"}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        );
      })()}

      {/* Detail Modal Placeholder */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden border-none shadow-sm">
          <div className="bg-emerald-600 p-8 text-white relative">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-2">Detailed View</p>
              <h2 className="text-3xl font-black">Request {selectedRequest?.id}</h2>
              <div className="flex items-center gap-3 mt-4">
                <Badge className="bg-white/20 text-white border-none font-black">{selectedRequest?.status}</Badge>
                <Badge className="bg-white/20 text-white border-none font-black">{selectedRequest?.priority} Priority</Badge>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Activity className="w-24 h-24" />
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral Type</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest?.mineral}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Location</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest?.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRequest?.requested}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Remaining</p>
                <p className={`text-sm font-bold ${selectedRequest?.remaining === 'EXPIRED' ? 'text-red-500' : 'text-emerald-600'}`}>
                  {selectedRequest?.remaining}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion Progress</p>
                <p className="text-xs font-black text-slate-900">{selectedRequest?.progress}%</p>
              </div>
              <Progress value={selectedRequest?.progress} className="h-2 bg-emerald-500" />
            </div>
          </div>
          <DialogFooter className="p-8 pt-0 flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsDetailModalOpen(false)}>Close View</Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12" onClick={() => {
              toast.success("Full verification log exported to PDF.");
              setIsDetailModalOpen(false);
            }}>Export Full Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testing Order Details (Active Testing Orders — View Details) */}
      <Sheet open={testingOrderDetailOpen} onOpenChange={setTestingOrderDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <SheetHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <SheetTitle className="text-xl font-black text-slate-900 dark:text-white">Testing order details</SheetTitle>
            <SheetDescription className="text-xs font-medium text-slate-500">
              Order {selectedTestingOrder?.orderId} — {selectedTestingOrder?.mineralType} · {selectedTestingOrder?.buyerSellerName}
            </SheetDescription>
          </SheetHeader>
          {selectedTestingOrder && (
            <div className="py-6 space-y-8">
              {/* A. Company Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-500" />
                  Company details
                </h3>
                <div className="grid gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3rd party lab name</Label>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedTestingOrder.labName || "—"}</p>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab registration number</Label>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedTestingOrder.labRegistrationNumber || "—"}</p>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact person</Label>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedTestingOrder.contactPerson || "—"}</p>
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{selectedTestingOrder.labPhone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[220px]">{selectedTestingOrder.labEmail || "—"}</span>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab address</Label>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{selectedTestingOrder.labAddress || "—"}</p>
                  </div>
                </div>
              </div>

              {/* B. Uploaded Documents */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  Uploaded documents
                </h3>
                <div className="grid gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-800/30">
                  {[
                    { label: "Assay request", value: selectedTestingOrder.assayRequest },
                    { label: "Invoice", value: selectedTestingOrder.invoice },
                    { label: "Lab report PDF", value: selectedTestingOrder.labReportPdf },
                    { label: "Certificate PDF", value: selectedTestingOrder.certificatePdf },
                    { label: "Compliance documents", value: selectedTestingOrder.complianceDocuments },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
                      {value ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={value}>{value}</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-emerald-600 shrink-0" onClick={() => toast.info("Download", { description: value })}>Download</Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2" onClick={() => { toast.info("Upload Report", { description: selectedTestingOrder.orderId }); }}>
                  <Upload className="w-4 h-4" /> Upload report
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl font-semibold gap-2" onClick={() => toast.info("Issue Certificate", { description: selectedTestingOrder.orderId })}>
                  <FileCheck className="w-4 h-4" /> Issue certificate
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl font-semibold gap-2" onClick={() => toast.info("Download Certificate", { description: selectedTestingOrder.orderId })}>
                  <Download className="w-4 h-4" /> Download certificate
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Test Request Dialog */}
      <Dialog open={isNewTestRequestOpen} onOpenChange={setIsNewTestRequestOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">New Test Request</DialogTitle>
            <DialogDescription>Create a new lab test request with your chosen 3rd party (SGS or Other). Order ID and mineral are required.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Testing partner</Label>
              <Select value={newTestForm.partner} onValueChange={(v) => setNewTestForm((f) => ({ ...f, partner: v as TestingPartner }))}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SGS">SGS (3rd party)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newTestForm.partner === "Other" && (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Other partner name</Label>
                <Input
                  placeholder="e.g. Bureau Veritas, TÜV"
                  value={newTestForm.otherPartnerName}
                  onChange={(e) => setNewTestForm((f) => ({ ...f, otherPartnerName: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Order ID</Label>
                <Input
                  placeholder="e.g. O-1244"
                  value={newTestForm.orderId}
                  onChange={(e) => setNewTestForm((f) => ({ ...f, orderId: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Mineral</Label>
                <Input
                  placeholder="e.g. Gold 50kg"
                  value={newTestForm.mineral}
                  onChange={(e) => setNewTestForm((f) => ({ ...f, mineral: e.target.value }))}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Test Type</Label>
                <Select value={newTestForm.type} onValueChange={(v) => setNewTestForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purity + Weight">Purity + Weight</SelectItem>
                    <SelectItem value="Full Assay">Full Assay</SelectItem>
                    <SelectItem value="Clarity + Cut">Clarity + Cut</SelectItem>
                    <SelectItem value="Composition">Composition</SelectItem>
                    <SelectItem value="Purity">Purity</SelectItem>
                    <SelectItem value="Concentration">Concentration</SelectItem>
                    <SelectItem value="Standard Assay">Standard Assay</SelectItem>
                    <SelectItem value="Full Analysis">Full Analysis</SelectItem>
                    <SelectItem value="Fast Track Purity">Fast Track Purity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Priority</Label>
                <Select value={newTestForm.priority} onValueChange={(v: "Low" | "Medium" | "High" | "Critical") => setNewTestForm((f) => ({ ...f, priority: v }))}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400">Lab Location</Label>
              <Select value={newTestForm.location} onValueChange={(v) => setNewTestForm((f) => ({ ...f, location: v }))}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai Lab">Mumbai Lab</SelectItem>
                  <SelectItem value="Lubumbashi Lab">Lubumbashi Lab</SelectItem>
                  <SelectItem value="Antwerp Lab">Antwerp Lab</SelectItem>
                  <SelectItem value="Perth Lab">Perth Lab</SelectItem>
                  <SelectItem value="Santiago Lab">Santiago Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsNewTestRequestOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAddTestRequest}>Create Test Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
