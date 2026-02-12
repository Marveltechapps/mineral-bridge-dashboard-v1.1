import { useState } from "react";
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Info, 
  X, 
  Filter, 
  Clock, 
  Package, 
  UserPlus, 
  CreditCard, 
  FileText,
  ShieldAlert,
  Search,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";

type NotificationType = "order" | "user" | "system" | "payment" | "security" | "info";
type NotificationPriority = "high" | "medium" | "low";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "High Value Order Received",
    message: "Order #ORD-2024-889 from TechCorp Industries requires immediate verification. Value: $45,000.",
    type: "order",
    priority: "high",
    timestamp: "10 minutes ago",
    read: false,
    actionLabel: "Review Order",
    actionUrl: "orders"
  },
  {
    id: "2",
    title: "New Platinum User Registration",
    message: "Global Mining Solutions has registered as a seller. KYC documents pending review.",
    type: "user",
    priority: "medium",
    timestamp: "45 minutes ago",
    read: false,
    actionLabel: "Verify KYC",
    actionUrl: "users"
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur on Sunday at 2:00 AM UTC. Expected downtime: 30 mins.",
    type: "system",
    priority: "low",
    timestamp: "2 hours ago",
    read: true
  },
  {
    id: "4",
    title: "Payment Settlement Failed",
    message: "Settlement for Transaction #TX-992 failed due to network congestion. Retry initiated.",
    type: "payment",
    priority: "high",
    timestamp: "3 hours ago",
    read: false,
    actionLabel: "View Details",
    actionUrl: "finance"
  },
  {
    id: "5",
    title: "Low Inventory Alert",
    message: "Copper Cathode stock for warehouse A2 is below the minimum threshold (500 MT).",
    type: "info",
    priority: "medium",
    timestamp: "5 hours ago",
    read: true
  },
  {
    id: "6",
    title: "Suspicious Login Attempt",
    message: "We blocked a login attempt from an unrecognized device in Lagos, Nigeria.",
    type: "security",
    priority: "high",
    timestamp: "1 day ago",
    read: true,
    actionLabel: "Security Log",
    actionUrl: "settings"
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "order": return <Package className="h-5 w-5 text-blue-500" />;
      case "user": return <UserPlus className="h-5 w-5 text-emerald-500" />;
      case "payment": return <CreditCard className="h-5 w-5 text-purple-500" />;
      case "security": return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "info": return <Info className="h-5 w-5 text-slate-500" />;
      case "system": return <Bell className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "low": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread" && n.read) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                {unreadCount} New
              </Badge>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your alerts and system updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button 
            variant={filter === "all" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            All
          </Button>
          <Button 
            variant={filter === "unread" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Unread
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          <select 
            className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as NotificationType | "all")}
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="user">Users</option>
            <option value="payment">Payments</option>
            <option value="security">Security</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search notifications..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No notifications found</h3>
            <p className="text-slate-500 text-sm">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`
                relative group flex gap-4 p-4 rounded-xl border transition-all duration-200
                ${notification.read 
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                  : "bg-blue-50/50 dark:bg-slate-800/50 border-blue-100 dark:border-slate-700 shadow-sm"
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm
              `}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-semibold ${notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                        {notification.title}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.timestamp}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!notification.read && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Mark as read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(notification.id)} className="text-red-600">
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {notification.actionLabel && (
                  <div className="mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs font-medium"
                      onClick={() => console.log(`Navigate to ${notification.actionUrl}`)}
                    >
                      {notification.actionLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
