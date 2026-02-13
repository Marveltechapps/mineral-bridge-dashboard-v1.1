"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Building2, User, FileText, Hash } from "lucide-react";
import type { DashboardState, DashboardAction } from "../../../store/dashboardStore";
import { getRegistryUserName } from "../../../store/dashboardStore";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";

export function BankDetailsCard({
  state,
  dispatch,
  preselectedTransactionId,
}: {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  preselectedTransactionId?: string | null;
}) {
  const [selectedTxId, setSelectedTxId] = useState<string>(preselectedTransactionId ?? "");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [reference, setReference] = useState("");
  const [maskedAccount, setMaskedAccount] = useState("");
  const [saving, setSaving] = useState(false);

  const transactions = state.transactions;
  const selectedTx = selectedTxId
    ? transactions.find((t) => t.id === selectedTxId)
    : null;

  const orderForTx = selectedTx
    ? state.buyOrders.find((o) => o.id === selectedTx.orderId) ?? state.sellOrders.find((o) => o.id === selectedTx.orderId) ?? null
    : null;
  const orderUserId = orderForTx?.userId;
  const linkedFromApp = orderUserId
    ? state.paymentMethods.filter((pm) => pm.userId === orderUserId)
    : [];
  const linkedUserName = orderUserId ? getRegistryUserName(state.registryUsers, orderUserId) : "";
  const orderRole = orderForTx?.type === "Buy" ? "buyer" : "seller";

  useEffect(() => {
    if (preselectedTransactionId) setSelectedTxId(preselectedTransactionId);
  }, [preselectedTransactionId]);

  useEffect(() => {
    if (selectedTx?.paymentDetails) {
      setAccountName(selectedTx.paymentDetails.accountName ?? "");
      setBankName(selectedTx.paymentDetails.bankName ?? "");
      setSwiftBic(selectedTx.paymentDetails.swiftBic ?? "");
      setReference(selectedTx.paymentDetails.reference ?? "");
      setMaskedAccount(selectedTx.paymentDetails.maskedAccount ?? "");
    } else {
      setAccountName("");
      setBankName("");
      setSwiftBic("");
      setReference("");
      setMaskedAccount("");
    }
  }, [selectedTx]);

  const handleSave = () => {
    if (!selectedTx) {
      toast.error("Select a transaction first");
      return;
    }
    setSaving(true);
    dispatch({
      type: "UPDATE_TRANSACTION",
      payload: {
        ...selectedTx,
        paymentDetails: {
          ...selectedTx.paymentDetails,
          accountName: accountName || undefined,
          bankName: bankName || undefined,
          swiftBic: swiftBic || undefined,
          reference: reference || undefined,
          maskedAccount: maskedAccount || undefined,
        },
      },
    });
    setSaving(false);
    toast.success("Bank details saved", {
      description: `${selectedTx.id} · ${accountName || "—"} / ${bankName || "—"}`,
    });
  };

  return (
    <Card className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#A855F7]" />
          Enter bank details (buyer / seller)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select a transaction and enter account name, bank name, SWIFT/BIC, and reference. Used for settlements and payouts.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Transaction</Label>
          <Select value={selectedTxId} onValueChange={setSelectedTxId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select transaction to add bank details…" />
            </SelectTrigger>
            <SelectContent>
              {transactions.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.id} · {t.orderId} · {t.orderType} · {t.mineral} · {t.finalAmount}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTx && (
          <>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-4 space-y-3">
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <Smartphone className="h-4 w-4" />
                Bank details from app (linked to this order’s {orderRole})
              </div>
              {linkedFromApp.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {linkedUserName ? `${linkedUserName} added these in the app. They are linked to this transaction.` : "User added these in the app."}
                  </p>
                  <ul className="space-y-3">
                    {linkedFromApp.map((pm) => (
                      <li key={pm.id} className="text-sm rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-3">
                        <span className="font-medium">{pm.label}</span>
                        {pm.maskedNumber && <span className="text-muted-foreground ml-2">{pm.maskedNumber}</span>}
                        {(pm.accountName || pm.bankName || pm.swiftBic) && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-muted-foreground">
                            {pm.accountName && <span>Account: {pm.accountName}</span>}
                            {pm.bankName && <span>Bank: {pm.bankName}</span>}
                            {pm.swiftBic && <span>SWIFT/BIC: {pm.swiftBic}</span>}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No bank details from the app linked to this order’s {orderRole}. If the {orderRole} adds payment methods in the app (and they are linked to this user), they will appear here.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-account-name" className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Account name
                </Label>
                <Input
                  id="bank-account-name"
                  placeholder="e.g. Samuel Osei Trading Ltd"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name" className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  Bank name
                </Label>
                <Input
                  id="bank-name"
                  placeholder="e.g. Standard Chartered Ghana"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank-swift" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  SWIFT / BIC
                </Label>
                <Input
                  id="bank-swift"
                  placeholder="e.g. SCBLGHAC"
                  value={swiftBic}
                  onChange={(e) => setSwiftBic(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-reference" className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Payment reference
                </Label>
                <Input
                  id="bank-reference"
                  placeholder="e.g. MB-SETTLE-JAN-88"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="bank-masked" className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                Masked account (optional)
              </Label>
              <Input
                id="bank-masked"
                placeholder="e.g. **** 8821"
                value={maskedAccount}
                onChange={(e) => setMaskedAccount(e.target.value)}
                className="border-slate-200 dark:border-slate-700"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#A855F7] hover:bg-purple-600"
            >
              {saving ? "Saving…" : "Save bank details"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
