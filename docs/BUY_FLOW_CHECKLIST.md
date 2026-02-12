# Buy Flow Checklist – App to Dashboard

This checklist ensures the **app buy flow** is fully connected to the **dashboard** and that all navigation is routed via the dashboard. Use it to verify from start to end.

---

## 1. App Buy Flow (Start → End)

| # | Step | Screen | Connected to dashboard? | Notes |
|---|------|--------|--------------------------|--------|
| 1 | **Start** | Mineral Market (product listing) | ✅ | Catalog comes from dashboard-managed `state.minerals`; app can show same catalog. |
| 2 | View product | Product Detail (e.g. Gold) | ✅ | Single product from catalog; selection leads to order. |
| 3 | Configure order | Quantity & Delivery Date | ✅ | Data is part of order payload sent when order is placed. |
| 4 | Checkout | Shipping, Contact, Payment | ✅ | Ship-to, contact, payment method become order/user details visible in dashboard. |
| 5 | Review | Order review / confirm | ✅ | Same order data; final submit creates order (e.g. in `state.buyOrders`). |
| 6 | **End** | Order Received (Order #, delivery, address, payment, Track / Back to Dashboard) | ✅ | Order ID (e.g. MB12345) appears in dashboard Buyer management; "Back to Dashboard" / "Track Order" route user to dashboard or app tracking (dashboard provides logistics/tracking). |

**Conclusion:** The full app buy flow (Mineral Market → … → Order Received) is designed to feed into the dashboard: order creation and all key details (order ID, delivery date, shipping address, payment method, total) are the same data shown in dashboard buy management.

---

## 2. Dashboard Routing – Everything via Dashboard

All authenticated views are rendered **inside** `DashboardLayout`. There are no routes that bypass the dashboard.

| View / Route | How to reach | Sidebar / entry |
|--------------|--------------|------------------|
| Dashboard home | Default after login | **Dashboard** (first item) |
| Buyer management | Dashboard → Quick access "Buyer Management" or sidebar **Buyer management** | `view: "minerals"` |
| Buy order detail | From Dashboard (Recent Activity – buy order) or from Buyer management (Users' buy list → View) | Shown when `currentView === "buy-order-detail"`; sidebar highlights **Buyer management** |
| Back from buy order detail | "Back" on OrderDetailPage | Returns to `view: "minerals"` (Buyer management) |

**Files to check:**
- `App.tsx`: `renderCurrentView()` returns all views; root is `<DashboardLayout>{renderCurrentView()}</DashboardLayout>`.
- `DashboardLayout.tsx`: Sidebar has "Buyer management" → `onViewChange("minerals")`; when on `buy-order-detail`, Buyer management stays highlighted (lines 110–112, 124–129).
- `Dashboard.tsx`: Quick access includes "Buyer Management" → `onViewChange("minerals")`; Recent Activity buy orders call `onOpenOrder(orderId, "buy")` → switches to buy-order-detail.

**Conclusion:** All buy-related navigation is routed via the dashboard (no standalone buy flow outside the layout).

---

## 3. Dashboard Buy Management – Details Connected

Buy management in the dashboard is **Buyer management** (view `minerals` = `MineralManagement.tsx`) plus **Buy order detail** (`OrderDetailPage.tsx` with `type="buy"`).

### 3.1 Single source of truth

- **Store:** `state.buyOrders` in `dashboardStore.tsx`.
- **Used by:** MineralManagement (tab "Users' buy list"), OrderDetailPage (type `buy`), OrderTransactionManagement, Dashboard (Recent Activity), UserManagement (buy orders), DisputesResolution, LogisticsManagement, etc.

### 3.2 Buyer management screen (MineralManagement)

| Detail | Connected? | Where |
|--------|------------|--------|
| List of buy orders | ✅ | `state.buyOrders` → "Users' buy list" tab |
| Order ID | ✅ | Table column; row click → `onOpenOrderDetail(order.id)` |
| Mineral name | ✅ | `order.mineral` |
| User (buyer) | ✅ | `getRegistryUserName(state.registryUsers, order.userId)` |
| Status | ✅ | `order.status` |
| Search by ID, mineral, user | ✅ | `filteredBuyOrders` in MineralManagement |
| Open order detail | ✅ | `onOpenOrderDetail?.(order.id)` → App sets `buy-order-detail` + `orderId` |

### 3.3 Buy order detail page (OrderDetailPage, type="buy")

| Detail | Connected? | Where |
|--------|------------|--------|
| Order ID | ✅ | `order.id` |
| Type (Buy) | ✅ | `type === "buy"` |
| Mineral, description, qty, unit | ✅ | `order.mineral`, `order.description`, `order.qty`, `order.unit` |
| Facility (name, address, country, contact) | ✅ | `order.facility` |
| AI estimated amount, currency | ✅ | `order.aiEstimatedAmount`, `order.currency` |
| Status | ✅ | `order.status` |
| Created at | ✅ | `order.createdAt` |
| Buyer (user) | ✅ | `getRegistryUserName(state.registryUsers, order.userId)`; link to User Management |
| Flow steps (buy pipeline) | ✅ | OrderDetailPage uses `BUY_FLOW_STEP_LABELS` (no "Sample Test Required"); `order.flowSteps` / derived from status |
| Flow step data (price confirmed, payment initiated, etc.) | ✅ | `order.flowStepData` |
| Documents (buy: track received) | ✅ | `order.testingReqs` (buy: "Mark as received") |
| Communication log | ✅ | `order.commLog` |
| Sent to user (transport link, QR/bank, etc.) | ✅ | `order.sentToUser` |
| Related transaction | ✅ | `state.transactions` by `orderId` |
| Disputes, Enquiries, Logistics | ✅ | Links to Disputes, Enquiries, Logistics with `orderId` / `userId` |
| Update status / Cancel | ✅ | `UPDATE_ORDER` in store; syncs everywhere |

### 3.4 Dashboard home (Dashboard.tsx)

| Detail | Connected? | Where |
|--------|------------|--------|
| Recent buy orders | ✅ | `recentOrders` from store (includes buy); `onOpenOrder(orderId, "buy")` → buy-order-detail |
| Quick access to Buyer management | ✅ | "Buyer Management" → `onViewChange("minerals")` |
| Pending orders count | ✅ | `useDashboardStats()` includes buy orders |

**Conclusion:** All dashboard buy management details (list, order detail, status, user, facility, flow steps, documents, comm log, sent to user, related transaction/disputes/logistics) are read from or written to the same store and stay in sync.

---

## 4. Quick Verification Checklist

Use this to confirm in the app and dashboard:

- [ ] **App:** User can start from Mineral Market (or equivalent) and complete buy flow through Order Received.
- [ ] **App:** Order Received shows Order # and option to go "Back to Dashboard" or "Track Order".
- [ ] **Dashboard:** After an order is created (from app or seed data), it appears under **Buyer management** → "Users' buy list".
- [ ] **Dashboard:** Clicking a buy order opens **Buy order detail** with correct ID, user, mineral, amount, status, flow steps.
- [ ] **Dashboard:** From **Dashboard** home, Recent Activity buy order click opens the same **Buy order detail**.
- [ ] **Dashboard:** Sidebar always shows **Buyer management** when on buy order detail; back returns to Buyer management.
- [ ] **Dashboard:** Order detail links (User, Orders, Enquiries, Disputes, Logistics) navigate to the correct views with the right IDs.
- [ ] **Dashboard:** Updating status or cancelling a buy order in Order detail updates the order everywhere (list, Orders & Settlements, etc.).

---

## 5. File Reference

| Purpose | File |
|--------|------|
| App routing & layout | `src/App.tsx` |
| Dashboard layout & sidebar | `src/components/dashboard/DashboardLayout.tsx` |
| Dashboard home | `src/components/dashboard/Dashboard.tsx` |
| Buyer management (minerals + buy orders list) | `src/components/admin/MineralManagement.tsx` |
| Buy order detail | `src/components/admin/OrderDetailPage.tsx` (type="buy") |
| Buy orders state | `src/store/dashboardStore.tsx` (`buyOrders`, `UPDATE_ORDER`) |
| Orders & settlements (all orders) | `src/components/admin/OrderTransactionManagement.tsx` |

All buy flow and buy management features above are linked to the dashboard and routed through it; details are connected via the shared dashboard store.
