import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Commission {
  id: string;
  propertyName: string;
  saleAmount: string;
  commissionRate: number;
  platformCommission: string;
  agentCommission: string;
  agentName: string;
  agentShare: number;
  saleDate: string;
  status: "paid" | "unpaid" | "pending";
  invoiceId: string;
  paymentDate?: string;
}

const mockCommissions: Commission[] = [
  {
    id: "COM001",
    propertyName: "Skyline Towers - Unit 402",
    saleAmount: "₹85,00,000",
    commissionRate: 6.0,
    platformCommission: "₹5,10,000",
    agentCommission: "₹2,55,000",
    agentName: "Sarah Mitchell",
    agentShare: 50,
    saleDate: "2024-11-11",
    status: "paid",
    invoiceId: "INV-2024-001",
    paymentDate: "2024-11-12",
  },
  {
    id: "COM002",
    propertyName: "Marina Bay Apartment",
    saleAmount: "AED 2,500,000",
    commissionRate: 6.5,
    platformCommission: "AED 162,500",
    agentCommission: "AED 97,500",
    agentName: "John Davis",
    agentShare: 60,
    saleDate: "2024-11-11",
    status: "unpaid",
    invoiceId: "INV-2024-002",
  },
  {
    id: "COM003",
    propertyName: "Green Valley Villa",
    saleAmount: "₹1,20,00,000",
    commissionRate: 7.0,
    platformCommission: "₹8,40,000",
    agentCommission: "₹4,20,000",
    agentName: "Sarah Mitchell",
    agentShare: 50,
    saleDate: "2024-11-10",
    status: "paid",
    invoiceId: "INV-2024-003",
    paymentDate: "2024-11-11",
  },
  {
    id: "COM004",
    propertyName: "Riverside Penthouse",
    saleAmount: "₹2,80,00,000",
    commissionRate: 6.0,
    platformCommission: "₹16,80,000",
    agentCommission: "₹8,40,000",
    agentName: "David Kumar",
    agentShare: 50,
    saleDate: "2024-11-09",
    status: "paid",
    invoiceId: "INV-2024-005",
    paymentDate: "2024-11-10",
  },
  {
    id: "COM005",
    propertyName: "Tech Park Office Space",
    saleAmount: "₹3,50,00,000",
    commissionRate: 8.0,
    platformCommission: "₹28,00,000",
    agentCommission: "₹14,00,000",
    agentName: "Lisa Anderson",
    agentShare: 50,
    saleDate: "2024-11-09",
    status: "unpaid",
    invoiceId: "INV-2024-006",
  },
  {
    id: "COM006",
    propertyName: "Lakeside Plot - 500 sqyd",
    saleAmount: "₹45,00,000",
    commissionRate: 5.5,
    platformCommission: "₹2,47,500",
    agentCommission: "₹1,23,750",
    agentName: "Sarah Mitchell",
    agentShare: 50,
    saleDate: "2024-11-08",
    status: "pending",
    invoiceId: "INV-2024-007",
  },
];

export function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredCommissions = commissions.filter((com) => {
    const matchesSearch =
      com.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      com.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      com.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || com.status === statusFilter;
    const matchesAgent = agentFilter === "all" || com.agentName === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const stats = {
    totalEarned: "₹8.2 Cr",
    totalPaid: "₹4.5 Cr",
    pending: "₹3.7 Cr",
    agents: new Set(commissions.map((c) => c.agentName)).size,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return colors[status as keyof typeof colors];
  };

  const handleMarkAsPaid = (id: string) => {
    setCommissions(
      commissions.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "paid" as const,
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );
    toast.success("Commission marked as paid");
  };

  const handleMarkAsUnpaid = (id: string) => {
    setCommissions(
      commissions.map((c) =>
        c.id === id ? { ...c, status: "unpaid" as const, paymentDate: undefined } : c
      )
    );
    toast.success("Commission marked as unpaid");
  };

  const handleViewDetails = (commission: Commission) => {
    setSelectedCommission(commission);
    setDetailDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Commissions</h1>
          <p className="text-muted-foreground">
            Track and manage marketplace and agent commissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
              <p className="text-3xl">{stats.totalEarned}</p>
              <p className="text-sm text-muted-foreground mt-1">Lifetime commissions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-3xl">{stats.totalPaid}</p>
              <p className="text-sm text-muted-foreground mt-1">To agents and platform</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl">{stats.pending}</p>
              <p className="text-sm text-muted-foreground mt-1">Awaiting payment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Agents</p>
              <p className="text-3xl">{stats.agents}</p>
              <p className="text-sm text-muted-foreground mt-1">Earning commissions</p>
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
                placeholder="Search by property, agent, or commission ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="Sarah Mitchell">Sarah Mitchell</SelectItem>
                <SelectItem value="John Davis">John Davis</SelectItem>
                <SelectItem value="David Kumar">David Kumar</SelectItem>
                <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Commission ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Sale Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Platform Share</TableHead>
                  <TableHead>Agent Share</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id} className="hover:bg-muted/20">
                    <TableCell>
                      <span className="font-mono text-sm font-medium">{commission.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate font-medium">{commission.propertyName}</p>
                        <p className="text-xs text-muted-foreground">{commission.invoiceId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{commission.saleAmount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{commission.commissionRate}%</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {commission.platformCommission}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {100 - commission.agentShare}% of commission
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {commission.agentCommission}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {commission.agentShare}% of commission
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {commission.agentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm">{commission.agentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(commission.saleDate).toLocaleDateString()}
                      </span>
                      {commission.paymentDate && (
                        <p className="text-xs text-muted-foreground">
                          Paid: {new Date(commission.paymentDate).toLocaleDateString()}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(commission.status)}>
                        {commission.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {commission.status === "unpaid" && <XCircle className="h-3 w-3 mr-1" />}
                        {commission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(commission)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {commission.status === "unpaid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(commission.id)}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Paid
                          </Button>
                        )}
                        {commission.status === "paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsUnpaid(commission.id)}
                            className="gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Mark Unpaid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
            <DialogDescription>Detailed breakdown of commission calculation and transaction linkage.</DialogDescription>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Commission ID</p>
                  <p className="font-mono font-medium">{selectedCommission.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Invoice ID</p>
                  <p className="font-mono font-medium">{selectedCommission.invoiceId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Property</p>
                  <p className="font-medium">{selectedCommission.propertyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Sale Amount</p>
                  <p className="text-xl font-medium">{selectedCommission.saleAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Commission Rate</p>
                  <p className="text-xl font-medium">{selectedCommission.commissionRate}%</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-3">Revenue Share Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div>
                      <p className="font-medium">Platform Commission</p>
                      <p className="text-sm text-muted-foreground">
                        {100 - selectedCommission.agentShare}% of total commission
                      </p>
                    </div>
                    <p className="text-xl font-medium text-green-600 dark:text-green-400">
                      {selectedCommission.platformCommission}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div>
                      <p className="font-medium">Agent Commission</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCommission.agentShare}% of total commission • {selectedCommission.agentName}
                      </p>
                    </div>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                      {selectedCommission.agentCommission}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Sale Date</p>
                    <p className="font-medium">
                      {new Date(selectedCommission.saleDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                    <Badge className={getStatusColor(selectedCommission.status)}>
                      {selectedCommission.status}
                    </Badge>
                  </div>
                  {selectedCommission.paymentDate && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="font-medium">
                        {new Date(selectedCommission.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download Statement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
