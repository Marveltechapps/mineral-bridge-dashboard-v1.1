import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Home,
  Clock,
  ArrowLeftRight,
  TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ExchangeRequest {
  id: string;
  clientName: string;
  clientAvatar: string;
  phone: string;
  email: string;
  offeringProperty: {
    title: string;
    location: string;
    type: string;
    estimatedValue: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: string;
    description: string;
  };
  seekingProperty: {
    preferredType: string;
    preferredLocation: string;
    budgetRange: string;
    requirements: string;
  };
  message: string;
  timestamp: Date;
  status: "new" | "reviewing" | "matched" | "negotiating" | "completed" | "declined";
  priority: "high" | "medium" | "low";
  exchangeReason: string;
  flexibility: string;
}

interface ExchangeTableProps {
  requests: ExchangeRequest[];
}

export function ExchangeTable({ requests }: ExchangeTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.offeringProperty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.offeringProperty.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.seekingProperty.preferredType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-green-100 text-green-800 hover:bg-green-100",
      reviewing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      matched: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      negotiating: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
      declined: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return (
      <Badge className={styles[status as keyof typeof styles] || styles.new}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-red-100 text-red-800 hover:bg-red-100",
      medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      low: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };
    return (
      <Badge className={styles[priority as keyof typeof styles]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleMessage = (name: string) => {
    console.log(`Opening message to ${name}`);
  };

  // Stats calculations
  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    active: requests.filter(r => ['reviewing', 'matched', 'negotiating'].includes(r.status)).length,
    highPriority: requests.filter(r => r.priority === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[var(--bio-green-light)] to-white border-[var(--bio-green)]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <h3 className="mt-2">{stats.total}</h3>
              </div>
              <ArrowLeftRight className="h-8 w-8 text-[var(--bio-green)]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Requests</p>
                <h3 className="mt-2">{stats.new}</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Exchanges</p>
                <h3 className="mt-2">{stats.active}</h3>
              </div>
              <ArrowLeftRight className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <h3 className="mt-2">{stats.highPriority}</h3>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-[var(--bio-green)]" />
              Exchange Requests
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Client</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Offering Property</th>
                  <th className="text-left p-4">Seeking Property</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      No exchange requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.clientAvatar} />
                            <AvatarFallback>{request.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.clientName}</p>
                            <p className="text-sm text-muted-foreground">{request.flexibility}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{request.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]">{request.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{request.offeringProperty.title}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{request.offeringProperty.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {request.offeringProperty.type}
                            </Badge>
                            <span className="text-[var(--bio-green)]">{request.offeringProperty.estimatedValue}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Home className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">{request.seekingProperty.preferredType}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{request.seekingProperty.preferredLocation}</span>
                          </div>
                          <p className="text-sm text-[var(--bio-green)]">{request.seekingProperty.budgetRange}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="p-4">
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{getTimeAgo(request.timestamp)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCall(request.phone)}
                            className="h-8 w-8 p-0"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmail(request.email)}
                            className="h-8 w-8 p-0"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMessage(request.clientName)}
                            className="h-8 w-8 p-0"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-[var(--bio-green)]" />
              Exchange Request Details
            </DialogTitle>
            <DialogDescription>Review currency exchange rates and transaction status for this request.</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedRequest.clientAvatar} />
                      <AvatarFallback>{selectedRequest.clientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4>{selectedRequest.clientName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedRequest.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedRequest.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCall(selectedRequest.phone)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEmail(selectedRequest.email)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMessage(selectedRequest.clientName)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Flexibility</p>
                      <p className="mt-1">{selectedRequest.flexibility}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="mt-1">{getTimeAgo(selectedRequest.timestamp)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Offering Property */}
              <Card className="border-[var(--bio-green)]/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-4 w-4 text-[var(--bio-green)]" />
                    Property Being Offered
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4>{selectedRequest.offeringProperty.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedRequest.offeringProperty.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="mt-1">{selectedRequest.offeringProperty.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Value</p>
                      <p className="mt-1 text-[var(--bio-green)]">{selectedRequest.offeringProperty.estimatedValue}</p>
                    </div>
                    {selectedRequest.offeringProperty.bedrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="mt-1">{selectedRequest.offeringProperty.bedrooms}</p>
                      </div>
                    )}
                    {selectedRequest.offeringProperty.bathrooms && (
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="mt-1">{selectedRequest.offeringProperty.bathrooms}</p>
                      </div>
                    )}
                  </div>

                  {selectedRequest.offeringProperty.sqft && (
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="mt-1">{selectedRequest.offeringProperty.sqft}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1 text-sm">{selectedRequest.offeringProperty.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Seeking Property */}
              <Card className="border-blue-300">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                    Property Being Sought
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Type</p>
                      <p className="mt-1">{selectedRequest.seekingProperty.preferredType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Location</p>
                      <p className="mt-1">{selectedRequest.seekingProperty.preferredLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Range</p>
                      <p className="mt-1 text-blue-600">{selectedRequest.seekingProperty.budgetRange}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Requirements</p>
                    <p className="mt-1 text-sm">{selectedRequest.seekingProperty.requirements}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Exchange Reason</p>
                    <p className="mt-1">{selectedRequest.exchangeReason}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Message</p>
                    <p className="mt-1 text-sm">{selectedRequest.message}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
