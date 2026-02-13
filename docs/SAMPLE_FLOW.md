# One Sample Flow – Admin Dashboard

This is **one end-to-end sample flow** you can follow to see how the dashboard works: from login to verifying a user and checking a settlement.

---

## Flow: Login → Verify pre-homepage details → See who/when verified → Check a transaction

**Time:** about 2–3 minutes.

---

### Step 1: Log in

1. Open the app and go to the **login** screen.
2. Log in (use your configured credentials).
3. You land on the **Dashboard** (home).

---

### Step 2: Open User Management and pick a user

1. In the **sidebar**, click **User Management**.
2. You see the **user list** (e.g. Samuel Osei, Kwesi Mensah, …).
3. **Click one user row** (e.g. **Kwesi Mensah** or **Samuel Osei**) to open their **user detail** view.
4. The **Overview** tab is selected by default.

---

### Step 3: Verify pre-homepage details (on this card)

1. On the **Overview** tab, find the **“Pre-homepage details”** card (Company, Requested role, Submitted, Reason/notes).
2. If the user is **not yet verified** you’ll see:
   - Badge: **“Verify here below”**
   - Text: **“Pending verification — verify these details below”**
   - Green button: **“Verify details”**
3. **Click “Verify details”**.
4. A toast confirms: *“Pre-homepage details verified”*. The card now shows **“Verified on [date]”** and the **“Verified”** badge.

*(If the user was already verified, the card shows “Verified on …” and there is no button.)*

---

### Step 4: See who verified and when (activity history)

1. Still on **Overview**, scroll to the **“Operational Activity History”** card.
2. You see a **timeline** of verification events, each with:
   - **What** (e.g. “KYC Verification Approved”, “AML Sanction Database Scan Passed”),
   - **When** (date and time),
   - **Who** (e.g. “Admin: S. Miller” or “Refinitiv API”, “System AI”),
   - **Source** (e.g. “Admin Dashboard”, “API”).
3. This comes from the **verification log**; when you (or another admin) approve KYC, a new row appears here with the actual **who** and **when**.

---

### Step 5: (Optional) Approve KYC and see it in the timeline

1. In the user detail, open the **“Identity & KYC”** tab.
2. Approve the required documents and complete the **Approve KYC** flow (justification + authorization check).
3. Click **“Approve KYC”**.
4. Go back to **Overview** and check **Operational Activity History** again: a new **“KYC Verification Approved”** entry appears with **Admin: S. Miller** (or the current verifying admin) and the current date/time.

---

### Step 6: Check a transaction (Orders & Settlements)

1. In the **sidebar**, click **Orders & Settlements**.
2. Open the **“Settlements”** tab.
3. You see the **transaction list** with:
   - Transaction ID, Order ID, **Counterparty**, Type, Scope, Mineral,
   - **Final amount**, **Fee**, **Net**, **Currency**, Method, Status,
   - **Date & time**, **Payout** (if linked), and **Actions**.
4. Use the **filters** (Scope, Status, Date range, Method) to narrow the list.
5. Click **“View order”** on a row to open the related order in a side panel.

---

### Step 7: (Optional) Financial & Reporting and reconciliation

1. In the **sidebar**, click **Financial & Reporting**.
2. Review the **Settlement Queue** table (same transaction fields + filters).
3. Scroll to the **“Reconciliation”** card to see **settlement batches (payouts)** with Payout ID, Date, Total, # Transactions, and Status (e.g. Reconciled / Pending match).

---

## Summary

| Step | Where | Action |
|------|--------|--------|
| 1 | Login | Log in → Dashboard |
| 2 | User Management | Open user list → click a user → Overview |
| 3 | Pre-homepage card (Overview) | Click **Verify details** to verify pre-homepage details |
| 4 | Operational Activity History (Overview) | See **who** verified and **when** for each event |
| 5 | Identity & KYC (optional) | Approve KYC → see new entry in activity history |
| 6 | Orders & Settlements → Settlements | View transactions, filters, link to order |
| 7 | Financial & Reporting (optional) | Settlement Queue + Reconciliation |

This is **one sample flow**; you can repeat it with different users or focus only on the steps you need (e.g. only Steps 1–4 for “verify a user”).
