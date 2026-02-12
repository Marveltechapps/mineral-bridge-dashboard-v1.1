import React, { useState, useEffect } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Filter, 
  Gavel, 
  MoreHorizontal, 
  Plus, 
  Search, 
  MessageSquare,
  Shield,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  User,
  Users as UsersIcon,
  DollarSign,
  FileText,
  AlertTriangle,
  Package,
  CreditCard,
  Ban,
  Scale,
  Paperclip,
  X,
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
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
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useDashboardStore, useAllOrders, getRegistryUserName } from "../../store/dashboardStore";

type DisputeRow = {
  id: string;
  status: string;
  buyer: { name: string; avatar?: string };
  seller: { name: string; avatar?: string };
  mineral: string;
  orderId: string;
  type: string;
  value: number;
  created: string;
  priority: "High" | "Medium" | "Low";
};

const ESCALATIONS = [
  { id: "#1234", title: "Delivery Damage - $10K Gold", time: "2h 45m left", priority: "High", user: "John Doe" },
  { id: "#1235", title: "Quality Mismatch - $25K Copper", time: "5h 12m left", priority: "High", user: "Jane Smith" },
  { id: "#1236", title: "Payment Delay - $15K Iron", time: "1d 2h left", priority: "Medium", user: "Mike Johnson" },
];

export interface DisputesResolutionProps {
  initialOrderId?: string;
}

