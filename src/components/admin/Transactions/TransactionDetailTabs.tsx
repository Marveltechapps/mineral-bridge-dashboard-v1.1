import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BuyFlowPanel } from "./BuyFlowPanel";
import { SellFlowPanel } from "./SellFlowPanel";
import { SellFlowDetail } from "./SellFlowDetail";
import { LCManager } from "./LCManager";
import { TestingPanel } from "./TestingPanel";
import { LogisticsTracker } from "./LogisticsTracker";
import { BankDetailsCard } from "./BankDetailsCard";
import { SendToUserCard } from "./SendToUserCard";
import { getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import type { Order, DashboardState, DashboardAction } from "../../../store/dashboardStore";
import type { TransactionRow } from "./TransactionsTable";
import { FlaskConical, Truck, QrCode } from "lucide-react";

export function TransactionDetailTabs({
  row,
  state,
  dispatch,
  defaultTab = "overview",
  onNotifyBuyer,
  onPushNotification,
}: {
  row: TransactionRow;
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  /** Open this tab by default (e.g. "sendToUser" when user clicked QR in table). */
  defaultTab?: "overview" | "sendToUser" | "payment" | "buy" | "sell" | "lc" | "testing" | "logistics";
  onNotifyBuyer?: () => void;
  onPushNotification?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const order = row.order;
  const logistics = getLogisticsDetailsForOrder(state, order.id);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, row.id]);

  const assignTesting = (lab: string, resultSummary?: string) => {
    dispatch({
      type: "SET_ORDER_TESTING",
      payload: { orderId: order.id, type: order.type, testingLab: lab, testingResultSummary: resultSummary ?? `Lab: ${lab}` },
    });
  };

  const issueLC = (lcNumber: string) => {
    dispatch({
      type: "SET_ORDER_LC",
      payload: { orderId: order.id, type: order.type, lcNumber },
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-wrap h-auto gap-1 p-1">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sendToUser" className="gap-1.5">
          <QrCode className="h-4 w-4" />
          Send QR / link
        </TabsTrigger>
        <TabsTrigger value="payment">Payment & bank</TabsTrigger>
        <TabsTrigger value="buy">Buy Flow</TabsTrigger>
        <TabsTrigger value="sell">Sell Flow</TabsTrigger>
        <TabsTrigger value="lc">LC & Banking</TabsTrigger>
        {order.type === "Sell" && (
          <TabsTrigger value="testing" className="gap-1.5">
            <FlaskConical className="h-4 w-4" />
            Testing
          </TabsTrigger>
        )}
        <TabsTrigger value="logistics" className="gap-1.5">
          <Truck className="h-4 w-4" />
          Logistics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>{row.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Mineral:</span> {row.mineral} ({row.qty} {row.unit})</p>
            <p><span className="text-muted-foreground">Buyer → Seller:</span> {row.buyer} → {row.seller}</p>
            <p><span className="text-muted-foreground">Status:</span> {row.status}</p>
            <p><span className="text-muted-foreground">Value:</span> {row.value}</p>
            <p><span className="text-muted-foreground">LC#:</span> {row.lc}</p>
            <p><span className="text-muted-foreground">Testing:</span> {order.type === "Sell" ? `${row.testing} — use Testing tab for lab assignment` : "N/A (Buy orders)"}</p>
            <p><span className="text-muted-foreground">Logistics:</span> {row.logistics} — use <strong>Logistics</strong> tab for tracking details</p>
            {logistics?.shippingAmount && (
              <p><span className="text-muted-foreground">Logistics amount (saved):</span> <span className="font-medium text-emerald-600 dark:text-emerald-400">{logistics.shippingAmount} {logistics.shippingCurrency ?? "USD"}</span> — linked to this order & user ({row.buyer} / {row.seller})</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sendToUser" className="mt-4">
        <SendToUserCard
          order={order}
          dispatch={dispatch}
          showQRGenerator={true}
          transactionId={row.id}
          onOpenLogistics={() => setActiveTab("logistics")}
        />
      </TabsContent>

      <TabsContent value="payment" className="mt-4">
        <BankDetailsCard
          state={state}
          dispatch={dispatch}
          preselectedTransactionId={state.transactions.find((t) => t.orderId === row.id)?.id ?? null}
        />
      </TabsContent>

      <TabsContent value="buy" className="mt-4">
        {order.type === "Buy" ? (
          <BuyFlowPanel
            order={order}
            dispatch={dispatch}
            onNotifyBuyer={onNotifyBuyer}
            onPushNotification={onPushNotification}
          />
        ) : (
          <p className="text-muted-foreground">This is a Sell order. Use Sell Flow tab.</p>
        )}
      </TabsContent>

      <TabsContent value="sell" className="mt-4">
        {order.type === "Sell" ? (
          <SellFlowDetail
            order={order}
            state={state}
            dispatch={dispatch}
            onAssignTesting={assignTesting}
            onIssueLC={issueLC}
          />
        ) : (
          <p className="text-muted-foreground">This is a Buy order. Use Buy Flow tab.</p>
        )}
      </TabsContent>

      <TabsContent value="lc" className="mt-4">
        <LCManager
          order={order}
          banks={["SBI India", "HSBC Switzerland", "Standard Chartered Ghana"]}
          onIssueLC={issueLC}
        />
      </TabsContent>

      {order.type === "Sell" && (
        <TabsContent value="testing" className="mt-4">
          <TestingPanel
            order={order}
            labs={[
              { value: "sgs-mumbai", label: "SGS Mumbai" },
              { value: "sgs-chennai", label: "SGS Chennai" },
              { value: "bureau-veritas", label: "Bureau Veritas" },
            ]}
            onAssign={assignTesting}
          />
        </TabsContent>
      )}

      <TabsContent value="logistics" className="mt-4">
        {logistics ? (
          <LogisticsTracker shipment={logistics} />
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No logistics details for this order yet. Add tracking from Orders or Logistics.
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
