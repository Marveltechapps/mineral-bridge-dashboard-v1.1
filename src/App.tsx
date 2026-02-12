import { useState, useCallback } from "react";
import { DashboardStoreProvider } from "./store/dashboardStore";
import { LoginScreen } from "./components/auth/LoginScreen";
import { ForgotPasswordFlow } from "./components/auth/ForgotPasswordFlow";
import { RequestAccessFlow } from "./components/auth/RequestAccessFlow";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ArtisanalMinerDashboard } from "./components/miner/ArtisanalMinerDashboard";
import { UserManagement } from "./components/admin/UserManagement";
import { MineralManagement } from "./components/admin/MineralManagement";
import { SellMineralManagement } from "./components/admin/SellMineralManagement";
import { OrderDetailPage } from "./components/admin/OrderDetailPage";
import { MineralDetailPage } from "./components/admin/MineralDetailPage";
import { MineralFormPage } from "./components/admin/MineralFormPage";
import { ComplianceVerification } from "./components/admin/ComplianceVerification";
import { OrderTransactionManagement } from "./components/admin/OrderTransactionManagement";
import { EnquirySupportManagement } from "./components/admin/EnquiryManagement";
import { FinancialReporting } from "./components/admin/FinancialReporting";
import { ContentMarketing } from "./components/admin/ContentMarketing";
import { AnalyticsInsights } from "./components/admin/Analytics";
import { DisputesResolution } from "./components/admin/DisputesResolution";
import { PartnerManagement } from "./components/admin/PartnerManagement";
import { LogisticsManagement } from "./components/admin/LogisticsManagement";
import { SellSubmissionDetailPage } from "./components/admin/SellSubmissionDetailPage";
import { InsuranceManagement } from "./components/admin/InsuranceManagement";
import { AdminSettings } from "./components/admin/AdminSettings";
import { Notifications } from "./components/dashboard/Notifications";
import { Toaster } from "./components/ui/sonner";

type AuthView = "login" | "forgotPassword" | "requestAccess";

type OrderDetailParams = { orderId: string; type: "sell" | "buy" } | null;

