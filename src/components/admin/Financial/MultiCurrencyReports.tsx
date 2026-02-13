import { useMemo } from "react";
import { useDashboardStore } from "../../../store/dashboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function MultiCurrencyReports() {
  const { state } = useDashboardStore();

  const currencyExposure = useMemo(() => {
    const byCurrency: Record<string, number> = {};
    state.transactions.forEach((tx) => {
      const c = tx.currency ?? tx.targetCurrency ?? "USD";
      const n = parseFloat(tx.finalAmount.replace(/[^0-9.-]/g, "")) || 0;
      byCurrency[c] = (byCurrency[c] ?? 0) + n;
    });
    const total = Object.values(byCurrency).reduce((a, b) => a + b, 0);
    return Object.entries(byCurrency).map(([currency, amount]) => ({
      currency,
      amount,
      pct: total ? ((amount / total) * 100).toFixed(0) + "%" : "0%",
      formatted: currency === "USD" ? `$${(amount / 1e6).toFixed(1)}M` : currency === "GHS" ? `₵${(amount / 1e6).toFixed(1)}M` : `${currency} ${(amount / 1e6).toFixed(1)}M`,
    }));
  }, [state.transactions]);

  const defaultExposure = currencyExposure.length > 0 ? currencyExposure : [
    { currency: "USD", amount: 9.8e6, pct: "78%", formatted: "$9.8M" },
    { currency: "GHS", amount: 1.2e6, pct: "15%", formatted: "₵12.4M" },
    { currency: "CHF", amount: 2.1e6, pct: "7%", formatted: "CHF 2.1M" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">Currency Exposure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defaultExposure.map((c) => (
              <div key={c.currency} className="flex justify-between items-center">
                <span>{c.currency}</span>
                <span className="font-bold">{c.formatted} ({c.pct})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base">FX Rates (Live)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>USD/GHS</span>
              <span>15.42 <span className="text-emerald-500">+0.2%</span></span>
            </div>
            <div className="flex justify-between">
              <span>USD/CHF</span>
              <span>0.87 <span className="text-red-500">-0.1%</span></span>
            </div>
            <div className="flex justify-between">
              <span>USD/EUR</span>
              <span>0.92 <span className="text-emerald-500">+0.05%</span></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
