import React from "react";
import { 
  Users, 
  Gem as GemIcon, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileText,
  MessageSquare,
  Gavel,
  Truck,
  Megaphone,
  BarChart3,
  Settings,
  ShieldCheck,
  HelpCircle,
  Link2
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDashboardStats, useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";

interface DashboardProps {
  onViewChange?: (view: string) => void;
  onOpenOrder?: (orderId: string, type: "sell" | "buy") => void;
  onOpenTransaction?: (transactionId: string) => void;
  onOpenUser?: (userId: string) => void;
}

const QUICK_ACCESS: { view: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: "users", label: "User Management", icon: Users },
  { view: "minerals", label: "Buyer Management", icon: GemIcon },
  { view: "sell-minerals", label: "Seller Management", icon: ShoppingCart },
  { view: "orders", label: "Orders & Settlements", icon: ShoppingCart },
  { view: "enquiries", label: "Enquiry & Support", icon: MessageSquare },
  { view: "finance", label: "Financial Reporting", icon: DollarSign },
  { view: "compliance", label: "Compliance & Verification", icon: ShieldCheck },
  { view: "disputes", label: "Disputes & Resolution", icon: Gavel },
  { view: "logistics", label: "Logistics", icon: Truck },
  { view: "partners", label: "Partners & Vendors", icon: Users },
  { view: "content", label: "Content & Marketing", icon: Megaphone },
  { view: "analytics", label: "Analytics & Insights", icon: BarChart3 },
  { view: "insurance", label: "Insurance", icon: ShieldCheck },
  { view: "settings", label: "Settings", icon: Settings },
  { view: "audit-log", label: "Audit & Activity Log", icon: FileText },
  { view: "help", label: "Help & Documentation", icon: HelpCircle },
];

