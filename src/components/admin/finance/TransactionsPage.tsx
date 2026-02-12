import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
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
  Search,
  Download,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  user: string;
  agent: string;
  property: string;
  amount: string;
  paymentType: "UPI" | "Bank Transfer" | "Card" | "Wallet";
  status: "success" | "pending" | "failed";
  project: string;
  invoiceId: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    date: "2024-11-11 14:30",
    user: "Rajesh Kumar",
    agent: "Sarah Mitchell",
    property: "Skyline Towers - Unit 402",
    amount: "₹85,00,000",
    paymentType: "Bank Transfer",
    status: "success",
    project: "Mumbai Central",
    invoiceId: "INV-2024-001",
  },
  {
    id: "TXN002",
    date: "2024-11-11 12:15",
    user: "Ahmed Al-Rashid",
    agent: "John Davis",
    property: "Marina Bay Apartment",
    amount: "AED 2,500,000",
    paymentType: "Bank Transfer",
    status: "pending",
    project: "Dubai Marina",
    invoiceId: "INV-2024-002",
  },
  {
    id: "TXN003",
    date: "2024-11-10 16:45",
    user: "Priya Sharma",
    agent: "Sarah Mitchell",
    property: "Green Valley Villa",
    amount: "₹1,20,00,000",
    paymentType: "UPI",
    status: "success",
    project: "Bangalore Tech",
    invoiceId: "INV-2024-003",
  },
  {
    id: "TXN004",
    date: "2024-11-10 10:20",
    user: "Michael Chen",
    agent: "Emma Wilson",
    property: "Downtown Loft",
    amount: "₹96,50,000",
    paymentType: "Card",
    status: "failed",
    project: "Pune Metro",
    invoiceId: "INV-2024-004",
  },
  {
    id: "TXN005",
    date: "2024-11-09 15:00",
    user: "Sanya Malhotra",
    agent: "David Kumar",
    property: "Riverside Penthouse",
    amount: "₹2,80,00,000",
    paymentType: "Bank Transfer",
    status: "success",
    project: "Pune Metro",
    invoiceId: "INV-2024-005",
  },
  {
    id: "TXN006",
    date: "2024-11-09 11:30",
    user: "Robert Taylor",
    agent: "Lisa Anderson",
    property: "Tech Park Office",
    amount: "₹3,50,00,000",
    paymentType: "Bank Transfer",
    status: "success",
    project: "Hyderabad Hub",
    invoiceId: "INV-2024-006",
  },
  {
    id: "TXN007",
    date: "2024-11-08 14:20",
    user: "Vikram Patel",
    agent: "Sarah Mitchell",
    property: "Lakeside Plot - 500 sqyd",
    amount: "₹45,00,000",
    paymentType: "UPI",
    status: "pending",
    project: "Chennai Lakes",
    invoiceId: "INV-2024-007",
  },
  {
    id: "TXN008",
    date: "2024-11-08 09:45",
    user: "Anita Desai",
    agent: "John Davis",
    property: "Sunrise Apartments 2 BHK",
    amount: "₹65,00,000",
    paymentType: "Card",
    status: "success",
    project: "Mumbai Central",
    invoiceId: "INV-2024-008",
  },
];

export function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesPaymentType =
      paymentTypeFilter === "all" || txn.paymentType === paymentTypeFilter;
    const matchesAgent = agentFilter === "all" || txn.agent === agentFilter;
    const matchesProject = projectFilter === "all" || txn.project === projectFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPaymentType &&
      matchesAgent &&
      matchesProject
    );
  });

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status as keyof typeof colors];
  };

  const getPaymentTypeColor = (type: string) => {
    const colors = {
      UPI: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "Bank Transfer": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Card: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      Wallet: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    };
    return colors[type as keyof typeof colors];
  };

  const stats = {
    total: transactions.length,
    success: transactions.filter((t) => t.status === "success").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            Complete transaction history across all projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success</p>
                <p className="text-2xl">{stats.success}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="Mumbai Central">Mumbai Central</SelectItem>
                <SelectItem value="Dubai Marina">Dubai Marina</SelectItem>
                <SelectItem value="Bangalore Tech">Bangalore Tech</SelectItem>
                <SelectItem value="Pune Metro">Pune Metro</SelectItem>
                <SelectItem value="Hyderabad Hub">Hyderabad Hub</SelectItem>
                <SelectItem value="Chennai Lakes">Chennai Lakes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{txn.date.split(" ")[0]}</span>
                        <span className="text-xs text-muted-foreground">
                          {txn.date.split(" ")[1]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm font-medium">{txn.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {txn.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{txn.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{txn.agent}</span>
                    </TableCell>
                    <TableCell>
                      <span className="max-w-[200px] truncate block">{txn.property}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{txn.amount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentTypeColor(txn.paymentType)}>
                        {txn.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(txn.status)}>
                        {txn.status === "success" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {txn.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {txn.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.project}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        {txn.invoiceId}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
