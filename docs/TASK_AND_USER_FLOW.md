# Order detail – Task flow & user flow (Buyer / Seller management)

This document describes the **task flow** and **user flow** for the order detail page used in **Buyer management** and **Seller management** on the Mineral Bridge dashboard. Each tab is fully workable from start to end.

---

## How to reach order detail

1. **From Buyer management:** Sidebar → **Buyer management** → **Orders** tab → click **Details** on a buy order.
2. **From Seller management:** Sidebar → **Seller management** → **Orders** tab → click **Details** on a sell order.
3. **From Dashboard:** **Recent Activity** (order row) → opens the correct order detail (buy or sell) with breadcrumbs.

Breadcrumbs: e.g. **Seller management** → **S-ORD-8821**.

---

## Tab 1: Overview

**Purpose:** See order and user summary, mineral, quantity, facility, and perform quick actions.

**Task flow**

1. View Order ID, User (Registry), Status, Created date, Amount.
2. Click **View in User Management** (if user is linked) → navigate to User Management with that user selected.
3. View Mineral & quantity and Facility (name, address, country, contact).
4. Use **Quick actions:**
   - **Update status** → opens Update order status dialog; choose new status → **Save** → order status and flow steps update; toast shown.
   - **Cancel order** (if not already cancelled) → confirm in alert → order set to Cancelled; navigate back to list; toast shown.

**User flow (start to end)**

- Open order → Overview tab (default).
- Read order/user, mineral, facility.
- Need to change status → click **Update status** → select status → Save → see toast; switch to **Flow & Status** tab to see updated pipeline.
- Need to cancel → click **Cancel order** → confirm → back to list.

---

## Tab 2: Flow & Status

**Purpose:** See the order pipeline (steps) and set the current status from this tab.

**Task flow**

1. View flow steps: completed (green check), active (amber), pending (grey). Each step shows label.
2. **Update status** (header of card): opens same Update order status dialog; on Save, status and flow steps sync (previous steps completed, selected step active).
3. **Set as current** (on a step): opens Update status dialog with that step’s status pre-selected; Save updates order and flow.

**User flow (start to end)**

- Open **Flow & Status** tab.
- See pipeline; click **Set as current** on e.g. “Price Confirmed” → dialog opens with “Price Confirmed” selected → Save → pipeline updates (Order Submitted + Sample Test Required completed; Price Confirmed active).
- Or click **Update status** → choose status → Save → flow reflects new current step.

If no flow steps exist (empty state): message + **Update status** button to set status and build the pipeline.

---

## Tab 3: Communication

**Purpose:** Log events and admin actions (calls, emails, notes) for this order.

**Task flow**

1. View existing log entries: event, note, admin, date.
2. **Add log entry** (card header or empty state): dialog → enter **Event**, optional **Note**, **Admin** → **Add** → entry appended to list; toast “Log entry added”.
3. Empty state: icon + “No communication log entries yet” + **Add log entry** button.

**User flow (start to end)**

- Open **Communication** tab.
- If empty → click **Add log entry** → e.g. Event “Customer contacted”, Note “Confirmed sample date”, Admin “Admin” → Add → new row appears; toast.
- Add more entries as needed; list grows with consistent card design.

---

## Tab 4: Testing & Docs / Documents from seller

**Purpose:** **Seller (sell orders):** Seller uploads required tests/docs; admin marks as uploaded when received. **Buyer (buy orders):** Documents are provided by the seller (uploaded on seller side); buyer does not upload — admin tracks when received/verified for this order.

**Task flow**

**Seller:** View requirements (Pending/Uploaded). **Add requirement** → **Mark as uploaded** when seller submits. **Buyer:** View document types (Pending/Received). **Add document type** → **Mark as received** when you have it from seller (no buyer upload).
2. **Add requirement** (card header or empty state): dialog → enter **Requirement name** (e.g. “Assay Certificate”) → **Add** → new row appears with status Pending; toast. Then use **Mark as uploaded** when doc is received.
3. Empty state: icon + “No testing requirements yet” + **Add requirement** button.

**User flow (start to end)**

- Open **Testing & Docs** tab.
- If empty → **Add requirement** → e.g. “Export Compliance” → Add → row appears (Pending).
- When doc received → **Mark as uploaded** on that row → status changes to Uploaded; toast.
- Add more requirements as needed; all actions persist and reflect in the list.

