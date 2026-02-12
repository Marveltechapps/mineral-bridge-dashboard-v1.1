import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Search,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  UserPlus,
  MoreVertical,
  Clock,
  TrendingUp,
  ArrowRightLeft,
  FileCheck,
  Loader2,
  CheckCircle,
  User,
  Phone,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { EnquiryDetailsPanel } from "./EnquiryDetailsPanel";
import { ExchangeComparisonCard } from "./ExchangeComparisonCard";
import { EnquiryStageTracker } from "./EnquiryStageTracker";
import { CreateEnquiryDialog } from "./CreateEnquiryDialog";
import { ImageWithFallback } from "../figma/ImageWithFallback";

// Enquiry stages in order
export const ENQUIRY_STAGES = [
  "Initial",
  "Negotiation",
  "Offer",
  "Payment",
  "Completed",
] as const;

export type EnquiryStage = typeof ENQUIRY_STAGES[number];

export const ENQUIRY_STATUSES = [
  "Pending",
  "Negotiating",
  "Accepted",
  "Rejected",
  "Completed",
  "Cancelled",
] as const;

export type EnquiryStatus = typeof ENQUIRY_STATUSES[number];

export interface Enquiry {
  id: string;
  type: "buy" | "sell" | "exchange";
  propertyName: string;
  propertyImage?: string;
  propertyType?: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  assignedAgent?: {
    name: string;
    id: string;
    avatar?: string;
  };
  stage: EnquiryStage;
  status: EnquiryStatus;
  lastUpdated: string;
  value: string;
  location: string;
  // Exchange specific
  propertyA?: any;
  propertyB?: any;
  valuationMatch?: number;
  // Enquiry details
  buyerInfo?: any;
  sellerInfo?: any;
  propertyDetails?: any;
  timeline?: any[];
  offers?: any[];
  documents?: any[];
  paymentStatus?: string;
}

