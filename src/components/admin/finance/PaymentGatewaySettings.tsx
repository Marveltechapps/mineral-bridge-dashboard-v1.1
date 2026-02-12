import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Switch } from "../../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  CreditCard,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff,
  Webhook,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PaymentGateway {
  id: string;
  name: string;
  type: "razorpay" | "stripe" | "paypal" | "paytm" | "phonepe";
  status: "active" | "inactive" | "error";
  mode: "sandbox" | "live";
  webhookStatus: "connected" | "disconnected" | "error";
  credentials: {
    apiKey: string;
    secretKey: string;
    webhookSecret?: string;
  };
  config: {
    supportedMethods: string[];
    currency: string;
    autoCapture: boolean;
  };
}

const mockGateways: PaymentGateway[] = [
  {
    id: "1",
    name: "Razorpay",
    type: "razorpay",
    status: "active",
    mode: "live",
    webhookStatus: "connected",
    credentials: {
      apiKey: "rzp_live_xxxxxxxxxxxxx",
      secretKey: "••••••••••••••••",
      webhookSecret: "whsec_••••••••••••",
    },
    config: {
      supportedMethods: ["UPI", "Cards", "Netbanking", "Wallets"],
      currency: "INR",
      autoCapture: true,
    },
  },
  {
    id: "2",
    name: "Stripe",
    type: "stripe",
    status: "active",
    mode: "live",
    webhookStatus: "connected",
    credentials: {
      apiKey: "pk_live_xxxxxxxxxxxxx",
      secretKey: "••••••••••••••••",
      webhookSecret: "whsec_••••••••••••",
    },
    config: {
      supportedMethods: ["Cards", "Bank Transfer"],
      currency: "USD",
      autoCapture: true,
    },
  },
  {
    id: "3",
    name: "PayPal",
    type: "paypal",
    status: "inactive",
    mode: "sandbox",
    webhookStatus: "disconnected",
    credentials: {
      apiKey: "sb_xxxxxxxxxxxxx",
      secretKey: "••••••••••••••••",
    },
    config: {
      supportedMethods: ["PayPal"],
      currency: "USD",
      autoCapture: false,
    },
  },
];

export function PaymentGatewaySettings() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status as keyof typeof colors];
  };

  const getWebhookColor = (status: string) => {
    const colors = {
      connected: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      disconnected: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status as keyof typeof colors];
  };

  const handleToggleStatus = (id: string) => {
    setGateways(
      gateways.map((gw) =>
        gw.id === id
          ? {
              ...gw,
              status: gw.status === "active" ? ("inactive" as const) : ("active" as const),
            }
          : gw
      )
    );
    toast.success("Gateway status updated");
  };

  const handleToggleMode = (id: string) => {
    setGateways(
      gateways.map((gw) =>
        gw.id === id
          ? {
              ...gw,
              mode: gw.mode === "live" ? ("sandbox" as const) : ("live" as const),
            }
          : gw
      )
    );
    toast.success("Gateway mode updated");
  };

  const handleDeleteGateway = (id: string) => {
    setGateways(gateways.filter((gw) => gw.id !== id));
    toast.success("Gateway removed successfully");
  };

  const getGatewayIcon = (type: string) => {
    // In a real app, these would be actual payment gateway logos
    return <CreditCard className="h-8 w-8" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Payment Gateway Settings</h1>
          <p className="text-muted-foreground">
            Manage payment providers and integration settings
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Gateway
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Gateways</p>
              <p className="text-3xl">{gateways.length}</p>
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
              <p className="text-sm text-muted-foreground mb-1">Active</p>
              <p className="text-3xl">
                {gateways.filter((g) => g.status === "active").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Webhook className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Webhooks Connected</p>
              <p className="text-3xl">
                {gateways.filter((g) => g.webhookStatus === "connected").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Gateways */}
      <div className="space-y-4">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg text-white">
                    {getGatewayIcon(gateway.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">{gateway.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(gateway.status)}>
                        {gateway.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {gateway.status === "inactive" && <XCircle className="h-3 w-3 mr-1" />}
                        {gateway.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {gateway.status}
                      </Badge>
                      <Badge variant="outline">
                        {gateway.mode === "live" ? "🟢 Live" : "🟡 Sandbox"}
                      </Badge>
                      <Badge className={getWebhookColor(gateway.webhookStatus)}>
                        <Webhook className="h-3 w-3 mr-1" />
                        Webhook {gateway.webhookStatus}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGateway(gateway)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGateway(gateway.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Credentials */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">API Credentials</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">API Key</p>
                        <p className="font-mono text-sm">
                          {showApiKey === gateway.id
                            ? gateway.credentials.apiKey
                            : "••••••••••••••••"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowApiKey(showApiKey === gateway.id ? null : gateway.id)
                        }
                      >
                        {showApiKey === gateway.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Secret Key</p>
                        <p className="font-mono text-sm">
                          {showSecretKey === gateway.id
                            ? gateway.credentials.secretKey
                            : "••••••••••••••••"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowSecretKey(showSecretKey === gateway.id ? null : gateway.id)
                        }
                      >
                        {showSecretKey === gateway.id ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {gateway.credentials.webhookSecret && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">Webhook Secret</p>
                          <p className="font-mono text-sm">{gateway.credentials.webhookSecret}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Gateway Status</p>
                        <p className="text-xs text-muted-foreground">
                          {gateway.status === "active" ? "Accepting payments" : "Disabled"}
                        </p>
                      </div>
                      <Switch
                        checked={gateway.status === "active"}
                        onCheckedChange={() => handleToggleStatus(gateway.id)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Environment Mode</p>
                        <p className="text-xs text-muted-foreground">
                          {gateway.mode === "live" ? "Production mode" : "Testing mode"}
                        </p>
                      </div>
                      <Switch
                        checked={gateway.mode === "live"}
                        onCheckedChange={() => handleToggleMode(gateway.id)}
                      />
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-2">Supported Methods</p>
                      <div className="flex flex-wrap gap-1">
                        {gateway.config.supportedMethods.map((method) => (
                          <Badge key={method} variant="outline" className="text-xs">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Currency</p>
                        <Badge variant="outline">{gateway.config.currency}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Gateway Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Gateway</DialogTitle>
            <DialogDescription>Configure a new payment processing gateway for platform transactions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gateway-type">Gateway Provider</Label>
              <Select>
                <SelectTrigger id="gateway-type">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="paytm">Paytm</SelectItem>
                  <SelectItem value="phonepe">PhonePe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" placeholder="Enter API key" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input id="secret-key" type="password" placeholder="Enter secret key" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
              <Input id="webhook-secret" placeholder="Enter webhook secret" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Environment Mode</Label>
              <Select defaultValue="sandbox">
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                  <SelectItem value="live">Live (Production)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Gateway added successfully");
                setAddDialogOpen(false);
              }}
            >
              Add Gateway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