---

## Tab 5: Sent to User

**Purpose:** Record what was sent to the user (transport link, bank/QR, sample pickup, LC/credit, etc.).

**Task flow**

1. View list: type (badge), label, date, channel, optional detail.
2. **Record sent** (card header or empty state): dialog → **Type** (transport_link, qr_or_bank, sample_pickup_link, lc_credit), **Label**, **Channel** (App/Email/SMS), optional **Detail** → **Record** → new row appended; toast.
3. Empty state: icon + “Nothing sent to user yet” + **Record sent** button.

**User flow (start to end)**

- Open **Sent to User** tab.
- If empty → **Record sent** → e.g. Type “Transport link”, Label “Tracking link”, Channel “App” → Record → row appears.
- Add more as you send links/details; list is always up to date.

---

## Tab 6: Related Transaction

**Purpose:** See settlement/payment linked to this order and jump to Orders & Settlements.

**Task flow**

1. **If a transaction is linked:** View Transaction ID, Status, Final amount, Method, Date & time, Settlement note, Payment details. **View in Orders & Settlements** → navigate to Orders & Settlements (Settlements tab if tx id passed).
2. **If no transaction linked:** Empty state with icon + “No settlement linked” + **Open Orders & Settlements** → navigate to Orders & Settlements to create or link a settlement.

**User flow (start to end)**

- Open **Related Transaction** tab.
- If linked → review details → click **View in Orders & Settlements** to open that transaction in context.
- If not linked → click **Open Orders & Settlements** → create/link settlement there; when linked, it appears here on next open.

---

## Tab 7: Linked across dashboard

**Purpose:** One place to jump to User, Transaction, Disputes, Enquiries, and Logistics for this order/user.

**Task flow**

1. **User:** Row shows user name and ID (or “Not linked”). **View in User Management** → navigate with user selected.
2. **Transaction:** Row shows tx id + amount + status (or “No settlement linked”). Button: **View in Orders & Settlements** or **Open Orders & Settlements**.
3. **Disputes:** Row shows count and ids (or “No disputes for this order”). **View in Disputes** / **Open Disputes** → Disputes & Resolution with this order in context.
4. **Enquiries:** Row shows count and subject preview (or “No enquiries from this user”). **View in Enquiry & Support** / **Open Enquiry & Support** → Enquiry with this user in context.
5. **Logistics:** Row shows carrier + tracking (or “No logistics record”). **View in Logistics** / **Open Logistics** → Logistics with this order (e.g. 3rd Party Details tab).

**User flow (start to end)**

- Open **Linked across dashboard** tab.
- Every section is a row with same card style; each has one primary action.
- Need to check user → **View in User Management**.
- Need to check payment → **View in Orders & Settlements** (or Open if none).
- Need to handle dispute → **View in Disputes** (or Open).
- Need to reply to ticket → **View in Enquiry & Support** (or Open).
- Need to add tracking → **View in Logistics** (or Open Logistics).

---

## Design consistency

- **Cards:** All tabs use `Card` with `CardHeader` (CardTitle + CardDescription), `CardContent`; border-none, shadow-sm.
- **Empty states:** Dashed border, subtle background, icon, short message, one primary button (same action as card header).
- **Primary actions:** Emerald primary buttons (Save, Add, Record); outline for secondary (Cancel, View in X).
- **Lists:** Rows with border-b, py-3; labels and values use text-sm / text-xs and muted-foreground where appropriate.

---

## End-to-end user journey example

1. Admin opens **Seller management** → **Orders** → clicks **Details** on S-ORD-8821.
2. **Overview:** Sees order and user; clicks **Update status** → sets “Price Confirmed” → Save.
3. **Flow & Status:** Sees “Price Confirmed” as active; later sets “Payment Initiated” via **Set as current**.
4. **Communication:** Adds “Customer confirmed payment method” with note.
5. **Testing & Docs:** Adds “Export Compliance” → when doc received, **Mark as uploaded**.
6. **Sent to User:** Records “Bank details / QR” sent via App.
7. **Related Transaction:** Sees TX-9912-MB linked; clicks **View in Orders & Settlements**.
8. **Linked across dashboard:** Clicks **View in Logistics** to add tracking.

All actions are workable; no static-only UI. Data persists via dashboard store and reflects across the app.
