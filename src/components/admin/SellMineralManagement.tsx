import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus,
  Eye,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Truck,
  CreditCard,
  Landmark,
} from "lucide-react";
import { Button } from "../ui/button";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../ui/dropdown-menu";
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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format } from "date-fns";
import { useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";
import type { Order } from "../../store/dashboardStore";
import type { MineralSubmission } from "../../types/sellSubmissions";

export interface SellMineralManagementProps {
  onOpenOrderDetail?: (orderId: string) => void;
  /** Open submission detail on a full screen (add or view). */
  onOpenSubmissionDetail?: (submissionId: string) => void;
}

export function SellMineralManagement({ onOpenOrderDetail, onOpenSubmissionDetail }: SellMineralManagementProps) {
  const { state, dispatch } = useDashboardStore();
  const submissions = state.mineralSubmissions;
  const sellOrders = state.sellOrders;
  const [activeTab, setActiveTab] = useState<"submissions" | "orders">("submissions");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [submissionToDelete, setSubmissionToDelete] = useState<MineralSubmission | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSellOrders = useMemo(() => {
    const term = orderSearchTerm.toLowerCase().trim();
    if (!term) return sellOrders;
    return sellOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(term) ||
        o.mineral.toLowerCase().includes(term) ||
        getRegistryUserName(state.registryUsers, o.userId).toLowerCase().includes(term)
    );
  }, [sellOrders, orderSearchTerm, state.registryUsers]);

  // Filtering
  const filteredSubmissions = submissions.filter(item => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mineralType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(item.status);
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => setStatusFilter([]);
  const activeFiltersCount = statusFilter.length;

  const totalItems = filteredSubmissions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const handleViewDetails = (id: string) => {
    onOpenSubmissionDetail?.(id);
  };

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const handleDeleteSubmission = () => {
    if (submissionToDelete) {
      dispatch({ type: "REMOVE_MINERAL_SUBMISSION", payload: submissionToDelete.id });
      setSubmissionToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
      case "Sold":
      case "Settled":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "In Review":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Submitted":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sell Management</h1>
          <p className="text-muted-foreground">Sell list from the app and users&apos; sell list. Manage submissions, verification, and sell orders.</p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-emerald-600">{submissions.length}</span> submission(s) from app · <span className="font-medium text-emerald-600">{sellOrders.length}</span> sell order(s) from <span className="font-medium text-emerald-600">{new Set(sellOrders.map((o) => o.userId).filter(Boolean)).size}</span> user(s)
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "submissions" | "orders")} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="submissions" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Sell list (from app)
            <Badge variant="secondary" className="h-5 px-1.5">{submissions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Users&apos; sell list
            <Badge variant="secondary" className="h-5 px-1.5">{sellOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6 space-y-6">
      {/* Stats Cards - Submissions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Submissions</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{submissions.length}</h3>
            </div>
            <FileText className="w-8 h-8 text-blue-500/50" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50 dark:bg-amber-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">In Review</p>
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {submissions.filter(s => s.status === 'In Review').length}
              </h3>
            </div>
            <Eye className="w-8 h-8 text-amber-500/50" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Approved</p>
              <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {submissions.filter(s => s.status === 'Approved' || s.status === 'Sold').length}
              </h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-indigo-50 dark:bg-indigo-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Total Payouts</p>
              <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">$36.7k</h3>
            </div>
            <Landmark className="w-8 h-8 text-indigo-500/50" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submission ID, seller..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`gap-2 ${activeFiltersCount > 0 ? "bg-slate-100 dark:bg-slate-800" : ""}`}>
                    <Filter className="w-4 h-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 ml-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium leading-none">Filters</h4>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={clearFilters}>
                        Clear all
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Status</h5>
                      <div className="flex flex-wrap gap-2">
                        {["Submitted", "In Review", "Approved", "Rejected", "Sold", "Settled"].map((status) => (
                          <Badge
                            key={status}
                            variant={statusFilter.includes(status) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() =>
                              setStatusFilter((prev) =>
                                prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                              )
                            }
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  const newSub: MineralSubmission = {
                    id: `MIN-SUB-${new Date().getFullYear()}-${String(submissions.length + 1).padStart(3, "0")}`,
                    sellerId: "NEW",
                    sellerName: "New Seller",
                    sellerCompany: "New Company",
                    mineralName: "",
                    mineralCategory: "Raw",
                    mineralDescription: "",
                    mineralType: "Gold",
                    form: "Bar",
                    quantity: 0,
                    unit: "grams",
                    extractionYear: new Date().getFullYear(),
                    location: { city: "", region: "", country: "" },
                    photos: [],
                    status: "Submitted",
                    aiConfidenceScore: 0,
                    reviewerNotes: "",
                    blockchainProofEnabled: false,
                    sgsStatus: "Not Sent",
                    grossOfferValue: 0,
                    platformFeePercent: 2.5,
                    logisticsCost: 0,
                    currency: "USD",
                    settlementType: "Standard",
                    escrowStatus: "Pending",
                    paymentMode: "Bank Settlement",
                    auditLog: [],
                    createdAt: new Date(),
                  };
                  dispatch({ type: "ADD_MINERAL_SUBMISSION", payload: newSub });
                  onOpenSubmissionDetail?.(newSub.id);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add submission
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Seller Details</TableHead>
                <TableHead>Mineral</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No submissions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSubmissions.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => handleViewDetails(item.id)}
                  >
                    <TableCell className="font-mono text-xs font-medium">{item.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(item.createdAt, "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.sellerName}</span>
                        <span className="text-xs text-muted-foreground">{item.sellerCompany}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.mineralName || item.mineralType}</span>
                      <span className="text-xs text-muted-foreground block">{item.mineralCategory ? `${item.mineralCategory} · ` : ""}{item.quantity} {item.unit} • {item.form}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.location.city}, {item.location.country}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-normal ${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.aiConfidenceScore > 80 ? "bg-emerald-500" : item.aiConfidenceScore > 50 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${item.aiConfidenceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{item.aiConfidenceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(item.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                            onClick={() => setSubmissionToDelete(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Submission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredSubmissions.length > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalItems}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(totalPages)} disabled={currentPage >= totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

        </TabsContent>

        <TabsContent value="orders" className="mt-6 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search order ID, user, mineral..."
                    className="pl-9"
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Mineral</TableHead>
                    <TableHead>Qty / Unit</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No sell orders from users.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{getRegistryUserName(state.registryUsers, order.userId)}</span>
                            {order.userId && (
                              <span className="text-xs text-muted-foreground">{order.userId}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-sm">{order.mineral}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.qty} {order.unit}</TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">{order.aiEstimatedAmount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenOrderDetail?.(order.id); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredSellOrders.length} sell order(s)
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!submissionToDelete} onOpenChange={(open) => !open && setSubmissionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove submission {submissionToDelete?.id} from the sell list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteSubmission}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