export function DisputesResolution({ initialOrderId }: DisputesResolutionProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const allOrders = useAllOrders();

  const [newDisputeOrderId, setNewDisputeOrderId] = useState("");
  const [newDisputeType, setNewDisputeType] = useState("");
  const [newDisputeDesc, setNewDisputeDesc] = useState("");

  const disputesList: DisputeRow[] = React.useMemo(
    () =>
      state.disputes.map((d) => ({
        id: d.id,
        status: d.status,
        buyer: d.buyer,
        seller: d.seller,
        mineral: d.mineral,
        orderId: d.orderId.startsWith("#") ? d.orderId : `#${d.orderId}`,
        type: "Order Dispute",
        value: parseFloat(d.amount?.replace(/[^0-9.-]/g, "") || "0") || 0,
        created: d.raisedAt || "—",
        priority: "High" as const,
      })),
    [state.disputes]
  );

  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDispute, setSelectedDispute] = useState<DisputeRow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewDisputeOpen, setIsNewDisputeOpen] = useState(false);

  useEffect(() => {
    if (!initialOrderId || disputesList.length === 0) return;
    const dispute = state.disputes.find((d) => d.orderId === initialOrderId);
    if (dispute) {
      const row = disputesList.find((r) => r.id === dispute.id);
      if (row) {
        setSelectedDispute(row);
        setIsDetailOpen(true);
      }
    }
  }, [initialOrderId, state.disputes, disputesList]);

  const toggleSelectAll = () => {
    if (selectedDisputes.length === disputesList.length) {
      setSelectedDisputes([]);
    } else {
      setSelectedDisputes(disputesList.map((d) => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedDisputes.includes(id)) {
      setSelectedDisputes(selectedDisputes.filter(i => i !== id));
    } else {
      setSelectedDisputes([...selectedDisputes, id]);
    }
  };

  const handleBulkResolve = () => {
    if (selectedDisputes.length === 0) return;
    selectedDisputes.forEach((id) => {
      const dispute = state.disputes.find((d) => d.id === id);
      if (dispute) dispatch({ type: "UPDATE_DISPUTE", payload: { ...dispute, status: "Resolved" } });
    });
    toast.success(`Resolved ${selectedDisputes.length} disputes successfully`);
    setSelectedDisputes([]);
  };

  const handleFreezeFunds = () => {
    toast.info("Funds have been frozen for the selected disputes");
  };

  const filteredDisputes = disputesList.filter((d) => {
    const matchesSearch = d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isDetailOpen && selectedDispute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-in slide-in-from-right duration-300">
        <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDetailOpen(false)}
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Dispute Details</h1>
                <Badge 
                  className={`px-2 py-0.5 border-none font-bold uppercase text-[10px] ${
                    selectedDispute.status === 'Open' ? 'bg-orange-500' :
                    selectedDispute.status === 'Resolved' ? 'bg-emerald-500' :
                    'bg-red-500'
                  }`}
                >
                  {selectedDispute.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Case ID: {selectedDispute.id} • {selectedDispute.mineral}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
               <Download className="w-4 h-4 mr-2" />
               Download Report
             </Button>
             <Button variant="outline" size="sm" className="text-slate-500">
               <MoreHorizontal className="w-4 h-4" />
             </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Scale className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Dispute #{selectedDispute.id}</h2>
                  <p className="text-sm text-slate-400">Created on Jan 26, 2026 • {selectedDispute.created}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 max-w-2xl">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Type</p>
                  <p className="text-base font-semibold">{selectedDispute.type}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Priority</p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedDispute.priority === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
                    <p className="text-base font-semibold">{selectedDispute.priority}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Value Disputed</p>
                  <p className="text-lg font-bold text-emerald-400">${selectedDispute.value.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Escrow Status</p>
                  <p className="text-base font-semibold text-blue-400">Locked</p>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-16 -mb-16" />
          </div>

          <Tabs defaultValue="details" className="w-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-1 mb-6">
              <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg w-full justify-start">
                <TabsTrigger value="details" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 flex-1 md:flex-none px-6">
                  Case Details
                </TabsTrigger>
                <TabsTrigger value="evidence" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 flex-1 md:flex-none px-6">
                  Evidence Files
                </TabsTrigger>
                <TabsTrigger value="financials" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 flex-1 md:flex-none px-6">
                  Financials
                </TabsTrigger>
                <TabsTrigger value="compliance" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 flex-1 md:flex-none px-6">
                  Compliance Logs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="space-y-6">
              <TabsContent value="details" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-500" />
                          Conflict Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            The buyer claims that the mineral purity for {selectedDispute.mineral} is significantly below the contractually agreed threshold. 
                            Initial reports indicate a variance of 0.8%, which exceeds the standard 0.1% margin of error allowed.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Contract Spec</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">99.9% Purity</p>
                          </div>
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Actual Spec</p>
                            <p className="text-sm font-bold text-red-600">99.1% Purity</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          Resolution Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 z-10 shadow-sm" />
                            <div className="space-y-1">
                              <p className="text-xs text-slate-400 font-medium">Today, 10:45 AM</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">Admin started investigation</p>
                              <p className="text-xs text-slate-500">Mediator assigned to review laboratory results.</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 z-10" />
                            <div className="space-y-1">
                              <p className="text-xs text-slate-400 font-medium">Jan 28, 2026, 04:20 PM</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">Seller submitted counter-evidence</p>
                              <p className="text-xs text-slate-500">Provided pre-shipping certificates of analysis.</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 z-10" />
                            <div className="space-y-1">
                              <p className="text-xs text-slate-400 font-medium">Jan 26, 2026, 11:30 AM</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dispute initiated by Buyer</p>
                              <p className="text-xs text-slate-500">Reason: Mineral purity below threshold (99.1% actual vs 99.9% target).</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-emerald-500" />
                          Parties Involved
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800">
                                <AvatarImage src={selectedDispute.buyer.avatar} />
                                <AvatarFallback>{selectedDispute.buyer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Buyer</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedDispute.buyer.name}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-semibold h-8">View</Button>
                          </div>
                          <div className="h-px bg-slate-200 dark:bg-slate-700" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-slate-800">
                                <AvatarImage src={selectedDispute.seller.avatar} />
                                <AvatarFallback>{selectedDispute.seller.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Seller</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedDispute.seller.name}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-emerald-600 text-xs font-semibold h-8">View</Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs text-slate-500 font-bold uppercase">Associated Order</p>
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{selectedDispute.orderId}</span>
                              <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]">Verified</Badge>
                            </div>
                            <p className="text-xs text-emerald-600/80 mb-3">Total Value: $45,000.00</p>
                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs">View Original Order</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm">
                      <ImageWithFallback 
                        src={`https://images.unsplash.com/photo-1518546305928-38739abfe217?w=400&h=400&fit=crop&q=${80 + i}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Evidence"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-xs text-white font-bold truncate">LAB_RESULTS_{i}.pdf</p>
                        <p className="text-[10px] text-white/70">Jan 26, 2026 • 2.4MB</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="h-8 flex-1 bg-white text-slate-900 hover:bg-white/90 text-[10px] font-bold">Preview</Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-emerald-500/90 text-white border-none text-[10px] backdrop-blur-sm">Verified</Badge>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-6 group hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 group-hover:text-emerald-600">Add More</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <Card className="border-none shadow-sm">
                     <CardHeader>
                       <CardTitle className="text-base font-bold">Transaction Breakdown</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Order Gross Amount</span>
                            <span className="font-bold text-slate-900 dark:text-white">$45,000.00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Escrow Fee (1.5%)</span>
                            <span className="font-bold text-slate-900 dark:text-white">$675.00</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Platform Handling</span>
                            <span className="font-bold text-slate-900 dark:text-white">$225.00</span>
                          </div>
                          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                          <div className="flex justify-between text-lg">
                            <span className="font-bold text-slate-900 dark:text-white">Amount at Risk</span>
                            <span className="font-black text-emerald-600">$44,100.00</span>
                          </div>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-800/50 flex gap-4">
                          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed font-medium">
                            Withdrawal rights have been suspended for the seller until this dispute is marked as "Resolved" by an authorized mediator.
                          </p>
                        </div>
                     </CardContent>
                   </Card>

                   <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                      <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          Escrow Wallet Control
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 relative z-10">
                         <div className="flex flex-col items-center justify-center py-6">
                           <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
                              <DollarSign className="w-10 h-10 text-emerald-400" />
                           </div>
                           <h3 className="text-3xl font-black">$45,000.00</h3>
                           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Held in Smart Contract</p>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-600/20">Release to Seller</Button>
                           <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold h-12">Refund Buyer</Button>
                         </div>
                         <Button variant="ghost" className="w-full text-slate-400 hover:text-white text-xs">View Blockchain Transaction Log</Button>
                      </CardContent>
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24" />
                   </Card>
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <Card className="border-none shadow-sm">
                   <CardHeader>
                     <CardTitle className="text-base font-bold">Platform Integrity Scan</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex items-start gap-4 p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Clean Merchant History</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            XYZ Mines has a 98% resolution rate and has successfully fulfilled 142 contracts in the last year. No fraudulent patterns detected.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                          <UsersIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Enhanced Verification</p>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Both parties are Tier-3 verified. All KYC/KYB documents are up to date and re-validated as of Jan 15, 2026.
                          </p>
                        </div>
                      </div>
                   </CardContent>
                 </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Quick Action</p>
                 <p className="text-sm font-bold">Select resolution strategy</p>
               </div>
               <Select defaultValue="settlement">
                 <SelectTrigger className="w-[240px] h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border-none font-bold">
                   <SelectValue placeholder="Action Type" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="settlement">Partial Settlement (Refund 10%)</SelectItem>
                   <SelectItem value="refund">Full Refund (100%)</SelectItem>
                   <SelectItem value="reject">Reject Dispute (Release 100%)</SelectItem>
                   <SelectItem value="mediate">Schedule Mediation Call</SelectItem>
                 </SelectContent>
               </Select>
               <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50">
                 Add Internal Note
               </Button>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none h-12 px-8 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
                onClick={() => {
                  toast.info("Dispute escalated to Enquiry Management");
                  setIsDetailOpen(false);
                }}
              >
                Escalate to Senior Admin
              </Button>
              <Button 
                className="flex-1 md:flex-none h-12 px-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30"
                onClick={() => {
                  if (selectedDispute) {
                    const dispute = state.disputes.find((d) => d.id === selectedDispute.id);
                    if (dispute) dispatch({ type: "UPDATE_DISPUTE", payload: { ...dispute, status: "Resolved" } });
                  }
                  toast.success("Dispute resolved successfully");
                  setSelectedDispute(null);
                  setIsDetailOpen(false);
                }}
              >
                Confirm & Close Case
              </Button>
            </div>
          </div>
        </div>
        <div className="h-24" /> {/* Spacer for sticky footer */}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-emerald-600 font-medium">Disputes</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Disputes & Resolution Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsNewDisputeOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50">
            <Plus className="w-4 h-4 mr-2" />
            New Dispute
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by ID, buyer, or seller..." 
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] bg-slate-50 dark:bg-slate-800 border-none">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-slate-50 dark:bg-slate-800 border-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] bg-slate-50 dark:bg-slate-800 border-none">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Filter className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <Badge className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100">+5 today</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">Open Disputes</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">42</h3>
                <span className="text-xs text-slate-400 font-normal">Active cases</span>
              </div>
              <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">65% of total volume</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingDown className="w-3 h-3" />
                2%
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Avg Resolution Time</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">4.2</h3>
              <span className="text-xs text-slate-400 font-normal">Days</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 italic">Target: Under 5 days</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
              <Badge variant="destructive" className="bg-red-500 text-white border-none animate-pulse">High Risk</Badge>
            </div>
            <p className="text-sm font-medium text-slate-500">Value at Dispute</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">$245.8K</h3>
              <span className="text-xs text-slate-400 font-normal">USD</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-6">Escrow protection active</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                Last 30 days
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">Resolution Rate</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">92%</h3>
            </div>
            <div className="mt-4 flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-400">Resolved (80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-slate-600 dark:text-slate-400">Escalated (12%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Resolution Actions</CardTitle>
            <CardDescription>Perform administrative tasks across multiple disputes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className={`h-24 flex-col gap-2 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 group ${selectedDisputes.length === 0 ? 'opacity-50' : ''}`}
                disabled={selectedDisputes.length === 0}
                onClick={handleBulkResolve}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold">Bulk Resolve</span>
              </Button>
              <Button 
                variant="outline" 
                className={`h-24 flex-col gap-2 border-red-100 hover:bg-red-50 hover:border-red-200 group ${selectedDisputes.length === 0 ? 'opacity-50' : ''}`}
                disabled={selectedDisputes.length === 0}
                onClick={handleFreezeFunds}
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Ban className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs font-semibold">Freeze Funds</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 border-blue-100 hover:bg-blue-50 hover:border-blue-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs font-semibold">Assign Mediator</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-xs font-semibold">Request Re-test</span>
              </Button>
            </div>
            {selectedDisputes.length > 0 && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex items-center justify-between">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {selectedDisputes.length} disputes selected for action.
                </p>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDisputes([])} className="text-emerald-700 text-xs h-7">Clear selection</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Escalations Feed */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Escalation Feed</CardTitle>
              <CardDescription>High priority items requiring attention.</CardDescription>
            </div>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ESCALATIONS.map((esc) => (
                <div key={esc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded uppercase">Order {esc.id}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          {esc.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">{esc.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-[8px] bg-slate-200">{esc.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-slate-400 font-medium">Assigned: {esc.user}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
              <Button variant="link" size="sm" className="text-emerald-600 font-semibold text-xs h-auto py-0">View all escalations</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disputes Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">All Dispute Records</CardTitle>
            <CardDescription>Manage and track all mineral-related conflicts.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="w-3 h-3 mr-2" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <div 
                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedDisputes.length === disputesList.length ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 dark:border-slate-600'}`}
                    onClick={toggleSelectAll}
                  >
                    {selectedDisputes.length === disputesList.length && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Dispute ID</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Parties</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Mineral / Order</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Type</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Value Disputed</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300">Created</TableHead>
                <TableHead className="font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredDisputes.map((dispute) => (
                  <motion.tr 
                    key={dispute.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setIsDetailOpen(true);
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div 
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${selectedDisputes.includes(dispute.id) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 dark:border-slate-600 group-hover:border-emerald-400'}`}
                        onClick={() => toggleSelect(dispute.id)}
                      >
                        {selectedDisputes.includes(dispute.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 dark:text-white">#{dispute.id}</span>
                        <Badge 
                          className={`w-fit px-1.5 py-0 text-[10px] border-none ${
                            dispute.status === 'Open' ? 'bg-orange-500 text-white' :
                            dispute.status === 'Resolved' ? 'bg-emerald-500 text-white' :
                            dispute.status === 'Escalated' ? 'bg-red-500 text-white' :
                            'bg-slate-500 text-white'
                          }`}
                        >
                          {dispute.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5 ring-1 ring-slate-100">
                            <AvatarImage src={dispute.buyer.avatar} />
                            <AvatarFallback className="text-[8px]">{dispute.buyer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">B: {dispute.buyer.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5 ring-1 ring-slate-100">
                            <AvatarImage src={dispute.seller.avatar} />
                            <AvatarFallback className="text-[8px]">{dispute.seller.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors">S: {dispute.seller.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white underline decoration-slate-200 underline-offset-4 decoration-dashed hover:decoration-emerald-400 transition-colors">{dispute.mineral}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{dispute.orderId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[10px] border-none whitespace-nowrap">
                        {dispute.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">${dispute.value.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500">Jan 26, 2026</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500">{dispute.created}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">
                              <Shield className="w-4 h-4 mr-2 text-emerald-500" />
                              View Blockchain Proof
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <CreditCard className="w-4 h-4 mr-2 text-blue-500" />
                              Process Refund
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <User className="w-4 h-4 mr-2 text-orange-500" />
                              Assign Mediator
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Flag for Audit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          {filteredDisputes.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No disputes found</h3>
              <p className="text-sm text-slate-500 max-w-[300px] mt-1">Try adjusting your filters or search query to find what you're looking for.</p>
              <Button 
                variant="outline" 
                className="mt-6 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("All");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500">Showing {filteredDisputes.length} of {disputesList.length} records</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-emerald-600 text-white hover:bg-emerald-700">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-200">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* New Dispute Dialog */}
      <Dialog open={isNewDisputeOpen} onOpenChange={setIsNewDisputeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log New Manual Dispute</DialogTitle>
            <DialogDescription>Manually create a dispute entry for offline mediation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Order</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Enter Order ID (e.g. B-ORD-5489)" 
                  className="pl-10" 
                  value={newDisputeOrderId}
                  onChange={(e) => setNewDisputeOrderId(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dispute Type</label>
              <Select value={newDisputeType} onValueChange={setNewDisputeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quality">Quality Mismatch</SelectItem>
                  <SelectItem value="delivery">Delivery Damage</SelectItem>
                  <SelectItem value="payment">Payment Conflict</SelectItem>
                  <SelectItem value="quantity">Quantity Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the nature of the conflict..."
                value={newDisputeDesc}
                onChange={(e) => setNewDisputeDesc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Click to upload or drag and drop</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsNewDisputeOpen(false); setNewDisputeOrderId(""); setNewDisputeType(""); setNewDisputeDesc(""); }}>Cancel</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                const orderIdRaw = newDisputeOrderId.trim().toUpperCase().replace(/^#/, "");
                const order = allOrders.find((o) => o.id.toUpperCase().replace(/^#/, "") === orderIdRaw || o.id.toUpperCase().includes(orderIdRaw));
                if (!order) {
                  toast.error("Order not found", { description: "Enter a valid Order ID (e.g. B-ORD-5489 or S-ORD-8821)." });
                  return;
                }
                const buyerName = order.type === "Buy" ? getRegistryUserName(state.registryUsers, order.userId) : "Platform";
                const sellerName = order.type === "Sell" ? getRegistryUserName(state.registryUsers, order.userId) : "Platform";
                const typeLabel = { quality: "Quality Mismatch", delivery: "Delivery Damage", payment: "Payment Conflict", quantity: "Quantity Issue" }[newDisputeType] || newDisputeType;
                const dispute: import("../../store/dashboardStore").Dispute = {
                  id: `D-${String(state.disputes.length + 1).padStart(4, "0")}`,
                  orderId: order.id,
                  status: "Open",
                  buyer: { name: buyerName || "Buyer" },
                  seller: { name: sellerName || "Seller" },
                  mineral: `${order.mineral} ${order.qty} ${order.unit}${newDisputeType ? ` [${typeLabel}]` : ""}`,
                  amount: order.aiEstimatedAmount,
                  raisedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
                };
                dispatch({ type: "ADD_DISPUTE", payload: dispute });
                toast.success("New dispute has been logged", { description: `${dispute.id} created for order ${order.id}.` });
                setIsNewDisputeOpen(false);
                setNewDisputeOrderId("");
                setNewDisputeType("");
                setNewDisputeDesc("");
              }}
            >
              Create Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
