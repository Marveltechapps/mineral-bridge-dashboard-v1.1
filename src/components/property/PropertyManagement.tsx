import { useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Upload,
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  FileText,
  Image as ImageIcon,
  Home,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Separator } from "../ui/separator";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AmenityToggles } from "./AmenityToggles";
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  TreePine,
  Utensils,
  Shield,
  Zap,
  Flame,
  Fence,
  Droplets,
  Route,
  MapPin as MapPinAmenity,
  Building,
  Users,
  Video,
  Sun,
  Wind,
} from "lucide-react";

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    propertyName: "Skyline Towers - Unit 402",
    category: "Apartment",
    status: "Live",
    visibility: "Public",
    createdAt: "2024-10-15",
    price: "₹85 Lakh",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIzMjA0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "2",
    propertyName: "Green Valley Villa",
    category: "Villa",
    status: "Pending",
    visibility: "Private",
    createdAt: "2024-11-01",
    price: "₹1.2 Cr",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjM5OTk5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "3",
    propertyName: "Tech Park Office Space",
    category: "Commercial",
    status: "Live",
    visibility: "Public",
    createdAt: "2024-09-20",
    price: "₹2.5 Cr",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1580742432710-d3c3703559a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwb2ZmaWNlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzYyMzk1NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "4",
    propertyName: "Marina Bay Plot",
    category: "Plot",
    status: "Closed",
    visibility: "Exchange-Only",
    createdAt: "2024-10-25",
    price: "₹75 Lakh",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1629814531614-497f7757f7b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGxhbmQlMjBwbG90fGVufDF8fHx8MTc2MjQxMjk4NHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "5",
    propertyName: "Downtown Apartment",
    category: "Apartment",
    status: "Live",
    visibility: "Public",
    createdAt: "2024-10-30",
    price: "₹35,000/month",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjIzMjA0NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "6",
    propertyName: "Heritage Bungalow",
    category: "Villa",
    status: "Pending",
    visibility: "Private",
    createdAt: "2024-10-18",
    price: "₹3 Cr",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1679364297777-1db77b6199be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjM5OTk5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: "7",
    propertyName: "Eco Haven Residence",
    category: "Organic Home",
    status: "Live",
    visibility: "Public",
    createdAt: "2024-11-05",
    price: "₹95 Lakh",
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1761571740780-d9149a88b759?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBob3VzZSUyMHN1c3RhaW5hYmxlfGVufDF8fHx8MTc2MjQxMzU2MHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

