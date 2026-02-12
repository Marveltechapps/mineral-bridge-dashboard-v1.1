import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Textarea } from "../../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import {
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Paperclip,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RefundDispute {
  id: string;
  type: "refund" | "dispute";
  user: string;
  property: string;
  amount: string;
  reason: string;
  description: string;
  status: "new" | "under-review" | "approved" | "rejected" | "resolved";
  createdDate: string;
  resolvedDate?: string;
  attachments: string[];
  transactionId: string;
}

const mockRefundsDisputes: RefundDispute[] = [
  {
    id: "RD001",
    type: "refund",
    user: "Rajesh Kumar",
    property: "Skyline Towers - Unit 402",
    amount: "₹85,00,000",
    reason: "Property mismatch",
    description: "The property specifications do not match what was advertised. Requesting full refund.",
    status: "new",
    createdDate: "2024-11-11",
    attachments: ["document1.pdf", "photo1.jpg"],
    transactionId: "TXN001",
  },
  {
    id: "RD002",
    type: "dispute",
    user: "Ahmed Al-Rashid",
    property: "Marina Bay Apartment",
    amount: "AED 2,500,000",
    reason: "Payment issue",
    description: "Payment was deducted twice from my account. Need clarification and refund of duplicate amount.",
    status: "under-review",
    createdDate: "2024-11-10",
    attachments: ["bank_statement.pdf"],
    transactionId: "TXN002",
  },
  {
    id: "RD003",
    type: "refund",
    user: "Priya Sharma",
    property: "Green Valley Villa",
    amount: "₹1,20,00,000",
    reason: "Construction delay",
    description: "Project completion delayed by 18 months. Requesting refund as per agreement.",
    status: "approved",
    createdDate: "2024-11-09",
    resolvedDate: "2024-11-11",
    attachments: ["agreement.pdf", "timeline.pdf"],
    transactionId: "TXN003",
  },
  {
    id: "RD004",
    type: "dispute",
    user: "Michael Chen",
    property: "Downtown Loft",
    amount: "₹96,50,000",
    reason: "Hidden charges",
    description: "Additional charges were applied after payment confirmation. These were not disclosed upfront.",
    status: "resolved",
    createdDate: "2024-11-08",
    resolvedDate: "2024-11-10",
    attachments: ["invoice.pdf", "email_thread.pdf"],
    transactionId: "TXN004",
  },
  {
    id: "RD005",
    type: "refund",
    user: "Sanya Malhotra",
    property: "Lakeside Plot",
    amount: "₹45,00,000",
    reason: "Legal issues",
    description: "Land has legal disputes that were not disclosed. Cannot proceed with purchase.",
    status: "rejected",
    createdDate: "2024-11-07",
    resolvedDate: "2024-11-09",
    attachments: ["legal_notice.pdf"],
    transactionId: "TXN007",
  },
];

export function RefundsDisputesPage() {
  const [items, setItems] = useState<RefundDispute[]>(mockRefundsDisputes);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<RefundDispute | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: items.length,
    new: items.filter((i) => i.status === "new").length,
    underReview: items.filter((i) => i.status === "under-review").length,
    resolved: items.filter((i) => i.status === "resolved" || i.status === "approved").length,
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "under-review": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
    return colors[status as keyof typeof colors];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      refund: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      dispute: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return colors[type as keyof typeof colors];
  };

  const handleApprove = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "approved" as const,
              resolvedDate: new Date().toISOString().split("T")[0],
            }
          : item
      )
    );
    setDetailDialogOpen(false);
    toast.success("Request approved successfully");
  };

  const handleReject = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "rejected" as const,
              resolvedDate: new Date().toISOString().split("T")[0],
            }
          : item
      )
    );
    setDetailDialogOpen(false);
    toast.success("Request rejected");
  };

  const handleEscalate = (id: string) => {
    toast.info("Case escalated to senior management");
    setDetailDialogOpen(false);
  };

  const handleViewDetails = (item: RefundDispute) => {
    setSelectedItem(item);
    setDetailDialogOpen(true);
    setActionNote("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Refunds & Disputes</h1>
          <p className="text-muted-foreground">
            Manage refund requests and dispute cases
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
              <p className="text-3xl">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">New</p>
              <p className="text-3xl">{stats.new}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Under Review</p>
              <p className="text-3xl">{stats.underReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl">{stats.resolved}</p>
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
                placeholder="Search by case ID, user, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="dispute">Dispute</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Case ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Attachments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell>
                      <span className="font-mono text-sm font-medium">{item.id}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(item.type)}>
                        {item.type === "refund" && <RefreshCw className="h-3 w-3 mr-1" />}
                        {item.type === "dispute" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {item.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span>{item.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="max-w-[150px] truncate block">{item.property}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{item.reason}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === "new" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {item.status === "under-review" && <Clock className="h-3 w-3 mr-1" />}
                        {(item.status === "approved" || item.status === "resolved") && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {item.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>{new Date(item.createdDate).toLocaleDateString()}</span>
                        {item.resolvedDate && (
                          <span className="text-xs text-muted-foreground">
                            Resolved: {new Date(item.resolvedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <Paperclip className="h-3 w-3" />
                        {item.attachments.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Case Details - {selectedItem?.id}</DialogTitle>
            <DialogDescription>Review the complete history and documentation for this refund or dispute case.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3">
                <Badge className={getTypeColor(selectedItem.type)}>
                  {selectedItem.type}
                </Badge>
                <Badge className={getStatusColor(selectedItem.status)}>
                  {selectedItem.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">User</p>
                  <p className="font-medium">{selectedItem.user}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono font-medium">{selectedItem.transactionId}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Property</p>
                  <p className="font-medium">{selectedItem.property}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-xl font-medium">{selectedItem.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created Date</p>
                  <p className="font-medium">
                    {new Date(selectedItem.createdDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Reason</p>
                <p className="font-medium">{selectedItem.reason}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <p className="text-sm">{selectedItem.description}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Attachments ({selectedItem.attachments.length})</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedItem.attachments.map((file, idx) => (
                    <Card key={idx} className="border-border/50">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{file}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {selectedItem.status !== "approved" &&
                selectedItem.status !== "rejected" &&
                selectedItem.status !== "resolved" && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Action Notes</p>
                    <Textarea
                      placeholder="Add notes or comments for this action..."
                      rows={4}
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                    />
                  </div>
                )}
            </div>
          )}
          <DialogFooter>
            {selectedItem &&
              selectedItem.status !== "approved" &&
              selectedItem.status !== "rejected" &&
              selectedItem.status !== "resolved" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleEscalate(selectedItem.id)}
                    className="gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Escalate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedItem.id)}
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedItem.id)}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </>
              )}
            {selectedItem &&
              (selectedItem.status === "approved" ||
                selectedItem.status === "rejected" ||
                selectedItem.status === "resolved") && (
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Close
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