export function Dashboard({ onViewChange, onOpenOrder, onOpenTransaction, onOpenUser }: DashboardProps) {
  const { state } = useDashboardStore();
  const { totalUsers, pendingOrders, revenueSum, usersUnderReview, recentOrders, recentTransactions, hasFailedTx, openEnquiriesCount, callbackRequestsCount } = useDashboardStats();
  const recentAppActivity = state.appActivities.slice(0, 8);
  const verifiedMineralsCount = state.minerals.filter((m) => m.verificationStatus === "Verified").length;
  const totalMineralsCount = state.minerals.length;
  const sellSubmissionsCount = state.mineralSubmissions.length;
  const sellSubmissionsInReview = state.mineralSubmissions.filter((s) => s.status === "In Review").length;

  const stats = [
    {
      title: "Total Users",
      value: String(totalUsers),
      change: "—",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      view: "users" as const
    },
    {
      title: "Verified Minerals",
      value: String(verifiedMineralsCount),
      change: totalMineralsCount ? `${totalMineralsCount} total` : "—",
      trend: "up" as const,
      icon: GemIcon,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
      view: "minerals" as const
    },
    {
      title: "Pending Orders",
      value: String(pendingOrders),
      change: "—",
      trend: Number(pendingOrders) > 0 ? "up" as const : "down" as const,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      view: "orders" as const
    },
    {
      title: "Revenue (Settled)",
      value: revenueSum >= 1e6 ? `$${(revenueSum / 1e6).toFixed(2)}M` : `$${revenueSum.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      change: "—",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
      view: "finance" as const
    },
    {
      title: "Sell Submissions",
      value: String(sellSubmissionsCount),
      change: sellSubmissionsInReview ? `${sellSubmissionsInReview} in review` : "—",
      trend: "up" as const,
      icon: FileText,
      color: "text-sky-600 bg-sky-50 dark:bg-sky-900/20",
      view: "sell-minerals" as const
    },
    {
      title: "Need support",
      value: String(openEnquiriesCount),
      change: openEnquiriesCount > 0 ? (callbackRequestsCount > 0 ? `${callbackRequestsCount} callback(s)` : "open ticket(s)") : "—",
      trend: openEnquiriesCount > 0 ? ("up" as const) : ("down" as const),
      icon: HelpCircle,
      color: openEnquiriesCount > 0 ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20" : "text-slate-600 bg-slate-50 dark:bg-slate-900/20",
      view: "enquiries" as const
    }
  ];

  const recentActivities = [
    ...recentTransactions.slice(0, 2).map((t, i) => ({
      id: `tx-${i}`,
      type: "transaction" as const,
      user: t.orderId,
      action: t.status === "Completed" ? "settled" : "pending",
      target: t.mineral,
      amount: t.finalAmount,
      time: `${t.date} ${t.time}`,
      status: t.status === "Completed" ? "completed" as const : "pending" as const,
      transactionId: t.id,
    })),
    ...recentOrders.slice(0, 2).map((o, i) => ({
      id: `ord-${i}`,
      type: "mineral" as const,
      user: o.type === "Buy" ? "Buy order" : "Sell order",
      action: "created",
      target: `${o.mineral} (${o.qty} ${o.unit})`,
      amount: o.aiEstimatedAmount,
      time: o.createdAt,
      status: o.status === "Completed" ? "completed" as const : "review" as const,
      orderId: o.id,
      orderType: o.type as "Buy" | "Sell",
    }))
  ].slice(0, 5);

  const alerts = [
    usersUnderReview > 0 && {
      id: 1,
      title: "KYC Verification Pending",
      description: `${usersUnderReview} user(s) from registry require verification`,
      severity: "high" as const,
      view: "users" as const
    },
    ...(hasFailedTx
      ? [{ id: 2, title: "Payment Settlement Failed", description: "One or more transactions failed processing", severity: "critical" as const, view: "finance" as const }]
      : []),
    openEnquiriesCount > 0 && {
      id: 22,
      title: "Need help or support",
      description: callbackRequestsCount > 0
        ? `${openEnquiriesCount} open enquiry(s) – ${callbackRequestsCount} callback request(s) from app`
        : `${openEnquiriesCount} open enquiry(s) – transactions or orders may need support`,
      severity: "high" as const,
      view: "enquiries" as const
    },
    Number(pendingOrders) > 0 && {
      id: 3,
      title: "Pending Orders",
      description: `${pendingOrders} order(s) awaiting action`,
      severity: "medium" as const,
      view: "orders" as const
    },
    { id: 4, title: "SGS Lab Delay", description: "3 Gold purity tests exceeding 24h TAT", severity: "high" as const, view: "partners" as const }
  ].filter(Boolean) as { id: number; title: string; description: string; severity: string; view?: string }[];

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onViewChange?.('minerals')} variant="outline" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approve Minerals
          </Button>
          <Button onClick={() => onViewChange?.('orders')} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <ShoppingCart className="w-4 h-4" />
            View Transactions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-none shadow-sm bg-white dark:bg-slate-900 cursor-pointer transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            onClick={() => stat.view && onViewChange?.(stat.view)}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <span className={`text-xs font-medium flex items-center ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => {
                const isClickable = (activity.type === "transaction" && "transactionId" in activity && onOpenTransaction) || (activity.type === "mineral" && "orderId" in activity && onOpenOrder);
                return (
                  <div
                    key={activity.id}
                    role={isClickable ? "button" : undefined}
                    tabIndex={isClickable ? 0 : undefined}
                    onClick={() => {
                      if (activity.type === "transaction" && "transactionId" in activity && onOpenTransaction) onOpenTransaction(activity.transactionId);
                      if (activity.type === "mineral" && "orderId" in activity && onOpenOrder) onOpenOrder(activity.orderId, activity.orderType === "Buy" ? "buy" : "sell");
                    }}
                    onKeyDown={(e) => {
                      if (isClickable && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        if (activity.type === "transaction" && "transactionId" in activity && onOpenTransaction) onOpenTransaction(activity.transactionId);
                        if (activity.type === "mineral" && "orderId" in activity && onOpenOrder) onOpenOrder(activity.orderId, activity.orderType === "Buy" ? "buy" : "sell");
                      }
                    }}
                    className={`flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0 ${isClickable ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg -mx-2 px-2 transition-colors" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {activity.user.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span> <span className="font-medium text-slate-900 dark:text-slate-100">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {activity.amount && (
                        <span className="font-medium text-sm">{activity.amount}</span>
                      )}
                      <Badge variant="secondary" className={`text-xs font-normal
                        ${activity.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : ''}
                        ${activity.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : ''}
                        ${activity.status === 'review' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : ''}
                      `}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              System Alerts
            </CardTitle>
            <CardDescription>Critical items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-500 dark:bg-red-900/10' :
                  alert.severity === 'high' ? 'bg-amber-50 border-amber-500 dark:bg-amber-900/10' :
                  'bg-blue-50 border-blue-500 dark:bg-blue-900/10'
                }`}>
                  <h4 className={`text-sm font-semibold mb-1 ${
                    alert.severity === 'critical' ? 'text-red-700 dark:text-red-400' :
                    alert.severity === 'high' ? 'text-amber-700 dark:text-amber-400' :
                    'text-blue-700 dark:text-blue-400'
                  }`}>
                    {alert.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {alert.description}
                  </p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs font-medium" onClick={() => onViewChange?.(alert.view || 'orders')}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity from app – small details from app flows reflected in dashboard */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle>Recent activity from app</CardTitle>
          <CardDescription>Edits and actions from the main app (onboarding, profile, KYC, listings) reflected here.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAppActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No app activity yet. When users update profile, complete KYC, or submit orders in the app, they appear here.</p>
          ) : (
            <ul className="space-y-3">
              {recentAppActivity.map((a) => (
                <li
                  key={a.id}
                  role={onOpenUser && a.userId ? "button" : undefined}
                  tabIndex={onOpenUser && a.userId ? 0 : undefined}
                  onClick={() => onOpenUser && a.userId && onOpenUser(a.userId)}
                  onKeyDown={(e) => { if (onOpenUser && a.userId && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpenUser(a.userId); } }}
                  className={`flex items-start gap-3 text-sm border-b border-border/50 pb-3 last:border-0 last:pb-0 ${onOpenUser && a.userId ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg -mx-2 px-2 transition-colors" : ""}`}
                >
                  <span className="font-medium text-slate-900 dark:text-white shrink-0">{getRegistryUserName(state.registryUsers, a.userId)}</span>
                  <span className="text-muted-foreground">{a.description}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{new Date(a.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewChange?.("audit-log")}>View full audit log</Button>
            <Button variant="outline" size="sm" onClick={() => onViewChange?.("users")}>View User Management</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick access – entire app from dashboard */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-emerald-600" />
            Quick access
          </CardTitle>
          <CardDescription>Jump to any section from the dashboard. The full admin portal is available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
            {QUICK_ACCESS.map((item) => (
              <Button
                key={item.view}
                variant="outline"
                size="sm"
                className="h-auto py-3 px-4 justify-start gap-2 text-left font-normal"
                onClick={() => onViewChange?.(item.view)}
              >
                <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="truncate">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}