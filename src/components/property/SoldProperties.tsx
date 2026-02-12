import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  Calendar,
  DollarSign,
  Building2,
  MapPin,
  Phone,
  Mail,
  Home,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SoldProperty {
  id: string;
  name: string;
  category: string;
  location: string;
  soldPrice: string;
  soldDate: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  finalPrice: string;
  commission: string;
  documents: Array<{
    name: string;
    type: string;
    uploadedDate: string;
  }>;
  photo?: string;
}

const mockSoldProperties: SoldProperty[] = [
  {
    id: "1",
    name: "Sunset Villa - Unit A",
    category: "Villa",
    location: "Chennai, Tamil Nadu",
    soldPrice: "₹2.8 Cr",
    soldDate: "2024-10-15",
    buyer: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
    },
    finalPrice: "₹2.8 Cr",
    commission: "₹14 Lakh",
    documents: [
      { name: "Sale Deed.pdf", type: "Legal", uploadedDate: "2024-10-15" },
      { name: "Payment Receipt.pdf", type: "Financial", uploadedDate: "2024-10-15" },
      { name: "Property Photos.zip", type: "Media", uploadedDate: "2024-10-10" },
    ],
  },
  {
    id: "2",
    name: "Green Meadows Apartment 302",
    category: "Apartment",
    location: "Dubai, UAE",
    soldPrice: "AED 1.2M",
    soldDate: "2024-09-28",
    buyer: {
      name: "Sarah Ahmed",
      email: "sarah.ahmed@email.com",
      phone: "+971 50 123 4567",
    },
    finalPrice: "AED 1.2M",
    commission: "AED 60K",
    documents: [
      { name: "Title Transfer.pdf", type: "Legal", uploadedDate: "2024-09-28" },
      { name: "Bank Transfer.pdf", type: "Financial", uploadedDate: "2024-09-28" },
    ],
  },
  {
    id: "3",
    name: "Downtown Commercial Space",
    category: "Commercial",
    location: "Chennai, Tamil Nadu",
    soldPrice: "₹5.5 Cr",
    soldDate: "2024-09-10",
    buyer: {
      name: "TechCorp Industries Ltd.",
      email: "info@techcorp.com",
      phone: "+91 44 2345 6789",
    },
    finalPrice: "₹5.5 Cr",
    commission: "₹27.5 Lakh",
    documents: [
      { name: "Commercial Agreement.pdf", type: "Legal", uploadedDate: "2024-09-10" },
      { name: "NOC Certificate.pdf", type: "Legal", uploadedDate: "2024-09-08" },
      { name: "Final Payment.pdf", type: "Financial", uploadedDate: "2024-09-10" },
    ],
  },
];

export const SoldProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<SoldProperty | null>(null);
  const [allSoldProperties, setAllSoldProperties] = useState<SoldProperty[]>([]);

  // Load sold properties from localStorage on mount
  useEffect(() => {
    const loadSoldProperties = () => {
      const storedSold = localStorage.getItem('soldProperties');
      const dynamicProperties = storedSold ? JSON.parse(storedSold) : [];
      
      // Combine and ensure unique IDs by prefixing dynamic properties
      const uniqueDynamicProperties = dynamicProperties.map((prop: any, index: number) => ({
        ...prop,
        id: `dynamic-${prop.id}-${index}` // Make ID unique
      }));
      
      setAllSoldProperties([...mockSoldProperties, ...uniqueDynamicProperties]);
    };
    
    loadSoldProperties();
    
    // Listen for storage changes (when properties are closed)
    const handleStorageChange = () => {
      loadSoldProperties();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('soldPropertyAdded', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soldPropertyAdded', handleStorageChange);
    };
  }, []);

  const filteredProperties = allSoldProperties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || property.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Sold Properties</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track completed deals and maintain transaction records
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sold</p>
                <p className="text-xl">{allSoldProperties.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-xl">₹48.5 Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission Earned</p>
                <p className="text-xl">₹2.4 Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by property, buyer name, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Organic Home">Organic Home</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="thisQuarter">This Quarter</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead>Property</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Sale Date</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow
                    key={property.id}
                    className="border-border/50 hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {property.photo ? (
                            <ImageWithFallback
                              src={property.photo}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {property.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-full">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{property.buyer.name}</p>
                          <p className="text-xs text-muted-foreground">{property.buyer.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(property.soldDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{property.finalPrice}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {property.commission}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.documents.length} files</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProperty(property)}
                        className="gap-1.5"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sold properties found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Details Sheet */}
      <Sheet open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Sale Details</SheetTitle>
            <SheetDescription>
              Complete information about the property sale
            </SheetDescription>
          </SheetHeader>

          {selectedProperty && (
            <div className="space-y-6 mt-6">
              {/* Property Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedProperty.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {selectedProperty.location}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium">{selectedProperty.category}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Sale Date</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedProperty.soldDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Final Price</p>
                    <p className="text-sm font-medium">{selectedProperty.finalPrice}</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Commission</p>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {selectedProperty.commission}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Buyer Information
                </h4>
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="text-sm font-medium mt-1">{selectedProperty.buyer.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm mt-1 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedProperty.buyer.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <p className="text-sm mt-1 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedProperty.buyer.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents ({selectedProperty.documents.length})
                </h4>
                <div className="space-y-2">
                  {selectedProperty.documents.map((doc, index) => (
                    <Card key={index} className="border-border/50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
