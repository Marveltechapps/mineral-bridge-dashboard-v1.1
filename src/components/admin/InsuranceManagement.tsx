import React, { useState } from "react";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Activity, 
  DollarSign, 
  TrendingUp, 
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
  History, 
  Eye, 
  Trash2, 
  ExternalLink,
  Zap,
  Briefcase,
  Scale,
  Gavel,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Lock,
  Stamp
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
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useDashboardStore } from "../../store/dashboardStore";
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
  Cell,
  PieChart,
  Pie
} from "recharts";

const PERFORMANCE_DATA = [
  { month: "Aug", payoutTime: 6.2, approval: 88, loss: 42 },
  { month: "Sep", payoutTime: 5.8, approval: 90, loss: 45 },
  { month: "Oct", payoutTime: 6.5, approval: 87, loss: 52 },
  { month: "Nov", payoutTime: 5.4, approval: 92, loss: 48 },
  { month: "Dec", payoutTime: 5.1, approval: 94, loss: 46 },
  { month: "Jan", payoutTime: 5.2, approval: 91, loss: 48 },
];

const COVERAGE_TYPE_DATA = [
  { name: "All Risk", value: 70, color: "#10B981" },
  { name: "Cargo", value: 25, color: "#3B82F6" },
  { name: "Liability", value: 5, color: "#F59E0B" },
];

const CLAIMS = [
  { 
    id: "IC-056", 
    orderId: "O-3456", 
    mineral: "Diamonds 25ct", 
    value: "$1.2M", 
    coverage: "$1M", 
    status: "Under Review", 
    progress: 40, 
    provider: "Lloyd's of London", 
    filed: "3d ago", 
    payout: "$450K" 
  },
  { 
    id: "IC-057", 
    orderId: "O-3457", 
    mineral: "Gold 50kg", 
    value: "$3.1M", 
    coverage: "$3M", 
    status: "Investigating", 
    progress: 25, 
    provider: "Allianz Global", 
    filed: "1d ago", 
    payout: "$0" 
  },
  { 
    id: "IC-058", 
    orderId: "O-3458", 
    mineral: "Silver 500kg", 
    value: "$450K", 
    coverage: "$500K", 
    status: "Approved", 
    progress: 100, 
    provider: "Local Insurers", 
    filed: "1w ago", 
    payout: "$420K" 
  },
  { 
    id: "IC-059", 
    orderId: "O-3459", 
    mineral: "Cobalt 100t", 
    value: "$2.4M", 
    coverage: "$2.5M", 
    status: "Document Req.", 
    progress: 60, 
    provider: "Lloyd's of London", 
    filed: "5d ago", 
    payout: "$0" 
  },
  { 
    id: "IC-060", 
    orderId: "O-3460", 
    mineral: "Gold 10kg", 
    value: "$650K", 
    coverage: "$700K", 
    status: "Payout Sent", 
    progress: 100, 
    provider: "Allianz Global", 
    filed: "2w ago", 
    payout: "$650K" 
  },
  { 
    id: "IC-061", 
    orderId: "O-3461", 
    mineral: "Diamonds 10ct", 
    value: "$400K", 
    coverage: "$400K", 
    status: "Under Review", 
    progress: 35, 
    provider: "Local Insurers", 
    filed: "2d ago", 
    payout: "$120K" 
  },
  { 
    id: "IC-062", 
    orderId: "O-3462", 
    mineral: "Iron Ore 5kt", 
    value: "$4.2M", 
    coverage: "$4M", 
    status: "Rejected", 
    progress: 100, 
    provider: "Lloyd's of London", 
    filed: "1m ago", 
    payout: "$0" 
  },
  { 
    id: "IC-063", 
    orderId: "O-3463", 
    mineral: "Lithium 20t", 
    value: "$380K", 
    coverage: "$400K", 
    status: "Under Review", 
    progress: 45, 
    provider: "Allianz Global", 
    filed: "4d ago", 
    payout: "$150K" 
  },
  { 
    id: "IC-064", 
    orderId: "O-3464", 
    mineral: "Copper 50t", 
    value: "$450K", 
    coverage: "$500K", 
    status: "Approved", 
    progress: 100, 
    provider: "Local Insurers", 
    filed: "6d ago", 
    payout: "$380K" 
  },
  { 
    id: "IC-065", 
    orderId: "O-3465", 
    mineral: "Gold 25kg", 
    value: "$1.6M", 
    coverage: "$1.5M", 
    status: "Investigating", 
    progress: 15, 
    provider: "Lloyd's of London", 
    filed: "12h ago", 
    payout: "$0" 
  }
];

