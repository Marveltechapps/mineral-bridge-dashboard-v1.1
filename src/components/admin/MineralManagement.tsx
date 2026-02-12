import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus,
  CheckCircle2,
  XCircle,
  Gem,
  BarChart,
  Tag,
  CalendarIcon,
  Trash2,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  X,
  History,
  MessageSquare,
  Send,
  CreditCard,
  MapPin,
  Ban,
  RefreshCw,
  FileText
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mineral } from "./minerals/types";
import { format } from "date-fns";
import { useDashboardStore, getRegistryUserName, getOrderIsInternational } from "../../store/dashboardStore";
import type { Order } from "../../store/dashboardStore";

function getOrderStatusColor(status: string) {
  switch (status) {
    case "Completed":
    case "Settled":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Sample Test Required":
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Rejected":
    case "Failed":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  }
}

export interface MineralManagementProps {
  onOpenOrderDetail?: (orderId: string) => void;
  onOpenMineralDetail?: (mineralId: string) => void;
  /** Open add form when called with no arg, or edit form when called with mineralId. */
  onOpenMineralForm?: (mineralId?: string) => void;
  /** Open Enquiry & Support (chat/support) for this user. */
  onNavigateToSupport?: (userId: string) => void;
}

export function MineralManagement({ onOpenOrderDetail, onOpenMineralDetail, onOpenMineralForm, onNavigateToSupport }: MineralManagementProps) {
  const { state, dispatch } = useDashboardStore();
  const minerals = state.minerals;
  const buyOrders = state.buyOrders;
  const [activeTab, setActiveTab] = useState<"from-app" | "orders">("from-app");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mineralToDelete, setMineralToDelete] = useState<Mineral | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [originFilter, setOriginFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: "", max: "" });
  const [orderScopeFilter, setOrderScopeFilter] = useState<"all" | "domestic" | "international">("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleDelete = () => {
    if (mineralToDelete) {
      dispatch({ type: "REMOVE_MINERAL", payload: mineralToDelete.id });
      setMineralToDelete(null);
    }
  };

  const uniqueOrigins = Array.from(new Set(minerals.map(m => m.country)));

  const filteredMinerals = minerals.filter(m => {
    // Search term
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(m.verificationStatus);
    
    // Origin filter
    const matchesOrigin = originFilter.length === 0 || originFilter.includes(m.country);
    
    // Price filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPrice = m.basePrice >= minPrice && m.basePrice <= maxPrice;

    // Date filter
    let matchesDate = true;
    if (dateRange.from) {
      if (dateRange.to) {
        matchesDate = m.createdAt >= dateRange.from && m.createdAt <= dateRange.to;
      } else {
        // Just check if it's on the same day or after
        matchesDate = m.createdAt >= dateRange.from;
      }
    }
    
    return matchesSearch && matchesStatus && matchesOrigin && matchesPrice && matchesDate;
  });

  const clearFilters = () => {
    setStatusFilter([]);
    setOriginFilter([]);
    setPriceRange({ min: "", max: "" });
    setDateRange({ from: undefined, to: undefined });
  };

  const activeFiltersCount = 
    statusFilter.length + 
    originFilter.length + 
    (priceRange.min || priceRange.max ? 1 : 0) + 
    (dateRange.from ? 1 : 0);

  // Pagination Logic
  const totalItems = filteredMinerals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedMinerals = filteredMinerals.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  // Pending Approvals specific logic
  const pendingMinerals = minerals.filter(m => m.verificationStatus === 'Pending');

  const filteredBuyOrders = buyOrders.filter((o) => {
    const term = orderSearchTerm.toLowerCase().trim();
    if (term) {
      const match = o.id.toLowerCase().includes(term) ||
        o.mineral.toLowerCase().includes(term) ||
        getRegistryUserName(state.registryUsers, o.userId).toLowerCase().includes(term);
      if (!match) return false;
    }
    if (orderScopeFilter === "domestic") return !getOrderIsInternational(o, state.registryUsers);
    if (orderScopeFilter === "international") return getOrderIsInternational(o, state.registryUsers);
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Buy Management</h1>
          <p className="text-muted-foreground">Buy list from the app and users&apos; buy list. Manage catalog, approvals, and buy orders.</p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-emerald-600">{minerals.length}</span> mineral(s) in catalog · <span className="font-medium text-emerald-600">{buyOrders.length}</span> buy order(s) from <span className="font-medium text-emerald-600">{new Set(buyOrders.map((o) => o.userId).filter(Boolean)).size}</span> user(s)
          </p>
        </div>
        
        <Button
          type="button"
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenMineralForm?.();
          }}
        >
          <Plus className="w-4 h-4" />
          Add New Mineral
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "from-app" | "orders")} className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="from-app" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Buy list (from app)
            <Badge variant="secondary" className="h-5 px-1.5">{minerals.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="orders" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Users&apos; buy list
            <Badge variant="secondary" className="h-5 px-1.5">{buyOrders.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="from-app" className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-blue-50 dark:bg-blue-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Listed</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{minerals.length}</h3>
            </div>
            <Gem className="w-8 h-8 text-blue-500/50" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-emerald-50 dark:bg-emerald-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified Minerals</p>
              <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {minerals.filter(m => m.verificationStatus === 'Verified').length}
              </h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50 dark:bg-amber-900/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {minerals.filter(m => m.verificationStatus === 'Pending').length}
              </h3>
            </div>
            <Tag className="w-8 h-8 text-amber-500/50" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="catalog" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Mineral Catalog</TabsTrigger>
          <TabsTrigger value="approvals" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            Pending Approvals
            {pendingMinerals.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {pendingMinerals.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="catalog" className="mt-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search minerals..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={`gap-2 ${activeFiltersCount > 0 ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
                        <Filter className="w-4 h-4" />
                        Filter
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="h-5 px-1.5 ml-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="end">
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
                            {['Verified', 'Pending', 'Rejected'].map(status => (
                              <Badge 
                                key={status}
                                variant={statusFilter.includes(status) ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => {
                                  setStatusFilter(prev => 
                                    prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                                  )
                                }}
                              >
                                {status}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Origin</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {uniqueOrigins.map(origin => (
                              <div key={origin} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`filter-origin-${origin}`}
                                  checked={originFilter.includes(origin)}
                                  onCheckedChange={(checked) => {
                                    if (checked) setOriginFilter(prev => [...prev, origin]);
                                    else setOriginFilter(prev => prev.filter(o => o !== origin));
                                  }}
                                />
                                <Label htmlFor={`filter-origin-${origin}`} className="text-sm font-normal cursor-pointer">
                                  {origin}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Price Range</h5>
                          <div className="flex items-center gap-2">
                            <Input 
                              placeholder="Min" 
                              type="number" 
                              className="h-8" 
                              value={priceRange.min}
                              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input 
                              placeholder="Max" 
                              type="number" 
                              className="h-8"
                              value={priceRange.max}
                              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Created Date</h5>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal h-8 ${!dateRange.from && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                  dateRange.to ? (
                                    <>
                                      {format(dateRange.from, "LLL dd, y")} -{" "}
                                      {format(dateRange.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(dateRange.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={dateRange as any} // Cast for now as types might mismatch slightly
                                onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Mineral Name</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Market Price</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMinerals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No minerals found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMinerals.map((mineral) => (
                      <TableRow
                        key={mineral.id}
                        className={onOpenMineralDetail ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" : undefined}
                        onClick={() => onOpenMineralDetail?.(mineral.id)}
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {mineral.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(mineral.createdAt, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-slate-100">{mineral.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{mineral.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {mineral.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="font-normal text-xs">{tag}</Badge>
                            ))}
                            {mineral.tags.length > 2 && <span className="text-xs text-muted-foreground">+{mineral.tags.length - 2}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {mineral.currency === 'USD' ? '$' : mineral.currency}{mineral.basePrice.toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {mineral.country}
                          <span className="block text-xs text-slate-400">{mineral.sourceType}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`
                            ${mineral.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20' : ''}
                            ${mineral.verificationStatus === 'Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20' : ''}
                            ${mineral.verificationStatus === 'Rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/20' : ''}
                          `}>
                            {mineral.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenMineralDetail?.(mineral.id); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                onClick={(e) => { e.stopPropagation(); setMineralToDelete(mineral); }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Listing
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
                Showing <span className="font-medium">{filteredMinerals.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalItems}</span> entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <Card className="border-none shadow-sm">
             <CardHeader className="pb-3">
               <div>
                  <h3 className="text-lg font-medium">Pending Approvals</h3>
                  <p className="text-sm text-muted-foreground">Review and verify new mineral listings.</p>
               </div>
             </CardHeader>
             <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Mineral Name</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Source Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMinerals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No pending approvals found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingMinerals.map((mineral) => (
                      <TableRow key={mineral.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {mineral.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(mineral.createdAt, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-slate-100">{mineral.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{mineral.description}</span>
                          </div>
                        </TableCell>
                         <TableCell>
                          {mineral.country}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs border px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                             {mineral.sourceType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20">
                            {mineral.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => onOpenMineralDetail?.(mineral.id)}>
                              <Eye className="h-3 w-3" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
                <Select value={orderScopeFilter} onValueChange={(v) => setOrderScopeFilter(v as "all" | "domestic" | "international")}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All orders</SelectItem>
                    <SelectItem value="domestic">Domestic only</SelectItem>
                    <SelectItem value="international">International only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Mineral</TableHead>
                    <TableHead>Mineral type</TableHead>
                    <TableHead>Qty / Unit</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Institutional buyer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                        No buy orders from users.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBuyOrders.map((order) => {
                      const isIntl = getOrderIsInternational(order, state.registryUsers);
                      return (
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
                        <TableCell>
                          <Badge variant="outline" className={isIntl ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 border-violet-200 text-xs" : "bg-slate-50 text-slate-600 dark:bg-slate-800 text-xs"}>
                            {isIntl ? "International" : "Domestic"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-sm">{order.mineral}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.mineralForm ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.qty} {order.unit}</TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">{order.aiEstimatedAmount}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.contactInfo?.institutionalBuyerCategory ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{order.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenOrderDetail?.(order.id); }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            {order.userId && onNavigateToSupport && (
                              <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onNavigateToSupport(order.userId!); }} title="Chat & Support">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Support
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredBuyOrders.length} buy order(s)
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!mineralToDelete} onOpenChange={(open) => !open && setMineralToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{mineralToDelete?.name}</span>? 
              This action cannot be undone. You can choose to edit the details instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={() => {
              if (mineralToDelete) {
                onOpenMineralForm?.(mineralToDelete.id);
                setMineralToDelete(null);
              }
            }}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
