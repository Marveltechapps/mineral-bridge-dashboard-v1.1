import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { 
  History, 
  Search, 
  Download,
  Filter,
  Calendar as CalendarIcon,
  User,
  Shield,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from "lucide-react";

// Mock audit log data
const auditLogs = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    action: "Role Assignment",
    description: "Assigned 'Manager' role to Emily Davis",
    actor: "John Smith",
    actorRole: "Super Admin",
    target: "Emily Davis",
    targetType: "User",
    status: "success",
    ip: "192.168.1.100",
    severity: "medium"
  },
  {
    id: "2",
    timestamp: "2024-01-15T09:15:00Z",
    action: "Permission Change",
    description: "Modified permissions for 'Agent' role - added 'manage_clients'",
    actor: "Sarah Johnson",
    actorRole: "Admin",
    target: "Agent Role",
    targetType: "Role",
    status: "success",
    ip: "192.168.1.105",
    severity: "high"
  },
  {
    id: "3",
    timestamp: "2024-01-15T08:45:00Z",
    action: "Failed Login Attempt",
    description: "Multiple failed login attempts detected",
    actor: "Unknown",
    actorRole: "None",
    target: "lisa.wong@company.com",
    targetType: "User",
    status: "failed",
    ip: "203.0.113.45",
    severity: "high"
  },
  {
    id: "4",
    timestamp: "2024-01-14T16:20:00Z",
    action: "User Deactivation",
    description: "Deactivated user account for policy violation",
    actor: "John Smith",
    actorRole: "Super Admin",
    target: "Mike Wilson",
    targetType: "User",
    status: "success",
    ip: "192.168.1.100",
    severity: "medium"
  },
  {
    id: "5",
    timestamp: "2024-01-14T14:10:00Z",
    action: "Role Creation",
    description: "Created new custom role 'Regional Manager'",
    actor: "Sarah Johnson",
    actorRole: "Admin",
    target: "Regional Manager",
    targetType: "Role",
    status: "success",
    ip: "192.168.1.105",
    severity: "medium"
  },
  {
    id: "6",
    timestamp: "2024-01-14T11:30:00Z",
    action: "Data Export",
    description: "Exported user list with sensitive information",
    actor: "Mike Chen",
    actorRole: "Manager",
    target: "User Database",
    targetType: "Data",
    status: "success",
    ip: "192.168.1.120",
    severity: "high"
  },
  {
    id: "7",
    timestamp: "2024-01-14T09:00:00Z",
    action: "System Configuration",
    description: "Updated security settings - enabled MFA requirement",
    actor: "John Smith",
    actorRole: "Super Admin",
    target: "Security Settings",
    targetType: "System",
    status: "success",
    ip: "192.168.1.100",
    severity: "critical"
  },
  {
    id: "8",
    timestamp: "2024-01-13T17:45:00Z",
    action: "Permission Denied",
    description: "Attempted to access admin panel without sufficient privileges",
    actor: "Alex Rodriguez",
    actorRole: "Agent",
    target: "Admin Panel",
    targetType: "System",
    status: "failed",
    ip: "192.168.1.130",
    severity: "medium"
  }
];

const actionTypes = [
  "All Actions",
  "Role Assignment",
  "Permission Change", 
  "User Deactivation",
  "Role Creation",
  "Data Export",
  "System Configuration",
  "Failed Login Attempt",
  "Permission Denied"
];

const severityLevels = ["All Severity", "critical", "high", "medium", "low"];
const statusTypes = ["All Status", "success", "failed", "pending"];

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("All Actions");
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Role Assignment": return <User className="h-4 w-4 text-blue-600" />;
      case "Permission Change": return <Shield className="h-4 w-4 text-purple-600" />;
      case "System Configuration": return <Settings className="h-4 w-4 text-gray-600" />;
      case "Data Export": return <Download className="h-4 w-4 text-green-600" />;
      default: return <History className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "All Actions" || log.action === selectedAction;
    const matchesSeverity = selectedSeverity === "All Severity" || log.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "All Status" || log.status === selectedStatus;
    
    return matchesSearch && matchesAction && matchesSeverity && matchesStatus;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDateRange = (dateRange: {from?: Date; to?: Date}) => {
    if (!dateRange.from) return "Select date range";
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };

    if (dateRange.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
    }
    return formatDate(dateRange.from);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-600" />
              Audit Logs
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Action</label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Severity</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusTypes.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="truncate">{formatDateRange(dateRange)}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLogs.length} of {auditLogs.length} log entries
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredLogs.map((log, index) => {
              const timestamp = formatTimestamp(log.timestamp);
              const ActionIcon = getActionIcon(log.action);
              
              return (
                <div
                  key={log.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors ${
                    log.severity === 'critical' ? 'border-l-4 border-l-red-500' :
                    log.severity === 'high' ? 'border-l-4 border-l-orange-500' :
                    ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Action Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {ActionIcon}
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-sm">{log.action}</h4>
                            {getStatusIcon(log.status)}
                            <Badge className={`text-xs ${getSeverityColor(log.severity)}`}>
                              {log.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {log.description}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarFallback className="text-xs">
                                  {getInitials(log.actor)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{log.actor}</span>
                              <Badge variant="outline" className="text-xs">
                                {log.actorRole}
                              </Badge>
                            </div>
                            
                            <span>→</span>
                            
                            <div className="flex items-center space-x-1">
                              <span>{log.target}</span>
                              <Badge variant="secondary" className="text-xs">
                                {log.targetType}
                              </Badge>
                            </div>
                            
                            <span>•</span>
                            <span>IP: {log.ip}</span>
                          </div>
                        </div>
                        
                        {/* Timestamp */}
                        <div className="flex-shrink-0 text-right text-xs text-muted-foreground">
                          <div>{timestamp.date}</div>
                          <div>{timestamp.time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
              <History className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold text-red-600">
                  {auditLogs.filter(log => log.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed Actions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {auditLogs.filter(log => log.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Events</p>
                <p className="text-2xl font-bold text-green-600">
                  {auditLogs.filter(log => {
                    const today = new Date();
                    const logDate = new Date(log.timestamp);
                    return logDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}