// Mock data - all enquiries from consumers
const mockEnquiries: Enquiry[] = [
  {
    id: "E001",
    type: "buy",
    propertyName: "Skyline Towers - Unit 402",
    propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    propertyType: "Apartment",
    buyerName: "Rajesh Kumar",
    buyerEmail: "rajesh.kumar@email.com",
    buyerPhone: "+91 98765 43210",
    sellerName: "Property Owner - Skyline Towers",
    sellerEmail: "owner.skyline@email.com",
    sellerPhone: "+91 98765 11111",
    assignedAgent: {
      name: "Sarah Mitchell",
      id: "A001",
    },
    stage: "Negotiation",
    status: "Negotiating",
    lastUpdated: "2024-11-05",
    value: "₹85 Lakh",
    location: "Chennai, Tamil Nadu",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E002",
    type: "sell",
    propertyName: "Green Valley Villa",
    propertyImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    propertyType: "Villa",
    sellerName: "Priya Sharma",
    sellerEmail: "priya.sharma@email.com",
    sellerPhone: "+91 98765 43211",
    assignedAgent: {
      name: "John Davis",
      id: "A002",
    },
    stage: "Offer",
    status: "Accepted",
    lastUpdated: "2024-11-04",
    value: "₹1.2 Cr",
    location: "Bangalore, Karnataka",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E003",
    type: "buy",
    propertyName: "Marina Bay Apartment",
    propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    propertyType: "Apartment",
    buyerName: "Ahmed Al-Rashid",
    buyerEmail: "ahmed.alrashid@email.com",
    buyerPhone: "+971 50 123 4567",
    sellerName: "Marina Bay Developer",
    sellerEmail: "info@marinabay.ae",
    sellerPhone: "+971 50 111 1111",
    assignedAgent: {
      name: "Lisa Anderson",
      id: "A003",
    },
    stage: "Payment",
    status: "Pending",
    lastUpdated: "2024-11-06",
    value: "AED 2.5M",
    location: "Dubai, UAE",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E004",
    type: "sell",
    propertyName: "Tech Park Office Space",
    propertyImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    propertyType: "Commercial",
    sellerName: "TechCorp Industries",
    sellerEmail: "realestate@techcorp.com",
    sellerPhone: "+91 98765 43212",
    stage: "Initial",
    status: "Pending",
    lastUpdated: "2024-11-02",
    value: "₹3.5 Cr",
    location: "Hyderabad, Telangana",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E005",
    type: "buy",
    propertyName: "Riverside Penthouse",
    propertyImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    propertyType: "Apartment",
    buyerName: "Sanya Malhotra",
    buyerEmail: "sanya.malhotra@email.com",
    buyerPhone: "+91 98765 43213",
    sellerName: "Riverside Residency",
    sellerEmail: "sales@riverside.com",
    sellerPhone: "+91 98765 22222",
    assignedAgent: {
      name: "David Kumar",
      id: "A005",
    },
    stage: "Completed",
    status: "Completed",
    lastUpdated: "2024-10-28",
    value: "₹2.8 Cr",
    location: "Pune, Maharashtra",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E006",
    type: "buy",
    propertyName: "Lakeside Plot - 500 sqyd",
    propertyType: "Plot",
    buyerName: "Vikram Mehta",
    buyerEmail: "vikram.mehta@email.com",
    buyerPhone: "+91 98765 43214",
    sellerName: "Lakeside Developers",
    sellerEmail: "info@lakeside.com",
    sellerPhone: "+91 98765 33333",
    assignedAgent: {
      name: "Sarah Mitchell",
      id: "A001",
    },
    stage: "Initial",
    status: "Pending",
    lastUpdated: "2024-11-06",
    value: "₹45 Lakh",
    location: "Chennai, Tamil Nadu",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E007",
    type: "sell",
    propertyName: "Heritage Bungalow",
    propertyImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
    propertyType: "Villa",
    sellerName: "Amit Patel",
    sellerEmail: "amit.patel@email.com",
    sellerPhone: "+91 98765 43215",
    assignedAgent: {
      name: "Emma Wilson",
      id: "A004",
    },
    stage: "Negotiation",
    status: "Negotiating",
    lastUpdated: "2024-11-05",
    value: "₹2.5 Cr",
    location: "Mumbai, Maharashtra",
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E008",
    type: "exchange",
    propertyName: "Exchange: Downtown Loft ↔ Suburban Villa",
    buyerName: "Michael Chen",
    buyerEmail: "michael.chen@email.com",
    buyerPhone: "+91 98765 43216",
    sellerName: "Robert Taylor",
    sellerEmail: "robert.taylor@email.com",
    sellerPhone: "+91 98765 43217",
    assignedAgent: {
      name: "Emma Wilson",
      id: "A004",
    },
    stage: "Negotiation",
    status: "Negotiating",
    lastUpdated: "2024-11-03",
    value: "₹95 Lakh ↔ ₹98 Lakh",
    location: "Mumbai, Maharashtra",
    valuationMatch: 97,
    propertyA: {
      name: "Downtown Loft",
      value: "₹95 Lakh",
      location: "Mumbai Central",
    },
    propertyB: {
      name: "Suburban Villa",
      value: "₹98 Lakh",
      location: "Thane West",
    },
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E009",
    type: "exchange",
    propertyName: "Exchange: Beachfront Apartment ↔ City Center Penthouse",
    buyerName: "Ananya Iyer",
    buyerEmail: "ananya.iyer@email.com",
    buyerPhone: "+91 98765 43218",
    sellerName: "Karthik Reddy",
    sellerEmail: "karthik.reddy@email.com",
    sellerPhone: "+91 98765 43219",
    assignedAgent: {
      name: "Sarah Mitchell",
      id: "A001",
    },
    stage: "Offer",
    status: "Accepted",
    lastUpdated: "2024-11-07",
    value: "₹1.5 Cr ↔ ₹1.45 Cr",
    location: "Chennai, Tamil Nadu",
    valuationMatch: 96,
    propertyA: {
      name: "Beachfront Apartment",
      value: "₹1.5 Cr",
      location: "ECR, Chennai",
    },
    propertyB: {
      name: "City Center Penthouse",
      value: "₹1.45 Cr",
      location: "T. Nagar, Chennai",
    },
    timeline: [],
    offers: [],
    documents: [],
  },
  {
    id: "E010",
    type: "exchange",
    propertyName: "Exchange: Commercial Plot ↔ Residential Plot",
    buyerName: "Suresh Agarwal",
    buyerEmail: "suresh.agarwal@email.com",
    buyerPhone: "+91 98765 43220",
    sellerName: "Meena Desai",
    sellerEmail: "meena.desai@email.com",
    sellerPhone: "+91 98765 43221",
    assignedAgent: {
      name: "John Davis",
      id: "A002",
    },
    stage: "Initial",
    status: "Pending",
    lastUpdated: "2024-11-08",
    value: "₹65 Lakh ↔ ₹60 Lakh",
    location: "Pune, Maharashtra",
    valuationMatch: 92,
    propertyA: {
      name: "Commercial Plot",
      value: "₹65 Lakh",
      location: "Hinjewadi, Pune",
    },
    propertyB: {
      name: "Residential Plot",
      value: "₹60 Lakh",
      location: "Wakad, Pune",
    },
    timeline: [],
    offers: [],
    documents: [],
  },
];

