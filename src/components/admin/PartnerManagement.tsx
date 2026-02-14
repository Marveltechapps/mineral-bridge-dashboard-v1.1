import React, { useState } from "react";
import { 
  Shield, 
  Globe, 
  Database, 
  FileText, 
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
  Info
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
import { useDashboardStore } from "../../store/dashboardStore";
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
}

export function PartnerManagement({ onNavigateToCompliance }: PartnerManagementProps = {}) {
  const { state } = useDashboardStore();
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
    <div className="p-6 space-y-6">
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
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={() => setIsNewTestRequestOpen(true)}>
            New Test Request
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            Overview
          </TabsTrigger>
          <TabsTrigger value="test-requests" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Test Requests <Badge variant="secondary" className="h-5 px-1.5">{testRequests.length}</Badge>
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
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-5 space-y-8">
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
                        <Button size="icon" variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 h-10 w-10">
                          <Mail className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 h-10 w-10">
                          <Phone className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 h-10 rounded-xl flex items-center gap-2">
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
              <div className="lg:col-span-7 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </Tabs>

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
