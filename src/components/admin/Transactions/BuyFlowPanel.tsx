import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { TimelineStepper } from "../../ui/TimelineStepper";
import { SendToUserCard } from "./SendToUserCard";
import type { Order } from "../../../store/dashboardStore";
import type { DashboardAction } from "../../../store/dashboardStore";

export function BuyFlowPanel({
  order,
  dispatch,
  onNotifyBuyer,
  onPushNotification,
}: {
  order: Order;
  dispatch?: React.Dispatch<DashboardAction>;
  onNotifyBuyer?: () => void;
  onPushNotification?: () => void;
}) {
  const steps = (order.flowSteps ?? []).map((s, i) => ({
    label: s.label,
    count: i + 1,
    status: s.completed ? ("completed" as const) : s.active ? ("current" as const) : ("pending" as const),
  }));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#A855F7]/30 bg-purple-50/30 dark:bg-purple-950/20">
        <CardContent className="pt-4">
          <p className="text-sm font-medium text-[#A855F7]">
            QR code or link you send from here is delivered to the buyer in the app.
          </p>
        </CardContent>
      </Card>

      {/* Step 1: Send QR or link to buyer */}
      <div>
        <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#A855F7] text-white text-sm">1</span>
          Send QR or link to buyer
        </h3>
        {dispatch ? (
          <SendToUserCard order={order} dispatch={dispatch} showQRGenerator={true} />
        ) : (
          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="py-6 text-center text-muted-foreground">
              Use the &quot;Send QR / link&quot; tab to generate QR and record what you sent to the buyer (shown in app).
            </CardContent>
          </Card>
        )}
      </div>

      {/* Step 2: Contact buyer */}
      <div>
        <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">2</span>
          Contact buyer
        </h3>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="py-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onNotifyBuyer}>
              📧 Email buyer
            </Button>
            <Button variant="outline" size="sm" onClick={onPushNotification}>
              🔔 App push
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Step 3: Reserve escrow (payment) */}
      <div>
        <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm">3</span>
          Reserve escrow / payment
        </h3>
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              Record payment initiation in Payment & bank tab or in Order detail. Escrow reserve is done in the 6-step flow on Orders & Settlements.
            </p>
          </CardContent>
        </Card>
      </div>

      <TimelineStepper steps={steps} />
    </div>
  );
}
