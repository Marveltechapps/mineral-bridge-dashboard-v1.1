import { useState } from "react";
import {
  Shield,
  Monitor,
  Globe,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  Calendar
} from "lucide-react";
import { Button } from "../ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface LoginHistory {
  id: string;
  user: string;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  status: "success" | "failed" | "blocked";
}

interface SuspiciousActivity {
  id: string;
  user: string;
  activity: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  timestamp: string;
  ipAddress: string;
  status: "investigating" | "resolved" | "blocked";
}

interface DeviceLog {
  id: string;
  user: string;
  device: string;
  os: string;
  browser: string;
  lastActive: string;
  status: "active" | "inactive";
  trusted: boolean;
}

const mockLoginHistory: LoginHistory[] = [
  {
    id: "1",
    user: "John Doe",
    timestamp: "2024-11-11T10:30:00",
    ipAddress: "192.168.1.100",
    location: "Chennai, India",
    device: "Desktop",
    browser: "Chrome 119",
    status: "success"
  },
  {
    id: "2",
    user: "Sarah Williams",
    timestamp: "2024-11-11T09:15:00",
    ipAddress: "192.168.1.105",
    location: "Mumbai, India",
    device: "Mobile",
    browser: "Safari 17",
    status: "success"
  },
  {
    id: "3",
    user: "Unknown User",
    timestamp: "2024-11-11T07:20:00",
    ipAddress: "45.123.67.89",
    location: "Unknown",
    device: "Desktop",
    browser: "Chrome 118",
    status: "blocked"
  },
  {
    id: "4",
    user: "Mike Johnson",
    timestamp: "2024-11-10T16:45:00",
    ipAddress: "192.168.1.102",
    location: "Delhi, India",
    device: "Tablet",
    browser: "Firefox 120",
    status: "success"
  },
  {
    id: "5",
    user: "Jane Smith",
    timestamp: "2024-11-10T14:20:00",
    ipAddress: "192.168.1.103",
    location: "Bangalore, India",
    device: "Desktop",
    browser: "Edge 119",
    status: "failed"
  },
];

const mockSuspiciousActivities: SuspiciousActivity[] = [
  {
    id: "1",
    user: "Unknown",
    activity: "Multiple failed login attempts",
    riskLevel: "critical",
    timestamp: "2024-11-11T07:20:00",
    ipAddress: "45.123.67.89",
    status: "blocked"
  },
  {
    id: "2",
    user: "John Doe",
    activity: "Login from unusual location",
    riskLevel: "medium",
    timestamp: "2024-11-10T23:15:00",
    ipAddress: "103.45.67.12",
    status: "investigating"
  },
  {
    id: "3",
    user: "Sarah Williams",
    activity: "Rapid permission changes",
    riskLevel: "low",
    timestamp: "2024-11-10T18:30:00",
    ipAddress: "192.168.1.105",
    status: "resolved"
  },
  {
    id: "4",
    user: "Unknown",
    activity: "Unauthorized API access attempt",
    riskLevel: "high",
    timestamp: "2024-11-09T03:45:00",
    ipAddress: "78.90.123.45",
    status: "blocked"
  },
];

const mockDeviceLogs: DeviceLog[] = [
  {
    id: "1",
    user: "John Doe",
    device: "MacBook Pro",
    os: "macOS 14.1",
    browser: "Chrome 119",
    lastActive: "2024-11-11T10:30:00",
    status: "active",
    trusted: true
  },
  {
    id: "2",
    user: "Sarah Williams",
    device: "iPhone 15",
    os: "iOS 17.1",
    browser: "Safari 17",
    lastActive: "2024-11-11T09:15:00",
    status: "active",
    trusted: true
  },
  {
    id: "3",
    user: "Mike Johnson",
    device: "iPad Pro",
    os: "iPadOS 17",
    browser: "Safari 17",
    lastActive: "2024-11-10T16:45:00",
    status: "inactive",
    trusted: true
  },
  {
    id: "4",
    user: "Jane Smith",
    device: "Windows Desktop",
    os: "Windows 11",
    browser: "Edge 119",
    lastActive: "2024-11-10T14:20:00",
    status: "active",
    trusted: false
  },
];

export function SecurityTracking() {
  const [dateFilter, setDateFilter] = useState<string>("all");

  const getRiskBadge = (level: string) => {
    const variants = {
      low: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      critical: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };

    return (
      <Badge variant="secondary" className={variants[level as keyof typeof variants]}>
        {level}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      blocked: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      investigating: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      active: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    const icons = {
      success: <CheckCircle2 className="h-3 w-3" />,
      failed: <XCircle className="h-3 w-3" />,
      blocked: <Shield className="h-3 w-3" />,
    };

    return (
      <Badge variant="secondary" className={variants[status as keyof typeof variants]}>
        <span className="flex items-center gap-1">
          {icons[status as keyof typeof icons]}
          {status}
        </span>
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Security Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor security events and suspicious activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
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
              <p className="text-sm text-muted-foreground">Total Logins</p>
              <p className="text-2xl font-semibold mt-1">{mockLoginHistory.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Devices</p>
              <p className="text-2xl font-semibold mt-1">
                {mockDeviceLogs.filter(d => d.status === "active").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unique IPs</p>
              <p className="text-2xl font-semibold mt-1">
                {new Set(mockLoginHistory.map(l => l.ipAddress)).size}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Threats Blocked</p>
              <p className="text-2xl font-semibold mt-1">
                {mockSuspiciousActivities.filter(a => a.status === "blocked").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="login" className="space-y-4">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="login" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Login History</TabsTrigger>
          <TabsTrigger value="suspicious" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Suspicious Activity</TabsTrigger>
          <TabsTrigger value="devices" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Device Logs</TabsTrigger>
          <TabsTrigger value="ip" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">IP Address Log</TabsTrigger>
        </TabsList>

        {/* Login History Tab */}
        <TabsContent value="login" className="space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLoginHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.user}</TableCell>
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
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {log.ipAddress}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {log.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        {log.device}
                      </div>
                    </TableCell>
                    <TableCell>{log.browser}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Suspicious Activity Tab */}
        <TabsContent value="suspicious" className="space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSuspiciousActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        {activity.activity}
                      </div>
                    </TableCell>
                    <TableCell>{getRiskBadge(activity.riskLevel)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {activity.ipAddress}
                      </code>
                    </TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Device Logs Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Operating System</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Trusted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeviceLogs.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        {device.device}
                      </div>
                    </TableCell>
                    <TableCell>{device.os}</TableCell>
                    <TableCell>{device.browser}</TableCell>
                    <TableCell>
                      {new Date(device.lastActive).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {device.trusted ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Trusted
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Untrusted
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* IP Address Log Tab */}
        <TabsContent value="ip" className="space-y-4">
          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Login Attempts</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(new Set(mockLoginHistory.map(l => l.ipAddress))).map((ip, index) => {
                  const logs = mockLoginHistory.filter(l => l.ipAddress === ip);
                  const latest = logs[0];
                  const users = new Set(logs.map(l => l.user)).size;
                  const blocked = logs.some(l => l.status === "blocked");
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{ip}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {latest.location}
                        </div>
                      </TableCell>
                      <TableCell>{users} user{users > 1 ? 's' : ''}</TableCell>
                      <TableCell>{logs.length}</TableCell>
                      <TableCell>{new Date(latest.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        {getStatusBadge(blocked ? "blocked" : "success")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
