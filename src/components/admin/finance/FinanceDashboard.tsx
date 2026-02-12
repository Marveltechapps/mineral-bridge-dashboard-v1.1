import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4.2, commissions: 0.28, agentPayout: 0.15 },
  { month: "Feb", revenue: 5.8, commissions: 0.39, agentPayout: 0.21 },
  { month: "Mar", revenue: 6.5, commissions: 0.43, agentPayout: 0.24 },
  { month: "Apr", revenue: 8.2, commissions: 0.55, agentPayout: 0.30 },
  { month: "May", revenue: 7.1, commissions: 0.47, agentPayout: 0.26 },
  { month: "Jun", revenue: 9.5, commissions: 0.63, agentPayout: 0.35 },
  { month: "Jul", revenue: 11.2, commissions: 0.75, agentPayout: 0.41 },
  { month: "Aug", revenue: 8.9, commissions: 0.59, agentPayout: 0.33 },
  { month: "Sep", revenue: 12.5, commissions: 0.83, agentPayout: 0.46 },
  { month: "Oct", revenue: 13.8, commissions: 0.92, agentPayout: 0.51 },
  { month: "Nov", revenue: 11.9, commissions: 0.79, agentPayout: 0.44 },
];

const paymentMethodData = [
  { name: "UPI", value: 45, amount: 54.2 },
  { name: "Bank Transfer", value: 35, amount: 42.1 },
  { name: "Card", value: 15, amount: 18.0 },
  { name: "Wallet", value: 5, amount: 6.0 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

const recentTransactions = [
  {
    id: "TXN001",
    date: "2024-11-11 14:30",
    user: "Rajesh Kumar",
    property: "Skyline Towers - Unit 402",
    amount: "₹85 Lakh",
    type: "Buy",
    status: "success",
  },
  {
    id: "TXN002",
    date: "2024-11-11 12:15",
    user: "Ahmed Al-Rashid",
    property: "Marina Bay Apartment",
    amount: "AED 2.5M",
    type: "Buy",
    status: "pending",
  },
  {
    id: "TXN003",
    date: "2024-11-10 16:45",
    user: "Priya Sharma",
    property: "Green Valley Villa",
    amount: "₹1.2 Cr",
    type: "Sell",
    status: "success",
  },
  {
    id: "TXN004",
    date: "2024-11-10 10:20",
    user: "Michael Chen",
    property: "Downtown Loft",
    amount: "₹96.5 Lakh",
    type: "Exchange",
    status: "failed",
  },
];

export function FinanceDashboard() {
  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Payments & Finance</h1>
          <p className="text-muted-foreground">
            Comprehensive financial overview and transaction management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                18.3%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl mb-2">₹124.5 Cr</p>
              <p className="text-sm text-muted-foreground">This month: ₹11.9 Cr</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Commissions */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                22.1%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Commissions</p>
              <p className="text-3xl mb-2">₹8.2 Cr</p>
              <p className="text-sm text-muted-foreground">Avg rate: 6.6%</p>
            </div>
          </CardContent>
        </Card>

        {/* Agent Payouts */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                <ArrowDown className="h-3 w-3" />
                5.2%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Agent Payouts</p>
              <p className="text-3xl mb-2">₹4.5 Cr</p>
              <p className="text-sm text-muted-foreground">24 agents paid</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                24 Pending
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
              <p className="text-3xl mb-2">₹9.3 Cr</p>
              <p className="text-sm text-muted-foreground">Awaiting confirmation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Refunds Issued */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline">8 This Month</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Refunds Issued</p>
              <p className="text-3xl mb-2">₹42 Lakh</p>
              <p className="text-sm text-muted-foreground">0.34% of total revenue</p>
            </div>
          </CardContent>
        </Card>

        {/* Disputes in Progress */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                5 Active
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Disputes in Progress</p>
              <p className="text-3xl mb-2">5</p>
              <p className="text-sm text-muted-foreground">Amount at stake: ₹1.8 Cr</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Success Rate */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Excellent
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payment Success Rate</p>
              <p className="text-3xl mb-2">98.5%</p>
              <p className="text-sm text-muted-foreground">1.5% failure rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - 2/3 width */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Commissions Trend</CardTitle>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Revenue (Cr)"
                  dot={{ fill: "#6366f1", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="commissions"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Commissions (Cr)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="agentPayout"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Agent Payout (Cr)"
                  dot={{ fill: "#f59e0b", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods - 1/3 width */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((method, index) => (
                <div key={method.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{method.name}</span>
                  </div>
                  <span className="font-medium">₹{method.amount} Cr</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Transactions</span>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm text-muted-foreground">{txn.id}</span>
                    <span className="text-xs text-muted-foreground">{txn.date}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{txn.user}</p>
                    <p className="text-sm text-muted-foreground">{txn.property}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{txn.type}</Badge>
                    <span className="font-medium min-w-[100px] text-right">{txn.amount}</span>
                    <Badge className={getStatusColor(txn.status)}>
                      {txn.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
