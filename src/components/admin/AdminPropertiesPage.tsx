import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Home,
  Plus,
  Upload,
  Search,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  User,
  FileCheck,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface Property {
  id: string;
  name: string;
  image?: string;
  owner: string;
  category: "Apartment" | "Villa" | "Plot" | "Commercial" | "Organic Home";
  status: "live" | "pending" | "closed";
  visibility: "public" | "private" | "exchange-only";
  price: string;
  location: string;
  verification: "verified" | "pending" | "required";
  listedDate: string;
}

const mockProperties: Property[] = [
  {
    id: "P001",
    name: "Skyline Towers - Unit 402",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
    owner: "Property Owner Corp",
    category: "Apartment",
    status: "live",
    visibility: "public",
    price: "₹85 Lakh",
    location: "Chennai, Tamil Nadu",
    verification: "verified",
    listedDate: "2024-10-15",
  },
  {
    id: "P002",
    name: "Green Valley Villa",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    owner: "Priya Sharma",
    category: "Villa",
    status: "closed",
    visibility: "public",
    price: "₹1.2 Cr",
    location: "Bangalore, Karnataka",
    verification: "verified",
    listedDate: "2024-09-20",
  },
  {
    id: "P003",
    name: "Marina Bay Apartment",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
    owner: "Marina Bay Developer",
    category: "Apartment",
    status: "pending",
    visibility: "public",
    price: "AED 2.5M",
    location: "Dubai, UAE",
    verification: "pending",
    listedDate: "2024-11-01",
  },
  {
    id: "P004",
    name: "Tech Park Office Space",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    owner: "TechCorp Industries",
    category: "Commercial",
    status: "live",
    visibility: "private",
    price: "₹3.5 Cr",
    location: "Hyderabad, Telangana",
    verification: "verified",
    listedDate: "2024-10-25",
  },
  {
    id: "P005",
    name: "Riverside Penthouse",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    owner: "Riverside Residency",
    category: "Apartment",
    status: "closed",
    visibility: "public",
    price: "₹2.8 Cr",
    location: "Pune, Maharashtra",
    verification: "verified",
    listedDate: "2024-08-10",
  },
  {
    id: "P006",
    name: "Lakeside Plot - 500 sqyd",
    owner: "Lakeside Developers",
    category: "Plot",
    status: "live",
    visibility: "exchange-only",
    price: "₹45 Lakh",
    location: "Chennai, Tamil Nadu",
    verification: "required",
    listedDate: "2024-11-05",
  },
];

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || property.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesVerification =
      verificationFilter === "all" || property.verification === verificationFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesVerification;
  });

  const propertyCounts = {
    total: properties.length,
    live: properties.filter((p) => p.status === "live").length,
    pending: properties.filter((p) => p.status === "pending").length,
    closed: properties.filter((p) => p.status === "closed").length,
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return variants[status as keyof typeof variants];
  };

  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      public: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      private: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      "exchange-only": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return variants[visibility as keyof typeof variants];
  };

  const getVerificationBadge = (verification: string) => {
    const variants = {
      verified: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      required: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return variants[verification as keyof typeof variants];
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(properties.filter((p) => p.id !== propertyId));
    toast.success("Property deleted successfully");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Properties Management</h1>
          <p className="text-muted-foreground">
            Manage all properties across your marketplaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl">{propertyCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Live</p>
                <p className="text-2xl">{propertyCounts.live}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl">{propertyCounts.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl">{propertyCounts.closed}</p>
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
                placeholder="Search by property name, owner, location, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="required">Required</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Property</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Listed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {property.image && (
                          <ImageWithFallback
                            src={property.image}
                            alt={property.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{property.owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{property.price}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(property.status)}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getVisibilityBadge(property.visibility)}>
                        {property.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getVerificationBadge(property.verification)}>
                        {property.verification === "verified" && (
                          <FileCheck className="h-3 w-3 mr-1" />
                        )}
                        {property.verification === "pending" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {property.verification === "required" && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {property.verification}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(property.listedDate).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                          {property.verification !== "verified" && (
                            <DropdownMenuItem>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Verify Documents
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
