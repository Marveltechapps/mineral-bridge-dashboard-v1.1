import { useMemo, useState } from "react";
import { Phone, Search, Mail, ArrowLeft, User, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useDashboardStore, normalizePhone } from "../../store/dashboardStore";
import type { CallHistoryEntry } from "../../store/dashboardStore";

export interface CallHistoryPageProps {
  onBack: () => void;
  /** Pre-filter by this phone number. */
  initialPhone?: string;
  /** When user clicks an order id, open order detail. */
  onOpenOrder?: (orderId: string, type: "buy" | "sell") => void;
}

export function CallHistoryPage({ onBack, initialPhone = "", onOpenOrder }: CallHistoryPageProps) {
  const { state } = useDashboardStore();
  const [phoneFilter, setPhoneFilter] = useState(initialPhone);

  const normalizedFilter = normalizePhone(phoneFilter);
  const filteredEntries = useMemo(() => {
    if (!normalizedFilter) return state.callHistory;
    return state.callHistory.filter((e) => e.normalizedPhone === normalizedFilter);
  }, [state.callHistory, normalizedFilter]);

  const byPhone = useMemo(() => {
    const map = new Map<string, CallHistoryEntry[]>();
    for (const e of filteredEntries) {
      const list = map.get(e.phoneNumber) ?? [];
      list.push(e);
      map.set(e.phoneNumber, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    }
    return map;
  }, [filteredEntries]);

  const phoneNumbers = Array.from(byPhone.keys()).sort();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-2" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Call history</h1>
          <p className="text-muted-foreground text-sm mt-1">
            All contacts (calls and emails) by phone number. Search by number to see history for a specific contact.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by phone (e.g. +233 24 555 0192)"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="pl-9 font-mono"
          />
        </div>
        {phoneFilter && (
          <Button variant="outline" size="sm" onClick={() => setPhoneFilter("")}>
            Clear filter
          </Button>
        )}
      </div>

      {phoneNumbers.length === 0 ? (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <Phone className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-muted-foreground">
              {normalizedFilter ? "No call history for this number." : "No call history yet. Log calls from an order (Log call) or add a communication log entry with Mobile/Email."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {phoneNumbers.map((phone) => {
            const entries = byPhone.get(phone) ?? [];
            const userName = state.registryUsers.find((u) => u.phone && normalizePhone(u.phone) === normalizePhone(phone))?.name;
            return (
              <Card key={phone} className="border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    {phone}
                    {userName && (
                      <span className="text-sm font-normal text-muted-foreground">({userName})</span>
                    )}
                  </CardTitle>
                  <CardDescription>{entries.length} contact(s)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
                    {entries.map((ch) => (
                      <li key={ch.id} className="flex flex-wrap justify-between items-start gap-4 py-3 first:pt-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {ch.type === "call" ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                              {ch.type}
                            </span>
                            {ch.contextLabel && (
                              <span className="text-sm text-muted-foreground">
                                {ch.orderId && onOpenOrder ? (
                                  <button
                                    type="button"
                                    className="text-[#A855F7] hover:underline font-mono"
                                    onClick={() => onOpenOrder(ch.orderId!, (state.buyOrders.some((o) => o.id === ch.orderId) ? "buy" : "sell"))}
                                  >
                                    {ch.contextLabel}
                                  </button>
                                ) : (
                                  ch.contextLabel
                                )}
                              </span>
                            )}
                          </div>
                          {ch.note && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-start gap-1.5">
                              <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                              {ch.note}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 text-xs text-muted-foreground">
                          <p className="font-medium text-slate-700 dark:text-slate-300">{ch.admin}</p>
                          <p>{new Date(ch.at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
