import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  Download, 
  Zap, 
  Phone, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Mail,
  MoreVertical,
  History,
  Box,
  TrendingUp,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  FileText,
  Map as MapIcon,
  CreditCard,
  Building,
  Smartphone,
  Check,
  Upload,
  Globe,
  Navigation,
  FileSearch,
  History as HistoryIcon,
  Activity,
  UserCheck,
  AlertTriangle,
  Truck,
  FlaskConical,
  MessageSquare,
  ShieldAlert,
  Save,
  RefreshCw,
  FileSignature,
  Fingerprint,
  Link,
  Lock,
  LogOut,
  Maximize2,
  Minimize2,
  RotateCw,
  ShieldQuestion,
  Info,
  ChevronDown,
  LockKeyhole,
  FileBarChart,
  HardDrive,
  UserX,
  Scale,
  Dna,
  UserRoundSearch,
  History as AuditIcon,
  StickyNote,
  Plus,
  Warehouse,
  FileDown,
  Settings,
  ShieldIcon,
  Monitor,
  Video
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
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "../ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useDashboardStore, getUserDetails, getKycVerificationResult, getVerificationLogForEntity, type RegistryUserRow, type Order, type Transaction, type Facility, type LinkedPaymentMethod } from "../../store/dashboardStore";
import type { LoginAttempt, DeviceSession, SecurityNote, ActivityEvent, VideoCallEntry, ArtisanalProfile, ArtisanalDocumentRequest } from "../../types/userDetails";
import { StatusBadge } from "../ui/status-badge";

// --- Shared Document State ---
const KYC_DOCUMENTS = [
  { 
    id: "doc_1", 
    name: "Mining License (Front)", 
    label: "Corporate / Mining License", 
    status: "Verified", 
    img: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&h=600&fit=crop",
    uploadDate: "Jan 28, 2026 • 09:12",
    size: "2.4 MB",
    device: "iPhone 15 Pro"
  },
  { 
    id: "doc_2", 
    name: "Mining License (Back)", 
    label: "Optional Appendix", 
    status: "Verified", 
    img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&h=600&fit=crop",
    uploadDate: "Jan 28, 2026 • 09:14",
    size: "1.8 MB",
    device: "iPhone 15 Pro"
  },
  { 
    id: "doc_3", 
    name: "Tax ID / Business Reg", 
    label: "Institutional ID", 
    status: "Pending Review", 
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop",
    uploadDate: "Feb 02, 2026 • 10:45",
    size: "1.1 MB",
    device: "Web Browser"
  },
  { 
    id: "doc_4", 
    name: "Export Permit (Gold)", 
    label: "Trade Certification", 
    status: "Verified", 
    img: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?w=800&h=600&fit=crop",
    uploadDate: "Jan 29, 2026 • 11:20",
    size: "3.5 MB",
    device: "iPhone 15 Pro"
  },
  { 
    id: "doc_5", 
    name: "Utility Bill / Residence", 
    label: "Proof of Address", 
    status: "Verified", 
    img: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=800&h=600&fit=crop",
    uploadDate: "Jan 30, 2026 • 15:05",
    size: "0.9 MB",
    device: "Android Device"
  }
];

const BIOMETRIC_DATA = {
  name: "Live Identity Verification",
  label: "Biometric Selfie",
  status: "Passed",
  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  liveness: "Passed",
  matchScore: 98,
  spoofDetection: "Passed",
  metadata: "Front Camera (12MP) • HDR Active"
};

const ADDITIONAL_DOCUMENTS_FROM_APP = [
  { id: "add-1", name: "Export Permit (Gold) - Supplementary", label: "Additional document from app", status: "Pending Review", uploadDate: "Feb 02, 2026 • 10:45" },
];

const AFRICAN_COUNTRIES = ["Ghana", "Nigeria", "South Africa", "Cameroon", "Ethiopia", "Kenya", "Tanzania", "Zambia", "DRC", "Mali", "Burkina Faso"];
const isArtisanalUser = (u: RegistryUserRow) => u.role === "Artisanal Collector" && AFRICAN_COUNTRIES.includes(u.country);

