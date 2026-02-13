import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { BuyFlowPanel } from "./BuyFlowPanel";
import { SellFlowPanel } from "./SellFlowPanel";
import { LCManager } from "./LCManager";
import { TestingPanel } from "./TestingPanel";
import { LogisticsTracker } from "./LogisticsTracker";
import { getLogisticsDetailsForOrder } from "../../../store/dashboardStore";
import type { Order, DashboardState, DashboardAction } from "../../../store/dashboardStore";
import type { TransactionRow } from "./TransactionsTable";

export function TransactionDetailTabs({
  row,
  state,
  dispatch,
  onNotifyBuyer,
  onPushNotification,
}: {
  row: TransactionRow;
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  onNotifyBuyer?: () => void;
  onPushNotification?: () => void;
}) {
  const order = row.order;
  const logistics = getLogisticsDetailsForOrder(state, order.id);

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
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="buy">Buy Flow</TabsTrigger>
        <TabsTrigger value="sell">Sell Flow</TabsTrigger>
        <TabsTrigger value="lc">LC & Banking</TabsTrigger>
        <TabsTrigger value="testing">Testing</TabsTrigger>
        <TabsTrigger value="logistics">Logistics</TabsTrigger>
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
            <p><span className="text-muted-foreground">Testing:</span> {row.testing}</p>
            <p><span className="text-muted-foreground">Logistics:</span> {row.logistics}</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="buy" className="mt-4">
        {order.type === "Buy" ? (
          <BuyFlowPanel
            order={order}
            onNotifyBuyer={onNotifyBuyer}
            onPushNotification={onPushNotification}
          />
        ) : (
          <p className="text-muted-foreground">This is a Sell order. Use Sell Flow tab.</p>
        )}
      </TabsContent>

      <TabsContent value="sell" className="mt-4">
        {order.type === "Sell" ? (
          <SellFlowPanel order={order} onAssignTesting={assignTesting} onIssueLC={issueLC} />
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
