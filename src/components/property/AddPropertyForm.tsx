import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { ImageUpload } from "./ImageUpload";
import { AmenityToggles } from "./AmenityToggles";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import { Separator } from "../ui/separator";
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
  MapPin,
  Building,
  Building2,
  Users,
  Video,
  Sun,
  Truck,
  Wind,
  Clock,
  Maximize,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PropertyFormData {
  name: string;
  location: string;
  price: string;
  sqft: string;
  bedrooms: string;
  bathrooms: string;
  propertyType: string;
  commercialType: string;
  about: string;
  images: any[];
  amenities: any[];
  visibility: "Public" | "Private" | "Exchange-Only" | "";
  status: "Live" | "Pending" | "Closed" | "";
}

// Get amenities based on property type
const getAmenitiesByType = (propertyType: string) => {
  const amenitiesMap: Record<string, any[]> = {
    Plot: [
      { id: "electricity", name: "Electricity Connection", icon: Zap, category: "essential", enabled: false },
      { id: "water", name: "Water Supply", icon: Droplets, category: "essential", enabled: false },
      { id: "road", name: "Road Access", icon: Route, category: "essential", enabled: false },
      { id: "boundary", name: "Boundary Wall", icon: Fence, category: "safety", enabled: false },
      { id: "corner", name: "Corner Plot", icon: MapPin, category: "lifestyle", enabled: false },
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

export function AddPropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    location: "",
    price: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    propertyType: "",
    commercialType: "",
    about: "",
    images: [],
    amenities: [],
    visibility: "",
    status: "",
  });

  // Update amenities when property type changes
  useEffect(() => {
    if (formData.propertyType) {
      const newAmenities = getAmenitiesByType(formData.propertyType);
      setFormData((prev) => ({ ...prev, amenities: newAmenities }));
    }
  }, [formData.propertyType]);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.location || !formData.price || !formData.sqft) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!formData.visibility) {
      toast.error("Please select visibility");
      return;
    }

    if (!formData.status) {
      toast.error("Please select status");
      return;
    }

    toast.success("Property added successfully!");
    console.log("Form submitted:", formData);
  };

  // Check if property type requires bedroom/bathroom
  const requiresBedroomBathroom = ["Apartment", "Villa", "Organic Home"].includes(formData.propertyType);
  
  // Check if property type requires commercial type
  const requiresCommercialType = ["Commercial", "Plot"].includes(formData.propertyType);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Property Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Property Type</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyTypeSelector
            selectedType={formData.propertyType}
            onTypeSelect={(type) => handleInputChange("propertyType", type)}
          />
        </CardContent>
      </Card>

      {formData.propertyType && (
        <>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Property Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter property name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="₹ 85 Lakh"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sqft">
                    Area (Sqft) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sqft"
                    value={formData.sqft}
                    onChange={(e) => handleInputChange("sqft", e.target.value)}
                    placeholder="1200"
                  />
                </div>

                {requiresBedroomBathroom && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">
                        Bedrooms <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.bedrooms}
                        onValueChange={(value) => handleInputChange("bedrooms", value)}
                      >
                        <SelectTrigger>
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

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">
                        Bathrooms <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleInputChange("bathrooms", value)}
                      >
                        <SelectTrigger>
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
                  </>
                )}

                {requiresCommercialType && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="commercialType">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.commercialType}
                      onValueChange={(value) => handleInputChange("commercialType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.propertyType === "Commercial" ? (
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About the Property</Label>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <AmenityToggles
                amenities={formData.amenities}
                onAmenityChange={(amenityId, enabled) => {
                  setFormData((prev) => ({
                    ...prev,
                    amenities: prev.amenities.map((amenity) =>
                      amenity.id === amenityId ? { ...amenity, enabled } : amenity
                    ),
                  }));
                }}
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
              />
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Visibility & Status */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Visibility & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visibility */}
              <div className="space-y-3">
                <Label className="text-base">
                  Visibility <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={formData.visibility === "Public" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("visibility", "Public")}
                  >
                    <Eye className="h-5 w-5" />
                    <span>Public</span>
                    <span className="text-xs opacity-70">Visible to everyone</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.visibility === "Private" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("visibility", "Private")}
                  >
                    <EyeOff className="h-5 w-5" />
                    <span>Private</span>
                    <span className="text-xs opacity-70">Invite only</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.visibility === "Exchange-Only" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("visibility", "Exchange-Only")}
                  >
                    <Building className="h-5 w-5" />
                    <span>Exchange-Only</span>
                    <span className="text-xs opacity-70">For exchange deals</span>
                  </Button>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <Label className="text-base">
                  Status <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={formData.status === "Live" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("status", "Live")}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Live</span>
                    <span className="text-xs opacity-70">Active & available</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === "Pending" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("status", "Pending")}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Pending</span>
                    <span className="text-xs opacity-70">Under review</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === "Closed" ? "default" : "outline"}
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => handleInputChange("status", "Closed")}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Closed</span>
                    <span className="text-xs opacity-70">Deal completed</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} size="lg" className="gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Add Property
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
