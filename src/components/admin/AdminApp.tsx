import { useState } from "react";
import { AdminLogin } from "./AdminLogin";
import { ProjectSelection } from "./ProjectSelection";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboard } from "./AdminDashboard";
import { AdminPropertiesPage } from "./AdminPropertiesPage";
import { UsersManagement } from "./UsersManagement";
import { EnquiriesManagement } from "../enquiry/EnquiriesManagement";
import { PaymentsReports } from "./PaymentsReports";
import { RolesPermissions } from "./RolesPermissions";
import { AdminSettings } from "./AdminSettings";
import { FinanceDashboard } from "./finance/FinanceDashboard";
import { TransactionsPage } from "./finance/TransactionsPage";
import { CommissionsPage } from "./finance/CommissionsPage";
import { RefundsDisputesPage } from "./finance/RefundsDisputesPage";
import { InvoicesPage } from "./finance/InvoicesPage";
import { ReportsGSTPage } from "./finance/ReportsGSTPage";
import { PaymentGatewaySettings } from "./finance/PaymentGatewaySettings";

type AppState = "login" | "project-selection" | "dashboard";

export function AdminApp() {
  const [appState, setAppState] = useState<AppState>("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [currentProject, setCurrentProject] = useState({
    id: "P001",
    name: "Mumbai Central Marketplace",
  });

  const handleLogin = () => {
    setAppState("project-selection");
  };

  const handleProjectSelect = (projectId: string) => {
    // In a real app, fetch project details here
    setAppState("dashboard");
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setAppState("login");
    setCurrentPage("dashboard");
  };

  const handleSwitchProject = () => {
    setAppState("project-selection");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "properties":
        return <AdminPropertiesPage />;
      case "users":
        return <UsersManagement />;
      case "marketplace":
        return <EnquiriesManagement />;
      case "enquiries":
        return <EnquiriesManagement />;
      case "payments":
        return <PaymentsReports />;
      case "finance":
        return <FinanceDashboard />;
      case "transactions":
        return <TransactionsPage />;
      case "commissions":
        return <CommissionsPage />;
      case "refunds":
        return <RefundsDisputesPage />;
      case "invoices":
        return <InvoicesPage />;
      case "reports":
        return <ReportsGSTPage />;
      case "gateways":
        return <PaymentGatewaySettings />;
      case "roles":
        return <RolesPermissions />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  if (appState === "login") {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (appState === "project-selection") {
    return (
      <ProjectSelection
        onSelectProject={handleProjectSelect}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AdminLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={handleLogout}
      onSwitchProject={handleSwitchProject}
      currentProject={currentProject}
    >
      {renderPage()}
    </AdminLayout>
  );
}