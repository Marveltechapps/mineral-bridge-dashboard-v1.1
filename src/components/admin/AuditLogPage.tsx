import { useMemo, useState } from "react";
import { useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";
import type { AppActivity } from "../../store/dashboardStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Activity, ExternalLink, Filter, Search } from "lucide-react";
import { format } from "date-fns";

const TYPE_LABELS: Record<AppActivity["type"], string> = {
  profile_updated: "Profile",
  kyc_doc_uploaded: "KYC",
  onboarding_step: "Onboarding",
  listing_created: "Listing",
  order_submitted: "Order",
  app_login: "App Login",
  settings_updated: "Settings",
  safety_upload: "Safety",
  payment_released: "Payment",
  bulk_export: "Bulk Export",
  email_sent: "Email",
  sms_sent: "SMS",
  user_status_updated: "User Status",
  enquiry_replied: "Enquiry",
  dashboard_login: "Login",
  submission_audit: "Submission",
  order_communication: "Communication",
  other: "Other",
};

export function AuditLogPage({
  onNavigateToOrder,
  onNavigateToTransaction,
  onNavigateToUser,
  onNavigateToSubmission,
}: {
  onNavigateToOrder?: (orderId: string, type: "buy" | "sell") => void;
  onNavigateToTransaction?: (transactionId: string) => void;
  onNavigateToUser?: (userId: string) => void;
  onNavigateToSubmission?: (submissionId: string) => void;
}) {
  const { state } = useDashboardStore();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activities = useMemo(
    () => state.appActivities,
    [state.appActivities]
  );

  const getUserName = (userId: string) =>
    getRegistryUserName(state.registryUsers, userId) || userId;

  const filteredActivities = useMemo(() => {
    let list = activities;
    if (typeFilter !== "all") {
      list = list.filter((a) => a.type === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) =>
          getUserName(a.userId).toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          (a.metadata?.orderId ?? "").toLowerCase().includes(q) ||
          (a.metadata?.transactionId ?? "").toLowerCase().includes(q) ||
          (a.metadata?.submissionId ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [activities, typeFilter, searchQuery, state.registryUsers]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="h-7 w-7 text-[#A855F7]" />
          Audit & Activity Log
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          All app and dashboard actions. Use links to jump to related orders, transactions, or users.
        </p>
      </div>

      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
          <CardDescription>Chronological log with links to related entities</CardDescription>
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <Filter className="h-4 w-4 text-slate-500 shrink-0" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 rounded-lg border-slate-200 dark:border-slate-700 w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {(Object.entries(TYPE_LABELS) as [AppActivity["type"], string][]).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              <Input
                placeholder="Search user, description, order or TX..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-lg border-slate-200 dark:border-slate-700"
              />
            </div>
            {(typeFilter !== "all" || searchQuery.trim()) && (
              <span className="text-xs text-muted-foreground">
                Showing {filteredActivities.length} of {activities.length}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                  <TableHead className="font-semibold">Time</TableHead>
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold text-right">Related</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((a) => (
                  <TableRow key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(a.at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">{getUserName(a.userId)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {TYPE_LABELS[a.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>{a.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap gap-2 justify-end">
                        {a.metadata?.orderId && (
                          <button
                            type="button"
                            onClick={() => onNavigateToOrder?.(a.metadata!.orderId!, (a.metadata!.orderType as "buy" | "sell") || "buy")}
                            className="text-xs font-medium text-[#A855F7] hover:underline inline-flex items-center gap-1"
                          >
                            Order {a.metadata.orderId}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                        {a.metadata?.transactionId && (
                          <button
                            type="button"
                            onClick={() => onNavigateToTransaction?.(a.metadata!.transactionId!)}
                            className="text-xs font-medium text-[#A855F7] hover:underline inline-flex items-center gap-1"
                          >
                            TX {a.metadata.transactionId}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                        {a.metadata?.userId && (
                          <button
                            type="button"
                            onClick={() => onNavigateToUser?.(a.metadata!.userId!)}
                            className="text-xs font-medium text-[#A855F7] hover:underline inline-flex items-center gap-1"
                          >
                            User {a.metadata.userId}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                        {a.metadata?.submissionId && (
                          <button
                            type="button"
                            onClick={() => onNavigateToSubmission?.(a.metadata!.submissionId!)}
                            className="text-xs font-medium text-[#A855F7] hover:underline inline-flex items-center gap-1"
                          >
                            Submission
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        )}
                        {!a.metadata?.orderId && !a.metadata?.transactionId && !a.metadata?.userId && !a.metadata?.submissionId && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredActivities.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {activities.length === 0
                ? "No activity recorded yet."
                : "No activity matches the current filters. Try changing type or search."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
