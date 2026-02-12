import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  ArrowRightLeft,
  MapPin,
  Home,
  DollarSign,
  CheckCircle2,
  Eye,
  FileCheck,
  AlertCircle,
  TrendingUp,
  User,
} from "lucide-react";
import { Enquiry } from "./EnquiriesManagement";
import { Progress } from "../ui/progress";
import { cn } from "../ui/utils";

interface ExchangeComparisonCardProps {
  enquiry: Enquiry;
  onView: (enquiry: Enquiry) => void;
}

export function ExchangeComparisonCard({ enquiry, onView }: ExchangeComparisonCardProps) {
  const valuationMatch = enquiry.valuationMatch || 0;
  const documentsVerified = true; // Mock data

  const getMatchColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600 dark:text-green-400";
    if (percentage >= 85) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 75) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchBadge = (percentage: number) => {
    if (percentage >= 95) return "Excellent Match";
    if (percentage >= 85) return "Good Match";
    if (percentage >= 75) return "Fair Match";
    return "Poor Match";
  };

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                EXCHANGE ENQUIRY
              </Badge>
              <span className="font-mono text-sm text-muted-foreground">{enquiry.id}</span>
            </div>
            <h3 className="text-xl font-medium mb-1">{enquiry.propertyName}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {enquiry.location}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onView(enquiry)} className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>

        {/* Valuation Match */}
        <div className="mb-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Valuation Match</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl", getMatchColor(valuationMatch))}>
                {valuationMatch}%
              </span>
              <Badge
                className={cn(
                  valuationMatch >= 85
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                )}
              >
                {getMatchBadge(valuationMatch)}
              </Badge>
            </div>
          </div>
          <Progress value={valuationMatch} className="h-2" />
        </div>

        {/* Property Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property A */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Property A</p>
                <p className="text-xs text-muted-foreground">Offering</p>
              </div>
            </div>

            <Card className="border-border/50 bg-blue-50/50 dark:bg-blue-950/10">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-medium">{enquiry.propertyA?.name || "Downtown Loft"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {enquiry.propertyA?.location || "Mumbai Central"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {enquiry.propertyA?.value || "₹95 Lakh"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span>Apartment</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Area</span>
                    <span>1,200 sqft</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{enquiry.buyerName}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Arrow Indicator */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 z-10">
            <div className="w-12 h-12 rounded-full bg-background border-2 border-orange-500 flex items-center justify-center shadow-lg">
              <ArrowRightLeft className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Property B */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Home className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Property B</p>
                <p className="text-xs text-muted-foreground">Receiving</p>
              </div>
            </div>

            <Card className="border-border/50 bg-purple-50/50 dark:bg-purple-950/10">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-medium">{enquiry.propertyB?.name || "Suburban Villa"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {enquiry.propertyB?.location || "Thane West"}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valuation</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {enquiry.propertyB?.value || "₹98 Lakh"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span>Villa</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Area</span>
                    <span>1,500 sqft</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{enquiry.sellerName}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Verification */}
        <div className="mt-6 p-4 rounded-lg border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Document Verification</span>
            </div>
            {documentsVerified ? (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                <AlertCircle className="h-3 w-3" />
                Pending
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Property A Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Property B Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Owner Consent Forms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-muted-foreground">Legal Clearance</span>
            </div>
          </div>
        </div>

        {/* Enquiry Info & Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={enquiry.status === "Negotiating" 
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }>
              {enquiry.status}
            </Badge>
            {enquiry.assignedAgent && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                  {enquiry.assignedAgent.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-sm text-muted-foreground">
                  {enquiry.assignedAgent.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {valuationMatch >= 90 && enquiry.status === "Negotiating" && (
              <Button className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Approve Exchange
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
