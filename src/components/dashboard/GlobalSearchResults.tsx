import { useMemo } from "react";
import { useDashboardStore } from "../../store/dashboardStore";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Gem, Users, ShoppingCart } from "lucide-react";

const match = (text: string, q: string) =>
  text?.toLowerCase().includes(q.toLowerCase()) ?? false;

export interface GlobalSearchResultsProps {
  query: string;
  onViewChange: (view: string) => void;
  onOpenOrder: (orderId: string, type: "buy" | "sell") => void;
  onOpenMineralDetail: (mineralId: string) => void;
  onOpenUser: (userId: string) => void;
}

export function GlobalSearchResults({
  query,
  onViewChange,
  onOpenOrder,
  onOpenMineralDetail,
  onOpenUser,
}: GlobalSearchResultsProps) {
  const { state } = useDashboardStore();
  const q = query.trim();

  const { minerals, users, buyOrders, sellOrders } = useMemo(() => {
    if (!q) {
      return { minerals: [], users: [], buyOrders: [], sellOrders: [] };
    }
    const minerals = state.minerals.filter(
      (m) =>
        match(m.name, q) ||
        match(m.category ?? "", q) ||
        match(m.id, q) ||
        match(m.description, q) ||
        (m.mineralTypes?.some((t) => match(t, q)) ?? false)
    );
    const users = state.registryUsers.filter(
      (u) =>
        match(u.name, q) ||
        match(u.email, q) ||
        match(u.id, q) ||
        match(u.role, q) ||
        match(u.country, q)
    );
    const buyOrders = state.buyOrders.filter(
      (o) =>
        match(o.id, q) ||
        match(o.mineral, q) ||
        match(o.description, q) ||
        match(o.status, q)
    );
    const sellOrders = state.sellOrders.filter(
      (o) =>
        match(o.id, q) ||
        match(o.mineral, q) ||
        match(o.description, q) ||
        match(o.status, q)
    );
    return { minerals, users, buyOrders, sellOrders };
  }, [q, state.minerals, state.registryUsers, state.buyOrders, state.sellOrders]);

  const total =
    minerals.length + users.length + buyOrders.length + sellOrders.length;

  if (!q) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Enter a search term in the header to find orders, users, and minerals.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Search results for &ldquo;{q}&rdquo;
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total} result{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {minerals.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Minerals</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {minerals.slice(0, 8).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpenMineralDetail(m.id)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {m.name}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  {m.category} · {m.id}
                </span>
              </button>
            ))}
            {minerals.length > 8 && (
              <button
                type="button"
                onClick={() => onViewChange("minerals")}
                className="text-sm text-emerald-600 hover:underline"
              >
                View all {minerals.length} minerals →
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {users.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Users</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.slice(0, 8).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => onOpenUser(u.id)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {u.name}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  {u.email} · {u.id}
                </span>
              </button>
            ))}
            {users.length > 8 && (
              <button
                type="button"
                onClick={() => onViewChange("users")}
                className="text-sm text-emerald-600 hover:underline"
              >
                View all {users.length} users →
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {(buyOrders.length > 0 || sellOrders.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Orders</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {buyOrders.slice(0, 5).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onOpenOrder(o.id, "buy")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {o.id}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  Buy · {o.mineral} · {o.status}
                </span>
              </button>
            ))}
            {sellOrders.slice(0, 5).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onOpenOrder(o.id, "sell")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span className="font-medium text-slate-900 dark:text-white">
                  {o.id}
                </span>
                <span className="text-muted-foreground text-sm ml-2">
                  Sell · {o.mineral} · {o.status}
                </span>
              </button>
            ))}
            {(buyOrders.length > 5 || sellOrders.length > 5) && (
              <button
                type="button"
                onClick={() => onViewChange("orders")}
                className="text-sm text-emerald-600 hover:underline"
              >
                View all orders →
              </button>
            )}
          </CardContent>
        </Card>
      )}

      {total === 0 && (
        <p className="text-muted-foreground">
          No orders, users, or minerals match &ldquo;{q}&rdquo;.
        </p>
      )}
    </div>
  );
}
