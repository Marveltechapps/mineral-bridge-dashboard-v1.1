import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
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
} from "../../ui/dialog";
import {
  Search,
  Download,
  Eye,
  FileText,
  Building2,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  transactionId: string;
  date: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  seller: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  property: string;
  propertyType: string;
  baseAmount: number;
  gst: number;
  platformFee: number;
  totalAmount: number;
  status: "paid" | "pending" | "cancelled";
  paymentMethod: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    transactionId: "TXN001",
    date: "2024-11-11",
    buyer: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      address: "123, MG Road, Mumbai, Maharashtra 400001",
    },
    seller: {
      name: "Property Owner Corp",
      email: "contact@propertyowner.com",
      phone: "+91 98765 43211",
      address: "456, Commercial Street, Mumbai, Maharashtra 400002",
    },
    property: "Skyline Towers - Unit 402",
    propertyType: "Apartment",
    baseAmount: 7881356,
    gst: 1418644,
    platformFee: 200000,
    totalAmount: 8500000,
    status: "paid",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    transactionId: "TXN002",
    date: "2024-11-11",
    buyer: {
      name: "Ahmed Al-Rashid",
      email: "ahmed@email.com",
      phone: "+971 50 123 4567",
      address: "Palm Jumeirah, Dubai, UAE",
    },
    seller: {
      name: "Marina Bay Developer",
      email: "sales@marinabay.com",
      phone: "+971 50 123 4568",
      address: "Dubai Marina, Dubai, UAE",
    },
    property: "Marina Bay Apartment",
    propertyType: "Apartment",
    baseAmount: 2150000,
    gst: 350000,
    platformFee: 50000,
    totalAmount: 2500000,
    status: "pending",
    paymentMethod: "Wire Transfer",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    transactionId: "TXN003",
    date: "2024-11-10",
    buyer: {
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43212",
      address: "789, Whitefield, Bangalore, Karnataka 560066",
    },
    seller: {
      name: "Green Valley Developers",
      email: "info@greenvalley.com",
      phone: "+91 98765 43213",
      address: "Electronic City, Bangalore, Karnataka 560100",
    },
    property: "Green Valley Villa",
    propertyType: "Villa",
    baseAmount: 11016949,
    gst: 1983051,
    platformFee: 300000,
    totalAmount: 12000000,
    status: "paid",
    paymentMethod: "UPI",
  },
];

export function InvoicesPage() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status as keyof typeof colors];
  };

  const formatCurrency = (amount: number, currency: string = "₹") => {
    return `${currency}${amount.toLocaleString("en-IN")}`;
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading invoice:", invoice.invoiceNumber);
    alert(`Downloading ${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Invoices</h1>
          <p className="text-muted-foreground">
            Auto-generated invoices for all transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
              <p className="text-3xl">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid Invoices</p>
              <p className="text-3xl">{invoices.filter((i) => i.status === "paid").length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Invoices</p>
              <p className="text-3xl">{invoices.filter((i) => i.status === "pending").length}</p>
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
                placeholder="Search by invoice number, buyer, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/20">
                    <TableCell>
                      <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                          {invoice.buyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{invoice.buyer.name}</p>
                          <p className="text-xs text-muted-foreground">{invoice.buyer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.property}</p>
                        <Badge variant="outline" className="mt-1">
                          {invoice.propertyType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>Review the generated invoice details before sending or downloading.</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl">BuiltGlory</h2>
                    <p className="text-sm text-muted-foreground">Enterprise Real Estate Platform</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-medium">{selectedInvoice.invoiceNumber}</p>
                  <div className="flex items-center gap-2 justify-end mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedInvoice.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buyer and Seller Details */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground">BUYER DETAILS</h3>
                    <div className="space-y-2">
                      <p className="font-medium text-lg">{selectedInvoice.buyer.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{selectedInvoice.buyer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedInvoice.buyer.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{selectedInvoice.buyer.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground">SELLER DETAILS</h3>
                    <div className="space-y-2">
                      <p className="font-medium text-lg">{selectedInvoice.seller.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{selectedInvoice.seller.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{selectedInvoice.seller.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{selectedInvoice.seller.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Property Details */}
              <Card className="border-border/50 bg-muted/30">
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">PROPERTY DETAILS</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-medium">{selectedInvoice.property}</p>
                      <Badge variant="outline" className="mt-2">{selectedInvoice.propertyType}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Transaction ID: {selectedInvoice.transactionId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Amount Breakdown */}
              <div className="space-y-3">
                <h3 className="font-medium">Amount Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Base Amount</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.baseAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.gst)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.platformFee)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 bg-muted/50 px-4 rounded-lg">
                    <span className="font-medium text-lg">Total Amount</span>
                    <span className="text-2xl font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedInvoice.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                      <Badge variant="outline">{selectedInvoice.paymentMethod}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={getStatusColor(selectedInvoice.status)}>
                        {selectedInvoice.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  This is a computer-generated invoice. No signature required.
                </p>
                <Button className="gap-2" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
