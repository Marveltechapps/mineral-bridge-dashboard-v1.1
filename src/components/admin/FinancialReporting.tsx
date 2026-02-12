import { useMemo } from "react";
import { 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";

export function FinancialReporting() {
  const { state } = useDashboardStore();
  const transactions = useMemo(
    () =>
      state.transactions.map((tx) => ({
        id: tx.id,
        date: tx.date,
        description: `${tx.orderType} - ${tx.mineral} (${tx.orderId})`,
        amount: tx.status === "Completed" ? `+${tx.finalAmount}` : `-${tx.finalAmount}`,
        type: tx.status === "Completed" ? "Credit" : "Debit",
        status: tx.status,
      })),
    [state.transactions]
  );
  const totalRevenue = useMemo(
    () =>
      state.transactions
        .filter((t) => t.status === "Completed")
        .reduce((s, t) => s + parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0, 0),
    [state.transactions]
  );
  const pendingAmount = useMemo(
    () =>
      state.transactions
        .filter((t) => t.status === "Pending")
        .reduce((s, t) => s + parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0, 0),
    [state.transactions]
  );
  const failedCount = state.transactions.filter((t) => t.status === "Failed").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial & Reporting</h1>
          <p className="text-muted-foreground">Track revenue, settlements, and generate financial reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Oct 2024
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue >= 1e6 ? (totalRevenue / 1e6).toFixed(2) + "M" : totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              From settled transactions
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${pendingAmount >= 1e6 ? (pendingAmount / 1e6).toFixed(2) + "M" : pendingAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {state.transactions.filter((t) => t.status === "Pending").length} transaction(s) pending
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registry Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.registryUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Linked from User Management
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-end justify-between gap-2 px-4">
              {[35, 45, 30, 60, 55, 70, 65, 80, 75, 90, 85, 95].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full">
                  <div 
                    className="w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors rounded-t-sm" 
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground uppercase">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{trx.description}</p>
                    <p className="text-xs text-muted-foreground">{trx.date}</p>
                  </div>
                  <div className="text-right">
                     <p className={`text-sm font-medium ${trx.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'}`}>
                      {trx.amount}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{trx.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6">View All Transactions</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Settlement Queue</CardTitle>
          <CardDescription>Payments waiting for blockchain confirmation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User (Registry)</TableHead>
                <TableHead>Order Ref</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Initiated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.transactions.map((tx) => {
              const order = [...state.buyOrders, ...state.sellOrders].find((o) => o.id === tx.orderId);
              return (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell className="text-sm text-slate-700 dark:text-slate-300">{getRegistryUserName(state.registryUsers, order?.userId)}</TableCell>
                  <TableCell>{tx.orderId}</TableCell>
                  <TableCell>{tx.finalAmount}</TableCell>
                  <TableCell>{tx.date} {tx.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tx.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm">Details</Button></TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}