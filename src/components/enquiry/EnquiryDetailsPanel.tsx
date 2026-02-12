import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  Upload,
  Edit2,
  Save,
  MessageSquare,
  Send,
  Ban,
  Check,
  AlertCircle,
  TrendingUp,
  X,
} from "lucide-react";
import { Enquiry, EnquiryStage, EnquiryStatus, ENQUIRY_STAGES } from "./EnquiriesManagement";
import { EnquiryStageTracker } from "./EnquiryStageTracker";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";

interface EnquiryDetailsPanelProps {
  enquiry: Enquiry | null;
  open: boolean;
  onClose: () => void;
  onApprove: (enquiry: Enquiry) => void;
  onReject: (enquiry: Enquiry) => void;
  onStageUpdate: (enquiryId: string, newStage: EnquiryStage) => void;
}

interface Response {
  id: string;
  date: string;
  author: string;
  authorType: "customer" | "agent" | "system";
  message: string;
}

interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  actor: string;
}

export function EnquiryDetailsPanel({
  enquiry,
  open,
  onClose,
  onApprove,
  onReject,
  onStageUpdate,
}: EnquiryDetailsPanelProps) {
  const [editingStage, setEditingStage] = useState(false);
  const [selectedStage, setSelectedStage] = useState<EnquiryStage | null>(null);
  const [newResponse, setNewResponse] = useState("");
  const [responses, setResponses] = useState<Response[]>([
    {
      id: "R1",
      date: "2024-11-01 10:30 AM",
      author: "Customer",
      authorType: "customer",
      message: "I'm very interested in this property. Can we schedule a viewing?",
    },
    {
      id: "R2",
      date: "2024-11-01 02:15 PM",
      author: "Agent",
      authorType: "agent",
      message: "Absolutely! I've scheduled a viewing for November 5th at 3:00 PM. Looking forward to showing you the property.",
    },
    {
      id: "R3",
      date: "2024-11-04 11:20 AM",
      author: "Customer",
      authorType: "customer",
      message: "Thank you for the viewing. I'd like to proceed with an offer. Can we discuss the pricing?",
    },
  ]);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closeReason, setCloseReason] = useState("");
  const [closureType, setClosureType] = useState<"completed" | "cancelled">("completed");

  if (!enquiry) return null;

  const mockTimeline: TimelineEvent[] = [
    {
      date: "2024-11-01",
      event: "Enquiry Created",
      description: "Initial enquiry received from customer",
      actor: "System",
    },
    {
      date: "2024-11-02",
      event: "Agent Assigned",
      description: `${enquiry.assignedAgent?.name || "Agent"} assigned to this enquiry`,
      actor: enquiry.assignedAgent?.name || "Admin",
    },
    {
      date: "2024-11-03",
      event: "Property Viewing Scheduled",
      description: "Site visit arranged for Nov 5, 2024",
      actor: enquiry.assignedAgent?.name || "Agent",
    },
    {
      date: "2024-11-04",
      event: "Offer Submitted",
      description: `Initial offer of ${enquiry.value} submitted`,
      actor: enquiry.buyerName || enquiry.sellerName || "Client",
    },
  ];

  const mockDocuments = [
    {
      name: "Property Valuation Report.pdf",
      type: "Valuation",
      uploadedBy: enquiry.assignedAgent?.name || "Agent",
      uploadedDate: "2024-11-02",
      size: "2.4 MB",
    },
    {
      name: "Customer KYC Documents.pdf",
      type: "Legal",
      uploadedBy: enquiry.buyerName || enquiry.sellerName || "Customer",
      uploadedDate: "2024-11-01",
      size: "1.8 MB",
    },
    {
      name: "Property Photos.zip",
      type: "Media",
      uploadedBy: enquiry.assignedAgent?.name || "Agent",
      uploadedDate: "2024-11-01",
      size: "15.2 MB",
    },
  ];

  const handleStageUpdate = () => {
    if (selectedStage && enquiry) {
      onStageUpdate(enquiry.id, selectedStage);
      toast.success(`Stage updated to ${selectedStage}`);
      setEditingStage(false);
      setSelectedStage(null);
    }
  };

  const handleAddResponse = () => {
    if (newResponse.trim()) {
      const response: Response = {
        id: `R${responses.length + 1}`,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        author: enquiry.assignedAgent?.name || "Agent",
        authorType: "agent",
        message: newResponse,
      };
      setResponses([...responses, response]);
      setNewResponse("");
      toast.success("Response added successfully");
    }
  };

  const handleCloseEnquiry = () => {
    if (!closeReason.trim()) {
      toast.error("Please provide a reason for closing the enquiry");
      return;
    }

    if (closureType === "completed") {
      toast.success("Enquiry marked as completed");
      onApprove(enquiry);
    } else {
      toast.error("Enquiry has been cancelled");
      onReject(enquiry);
    }
    setCloseDialogOpen(false);
    setCloseReason("");
    onClose();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-[800px] p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Header */}
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <SheetTitle className="text-2xl">{enquiry.propertyName}</SheetTitle>
                      <Badge
                        className={
                          enquiry.type === "buy"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : enquiry.type === "sell"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }
                      >
                        {enquiry.type.toUpperCase()}
                      </Badge>
                    </div>
                    <SheetDescription className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {enquiry.location}
                    </SheetDescription>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="font-mono text-sm font-medium">{enquiry.id}</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              {/* Property Image */}
              {enquiry.propertyImage && (
                <div className="rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={enquiry.propertyImage}
                    alt={enquiry.propertyName}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Enquiry Stage Progress - Editable */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Enquiry Progress</h3>
                    {!editingStage && enquiry.status !== "Completed" && enquiry.status !== "Rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => {
                          setEditingStage(true);
                          setSelectedStage(enquiry.stage);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit Stage
                      </Button>
                    )}
                  </div>

                  {editingStage ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Stage</Label>
                        <Select
                          value={selectedStage || enquiry.stage}
                          onValueChange={(value) => setSelectedStage(value as EnquiryStage)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ENQUIRY_STAGES.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-2" onClick={handleStageUpdate}>
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingStage(false);
                            setSelectedStage(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <EnquiryStageTracker currentStage={enquiry.stage} />
                  )}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Enquiry Value</p>
                        <p className="text-xl">{enquiry.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="text-sm">
                          {new Date(enquiry.lastUpdated).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Customer Responses Section */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Customer Responses & Communication
                </h3>

                {/* Responses List */}
                <div className="space-y-3">
                  {responses.map((response) => (
                    <Card
                      key={response.id}
                      className={
                        response.authorType === "customer"
                          ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-800"
                          : response.authorType === "agent"
                          ? "border-green-200 bg-green-50/50 dark:bg-green-950/10 dark:border-green-800"
                          : "border-border/50 bg-muted/30"
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                                response.authorType === "customer"
                                  ? "bg-blue-500"
                                  : response.authorType === "agent"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }`}
                            >
                              {response.author.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{response.author}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {response.authorType}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{response.date}</span>
                        </div>
                        <p className="text-sm ml-10">{response.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add New Response */}
                {enquiry.status !== "Completed" && enquiry.status !== "Rejected" && (
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <Label className="text-sm mb-2 block">Add Response</Label>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your response to the customer..."
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 gap-2"
                        onClick={handleAddResponse}
                        disabled={!newResponse.trim()}
                      >
                        <Send className="h-3 w-3" />
                        Send Response
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              {/* Consumer Information */}
              {enquiry.type === "buy" && enquiry.buyerName && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Buyer Information
                    </h3>
                    <Card className="border-border/50 bg-muted/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{enquiry.buyerName}</span>
                        </div>
                        {enquiry.buyerEmail && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{enquiry.buyerEmail}</span>
                          </div>
                        )}
                        {enquiry.buyerPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{enquiry.buyerPhone}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <Separator />
                </>
              )}

              {enquiry.type === "sell" && enquiry.sellerName && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Seller Information
                    </h3>
                    <Card className="border-border/50 bg-muted/30">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{enquiry.sellerName}</span>
                        </div>
                        {enquiry.sellerEmail && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{enquiry.sellerEmail}</span>
                          </div>
                        )}
                        {enquiry.sellerPhone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{enquiry.sellerPhone}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <Separator />
                </>
              )}

              {enquiry.type === "exchange" && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Exchange Parties
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Party A */}
                      <Card className="border-border/50 bg-blue-50/50 dark:bg-blue-950/10">
                        <CardContent className="p-4 space-y-3">
                          <p className="text-xs text-muted-foreground">Party A</p>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{enquiry.buyerName}</span>
                          </div>
                          {enquiry.buyerEmail && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="text-xs">{enquiry.buyerEmail}</span>
                            </div>
                          )}
                          {enquiry.buyerPhone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{enquiry.buyerPhone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Party B */}
                      <Card className="border-border/50 bg-green-50/50 dark:bg-green-950/10">
                        <CardContent className="p-4 space-y-3">
                          <p className="text-xs text-muted-foreground">Party B</p>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{enquiry.sellerName}</span>
                          </div>
                          {enquiry.sellerEmail && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              <span className="text-xs">{enquiry.sellerEmail}</span>
                            </div>
                          )}
                          {enquiry.sellerPhone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{enquiry.sellerPhone}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Assigned Agent */}
              {enquiry.assignedAgent && (
                <>
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assigned Agent
                    </h3>
                    <Card className="border-border/50 bg-blue-50 dark:bg-blue-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                            {enquiry.assignedAgent.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium">{enquiry.assignedAgent.name}</p>
                            <p className="text-sm text-muted-foreground">Senior Property Consultant</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Separator />
                </>
              )}

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity Timeline
                </h3>
                <div className="space-y-3">
                  {mockTimeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        {index < mockTimeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <Card className="flex-1 border-border/50 bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium text-sm">{event.event}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground">by {event.actor}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents ({mockDocuments.length})
                  </h3>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <div className="space-y-2">
                  {mockDocuments.map((doc, index) => (
                    <Card key={index} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment Status */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Status
                </h3>
                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Token Amount</span>
                      <span className="font-medium">Pending</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Down Payment</span>
                      <span className="font-medium">Pending</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Final Payment</span>
                      <span className="font-medium">Pending</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              {enquiry.status !== "Completed" && enquiry.status !== "Rejected" && (
                <div className="space-y-3 pt-4">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => {
                        onApprove(enquiry);
                        onClose();
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Enquiry
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => {
                        onReject(enquiry);
                        onClose();
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Enquiry
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setCloseDialogOpen(true)}
                  >
                    <Ban className="h-4 w-4" />
                    Close Enquiry
                  </Button>
                </div>
              )}

              {enquiry.status === "Completed" && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Enquiry Completed
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          This enquiry has been successfully completed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {enquiry.status === "Rejected" && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-medium text-red-900 dark:text-red-100">
                          Enquiry Rejected
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          This enquiry has been rejected and closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Close Enquiry Dialog */}
      <AlertDialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Enquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Please select how you want to close this enquiry and provide a reason.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Closure Type</Label>
              <Select
                value={closureType}
                onValueChange={(value) => setClosureType(value as "completed" | "cancelled")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      Mark as Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-red-600" />
                      Mark as Cancelled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason for Closure</Label>
              <Textarea
                placeholder="Please provide details about why you're closing this enquiry..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCloseReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseEnquiry}
              className={
                closureType === "completed"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              Close Enquiry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
