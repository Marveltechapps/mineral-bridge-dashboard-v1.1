import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
  User,
  Settings,
  Eye
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  ipAddress: string;
  category: string;
}

const mockLogs: ActivityLog[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Role Created",
    details: "Created new role 'Sales Agent'",
    timestamp: "2024-11-11T10:30:00",
    status: "success",
    ipAddress: "192.168.1.100",
    category: "roles"
  },
  {
    id: "2",
    user: "Sarah Williams",
    action: "Permission Modified",
    details: "Updated permissions for 'Project Manager'",
    oldValue: "View, Create",
    newValue: "View, Create, Edit, Delete",
    timestamp: "2024-11-11T09:15:00",
    status: "success",
    ipAddress: "192.168.1.105",
    category: "permissions"
  },
  {
    id: "3",
    user: "Mike Johnson",
    action: "User Assignment",
    details: "Added 5 users to 'Marketing Team' role",
    timestamp: "2024-11-11T08:45:00",
    status: "success",
    ipAddress: "192.168.1.102",
    category: "users"
  },
  {
    id: "4",
    user: "Unknown User",
    action: "Unauthorized Access",
    details: "Attempted to access admin panel",
    timestamp: "2024-11-11T07:20:00",
    status: "blocked",
    ipAddress: "45.123.67.89",
    category: "security"
  },
  {
    id: "5",
    user: "Jane Smith",
    action: "Role Deleted",
    details: "Deleted role 'Temporary Staff'",
    timestamp: "2024-11-10T16:30:00",
    status: "success",
    ipAddress: "192.168.1.103",
    category: "roles"
  },
  {
    id: "6",
    user: "Tom Brown",
    action: "Permission Update Failed",
    details: "Failed to update permissions - insufficient privileges",
    timestamp: "2024-11-10T14:20:00",
    status: "failed",
    ipAddress: "192.168.1.106",
    category: "permissions"
  },
  {
    id: "7",
    user: "Admin User",
    action: "Role Modified",
    details: "Updated role 'Finance Manager'",
    oldValue: "Active",
    newValue: "Inactive",
    timestamp: "2024-11-10T11:00:00",
    status: "success",
    ipAddress: "192.168.1.101",
    category: "roles"
  },
  {
    id: "8",
    user: "Sarah Williams",
    action: "User Removed",
    details: "Removed 3 users from 'Support Staff' role",
    timestamp: "2024-11-09T15:45:00",
    status: "success",
    ipAddress: "192.168.1.105",
    category: "users"
  },
];

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") matchesDate = daysDiff === 0;
      else if (dateFilter === "week") matchesDate = daysDiff <= 7;
      else if (dateFilter === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "blocked":
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      blocked: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        <span className="flex items-center gap-1">
          {getStatusIcon(status)}
          {status}
        </span>
      </Badge>
    );
  };

  const exportLogs = () => {
    // Mock export functionality
    const csv = [
      ["Timestamp", "User", "Action", "Details", "Old Value", "New Value", "Status", "IP Address"].join(","),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.user,
        log.action,
        log.details,
        log.oldValue || "-",
        log.newValue || "-",
        log.status,
        log.ipAddress
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Activity Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all role and permission changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-semibold mt-1">{mockLogs.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-2xl font-semibold mt-1">
                {mockLogs.filter(l => l.status === "success").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-semibold mt-1">
                {mockLogs.filter(l => l.status === "failed").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-2xl font-semibold mt-1">
                {mockLogs.filter(l => l.status === "blocked").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <Settings className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="roles">Roles</SelectItem>
            <SelectItem value="permissions">Permissions</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate">{log.details}</p>
                  </TableCell>
                  <TableCell>
                    {log.oldValue && log.newValue ? (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Old:</span>
                          <span className="text-red-600">{log.oldValue}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">New:</span>
                          <span className="text-green-600">{log.newValue}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {log.ipAddress}
                    </code>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
