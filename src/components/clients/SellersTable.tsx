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
  Download,
  Eye,
  MapPin,
  DollarSign,
  Home,
  Clock,
  Building2,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface SellerProperty {
  id: string;
  sellerName: string;
  sellerAvatar?: string;
  phone: string;
  email: string;
  property: {
    title: string;
    location: string;
    askingPrice: string;
    type: string;
    bedrooms?: number;
    bathrooms?: number;
    sqft?: string;
    yearBuilt?: number;
    description?: string;
    image?: string;
  };
  message: string;
  timestamp: Date;
  status: 'new' | 'reviewing' | 'listed' | 'under-negotiation' | 'sold';
  priority: 'low' | 'medium' | 'high';
  reasonForSelling?: string;
  expectedTimeline?: string;
}

interface SellersTableProps {
  listings: SellerProperty[];
}

export function SellersTable({ listings }: SellersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<SellerProperty | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'listed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'under-negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'sold': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
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

  const handleViewDetails = (listing: SellerProperty) => {
    setSelectedListing(listing);
    setDetailsOpen(true);
  };

  const handleContact = (listing: SellerProperty, method: 'phone' | 'email' | 'message') => {
    console.log(`Contacting ${listing.sellerName} via ${method}`);
    if (method === 'phone') {
      window.location.href = `tel:${listing.phone}`;
    } else if (method === 'email') {
      window.location.href = `mailto:${listing.email}`;
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.phone.includes(searchQuery) ||
      listing.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;

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
              placeholder="Search by seller, property, or location..."
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
            <option value="reviewing">Reviewing</option>
            <option value="listed">Listed</option>
            <option value="under-negotiation">Under Negotiation</option>
            <option value="sold">Sold</option>
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
            <div className="text-sm text-muted-foreground">Total Listings</div>
            <div className="text-2xl font-semibold mt-1">{listings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">New Submissions</div>
            <div className="text-2xl font-semibold mt-1 text-blue-600">
              {listings.filter(l => l.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Active Listings</div>
            <div className="text-2xl font-semibold mt-1 text-green-600">
              {listings.filter(l => l.status === 'listed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Under Negotiation</div>
            <div className="text-2xl font-semibold mt-1 text-orange-600">
              {listings.filter(l => l.status === 'under-negotiation').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Listings ({filteredListings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Property Details</TableHead>
                  <TableHead>Asking Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No listings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredListings.map((listing) => (
                    <TableRow key={listing.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={listing.sellerAvatar} />
                            <AvatarFallback className="bg-[var(--bio-sky-light)] text-[var(--bio-sky)]">
                              {listing.sellerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{listing.sellerName}</div>
                            {listing.expectedTimeline && (
                              <div className="text-xs text-muted-foreground">
                                Timeline: {listing.expectedTimeline}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{listing.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[180px]">{listing.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-[220px]">
                          <div className="font-medium text-sm truncate">{listing.property.title}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{listing.property.location}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {listing.property.type}
                            </Badge>
                            {listing.property.bedrooms && (
                              <span className="text-xs text-muted-foreground">
                                {listing.property.bedrooms} bed
                              </span>
                            )}
                            {listing.property.bathrooms && (
                              <span className="text-xs text-muted-foreground">
                                {listing.property.bathrooms} bath
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[var(--bio-green)]">
                          {listing.property.askingPrice}
                        </div>
                        {listing.property.sqft && (
                          <div className="text-xs text-muted-foreground">
                            {listing.property.sqft} sqft
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status === 'under-negotiation' ? 'negotiation' : listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(listing.priority)}>
                          {listing.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(listing.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(listing, 'phone')}
                            className="h-8 w-8 p-0"
                            title="Call"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(listing, 'email')}
                            className="h-8 w-8 p-0"
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleContact(listing, 'message')}
                            className="h-8 w-8 p-0"
                            title="Message"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(listing)}
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
            <DialogTitle>Property Listing Details</DialogTitle>
            <DialogDescription>
              Complete information about this seller's property
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6 py-4">
              {/* Seller Information */}
              <div>
                <h3 className="mb-3">Seller Information</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedListing.sellerAvatar} />
                        <AvatarFallback className="bg-[var(--bio-sky-light)] text-[var(--bio-sky)]">
                          {selectedListing.sellerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4>{selectedListing.sellerName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(selectedListing.status)}>
                              {selectedListing.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(selectedListing.priority)}>
                              {selectedListing.priority} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedListing.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedListing.email}</span>
                          </div>
                          {selectedListing.expectedTimeline && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Timeline: {selectedListing.expectedTimeline}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Submitted {formatTime(selectedListing.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Information */}
              <div>
                <h3 className="mb-3">Property Details</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-[var(--bio-green)] mt-0.5" />
                        <div className="flex-1">
                          <h4>{selectedListing.property.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{selectedListing.property.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <div className="text-sm text-muted-foreground">Type</div>
                          <Badge variant="secondary" className="mt-1">
                            {selectedListing.property.type}
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Asking Price</div>
                          <div className="font-medium text-[var(--bio-green)] mt-1">
                            {selectedListing.property.askingPrice}
                          </div>
                        </div>
                        {selectedListing.property.bedrooms && (
                          <div>
                            <div className="text-sm text-muted-foreground">Bedrooms</div>
                            <div className="mt-1">{selectedListing.property.bedrooms}</div>
                          </div>
                        )}
                        {selectedListing.property.bathrooms && (
                          <div>
                            <div className="text-sm text-muted-foreground">Bathrooms</div>
                            <div className="mt-1">{selectedListing.property.bathrooms}</div>
                          </div>
                        )}
                      </div>

                      {selectedListing.property.sqft && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Square Feet</div>
                            <div className="mt-1">{selectedListing.property.sqft}</div>
                          </div>
                          {selectedListing.property.yearBuilt && (
                            <div>
                              <div className="text-sm text-muted-foreground">Year Built</div>
                              <div className="mt-1">{selectedListing.property.yearBuilt}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedListing.property.description && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Description</div>
                          <p className="text-sm">{selectedListing.property.description}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="mb-3">Additional Information</h3>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    {selectedListing.reasonForSelling && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Reason for Selling</div>
                        <p className="text-sm">{selectedListing.reasonForSelling}</p>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Seller's Message</div>
                      <p className="text-sm">{selectedListing.message}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleContact(selectedListing, 'phone')}
                  className="flex-1 gap-2 bg-[var(--bio-green)] hover:bg-[var(--bio-green)]/90"
                >
                  <Phone className="h-4 w-4" />
                  Call Seller
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContact(selectedListing, 'email')}
                  className="flex-1 gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContact(selectedListing, 'message')}
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
