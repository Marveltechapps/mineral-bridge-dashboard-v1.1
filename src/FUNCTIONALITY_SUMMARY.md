# Mineral Bridge - Functionality Summary

## Overview
This document provides a comprehensive summary of the Mineral Bridge admin dashboard, a platform for verified mineral trading and supply chain transparency.

---

## 1. Dashboard (components/dashboard/Dashboard.tsx)

### Purpose
The Dashboard serves as the command center for platform administrators, providing real-time insights into trading volume, user registrations, and critical system alerts.

### Key Features

#### **KPI Cards**
- **Total Users**: Metric for user growth (+12.5%)
- **Verified Minerals**: Count of ESG-compliant listings (+4.2%)
- **Pending Orders**: Critical metric for operational backlog (-2.4%)
- **Revenue (Mtd)**: Financial performance snapshot (+18.2%)

#### **Activity & Alerts**
- **Recent Activities**: Timeline of transactions, registrations, and listings.
- **System Alerts**: Color-coded alerts for KYC verification, payment failures, and inventory thresholds.
- **Quick Actions**: Buttons for immediate tasks like Approving Minerals and Viewing Transactions.

---

## 2. User Management (components/admin/UserManagement.tsx)

### Purpose
Manage the platform's user base, including buyers, sellers, and administrators, with a focus on trust and compliance.

### Key Features
- **User Table**: Displays Name, Type (Buyer/Seller), Tier (Platinum/Gold), Trust Score, KYC Status.
- **Trust Score Visualization**: Visual progress bar indicating user reliability.
- **KYC Status Tracking**: Badges for Verified, Pending, and Rejected statuses.
- **Actions**: View Details, Review KYC, Suspend/Reactivate User.

---

## 3. Mineral Management (components/admin/MineralManagement.tsx)

### Purpose
Catalog management for mineral listings, ensuring quality control and ESG compliance.

### Key Features
- **Mineral Catalog**: Table of listed minerals with Price, Trend, and Origin.
- **ESG Scoring**: Color-coded badges (A+, B, C+) to highlight sustainable sourcing.
- **Tabbed Interface**: 
  - **Catalog**: All active listings.
  - **Pending Approvals**: Listings awaiting admin review.
  - **ESG Compliance**: Dedicated view for sustainability metrics.
- **Market Price Trends**: Indicators for price movement (Up/Down).

---

## 4. Order & Transaction Management (components/admin/OrderTransactionManagement.tsx)

### Purpose
End-to-end tracking of trade lifecycles from order placement to financial settlement.

### Key Features
- **Order Tracking**: ID, Buyer/Seller pair, Mineral Quantity, and Amount.
- **Status Workflow**: Processing -> Shipped -> Delivered -> Cancelled.
- **Payment Status**: Detailed states including Escrow Held, Released, and Refunded.
- **Financial Metrics**: Summary cards for Total Volume, Pending Settlements, and Active Orders.

---

## 5. Enquiry & Support (components/admin/EnquiryManagement.tsx)

### Purpose
Helpdesk system for managing user inquiries and dispute resolution.

### Key Features
- **Ticket System**: List view with status (Open, Resolved) and priority indicators.
- **Conversation View**: Chat-like interface for admin-user communication.
- **AI Suggested Responses**: Smart suggestions based on ticket context (e.g., shipping delays).
- **Filtering**: Filter by ticket type (Logistics, Finance, General) and status.

---

## 6. Financial & Reporting (components/admin/FinancialReporting.tsx)

### Purpose
Financial oversight including revenue tracking, fee collection, and settlement processing.

### Key Features
- **Revenue Charts**: Visual breakdown of monthly revenue.
- **Settlement Queue**: Monitoring of payments waiting for blockchain confirmation.
- **Transaction History**: Detailed log of Credits (fees) and Debits (payouts).
- **Export**: CSV/PDF reporting capabilities.

---

## 7. Content & Marketing (components/admin/ContentMarketing.tsx)

### Purpose
Tools for platform announcements, banner management, and user engagement.

### Key Features
- **Banner Management**: Upload and schedule promotional banners.
- **Push Notifications**: targeted alerts to Buyers or Sellers.
- **Trending Config**: Control which minerals appear in the "Trending" section of the user app.

---

## 8. Analytics & Insights (components/admin/Analytics.tsx)

### Purpose
Deep dive into platform data to identify trends and top performers.

### Key Features
- **Trading Volume Chart**: Visual trend of daily transaction volumes.
- **Category Distribution**: Pie chart showing market share by mineral type.
- **High Value Users**: Leaderboard of top trading partners.
- **Regional Activity**: Geographic breakdown of orders.

---

## 9. Settings & System Configuration (components/admin/AdminSettings.tsx)

### Purpose
Global configuration for the platform instance, including administrative user control and system-wide preferences.

### Key Features
- **Admin User Management**: Complete CRUD (Create, Read, Update, Delete) capabilities for administrative staff with dedicated edit dialogs.
- **Role Permissions Matrix**: Granular access control system allowing "View," "Edit," and "Delete" permissions for specific platform roles (Super Admin, Finance/Admin, Operations, Content Admin).
- **Integration Management**: Toggles for third-party services like Payment Gateways, Email Services, and Analytics.
- **Notification Preferences**: Configuration for system alerts, email digests, and desktop notifications.
- **Security Policies**: Toggles for 2FA enforcement, Session Timeouts, and Strict KYC mode.
- **Audit Logs**: Immutable record of admin actions for security compliance.

---

## 10. Navigation & Layout (components/dashboard/DashboardLayout.tsx)

### Purpose
Core application wrapper providing consistent navigation and stateful UI feedback across the admin portal.

### Key Features
- **Stateful Navigation**: Sidebar navigation items that dynamically reflect the active page state with distinct highlighting and icon styling.
- **Responsive Sidebar**: Collapsible menu with tooltips for desktop and mobile-friendly drawer interface.
- **Theme Switching**: Native support for Light and Dark modes with persistent state management.
- **Profile & Quick Access**: Header components for user profile management, global notifications, and quick action dropdowns.

---

## Technical Implementation Details

### UI/UX Design
- **Theme**: Corporate tech aesthetic using Slate (900/50), Emerald (Green), and Blue.
- **Components**: Modular Cards, Data Tables, and Tabbed interfaces for information density.
- **Responsiveness**: Fully responsive layouts adapting to desktop and tablet views.
- **Dark Mode**: Native support via Tailwind's dark mode classes.

### State Management
- Local component state for UI interactions (tabs, search inputs).
- Props-based navigation handling in `App.tsx`.

*Last Updated: January 27, 2026*
