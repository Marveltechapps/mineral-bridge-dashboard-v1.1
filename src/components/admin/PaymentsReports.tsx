import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
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
import {
  DollarSign,
  Download,
  Search,
  TrendingUp,
  ArrowUp,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4.2, commission: 0.28 },
  { month: "Feb", revenue: 5.8, commission: 0.39 },
  { month: "Mar", revenue: 6.5, commission: 0.43 },
  { month: "Apr", revenue: 8.2, commission: 0.55 },
  { month: "May", revenue: 7.1, commission: 0.47 },
  { month: "Jun", revenue: 9.5, commission: 0.63 },
  { month: "Jul", revenue: 11.2, commission: 0.75 },
  { month: "Aug", revenue: 8.9, commission: 0.59 },
  { month: "Sep", revenue: 12.5, commission: 0.83 },
  { month: "Oct", revenue: 13.8, commission: 0.92 },
  { month: "Nov", revenue: 11.9, commission: 0.79 },
];

const mockTransactions = [
  {
    id: "T001",
    buyer: "Rajesh Kumar",
    seller: "Property Owner Corp",
    property: "Skyline Towers - Unit 402",
    amount: "₹85 Lakh",
    commission: "₹5.1 Lakh",
    paymentMode: "Bank Transfer",
    status: "completed",
    date: "2024-11-05",
  },
  {
    id: "T002",
    buyer: "Ahmed Al-Rashid",
    seller: "Marina Bay Developer",
    property: "Marina Bay Apartment",
    amount: "AED 2.5M",
    commission: "AED 150K",
    paymentMode: "Wire Transfer",
    status: "pending",
    date: "2024-11-06",
  },
  {
    id: "T003",
    buyer: "Sanya Malhotra",
    seller: "Riverside Residency",
    property: "Riverside Penthouse",
    amount: "₹2.8 Cr",
    commission: "₹16.8 Lakh",
    paymentMode: "Bank Transfer",
    status: "completed",
    date: "2024-10-28",
  },
  {
    id: "T004",
    buyer: "Michael Chen",
    seller: "Robert Taylor",
    property: "Exchange: Downtown Loft ↔ Suburban Villa",
    amount: "₹96.5 Lakh",
    commission: "₹5.8 Lakh",
    paymentMode: "UPI",
    status: "processing",
    date: "2024-11-03",
  },
];

export function PaymentsReports() {
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return variants[status as keyof typeof variants];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Payments & Reports</h1>
          <p className="text-muted-foreground">
            Track transactions, revenue, and generate financial reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                18%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl mb-2">₹124.5 Cr</p>
              <p className="text-sm text-muted-foreground">This month: ₹11.9 Cr</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                22%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Commission</p>
              <p className="text-3xl mb-2">₹8.2 Cr</p>
              <p className="text-sm text-muted-foreground">Avg rate: 6.6%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl mb-2">268</p>
              <p className="text-sm text-muted-foreground">₹115.2 Cr processed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl mb-2">24</p>
              <p className="text-sm text-muted-foreground">₹9.3 Cr in progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Commission Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="commission" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
                placeholder="Search transactions..."
                className="pl-10"
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="wire">Wire Transfer</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="month">
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/20">
                    <TableCell>
                      <span className="font-mono text-sm font-medium">
                        {transaction.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium max-w-xs truncate">
                        {transaction.property}
                      </p>
                    </TableCell>
                    <TableCell>{transaction.buyer}</TableCell>
                    <TableCell>{transaction.seller}</TableCell>
                    <TableCell>
                      <span className="font-medium">{transaction.amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {transaction.commission}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.paymentMode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(transaction.status)}>
                        {transaction.status === "completed" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "failed" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