// Get amenities based on property type
const getAmenitiesByType = (propertyType: string) => {
  const amenitiesMap: Record<string, any[]> = {
    Plot: [
      { id: "electricity", name: "Electricity Connection", icon: Zap, category: "essential", enabled: false },
      { id: "water", name: "Water Supply", icon: Droplets, category: "essential", enabled: false },
      { id: "road", name: "Road Access", icon: Route, category: "essential", enabled: false },
      { id: "boundary", name: "Boundary Wall", icon: Fence, category: "safety", enabled: false },
      { id: "corner", name: "Corner Plot", icon: MapPinAmenity, category: "lifestyle", enabled: false },
      { id: "gated", name: "Gated Community", icon: Shield, category: "safety", enabled: false },
    ],
    Villa: [
      { id: "garden", name: "Garden/Lawn", icon: TreePine, category: "lifestyle", enabled: false },
      { id: "pool", name: "Swimming Pool", icon: Waves, category: "lifestyle", enabled: false },
      { id: "parking", name: "Car Parking", icon: Car, category: "essential", enabled: false },
      { id: "security", name: "Security System", icon: Shield, category: "safety", enabled: false },
      { id: "kitchen", name: "Modular Kitchen", icon: Utensils, category: "essential", enabled: false },
      { id: "servant", name: "Servant Quarters", icon: Users, category: "lifestyle", enabled: false },
      { id: "generator", name: "Power Backup", icon: Zap, category: "safety", enabled: false },
      { id: "gym", name: "Home Gym", icon: Dumbbell, category: "lifestyle", enabled: false },
    ],
    "Organic Home": [
      { id: "solar", name: "Solar Panels", icon: Sun, category: "essential", enabled: false },
      { id: "rainwater", name: "Rainwater Harvesting", icon: Droplets, category: "essential", enabled: false },
      { id: "garden", name: "Organic Garden", icon: TreePine, category: "lifestyle", enabled: false },
      { id: "compost", name: "Composting System", icon: TreePine, category: "lifestyle", enabled: false },
      { id: "natural", name: "Natural Ventilation", icon: Wind, category: "essential", enabled: false },
      { id: "eco", name: "Eco-friendly Materials", icon: TreePine, category: "essential", enabled: false },
      { id: "parking", name: "Car Parking", icon: Car, category: "essential", enabled: false },
      { id: "security", name: "Security System", icon: Shield, category: "safety", enabled: false },
    ],
    Commercial: [
      { id: "parking", name: "Parking Space", icon: Car, category: "essential", enabled: false },
      { id: "generator", name: "Power Backup", icon: Zap, category: "safety", enabled: false },
      { id: "cctv", name: "CCTV Surveillance", icon: Video, category: "safety", enabled: false },
      { id: "fire", name: "Fire Safety", icon: Flame, category: "safety", enabled: false },
      { id: "elevator", name: "Elevator", icon: Building, category: "essential", enabled: false },
      { id: "conference", name: "Conference Rooms", icon: Users, category: "lifestyle", enabled: false },
      { id: "wifi", name: "High-Speed Internet", icon: Wifi, category: "essential", enabled: false },
    ],
    Apartment: [
      { id: "kitchen", name: "Modular Kitchen", icon: Utensils, category: "essential", enabled: false },
      { id: "parking", name: "Car Parking", icon: Car, category: "essential", enabled: false },
      { id: "elevator", name: "Lift/Elevator", icon: Building, category: "essential", enabled: false },
      { id: "generator", name: "Power Backup", icon: Zap, category: "safety", enabled: false },
      { id: "security", name: "24/7 Security", icon: Shield, category: "safety", enabled: false },
      { id: "gym", name: "Gym/Fitness Center", icon: Dumbbell, category: "lifestyle", enabled: false },
      { id: "pool", name: "Swimming Pool", icon: Waves, category: "lifestyle", enabled: false },
      { id: "clubhouse", name: "Club House", icon: Building2, category: "lifestyle", enabled: false },
      { id: "wifi", name: "High-Speed Internet", icon: Wifi, category: "essential", enabled: false },
      { id: "maintenance", name: "Maintenance Staff", icon: Users, category: "essential", enabled: false },
    ],
  };

  return amenitiesMap[propertyType] || [];
};