function ArtisanalProfileDisplay({ profile }: { profile: ArtisanalProfile }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Operation type</h4>
        <p className="text-sm text-slate-900 dark:text-slate-100">{profile.operationType}</p>
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Location details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Country</span><span className="text-slate-900 dark:text-slate-100">{profile.country}</span></div>
          {profile.stateProvince && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">State / Province</span><span className="text-slate-900 dark:text-slate-100">{profile.stateProvince}</span></div>}
          {profile.district && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">District</span><span className="text-slate-900 dark:text-slate-100">{profile.district}</span></div>}
          {profile.villageTown && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Village / Town</span><span className="text-slate-900 dark:text-slate-100">{profile.villageTown}</span></div>}
          {profile.gpsLocation && <div className="sm:col-span-2"><span className="text-muted-foreground block text-xs font-medium mb-0.5">GPS Location</span><span className="text-slate-900 dark:text-slate-100">{profile.gpsLocation}</span></div>}
          <div className="sm:col-span-2"><span className="text-muted-foreground block text-xs font-medium mb-0.5">Mining area type</span><span className="text-slate-900 dark:text-slate-100">{profile.miningAreaType.join(", ")}</span></div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Operation details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {profile.mineralType && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Mineral type</span><span className="text-slate-900 dark:text-slate-100">{profile.mineralType}</span></div>}
          {profile.miningMethod && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Mining method</span><span className="text-slate-900 dark:text-slate-100">{profile.miningMethod}</span></div>}
          {profile.yearsOfExperience != null && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Years of experience</span><span className="text-slate-900 dark:text-slate-100">{profile.yearsOfExperience}</span></div>}
          {profile.numberOfWorkers != null && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Number of workers</span><span className="text-slate-900 dark:text-slate-100">{profile.numberOfWorkers}</span></div>}
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Compliance & trust</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Mining license uploaded</span><Badge variant={profile.miningLicenseUploaded ? "default" : "secondary"} className="text-xs">{profile.miningLicenseUploaded ? "Yes" : "No"}</Badge></div>
          {profile.cooperativeGroup != null && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Cooperative / group</span><Badge variant="outline" className="text-xs">{profile.cooperativeGroup ? "Yes" : "No"}</Badge></div>}
          <div className="flex items-center gap-2"><span className="text-muted-foreground block text-xs font-medium mb-0.5">Child labor declaration (no minors)</span><CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${profile.childLaborDeclaration ? "text-emerald-600" : "text-slate-300"}`} /></div>
          {profile.safePracticesEnvironmental != null && <div><span className="text-muted-foreground block text-xs font-medium mb-0.5">Safe practices / environmental</span><Badge variant="outline" className="text-xs">{profile.safePracticesEnvironmental ? "Yes" : "No"}</Badge></div>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Submitted at {profile.submittedAt}</p>
    </div>
  );
}

// --- Sub-Components ---

const OrderStepFlow = ({ steps }: { steps: Order['flowSteps'] }) => (
  <div className="flex justify-between items-start w-full relative">
     <div className="absolute top-6 left-0 right-0 h-1 bg-slate-100 -z-0" />
     {steps.map((step, i) => (
       <div key={i} className="flex flex-col items-center gap-4 relative z-10 w-32">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
             step.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 
             step.active ? 'bg-white border-emerald-600 text-[emerald-600] shadow-lg shadow-emerald-500/20' : 
             'bg-white border-slate-100 text-slate-300'
          }`}>
             {step.completed ? <Check className="w-6 h-6" /> : <span className="text-xs font-semibold">{i + 1}</span>}
          </div>
          <p className={`text-xs font-medium text-center leading-tight ${step.active || step.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
             {step.label}
          </p>
       </div>
     ))}
  </div>
);

const StatCard = ({ label, value, sub, trend, variant = "default" }: any) => (
  <Card className={`border-none shadow-sm ${variant === "dark" ? "bg-slate-900 text-white dark:bg-slate-800" : ""}`}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <p className={`text-xs font-medium ${variant === "dark" ? "text-emerald-400" : "text-muted-foreground"}`}>{label}</p>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold mt-1 leading-none text-slate-900 dark:text-white">{value}</h3>
      {sub && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          {sub.map((s: any, i: number) => (
            <div key={i}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-sm font-medium ${variant === "dark" ? "text-white" : "text-slate-900 dark:text-white"}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

/** Display name for the admin performing verification (when no auth context). In production, use current user from auth. */
const CURRENT_VERIFYING_ADMIN = "S. Miller";

const TimelineItem = ({ title, source, time, icon: Icon, admin, color = "emerald" }: any) => (
  <div className="flex gap-3 relative group">
    <div className="flex flex-col items-center">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        color === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : 
        color === "blue" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="w-px h-full bg-slate-100 dark:bg-slate-800 group-last:bg-transparent my-1" />
    </div>
    <div className="pt-0.5 pb-6 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{title}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
          Source: {source}
        </Badge>
        {admin && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Admin: {admin}
          </span>
        )}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Approved: "bg-emerald-600 text-white",
    Verified: "bg-emerald-600 text-white",
    Active: "bg-emerald-600 text-white",
    "Under Review": "bg-amber-500 text-white",
    Suspended: "bg-red-600 text-white",
    Rejected: "bg-red-500 text-white",
    Revoked: "bg-slate-700 text-white",
    Limited: "bg-slate-500 text-white",
    "Not Submitted": "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  };
  return <Badge className={`${styles[status] || 'bg-slate-200 dark:bg-slate-700'} border-none text-xs font-medium`}>{status}</Badge>;
};

const RiskBadge = ({ level }: { level: "Low" | "Medium" | "High" | string }) => {
  const styles: any = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400",
    Medium: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400",
    High: "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400",
  };
  return <Badge variant="outline" className={`${styles[level] || styles.Medium} text-xs font-medium`}>{level} Risk</Badge>;
};

// --- Main Page Component ---

export interface UserManagementProps {
  initialSelectedUserId?: string;
}

export function UserManagement({ initialSelectedUserId }: UserManagementProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const [view, setView] = useState<"list" | "detail">("list");
  useEffect(() => {
    if (!initialSelectedUserId) return;
    const u = state.registryUsers.find((r) => r.id === initialSelectedUserId);
    if (u) {
      setSelectedRegistryUser(u);
      setView("detail");
    }
  }, [initialSelectedUserId, state.registryUsers]); 
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderView, setOrderView] = useState<"list" | "detail">("list");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<"All" | "System" | "User" | "Admin" | "Compliance">("All");
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [facilityToRemove, setFacilityToRemove] = useState<Facility | null>(null);
  const [userListSegment, setUserListSegment] = useState<"all" | "artisanal">("all");
  const [selectedRegistryUser, setSelectedRegistryUser] = useState<RegistryUserRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [restrictDialogOpen, setRestrictDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [newFacility, setNewFacility] = useState({ name: "", street: "", city: "", state: "", postalCode: "", country: "", phone: "", email: "", permitNumber: "" });
  const [isManualRegistrationOpen, setIsManualRegistrationOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", role: "Seller / License Holder", country: "Ghana", flag: "🇬🇭" });
  const [transactionalRestricted, setTransactionalRestricted] = useState(false);
  const [forensicFlagged, setForensicFlagged] = useState(false);
  const [videoCallDialogOpen, setVideoCallDialogOpen] = useState(false);
  const [videoCallPlatform, setVideoCallPlatform] = useState<VideoCallEntry["platform"]>("Google Meet");
  const [videoCallLink, setVideoCallLink] = useState("");
  const [videoCallSentVia, setVideoCallSentVia] = useState<"app" | "email">("app");
  const [videoCallNote, setVideoCallNote] = useState("");
  const [docRequestDialogOpen, setDocRequestDialogOpen] = useState(false);
  const [docRequestType, setDocRequestType] = useState<ArtisanalDocumentRequest["documentType"]>("Mining License");
  const [docRequestMessage, setDocRequestMessage] = useState("");
  const [docRequestSentVia, setDocRequestSentVia] = useState<"app" | "email">("app");

  const registryUsers = state.registryUsers;
  const facilities = state.facilities;
  const userDetails = getUserDetails(state, selectedRegistryUser?.id);
  const paymentMethods = state.paymentMethods;
  const suspendedUserIds = state.suspendedUserIds;
  const restrictedUserIds = state.restrictedUserIds;

  const baseFilteredUsers = userListSegment === "artisanal" ? registryUsers.filter(isArtisanalUser) : registryUsers;
  const filteredRegistryUsers = baseFilteredUsers.filter((u) => {
    const matchSearch = !searchTerm.trim() || [u.name, u.email, u.phone, u.id].some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRole = roleFilter === "all" || u.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status.toLowerCase() === statusFilter.toLowerCase();
    const matchRisk = riskFilter === "all" || u.risk.toLowerCase() === riskFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus && matchRisk;
  });
  const totalPages = Math.max(1, Math.ceil(filteredRegistryUsers.length / pageSize));
  const paginatedUsers = filteredRegistryUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportUsers = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Country", "Status", "Risk", "Pre-homepage details", "LTV"];
    const rows = filteredRegistryUsers.map((u) => [u.id, u.name, u.email, u.phone, u.role, u.country, u.status, u.risk, u.detailsVerifiedAt ? "Verified" : "Pending", u.ltv].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported", { description: `${filteredRegistryUsers.length} rows downloaded.` });
  };

  const handleRestrictAccount = () => {
    if (!selectedRegistryUser) return;
    dispatch({ type: "UPDATE_USER_STATUS", payload: { userId: selectedRegistryUser.id, restricted: true } });
    setRestrictDialogOpen(false);
    toast.success("Account restricted", { description: `${selectedUser.name} has limited access until review.` });
  };

  const handleSuspendUser = () => {
    if (!selectedRegistryUser) return;
    dispatch({ type: "UPDATE_USER_STATUS", payload: { userId: selectedRegistryUser.id, suspended: true } });
    setSuspendDialogOpen(false);
    toast.success("User suspended", { description: `${selectedUser.name} has been suspended.` });
  };

  const handleRemovePaymentMethod = (id: string) => {
    dispatch({ type: "REMOVE_PAYMENT_METHOD", payload: id });
    toast.success("Payment method removed", { description: "User will need to re-add in app if required." });
  };

  const handleForceLogout = () => {
    toast.success("Global logout initiated", { description: "User sessions have been invalidated on all devices." });
  };

  const handleRestrictTransactional = () => {
    setTransactionalRestricted(true);
    toast.success("Transactional access restricted", { description: "User cannot place new orders until restriction is lifted." });
  };

  const handleFlagForensic = () => {
    setForensicFlagged(true);
    toast.success("Flagged for forensic audit", { description: "Case has been queued for compliance review." });
  };

  const handleSendVideoCallLink = () => {
    if (!selectedRegistryUser || !videoCallLink.trim()) {
      toast.error("Missing link", { description: "Enter the video call or chat link." });
      return;
    }
    const entry: VideoCallEntry = {
      id: `vc-${Date.now()}`,
      platform: videoCallPlatform,
      link: videoCallLink.trim(),
      sentVia: videoCallSentVia,
      sentAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      note: videoCallNote.trim() || undefined,
    };
    dispatch({ type: "ADD_VIDEO_CALL", payload: { userId: selectedRegistryUser.id, entry } });
    setVideoCallDialogOpen(false);
    setVideoCallLink("");
    setVideoCallNote("");
    toast.success("Video call link sent", { description: `Link sent via ${videoCallSentVia === "app" ? "app notification" : "email"}. Recorded in user data.` });
  };

  const handleSendDocumentRequest = () => {
    if (!selectedRegistryUser) return;
    const entry: ArtisanalDocumentRequest = {
      id: `docreq-${Date.now()}`,
      documentType: docRequestType,
      message: docRequestMessage.trim() || undefined,
      sentVia: docRequestSentVia,
      sentAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    dispatch({ type: "ADD_ARTISANAL_DOCUMENT_REQUEST", payload: { userId: selectedRegistryUser.id, entry } });
    setDocRequestDialogOpen(false);
    setDocRequestMessage("");
    toast.success(
      docRequestSentVia === "app" ? "Request sent via app notification" : "Request sent via email",
      { description: docRequestSentVia === "app" ? "User will receive this document request in the app. Recorded in dashboard." : "Document request has been sent by email." }
    );
  };

  const handleExportLedgerPdf = () => {
    const text = "Forensic Verification Registry\n\nGenerated " + new Date().toISOString() + "\n\nSequence | Action Record | Acting Officer | Timestamp\n04 | Digital Authorization Signed | S. Miller | Jan 28, 14:32\n03 | Face Match Algorithm Verified (98%) | System AI | Jan 28, 09:15\n02 | License Evidence Uploaded | S. Osei (User) | Jan 28, 09:12\n01 | AML Sanction Database Scan Passed | Refinitiv API | Jan 25, 12:44";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forensic-ledger-${detailUser.id}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ledger exported", { description: "Forensic verification registry downloaded." });
  };

  const displayFacility = selectedFacility ?? facilities[0] ?? null;

  const handleAddFacility = () => {
    if (!newFacility.name.trim() || !newFacility.street.trim() || !newFacility.city.trim() || !newFacility.country.trim()) {
      toast.error("Missing required fields", { description: "Please fill in entity name, street, city, and country." });
      return;
    }
    const fac: Facility = {
      id: `FAC-${Date.now()}`,
      name: newFacility.name,
      street: newFacility.street,
      city: newFacility.city,
      state: newFacility.state,
      postalCode: newFacility.postalCode,
      country: newFacility.country,
      phone: newFacility.phone,
      email: newFacility.email,
      status: "Active",
      isPrimary: facilities.length === 0,
      isSaved: true,
      permitNumber: newFacility.permitNumber,
      addedVia: "Dashboard",
      addedAt: new Date().toLocaleString(),
      usageCount: { buy: 0, sell: 0 },
      usageHistory: [],
    };
    dispatch({ type: "ADD_FACILITY", payload: fac });
    setSelectedFacility(fac);
    setNewFacility({ name: "", street: "", city: "", state: "", postalCode: "", country: "", phone: "", email: "", permitNumber: "" });
    setIsAddFacilityOpen(false);
    toast.success("Facility registered", { description: `${fac.name} has been added to the address registry.` });
  };

  const handleManualRegistration = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Required fields", { description: "Name and email are required." });
      return;
    }
    const id = `MB-USR-${Date.now().toString().slice(-6)}`;
    const user: RegistryUserRow = {
      id,
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      phone: newUser.phone.trim() || "—",
      role: newUser.role,
      country: newUser.country,
      flag: newUser.flag,
      status: "Under Review",
      risk: "Low",
      ltv: "$0",
      lastActive: "Just now",
      avatar: "",
    };
    dispatch({ type: "ADD_REGISTRY_USER", payload: user });
    setNewUser({ name: "", email: "", phone: "", role: "Seller / License Holder", country: "Ghana", flag: "🇬🇭" });
    setIsManualRegistrationOpen(false);
    toast.success("User registered", { description: `${user.name} has been added to the registry.` });
  };

  // KYC Verification State
  const [approvedDocs, setApprovedDocs] = useState<string[]>([]);
  const [biometricStatus, setBiometricStatus] = useState<"pending" | "verified" | "overridden">("pending");
  const [decisionReason, setDecisionReason] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentKycStatus, setCurrentKycStatus] = useState("Verified");

  const defaultDetailUser = {
    id: "MB-USR-4412-S",
    name: "Samuel Osei",
    email: "s.osei@ghana-lithium.com",
    phone: "+233 24 555 0192",
    otpVerified: true,
    role: "Seller",
    country: "Ghana",
    countryCode: "🇬🇭",
    kycStatus: currentKycStatus,
    activeOrders: 1,
    ltv: "$4.05M",
    riskLevel: "Low",
    status: "Active",
    trustScore: 74,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  };

  const selectedUser = selectedRegistryUser
    ? {
        id: selectedRegistryUser.id,
        name: selectedRegistryUser.name,
        email: selectedRegistryUser.email,
        phone: selectedRegistryUser.phone,
        otpVerified: true,
        role: selectedRegistryUser.role.split(" / ")[0] || selectedRegistryUser.role,
        country: selectedRegistryUser.country,
        countryCode: selectedRegistryUser.flag,
        kycStatus: currentKycStatus,
        activeOrders: 1,
        ltv: selectedRegistryUser.ltv,
        riskLevel: selectedRegistryUser.risk,
        status: suspendedUserIds.has(selectedRegistryUser.id) ? "Suspended" : restrictedUserIds.has(selectedRegistryUser.id) ? "Restricted" : selectedRegistryUser.status === "Suspended" ? "Suspended" : "Active",
        trustScore: selectedRegistryUser.risk === "Low" ? 74 : selectedRegistryUser.risk === "High" ? 42 : 58,
        avatar: selectedRegistryUser.avatar
      }
    : defaultDetailUser;

  const toggleDocApproval = (docId: string) => {
    setApprovedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
    const isApproving = !approvedDocs.includes(docId);
    if (selectedRegistryUser && isApproving) {
      dispatch({
        type: "RECORD_VERIFICATION",
        payload: {
          id: `ver-${Date.now()}`,
          at: new Date().toISOString(),
          source: "manual",
          kind: "doc_approval",
          entityId: selectedRegistryUser.id,
          entityType: "user",
          result: "approved",
          label: `Document approved: ${docId}`,
          actor: "Admin",
        },
      });
    }
    toast.success(isApproving ? "Document approved" : "Approval removed");
  };

  const handleFinalApproval = () => {
    if (approvedDocs.length < KYC_DOCUMENTS.length) {
      toast.error("Compliance Error", { description: "All required documents must be approved before final KYC clearance." });
      return;
    }
    if (biometricStatus === "pending") {
      toast.error("Compliance Error", { description: "Biometric identity verification or manual override is required." });
      return;
    }
    if (!decisionReason.trim()) {
      toast.error("Protocol Required", { description: "You must provide a justification for this compliance decision." });
      return;
    }
    if (!isAuthorized) {
      toast.error("Authorization Required", { description: "Please check the digital approval authorization box." });
      return;
    }

    setCurrentKycStatus("Approved");
    if (selectedRegistryUser) {
      const now = new Date();
      const nowIso = now.toISOString();
      const whenDisplay = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      const result = { source: "manual" as const, lastVerifiedAt: whenDisplay, biometricSource: biometricStatus === "overridden" ? "override" as const : "manual" as const };
      dispatch({ type: "SET_KYC_VERIFICATION", payload: { userId: selectedRegistryUser.id, result } });
      dispatch({
        type: "RECORD_VERIFICATION",
        payload: {
          id: `ver-${Date.now()}`,
          at: nowIso,
          source: "manual",
          kind: "kyc_approval",
          entityId: selectedRegistryUser.id,
          entityType: "user",
          result: "approved",
          label: "KYC Verification Approved",
          actor: CURRENT_VERIFYING_ADMIN,
          metadata: { reason: decisionReason },
        },
      });
    }
    toast.success("KYC Approved", { description: `Entity ${selectedUser.id} has been granted full platform access.` });
  };

  const handleBack = () => { setSelectedRegistryUser(null); setView("list"); };

  return (
    <div className="flex flex-col min-h-screen text-slate-900 dark:text-slate-100">
      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
            <div>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-muted-foreground">Operational index of mineral participants. App and dashboard stay in sync.</p>
                  </div>
                  <Button onClick={() => setIsManualRegistrationOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <UserPlus className="w-4 h-4" /> Manual Registration
                  </Button>
               </div>

               {/* Stat cards - same style as Orders & Settlements */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                   <CardContent className="p-4">
                     <p className="text-xs font-medium text-muted-foreground">Total users</p>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{state.registryUsers.length}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                   <CardContent className="p-4">
                     <p className="text-xs font-medium text-muted-foreground">Verified</p>
                     <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{state.registryUsers.filter((u) => u.status === "Verified").length}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                   <CardContent className="p-4">
                     <p className="text-xs font-medium text-muted-foreground">Under review</p>
                     <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">{state.registryUsers.filter((u) => u.status === "Under Review").length}</h3>
                   </CardContent>
                 </Card>
                 <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                   <CardContent className="p-4">
                     <p className="text-xs font-medium text-muted-foreground">Pending access requests</p>
                     <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{state.accessRequests.filter((r) => r.status === "pending").length}</h3>
                   </CardContent>
                 </Card>
               </div>

               {/* Pending access requests: users who filled pre-homepage details and await verification */}
               {state.accessRequests.filter((r) => r.status === "pending").length > 0 && (
                 <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 mt-6 overflow-hidden">
                   <CardHeader className="pb-2">
                     <CardTitle className="text-base flex items-center gap-2">
                       <FileText className="w-4 h-4 text-amber-600" />
                       Pending access requests ({state.accessRequests.filter((r) => r.status === "pending").length})
                     </CardTitle>
                     <CardDescription>Users who completed pre-homepage details (Request Access). Verify and approve to grant access.</CardDescription>
                   </CardHeader>
                   <CardContent className="pt-0">
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead className="text-xs">Request ID</TableHead>
                           <TableHead className="text-xs">Name</TableHead>
                           <TableHead className="text-xs">Email</TableHead>
                           <TableHead className="text-xs">Company</TableHead>
                           <TableHead className="text-xs">Requested role</TableHead>
                           <TableHead className="text-xs">Submitted</TableHead>
                           <TableHead className="text-xs text-right">Action</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {state.accessRequests.filter((r) => r.status === "pending").map((req) => (
                           <TableRow key={req.id}>
                             <TableCell className="text-xs font-mono">{req.id}</TableCell>
                             <TableCell className="text-sm font-medium">{req.name}</TableCell>
                             <TableCell className="text-xs text-muted-foreground">{req.email}</TableCell>
                             <TableCell className="text-xs">{req.company}</TableCell>
                             <TableCell className="text-xs"><Badge variant="secondary">{req.requestedRole}</Badge></TableCell>
                             <TableCell className="text-xs text-muted-foreground">{new Date(req.submittedAt).toLocaleDateString()}</TableCell>
                             <TableCell className="text-right">
                               <Button size="sm" variant="outline" className="mr-1" onClick={() => dispatch({ type: "UPDATE_ACCESS_REQUEST", payload: { id: req.id, status: "rejected" } })}>Reject</Button>
                               <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { dispatch({ type: "UPDATE_ACCESS_REQUEST", payload: { id: req.id, status: "approved" } }); toast.success("Access approved", { description: `${req.name} can now be added to registry.` }); }}>Approve</Button>
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   </CardContent>
                 </Card>
               )}
               <Card className="border-none shadow-sm mt-6 overflow-hidden">
                  <div className="space-y-0">
                    {/* All Users vs Artisanal (African only) */}
                    <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <Tabs value={userListSegment} onValueChange={(v) => setUserListSegment(v as "all" | "artisanal")} className="w-full">
                        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
                          <TabsTrigger value="all" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">All Users</TabsTrigger>
                          <TabsTrigger value="artisanal" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Artisanal Sellers (African only)</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      {userListSegment === "artisanal" && (
                        <p className="text-xs text-muted-foreground mt-2">Seller only (not buyers) — small-scale miners, cooperatives, or individuals (African only). Additional ASM regulatory onboarding details collected from app; review and approve or reject below.</p>
                      )}
                    </div>
                    {/* Registry Search & Filtering */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-wrap items-center justify-between gap-4">
                       <div className="flex flex-wrap items-center gap-3">
                          <div className="relative">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                             <Input placeholder="Search name, ID, or license..." className="h-10 w-72 rounded-lg pl-9 text-sm" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                          </div>
                          <div className="flex gap-2">
                             <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
                                <SelectTrigger className="w-[140px] h-10">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Roles</SelectItem>
                                  <SelectItem value="Seller">Seller</SelectItem>
                                  <SelectItem value="Buyer">Buyer</SelectItem>
                                  <SelectItem value="Artisanal">Artisanal</SelectItem>
                                  <SelectItem value="Mining">Mining</SelectItem>
                                  <SelectItem value="Institutional">Institutional</SelectItem>
                                </SelectContent>
                             </Select>
                             <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setCurrentPage(1); }}>
                                <SelectTrigger className="w-[120px] h-10">
                                  <SelectValue placeholder="Risk" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Risk</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                             </Select>
                             <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                                <SelectTrigger className="w-[130px] h-10">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Status</SelectItem>
                                  <SelectItem value="Verified">Verified</SelectItem>
                                  <SelectItem value="Under Review">Under Review</SelectItem>
                                  <SelectItem value="Suspended">Suspended</SelectItem>
                                  <SelectItem value="Limited">Limited</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Displaying {filteredRegistryUsers.length} {userListSegment === "artisanal" ? "Artisanal" : ""} Results</span>
                          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleExportUsers}><Download className="w-4 h-4" /></Button>
                       </div>
                    </div>

                    {/* Main User Registry Table */}
                    <Table>
                       <TableHeader>
                          <TableRow>
                             <TableHead className="text-xs font-medium text-muted-foreground">User / Identity</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground">Operational Role</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground">Origin Node</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground">Compliance Status</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground">Risk Profile</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground">Pre-homepage details</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground text-right">Lifetime Volume</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground text-center">Video chat</TableHead>
                             <TableHead className="text-xs font-medium text-muted-foreground text-right">Action</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {paginatedUsers.map((u) => {
                            const ud = getUserDetails(state, u.id);
                            const videoCount = ud.videoCalls?.length ?? 0;
                            return (
                            <TableRow 
                              key={u.id} 
                              className="border-slate-50 group hover:bg-slate-50/80 transition-colors cursor-pointer"
                              onClick={() => { setSelectedRegistryUser(u); setView("detail"); }}
                            >
                               <TableCell className="py-4">
                                  <div className="flex items-center gap-3">
                                     <Avatar className="w-10 h-10 rounded-lg border shadow-sm">
                                        <AvatarImage src={u.avatar} />
                                        <AvatarFallback className="bg-slate-100 text-slate-500 text-sm font-medium">{u.name[0]}</AvatarFallback>
                                     </Avatar>
                                     <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.id}</p>
                                     </div>
                                  </div>
                               </TableCell>
                               <TableCell className="py-4">
                                  <Badge variant="secondary" className="text-xs font-medium">{u.role}</Badge>
                               </TableCell>
                               <TableCell className="py-4">
                                  <div className="flex items-center gap-2">
                                     <span className="text-sm">{u.flag}</span>
                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.country}</span>
                                  </div>
                               </TableCell>
                               <TableCell className="py-4">
                                  <StatusBadge status={suspendedUserIds.has(u.id) ? "Suspended" : u.status} />
                               </TableCell>
                               <TableCell className="py-4">
                                  <RiskBadge level={u.risk} />
                               </TableCell>
                               <TableCell className="py-4">
                                  {u.detailsVerifiedAt ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none text-[10px] font-medium">Verified</Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-[10px] font-medium">Pending verification</Badge>
                                  )}
                               </TableCell>
                               <TableCell className="py-4 text-right">
                                  <div className="space-y-0.5">
                                     <p className="text-sm font-medium text-slate-900 dark:text-white">{u.ltv}</p>
                                     <p className="text-xs text-muted-foreground">Total Volume</p>
                                  </div>
                               </TableCell>
                               <TableCell className="py-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <Video className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{videoCount}</span>
                                  </div>
                               </TableCell>
                               <TableCell className="py-4 text-right">
                                  <Button size="icon" variant="ghost" className="h-9 w-9 text-muted-foreground hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); setSelectedRegistryUser(u); setView("detail"); }}>
                                     <Eye className="w-4 h-4" />
                                  </Button>
                               </TableCell>
                            </TableRow>
                          );
                          })}
                       </TableBody>
                    </Table>

                    {/* Pagination Context */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                       <p className="text-xs text-muted-foreground">
                          Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredRegistryUsers.length)} of {filteredRegistryUsers.length} {userListSegment === "artisanal" ? "Artisanal" : "Registered"} Entities
                       </p>
                       <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>Previous</Button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Button key={p} variant="outline" size="sm" className={currentPage === p ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white" : ""} onClick={() => setCurrentPage(p)}>{p}</Button>
                          ))}
                          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
                       </div>
                    </div>
                  </div>
               </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col min-h-screen">
            {/* --- PART A: MASTER IDENTITY HEADER --- */}
            <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-6 shadow-sm">
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <button type="button" onClick={handleBack} className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors">
                        User Management
                      </button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">{selectedUser.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={handleBack}>
                    <Avatar className="w-16 h-16 rounded-lg border-2 border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback className="text-xl font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-md border-2 border-white">
                       <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{selectedUser.name}</h2>
                      <Badge variant="outline" className="text-xs font-medium text-muted-foreground">{selectedUser.id}</Badge>
                      <Badge className="bg-emerald-600 text-white border-none text-xs font-medium">{selectedUser.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                         <span className="text-sm">{selectedUser.countryCode}</span>
                         <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{selectedUser.country}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">{selectedUser.role}</Badge>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-800">
                        <Smartphone className="w-3 h-3" />
                        <span className="text-xs font-medium">Verified OTP {selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-md">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{selectedUser.email}</span>
                      </div>
                    </div>
                    <div className="w-48 space-y-1 pt-1">
                       <span className="text-xs text-muted-foreground">Trust Score: {selectedUser.trustScore}%</span>
                       <Progress value={selectedUser.trustScore} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success("Secure Channel Opened", { description: `Establishing encrypted connection to ${selectedUser.name}...` })}>
                      Contact User
                    </Button>
                    <Button variant="outline" size="sm" className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={() => setRestrictDialogOpen(true)}>Restrict Account</Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setSuspendDialogOpen(true)}>Suspend User</Button>
                  </div>
                </div>
              </div>

              {/* Nav Tabs - scrollable on small viewports so all tabs stay visible */}
              <div className="mt-6 w-full min-w-0 overflow-x-auto pb-1 -mx-1 px-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg w-max min-w-full inline-flex flex-nowrap">
                    {[
                      { id: "overview", label: "Overview", icon: Globe },
                      ...(selectedRegistryUser && isArtisanalUser(selectedRegistryUser) ? [{ id: "artisanal", label: "Artisanal profile", icon: FileCheck }] : []),
                      { id: "kyc", label: "Identity & KYC", icon: ShieldCheck },
                      { id: "facilities", label: "Facilities & Addresses", icon: Building },
                      { id: "orders", label: "Orders", icon: Box },
                      { id: "financial", label: "Financial History", icon: CreditCard },
                      { id: "security", label: "Security & Access", icon: Lock },
                      { id: "videochat", label: "Video chat", icon: Video },
                      { id: "notes", label: "Communication & Notes", icon: MessageSquare }
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id}
                        className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 flex items-center gap-2 shrink-0"
                      >
                        <tab.icon className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* --- TAB CONTENT AREA --- */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div>
                <AnimatePresence mode="wait">
                  
                  {activeTab === "overview" && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-8 space-y-10">
                        {/* Pre-homepage details verification (filled before user could enter app) */}
                        {selectedRegistryUser && (
                          <Card className="border-none shadow-sm p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                              <h4 className="text-sm font-medium text-muted-foreground">Pre-homepage details</h4>
                              {selectedRegistryUser.detailsVerifiedAt ? (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 text-xs shrink-0">
                                  <CheckCircle className="w-3 h-3 mr-1 inline" /> Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 text-xs shrink-0">
                                  Verify here below
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">Whether this user completed the required details (e.g. Request Access) before entering the app. Review the details below and use <strong>Verify details</strong> to confirm you have checked them.</p>
                            {selectedRegistryUser.preHomepageDetails ? (
                              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 mb-4 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                  {selectedRegistryUser.preHomepageDetails.company && (
                                    <div>
                                      <span className="text-muted-foreground block text-xs font-medium mb-0.5">Company</span>
                                      <span className="text-slate-900 dark:text-slate-100">{selectedRegistryUser.preHomepageDetails.company}</span>
                                    </div>
                                  )}
                                  {selectedRegistryUser.preHomepageDetails.requestedRole && (
                                    <div>
                                      <span className="text-muted-foreground block text-xs font-medium mb-0.5">Requested role</span>
                                      <span className="text-slate-900 dark:text-slate-100">{selectedRegistryUser.preHomepageDetails.requestedRole}</span>
                                    </div>
                                  )}
                                  <div className="sm:col-span-2">
                                    <span className="text-muted-foreground block text-xs font-medium mb-0.5">Submitted</span>
                                    <span className="text-slate-900 dark:text-slate-100">{selectedRegistryUser.preHomepageDetails.submittedAt}</span>
                                  </div>
                                  {selectedRegistryUser.preHomepageDetails.reasonOrNotes && (
                                    <div className="sm:col-span-2">
                                      <span className="text-muted-foreground block text-xs font-medium mb-0.5">Reason / notes</span>
                                      <span className="text-slate-900 dark:text-slate-100">{selectedRegistryUser.preHomepageDetails.reasonOrNotes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground mb-4">No pre-homepage submission recorded for this user. Details will appear here when they complete Request Access in the app.</p>
                            )}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                              {selectedRegistryUser.detailsVerifiedAt ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Verified on {selectedRegistryUser.detailsVerifiedAt}</span>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending verification — verify these details below</span>
                                  </div>
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 shrink-0" onClick={() => { dispatch({ type: "VERIFY_USER_DETAILS", payload: { userId: selectedRegistryUser.id, verifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) } }); toast.success("Pre-homepage details verified", { description: `${selectedRegistryUser.name} marked as verified.` }); }}>
                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                    Verify details
                                  </Button>
                                </>
                              )}
                            </div>
                          </Card>
                        )}
                        {/* Personal Information (mirrors app profile) */}
                        <Card className="border-none shadow-sm p-6">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h4>
                          <p className="text-xs text-muted-foreground mb-4">Synced from app profile. Name is locked to KYC verification.</p>
                          <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <Avatar className="w-16 h-16 rounded-lg border shadow-sm shrink-0">
                              <AvatarImage src={selectedUser.avatar} />
                              <AvatarFallback className="text-lg font-semibold bg-slate-100 text-slate-500">{selectedUser.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-3 flex-1">
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedUser.name}</p>
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Name is locked to KYC verification</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedUser.phone}</span>
                                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none text-xs font-medium">Verified</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedUser.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Activity from app – small details from app flows reflected in dashboard */}
                        {selectedRegistryUser && (
                          <Card className="border-none shadow-sm p-6">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Activity from app</h4>
                            <p className="text-xs text-muted-foreground mb-4">Edits and actions this user did in the app (profile, KYC, orders, etc.) reflected here.</p>
                            {state.appActivities.filter((a) => a.userId === selectedRegistryUser.id).length === 0 ? (
                              <p className="text-xs text-muted-foreground">No app activity recorded yet for this user.</p>
                            ) : (
                              <ul className="space-y-2">
                                {state.appActivities.filter((a) => a.userId === selectedRegistryUser.id).slice(0, 10).map((a) => (
                                  <li key={a.id} className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                    <span className="text-slate-700 dark:text-slate-300">{a.description}</span>
                                    <span className="text-muted-foreground shrink-0">{new Date(a.at).toLocaleString()}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <StatCard label="Buy Orders" value="28" sub={[{ label: "Success", value: "92%" }, { label: "Value", value: "$8.4M" }]} />
                           <StatCard label="Sell Orders" value="17" sub={[{ label: "Active", value: "1" }, { label: "Value", value: "$4.05M" }]} />
                           <StatCard variant="dark" label="LTV Trade Volume" value="$850,000" trend="+14.2%" />
                        </div>

                        <Card className="border-slate-100 shadow-none rounded-lg bg-white overflow-hidden">
                          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                             <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <History className="w-6 h-6 text-emerald-500" /> Operational Activity History
                             </CardTitle>
                             <p className="text-xs text-muted-foreground">Who verified and when — from verification log</p>
                          </CardHeader>
                          <CardContent className="p-8 space-y-0">
                             {(selectedRegistryUser ? getVerificationLogForEntity(state, selectedRegistryUser.id, 20) : []).length > 0 ? (
                               (selectedRegistryUser ? getVerificationLogForEntity(state, selectedRegistryUser.id, 20) : []).map((log) => {
                                 const timeStr = new Date(log.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date(log.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                                 const sourceDisplay = log.source === "manual" ? "Admin Dashboard" : log.source === "ai" ? "System AI" : log.source === "api" ? "API" : log.source;
                                 const isManual = log.source === "manual";
                                 const icon = log.kind === "kyc_approval" ? ShieldCheck : log.kind === "face_match" ? UserCheck : ShieldCheck;
                                 const color = isManual ? "emerald" : log.source === "ai" ? "blue" : "slate";
                                 return (
                                   <TimelineItem key={log.id} title={log.label} source={sourceDisplay} time={timeStr} icon={icon} admin={isManual ? log.actor : undefined} color={color} />
                                 );
                               })
                             ) : (
                               <p className="text-sm text-muted-foreground">No verification events yet. When an admin or system verifies this user (KYC approval, document check, AML scan), it will appear here with <strong>who</strong> verified and <strong>when</strong>.</p>
                             )}
                          </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-none rounded-lg bg-white p-8">
                           <div className="flex items-center justify-between mb-8">
                              <div className="space-y-1">
                                 <h4 className="text-lg font-bold text-slate-900 dark:text-white">Identity & KYC Summary</h4>
                                 {(() => {
                                   const kycResult = selectedRegistryUser ? getKycVerificationResult(state, selectedRegistryUser.id) : null;
                                   const verificationLogForUser = selectedRegistryUser ? getVerificationLogForEntity(state, selectedRegistryUser.id, 1) : [];
                                   const lastKycApproval = verificationLogForUser.find((e) => e.kind === "kyc_approval");
                                   const whenStr = kycResult?.lastVerifiedAt ?? lastKycApproval ? (new Date(lastKycApproval.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date(lastKycApproval.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })) : null;
                                   const whoStr = lastKycApproval?.actor ?? (kycResult?.source === "manual" ? CURRENT_VERIFYING_ADMIN : null);
                                   return (
                                     <p className="text-xs text-muted-foreground">
                                       {whenStr && whoStr ? `Verified on ${whenStr} • Admin: ${whoStr}` : whenStr ? `Verified on ${whenStr}` : "Not yet verified — complete verification in Identity & KYC tab."}
                                     </p>
                                   );
                                 })()}
                              </div>
                              <StatusBadge status={currentKycStatus} />
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[...KYC_DOCUMENTS, BIOMETRIC_DATA].map((doc, i) => (
                                <div key={i} className="space-y-3 group cursor-pointer" onClick={() => setActiveTab("kyc")}>
                                   <div className="aspect-video bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
                                      <ImageWithFallback src={doc.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-emerald-900/10">
                                         <Eye className="w-8 h-8 text-white drop-shadow-lg" />
                                      </div>
                                   </div>
                                   <div className="space-y-0.5">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{doc.label}</p>
                                      <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                           <Button onClick={() => setActiveTab("kyc")} variant="outline" className="w-full mt-6 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-900/20 text-slate-900 dark:text-white h-10 rounded-lg">
                              Open Full Identity & KYC Verification Workspace
                           </Button>
                        </Card>
                      </div>

                      <div className="lg:col-span-4 space-y-10">
                        <Card className="border-none shadow-sm rounded-lg bg-emerald-600 text-white p-8 space-y-6">
                           <div className="flex items-center gap-3">
                              <ShieldAlert className="w-6 h-6 text-emerald-300" />
                              <span className="text-xs font-medium text-emerald-100">Compliance Snapshot</span>
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-2xl font-bold">Low Risk</h3>
                              <p className="text-sm font-medium opacity-80 leading-relaxed">Entity matches low-risk profile for automated clearance.</p>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                              <span className="text-xs font-bold">Risk Level</span>
                              <RiskBadge level="Low" />
                           </div>
                        </Card>

                        <Card className="border-slate-100 shadow-none rounded-lg bg-white p-8 space-y-6">
                           <h4 className="text-xs font-medium text-muted-foreground">Internal Remarks</h4>
                           <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 italic text-sm font-bold text-slate-600 leading-relaxed">
                              "Verified primary Swiss warehouse during Q4 site visit. Documentation matches local land registry."
                              <div className="flex items-center gap-2 mt-4 not-italic">
                                 <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">AM</div>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase">A. Miller • Jan 12</span>
                              </div>
                           </div>
                        </Card>
                      </div>
                    </motion.div>
                  )}

                  {/* ARTISANAL PROFILE (ASM REGULATORY ONBOARDING) — seller only, not buyers */}
                  {activeTab === "artisanal" && selectedRegistryUser && isArtisanalUser(selectedRegistryUser) && (
                    <motion.div key="artisanal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                      <Card className="border-none shadow-sm p-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">ASM Regulatory Onboarding</h4>
                        <p className="text-xs text-muted-foreground mb-6">Artisanal users here are seller only (not buyers). All details collected from this artisanal seller in the app. Review and approve or reject the entire profile.</p>
                        {userDetails.artisanalProfile ? (
                          <>
                            <ArtisanalProfileDisplay profile={userDetails.artisanalProfile} />
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                              <span className="text-xs text-muted-foreground">
                                Status: {userDetails.artisanalProfileStatus === "approved" ? "Approved" : userDetails.artisanalProfileStatus === "rejected" ? "Rejected" : "Pending review"}
                              </span>
                              <div className="flex flex-wrap items-center gap-2">
                                {userDetails.artisanalProfileStatus !== "approved" && (
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { dispatch({ type: "UPDATE_ARTISANAL_PROFILE_STATUS", payload: { userId: selectedRegistryUser.id, status: "approved" } }); toast.success("Profile approved", { description: `${selectedRegistryUser.name} is now verified as artisanal seller.` }); }}>
                                    Approve
                                  </Button>
                                )}
                                {userDetails.artisanalProfileStatus !== "rejected" && (
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20" onClick={() => { dispatch({ type: "UPDATE_ARTISANAL_PROFILE_STATUS", payload: { userId: selectedRegistryUser.id, status: "rejected" } }); toast.success("Profile rejected", { description: "Artisanal profile has been rejected." }); }}>
                                    Reject
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="py-12 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <FileCheck className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                            <p className="text-sm text-muted-foreground">No ASM onboarding profile submitted yet.</p>
                            <p className="text-xs text-muted-foreground mt-1">Data will appear here when this user completes the Artisanal Profile flow in the app.</p>
                          </div>
                        )}
                      </Card>

                      <Card className="border-none shadow-sm p-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Document requests</h4>
                        <p className="text-xs text-muted-foreground mb-4">After they enter the homepage, you can request documents from this artisanal user (e.g. Mining License, ASM Verification, PPE/Equipment receipt, Incident Report). You send the request to the user via the app (they receive it in the app) or by email. Requests you send via the app are recorded here.</p>
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <span className="text-xs text-muted-foreground">{(userDetails.artisanalDocumentRequests?.length ?? 0)} request(s) sent</span>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={() => setDocRequestDialogOpen(true)}>
                            <FileCheck className="w-4 h-4" />
                            Send document request
                          </Button>
                        </div>
                        {(userDetails.artisanalDocumentRequests?.length ?? 0) === 0 ? (
                          <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <p className="text-xs text-muted-foreground">No document requests sent yet. Send a request via app notification or email.</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Document type</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Sent via</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Sent at</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(userDetails.artisanalDocumentRequests ?? []).map((req) => (
                                  <TableRow key={req.id}>
                                    <TableCell className="text-sm max-w-[220px]" title={req.message ? `${req.documentType}: ${req.message}` : req.documentType}>{req.documentType}{req.message ? ` — ${req.message.length > 40 ? req.message.slice(0, 40) + "…" : req.message}` : ""}</TableCell>
                                    <TableCell className="text-xs">{req.sentVia === "app" ? "App notification" : "Email"}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{req.sentAt}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs">{req.status}</Badge></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </Card>

                      <Card className="border-none shadow-sm p-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Asset requests</h4>
                        <p className="text-xs text-muted-foreground mb-4">When this artisanal user requests equipment in the app (Certified PPE Kit, Pneumatic Drill Unit, or Institutional Pump from Asset Hub), the request appears here. Price and CAP (repayment period) are linked to this user&apos;s transactions—repayment is tracked in their transaction history.</p>
                        {(userDetails.artisanalAssetRequests?.length ?? 0) === 0 ? (
                          <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <p className="text-xs text-muted-foreground">No asset requests yet. Requests from the app will appear here.</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Asset type</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Price / CAP</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Requested at</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Transactions</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(userDetails.artisanalAssetRequests ?? []).map((req) => (
                                  <TableRow key={req.id}>
                                    <TableCell className="text-sm">{req.assetType}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground" title="Linked to this user's repayment transactions">{req.priceCap}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{req.requestedAt}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs">{req.status}</Badge></TableCell>
                                    <TableCell className="text-xs">
                                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" onClick={() => toast.info("Transactions", { description: "View this user's transactions for price/CAP repayment." })}>
                                        View
                                      </Button>
                                    </TableCell>
                                    <TableCell className="text-xs text-right">
                                      {req.status === "pending" && selectedRegistryUser && (
                                        <div className="flex items-center justify-end gap-1">
                                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20" onClick={() => { dispatch({ type: "UPDATE_ARTISANAL_ASSET_REQUEST", payload: { userId: selectedRegistryUser.id, requestId: req.id, status: "rejected" } }); toast.success("Request rejected", { description: `${req.assetType} request has been rejected.` }); }}>
                                            Reject
                                          </Button>
                                          <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => { dispatch({ type: "UPDATE_ARTISANAL_ASSET_REQUEST", payload: { userId: selectedRegistryUser.id, requestId: req.id, status: "approved" } }); toast.success("Request approved", { description: `${req.assetType} request approved. You can mark it fulfilled when equipment is delivered.` }); }}>
                                            Approve
                                          </Button>
                                        </div>
                                      )}
                                      {req.status === "approved" && selectedRegistryUser && (
                                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { dispatch({ type: "UPDATE_ARTISANAL_ASSET_REQUEST", payload: { userId: selectedRegistryUser.id, requestId: req.id, status: "fulfilled" } }); toast.success("Marked fulfilled", { description: `${req.assetType} has been marked as fulfilled.` }); }}>
                                          Mark fulfilled
                                        </Button>
                                      )}
                                      {(req.status === "rejected" || req.status === "fulfilled") && <span className="text-muted-foreground">—</span>}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </Card>

                      <Card className="border-none shadow-sm p-6">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Incident / emergency log</h4>
                        <p className="text-xs text-muted-foreground mb-4">When this user is in an emergency and submits an incident (category, report, evidence) or dispatches an emergency alert in the app, it appears here as part of their profile.</p>
                        {(userDetails.artisanalIncidentLog?.length ?? 0) === 0 ? (
                          <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <p className="text-xs text-muted-foreground">No incidents or emergency alerts yet.</p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Summary</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Evidence</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Emergency alert</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Dispatched at</TableHead>
                                  <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(userDetails.artisanalIncidentLog ?? []).map((inc) => (
                                  <TableRow key={inc.id} className={inc.emergencyAlertDispatched ? "bg-red-50/50 dark:bg-red-950/20" : undefined}>
                                    <TableCell className="text-sm">{inc.category}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground max-w-[200px]" title={inc.detailedReport}>{inc.detailedReport ? (inc.detailedReport.length > 50 ? inc.detailedReport.slice(0, 50) + "…" : inc.detailedReport) : "—"}</TableCell>
                                    <TableCell className="text-xs">{inc.evidenceSubmitted ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                      {inc.emergencyAlertDispatched ? <Badge variant="destructive" className="text-xs">Dispatched</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{inc.emergencyAlertDispatched ? inc.dispatchedAt : "—"}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-xs">{inc.status}</Badge></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {/* IDENTITY & KYC TAB (VERIFICATION WORKSPACE) */}
                  {activeTab === "kyc" && (
                    <motion.div key="kyc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 pb-32 relative">
                      
                      {/* 1️⃣ Tab Header (Context First) */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedUser.name}</h3>
                            <Badge variant="outline" className="bg-slate-50 border-slate-200 font-bold text-xs text-slate-500 rounded-lg">{selectedUser.id}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type:</span>
                              <span className="text-xs font-black text-slate-900 uppercase">Corporate / Mining License Holder</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={selectedUser.kycStatus} />
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                  <Progress value={83} className="h-full bg-emerald-500" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">
                                  {approvedDocs.length + (biometricStatus !== 'pending' ? 1 : 0)} of {KYC_DOCUMENTS.length + 1} Verified
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 px-6 rounded-xl shadow-xl shadow-emerald-500/20"
                            onClick={handleFinalApproval}
                          >
                            Approve KYC
                          </Button>
                          <Button variant="outline" className="border-slate-200 text-amber-600 font-black rounded-xl h-12 px-6 hover:bg-amber-50" onClick={() => toast.info("Request Sent", { description: "Additional document request dispatched to user." })}>Request Document</Button>
                          <Button variant="outline" className="border-slate-200 text-red-600 font-black rounded-xl h-12 px-6 hover:bg-red-50" onClick={() => toast.error("Rejection Modal Opened", { description: "Specify grounds for KYC rejection." })}>Reject KYC</Button>
                        </div>
                      </div>

                      {/* 2️⃣ Identity Overview Panel */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Type</p>
                          <p className="text-sm font-black text-slate-900">Corporate License</p>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Registration Country</p>
                          <p className="text-sm font-black text-slate-900 flex items-center gap-2">{selectedUser.countryCode} {selectedUser.country}</p>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">System Risk Level</p>
                          <p className="text-sm font-black text-emerald-600 uppercase">Low Risk Profile</p>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification Source</p>
                          <p className="text-sm font-black text-slate-900">
                            {(() => {
                              const kyc = selectedRegistryUser ? getKycVerificationResult(state, selectedRegistryUser.id) : null;
                              if (!kyc) return "—";
                              if (kyc.source === "ai" && kyc.score) return `AI verified (${kyc.score}%)`;
                              if (kyc.biometricSource === "override") return "Manual override";
                              return "Manual verification";
                            })()}
                          </p>
                        </div>
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Reviewed By</p>
                          <p className="text-sm font-black text-slate-900">
                            {(() => {
                              const logs = selectedRegistryUser ? getVerificationLogForEntity(state, selectedRegistryUser.id, 1) : [];
                              const lastManual = logs.find((e) => e.source === "manual");
                              if (!lastManual) return "—";
                              const d = new Date(lastManual.at);
                              return `${lastManual.actor} • ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
                            })()}
                          </p>
                        </div>
                      </div>

                      {/* 3️⃣ Document Verification Section (CORE) */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-10">
                          <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-emerald-500" /> Mining License Evidence
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {KYC_DOCUMENTS.map((doc) => (
                                <Card key={doc.id} className={`border-slate-100 shadow-none rounded-lg overflow-hidden group transition-all ${approvedDocs.includes(doc.id) ? 'ring-2 ring-emerald-500 bg-emerald-50/10' : 'bg-white'}`}>
                                  <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                                    <span className="text-xs font-black text-slate-900">{doc.name}</span>
                                    <Badge className={`${approvedDocs.includes(doc.id) ? 'bg-emerald-500' : 'bg-slate-200'} text-white font-black text-[8px] uppercase px-2 h-5 tracking-widest`}>
                                      {approvedDocs.includes(doc.id) ? 'Approved' : doc.status}
                                    </Badge>
                                  </div>
                                  <div className="aspect-[4/3] bg-slate-900 relative">
                                    <ImageWithFallback src={doc.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-emerald-900/10">
                                      <Maximize2 className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                  <div className="p-6 bg-white flex gap-2">
                                    <Button 
                                      className={`flex-1 font-black h-10 rounded-xl text-[10px] uppercase transition-all ${approvedDocs.includes(doc.id) ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                      onClick={() => toggleDocApproval(doc.id)}
                                    >
                                      {approvedDocs.includes(doc.id) ? 'Approved' : 'Approve'}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      className="flex-1 text-slate-400 hover:text-red-500 font-black h-10 rounded-xl text-[10px] uppercase"
                                      onClick={() => toast.error("Document Rejected", { description: "Clarification required from user." })}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                              <Upload className="w-4 h-4 text-emerald-500" /> Additional documents from app profile
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500">Documents uploaded by user in the app (including &quot;upload remaining&quot; or other requested docs).</p>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 space-y-3">
                              {ADDITIONAL_DOCUMENTS_FROM_APP.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                  <div>
                                    <p className="text-sm font-black text-slate-900">{doc.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{doc.label} • {doc.uploadDate}</p>
                                  </div>
                                  <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase">{doc.status}</Badge>
                                </div>
                              ))}
                              {ADDITIONAL_DOCUMENTS_FROM_APP.length === 0 && (
                                <p className="text-sm font-bold text-slate-400">No additional documents uploaded yet.</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                              <Fingerprint className="w-4 h-4 text-emerald-500" /> Identity Verification (Liveness)
                            </h4>
                            <Card className={`border-slate-100 shadow-none rounded-lg overflow-hidden transition-all ${biometricStatus !== 'pending' ? 'ring-2 ring-emerald-500' : 'bg-white'}`}>
                              <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="aspect-square bg-slate-900 relative">
                                  <ImageWithFallback src={BIOMETRIC_DATA.img} className="w-full h-full object-cover" />
                                  <div className="absolute top-6 left-6">
                                    <Badge className="bg-emerald-500 text-white font-black text-[10px] uppercase h-7 px-4 shadow-xl">Live Capture</Badge>
                                  </div>
                                </div>
                                <div className="p-10 flex flex-col justify-center space-y-8 bg-slate-50/50">
                                  <div className="grid grid-cols-1 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Face Match Score</p>
                                      <div className="flex items-end gap-2">
                                        <h5 className="text-4xl font-black text-slate-900">{BIOMETRIC_DATA.matchScore}%</h5>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase mb-1.5">Confident Match</span>
                                      </div>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                      <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liveness Check</p>
                                        <p className="text-base font-black text-emerald-600">{biometricStatus === 'verified' ? 'VERIFIED' : biometricStatus === 'overridden' ? 'OVERRIDDEN' : 'PASSED'}</p>
                                      </div>
                                      {biometricStatus !== 'pending' ? <Check className="w-8 h-8 text-emerald-500" /> : <CheckCircle2 className="w-8 h-8 text-slate-200" />}
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button 
                                      className={`flex-1 font-black h-12 rounded-xl text-[10px] uppercase transition-all ${biometricStatus === 'verified' ? 'bg-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-emerald-50'}`}
                                      onClick={() => {
                                        setBiometricStatus('verified');
                                        if (selectedRegistryUser) {
                                          const result = { source: "ai" as const, score: 98, lastVerifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), biometricSource: "ai" as const };
                                          dispatch({ type: "SET_KYC_VERIFICATION", payload: { userId: selectedRegistryUser.id, result } });
                                          dispatch({
                                            type: "RECORD_VERIFICATION",
                                            payload: {
                                              id: `ver-${Date.now()}`,
                                              at: new Date().toISOString(),
                                              source: "ai",
                                              kind: "face_match",
                                              entityId: selectedRegistryUser.id,
                                              entityType: "user",
                                              result: "98",
                                              label: "Face match 98%",
                                              actor: "System AI",
                                            },
                                          });
                                        }
                                        toast.success("Identity Confirmed", { description: "Face match algorithm verified against license." });
                                      }}
                                    >
                                      {biometricStatus === 'verified' ? 'Identity Verified' : 'Verify Match'}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      className={`flex-1 border-slate-200 font-black h-12 rounded-xl text-[10px] uppercase transition-all ${biometricStatus === 'overridden' ? 'bg-amber-500 text-white border-amber-500' : 'text-slate-600 hover:bg-amber-50'}`}
                                      onClick={() => {
                                        setBiometricStatus('overridden');
                                        if (selectedRegistryUser) {
                                          const result = { source: "manual" as const, lastVerifiedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), biometricSource: "override" as const };
                                          dispatch({ type: "SET_KYC_VERIFICATION", payload: { userId: selectedRegistryUser.id, result } });
                                          dispatch({
                                            type: "RECORD_VERIFICATION",
                                            payload: {
                                              id: `ver-${Date.now()}`,
                                              at: new Date().toISOString(),
                                              source: "manual",
                                              kind: "biometric_override",
                                              entityId: selectedRegistryUser.id,
                                              entityType: "user",
                                              result: "override",
                                              label: "Manual override (compliance)",
                                              actor: "Admin",
                                            },
                                          });
                                        }
                                        toast.warning("Manual Override Triggered", { description: "Compliance officer assumed risk for identity match." });
                                      }}
                                    >
                                      Manual Override
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>

                        <div className="lg:col-span-4 space-y-10">
                          <Card className="border-none shadow-sm rounded-lg bg-emerald-600 text-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-6 h-6 text-emerald-300" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Verification Match Index</span>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-sm font-bold">
                                <span className="opacity-80">Document-to-Selfie</span>
                                <span>98.2%</span>
                              </div>
                              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-[98%] h-full bg-white" />
                              </div>
                              <div className="flex items-center gap-2 p-4 bg-white/10 rounded-2xl border border-white/10">
                                <Zap className="w-4 h-4 text-emerald-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Confidence: Institutional High</span>
                              </div>
                            </div>
                          </Card>

                          <div className="p-8 bg-slate-100/50 rounded-lg border border-slate-200/50 space-y-6">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Info className="w-3 h-3" /> Digital Forensic Metadata
                            </h5>
                            <div className="space-y-4">
                              {[
                                { label: "Uploaded Via", value: "Mobile App (iOS)" },
                                { label: "App Version", value: "v2.4.1 (Build 882)" },
                                { label: "Network Node", value: "154.160.XXX.XX (Masked)" },
                                { label: "Authorized Device", value: "iPhone 15 Pro" },
                                { label: "Region / Node", value: "Greater Accra, Ghana" },
                                { label: "Audit Timestamp", value: "Jan 28, 2026 • 09:12 AM" },
                              ].map((meta, i) => (
                                <div key={i} className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">{meta.label}</span>
                                  <span className="text-[10px] font-black text-slate-900 text-right">{meta.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="sticky bottom-10 z-40">
                        <Card className="border-none shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-lg bg-white overflow-hidden ring-4 ring-slate-50">
                          <div className="grid grid-cols-1 lg:grid-cols-12">
                            <div className="lg:col-span-8 p-10 border-r border-slate-50">
                              <div className="flex items-center gap-6 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                  <Scale className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">Dossier Final Action</h4>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Protocol Entry Required</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Decision Reason</Label>
                                  <textarea 
                                    className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium placeholder:text-slate-300 resize-none focus:ring-2 focus:ring-emerald-500" 
                                    placeholder="Specify reasoning..." 
                                    value={decisionReason}
                                    onChange={(e) => setDecisionReason(e.target.value)}
                                  />
                                </div>
                                <div className="space-y-3">
                                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Notes</Label>
                                  <textarea className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium placeholder:text-slate-300 resize-none focus:ring-2 focus:ring-emerald-500" placeholder="Add context..." />
                                </div>
                              </div>
                            </div>
                            <div className="lg:col-span-4 p-10 bg-slate-50 flex flex-col justify-center space-y-6">
                              <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <Checkbox 
                                  id="auth" 
                                  className="rounded-lg border-slate-300 h-6 w-6 data-[state=checked]:bg-emerald-500" 
                                  checked={isAuthorized}
                                  onCheckedChange={(checked) => setIsAuthorized(!!checked)}
                                />
                                <label htmlFor="auth" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer leading-tight">Digital Approval Authorization</label>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Button 
                                  className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                                  onClick={handleFinalApproval}
                                >
                                  Confirm Approval
                                </Button>
                                <Button variant="outline" className="h-14 rounded-2xl border-slate-200 text-red-600 font-black hover:bg-red-50" onClick={() => toast.error("Revocation Triggered", { description: "Compliance team review required for revocation." })}>Revoke / Reject</Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <Card className="border-slate-100 shadow-none rounded-lg bg-white overflow-hidden mt-10">
                        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <AuditIcon className="w-6 h-6 text-slate-400" /> Forensic Verification Registry
                          </CardTitle>
                          <Button variant="ghost" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600" onClick={handleExportLedgerPdf}>Export Ledger PDF <Download className="w-4 h-4 ml-2" /></Button>
                        </CardHeader>
                        <Table>
                          <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-none">
                              <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Sequence</TableHead>
                              <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Action Record</TableHead>
                              <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Acting Officer</TableHead>
                              <TableHead className="text-right px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Timestamp</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(selectedRegistryUser ? getVerificationLogForEntity(state, selectedRegistryUser.id, 15) : []).map((log, i) => (
                              <TableRow key={log.id} className="border-slate-50">
                                <TableCell className="px-8 py-5 font-black text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</TableCell>
                                <TableCell className="py-5 font-black text-xs text-slate-900">{log.label}</TableCell>
                                <TableCell className="py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.actor}</TableCell>
                                <TableCell className="text-right px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{new Date(log.at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
                              </TableRow>
                            ))}
                            {(!selectedRegistryUser || getVerificationLogForEntity(state, selectedRegistryUser.id).length === 0) && (
                              <>
                                {[
                                  { seq: "01", action: "AML Sanction Database Scan Passed", officer: "Refinitiv API", time: "Jan 25, 12:44" },
                                  { seq: "02", action: "Face Match Algorithm Verified (98%)", officer: "System AI", time: "Jan 28, 09:15" },
                                ].map((log, i) => (
                                  <TableRow key={`fallback-${i}`} className="border-slate-50">
                                    <TableCell className="px-8 py-5 font-black text-xs text-slate-400">{log.seq}</TableCell>
                                    <TableCell className="py-5 font-black text-xs text-slate-900">{log.action}</TableCell>
                                    <TableCell className="py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.officer}</TableCell>
                                    <TableCell className="text-right px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.time}</TableCell>
                                  </TableRow>
                                ))}
                              </>
                            )}
                          </TableBody>
                        </Table>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "facilities" && (
                    <motion.div key="facilities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                       <Card className="border-none shadow-sm rounded-lg bg-white p-8">
                          <div className="flex flex-wrap items-center justify-between gap-8">
                             <div className="flex items-center gap-6">
                                <Avatar className="w-16 h-16 rounded-lg border-4 border-slate-50 shadow-sm">
                                   <AvatarImage src={selectedUser.avatar} />
                                   <AvatarFallback className="bg-emerald-500 text-white font-black">{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedUser.name}</h3>
                                   <div className="flex items-center gap-3 mt-1">
                                      <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 h-5">{selectedUser.id}</Badge>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                         <ShieldCheck className="w-3 h-3 text-emerald-500" /> {selectedUser.kycStatus}
                                      </span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-10">
                                <div className="text-center">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">User Role</p>
                                   <p className="text-sm font-black text-slate-900">{selectedUser.role}</p>
                                </div>
                                <div className="text-center border-l border-slate-100 pl-10">
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Country</p>
                                   <p className="text-sm font-black text-slate-900 flex items-center gap-2">{selectedUser.countryCode} {selectedUser.country}</p>
                                </div>
                             </div>
                          </div>
                       </Card>

                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                          <div className="lg:col-span-4 space-y-6">
                             <div className="flex items-center justify-between px-2">
                                <div className="space-y-1">
                                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Facilities</h3>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Address Registry</p>
                                </div>
                                <Button onClick={() => setIsAddFacilityOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 px-6 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                                   <Plus className="w-5 h-5 mr-2" /> Add
                                </Button>
                             </div>

                             <div className="space-y-4">
                                {facilities.map((fac) => (
                                  <Card 
                                    key={fac.id} 
                                    onClick={() => setSelectedFacility(fac)}
                                    className={`cursor-pointer transition-all border-none rounded-lg p-6 ${
                                      displayFacility?.id === fac.id ? 'bg-emerald-600 text-white shadow-md scale-[1.02]' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm'
                                    }`}
                                  >
                                     <div className="space-y-5">
                                        <div className="flex justify-between items-start">
                                           <div className={`p-3 rounded-lg ${displayFacility?.id === fac.id ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                              <MapPin className="w-5 h-5" />
                                           </div>
                                           {fac.isPrimary && <Badge className={`${displayFacility?.id === fac.id ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30'} border-none text-xs font-medium`}>Primary</Badge>}
                                        </div>
                                        <div>
                                           <h4 className="font-semibold text-base leading-tight mb-1">{fac.name}</h4>
                                           <p className={`text-xs ${displayFacility?.id === fac.id ? 'text-white/80' : 'text-muted-foreground'}`}>{fac.city}, {fac.country}</p>
                                        </div>
                                     </div>
                                  </Card>
                                ))}
                             </div>
                          </div>

                          <div className="lg:col-span-8">
                             <Card className="border-none shadow-sm rounded-lg bg-white dark:bg-slate-900 p-6 space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                   <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Facility Details</h3>
                                   <div className="flex items-center gap-2">
                                     {displayFacility && <Badge variant="secondary" className="text-xs">{displayFacility.addedVia}</Badge>}
                                     {displayFacility && (
                                       <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); setFacilityToRemove(displayFacility); }}>
                                         <Trash2 className="w-4 h-4 mr-1" /> Remove
                                       </Button>
                                     )}
                                   </div>
                                </div>
                                {displayFacility ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-6">
                                   {[
                                     { label: "Institutional Entity Name", value: displayFacility.name },
                                     { label: "Street Name & Number", value: displayFacility.street },
                                     { label: "City", value: displayFacility.city },
                                     { label: "State / Region", value: displayFacility.state },
                                     { label: "Postal Code", value: displayFacility.postalCode },
                                     { label: "Country", value: displayFacility.country },
                                     { label: "Contact Phone", value: displayFacility.phone },
                                     { label: "Contact Email", value: displayFacility.email },
                                     { label: "Permit Number", value: displayFacility.permitNumber },
                                   ].map((item, idx) => (
                                     <div key={idx} className="space-y-2">
                                        <p className="text-xs text-muted-foreground">{item.label}</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</p>
                                     </div>
                                   ))}
                                </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">Select a facility from the list or add a new one.</p>
                                )}
                             </Card>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "orders" && (
                    <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                       {orderView === "list" ? (
                         <Card className="border-none shadow-sm rounded-lg bg-white overflow-hidden">
                            <Table>
                               <TableHeader className="bg-slate-50/50">
                                  <TableRow className="border-none">
                                     <TableHead className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Order ID</TableHead>
                                     <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Mineral</TableHead>
                                     <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Quantity</TableHead>
                                     <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Delivery Node</TableHead>
                                     <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Estimate</TableHead>
                                     <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                     <TableHead className="text-right px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                                  </TableRow>
                               </TableHeader>
                               <TableBody>
                                  {[...state.buyOrders, ...state.sellOrders].map((order) => (
                                    <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedOrder(order); setOrderView("detail"); }}>
                                       <TableCell className="px-10 py-6 font-black text-sm text-[emerald-600]">{order.id}</TableCell>
                                       <TableCell className="py-6 font-bold text-slate-900">{order.mineral}</TableCell>
                                       <TableCell className="py-6 font-bold text-slate-500">{order.qty} {order.unit}</TableCell>
                                       <TableCell className="py-6 text-xs font-black text-slate-900">{order.facility.name}</TableCell>
                                       <TableCell className="py-6 font-black text-slate-900">{order.aiEstimatedAmount}</TableCell>
                                       <TableCell className="py-6">
                                          <Badge className={`border-none font-black text-[9px] uppercase px-3 h-6 tracking-widest ${order.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'}`}>{order.status}</Badge>
                                       </TableCell>
                                       <TableCell className="text-right px-10 py-6 text-sm font-black text-slate-400">{order.createdAt}</TableCell>
                                    </TableRow>
                                  ))}
                               </TableBody>
                            </Table>
                         </Card>
                       ) : (
                         <div className="space-y-10">
                            <button onClick={() => setOrderView("list")} className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-500 transition-colors">
                               <ArrowLeft className="w-4 h-4" /> Back to Order Registry
                            </button>
                            <Card className="border-none shadow-sm rounded-lg bg-white p-12 space-y-12">
                               <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                                  <h3 className="text-2xl font-bold text-slate-900">Order #{selectedOrder?.id}</h3>
                                  <Badge className="bg-slate-900 text-white font-black text-[11px] uppercase h-8 px-5 tracking-widest">{selectedOrder?.createdAt}</Badge>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                  <div className="space-y-6">
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral Asset</p>
                                     <p className="text-2xl font-black text-slate-900">{selectedOrder?.mineral}</p>
                                     <p className="text-sm font-bold text-slate-500">{selectedOrder?.description}</p>
                                     <p className="text-2xl font-bold text-slate-900 tracking-tighter">{selectedOrder?.qty} <span className="text-sm font-bold text-slate-400 uppercase">{selectedOrder?.unit}</span></p>
                                  </div>
                                  <div className="bg-slate-50 rounded-lg p-8 space-y-4">
                                     <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">AI Market Estimation</p>
                                     <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedOrder?.aiEstimatedAmount} <span className="text-base text-slate-400 uppercase font-bold">{selectedOrder?.currency}</span></h4>
                                  </div>
                               </div>
                               <div className="pt-10 border-t border-slate-50">
                                  <OrderStepFlow steps={selectedOrder?.flowSteps || []} />
                               </div>

                               {/* Sent to user (transport link, QR/bank details, etc.) — dashboard → app */}
                               {(selectedOrder?.sentToUser && selectedOrder.sentToUser.length > 0) && (
                                 <div className="pt-10 border-t border-slate-50">
                                   <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                     <Link className="w-4 h-4 text-emerald-500" /> Links & details sent to user (via app)
                                   </h4>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     {selectedOrder.sentToUser.map((item, idx) => (
                                       <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
                                         <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                           {item.type === "transport_link" ? <Truck className="w-5 h-5" /> : item.type === "testing_certificate" || item.type === "lab_report" ? <FileCheck className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                         </div>
                                         <div className="min-w-0">
                                           <p className="text-sm font-black text-slate-900">{item.label}</p>
                                           <p className="text-[10px] font-bold text-slate-500 mt-0.5">{item.date} • {item.channel}</p>
                                           {item.detail && <p className="text-xs font-bold text-slate-600 mt-1">{item.detail}</p>}
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}

                               {/* Communication log (dashboard activity) */}
                               <div className="pt-10 border-t border-slate-50">
                                 <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                   <MessageSquare className="w-4 h-4 text-slate-400" /> Activity log
                                 </h4>
                                 <div className="space-y-3 max-h-48 overflow-y-auto">
                                   {selectedOrder?.commLog.map((log, idx) => (
                                     <div key={idx} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                                       <Clock className="w-3.5 h-3.5 text-slate-300 mt-0.5 shrink-0" />
                                       <div>
                                         <p className="text-xs font-black text-slate-900">{log.event}</p>
                                         <p className="text-[10px] font-bold text-slate-400">{log.date} {log.admin !== "System" ? `• ${log.admin}` : ""}</p>
                                         {log.note && <p className="text-[10px] font-bold text-slate-500 mt-0.5">{log.note}</p>}
                                       </div>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                            </Card>
                         </div>
                       )}
                    </motion.div>
                  )}

                  {activeTab === "financial" && (
                    <motion.div key="financial" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                       {/* Payment Methods / Linked Accounts (same as app profile) */}
                       <Card className="border-none shadow-sm rounded-lg bg-white p-8">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Payment Methods</h3>
                          <p className="text-xs text-muted-foreground mb-4">Linked Accounts — synced from app profile. Used for payouts and settlement.</p>
                          <div className="space-y-4">
                             {paymentMethods.map((pm) => (
                               <div key={pm.id} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-slate-500" />
                                     </div>
                                     <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{pm.label}</p>
                                        <p className="text-sm text-muted-foreground">{pm.maskedNumber}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                           {pm.isPrimary && <Badge variant="secondary" className="text-xs">Primary Payout</Badge>}
                                           {pm.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                                           <span className="text-xs text-muted-foreground">Last used: {pm.lastUsed}</span>
                                        </div>
                                     </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600" onClick={() => handleRemovePaymentMethod(pm.id)}>Remove</Button>
                               </div>
                             ))}
                          </div>
                          <p className="text-[10px] font-bold text-slate-500 mt-6 border-t border-slate-100 pt-6">Payments are settlement-linked to blockchain events. Fiat accounts are used only for on/off-ramping. Adding a new method requires 2FA in app.</p>
                       </Card>

                       <Card className="border-none shadow-sm rounded-lg bg-white overflow-hidden">
                          <CardHeader className="p-8 border-b border-slate-50">
                             <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Transaction History</CardTitle>
                             <CardDescription className="text-xs text-muted-foreground">Settlements linked to orders</CardDescription>
                          </CardHeader>
                          <CardContent className="p-0">
                          <Table>
                             <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none">
                                   <TableHead className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Transaction ID</TableHead>
                                   <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Order ID</TableHead>
                                   <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Mineral</TableHead>
                                   <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Final Amount</TableHead>
                                   <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Method</TableHead>
                                   <TableHead className="py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                   <TableHead className="text-right px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Settlement Date</TableHead>
                                </TableRow>
                             </TableHeader>
                             <TableBody>
                                {state.transactions.map((tx) => (
                                  <TableRow key={tx.id} className="border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedTx(tx); setIsTxDrawerOpen(true); }}>
                                     <TableCell className="px-10 py-7 font-black text-sm">{tx.id}</TableCell>
                                     <TableCell className="py-7 font-black text-sm text-[emerald-600]">{tx.orderId}</TableCell>
                                     <TableCell className="py-7 font-bold text-slate-900">{tx.mineral}</TableCell>
                                     <TableCell className="py-7 font-black text-lg text-slate-900">{tx.finalAmount}</TableCell>
                                     <TableCell className="py-7 font-black text-xs text-slate-600 uppercase tracking-widest">{tx.method}</TableCell>
                                     <TableCell className="py-7">
                                        <Badge className={`border-none font-black text-[9px] uppercase px-3 h-6 tracking-widest ${tx.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{tx.status}</Badge>
                                     </TableCell>
                                     <TableCell className="text-right px-10 py-7 text-sm font-black text-slate-400">{tx.date}</TableCell>
                                  </TableRow>
                                ))}
                             </TableBody>
                          </Table>
                          </CardContent>
                       </Card>
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                       <div className="lg:col-span-8 space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <StatCard label="Account Created" value="Jan 12, 2026" />
                             <StatCard label="Last Login" value="Today, 09:12" trend="Success" />
                             <StatCard label="Security Node" value="Enabled" sub={[{ label: "Method", value: "OTP" }]} />
                          </div>
                          <Card className="border-none shadow-sm rounded-lg bg-white overflow-hidden">
                             <Table>
                                <TableHeader className="bg-slate-50/50">
                                   <TableRow className="border-none">
                                      <TableHead className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Execution Date</TableHead>
                                      <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Device</TableHead>
                                      <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Network Node (IP)</TableHead>
                                      <TableHead className="text-right px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                   </TableRow>
                                </TableHeader>
                                <TableBody>
                                   {userDetails.loginActivity.map((log) => (
                                     <TableRow key={log.id} className="border-slate-50">
                                        <TableCell className="px-10 py-5 font-black text-xs text-slate-900">{log.date} • {log.time}</TableCell>
                                        <TableCell className="py-5 font-bold text-xs text-slate-600">{log.device}</TableCell>
                                        <TableCell className="py-5 text-xs font-mono font-bold text-slate-400">{log.ip}</TableCell>
                                        <TableCell className="text-right px-10 py-5">
                                           <StatusBadge status={log.status} variant={log.status === "Success" ? "success" : "error"} className="text-[8px] px-2 h-5" />
                                        </TableCell>
                                     </TableRow>
                                   ))}
                                </TableBody>
                             </Table>
                          </Card>
                       </div>
                       <div className="lg:col-span-4 space-y-8">
                          <Card className="border-none shadow-sm bg-slate-900 text-white p-10 space-y-8 rounded-lg">
                             <h4 className="text-xl font-black tracking-tight border-b border-white/10 pb-6 flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-emerald-400" /> Security Controls</h4>
                             <div className="space-y-4">
                                <Button className="w-full h-16 rounded-lg font-black bg-white/5 text-white hover:bg-white/10 border border-white/10" onClick={handleForceLogout}>Force Global Logout</Button>
                                <Button className="w-full h-16 rounded-lg font-black bg-emerald-600 text-white hover:bg-emerald-600" onClick={handleRestrictTransactional} disabled={transactionalRestricted}>{transactionalRestricted ? "Transactional access restricted" : "Restrict Transactional Access"}</Button>
                                <Button variant="ghost" className="w-full h-16 rounded-lg font-black text-red-400 hover:bg-red-500/10" onClick={handleFlagForensic} disabled={forensicFlagged}>{forensicFlagged ? "Flagged for audit" : "Flag for Forensic Audit"}</Button>
                             </div>
                          </Card>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === "videochat" && (
                    <motion.div key="videochat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <Card className="border-none shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                          <div>
                            <h4 className="text-base font-semibold text-slate-900 dark:text-white">Video call / chat</h4>
                            <p className="text-sm text-muted-foreground mt-1">Links sent to this user (WhatsApp, Google Meet, Zoom, etc.). Sent via app notification or email. All videos are recorded in their user data.</p>
                          </div>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2" onClick={() => setVideoCallDialogOpen(true)}>
                            <Video className="w-4 h-4" />
                            Send video call link
                          </Button>
                        </div>
                        {(userDetails.videoCalls?.length ?? 0) === 0 ? (
                          <div className="py-12 text-center rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <Video className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                            <p className="text-sm text-muted-foreground mb-2">No video calls recorded for this user yet.</p>
                            <p className="text-xs text-muted-foreground mb-4">Send a link via app notification or email to start.</p>
                            <Button size="sm" variant="outline" onClick={() => setVideoCallDialogOpen(true)}>Send video call link</Button>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs font-medium text-muted-foreground">Platform</TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground">Link</TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground">Sent via</TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground">Recording</TableHead>
                                <TableHead className="text-xs font-medium text-muted-foreground">Note</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(userDetails.videoCalls ?? []).map((vc) => (
                                <TableRow key={vc.id}>
                                  <TableCell><Badge variant="outline" className="text-xs">{vc.platform}</Badge></TableCell>
                                  <TableCell className="max-w-[200px]">
                                    <a href={vc.link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate block">{vc.link}</a>
                                  </TableCell>
                                  <TableCell className="text-xs">{vc.sentVia === "app" ? "App notification" : "Email"}</TableCell>
                                  <TableCell className="text-xs text-muted-foreground">{vc.sentAt}</TableCell>
                                  <TableCell className="text-xs">
                                    {vc.recordingUrl ? (
                                      <a href={vc.recordingUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">View recording</a>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-xs text-muted-foreground max-w-[180px]">{vc.note ?? "—"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "notes" && (
                    <motion.div key="notes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                       <div className="w-full max-w-[800px] mx-auto space-y-8">
                          {selectedEvent ? (
                            /* Chat history / event detail page */
                            <div className="space-y-6">
                              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-600 -ml-2 gap-2" onClick={() => setSelectedEvent(null)}>
                                <ArrowLeft className="w-4 h-4" />
                                Back to activity
                              </Button>
                              <Card className="border-none shadow-sm rounded-lg bg-white p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-40" />
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                  <Badge className={`font-black text-[8px] uppercase tracking-[0.2em] px-3 h-6 border-none ${selectedEvent.type === "Admin" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"}`}>{selectedEvent.type}</Badge>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><Clock className="w-3 h-3" /> {selectedEvent.date} • {selectedEvent.time}</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{selectedEvent.title}</h2>
                                <p className="text-sm font-bold text-slate-500 leading-relaxed italic mb-6">"{selectedEvent.description}"</p>
                                <p className="text-xs text-muted-foreground mb-6">Source: {selectedEvent.source}</p>
                                {selectedEvent.metadata?.fullDetails && (
                                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 mb-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full details</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedEvent.metadata.fullDetails}</p>
                                  </div>
                                )}
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Chat history / internal notes</h4>
                                  {(selectedEvent.notes?.length ?? 0) === 0 ? (
                                    <p className="text-sm text-muted-foreground">No internal notes for this event.</p>
                                  ) : (
                                    <div className="space-y-4">
                                      {selectedEvent.notes!.map((n, i) => (
                                        <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
                                          <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{n.admin}</span>
                                            <span className="text-xs text-muted-foreground">{n.timestamp}</span>
                                          </div>
                                          <p className="text-sm text-slate-600 dark:text-slate-400">{n.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </div>
                          ) : (
                          userDetails.activityLog.map((event) => (
                            <Card
                              key={event.id}
                              role="button"
                              tabIndex={0}
                              className="border-none shadow-sm rounded-lg bg-white p-8 relative overflow-hidden group cursor-pointer hover:ring-2 hover:ring-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-shadow"
                              onClick={() => setSelectedEvent(event)}
                              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedEvent(event); } }}
                            >
                               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-40" />
                               <div className="flex items-center justify-between mb-6">
                                  <Badge className={`font-black text-[8px] uppercase tracking-[0.2em] px-3 h-6 border-none ${event.type === 'Admin' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{event.type}</Badge>
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><Clock className="w-3 h-3" /> {event.date} • {event.time}</span>
                               </div>
                               <div className="space-y-2">
                                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{event.title}</h4>
                                  <p className="text-sm font-bold text-slate-500 leading-relaxed italic">“{event.description}”</p>
                               </div>
                               <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Source: {event.source}</span>
                                  <Button variant="ghost" className="h-8 px-4 text-[9px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>Details <ChevronRight className="w-3 h-3 ml-1" /></Button>
                               </div>
                            </Card>
                          )))}
                       </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={isTxDrawerOpen} onOpenChange={setIsTxDrawerOpen}>
         <SheetContent className="sm:max-w-[800px] border-none shadow-sm p-0 bg-white">
            {selectedTx && (
               <div className="h-full flex flex-col">
                  <div className="bg-slate-900 p-12 text-white">
                     <SheetHeader className="space-y-4">
                        <div className="flex items-center justify-between">
                           <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] uppercase h-7 px-4 tracking-widest">Financial Audit</Badge>
                           <SheetClose className="text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></SheetClose>
                        </div>
                        <SheetTitle className="text-4xl font-black text-white tracking-tight leading-none">Settlement Details</SheetTitle>
                        <SheetDescription className="text-emerald-400 font-bold uppercase text-[11px] tracking-[0.2em]">{selectedTx.id} • Linked to {selectedTx.orderId}</SheetDescription>
                     </SheetHeader>
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
                           <p className="text-lg font-black text-slate-900">{selectedTx.orderType} Settlement</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                           <StatusBadge status={selectedTx.status} />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Financial Breakdown</p>
                        <Card className="border-none bg-slate-50 rounded-lg p-8 space-y-6">
                           <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase">AI Estimate</span><span className="text-sm font-black text-slate-600">{selectedTx.aiEstimate}</span></div>
                           <div className="flex justify-between items-center pt-6 border-t border-slate-200/50"><span className="text-xs font-black text-slate-400 uppercase">Final Confirmed</span><span className="text-xl font-black text-slate-900">{selectedTx.finalAmount}</span></div>
                           <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-400 uppercase">Service Fee</span><span className="text-sm font-black text-red-500">-{selectedTx.serviceFee}</span></div>
                           <div className="flex justify-between items-center pt-6 border-t-2 border-slate-900/10"><span className="text-xs font-black text-slate-900 uppercase">Net Settlement</span><span className="text-2xl font-black text-emerald-600">{selectedTx.netAmount} <span className="text-xs text-slate-400 uppercase font-black">{selectedTx.currency}</span></span></div>
                        </Card>
                     </div>
                     {selectedTx.paymentDetails && (selectedTx.paymentDetails.accountName || selectedTx.paymentDetails.bankName || selectedTx.paymentDetails.maskedAccount || selectedTx.paymentDetails.reference || selectedTx.paymentDetails.network || selectedTx.paymentDetails.hash) && (
                       <div className="space-y-6">
                         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Payment details</p>
                         <Card className="border-none bg-slate-50 rounded-lg p-8 space-y-4">
                           {selectedTx.paymentDetails.accountName && <div className="flex justify-between"><span className="text-xs font-black text-slate-400 uppercase">Account name</span><span className="text-sm font-black text-slate-900">{selectedTx.paymentDetails.accountName}</span></div>}
                           {selectedTx.paymentDetails.bankName && <div className="flex justify-between"><span className="text-xs font-black text-slate-400 uppercase">Bank</span><span className="text-sm font-black text-slate-900">{selectedTx.paymentDetails.bankName}</span></div>}
                           {selectedTx.paymentDetails.maskedAccount && <div className="flex justify-between"><span className="text-xs font-black text-slate-400 uppercase">Account</span><span className="text-sm font-mono font-black text-slate-900">{selectedTx.paymentDetails.maskedAccount}</span></div>}
                           {selectedTx.paymentDetails.reference && <div className="flex justify-between"><span className="text-xs font-black text-slate-400 uppercase">Reference</span><span className="text-sm font-mono font-black text-slate-900">{selectedTx.paymentDetails.reference}</span></div>}
                           {selectedTx.paymentDetails.network && <div className="flex justify-between"><span className="text-xs font-black text-slate-400 uppercase">Network</span><span className="text-sm font-black text-slate-900">{selectedTx.paymentDetails.network}</span></div>}
                           {selectedTx.paymentDetails.hash && <div className="flex justify-between gap-4"><span className="text-xs font-black text-slate-400 uppercase shrink-0">Tx hash</span><span className="text-xs font-mono font-bold text-slate-600 break-all text-right">{selectedTx.paymentDetails.hash}</span></div>}
                         </Card>
                       </div>
                     )}
                  </div>
               </div>
            )}
         </SheetContent>
      </Sheet>

      <Dialog open={isAddFacilityOpen} onOpenChange={setIsAddFacilityOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register facility</DialogTitle>
            <DialogDescription>Add a new institutional address. This will sync to the user&apos;s app profile.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fac-name">Institutional entity name</Label>
              <Input id="fac-name" value={newFacility.name} onChange={(e) => setNewFacility((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Alpha Mining Ltd." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fac-street">Street name and number</Label>
              <Input id="fac-street" value={newFacility.street} onChange={(e) => setNewFacility((f) => ({ ...f, street: e.target.value }))} placeholder="Enter street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fac-city">City</Label>
                <Input id="fac-city" value={newFacility.city} onChange={(e) => setNewFacility((f) => ({ ...f, city: e.target.value }))} placeholder="City" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fac-state">State / Region</Label>
                <Input id="fac-state" value={newFacility.state} onChange={(e) => setNewFacility((f) => ({ ...f, state: e.target.value }))} placeholder="State" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fac-zip">Postal code</Label>
                <Input id="fac-zip" value={newFacility.postalCode} onChange={(e) => setNewFacility((f) => ({ ...f, postalCode: e.target.value }))} placeholder="e.g. 8001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fac-country">Country</Label>
                <Input id="fac-country" value={newFacility.country} onChange={(e) => setNewFacility((f) => ({ ...f, country: e.target.value }))} placeholder="Country" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fac-phone">Contact phone</Label>
              <Input id="fac-phone" value={newFacility.phone} onChange={(e) => setNewFacility((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fac-email">Contact email</Label>
              <Input id="fac-email" type="email" value={newFacility.email} onChange={(e) => setNewFacility((f) => ({ ...f, email: e.target.value }))} placeholder="logistics@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fac-permit">Permit / license number</Label>
              <Input id="fac-permit" value={newFacility.permitNumber} onChange={(e) => setNewFacility((f) => ({ ...f, permitNumber: e.target.value }))} placeholder="Optional" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFacilityOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFacility} className="bg-emerald-600 hover:bg-emerald-700">Register facility</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={videoCallDialogOpen} onOpenChange={(open) => { setVideoCallDialogOpen(open); if (!open) { setVideoCallLink(""); setVideoCallNote(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send video call link</DialogTitle>
            <DialogDescription>Send a WhatsApp, Google Meet, Zoom or other link to this user. Delivered via app notification or email. Recorded in their user data.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Platform</Label>
              <Select value={videoCallPlatform} onValueChange={(v) => setVideoCallPlatform(v as VideoCallEntry["platform"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vc-link">Link (meeting or chat URL) *</Label>
              <Input id="vc-link" value={videoCallLink} onChange={(e) => setVideoCallLink(e.target.value)} placeholder="https://meet.google.com/... or https://wa.me/..." />
            </div>
            <div className="grid gap-2">
              <Label>Send via</Label>
              <Select value={videoCallSentVia} onValueChange={(v) => setVideoCallSentVia(v as "app" | "email")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App notification</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vc-note">Note (optional)</Label>
              <Input id="vc-note" value={videoCallNote} onChange={(e) => setVideoCallNote(e.target.value)} placeholder="e.g. KYC verification call" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoCallDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendVideoCallLink} className="bg-emerald-600 hover:bg-emerald-700">Send link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={docRequestDialogOpen} onOpenChange={(open) => { setDocRequestDialogOpen(open); if (!open) setDocRequestMessage(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send document request</DialogTitle>
            <DialogDescription>Request a document from this artisanal user after they enter the homepage. You send the request to the user via the app (they receive it in the app) or by email. The request is recorded in the dashboard.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Document type</Label>
              <Select value={docRequestType} onValueChange={(v) => setDocRequestType(v as ArtisanalDocumentRequest["documentType"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mining License">Mining License</SelectItem>
                  <SelectItem value="ASM Verification Bundle">ASM Verification Bundle</SelectItem>
                  <SelectItem value="Certified PPE Kit Receipt">Certified PPE Kit Receipt</SelectItem>
                  <SelectItem value="Equipment Receipt (Drill/Pump)">Equipment Receipt (Drill/Pump)</SelectItem>
                  <SelectItem value="Incident Report / Evidence">Incident Report / Evidence</SelectItem>
                  <SelectItem value="Safety Compliance Document">Safety Compliance Document</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="docreq-message">Message to user (optional)</Label>
              <Textarea id="docreq-message" value={docRequestMessage} onChange={(e) => setDocRequestMessage(e.target.value)} placeholder="e.g. Please upload a photo of your mining license." rows={3} className="resize-none" />
            </div>
            <div className="grid gap-2">
              <Label>Send via</Label>
              <Select value={docRequestSentVia} onValueChange={(v) => setDocRequestSentVia(v as "app" | "email")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App notification (user receives in app)</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocRequestDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSendDocumentRequest} className="bg-emerald-600 hover:bg-emerald-700">Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isManualRegistrationOpen} onOpenChange={setIsManualRegistrationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual Registration</DialogTitle>
            <DialogDescription>Add a new user to the registry. They will appear in the User Management table with status Under Review.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reg-name">Full name *</Label>
              <Input id="reg-name" value={newUser.name} onChange={(e) => setNewUser((u) => ({ ...u, name: e.target.value }))} placeholder="e.g. Jane Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-email">Email *</Label>
              <Input id="reg-email" type="email" value={newUser.email} onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))} placeholder="jane@company.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-phone">Phone</Label>
              <Input id="reg-phone" value={newUser.phone} onChange={(e) => setNewUser((u) => ({ ...u, phone: e.target.value }))} placeholder="+1 234 567 8900" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-role">Role</Label>
              <Select value={newUser.role} onValueChange={(v) => setNewUser((u) => ({ ...u, role: v }))}>
                <SelectTrigger id="reg-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seller / License Holder">Seller / License Holder</SelectItem>
                  <SelectItem value="Large-Scale Buyer">Large-Scale Buyer</SelectItem>
                  <SelectItem value="Corporate Seller">Corporate Seller</SelectItem>
                  <SelectItem value="Mining Operator">Mining Operator</SelectItem>
                  <SelectItem value="Institutional Buyer">Institutional Buyer</SelectItem>
                  <SelectItem value="Artisanal Collector">Artisanal Collector</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reg-country">Country</Label>
              <Input id="reg-country" value={newUser.country} onChange={(e) => setNewUser((u) => ({ ...u, country: e.target.value }))} placeholder="e.g. Ghana" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualRegistrationOpen(false)}>Cancel</Button>
            <Button onClick={handleManualRegistration} className="bg-emerald-600 hover:bg-emerald-700">Add to registry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedEvent && activeTab !== "notes"} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">Source: {selectedEvent.source} • {selectedEvent.date} {selectedEvent.time}</p>
              {selectedEvent.metadata?.fullDetails && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">{selectedEvent.metadata.fullDetails}</div>
              )}
              {selectedEvent.notes?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Internal notes</p>
                  {selectedEvent.notes.map((n, i) => (
                    <div key={i} className="rounded-lg border p-3 text-sm">
                      <span className="font-medium">{n.admin}</span> • <span className="text-muted-foreground">{n.timestamp}</span>
                      <p className="mt-1">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={restrictDialogOpen} onOpenChange={setRestrictDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Restrict account</AlertDialogTitle>
          <AlertDialogDescription>
            This will limit {selectedUser.name}’s access until an admin review. They will see a restricted state in the app. Continue?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestrictAccount} className="bg-amber-600 hover:bg-amber-700">Restrict</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Suspend user</AlertDialogTitle>
          <AlertDialogDescription>
            This will suspend {selectedUser.name}. They will not be able to place orders or access full features until reinstated. Continue?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuspendUser} className="bg-red-600 hover:bg-red-700">Suspend</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!facilityToRemove} onOpenChange={(open) => !open && setFacilityToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Remove facility</AlertDialogTitle>
          <AlertDialogDescription>
            Remove {facilityToRemove?.name} from the registry? This will sync to the app.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (facilityToRemove) {
                  dispatch({ type: "REMOVE_FACILITY", payload: facilityToRemove.id });
                  if (selectedFacility?.id === facilityToRemove.id) setSelectedFacility(null);
                  toast.success("Facility removed", { description: facilityToRemove.name });
                  setFacilityToRemove(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
