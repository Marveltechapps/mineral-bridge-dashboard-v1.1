import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { TimelineStepper } from "../../ui/TimelineStepper";
import { QRGenerator } from "../../ui/QRGenerator";
import type { Order } from "../../../store/dashboardStore";

export function BuyFlowPanel({
  order,
  onNotifyBuyer,
  onPushNotification,
}: {
  order: Order;
  onNotifyBuyer?: () => void;
  onPushNotification?: () => void;
}) {
  const steps = (order.flowSteps ?? []).map((s, i) => ({
    label: s.label,
    count: i + 1,
    status: s.completed ? ("completed" as const) : s.active ? ("current" as const) : ("pending" as const),
  }));

  const value = order.orderSummary?.total ?? order.aiEstimatedAmount ?? "—";

  return (
    <div className="space-y-6">
      <TimelineStepper steps={steps} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Send Buyer Notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QRGenerator
              data={{
                orderId: order.id,
                value,
                nextStep: "team-contact",
                teamPhone: order.contactInfo?.phone ?? "+91-44-12345678",
              }}
            />
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={onNotifyBuyer}>
                📧 Email
              </Button>
              <Button variant="outline" size="sm" onClick={onPushNotification}>
                🔔 App Push
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
