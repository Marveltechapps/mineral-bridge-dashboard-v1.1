import { useMemo } from "react";
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
import { Activity, ExternalLink } from "lucide-react";
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
  other: "Other",
};

export function AuditLogPage({
  onNavigateToOrder,
  onNavigateToTransaction,
  onNavigateToUser,
}: {
  onNavigateToOrder?: (orderId: string, type: "buy" | "sell") => void;
  onNavigateToTransaction?: (transactionId: string) => void;
  onNavigateToUser?: (userId: string) => void;
}) {
  const { state } = useDashboardStore();
  const activities = useMemo(
    () => state.appActivities,
    [state.appActivities]
  );

  const getUserName = (userId: string) =>
    getRegistryUserName(state.registryUsers, userId) || userId;

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
                {activities.map((a) => (
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
                        {!a.metadata?.orderId && !a.metadata?.transactionId && !a.metadata?.userId && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center">No activity recorded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
