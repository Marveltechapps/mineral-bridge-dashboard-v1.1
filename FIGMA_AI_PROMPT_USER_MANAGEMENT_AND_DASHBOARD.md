# Figma Make AI – Mineral Bridge Dashboard Prompt (User Management First, Full Flow)

Use this prompt in **Figma Make** (https://www.figma.com/make/) to generate the Mineral Bridge admin dashboard. Start with **User Management**; ensure every screen is **interconnected** and reflects **app-side data** (no static placeholders). Design for **end-to-end process**, not static images.

---

## Context: Mineral Bridge App (Buy & Sell)

- **App flow:** Sign in via OTP → Enter profile (pic, name, email) → KYC verification (ID type: National Identity Card / Government Issued, Global Passport, or Corporate ID / Mining Trade License) → Upload documents (front + optional back) → Live verification (backend) → Homepage (Buy or Sell).
- **Buy flow (app):** Select mineral → Mineral description → Quantity → Logistics & address (Institutional Armored Transport / Direct Delivery, Secure Vault; delivery location, permit, regulatory compliance, file upload) → AI estimated amount → Success (“Our team will contact you shortly”).
- **Sell flow (app):** Select mineral → Description → Quantity → Test & address (Sample test, Vault drop-off, pickup location, regulatory compliance, Assay Certificate / Origin Declaration / Export Compliance / 3+ Mineral Photos) → AI estimated amount → Success (“Our team will contact you shortly”).
- **Post-flow:** Team contacts via call/email; if user accepts → payment via QR code or bank details sent through app (buy); for sell → sample testing, quality/quantity check, LC credited via app or email.
- **Profile (app):** Personal Information (pic, name locked to KYC, phone verified, email), Saved Addresses (facilities), Payment Methods, Order History, Transaction History, Security & Privacy, App Settings, Help & Support, Log Out.
- **Artisanal flow:** Enabled **only for African users**; in dashboard they must have **separate user management** (Artisanal Users).

**Dashboard principle:** Every change in the dashboard that affects a user (KYC, orders, transactions, addresses, payments) must be **reflected in the app** for that user. All sections must be **interconnected** (e.g. Buy Management shows the same user as User Management; Orders/Transactions/Support link to the same user and data).

---

## Part 1: User Management (Design This First)

Design the **User Management** section of the admin dashboard with the following structure. Each part should feel like a **connected flow**, not isolated screens.

### 1.1 User Management – List / Registry

- **Header:** “User Management” with short description (e.g. “Operational index of mineral participants; app and dashboard stay in sync”).
- **Filters:** Search (name, email, phone, user ID, license), Role (Buyer / Seller / Artisanal / Admin), KYC Status (Verified / Pending / Rejected), Account Status (Active / Inactive / Suspended), and **Artisanal (African only)** toggle or tab to show only artisanal users.
- **Table columns:** User/Identity (avatar, name, user ID), Contact (email, phone), Role (Buyer / Seller / Artisanal Collector / Admin), Origin/Country (with flag), KYC Status (Verified / Pending / Rejected / Limited), Risk (Low / Medium / High), Lifetime Volume (LTV), Last Active, Actions (View details, Verify KYC, Restrict, Suspend).
- **Row click:** Opens **User Detail** for that user (same data as in app profile).
- **Actions:** “Manual Registration” (add user), “Export Users”.
- **Pagination:** Display range and prev/next.
- **Visual:** Clear separation or tab for **“Artisanal Users”** (African-only); same columns but filtered by artisanal role/region.

### 1.2 User Detail – Master Identity Header

- **Sticky header:** Avatar, full name, user ID badge, status (Active / Suspended). Country/flag, role badge, “Verified OTP” with phone. Trust score progress bar. Buttons: “Back to Registry”, “Contact User”, “Restrict Account”, “Suspend User”.
- **Tabs:** Overview | Identity & KYC | Facilities & Addresses | Orders | Financial History | Security & Access | Communication & Notes.

### 1.3 User Detail – Personal Information (Mirrors App)

- **Display (read-only from app):** Profile picture, Full name with note “Name is locked to KYC verification”, Email, Phone with “Verified” badge.
- **Dashboard-only:** Internal risk level, LTV, last login, “Edit” only for non-KYC-locked fields if allowed by product rules.

### 1.4 User Detail – Identity & KYC (Dashboard Verification)

- **KYC status:** Approved / Pending / Rejected / Under Review. If **approved** → show “Approved on [date] by [admin]”. If **pending** or needs more docs → show “Upload remaining documents” and link to document list.
- **Verification document type (from app):** One of: National Identity Card (Government Issued), Global Passport (Preferred for Export), Corporate ID / Mining Trade License. Show which type user selected.
- **Documents list:** Each document with front (and back if uploaded), thumbnail, status (Verified / Pending / Rejected), upload date. Dashboard actions: **Approve**, **Reject**, **Request document**.
- **Live verification (liveness):** Show “Verify in backend process” state; result (Passed / Failed / Pending). Dashboard option to **override** or **re-verify** with reason.
- **Actions:** “Approve KYC”, “Request Document”, “Reject KYC” (with mandatory reason). Optional: checklist “All required documents approved”, “Biometric/liveness verified or overridden”, “Authorization” checkbox.
- **Interconnection:** When KYC is approved/rejected in dashboard, app profile must reflect it (show in design as “Synced to app”).

### 1.5 User Detail – Facilities & Addresses (Same as App)

- **List:** “Institutional Addresses – Registered Facilities” with total count. Each card: Primary badge (if primary), Facility name, full address (street, city, state/region, zip, country), phone, email, permit/license number. Actions: **Edit**, **Delete**.
- **Add/Edit facility:** Form: Institutional entity name, Street name and number, City, State/Region, Zip, Country, Phone, Email, Permit/License number. “Register Facility” / “Save”.
- **Data parity:** Addresses shown here must match **exactly** what the user sees in the app (Saved Addresses). Any edit in dashboard should sync to app.

### 1.6 User Detail – Payment Methods (Same as App)

- **List:** “Payment Methods – Linked Accounts”. Each: Bank/Crypto label (e.g. “Commercial Bank of Ethiopia”), masked number (e.g. •••• 4829), “Primary Payout” or default, “Verified”, “Last used: [date]”. Actions: **Remove**.
- **Add method (from app flow):** “Add Payment Method” – Bank Account or Crypto Wallet; fields: Account name, Bank name, Account number, SWIFT/routing; “Link Bank Account”. Note: “Security Verification – 2FA required for withdrawals.”
- **Blockchain:** “Blockchain Settlement – Payments settlement-linked to blockchain; fiat accounts for on/off-ramp only.”
- **Interconnection:** Payment methods in dashboard = same as app; used for sending bank details or settlement after deal acceptance.

### 1.7 User Detail – Orders (Link to Order Management)

- **List:** Order ID (e.g. MB-88219), Type (Buy/Sell), Mineral, Quantity, Date, Status (e.g. Awaiting Team Contact, Delivered). “View Details” opens **Order detail** (same as in Order Management).
- **Order detail (inline or linked):** Same as app order detail: flow steps (Order Submitted → Awaiting Team Contact → Price Confirmed → Logistics Scheduled → Delivery Complete for buy; similar for sell with Sample Test), “Priority Action” (e.g. Price Confirmation Call), Transaction summary, “Download Proforma Invoice”, “Modify Profile”, “Cancel Trade”.
- **Interconnection:** Same order appears in **User Management → Orders** and in **Buy/Sell Management**; clicking user from an order should open this User Detail.

### 1.8 User Detail – Transaction History (Link to Transactions)

- **List:** TX id, Type (BUY/SELL), Mineral, Date, Status (Completed / Pending), Amount (e.g. 102.5 ETH). “Receipt” / “View Details”.
- **Transaction detail:** Same as app: Transaction ID, Payment method, Subtotal, Service fee, Network fee, Total amount. “Institutional Breakdown” if applicable.
- **Interconnection:** Transactions in dashboard = same as in app; used for settlement and reporting.

### 1.9 User Detail – Security & Access

- **Two-Factor Auth:** Status (on/off).
- **Active sessions:** Device (e.g. iPhone 13 Pro), location, last active. Option to revoke.
- **Blockchain data visibility:** Public (transaction hashes, timestamps, mineral provenance) vs Private (identity, bank details, chats – encrypted, off-chain).

### 1.10 User Detail – Communication & Notes

- **Internal admin notes:** Timeline of notes (admin name, date, text). “Add note” for compliance or support context.
- **Support tickets:** Link to Enquiry & Support for this user (same tickets as in app Help & Support).

### 1.11 Artisanal Users (Separate Section in User Management)

- **Entry:** Tab or filter “Artisanal Users” in User Management list; only users with role “Artisanal” and **African origin/country**.
- **Same detail structure** as above (Identity & KYC, Addresses, Orders, Transactions, etc.) but with:
  - Badge or label “Artisanal – African participant”.
  - Optional: specific KYC or compliance notes for artisanal flow (e.g. local permits, cooperative ID).
- **Interconnection:** Artisanal sell orders, sample testing, and LC/payouts appear in Orders and Transactions; dashboard changes (e.g. KYC approve) sync to app.

---

## Part 2: Interconnection With Other Dashboard Sections

Design these connections so the dashboard feels like **one system**, not separate screens.

- **Buy Management:** Each buy request shows **user** (name, ID). Clicking user opens **User Management → User Detail** for that same user. User’s addresses, KYC status, and payment methods are the same as in User Detail.
- **Sell Management:** Same: seller is a user; link to User Detail. Sell flow includes sample testing (dashboard sends to 3rd party; 3rd party updates; dashboard updates status and notifies app).
- **Orders & Transactions:** Each order/transaction has a user; “View user” opens User Management → User Detail. Order status changes in dashboard (e.g. “Price Confirmed”, “Delivery Complete”) must be reflected in the app for that user.
- **Enquiry & Support:** Tickets are per user; from a ticket, “View user” opens User Management → User Detail.
- **Logistics / Sample testing:** Handled via 3rd party; dashboard sends details to 3rd party, receives updates, then pushes status/link/QR to app. Design a small “Sync to app” or “Notify user” indicator where relevant.
- **Payments / Settlement:** When deal is accepted, dashboard triggers transaction (QR or bank details to user via app). Transaction appears in User Detail → Transaction History and in Finance/Transactions.

---

## Part 3: Full Dashboard Structure (After User Management)

- **Dashboard home:** KPIs (users, orders, revenue), recent activity, alerts (KYC pending, payment failures).
- **User Management:** As above (list → detail with tabs; Artisanal separate).
- **Buy Management:** List of buy requests; status workflow; link to user; logistics (3rd party); send QR/bank details to app when accepted.
- **Sell Management:** List of sell requests; sample testing status (3rd party); link to user; LC/payout via app/email when done.
- **Orders & Transactions:** Orders and transactions with user links; status in sync with app.
- **Enquiry & Support:** Tickets, link to user, suggested replies.
- **Finance / Reports:** Revenue, settlements, linked to transactions and users.
- **Compliance:** KYC queue, document review (can open from User Management → KYC).
- **Partners:** Logistics (3rd party), Testing & Certification (3rd party); dashboard → 3rd party → dashboard → app flow.
- **Settings:** Admin roles, security, integrations.

---

## Design Requirements Summary

1. **User Management first:** List (with Artisanal filter/tab) → User Detail with tabs: Overview, Identity & KYC, Facilities & Addresses, Orders, Financial History, Security, Communication.
2. **App–dashboard parity:** Personal info, KYC, addresses, payment methods, orders, transactions match app; dashboard can **verify KYC** and **edit addresses**; changes sync to app.
3. **Artisanal:** Separate user management view for African artisanal users; same detail structure, interconnected with orders and transactions.
4. **Interconnection:** Buy/Sell Management, Orders, Transactions, Support all link to the same User Detail; status and data flow both ways (dashboard ↔ app).
5. **End-to-end flows:** Show state changes (e.g. “Awaiting Team Contact” → “Price Confirmed” → “Payment sent via app”) and 3rd party steps (logistics, sample testing) with “Dashboard → 3rd party → Dashboard → App” where relevant.
6. **Not static:** Use clear labels, status badges, and “View user” / “View order” links so every screen feels part of one connected system.

Use this prompt in Figma Make to generate the **User Management** screens first, then expand to Buy/Sell Management, Orders, and the rest while keeping the interconnections above.
