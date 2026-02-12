import { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  HardHat, 
  Pickaxe, 
  FileBadge, 
  AlertTriangle, 
  ChevronRight, 
  Trophy, 
  DollarSign,
  MessageCircle,
  Truck,
  ExternalLink,
  QrCode
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "../ui/sheet";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useDashboardStore, getRegistryUserName, useAllOrders, getLogisticsDetailsForOrder } from "../../store/dashboardStore";
import type { MineralSubmission } from "../../types/sellSubmissions";
import { toast } from "sonner";

const MINER_APP_USER_ID = "MB-USR-4412-S";

export function ArtisanalMinerDashboard() {
  const { state, dispatch } = useDashboardStore();
  const allOrders = useAllOrders();
  const [isSellSheetOpen, setIsSellSheetOpen] = useState(false);
  const [isSupportSheetOpen, setIsSupportSheetOpen] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportType, setSupportType] = useState("General");
  const [sellForm, setSellForm] = useState({
    mineralType: "Gold",
    form: "Dust" as MineralSubmission["form"],
    quantity: 50,
    unit: "grams" as MineralSubmission["unit"],
    extractionYear: new Date().getFullYear(),
    city: "",
    region: "",
    country: "Ghana",
  });
  const minerStatus = {
    name: "Kivu Mining Co-op",
    verificationStatus: "Verified",
    safetyScore: 85,
    kycStatus: "Approved",
    level: "Silver",
    levelProgress: 85,
    todaysFocus: {
      title: "Upload Site Photo",
      description: "For monthly site verification",
      action: "Upload Photo",
      icon: Camera
    }
  };
  const sellerName = getRegistryUserName(state.registryUsers, MINER_APP_USER_ID) || minerStatus.name;
  const handleSubmitSell = () => {
    const sub: MineralSubmission = {
      id: `MIN-SUB-${new Date().getFullYear()}-${String(state.mineralSubmissions.length + 1).padStart(3, "0")}`,
      sellerId: MINER_APP_USER_ID,
      sellerName,
      sellerCompany: minerStatus.name,
      mineralType: sellForm.mineralType,
      form: sellForm.form,
      quantity: sellForm.quantity,
      unit: sellForm.unit,
      extractionYear: sellForm.extractionYear,
      location: { city: sellForm.city || "—", region: sellForm.region || "—", country: sellForm.country },
      photos: [],
      status: "Submitted",
      aiConfidenceScore: 75,
      reviewerNotes: "",
      blockchainProofEnabled: false,
      sgsStatus: "Not Sent",
      grossOfferValue: sellForm.quantity * (sellForm.mineralType === "Gold" ? 65 : sellForm.mineralType === "Cobalt" ? 35 : 25),
      platformFeePercent: 2.5,
      logisticsCost: 100,
      currency: "USD",
      settlementType: "Standard",
      escrowStatus: "Pending",
      paymentMode: "Bank Settlement",
      auditLog: [{ id: `l-${Date.now()}`, timestamp: new Date(), action: "Mineral submitted from app", actor: "Seller", immutable: true }],
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_MINERAL_SUBMISSION", payload: sub });
    recordAppActivity("listing_created", `Submitted ${sellForm.quantity} ${sellForm.unit} ${sellForm.mineralType} for sale`);
    toast.success("Listing submitted", { description: `${sub.id} will appear in Sell Mineral Management.` });
    setIsSellSheetOpen(false);
    setSellForm({ mineralType: "Gold", form: "Dust", quantity: 50, unit: "grams", extractionYear: new Date().getFullYear(), city: "", region: "", country: "Ghana" });
  };

  const handleSubmitSupport = () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast.error("Please enter subject and message");
      return;
    }
    const id = `TKT-${new Date().getFullYear().toString().slice(-2)}${String(state.enquiries.length + 2020)}`;
    const enquiry = {
      id,
      userId: MINER_APP_USER_ID,
      subject: supportSubject,
      preview: supportMessage.slice(0, 80) + (supportMessage.length > 80 ? "..." : ""),
      status: "Open",
      priority: "Medium",
      time: "Just now",
      type: supportType,
    };
    dispatch({ type: "ADD_ENQUIRY", payload: enquiry });
    recordAppActivity("other", `Submitted support enquiry: ${supportSubject}`);
    toast.success("Enquiry submitted", { description: `Ticket ${id} will appear in Enquiry Management.` });
    setIsSupportSheetOpen(false);
    setSupportSubject("");
    setSupportMessage("");
    setSupportType("General");
  };

  const recordAppActivity = (type: "safety_upload" | "profile_updated" | "kyc_doc_uploaded" | "other" | "listing_created", description: string) => {
    dispatch({
      type: "ADD_APP_ACTIVITY",
      payload: {
        id: `app-${Date.now()}`,
        userId: MINER_APP_USER_ID,
        type,
        description,
        at: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 sm:pb-6">
      {/* 1. Header: Identity + Trust */}
      <header className="bg-white dark:bg-slate-900 border-b p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{minerStatus.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 gap-1 pl-1 pr-2 py-0.5">
                <ShieldCheck className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">{minerStatus.verificationStatus}</span>
              </Badge>
              <span className="text-xs text-muted-foreground">ID: MIN-8821</span>
            </div>
          </div>
          {/* Mobile Profile Avatar or similar could go here */}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 space-y-6 max-w-lg mx-auto w-full">
        
        {/* 2. KYC & Safety Snapshot */}
        <section className="grid grid-cols-2 gap-3">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">KYC Status</p>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">{minerStatus.kycStatus}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Safety Score</p>
                <p className="font-semibold text-blue-700 dark:text-blue-400">{minerStatus.safetyScore}%</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Today's Focus */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Today's Focus</h3>
          </div>
          <Card className="border-l-4 border-l-amber-500 shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <minerStatus.todaysFocus.icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{minerStatus.todaysFocus.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{minerStatus.todaysFocus.description}</p>
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm" onClick={() => recordAppActivity("safety_upload", "Site photo uploaded for monthly verification")}>
                Action
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 4. Quick Actions */}
        <section>
           <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => recordAppActivity("other", "Opened Safety & Training in app")}>
              <HardHat className="h-6 w-6 text-indigo-500" />
              <span className="text-xs font-medium">Safety & Training</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => recordAppActivity("other", "Opened Get Equipment in app")}>
              <Pickaxe className="h-6 w-6 text-orange-500" />
              <span className="text-xs font-medium">Get Equipment</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => recordAppActivity("kyc_doc_uploaded", "Viewed/completed document checklist in app")}>
              <FileBadge className="h-6 w-6 text-purple-500" />
              <span className="text-xs font-medium">Certification</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <span className="text-xs font-medium">Report Incident</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 col-span-2" onClick={() => setIsSupportSheetOpen(true)}>
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <span className="text-xs font-medium">Contact Support</span>
            </Button>
          </div>
        </section>

        {/* 5. Progress & Incentives */}
        <section>
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span className="font-bold">{minerStatus.level} Level</span>
                </div>
                <span className="text-xs opacity-80">{minerStatus.levelProgress}% Complete</span>
              </div>
              <Progress value={minerStatus.levelProgress} className="h-2 bg-white/20" />
              <p className="text-xs mt-3 opacity-90">Reach Gold to unlock premium buyers and lower fees.</p>
            </CardContent>
          </Card>
        </section>

        {/* 5b. Tracking & links from dashboard (QR / link given via Logistics) */}
        {(() => {
          const myOrders = allOrders.filter((o) => o.userId === MINER_APP_USER_ID);
          const withLogistics = myOrders
            .map((o) => ({ order: o, details: getLogisticsDetailsForOrder(state, o.id) }))
            .filter((x): x is { order: typeof x.order; details: NonNullable<typeof x.details> } => !!x.details);
          if (withLogistics.length === 0) return null;
          return (
            <section>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Tracking & links from dashboard</h3>
              <p className="text-xs text-muted-foreground mb-3">QR code and tracking link provided for your orders.</p>
              <div className="space-y-4">
                {withLogistics.map(({ order, details }) => (
                  <Card key={order.id} className="border-none shadow-sm bg-white dark:bg-slate-900">
                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">{order.id}</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{order.mineral} · {order.qty} {order.unit}</p>
                        <p className="text-xs text-slate-500 mt-1">{details.carrierName}{details.trackingNumber ? ` · ${details.trackingNumber}` : ""}</p>
                        {details.trackingUrl && (
                          <a href={details.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-emerald-600 hover:underline">
                            <ExternalLink className="h-4 w-4" /> Open tracking link
                          </a>
                        )}
                      </div>
                      {(details.qrPayload || details.trackingUrl) && (
                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(details.qrPayload || details.trackingUrl)}`}
                            alt={`QR for ${order.id}`}
                            className="w-[120px] h-[120px] rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><QrCode className="h-3 w-3" /> Scan for tracking</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })()}

        {/* 6. Sell CTA */}
        <section>
          <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  Ready to Sell?
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Your inventory is verified and ready.</p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2" onClick={() => setIsSellSheetOpen(true)}>
                Sell Now <DollarSign className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>

      </main>

      <Sheet open={isSellSheetOpen} onOpenChange={setIsSellSheetOpen}>
        <SheetContent className="sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle>Submit Mineral for Sale</SheetTitle>
            <SheetDescription>Add your mineral listing. It will appear in Sell Mineral Management for review.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label>Mineral Type</Label>
              <Select value={sellForm.mineralType} onValueChange={(v) => setSellForm((f) => ({ ...f, mineralType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Cobalt">Cobalt</SelectItem>
                  <SelectItem value="Copper">Copper</SelectItem>
                  <SelectItem value="Lithium">Lithium</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Form</Label>
              <Select value={sellForm.form} onValueChange={(v: MineralSubmission["form"]) => setSellForm((f) => ({ ...f, form: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nugget">Nugget</SelectItem>
                  <SelectItem value="Ore">Ore</SelectItem>
                  <SelectItem value="Dust">Dust</SelectItem>
                  <SelectItem value="Bar">Bar</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input type="number" min={1} value={sellForm.quantity} onChange={(e) => setSellForm((f) => ({ ...f, quantity: Number(e.target.value) || 0 }))} />
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Select value={sellForm.unit} onValueChange={(v: MineralSubmission["unit"]) => setSellForm((f) => ({ ...f, unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grams">grams</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="MT">MT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Location (City)</Label>
              <Input placeholder="City" value={sellForm.city} onChange={(e) => setSellForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Country</Label>
              <Input placeholder="Country" value={sellForm.country} onChange={(e) => setSellForm((f) => ({ ...f, country: e.target.value }))} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSellSheetOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmitSell}>Submit Listing</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isSupportSheetOpen} onOpenChange={setIsSupportSheetOpen}>
        <SheetContent className="sm:max-w-[800px]">
          <SheetHeader>
            <SheetTitle>Contact Support</SheetTitle>
            <SheetDescription>Submit a ticket. It will appear in Enquiry Management for the team to respond.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={supportType} onValueChange={setSupportType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Subject</Label>
              <Input placeholder="Brief subject" value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Message</Label>
              <textarea className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Describe your issue..." value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSupportSheetOpen(false)}>Cancel</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmitSupport}>Submit</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