type ViewParams = { selectedUserId?: string; selectedTransactionId?: string; selectedOrderId?: string; selectedMineralId?: string; selectedSubmissionId?: string };

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [orderDetail, setOrderDetail] = useState<OrderDetailParams>(null);
  const [viewParams, setViewParams] = useState<ViewParams>({});
  const [authView, setAuthView] = useState<AuthView>("login");

  const navigateTo = useCallback((view: string, params?: ViewParams) => {
    setCurrentView(view);
    setViewParams(params ?? {});
  }, []);

  const openOrderDetail = useCallback((orderId: string, type: "buy" | "sell") => {
    setOrderDetail({ orderId, type });
    setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
  }, []);

  const openMineralFormPage = useCallback((mineralId?: string) => {
    setCurrentView("mineral-form");
    setViewParams(mineralId ? { selectedMineralId: mineralId } : {});
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAuthView("login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView("dashboard");
    setAuthView("login");
  };

  const handleForgotPassword = () => {
    setAuthView("forgotPassword");
  };

  const handleRequestAccess = () => {
    setAuthView("requestAccess");
  };

  const handleBackToLogin = () => {
    setAuthView("login");
  };

  const handlePasswordResetComplete = () => {
    setAuthView("login");
  };

  const handleRequestAccessComplete = () => {
    setAuthView("login");
  };

  if (!isAuthenticated) {
    if (authView === "forgotPassword") {
      return (
        <ForgotPasswordFlow 
          onBack={handleBackToLogin}
          onComplete={handlePasswordResetComplete}
        />
      );
    }
    if (authView === "requestAccess") {
      return (
        <RequestAccessFlow 
          onBack={handleBackToLogin}
          onComplete={handleRequestAccessComplete}
        />
      );
    }
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onForgotPassword={handleForgotPassword}
        onRequestAccess={handleRequestAccess}
      />
    );
  }

  const renderCurrentView = () => {
    if (currentView === "sell-order-detail" && orderDetail?.type === "sell") {
      return (
        <OrderDetailPage
          orderId={orderDetail.orderId}
          type="sell"
          onBack={() => {
            setCurrentView("sell-minerals");
            setOrderDetail(null);
          }}
          onNavigateToUser={(userId) => navigateTo("users", { selectedUserId: userId })}
          onNavigateToOrders={(transactionId) => navigateTo("orders", transactionId ? { selectedTransactionId: transactionId } : {})}
          onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
          onNavigateToDisputes={(orderId) => navigateTo("disputes", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
        />
      );
    }
    if (currentView === "buy-order-detail" && orderDetail?.type === "buy") {
      return (
        <OrderDetailPage
          orderId={orderDetail.orderId}
          type="buy"
          onBack={() => {
            setCurrentView("minerals");
            setOrderDetail(null);
          }}
          onNavigateToUser={(userId) => navigateTo("users", { selectedUserId: userId })}
          onNavigateToOrders={(transactionId) => navigateTo("orders", transactionId ? { selectedTransactionId: transactionId } : {})}
          onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
          onNavigateToDisputes={(orderId) => navigateTo("disputes", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
        />
      );
    }
    if (currentView === "sell-submission-detail" && viewParams.selectedSubmissionId) {
      return (
        <SellSubmissionDetailPage
          submissionId={viewParams.selectedSubmissionId}
          onBack={() => navigateTo("sell-minerals", {})}
        />
      );
    }
    if (currentView === "mineral-detail" && viewParams.selectedMineralId) {
      return (
        <MineralDetailPage
          mineralId={viewParams.selectedMineralId}
          onBack={() => navigateTo("minerals", {})}
          onNavigateToEdit={() => openMineralFormPage(viewParams.selectedMineralId)}
        />
      );
    }
    if (currentView === "mineral-form") {
      return (
        <MineralFormPage
          key={viewParams.selectedMineralId ?? "add"}
          mineralId={viewParams.selectedMineralId}
          onBack={() => navigateTo("minerals", {})}
          onSuccess={() => {
            if (viewParams.selectedMineralId) {
              navigateTo("mineral-detail", { selectedMineralId: viewParams.selectedMineralId });
            } else {
              navigateTo("minerals", {});
            }
          }}
        />
      );
    }
    switch (currentView) {
      case "users":
        return <UserManagement initialSelectedUserId={viewParams.selectedUserId} />;
      case "miner-dashboard":
        return <ArtisanalMinerDashboard />;
      case "mineral-form":
        return (
          <MineralFormPage
            key={viewParams.selectedMineralId ?? "add"}
            mineralId={viewParams.selectedMineralId}
            onBack={() => navigateTo("minerals", {})}
            onSuccess={() => {
              if (viewParams.selectedMineralId) {
                navigateTo("mineral-detail", { selectedMineralId: viewParams.selectedMineralId });
              } else {
                navigateTo("minerals", {});
              }
            }}
          />
        );
      case "minerals":
        return (
          <MineralManagement
            onOpenOrderDetail={(orderId) => {
              setOrderDetail({ orderId, type: "buy" });
              setCurrentView("buy-order-detail");
            }}
            onOpenMineralDetail={(mineralId) => navigateTo("mineral-detail", { selectedMineralId: mineralId })}
            onOpenMineralForm={openMineralFormPage}
            onNavigateToSupport={(userId) => navigateTo("enquiries", { selectedUserId: userId })}
          />
        );
      case "sell-minerals":
        return (
          <SellMineralManagement
            onOpenOrderDetail={(orderId) => {
              setOrderDetail({ orderId, type: "sell" });
              setCurrentView("sell-order-detail");
            }}
            onOpenSubmissionDetail={(submissionId) => navigateTo("sell-submission-detail", { selectedSubmissionId: submissionId })}
          />
        );
      case "compliance":
        return <ComplianceVerification />;
      case "orders":
        return (
          <OrderTransactionManagement
            initialTransactionId={viewParams.selectedTransactionId}
            onOpenFullOrderDetail={(orderId, orderType) => {
              setOrderDetail({ orderId, type: orderType });
              setCurrentView(orderType === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
          />
        );
      case "enquiries":
        return <EnquirySupportManagement initialUserId={viewParams.selectedUserId} />;
      case "finance":
        return <FinancialReporting />;
      case "content":
        return <ContentMarketing />;
      case "analytics":
        return <AnalyticsInsights />;
      case "disputes":
        return <DisputesResolution initialOrderId={viewParams.selectedOrderId} onOpenOrderDetail={openOrderDetail} />;
      case "partners":
        return <PartnerManagement />;
      case "logistics":
        return <LogisticsManagement initialOrderId={viewParams.selectedOrderId} onOpenOrderDetail={openOrderDetail} />;
      case "insurance":
        return <InsuranceManagement />;
      case "settings":
        return <AdminSettings />;
      case "notifications":
        return <Notifications />;
      case "dashboard":
      default:
        return (
          <Dashboard
            onViewChange={setCurrentView}
            onOpenOrder={(orderId, orderType) => {
              setOrderDetail({ orderId, type: orderType });
              setCurrentView(orderType === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
            onOpenTransaction={(transactionId) => navigateTo("orders", { selectedTransactionId: transactionId })}
            onOpenUser={(userId) => navigateTo("users", { selectedUserId: userId })}
          />
        );
    }
  };

  return (
    <DashboardStoreProvider>
      <DashboardLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      >
        {renderCurrentView()}
      </DashboardLayout>
      <Toaster position="top-right" />
    </DashboardStoreProvider>
  );
}