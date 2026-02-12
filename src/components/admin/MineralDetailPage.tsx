import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Gem, MapPin, DollarSign, ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
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
import { Mineral } from "./minerals/types";
import { format } from "date-fns";
import { useDashboardStore } from "../../store/dashboardStore";

export interface MineralDetailPageProps {
  mineralId: string;
  onBack: () => void;
  /** Navigate to the full-page form to edit this mineral. */
  onNavigateToEdit?: () => void;
}

export function MineralDetailPage({ mineralId, onBack, onNavigateToEdit }: MineralDetailPageProps) {
  const { state, dispatch } = useDashboardStore();
  const mineral = state.minerals.find((m) => m.id === mineralId);
  const [deleteConfirm, setDeleteConfirm] = useState<Mineral | null>(null);

  const handleDelete = () => {
    if (!deleteConfirm) return;
    dispatch({ type: "REMOVE_MINERAL", payload: deleteConfirm.id });
    setDeleteConfirm(null);
    onBack();
  };

  if (!mineral) {
    return (
      <div className="p-6 space-y-6">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button" onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors">
                  Buy Management
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">{mineralId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card className="border-none shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Mineral not found.</p>
            <Button variant="outline" className="mt-4" onClick={onBack}>
              Back to Buy Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button" onClick={onBack} className="text-xs font-medium text-muted-foreground hover:text-emerald-600 transition-colors">
                Buy Management
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">
              {mineral.name} ({mineral.id})
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header - same style as OrderDetailPage */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{mineral.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mineral.id} · Created {format(mineral.createdAt, "MMM dd, yyyy")}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                variant="outline"
                className={
                  mineral.verificationStatus === "Verified"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : mineral.verificationStatus === "Pending"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }
              >
                {mineral.verificationStatus}
              </Badge>
              {mineral.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="secondary" className="font-normal">
                  {t}
                </Badge>
              ))}
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {mineral.currency === "USD" ? "$" : ""}
                {mineral.basePrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onNavigateToEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => setDeleteConfirm(mineral)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Gem className="h-4 w-4" /> Mineral details
            </CardTitle>
            <CardDescription>Core listing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">ID</Label>
              <p className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{mineral.id}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium">{mineral.name}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="text-sm text-muted-foreground">{mineral.description}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="font-medium">{format(mineral.createdAt, "MMM dd, yyyy")}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <p className="font-medium">{mineral.verificationStatus}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Origin & classification
            </CardTitle>
            <CardDescription>Origin, source type and quality.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Country / Region</Label>
              <p className="font-medium">{mineral.country}{mineral.region ? ` · ${mineral.region}` : ""}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Source type</Label>
              <p className="font-medium">{mineral.sourceType}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Purity</Label>
              <p className="font-medium">{mineral.purity}%{mineral.grade ? ` · ${mineral.grade}` : ""}</p>
            </div>
            {(mineral.mineralTypes?.length ?? 0) > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Mineral type</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mineral.mineralTypes.map((t) => (
                    <Badge key={t} variant="outline" className="font-normal text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label className="text-xs text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {mineral.tags.length ? mineral.tags.map((t) => (
                  <Badge key={t} variant="outline" className="font-normal text-xs">{t}</Badge>
                )) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
            {mineral.badges.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Badges</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mineral.badges.map((b) => (
                    <Badge key={b} variant="secondary" className="font-normal text-xs">{b}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> Pricing & availability
            </CardTitle>
            <CardDescription>Market price and allocation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Base price</Label>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">
                {mineral.currency === "USD" ? "$" : ""}{mineral.basePrice.toLocaleString()} {mineral.currency}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Available quantity</Label>
              <p className="font-medium">{mineral.availableQuantity} MT</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Min allocation</Label>
              <p className="font-medium">{mineral.minAllocation} MT</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Demand indicator</Label>
              <p className="font-medium">{mineral.demandIndicator}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Compliance & visibility
            </CardTitle>
            <CardDescription>Verification and access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Verification</Label>
              <p className="font-medium">{mineral.verificationStatus}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">KYC required</Label>
              <p className="font-medium">{mineral.kycRequired ? "Yes" : "No"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Visible to</Label>
              <p className="text-sm text-muted-foreground">{mineral.visibleTo?.join(", ") || "—"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Institutional buyer category</Label>
              <p className="text-sm text-muted-foreground">
                {mineral.institutionalBuyerCategories?.length ? mineral.institutionalBuyerCategories.join(", ") : "—"}
              </p>
            </div>
            {mineral.regionRestrictions?.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Region restrictions</Label>
                <p className="text-sm text-muted-foreground">{mineral.regionRestrictions.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick actions</CardTitle>
          <CardDescription>Edit listing or return to the catalog.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Back to Buy Management
          </Button>
          <Button variant="outline" size="sm" onClick={onNavigateToEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit listing
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-medium text-foreground">{deleteConfirm?.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
