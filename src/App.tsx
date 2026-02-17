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
import { OrderTransactionDetailPage } from "./components/admin/OrderTransactionDetailPage";
import { EnquirySupportManagement } from "./components/admin/EnquiryManagement";
import { FinancialReporting } from "./components/admin/FinancialReporting";
import { FinancialTransactionsPage } from "./components/admin/Financial/FinancialTransactionsPage";
import { SendQRPage } from "./components/admin/Financial/flow/SendQRPage";
import { CallBuyerPage } from "./components/admin/Financial/flow/CallBuyerPage";
import { ReserveEscrowPage } from "./components/admin/Financial/flow/ReserveEscrowPage";
import { TestingPage } from "./components/admin/Financial/flow/TestingPage";
import { LcIssuedPage } from "./components/admin/Financial/flow/LcIssuedPage";
import { ReleasePaymentPage } from "./components/admin/Financial/flow/ReleasePaymentPage";
import type { FinancialFlowStep } from "./lib/financialApi";
import { ContentMarketing } from "./components/admin/ContentMarketing";
import { AnalyticsInsights } from "./components/admin/Analytics";
import { DisputesResolution } from "./components/admin/DisputesResolution";
import { PartnerManagement } from "./components/admin/PartnerManagement";
import { LogisticsManagement } from "./components/admin/LogisticsManagement";
import { SellSubmissionDetailPage } from "./components/admin/SellSubmissionDetailPage";
import { InsuranceManagement } from "./components/admin/InsuranceManagement";
import { AdminSettings } from "./components/admin/AdminSettings";
import { AuditLogPage } from "./components/admin/AuditLogPage";
import { CallHistoryPage } from "./components/admin/CallHistoryPage";
import { ProfilePage } from "./components/admin/ProfilePage";
import { HelpPage } from "./components/admin/HelpPage";
import { Notifications } from "./components/dashboard/Notifications";
import { GlobalSearchResults } from "./components/dashboard/GlobalSearchResults";
import { Toaster } from "./components/ui/sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
import { RoleProvider, useRole } from "./contexts/RoleContext";
import type { AdminUser } from "./contexts/RoleContext";

type AuthView = "login" | "forgotPassword" | "requestAccess";

type OrderDetailParams = { orderId: string; type: "sell" | "buy" } | null;

