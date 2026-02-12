import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
  Phone,
  Mail,
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  DollarSign,
  Home,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface BuyerEnquiry {
  id: string;
  clientName: string;
  clientAvatar?: string;
  phone: string;
  email: string;
  property: {
    title: string;
    location: string;
    price: string;
    type: string;
    image?: string;
  };
  message: string;
  timestamp: Date;
  status: 'new' | 'contacted' | 'scheduled' | 'closed';
  priority: 'low' | 'medium' | 'high';
  engagementLevel: number;
  budget?: string;
  preferredContactMethod?: 'phone' | 'email' | 'message';
}

interface BuyersTableProps {
  enquiries: BuyerEnquiry[];
}

export function BuyersTable({ enquiries }: BuyersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<BuyerEnquiry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'scheduled': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };



  const handleViewDetails = (enquiry: BuyerEnquiry) => {
    setSelectedEnquiry(enquiry);
    setDetailsOpen(true);
  };

  const handleContact = (enquiry: BuyerEnquiry, method: 'phone' | 'email' | 'message') => {
    console.log(`Contacting ${enquiry.clientName} via ${method}`);
    // Implement contact logic here
    if (method === 'phone') {
      window.location.href = `tel:${enquiry.phone}`;
    } else if (method === 'email') {
      window.location.href = `mailto:${enquiry.email}`;
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.phone.includes(searchQuery) ||
      enquiry.property.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="closed">Closed</option>
          </select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Enquiries</div>
            <div className="text-2xl font-semibold mt-1">{enquiries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">New</div>
            <div className="text-2xl font-semibold mt-1 text-blue-600">
              {enquiries.filter(e => e.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">In Progress</div>
            <div className="text-2xl font-semibold mt-1 text-yellow-600">
              {enquiries.filter(e => e.status === 'contacted' || e.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">High Priority</div>
            <div className="text-2xl font-semibold mt-1 text-red-600">
              {enquiries.filter(e => e.priority === 'high').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Buyer Enquiries ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Property Interested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No enquiries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <TableRow key={enquiry.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={enquiry.clientAvatar} />
                            <AvatarFallback className="bg-[var(--bio-green-light)] text-[var(--bio-green)]">
                              {enquiry.clientName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{enquiry.clientName}</div>
                            {enquiry.budget && (
                              <div className="text-xs text-muted-foreground">
                                Budget: {enquiry.budget}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{enquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[180px]">{enquiry.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-[200px]">
                          <div className="font-medium text-sm truncate">{enquiry.property.title}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{enquiry.property.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {enquiry.property.type}
                            </Badge>
                            <span className="text-xs font-medium text-[var(--bio-green)]">
                              {enquiry.property.price}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(enquiry.status)}>
                          {enquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(enquiry.priority)}>
                          {enquiry.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(enquiry.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(enquiry, 'phone')}
                            className="h-8 w-8 p-0"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(enquiry, 'email')}
                            className="h-8 w-8 p-0"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(enquiry, 'message')}
                            className="h-8 w-8 p-0"
                            title="Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(enquiry)}
                            className="h-8 w-8 p-0"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              Complete information about this buyer enquiry
            </DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-6 py-4">
              {/* Client Information */}
              <div>
                <h3 className="mb-3">Client Information</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedEnquiry.clientAvatar} />
                        <AvatarFallback className="bg-[var(--bio-green-light)] text-[var(--bio-green)]">
                          {selectedEnquiry.clientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4>{selectedEnquiry.clientName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(selectedEnquiry.status)}>
                              {selectedEnquiry.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(selectedEnquiry.priority)}>
                              {selectedEnquiry.priority} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedEnquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedEnquiry.email}</span>
                          </div>
                          {selectedEnquiry.budget && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>Budget: {selectedEnquiry.budget}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTime(selectedEnquiry.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="mb-3">Property of Interest</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Home className="h-5 w-5 text-[var(--bio-green)] mt-0.5" />
                        <div className="flex-1">
                          <h4>{selectedEnquiry.property.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{selectedEnquiry.property.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{selectedEnquiry.property.type}</Badge>
                        <span className="font-medium text-[var(--bio-green)]">
                          {selectedEnquiry.property.price}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Message */}
              <div>
                <h3 className="mb-3">Initial Message</h3>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm">{selectedEnquiry.message}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleContact(selectedEnquiry, 'phone')}
                  className="flex-1 gap-2 bg-[var(--bio-green)] hover:bg-[var(--bio-green)]/90"
                >
                  <Phone className="h-4 w-4" />
                  Call Client
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContact(selectedEnquiry, 'email')}
                  className="flex-1 gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContact(selectedEnquiry, 'message')}
                  className="flex-1 gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