const mockAgents = [
  { id: "A001", name: "Sarah Mitchell" },
  { id: "A002", name: "John Davis" },
  { id: "A003", name: "Lisa Anderson" },
  { id: "A004", name: "Emma Wilson" },
  { id: "A005", name: "David Kumar" },
];

export function EnquiriesManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "exchange">("buy");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [createEnquiryDialogOpen, setCreateEnquiryDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: EnquiryStatus) => {
    const variants = {
      Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      Negotiating: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return variants[status];
  };

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailsPanelOpen(true);
  };

  const handleApproveEnquiry = (enquiry: Enquiry) => {
    setIsLoading(true);
    setTimeout(() => {
      setEnquiries(
        enquiries.map((e) =>
          e.id === enquiry.id
            ? { ...e, status: "Accepted", stage: "Payment" }
            : e
        )
      );
      toast.success(`Enquiry ${enquiry.id} approved successfully`);
      setIsLoading(false);
    }, 1000);
  };

  const handleRejectEnquiry = (enquiry: Enquiry) => {
    setIsLoading(true);
    setTimeout(() => {
      setEnquiries(
        enquiries.map((e) =>
          e.id === enquiry.id ? { ...e, status: "Rejected" } : e
        )
      );
      toast.error(`Enquiry ${enquiry.id} has been rejected`);
      setIsLoading(false);
    }, 1000);
  };

  const handleAssignAgent = (enquiryId: string, agentId: string) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    if (agent) {
      setEnquiries(
        enquiries.map((e) =>
          e.id === enquiryId
            ? { ...e, assignedAgent: { ...agent, avatar: undefined } }
            : e
        )
      );
      toast.success(`Agent ${agent.name} assigned successfully`);
    }
  };

  const handleCreateEnquiry = (newEnquiry: Enquiry) => {
    setEnquiries([newEnquiry, ...enquiries]);
  };

  const handleStageUpdate = (enquiryId: string, newStage: EnquiryStage) => {
    setEnquiries(
      enquiries.map((e) =>
        e.id === enquiryId ? { ...e, stage: newStage } : e
      )
    );
    // Update the selected enquiry if it's the one being updated
    if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
      setSelectedEnquiry({ ...selectedEnquiry, stage: newStage });
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesTab = enquiry.type === activeTab;
    const matchesSearch =
      enquiry.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter;
    const matchesAgent =
      agentFilter === "all" || enquiry.assignedAgent?.id === agentFilter;

    return matchesTab && matchesSearch && matchesStatus && matchesAgent;
  });

  const buyEnquiries = enquiries.filter((e) => e.type === "buy");
  const sellEnquiries = enquiries.filter((e) => e.type === "sell");
  const exchangeEnquiries = enquiries.filter((e) => e.type === "exchange");

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <FileCheck className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl mb-2">No {activeTab} enquiries yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {activeTab === "buy"
          ? "Start by creating a new buy enquiry or wait for incoming buyer enquiries from consumers."
          : activeTab === "sell"
          ? "Seller enquiries from consumers will appear here."
          : "Exchange enquiries will appear here when property swap requests are initiated by consumers."}
      </p>
      <Button className="gap-2" onClick={() => setCreateEnquiryDialogOpen(true)}>
        <TrendingUp className="h-4 w-4" />
        Create New Enquiry
      </Button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">Loading enquiries...</p>
    </div>
  );

  const renderEnquiryTable = () => (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Enquiry ID</TableHead>
            <TableHead>Property Details</TableHead>
            {activeTab === "exchange" && <TableHead>Exchange Property Wanted</TableHead>}
            <TableHead>Consumer Info</TableHead>
            <TableHead>Assigned Agent</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnquiries.map((enquiry) => (
            <TableRow key={enquiry.id} className="hover:bg-muted/20">
              <TableCell>
                <span className="font-mono text-sm font-medium">{enquiry.id}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {enquiry.propertyImage && (
                    <ImageWithFallback
                      src={enquiry.propertyImage}
                      alt={enquiry.propertyName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    {activeTab === "exchange" && enquiry.propertyA ? (
                      <>
                        <p className="font-medium">{enquiry.propertyA.name}</p>
                        <p className="text-xs text-muted-foreground">{enquiry.propertyA.location}</p>
                        <p className="text-xs text-muted-foreground">{enquiry.propertyA.value}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">{enquiry.propertyName}</p>
                        <p className="text-xs text-muted-foreground">{enquiry.location}</p>
                        <p className="text-xs text-muted-foreground">
                          {enquiry.propertyType && `${enquiry.propertyType} • `}{enquiry.value}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
              {activeTab === "exchange" && (
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20">
                      <ArrowRightLeft className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      {enquiry.propertyB ? (
                        <>
                          <p className="font-medium">{enquiry.propertyB.name}</p>
                          <p className="text-xs text-muted-foreground">{enquiry.propertyB.location}</p>
                          <p className="text-xs text-muted-foreground">{enquiry.propertyB.value}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not specified</p>
                      )}
                    </div>
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="space-y-1">
                  {activeTab === "buy" ? (
                    <>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{enquiry.buyerName}</span>
                      </div>
                      {enquiry.buyerEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{enquiry.buyerEmail}</span>
                        </div>
                      )}
                      {enquiry.buyerPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{enquiry.buyerPhone}</span>
                        </div>
                      )}
                    </>
                  ) : activeTab === "sell" ? (
                    <>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{enquiry.sellerName}</span>
                      </div>
                      {enquiry.sellerEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{enquiry.sellerEmail}</span>
                        </div>
                      )}
                      {enquiry.sellerPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{enquiry.sellerPhone}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // Exchange - show both parties
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{enquiry.buyerName}</span>
                        </div>
                        {enquiry.buyerPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{enquiry.buyerPhone}</span>
                          </div>
                        )}
                      </div>
                      <div className="h-px bg-border" />
                      <div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{enquiry.sellerName}</span>
                        </div>
                        {enquiry.sellerPhone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{enquiry.sellerPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {enquiry.assignedAgent ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      {enquiry.assignedAgent.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm">{enquiry.assignedAgent.name}</span>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 h-8"
                      >
                        <UserPlus className="h-3 w-3" />
                        Assign
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {mockAgents.map((agent) => (
                        <DropdownMenuItem
                          key={agent.id}
                          onClick={() => handleAssignAgent(enquiry.id, agent.id)}
                        >
                          {agent.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
              <TableCell>
                <EnquiryStageTracker currentStage={enquiry.stage} compact />
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadge(enquiry.status)}>{enquiry.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(enquiry.lastUpdated).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewEnquiry(enquiry)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {enquiry.status !== "Completed" && enquiry.status !== "Rejected" && (
                      <>
                        <DropdownMenuItem onClick={() => handleApproveEnquiry(enquiry)}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRejectEnquiry(enquiry)}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Consumer Enquiries</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all property enquiries received from consumers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2" onClick={() => setCreateEnquiryDialogOpen(true)}>
            <TrendingUp className="h-4 w-4" />
            Create Enquiry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Buy Enquiries</p>
                <p className="text-2xl">{buyEnquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 rotate-180" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sell Enquiries</p>
                <p className="text-2xl">{sellEnquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <ArrowRightLeft className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exchange Enquiries</p>
                <p className="text-2xl">{exchangeEnquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl">
                  {enquiries.filter((e) => e.status === "Completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by enquiry ID, property, consumer name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Negotiating">Negotiating</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {mockAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3 max-w-md h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="buy" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            Buy Enquiries
          </TabsTrigger>
          <TabsTrigger value="sell" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="h-4 w-4 rotate-180" />
            Sell Enquiries
          </TabsTrigger>
          <TabsTrigger value="exchange" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <ArrowRightLeft className="h-4 w-4" />
            Exchange Enquiries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="mt-6">
          {isLoading ? renderLoadingState() : filteredEnquiries.length > 0 ? renderEnquiryTable() : renderEmptyState()}
        </TabsContent>

        <TabsContent value="sell" className="mt-6">
          {isLoading ? renderLoadingState() : filteredEnquiries.length > 0 ? renderEnquiryTable() : renderEmptyState()}
        </TabsContent>

        <TabsContent value="exchange" className="mt-6">
          {isLoading ? renderLoadingState() : filteredEnquiries.length > 0 ? renderEnquiryTable() : renderEmptyState()}
        </TabsContent>
      </Tabs>

      {/* Enquiry Details Panel */}
      <EnquiryDetailsPanel
        enquiry={selectedEnquiry}
        open={detailsPanelOpen}
        onClose={() => {
          setDetailsPanelOpen(false);
          setSelectedEnquiry(null);
        }}
        onApprove={handleApproveEnquiry}
        onReject={handleRejectEnquiry}
        onStageUpdate={handleStageUpdate}
      />

      {/* Create Enquiry Dialog */}
      <CreateEnquiryDialog
        open={createEnquiryDialogOpen}
        onClose={() => setCreateEnquiryDialogOpen(false)}
        onCreateEnquiry={handleCreateEnquiry}
      />
    </div>
  );
}