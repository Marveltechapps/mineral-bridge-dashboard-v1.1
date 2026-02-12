# Dashboard & App Flows – Requirements Checklist

This doc ensures all flows meet the requirement: **dashboard and app share one source of truth (store); changes in one place reflect everywhere.**

**See also:** [BUY_FLOW_CHECKLIST.md](./BUY_FLOW_CHECKLIST.md) for the app buy flow (Mineral Market → Order Received) and how it connects to dashboard and Buyer management.

---

## 1. User & Registry

| Requirement | Status | Where |
|-------------|--------|--------|
| Registry users in store | Done | `state.registryUsers` |
| Manual Registration adds user to registry | Done | UserManagement → `ADD_REGISTRY_USER` |
| Pre-homepage verification (details verified) | Done | `VERIFY_USER_DETAILS`, `detailsVerifiedAt` on user |
| User detail shows Activity from app | Done | `state.appActivities` filtered by `userId` |
| Suspend / restrict user | Done | `UPDATE_USER_STATUS` |

---

## 2. Access Request (App → Dashboard)

| Requirement | Status | Where |
|-------------|--------|--------|
| App submits access request | Done | RequestAccessFlow → `ADD_ACCESS_REQUEST` |
| Dashboard shows pending access requests | Done | UserManagement, Dashboard cards |
| Approve / reject request | Done | `UPDATE_ACCESS_REQUEST` |

---

## 3. Buy / Minerals

| Requirement | Status | Where |
|-------------|--------|--------|
| Mineral catalog in store | Done | `state.minerals` |
| Add mineral in dashboard → reflects in app | Done | MineralManagement → `ADD_MINERAL` |
| Edit / delete mineral | Done | `UPDATE_MINERAL`, `REMOVE_MINERAL` |
| Dashboard home “Verified Minerals” from store | Done | `state.minerals.filter(Verified).length` |
| Buy orders from store | Done | `state.buyOrders` (OrderTransactionManagement, UserManagement, etc.) |

---

## 4. Sell Flow

| Requirement | Status | Where |
|-------------|--------|--------|
| Sell submissions in store | Done | `state.mineralSubmissions` |
| **App creates sell submission** | Done | ArtisanalMinerDashboard "Sell Now" → `ADD_MINERAL_SUBMISSION` |
| Sell Mineral Management uses store | Done | Submissions list + `UPDATE_MINERAL_SUBMISSION` |
| Dashboard home “Sell Submissions” from store | Done | `state.mineralSubmissions.length`, in-review count |
| Sell orders from store | Done | `state.sellOrders` |

---

## 5. Orders & Transactions

| Requirement | Status | Where |
|-------------|--------|--------|
| Buy/sell orders in store | Done | `state.buyOrders`, `state.sellOrders` |
| Transactions in store | Done | `state.transactions` |
| Order/Transaction management reads store | Done | OrderTransactionManagement, FinancialReporting, UserManagement, Analytics |
| **Update order status** | Done | OrderTransactionManagement "Update Status" → `UPDATE_ORDER` |
| **Cancel order** | Done | OrderTransactionManagement "Cancel Order" → `UPDATE_ORDER` |
| Dashboard stats (pending orders, revenue) from store | Done | `useDashboardStats()` |

---

## 6. Disputes

| Requirement | Status | Where |
|-------------|--------|--------|
| Disputes in store | Done | `state.disputes` |
| **Create dispute** | Done | DisputesResolution "Create Dispute" → `ADD_DISPUTE` |
| Disputes list from store | Done | DisputesResolution |
| Resolve dispute (single) updates store | Done | “Confirm & Close Case” → `UPDATE_DISPUTE` |
| Bulk resolve updates store | Done | “Resolve” bulk → `UPDATE_DISPUTE` per selected |

---

## 7. Enquiries & Support

| Requirement | Status | Where |
|-------------|--------|--------|
| Enquiries in store | Done | `state.enquiries` |
| **App creates enquiry** | Done | ArtisanalMinerDashboard "Contact Support" → `ADD_ENQUIRY` |
| Enquiry management reads store | Done | EnquiryManagement |

---

## 8. App Activity (App → Dashboard)

| Requirement | Status | Where |
|-------------|--------|--------|
| App activity in store | Done | `state.appActivities` |
| Dashboard “Recent activity from app” from store | Done | Dashboard home |
| User detail “Activity from app” from store | Done | UserManagement Overview tab |
| App dispatches activity (e.g. profile, KYC, orders) | Done | ArtisanalMinerDashboard → `ADD_APP_ACTIVITY` |

---

## 9. Facilities & Other

| Requirement | Status | Where |
|-------------|--------|--------|
| Facilities in store | Done | `state.facilities` |
| Add facility | Done | UserManagement → `ADD_FACILITY` |
| **Remove facility** | Done | UserManagement Facility Details "Remove" → `REMOVE_FACILITY` |
| User detail facilities from store | Done | UserManagement facilities tab |

---

## 10. Per-User Details (Security, Notes)

| Requirement | Status | Where |
|-------------|--------|--------|
| User login activity, devices, security notes, activity log in store | Done | `state.userDetails` keyed by userId |
| UserManagement Security tab from store | Done | `userDetails.loginActivity` |
| UserManagement Communication & Notes tab from store | Done | `userDetails.activityLog` |

---

## 11. Enquiry Reply & Status

| Requirement | Status | Where |
|-------------|--------|--------|
| Close Ticket updates enquiry status | Done | EnquiryManagement → `UPDATE_ENQUIRY` status "Resolved" |
| Send Reply adds reply, updates status | Done | EnquiryManagement → `UPDATE_ENQUIRY` with replies array |
| Enquiry detail view from selected enquiry | Done | Reads `selectedEnquiry` from store |

---

## Design Consistency

- **Cards:** `border-none shadow-sm` for list/detail cards
- **Status badges:** Shared `StatusBadge` component (emerald=success, amber=pending, red=error, blue=info)
- **Dialogs/Sheets:** Max width 800px where applicable

---

## Store location

- **State & reducer:** `src/store/dashboardStore.tsx`
- **Initial data:** `src/data/initialMinerals.ts`, `src/data/initialSellSubmissions.ts`
- **Shared types:** `src/components/admin/minerals/types.ts`, `src/types/sellSubmissions.ts`

All flows above read from and (where applicable) write to this single store so the dashboard and app stay in sync.
