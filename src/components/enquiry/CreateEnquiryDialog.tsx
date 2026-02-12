import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import {
  TrendingUp,
  ArrowRightLeft,
  User,
  Home,
  MapPin,
  DollarSign,
  UserPlus,
  Building2,
  X,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Enquiry, EnquiryStatus, EnquiryStage } from "./EnquiriesManagement";

interface CreateEnquiryDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateEnquiry: (enquiry: Enquiry) => void;
}

const mockAgents = [
  { id: "A001", name: "Sarah Mitchell" },
  { id: "A002", name: "John Davis" },
  { id: "A003", name: "Lisa Anderson" },
  { id: "A004", name: "Emma Wilson" },
  { id: "A005", name: "David Kumar" },
];

const propertyTypes = ["Apartment", "Villa", "Plot", "Commercial", "Organic Home"];

const currencies = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

export function CreateEnquiryDialog({ open, onClose, onCreateEnquiry }: CreateEnquiryDialogProps) {
  const [enquiryType, setEnquiryType] = useState<"buy" | "sell" | "exchange">("buy");
  const [step, setStep] = useState(1);

  // Common fields
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [value, setValue] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [notes, setNotes] = useState("");

  // Exchange specific
  const [propertyAName, setPropertyAName] = useState("");
  const [propertyALocation, setPropertyALocation] = useState("");
  const [propertyAValue, setPropertyAValue] = useState("");
  const [propertyAType, setPropertyAType] = useState("");
  const [propertyBName, setPropertyBName] = useState("");
  const [propertyBLocation, setPropertyBLocation] = useState("");
  const [propertyBValue, setPropertyBValue] = useState("");
  const [propertyBType, setPropertyBType] = useState("");

  const resetForm = () => {
    setEnquiryType("buy");
    setStep(1);
    setPropertyName("");
    setLocation("");
    setPropertyType("");
    setCurrency("INR");
    setValue("");
    setBuyerName("");
    setSellerName("");
    setAssignedAgent("");
    setNotes("");
    setPropertyAName("");
    setPropertyALocation("");
    setPropertyAValue("");
    setPropertyAType("");
    setPropertyBName("");
    setPropertyBLocation("");
    setPropertyBValue("");
    setPropertyBType("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateStep1 = () => {
    if (enquiryType === "exchange") {
      return (
        propertyAName.trim() !== "" &&
        propertyALocation.trim() !== "" &&
        propertyAValue.trim() !== "" &&
        propertyAType !== "" &&
        propertyBName.trim() !== "" &&
        propertyBLocation.trim() !== "" &&
        propertyBValue.trim() !== "" &&
        propertyBType !== ""
      );
    }
    return (
      propertyName.trim() !== "" &&
      location.trim() !== "" &&
      value.trim() !== "" &&
      propertyType !== ""
    );
  };

  const validateStep2 = () => {
    if (enquiryType === "buy") {
      return buyerName.trim() !== "";
    } else if (enquiryType === "sell") {
      return sellerName.trim() !== "";
    } else {
      return buyerName.trim() !== "" && sellerName.trim() !== "";
    }
  };

  const handleNextStep = () => {
    // Step 1 → 2: No validation needed (enquiry type is already selected)
    // Step 2 → 3: Validate property details
    if (step === 2 && !validateStep1()) {
      toast.error("Please fill in all property details");
      return;
    }
    // Step 3 → 4: Validate client details
    if (step === 3 && !validateStep2()) {
      toast.error("Please fill in all client details");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const getCurrencySymbol = () => {
    return currencies.find((c) => c.code === currency)?.symbol || "₹";
  };

  const handleSubmit = () => {
    if (!validateStep1() || !validateStep2()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newEnquiry: Enquiry = {
      id: `E${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      type: enquiryType,
      propertyName:
        enquiryType === "exchange"
          ? `Exchange: ${propertyAName} ↔ ${propertyBName}`
          : propertyName,
      buyerName: enquiryType !== "sell" ? buyerName : undefined,
      sellerName: enquiryType !== "buy" ? sellerName : undefined,
      assignedAgent: assignedAgent
        ? mockAgents.find((a) => a.id === assignedAgent)
        : undefined,
      stage: "Initial" as EnquiryStage,
      status: "Pending" as EnquiryStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      value:
        enquiryType === "exchange"
          ? `${getCurrencySymbol()} ${propertyAValue} ↔ ${getCurrencySymbol()} ${propertyBValue}`
          : `${getCurrencySymbol()} ${value}`,
      location: enquiryType === "exchange" ? propertyALocation : location,
      timeline: [],
      offers: [],
      documents: [],
    };

    if (enquiryType === "exchange") {
      const valA = parseFloat(propertyAValue.replace(/,/g, ""));
      const valB = parseFloat(propertyBValue.replace(/,/g, ""));
      const match = Math.min((valA / valB) * 100, (valB / valA) * 100);

      newEnquiry.propertyA = {
        name: propertyAName,
        value: `${getCurrencySymbol()} ${propertyAValue}`,
        location: propertyALocation,
        type: propertyAType,
      };
      newEnquiry.propertyB = {
        name: propertyBName,
        value: `${getCurrencySymbol()} ${propertyBValue}`,
        location: propertyBLocation,
        type: propertyBType,
      };
      newEnquiry.valuationMatch = Math.round(match);
    }

    onCreateEnquiry(newEnquiry);
    toast.success(`${enquiryType.charAt(0).toUpperCase() + enquiryType.slice(1)} enquiry created successfully`);
    handleClose();
  };

  const renderEnquiryTypeSelection = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-base mb-3 block">Select Enquiry Type</Label>
        <RadioGroup value={enquiryType} onValueChange={(v) => setEnquiryType(v as any)}>
          <Card
            className={`cursor-pointer transition-all ${
              enquiryType === "buy"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-border/50 hover:border-border"
            }`}
            onClick={() => setEnquiryType("buy")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Buy Enquiry</p>
                  <p className="text-sm text-muted-foreground">
                    Client wants to purchase a property
                  </p>
                </div>
              </Label>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              enquiryType === "sell"
                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                : "border-border/50 hover:border-border"
            }`}
            onClick={() => setEnquiryType("sell")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 rotate-180" />
                </div>
                <div>
                  <p className="font-medium">Sell Enquiry</p>
                  <p className="text-sm text-muted-foreground">
                    Client wants to sell their property
                  </p>
                </div>
              </Label>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              enquiryType === "exchange"
                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                : "border-border/50 hover:border-border"
            }`}
            onClick={() => setEnquiryType("exchange")}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <RadioGroupItem value="exchange" id="exchange" />
              <Label htmlFor="exchange" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <ArrowRightLeft className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium">Exchange Enquiry</p>
                  <p className="text-sm text-muted-foreground">
                    Clients want to exchange properties
                  </p>
                </div>
              </Label>
            </CardContent>
          </Card>
        </RadioGroup>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNextStep}>Next: Property Details</Button>
      </div>
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="space-y-4">
      {enquiryType === "exchange" ? (
        <>
          {/* Property A */}
          <div className="space-y-4 p-4 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium">Property A (Offering)</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="propertyAName">Property Name *</Label>
                <Input
                  id="propertyAName"
                  placeholder="e.g., Downtown Loft"
                  value={propertyAName}
                  onChange={(e) => setPropertyAName(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="propertyALocation">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="propertyALocation"
                    placeholder="e.g., Mumbai Central"
                    className="pl-9"
                    value={propertyALocation}
                    onChange={(e) => setPropertyALocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="propertyAType">Property Type *</Label>
                <Select value={propertyAType} onValueChange={setPropertyAType}>
                  <SelectTrigger id="propertyAType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="propertyAValue">Valuation *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="propertyAValue"
                    placeholder="95,00,000"
                    className="pl-9"
                    value={propertyAValue}
                    onChange={(e) => setPropertyAValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property B */}
          <div className="space-y-4 p-4 rounded-lg border border-purple-200 bg-purple-50/50 dark:bg-purple-950/10 dark:border-purple-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium">Property B (Receiving)</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="propertyBName">Property Name *</Label>
                <Input
                  id="propertyBName"
                  placeholder="e.g., Suburban Villa"
                  value={propertyBName}
                  onChange={(e) => setPropertyBName(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="propertyBLocation">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="propertyBLocation"
                    placeholder="e.g., Thane West"
                    className="pl-9"
                    value={propertyBLocation}
                    onChange={(e) => setPropertyBLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="propertyBType">Property Type *</Label>
                <Select value={propertyBType} onValueChange={setPropertyBType}>
                  <SelectTrigger id="propertyBType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="propertyBValue">Valuation *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="propertyBValue"
                    placeholder="98,00,000"
                    className="pl-9"
                    value={propertyBValue}
                    onChange={(e) => setPropertyBValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <Label htmlFor="propertyName">Property Name *</Label>
            <Input
              id="propertyName"
              placeholder="e.g., Skyline Towers - Unit 402"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Chennai, Tamil Nadu"
                className="pl-9"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} - {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="value">Property Value *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="value"
                placeholder="85,00,000"
                className="pl-9"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {enquiryType === "exchange" && (
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.symbol} - {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleNextStep}>Next: Client Details</Button>
      </div>
    </div>
  );

  const renderClientDetails = () => (
    <div className="space-y-4">
      {enquiryType !== "sell" && (
        <div>
          <Label htmlFor="buyerName">Buyer Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="buyerName"
              placeholder="e.g., Rajesh Kumar"
              className="pl-9"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
          </div>
        </div>
      )}

      {enquiryType !== "buy" && (
        <div>
          <Label htmlFor="sellerName">Seller Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="sellerName"
              placeholder="e.g., Priya Sharma"
              className="pl-9"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="assignedAgent">Assign Agent (Optional)</Label>
        <Select value={assignedAgent} onValueChange={setAssignedAgent}>
          <SelectTrigger id="assignedAgent">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No agent assigned</SelectItem>
            {mockAgents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional information about this enquiry..."
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleNextStep}>Review Enquiry</Button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Enquiry Type</span>
            <span className="font-medium capitalize">{enquiryType}</span>
          </div>
          <Separator />
          {enquiryType === "exchange" ? (
            <>
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Property A</span>
                <p className="font-medium">{propertyAName}</p>
                <p className="text-sm text-muted-foreground">{propertyALocation}</p>
                <p className="text-sm">
                  {propertyAType} • {getCurrencySymbol()} {propertyAValue}
                </p>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Property B</span>
                <p className="font-medium">{propertyBName}</p>
                <p className="text-sm text-muted-foreground">{propertyBLocation}</p>
                <p className="text-sm">
                  {propertyBType} • {getCurrencySymbol()} {propertyBValue}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Property</span>
                <span className="font-medium">{propertyName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">{propertyType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Value</span>
                <span className="font-medium">
                  {getCurrencySymbol()} {value}
                </span>
              </div>
            </>
          )}
          <Separator />
          {buyerName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Buyer</span>
              <span className="font-medium">{buyerName}</span>
            </div>
          )}
          {sellerName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seller</span>
              <span className="font-medium">{sellerName}</span>
            </div>
          )}
          {assignedAgent && assignedAgent !== "none" && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assigned Agent</span>
                <span className="font-medium">
                  {mockAgents.find((a) => a.id === assignedAgent)?.name}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>Create Enquiry</Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Enquiry</DialogTitle>
          <DialogDescription>
            Step {step} of 4: {step === 1 && "Choose enquiry type"}
            {step === 2 && "Property details"}
            {step === 3 && "Client information"}
            {step === 4 && "Review and confirm"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                s <= step ? "bg-blue-500" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <ScrollArea className="max-h-[60vh] pr-4">
          {step === 1 && renderEnquiryTypeSelection()}
          {step === 2 && renderPropertyDetails()}
          {step === 3 && renderClientDetails()}
          {step === 4 && renderReview()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