export function PropertyManagement() {
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Dialog states
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [editPropertyOpen, setEditPropertyOpen] = useState(false);
  const [closePropertyOpen, setClosePropertyOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [propertyToClose, setPropertyToClose] = useState<any>(null);
  
  // Buyer form for closing property
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    email: "",
    phone: "",
    finalPrice: "",
    commission: ""
  });

  // Form states
  const [propertyForm, setPropertyForm] = useState({
    propertyName: "",
    category: "",
    visibility: "Public",
    price: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    commercialType: "",
    amenities: [] as any[],
    documents: [] as File[],
    images: [] as File[],
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      Live: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      Closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return variants[status as keyof typeof variants] || variants.Pending;
  };

  const getVisibilityBadge = (visibility: string) => {
    const variants = {
      Public: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Private: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      "Exchange-Only": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return variants[visibility as keyof typeof variants] || variants.Public;
  };



  const handleApprove = (property: any) => {
    setProperties(
      properties.map((p) =>
        p.id === property.id ? { ...p, status: "Live" } : p
      )
    );
    toast.success(`${property.propertyName} has been approved and is now live`);
  };

  const handleClose = (property: any) => {
    setPropertyToClose(property);
    setBuyerForm({
      name: "",
      email: "",
      phone: "",
      finalPrice: property.price,
      commission: ""
    });
    setClosePropertyOpen(true);
  };

  const handleConfirmClose = () => {
    if (!propertyToClose) return;
    
    // Mark property as closed
    setProperties(
      properties.map((p) =>
        p.id === propertyToClose.id ? { ...p, status: "Closed" } : p
      )
    );
    
    // Add to sold properties in localStorage
    const soldProperty = {
      id: propertyToClose.id,
      name: propertyToClose.propertyName,
      category: propertyToClose.category,
      location: propertyToClose.location,
      soldPrice: propertyToClose.price,
      soldDate: new Date().toISOString().split('T')[0],
      buyer: {
        name: buyerForm.name || "To Be Updated",
        email: buyerForm.email || "buyer@email.com",
        phone: buyerForm.phone || "+91 00000 00000"
      },
      finalPrice: buyerForm.finalPrice || propertyToClose.price,
      commission: buyerForm.commission || "To Be Calculated",
      documents: [],
      originalProperty: propertyToClose
    };
    
    // Get existing sold properties from localStorage
    const existingSold = localStorage.getItem('soldProperties');
    const soldProperties = existingSold ? JSON.parse(existingSold) : [];
    
    // Add new sold property
    soldProperties.push(soldProperty);
    localStorage.setItem('soldProperties', JSON.stringify(soldProperties));
    
    // Dispatch custom event to notify SoldProperties component
    window.dispatchEvent(new Event('soldPropertyAdded'));
    
    toast.success(`${propertyToClose.propertyName} has been moved to Sold Properties`);
    setClosePropertyOpen(false);
    setPropertyToClose(null);
  };

  const handleEdit = (property: any) => {
    setSelectedProperty(property);
    setPropertyForm({
      propertyName: property.propertyName,
      category: property.category,
      visibility: property.visibility,
      price: property.price,
      location: property.location,
      description: "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      sqft: property.sqft || "",
      commercialType: property.commercialType || "",
      amenities: getAmenitiesByType(property.category),
      documents: [],
      images: [],
    });
    setEditPropertyOpen(true);
  };

  const handleSaveProperty = () => {
    if (selectedProperty) {
      // Update existing property
      setProperties(
        properties.map((p) =>
          p.id === selectedProperty.id ? { ...p, ...propertyForm } : p
        )
      );
      toast.success("Property updated successfully");
      setEditPropertyOpen(false);
    } else {
      // Add new property
      const newProperty = {
        id: String(properties.length + 1),
        ...propertyForm,
        status: "Pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProperties([...properties, newProperty]);
      toast.success("Property added successfully");
      setAddPropertyOpen(false);
    }
    setPropertyForm({
      propertyName: "",
      category: "",
      visibility: "Public",
      price: "",
      location: "",
      description: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      commercialType: "",
      amenities: [],
      documents: [],
      images: [],
    });
    setSelectedProperty(null);
  };

  const filteredProperties = properties.filter((property) => {
    // Exclude closed properties from Property Management view
    const isNotClosed = property.status.toLowerCase() !== "closed";
    
    const matchesSearch =
      property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || property.category === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    return isNotClosed && matchesSearch && matchesCategory && matchesStatus;
  });

  const propertyFormContent = useMemo(() => {
    const requiresBedroomBathroom = ["Apartment", "Villa", "Organic Home"].includes(propertyForm.category);
    const requiresCommercialType = ["Commercial", "Plot"].includes(propertyForm.category);

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="propertyName" className="text-sm font-medium">
              Property Name *
            </Label>
            <Input
              id="propertyName"
              placeholder="e.g., Skyline Towers - Unit 402"
              value={propertyForm.propertyName}
              onChange={(e) =>
                setPropertyForm(prev => ({ ...prev, propertyName: e.target.value }))
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={propertyForm.category}
              onValueChange={(value) => {
                const newAmenities = getAmenitiesByType(value);
                setPropertyForm(prev => ({ ...prev, category: value, amenities: newAmenities }));
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Organic Home">Organic Home</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium">
                Price *
              </Label>
              <Input
                id="price"
                placeholder="e.g., ₹85 Lakh"
                value={propertyForm.price}
                onChange={(e) =>
                  setPropertyForm(prev => ({ ...prev, price: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location *
              </Label>
              <Input
                id="location"
                placeholder="City, State"
                value={propertyForm.location}
                onChange={(e) =>
                  setPropertyForm(prev => ({ ...prev, location: e.target.value }))
                }
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sqft" className="text-sm font-medium">
              Area (Sqft) *
            </Label>
            <Input
              id="sqft"
              placeholder="e.g., 1200"
              value={propertyForm.sqft}
              onChange={(e) =>
                setPropertyForm(prev => ({ ...prev, sqft: e.target.value }))
              }
              className="mt-1.5"
            />
          </div>

          {requiresBedroomBathroom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium">
                  Bedrooms *
                </Label>
                <Select
                  value={propertyForm.bedrooms}
                  onValueChange={(value) =>
                    setPropertyForm(prev => ({ ...prev, bedrooms: value }))
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5+">5+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium">
                  Bathrooms *
                </Label>
                <Select
                  value={propertyForm.bathrooms}
                  onValueChange={(value) =>
                    setPropertyForm(prev => ({ ...prev, bathrooms: value }))
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="3">3 Bathrooms</SelectItem>
                    <SelectItem value="4">4 Bathrooms</SelectItem>
                    <SelectItem value="5+">5+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {requiresCommercialType && (
            <div>
              <Label htmlFor="commercialType" className="text-sm font-medium">
                Type *
              </Label>
              <Select
                value={propertyForm.commercialType}
                onValueChange={(value) =>
                  setPropertyForm(prev => ({ ...prev, commercialType: value }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyForm.category === "Commercial" ? (
                    <>
                      <SelectItem value="office">Office Space</SelectItem>
                      <SelectItem value="retail">Retail Shop</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="showroom">Showroom</SelectItem>
                      <SelectItem value="restaurant">Restaurant Space</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="residential">Residential Plot</SelectItem>
                      <SelectItem value="commercial">Commercial Plot</SelectItem>
                      <SelectItem value="agricultural">Agricultural Land</SelectItem>
                      <SelectItem value="industrial">Industrial Plot</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="visibility" className="text-sm font-medium">
              Visibility
            </Label>
            <Select
              value={propertyForm.visibility}
              onValueChange={(value) =>
                setPropertyForm(prev => ({ ...prev, visibility: value }))
              }
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Exchange-Only">Exchange-Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter property description..."
              value={propertyForm.description}
              onChange={(e) =>
                setPropertyForm(prev => ({ ...prev, description: e.target.value }))
              }
              className="mt-1.5 min-h-[100px]"
            />
          </div>
        </div>

        {/* Amenities Section */}
        {propertyForm.category && propertyForm.amenities?.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Features & Amenities</h3>
                <p className="text-xs text-muted-foreground">
                  Select the amenities available in this property
                </p>
              </div>
              <AmenityToggles
                amenities={propertyForm.amenities}
                onAmenityChange={(amenityId, enabled) => {
                  setPropertyForm((prev) => ({
                    ...prev,
                    amenities: prev.amenities?.map((amenity) =>
                      amenity.id === amenityId ? { ...amenity, enabled } : amenity
                    ) || [],
                  }));
                }}
              />
            </div>
          </>
        )}

      <Separator />

      {/* Document Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-600" />
          <h3 className="font-medium">Document Verification</h3>
        </div>

        {/* Ownership Documents */}
        <Card className="border-dashed bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Upload Ownership Documents</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC up to 10MB
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              {propertyForm.documents.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {propertyForm.documents.length} file(s) selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Images */}
        <Card className="border-dashed bg-muted/30">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Upload Property Images</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG up to 5MB each
                </p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose Images
              </Button>
              {propertyForm.images.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {propertyForm.images.length} image(s) selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    );
  }, [propertyForm, setPropertyForm]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Property Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all your properties, listings, and approvals
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setBulkUploadOpen(true)}
            variant="outline"
            className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload (Excel)
          </Button>
          <Button
            onClick={() => {
              setSelectedProperty(null);
              setPropertyForm({
                propertyName: "",
                category: "",
                visibility: "Public",
                price: "",
                location: "",
                description: "",
                bedrooms: "",
                bathrooms: "",
                sqft: "",
                commercialType: "",
                amenities: [],
                documents: [],
                images: [],
              });
              setAddPropertyOpen(true);
            }}
            className="gap-2 rounded-xl shadow-sm hover:shadow-md transition-all bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4" />
            Add New Property
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 rounded-lg"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="rounded-lg">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Organic Home">Organic Home</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-semibold mt-1">{properties.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Live</p>
                <p className="text-2xl font-semibold mt-1 text-emerald-600">
                  {properties.filter((p) => p.status === "Live").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold mt-1 text-amber-600">
                  {properties.filter((p) => p.status === "Pending").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl font-semibold mt-1 text-gray-600">
                  {properties.filter((p) => p.status === "Closed").length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Table */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="p-0">
          {filteredProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="font-semibold">Photo</TableHead>
                    <TableHead className="font-semibold">Property Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Visibility</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow
                      key={property.id}
                      className="hover:bg-muted/50 transition-colors border-border/50"
                    >
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={property.image}
                            alt={property.propertyName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{property.propertyName}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {property.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {property.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-foreground">{property.price}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusBadge(property.status)} font-normal`}
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getVisibilityBadge(
                            property.visibility
                          )} font-normal`}
                        >
                          {property.visibility}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {property.status === "Pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
                              onClick={() => handleApprove(property)}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {property.status === "Live" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900/30"
                              onClick={() => handleClose(property)}
                              title="Mark as Closed"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30"
                            onClick={() => handleEdit(property)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No properties found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No properties match your current filters. Try adjusting your search criteria."
                  : "Get started by adding your first property to the system."}
              </p>
              <Button
                onClick={() => {
                  setSelectedProperty(null);
                  setPropertyForm({
                    propertyName: "",
                    category: "",
                    visibility: "Public",
                    price: "",
                    location: "",
                    description: "",
                    bedrooms: "",
                    bathrooms: "",
                    sqft: "",
                    commercialType: "",
                    amenities: [],
                    documents: [],
                    images: [],
                  });
                  setAddPropertyOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Property Dialog */}
      <Sheet open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Property</SheetTitle>
            <SheetDescription>
              Fill in the property details and upload required documents
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {propertyFormContent}
          </div>

          <SheetFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setAddPropertyOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProperty}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Add Property
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Property Dialog */}
      <Sheet open={editPropertyOpen} onOpenChange={setEditPropertyOpen}>
        <SheetContent className="sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Property</SheetTitle>
            <SheetDescription>
              Update property details and documents
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {propertyFormContent}
          </div>

          <SheetFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setEditPropertyOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProperty}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Save Changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Bulk Upload Properties</DialogTitle>
            <DialogDescription>
              Upload multiple properties using an Excel file
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="border-dashed bg-muted/30">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Upload Excel File
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      .xlsx, .xls up to 10MB
                    </p>
                  </div>
                  <Button className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <button className="underline hover:text-foreground">
                Download sample Excel template
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkUploadOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Properties uploaded successfully");
                setBulkUploadOpen(false);
              }}
              className="rounded-lg"
            >
              Upload Properties
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Property Dialog */}
      <Dialog open={closePropertyOpen} onOpenChange={setClosePropertyOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Close Property & Add to Sold</DialogTitle>
            <DialogDescription>
              Enter buyer details and finalize the sale for {propertyToClose?.propertyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="buyerName">Buyer Name *</Label>
              <Input
                id="buyerName"
                placeholder="Enter buyer's full name"
                value={buyerForm.name}
                onChange={(e) => setBuyerForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="buyerEmail">Buyer Email</Label>
              <Input
                id="buyerEmail"
                type="email"
                placeholder="buyer@email.com"
                value={buyerForm.email}
                onChange={(e) => setBuyerForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="buyerPhone">Buyer Phone</Label>
              <Input
                id="buyerPhone"
                placeholder="+91 00000 00000"
                value={buyerForm.phone}
                onChange={(e) => setBuyerForm(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="finalPrice">Final Sale Price *</Label>
              <Input
                id="finalPrice"
                placeholder="e.g., ₹85 Lakh"
                value={buyerForm.finalPrice}
                onChange={(e) => setBuyerForm(prev => ({ ...prev, finalPrice: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="commission">Commission</Label>
              <Input
                id="commission"
                placeholder="e.g., ₹4.25 Lakh"
                value={buyerForm.commission}
                onChange={(e) => setBuyerForm(prev => ({ ...prev, commission: e.target.value }))}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClosePropertyOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClose}
              className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Confirm & Move to Sold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