type ViewParams = {
  selectedUserId?: string;
  selectedTransactionId?: string;
  selectedOrderId?: string;
  selectedMineralId?: string;
  selectedSubmissionId?: string;
  /** Financial flow: transaction ID and which step page to show. */
  selectedFinancialTransactionId?: string;
  selectedFinancialFlowStep?: "send-qr" | "call-buyer" | "reserve-escrow" | "testing" | "lc-issued" | "release";
  /** Orders & Settlements: open sheet with this tab (e.g. "testing"). */
  ordersSheetTab?: string;
};

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [orderDetail, setOrderDetail] = useState<OrderDetailParams>(null);
  const [viewParams, setViewParams] = useState<ViewParams>({});
  const [authView, setAuthView] = useState<AuthView>("login");
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const { setUser } = useRole();

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

  const handleLogin = (user: AdminUser) => {
    setUser(user);
    setIsAuthenticated(true);
    setAuthView("login");
  };

  const handleLogout = () => {
    setUser(null);
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
          onNavigateToOrders={(transactionId, openTab) => navigateTo("orders", transactionId ? { selectedTransactionId: transactionId, ordersSheetTab: openTab } : {})}
          onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
          onNavigateToDisputes={(orderId) => navigateTo("disputes", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToAuditLog={() => navigateTo("audit-log", {})}
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
          onNavigateToOrders={(transactionId, openTab) => navigateTo("orders", transactionId ? { selectedTransactionId: transactionId, ordersSheetTab: openTab } : {})}
          onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
          onNavigateToDisputes={(orderId) => navigateTo("disputes", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
          onNavigateToAuditLog={() => navigateTo("audit-log", {})}
        />
      );
    }
    if (currentView === "sell-submission-detail" && viewParams.selectedSubmissionId) {
      return (
        <SellSubmissionDetailPage
          submissionId={viewParams.selectedSubmissionId}
          onBack={() => navigateTo("sell-minerals", {})}
          onNavigateToAuditLog={() => navigateTo("audit-log", {})}
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
        return <ComplianceVerification onNavigateToAuditLog={() => navigateTo("audit-log", {})} />;
      case "orders":
        return (
          <OrderTransactionManagement
            initialTransactionId={viewParams.selectedTransactionId}
            initialSheetTab={viewParams.ordersSheetTab}
            onOpenFullOrderDetail={(orderId, orderType) => {
              setOrderDetail({ orderId, type: orderType });
              setCurrentView("orders-order-detail");
            }}
            onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
            onNavigateToFinance={() => setCurrentView("finance")}
            onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
            onNavigateToFinanceTransactions={() => navigateTo("finance-transactions", {})}
          />
        );
      case "orders-order-detail":
        if (orderDetail?.orderId != null) {
          return (
            <OrderTransactionDetailPage
              orderId={orderDetail.orderId}
              type={orderDetail.type}
              onBack={() => {
                setCurrentView("orders");
                setOrderDetail(null);
              }}
              onOpenFullOrderDetail={() => setCurrentView(orderDetail.type === "sell" ? "sell-order-detail" : "buy-order-detail")}
              onOpenFinancialFlow={(transactionId, step) => {
                const viewMap: Record<FinancialFlowStep, string> = {
                  "send-qr": "finance-send-qr",
                  "call-buyer": "finance-call-buyer",
                  "reserve-escrow": "finance-reserve-escrow",
                  "testing": "finance-testing",
                  "lc-issued": "finance-lc-issued",
                  "release": "finance-release",
                };
                navigateTo(viewMap[step], {
                  selectedFinancialTransactionId: transactionId,
                  selectedFinancialFlowStep: step,
                });
              }}
            />
          );
        }
        return (
          <OrderTransactionManagement
            initialTransactionId={viewParams.selectedTransactionId}
            initialSheetTab={viewParams.ordersSheetTab}
            onOpenFullOrderDetail={(orderId, orderType) => {
              setOrderDetail({ orderId, type: orderType });
              setCurrentView("orders-order-detail");
            }}
            onNavigateToEnquiries={(userId) => navigateTo("enquiries", userId ? { selectedUserId: userId } : {})}
            onNavigateToFinance={() => setCurrentView("finance")}
            onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
            onNavigateToFinanceTransactions={() => navigateTo("finance-transactions", {})}
          />
        );
      case "enquiries":
        return <EnquirySupportManagement initialUserId={viewParams.selectedUserId} />;
      case "finance":
        return (
          <FinancialReporting
            onOpenOrderDetail={(orderId, type) => {
              setOrderDetail({ orderId, type });
              setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
            onNavigateToEnquiries={() => setCurrentView("enquiries")}
            onOpenLogisticsDetail={(orderId) => navigateTo("logistics", { selectedOrderId: orderId })}
            onNavigateToTransactionsPage={() => navigateTo("finance-transactions", {})}
            onNavigateToTab={() => setCurrentView("finance")}
          />
        );
      case "finance-transactions":
        return (
          <FinancialTransactionsPage
            onBackToDashboard={() => navigateTo("finance", {})}
            onNavigateToTab={() => setCurrentView("finance")}
            onNavigateToEnquiries={() => setCurrentView("enquiries")}
            onOpenFlowStep={(txId, step) => {
              const viewMap: Record<FinancialFlowStep, string> = {
                "send-qr": "finance-send-qr",
                "call-buyer": "finance-call-buyer",
                "reserve-escrow": "finance-reserve-escrow",
                "testing": "finance-testing",
                "lc-issued": "finance-lc-issued",
                "release": "finance-release",
              };
              navigateTo(viewMap[step], {
                selectedFinancialTransactionId: txId,
                selectedFinancialFlowStep: step,
              });
            }}
          />
        );
      case "finance-send-qr":
      case "finance-call-buyer":
      case "finance-reserve-escrow":
      case "finance-testing":
      case "finance-lc-issued":
      case "finance-release": {
        const txId = viewParams.selectedFinancialTransactionId;
        const step = viewParams.selectedFinancialFlowStep ?? "send-qr";
        const goToStep = (s: FinancialFlowStep) => {
          const viewMap: Record<FinancialFlowStep, string> = {
            "send-qr": "finance-send-qr",
            "call-buyer": "finance-call-buyer",
            "reserve-escrow": "finance-reserve-escrow",
            "testing": "finance-testing",
            "lc-issued": "finance-lc-issued",
            "release": "finance-release",
          };
          navigateTo(viewMap[s], { selectedFinancialTransactionId: txId ?? "", selectedFinancialFlowStep: s });
        };
        const backToTransactions = () => navigateTo("finance-transactions", {});
        if (!txId) {
          return (
            <div className="p-6">
              <p className="text-muted-foreground">No transaction selected.</p>
              <button type="button" className="text-[#A855F7] underline mt-2" onClick={backToTransactions}>Back to Transactions</button>
            </div>
          );
        }
        const common = {
          transactionId: txId,
          onNavigateToStep: goToStep,
          onBackToTransactions: backToTransactions,
          onOpenOrderDetail: openOrderDetail,
          onOpenLogisticsDetail: (orderId: string) => navigateTo("logistics", { selectedOrderId: orderId }),
        };
        const stepLabels: Record<string, string> = {
          "finance-send-qr": "Send QR",
          "finance-call-buyer": "Call Buyer",
          "finance-reserve-escrow": "Reserve Escrow",
          "finance-testing": "Testing",
          "finance-lc-issued": "LC Issued",
          "finance-release": "Release Payment",
        };
        const stepLabel = stepLabels[currentView] ?? "Step";
        const FinanceFlowBreadcrumb = () => (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button type="button" onClick={() => navigateTo("finance", {})} className="text-xs font-medium text-muted-foreground hover:text-[#A855F7] transition-colors">
                    Financial & Reporting
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button type="button" onClick={backToTransactions} className="text-xs font-medium text-muted-foreground hover:text-[#A855F7] transition-colors">
                    Transactions
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs font-medium text-slate-900 dark:text-white">
                  {stepLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        );
        const content =
          currentView === "finance-send-qr" ? <SendQRPage {...common} /> :
          currentView === "finance-call-buyer" ? <CallBuyerPage {...common} /> :
          currentView === "finance-reserve-escrow" ? <ReserveEscrowPage {...common} /> :
          currentView === "finance-testing" ? <TestingPage {...common} /> :
          currentView === "finance-lc-issued" ? <LcIssuedPage {...common} /> :
          <ReleasePaymentPage {...common} />;
        return (
          <div className="max-w-6xl mx-auto">
            <div className="px-6 pt-6">
              <FinanceFlowBreadcrumb />
            </div>
            {content}
          </div>
        );
      }
      case "content":
        return <ContentMarketing />;
      case "analytics":
        return <AnalyticsInsights />;
      case "disputes":
        return <DisputesResolution initialOrderId={viewParams.selectedOrderId} onOpenOrderDetail={openOrderDetail} />;
      case "partners":
        return (
          <PartnerManagement
            onNavigateToCompliance={() => navigateTo("compliance", {})}
            onNavigateToLogistics={(orderId) => navigateTo("logistics", orderId ? { selectedOrderId: orderId } : {})}
            onNavigateToTransactions={(transactionId) => navigateTo("orders", transactionId ? { selectedTransactionId: transactionId } : {})}
            onOpenOrderDetail={(orderId, type) => {
              setOrderDetail({ orderId, type });
              setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
          />
        );
      case "logistics":
        return (
          <LogisticsManagement
            initialOrderId={viewParams.selectedOrderId}
            onOpenOrderDetail={openOrderDetail}
            onNavigateToTransaction={(transactionId) => navigateTo("orders", { selectedTransactionId: transactionId })}
            onNavigateToTransactionsPage={() => navigateTo("orders", {})}
          />
        );
      case "insurance":
        return <InsuranceManagement />;
      case "settings":
        return <AdminSettings />;
      case "audit-log":
        return (
          <AuditLogPage
            onNavigateToOrder={(orderId, type) => {
              setOrderDetail({ orderId, type });
              setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
            onNavigateToTransaction={() => setCurrentView("finance-transactions")}
            onNavigateToUser={(userId) => navigateTo("users", { selectedUserId: userId })}
            onNavigateToSubmission={(submissionId) => navigateTo("sell-submission-detail", { selectedSubmissionId: submissionId })}
          />
        );
      case "call-history":
        return (
          <CallHistoryPage
            onBack={() => setCurrentView("dashboard")}
            onOpenOrder={(orderId, type) => {
              setOrderDetail({ orderId, type });
              setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
          />
        );
      case "profile":
        return <ProfilePage onBack={() => setCurrentView("dashboard")} />;
      case "help":
        return <HelpPage />;
      case "notifications":
        return <Notifications />;
      case "search":
        return (
          <GlobalSearchResults
            query={globalSearchQuery}
            onViewChange={setCurrentView}
            onOpenOrder={(orderId, type) => {
              setOrderDetail({ orderId, type });
              setCurrentView(type === "sell" ? "sell-order-detail" : "buy-order-detail");
            }}
            onOpenMineralDetail={(mineralId) => navigateTo("mineral-detail", { selectedMineralId: mineralId })}
            onOpenUser={(userId) => navigateTo("users", { selectedUserId: userId })}
          />
        );
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
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={handleLogout}
      globalSearchQuery={globalSearchQuery}
      onGlobalSearch={(query) => {
        setGlobalSearchQuery(query);
        setCurrentView("search");
      }}
    >
      {renderCurrentView()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <DashboardStoreProvider>
      <RoleProvider>
        <AppContent />
        <Toaster position="top-right" />
      </RoleProvider>
    </DashboardStoreProvider>
  );
}