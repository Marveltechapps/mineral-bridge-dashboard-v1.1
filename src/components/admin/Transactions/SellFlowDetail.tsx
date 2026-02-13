"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import type { Order, DashboardState, DashboardAction } from "../../../store/dashboardStore";
import { getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import { toast } from "sonner";
const LABS = [
  { value: "SGS-Ghana", label: "SGS Ghana" },
  { value: "SGS-Geneva", label: "SGS Geneva" },
  { value: "Deloitte", label: "Deloitte Labs" },
  { value: "sgs-mumbai", label: "SGS Mumbai" },
  { value: "bureau-veritas", label: "Bureau Veritas" },
];

export function SellFlowDetail({
  order,
  state,
  dispatch,
  onAssignTesting,
  onIssueLC,
}: {
  order: Order;
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  onAssignTesting?: (lab: string, resultSummary?: string) => void;
  onIssueLC?: (lcNumber: string) => void;
}) {
  const [teamContactedAt, setTeamContactedAt] = useState(order.teamContactedAt ?? "");
  const [negotiationNotes, setNegotiationNotes] = useState(order.negotiationNotes ?? "");
  const [testingTeamPlace, setTestingTeamPlace] = useState(order.testingTeamPlace ?? "");
  const [selectedLab, setSelectedLab] = useState(order.testingLab ?? "");
  const [testingReportSummary, setTestingReportSummary] = useState(order.testingResultSummary ?? "");
  const [lcNumberInput, setLcNumberInput] = useState(order.lcNumber ?? "");
  const shared = (order.transactionSharedWith ?? "").split(",").filter(Boolean);
  const setShared = (key: string, checked: boolean) => {
    const next = new Set(shared);
    if (checked) next.add(key);
    else next.delete(key);
    dispatch({ type: "UPDATE_ORDER", payload: { ...order, transactionSharedWith: [...next].join(",") } });
  };

  const logistics = getLogisticsDetailsForOrder(state, order.id);
  const linkedTx = state.transactions.find((t) => t.orderId === order.id);

  const updateOrder = (patch: Partial<Order>) => {
    dispatch({ type: "UPDATE_ORDER", payload: { ...order, ...patch } });
    toast.success("Updated");
  };

  const stepDone = (field: keyof Order, value?: string) => {
    const v = order[field];
    return typeof v === "string" ? v.length > 0 : !!v;
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Sell flow: buy request from app → team contact & negotiation → testing team → report → LC → LC credited → logistics → transaction shared. All steps are linked to this order.
      </p>

      {/* 1. Buy request received (from app) */}
      <Card className={stepDone("createdAt") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-sm">1</span>
            Buy request received (from app)
          </CardTitle>
          <CardDescription>User contacted via app; buy request appears on dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p><span className="text-muted-foreground">Order:</span> <strong>{order.id}</strong></p>
          <p><span className="text-muted-foreground">Received:</span> {order.createdAt ?? "—"}</p>
          <p><span className="text-muted-foreground">Mineral:</span> {order.mineral} · {order.qty} {order.unit}</p>
          {stepDone("createdAt") && <Badge className="mt-2 bg-emerald-100 text-emerald-800">Received</Badge>}
        </CardContent>
      </Card>

      {/* 2. Team contacted & negotiation */}
      <Card className={stepDone("teamContactedAt") || stepDone("negotiationNotes") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">2</span>
            Team contacted & negotiation
          </CardTitle>
          <CardDescription>Our team contacts seller; negotiation in progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Date contacted</Label>
            <Input
              type="text"
              placeholder="e.g. Feb 10, 2026"
              value={teamContactedAt}
              onChange={(e) => setTeamContactedAt(e.target.value)}
              onBlur={() => teamContactedAt !== order.teamContactedAt && updateOrder({ teamContactedAt })}
            />
          </div>
          <div>
            <Label>Negotiation notes</Label>
            <Textarea
              placeholder="Price, terms, counter-offers..."
              value={negotiationNotes}
              onChange={(e) => setNegotiationNotes(e.target.value)}
              onBlur={() => negotiationNotes !== order.negotiationNotes && updateOrder({ negotiationNotes })}
              rows={2}
            />
          </div>
          <Button size="sm" onClick={() => updateOrder({ teamContactedAt: teamContactedAt || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), negotiationNotes })}>
            Save contact & negotiation
          </Button>
        </CardContent>
      </Card>

      {/* 3. Send details to testing team */}
      <Card className={stepDone("testingLab") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">3</span>
            Send details to testing team
          </CardTitle>
          <CardDescription>Assign lab and place; testing team goes to location and sends report by mineral.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Testing lab</Label>
            <Select value={selectedLab} onValueChange={setSelectedLab}>
              <SelectTrigger><SelectValue placeholder="Choose lab" /></SelectTrigger>
              <SelectContent>
                {LABS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Place / location (where testing team goes)</Label>
            <Input
              placeholder="e.g. Sunyani Collection Center, Ghana"
              value={testingTeamPlace}
              onChange={(e) => setTestingTeamPlace(e.target.value)}
              onBlur={() => testingTeamPlace !== order.testingTeamPlace && updateOrder({ testingTeamPlace })}
            />
          </div>
          <Button
            size="sm"
            className="bg-[#A855F7] hover:bg-purple-600"
            disabled={!selectedLab}
            onClick={() => {
              if (selectedLab) {
                onAssignTesting?.(selectedLab);
                updateOrder({ testingLab: selectedLab, testingTeamPlace: testingTeamPlace || order.testingTeamPlace });
              }
            }}
          >
            Send to testing team
          </Button>
          {order.testingLab && <p className="text-xs text-muted-foreground">Assigned: {order.testingLab}{order.testingTeamPlace ? ` · ${order.testingTeamPlace}` : ""}</p>}
        </CardContent>
      </Card>

      {/* 4. Testing team report (by mineral) */}
      <Card className={stepDone("testingResultSummary") || stepDone("testingReportReceivedAt") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">4</span>
            Testing report (by mineral)
          </CardTitle>
          <CardDescription>Testing team sends report according to the mineral.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Report summary (by mineral)</Label>
            <Textarea
              placeholder="e.g. Purity 92% | Weight 12.5 kg | Grade A"
              value={testingReportSummary}
              onChange={(e) => setTestingReportSummary(e.target.value)}
              rows={2}
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              onAssignTesting?.(order.testingLab ?? "", testingReportSummary);
              updateOrder({ testingResultSummary: testingReportSummary, testingReportReceivedAt: date });
            }}
          >
            Mark report received
          </Button>
          {order.testingResultSummary && (
            <p className="text-xs text-muted-foreground">
              Received {order.testingReportReceivedAt ?? ""}: {order.testingResultSummary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 5. Issue LC to customer (in the meantime) */}
      <Card className={stepDone("lcNumber") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">5</span>
            Issue LC to customer
          </CardTitle>
          <CardDescription>In the meantime we give LC to the customer (from dashboard).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>LC number</Label>
            <Input
              placeholder="e.g. LC-8821"
              value={lcNumberInput}
              onChange={(e) => setLcNumberInput(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="bg-[#A855F7] hover:bg-purple-600"
            onClick={() => {
              const num = lcNumberInput.trim() || `LC-${order.id.slice(-4)}`;
              onIssueLC?.(num);
              updateOrder({ lcNumber: num });
            }}
          >
            Issue LC
          </Button>
          {order.lcNumber && <p className="text-xs text-muted-foreground">Issued: {order.lcNumber}</p>}
        </CardContent>
      </Card>

      {/* 6. Testing success → LC credited to account */}
      <Card className={stepDone("lcCreditedAt") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">6</span>
            Testing result success → LC credited
          </CardTitle>
          <CardDescription>When testing result is success, LC is credited to their account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!order.lcNumber}
            onClick={() => {
              const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              updateOrder({ lcCreditedAt: date });
              toast.success("LC credited to customer account");
            }}
          >
            Mark LC credited (testing success)
          </Button>
          {order.lcCreditedAt && <p className="text-xs text-muted-foreground mt-2">Credited: {order.lcCreditedAt}</p>}
        </CardContent>
      </Card>

      {/* 7. Logistics details (minerals to our place) */}
      <Card className={!!logistics || stepDone("logisticsDetailsSentAt") ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">7</span>
            Logistics details (minerals to our place)
          </CardTitle>
          <CardDescription>We give logistics details so they get their minerals to our place.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {logistics ? (
            <>
              <p className="text-sm"><strong>{logistics.carrierName}</strong> · {logistics.trackingNumber}</p>
              <p className="text-xs text-muted-foreground">{logistics.notes}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateOrder({ logisticsDetailsSentAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) })}
              >
                Mark logistics details sent
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add logistics in Logistics tab or Logistics Management for order {order.id}.</p>
          )}
          {order.logisticsDetailsSentAt && <p className="text-xs text-emerald-600">Sent: {order.logisticsDetailsSentAt}</p>}
        </CardContent>
      </Card>

      {/* 8. Transaction shared with testing team, logistics, commercial */}
      <Card className={shared.length > 0 ? "border-emerald-200 dark:border-emerald-800" : "border-slate-200 dark:border-slate-700"}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">8</span>
            Transaction shared with
          </CardTitle>
          <CardDescription>Transaction given to testing team, logistics, and other commercial.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <Checkbox checked={shared.includes("testing_team")} onCheckedChange={(c) => setShared("testing_team", !!c)} />
              <span className="text-sm">Testing team</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={shared.includes("logistics")} onCheckedChange={(c) => setShared("logistics", !!c)} />
              <span className="text-sm">Logistics</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox checked={shared.includes("commercial")} onCheckedChange={(c) => setShared("commercial", !!c)} />
              <span className="text-sm">Commercial</span>
            </label>
          </div>
          {linkedTx && (
            <p className="text-xs text-muted-foreground mt-2">
              Linked transaction: <strong>{linkedTx.id}</strong> · {linkedTx.finalAmount} · {linkedTx.status}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
