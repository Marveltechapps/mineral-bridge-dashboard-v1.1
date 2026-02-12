import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Download,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
} from "lucide-react";
import {
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

const monthlyGSTData = [
  { month: "Jan", revenue: 4.2, gst: 0.76, commission: 0.28 },
  { month: "Feb", revenue: 5.8, gst: 1.04, commission: 0.39 },
  { month: "Mar", revenue: 6.5, gst: 1.17, commission: 0.43 },
  { month: "Apr", revenue: 8.2, gst: 1.48, commission: 0.55 },
  { month: "May", revenue: 7.1, gst: 1.28, commission: 0.47 },
  { month: "Jun", revenue: 9.5, gst: 1.71, commission: 0.63 },
  { month: "Jul", revenue: 11.2, gst: 2.02, commission: 0.75 },
  { month: "Aug", revenue: 8.9, gst: 1.60, commission: 0.59 },
  { month: "Sep", revenue: 12.5, gst: 2.25, commission: 0.83 },
  { month: "Oct", revenue: 13.8, gst: 2.48, commission: 0.92 },
  { month: "Nov", revenue: 11.9, gst: 2.14, commission: 0.79 },
];

const paymentSplitData = [
  { name: "UPI", value: 45, amount: 54.2 },
  { name: "Bank Transfer", value: 35, amount: 42.1 },
  { name: "Card", value: 15, amount: 18.0 },
  { name: "Wallet", value: 5, amount: 6.0 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

export function ReportsGSTPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Reports & GST Export</h1>
          <p className="text-muted-foreground">
            Generate financial reports and GST compliance documents
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="november">
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="november">November 2024</SelectItem>
              <SelectItem value="october">October 2024</SelectItem>
              <SelectItem value="september">September 2024</SelectItem>
              <SelectItem value="q3">Q3 2024</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">GST Report</p>
              <p className="text-xl font-medium">Nov 2024</p>
            </div>
            <Button className="w-full gap-2" size="sm">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Revenue Summary</p>
              <p className="text-xl font-medium">Detailed</p>
            </div>
            <Button className="w-full gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Commission Report</p>
              <p className="text-xl font-medium">Monthly</p>
            </div>
            <Button className="w-full gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Payment Methods</p>
              <p className="text-xl font-medium">Analysis</p>
            </div>
            <Button className="w-full gap-2" size="sm" variant="outline">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* GST Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>GST Summary - November 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Taxable Value</p>
              <p className="text-2xl font-medium">₹10.08 Cr</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total GST Collected</p>
              <p className="text-2xl font-medium">₹1.81 Cr</p>
              <p className="text-xs text-muted-foreground mt-1">@ 18%</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">CGST</p>
              <p className="text-2xl font-medium">₹0.91 Cr</p>
              <p className="text-xs text-muted-foreground mt-1">9%</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">SGST</p>
              <p className="text-2xl font-medium">₹0.91 Cr</p>
              <p className="text-xs text-muted-foreground mt-1">9%</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Filing Status</p>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mt-1">
                Ready to File
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Preview GSTR-1
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download GST Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend - 2/3 width */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & GST Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyGSTData}>
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
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue (Cr)" />
                <Bar dataKey="gst" fill="#10b981" radius={[4, 4, 0, 0]} name="GST (Cr)" />
                <Bar dataKey="commission" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Commission (Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Split - 1/3 width */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Payment Method Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentSplitData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {paymentSplitData.map((method, index) => (
                <div key={method.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm font-medium">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{method.amount} Cr</p>
                    <p className="text-xs text-muted-foreground">{method.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Generator */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select defaultValue="revenue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="gst">GST Report</SelectItem>
                <SelectItem value="commission">Commission Report</SelectItem>
                <SelectItem value="transactions">Transaction Report</SelectItem>
                <SelectItem value="agents">Agent Performance</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>

            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <Card className="border-border/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2">GST Filing Reminder</h3>
              <p className="text-sm text-muted-foreground mb-4">
                GSTR-1 for November 2024 is due on 11th December 2024. Please ensure all invoices are verified before filing.
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Verify & File
                </Button>
                <Button size="sm" variant="outline">
                  Set Reminder
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