export function InsuranceManagement() {
  const { state } = useDashboardStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [coverageFilter, setCoverageFilter] = useState("all");

  const handleViewClaim = (claim: any) => {
    setSelectedClaim(claim);
    setIsClaimModalOpen(true);
  };

  const handleApprove = (id: string) => {
    toast.success(`Claim ${id} has been pre-approved for payout.`);
  };

  const handleEscalate = (id: string) => {
    toast.error(`Claim ${id} escalated to Senior Underwriter.`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insurance Management - Active Policies</h1>
          <p className="text-muted-foreground">Manage underwriters, policies, claims, and coverage.</p>
          <p className="text-xs text-muted-foreground mt-1">Registry users (User Management): <span className="font-medium text-emerald-600">{state.registryUsers.length}</span></p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={coverageFilter} onValueChange={setCoverageFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="Coverage Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coverage</SelectItem>
              <SelectItem value="risk">All Risk</SelectItem>
              <SelectItem value="cargo">Cargo Only</SelectItem>
              <SelectItem value="liability">Liability</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Policies
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            New Policy Quote
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Overview</TabsTrigger>
          <TabsTrigger value="active-claims" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">Active Claims <Badge variant="secondary" className="h-5 px-1.5">10</Badge></TabsTrigger>
          <TabsTrigger value="policies" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">Policies <Badge variant="secondary" className="h-5 px-1.5">156</Badge></TabsTrigger>
          <TabsTrigger value="performance" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Performance</TabsTrigger>
          <TabsTrigger value="financials" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Financials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Provider Cards (Left) */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Underwriters</h3>
                
                {[
                  { name: "Lloyd's of London", coverage: "$500M Capacity", focus: "Minerals Specialist", sla: "98%", status: "Tier 1", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=150&fit=crop" },
                  { name: "Allianz Global", coverage: "$350M Capacity", focus: "Asia/Africa Corridors", sla: "72h Approval", status: "Priority", img: "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=200&h=150&fit=crop" },
                  { name: "Local Insurers", coverage: "< $1M Policies", focus: "Domestic Last-Mile", sla: "24h Response", status: "Local", img: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=200&h=150&fit=crop" }
                ].map((provider, i) => (
                  <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white dark:bg-slate-900 group">
                    <CardContent className="p-0 flex">
                      <div className="w-32 h-32 relative hidden sm:block">
                        <ImageWithFallback src={provider.img} alt={provider.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-emerald-600/10 group-hover:bg-transparent transition-colors" />
                      </div>
                      <div className="flex-1 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none">{provider.name}</h4>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{provider.focus}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px]">{provider.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Coverage Cap</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{provider.coverage}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase">Claims SLA</p>
                            <p className="text-xs font-bold text-emerald-600">{provider.sla}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 border-dashed p-6 rounded-3xl flex items-center justify-center group cursor-pointer">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Stamp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">Add Insurance Underwriter</p>
                  </div>
                </Card>
              </div>

              {/* Coverage Summary (Right) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Insured Value</p>
                      <h3 className="text-5xl font-black text-slate-900 dark:text-white">$245M</h3>
                      <div className="w-full mt-6 space-y-2">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-500">Utilization Rate</span>
                            <span className="text-emerald-600">62%</span>
                         </div>
                         <Progress value={62} className="h-2 bg-emerald-500" />
                      </div>
                   </Card>

                   <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Claims Loss Ratio</p>
                      <div className="relative w-32 h-32 flex items-center justify-center">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={[{ value: 2.1 }, { value: 97.9 }]}
                                  innerRadius={45}
                                  outerRadius={60}
                                  paddingAngle={5}
                                  dataKey="value"
                               >
                                  <Cell fill="#10B981" />
                                  <Cell fill="#E2E8F0" />
                               </Pie>
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-emerald-600">2.1%</span>
                         </div>
                      </div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase mt-4">Target: &lt; 3.0% Healthy</p>
                   </Card>
                </div>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8 flex-1">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Coverage Distribution</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1">Allocation across different risk portfolios.</p>
                     </div>
                     <PieIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                     <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={COVERAGE_TYPE_DATA}
                                 innerRadius={60}
                                 outerRadius={80}
                                 paddingAngle={8}
                                 dataKey="value"
                              >
                                 {COVERAGE_TYPE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                              </Pie>
                              <Tooltip />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="space-y-4">
                        {COVERAGE_TYPE_DATA.map((item) => (
                           <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                              <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                 <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">{item.name}</span>
                              </div>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}%</span>
                           </div>
                        ))}
                     </div>
                  </div>
                </Card>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="active-claims" className="mt-4">
          <div className="space-y-6">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 px-8 py-6">
                  <div>
                    <CardTitle className="text-xl font-black text-slate-900 dark:text-white">Active Insurance Claims</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500 mt-1">Tracking loss mitigation and payout status with underwriters.</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        placeholder="Search Claim, Order, Provider..." 
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
                          <Checkbox id="all-claims" />
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Claim Details</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mineral & Value</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filed</TableHead>
                        <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CLAIMS.map((claim) => (
                        <TableRow 
                          key={claim.id} 
                          className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 cursor-pointer"
                          onClick={() => handleViewClaim(claim)}
                        >
                          <TableCell className="px-8" onClick={(e) => e.stopPropagation()}>
                            <Checkbox id={claim.id} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-slate-900 dark:text-white">{claim.id}</span>
                              <span className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1">
                                {claim.orderId}
                                <ArrowUpRight className="w-2 h-2" />
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{claim.mineral}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-emerald-100 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-black uppercase tracking-tighter">
                                   Value: {claim.value}
                                </Badge>
                                <span className="text-[9px] font-black text-slate-400 uppercase">Cover: {claim.coverage}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{claim.provider}</span>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[150px]">
                            <div className="space-y-2">
                               <div className="flex items-center justify-between text-[10px] font-black">
                                  <span className={claim.status === 'Rejected' ? 'text-red-500' : 'text-slate-600'}>{claim.status}</span>
                                  <span className="text-emerald-600">{claim.progress}%</span>
                               </div>
                               <Progress value={claim.progress} className={`h-1 ${claim.status === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{claim.filed}</span>
                                <span className="text-[9px] font-black text-emerald-600 uppercase">Est: {claim.payout}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-right px-8" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleViewClaim(claim)}
                              >
                                View Policy
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                                  <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Claim Actions</DropdownMenuLabel>
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg" onClick={() => handleApprove(claim.id)}>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="font-bold text-sm">Approve Claim</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg" onClick={() => handleEscalate(claim.id)}>
                                    <Zap className="w-4 h-4 text-orange-500" />
                                    <span className="font-bold text-sm">Escalate Claim</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 mx-2" />
                                  <DropdownMenuItem className="cursor-pointer gap-2 py-2.5 rounded-lg text-red-600 focus:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="font-bold text-sm">Reject Claim</span>
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
              </Card>
          </div>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-500" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">156</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Policies</p>
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
                  <Card className="border-none shadow-sm bg-slate-900 text-white p-6 rounded-3xl flex items-center justify-between">
                     <div>
                        <h3 className="text-2xl font-black leading-none">$2.8M</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Annual Premiums</p>
                     </div>
                     <BarChart3 className="w-8 h-8 text-emerald-500 opacity-50" />
                  </Card>
               </div>

               <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Coverage by Mineral Class</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1">Portfolio diversification based on asset type.</p>
                     </div>
                  </div>
                  <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                           { name: "Gold", value: 45 },
                           { name: "Diamonds", value: 30 },
                           { name: "Cobalt", value: 15 },
                           { name: "Iron Ore", value: 5 },
                           { name: "Others", value: 5 },
                        ]}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 11, fontWeight: 800, fill: '#64748B' }}
                              dy={10}
                           />
                           <YAxis hide />
                           <Tooltip cursor={{ fill: '#F8FAFC' }} />
                           <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Claims Approval", value: "91%", trend: "+3%", color: "text-emerald-500", icon: CheckCircle2 },
                    { label: "Avg Payout Time", value: "5.2d", trend: "-1.8d", color: "text-emerald-600", icon: Clock },
                    { label: "Dispute Rate", value: "1.2%", trend: "-0.5%", color: "text-emerald-500", icon: Scale },
                    { label: "Underwriter Score", value: "9.4", trend: "+0.2", color: "text-emerald-500", icon: Activity },
                  ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900 p-6 rounded-3xl overflow-hidden group">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500">
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

               <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl p-8">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Payout Efficiency Trend</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1">Average days from claim filing to settlement.</p>
                     </div>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px]">7d TARGET MET</Badge>
                  </div>
                  <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PERFORMANCE_DATA}>
                           <defs>
                              <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                           <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748B' }} dy={10} />
                           <YAxis hide />
                           <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px' }} />
                           <Area type="monotone" dataKey="payoutTime" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorPayout)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-4">
          <div className="space-y-8">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Premiums Collected</p>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white">$2.8M</h3>
                     <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        +12% vs last year
                     </p>
                     <div className="mt-8 space-y-4">
                        <div className="flex justify-between text-xs font-bold">
                           <span className="text-slate-500">Claims Paid</span>
                           <span className="text-slate-900 dark:text-white">$1.4M</span>
                        </div>
                        <Progress value={50} className="h-1.5 bg-emerald-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase">Loss Ratio: 48% (Healthy)</p>
                     </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-white dark:bg-slate-900 p-8 rounded-3xl">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Outstanding Claims</p>
                     <h3 className="text-4xl font-black text-slate-900 dark:text-white">$320K</h3>
                     <p className="text-xs font-bold text-orange-500 mt-2">10 Pending Review</p>
                     <div className="mt-8 flex gap-3">
                        <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 font-black rounded-xl h-11">Reconcile Hub</Button>
                        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-200">
                           <ExternalLink className="w-4 h-4" />
                        </Button>
                     </div>
                  </Card>

                  <Card className="border-none shadow-sm bg-emerald-900 text-white p-8 rounded-3xl overflow-hidden relative">
                     <div className="relative z-10 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Policy Reserve</p>
                        <h3 className="text-4xl font-black">$5.2M</h3>
                        <p className="text-xs font-medium text-emerald-200/70">Contingency fund for high-value mineral transit losses.</p>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl h-11 mt-4">Audit Reserves</Button>
                     </div>
                     <Lock className="absolute -bottom-8 -right-8 w-32 h-32 text-emerald-800 opacity-30 rotate-12" />
                  </Card>
               </div>

               <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                  <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                     <div>
                        <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Provider Scorecard</CardTitle>
                        <CardDescription className="text-xs font-medium text-slate-500 mt-1">Comparing underwriter performance metrics and settlement rates.</CardDescription>
                     </div>
                     <Badge variant="outline" className="border-slate-200">FY 2026 Q1</Badge>
                  </CardHeader>
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none">
                           <TableHead className="px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Underwriter</TableHead>
                           <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Policies</TableHead>
                           <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Claims Ratio</TableHead>
                           <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Avg Payout</TableHead>
                           <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-8">Score</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                          { name: "Lloyd's of London", policies: 84, ratio: "1.8%", payout: "4.8d", score: "9.6" },
                          { name: "Allianz Global", policies: 52, ratio: "2.4%", payout: "5.5d", score: "9.2" },
                          { name: "Local Insurers", policies: 20, ratio: "3.2%", payout: "6.2d", score: "8.8" },
                        ].map((item) => (
                          <TableRow key={item.name} className="border-slate-100 dark:border-slate-800">
                             <TableCell className="px-8 font-black text-slate-900 dark:text-white text-sm">{item.name}</TableCell>
                             <TableCell className="text-center text-xs font-bold text-slate-600">{item.policies}</TableCell>
                             <TableCell className="text-center text-xs font-black text-emerald-600">{item.ratio}</TableCell>
                             <TableCell className="text-center text-xs font-bold text-slate-500">{item.payout}</TableCell>
                             <TableCell className="text-right px-8">
                                <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[10px]">{item.score}</Badge>
                             </TableCell>
                          </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Detail Modal */}
      <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none bg-white dark:bg-slate-950">
           <DialogHeader className="sr-only">
              <DialogTitle>Claim Details - {selectedClaim?.id}</DialogTitle>
              <DialogDescription>
                 Detailed view of insurance claim {selectedClaim?.id}, including evidence photos and policy documents.
              </DialogDescription>
           </DialogHeader>
           <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-4 bg-emerald-600 p-8 text-white relative">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-2">Claim ID: {selectedClaim?.id}</p>
                    <h2 className="text-3xl font-black">Diamond Damage Claim</h2>
                    <div className="space-y-4 mt-8">
                       <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                          <p className="text-[10px] font-black uppercase text-emerald-100 mb-1">Insured Value</p>
                          <p className="text-xl font-black">{selectedClaim?.value}</p>
                       </div>
                       <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                          <p className="text-[10px] font-black uppercase text-emerald-100 mb-1">Coverage Type</p>
                          <p className="text-lg font-black">Transit All-Risk</p>
                       </div>
                    </div>
                 </div>
                 <Shield className="absolute -bottom-8 -left-8 w-40 h-40 text-emerald-500 opacity-30" />
              </div>
              <div className="md:col-span-8 p-8 flex flex-col max-h-[600px] overflow-y-auto custom-scrollbar">
                 <div className="space-y-8 flex-1">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
                          <p className="text-sm font-bold text-emerald-600">{selectedClaim?.orderId}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Underwriter</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedClaim?.provider}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence & Documents</p>
                       <div className="grid grid-cols-3 gap-3">
                          {[
                            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
                            "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=200&h=200&fit=crop",
                            "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=200&h=200&fit=crop"
                          ].map((src, i) => (
                            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-zoom-in">
                               <ImageWithFallback src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-5 h-5 text-white" />
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjuster Notes</p>
                       <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                             "The damage appears to have occurred during the unloading process at the Antwerp hub. CCTV footage confirms mishandling of the primary security container. Recommend approval of 85% payout based on current market valuation."
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                             <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-[8px] bg-slate-200">SA</AvatarFallback>
                             </Avatar>
                             <span className="text-[10px] font-bold text-slate-500">Senior Adjuster • Jan 29, 2026</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-black" onClick={() => setIsClaimModalOpen(false)}>Close</Button>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl h-12" onClick={() => {
                       handleApprove(selectedClaim?.id);
                       setIsClaimModalOpen(false);
                    }}>Approve Settlement</Button>
                 </div>
              </div>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
