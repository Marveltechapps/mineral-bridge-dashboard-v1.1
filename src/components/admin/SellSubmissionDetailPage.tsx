import { useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Gem,
  Camera,
  ShieldCheck,
  Calculator,
  History,
  Lock,
  AlertTriangle,
  Maximize2,
  ImageIcon,
  Send,
  Download,
  FileText,
  BookOpen,
  Plus,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useDashboardStore } from "../../store/dashboardStore";
import type { MineralSubmission } from "../../types/sellSubmissions";

const UNIT_OPTIONS = ["grams", "kg", "MT"] as const;
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP"] as const;
const AUDIT_ACTORS = ["System", "Admin", "Seller"] as const;
const SELL_CATEGORY_ORDER = ["Raw", "Semi-Processed", "Processed"] as const;

export interface SellSubmissionDetailPageProps {
  submissionId: string;
  onBack: () => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
    case "Sold":
    case "Settled":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "In Review":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Submitted":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
  }
}

export function SellSubmissionDetailPage({ submissionId, onBack }: SellSubmissionDetailPageProps) {
  const { state, dispatch } = useDashboardStore();
  const submission = useMemo(
    () => state.mineralSubmissions.find((s) => s.id === submissionId),
    [state.mineralSubmissions, submissionId]
  );
  const catalogMinerals = state.minerals;
  const sellCategoryOptions = useMemo(() => {
    const base = [...SELL_CATEGORY_ORDER, ...(state.customSellCategories ?? [])];
    const current = submission?.mineralCategory?.trim();
    if (current && !base.includes(current)) return [current, ...base];
    return base;
  }, [state.customSellCategories, submission?.mineralCategory]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newAuditAction, setNewAuditAction] = useState("");
  const [newAuditActor, setNewAuditActor] = useState<"System" | "Admin" | "Seller">("Admin");

  const netPayout = useMemo(() => {
    if (!submission) return 0;
    const gross = submission.grossOfferValue;
    const fee = (gross * submission.platformFeePercent) / 100;
    const logistics = submission.logisticsCost;
    return gross - fee - logistics;
  }, [submission]);

  const handleUpdateSubmission = (updates: Partial<MineralSubmission>) => {
    if (!submission) return;
    const current = state.mineralSubmissions.find((s) => s.id === submission.id);
    if (!current) return;
    const updated: MineralSubmission = { ...current, ...updates };
    if ("status" in updates && (updates.status === "Approved" || updates.status === "Rejected")) {
      updated.verificationSource = "manual";
      updated.lastVerifiedAt = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      dispatch({
        type: "RECORD_VERIFICATION",
        payload: {
          id: `ver-${Date.now()}`,
          at: new Date().toISOString(),
          source: "manual",
          kind: "submission_review",
          entityId: current.id,
          entityType: "submission",
          result: updates.status === "Approved" ? "approved" : "rejected",
          label: `Submission ${updates.status}`,
          actor: "Admin",
        },
      });
    }
    dispatch({ type: "UPDATE_MINERAL_SUBMISSION", payload: updated });
  };

  if (!submission) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button" onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors">
                  Sell Management
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">{submissionId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            Submission not found. It may have been removed.
            <div className="mt-4">
              <Button variant="outline" onClick={onBack}>Back to Sell Management</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedSubmission = submission;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors"
              >
                Sell Management
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">{selectedSubmission.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title only – no fixed header block */}
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{selectedSubmission.id}</h1>

      <div className="space-y-8">
        {/* Seller & status – editable, same style as mineral section (dashboard ↔ app) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <User className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-lg">Seller & status</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Seller name</Label>
                  <Input
                    value={selectedSubmission.sellerName}
                    onChange={(e) => handleUpdateSubmission({ sellerName: e.target.value })}
                    placeholder="Seller name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Seller ID</Label>
                  <Input
                    value={selectedSubmission.sellerId}
                    onChange={(e) => handleUpdateSubmission({ sellerId: e.target.value })}
                    placeholder="e.g. SEL-8821"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Seller company</Label>
                  <Input
                    value={selectedSubmission.sellerCompany}
                    onChange={(e) => handleUpdateSubmission({ sellerCompany: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
                  <Select value={selectedSubmission.status} onValueChange={(val: MineralSubmission["status"]) => handleUpdateSubmission({ status: val })}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Review">In Review</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                      <SelectItem value="Settled">Settled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 1. Mineral details (from app / dashboard) – list of minerals we sell, routed to app; all editable */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Gem className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Mineral details</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              {/* Minerals listed via app – prefill from catalog */}
              {catalogMinerals.length > 0 && (
                <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Select from catalog (minerals listed via app)
                  </Label>
                  <Select
                    value=""
                    onValueChange={(mineralId) => {
                      const m = catalogMinerals.find((x) => x.id === mineralId);
                      if (m) {
                        handleUpdateSubmission({
                          mineralName: m.name,
                          mineralDescription: m.description || "",
                          mineralCategory: (m.mineralTypes?.[0] || m.tags?.[0] || "Raw") as string,
                          mineralType: m.mineralTypes?.[0] || m.name,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full max-w-md">
                      <SelectValue placeholder="Choose a mineral to fill name, category, description…" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogMinerals.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} {m.mineralTypes?.length ? `(${m.mineralTypes.join(", ")})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-2 sm:col-span-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mineral name</Label>
                  <Input
                    value={selectedSubmission.mineralName ?? selectedSubmission.mineralType}
                    onChange={(e) => handleUpdateSubmission({ mineralName: e.target.value })}
                    placeholder="e.g. Gold, Lithium Carbonate"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mineral category</Label>
                  <Select
                    value={selectedSubmission.mineralCategory ?? ""}
                    onValueChange={(value) => handleUpdateSubmission({ mineralCategory: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category (Raw, Semi-Processed, Processed…)" />
                    </SelectTrigger>
                    <SelectContent>
                      {sellCategoryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mineral description</Label>
                  <Textarea
                    value={selectedSubmission.mineralDescription ?? ""}
                    onChange={(e) => handleUpdateSubmission({ mineralDescription: e.target.value })}
                    placeholder="Describe the mineral, grade, use case…"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              {/* Net Payout & Blockchain – below description, editable */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col justify-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <Label className="text-xs text-muted-foreground mb-1">Net Payout Amount</Label>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedSubmission.currency === "USD" ? "$" : selectedSubmission.currency}{" "}
                    {netPayout.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div>
                    <Label className="text-xs text-muted-foreground block mb-1">Blockchain Proof</Label>
                    <span className="text-sm font-medium">{selectedSubmission.blockchainProofEnabled ? "On" : "Off"}</span>
                  </div>
                  <Switch
                    checked={selectedSubmission.blockchainProofEnabled}
                    onCheckedChange={(c) => handleUpdateSubmission({ blockchainProofEnabled: c })}
                  />
                  <ShieldCheck className={`h-5 w-5 ${selectedSubmission.blockchainProofEnabled ? "text-emerald-500" : "text-slate-300"}`} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Mineral type</Label>
                  <Input
                    value={selectedSubmission.mineralType}
                    onChange={(e) => handleUpdateSubmission({ mineralType: e.target.value })}
                    placeholder="e.g. Gold, Cobalt"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Form</Label>
                  <Input
                    value={selectedSubmission.form ?? ""}
                    onChange={(e) => handleUpdateSubmission({ form: e.target.value })}
                    placeholder="e.g. Bar, Ore, Nugget, Dust, Cathodes"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Quantity</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedSubmission.quantity === 0 ? "" : selectedSubmission.quantity}
                    onChange={(e) => handleUpdateSubmission({ quantity: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Unit</Label>
                  <Select
                    value={selectedSubmission.unit}
                    onValueChange={(val: MineralSubmission["unit"]) => handleUpdateSubmission({ unit: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNIT_OPTIONS.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Extraction year</Label>
                  <Input
                    type="number"
                    min={1900}
                    max={2100}
                    value={selectedSubmission.extractionYear === 0 ? "" : selectedSubmission.extractionYear}
                    onChange={(e) => handleUpdateSubmission({ extractionYear: Number(e.target.value) || new Date().getFullYear() })}
                    placeholder={String(new Date().getFullYear())}
                  />
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label>
                    <Input
                      value={selectedSubmission.location.city}
                      onChange={(e) => handleUpdateSubmission({ location: { ...selectedSubmission.location, city: e.target.value } })}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Region</Label>
                    <Input
                      value={selectedSubmission.location.region}
                      onChange={(e) => handleUpdateSubmission({ location: { ...selectedSubmission.location, region: e.target.value } })}
                      placeholder="Region"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Country</Label>
                    <Input
                      value={selectedSubmission.location.country}
                      onChange={(e) => handleUpdateSubmission({ location: { ...selectedSubmission.location, country: e.target.value } })}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Photo Evidence – add via URL */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Camera className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-lg">Photo Evidence</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-2 flex-wrap items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label className="text-xs text-muted-foreground">Add photo (image URL)</Label>
                  <Input
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!newPhotoUrl.trim()) return;
                    const newPhoto = {
                      id: `photo-${Date.now()}`,
                      url: newPhotoUrl.trim(),
                      timestamp: new Date(),
                      qualityScore: 0,
                      flags: [],
                    };
                    handleUpdateSubmission({ photos: [...selectedSubmission.photos, newPhoto] });
                    setNewPhotoUrl("");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {selectedSubmission.photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden border">
                    <img src={photo.url} alt="Mineral Evidence" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={(ev) => {
                          ev.preventDefault();
                          handleUpdateSubmission({ photos: selectedSubmission.photos.filter((p) => p.id !== photo.id) });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Score: {photo.qualityScore}%
                    </div>
                    {photo.flags.length > 0 && (
                      <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                        {photo.flags.map((flag) => (
                          <Badge key={flag} variant="destructive" className="text-[10px] px-1.5 h-5 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {flag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {selectedSubmission.photos.length === 0 && (
                  <div className="col-span-2 h-32 flex flex-col items-center justify-center text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-md border border-dashed">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span>No photos yet. Add an image URL above.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Verification Pipeline */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="font-semibold text-lg">Verification Pipeline</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AI Confidence Score (0–100)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      className="w-24"
                      value={selectedSubmission.aiConfidenceScore === 0 ? "" : selectedSubmission.aiConfidenceScore}
                      onChange={(e) => handleUpdateSubmission({ aiConfidenceScore: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                      placeholder="0"
                    />
                    <span className="text-muted-foreground">%</span>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[80px]">
                      <div
                        className={`h-full ${selectedSubmission.aiConfidenceScore > 80 ? "bg-emerald-500" : selectedSubmission.aiConfidenceScore > 50 ? "bg-amber-500" : "bg-slate-400"}`}
                        style={{ width: `${selectedSubmission.aiConfidenceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Verification Source</Label>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        selectedSubmission.verificationSource === "manual"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                      }
                    >
                      {selectedSubmission.verificationSource === "manual"
                        ? `Manual${selectedSubmission.lastVerifiedAt ? ` • ${selectedSubmission.lastVerifiedAt}` : ""}`
                        : `AI (${selectedSubmission.aiConfidenceScore}%)`}
                    </Badge>
                    {!selectedSubmission.verificationSource && (
                      <span className="text-xs text-muted-foreground">Not yet verified</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Reviewer Notes</Label>
                <Textarea
                  placeholder="Add notes about this submission..."
                  value={selectedSubmission.reviewerNotes}
                  onChange={(e) => handleUpdateSubmission({ reviewerNotes: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label>Testing & Certification (3rd party)</Label>
                  <Badge
                    variant="secondary"
                    className={`${
                      selectedSubmission.sgsStatus === "Received"
                        ? "bg-emerald-100 text-emerald-700"
                        : selectedSubmission.sgsStatus === "Sent"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedSubmission.sgsStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Choose SGS or another 3rd party testing partner. Same flow: send sample, mark received, view report.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Partner</Label>
                    <Select
                      value={selectedSubmission.verificationPartner ?? "SGS"}
                      onValueChange={(v: "SGS" | "Other") => handleUpdateSubmission({ verificationPartner: v })}
                    >
                      <SelectTrigger className="h-9"><SelectValue placeholder="Partner" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SGS">SGS (3rd party)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedSubmission.verificationPartner === "Other" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Other partner name</Label>
                      <Input
                        placeholder="e.g. Bureau Veritas"
                        value={selectedSubmission.verificationPartnerName ?? ""}
                        onChange={(e) => handleUpdateSubmission({ verificationPartnerName: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={selectedSubmission.sgsStatus !== "Not Sent"}
                    onClick={() => handleUpdateSubmission({ sgsStatus: "Sent" })}
                  >
                    <Send className="h-4 w-4" />
                    {selectedSubmission.sgsStatus === "Not Sent"
                      ? `Send to ${selectedSubmission.verificationPartner === "Other" && selectedSubmission.verificationPartnerName ? selectedSubmission.verificationPartnerName : "SGS"}`
                      : `Sent to ${selectedSubmission.verificationPartner === "Other" && selectedSubmission.verificationPartnerName ? selectedSubmission.verificationPartnerName : "SGS"}`}
                  </Button>
                  {selectedSubmission.sgsStatus === "Received" ? (
                    <Button variant="outline" className="flex-1 gap-2 text-emerald-600 border-emerald-200 bg-emerald-50">
                      <FileText className="h-4 w-4" />
                      View Report
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      disabled={selectedSubmission.sgsStatus === "Not Sent"}
                      onClick={() => handleUpdateSubmission({ sgsStatus: "Received" })}
                    >
                      <Download className="h-4 w-4" />
                      {selectedSubmission.sgsStatus === "Sent" ? "Mark Received" : "No Report"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. Pricing & Offer Calculation – all editable */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Calculator className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-lg">Offer & Payout Engine</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={selectedSubmission.currency}
                    onValueChange={(val) => handleUpdateSubmission({ currency: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gross Offer Value ({selectedSubmission.currency})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedSubmission.grossOfferValue === 0 ? "" : selectedSubmission.grossOfferValue}
                    onChange={(e) => handleUpdateSubmission({ grossOfferValue: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    value={selectedSubmission.platformFeePercent === 0 ? "" : selectedSubmission.platformFeePercent}
                    onChange={(e) => handleUpdateSubmission({ platformFeePercent: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logistics & Insurance ({selectedSubmission.currency})</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedSubmission.logisticsCost === 0 ? "" : selectedSubmission.logisticsCost}
                    onChange={(e) => handleUpdateSubmission({ logisticsCost: Number(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Settlement type</Label>
                  <Select
                    value={selectedSubmission.settlementType}
                    onValueChange={(val: MineralSubmission["settlementType"]) => handleUpdateSubmission({ settlementType: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guaranteed">Guaranteed</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment mode</Label>
                  <Select
                    value={selectedSubmission.paymentMode}
                    onValueChange={(val: MineralSubmission["paymentMode"]) => handleUpdateSubmission({ paymentMode: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instant Transfer">Instant Transfer</SelectItem>
                      <SelectItem value="Bank Settlement">Bank Settlement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-emerald-600 dark:text-emerald-400 font-semibold">Net Payout (read-only)</Label>
                  <div className="flex items-center h-10 px-3 rounded-md bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold font-mono">
                    {selectedSubmission.currency} {netPayout.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. Audit & Activity Log – add entries */}
        <section className="space-y-3 pb-8">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <History className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-lg">Audit & Activity Log</h3>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[200px] space-y-2">
                  <Label className="text-xs text-muted-foreground">Add audit entry</Label>
                  <Input
                    value={newAuditAction}
                    onChange={(e) => setNewAuditAction(e.target.value)}
                    placeholder="e.g. Price updated, Document received"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className="text-xs text-muted-foreground">Actor</Label>
                  <Select value={newAuditActor} onValueChange={(v) => setNewAuditActor(v as "System" | "Admin" | "Seller")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUDIT_ACTORS.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!newAuditAction.trim()) return;
                    const newEntry = {
                      id: `log-${Date.now()}`,
                      timestamp: new Date(),
                      action: newAuditAction.trim(),
                      actor: newAuditActor,
                      immutable: false,
                    };
                    handleUpdateSubmission({ auditLog: [...selectedSubmission.auditLog, newEntry] });
                    setNewAuditAction("");
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <Separator />
              <div className="divide-y">
                {selectedSubmission.auditLog.map((log, i) => (
                  <div key={log.id} className="flex items-start gap-4 p-4">
                    <div className="min-w-[80px] text-xs text-muted-foreground pt-0.5">
                      {format(log.timestamp, "HH:mm")}
                      <div className="text-[10px] opacity-70">{format(log.timestamp, "MMM dd")}</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{log.actor}</Badge>
                      </div>
                    </div>
                    {log.immutable && <Lock className="h-3 w-3 text-slate-300 shrink-0" />}
                  </div>
                ))}
                {selectedSubmission.auditLog.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground text-center">No audit entries yet. Add one above.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
