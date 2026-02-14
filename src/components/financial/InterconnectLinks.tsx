import { Link2, Wallet, FileText, Shield, Globe, TrendingUp, LayoutGrid } from "lucide-react";
import { Button } from "../ui/button";

export type FinancialTabId = "transactions" | "escrow" | "lc" | "incoterms" | "compliance" | "currency" | "revenue";

const TAB_LINKS: { id: FinancialTabId; label: string; icon: React.ElementType }[] = [
  { id: "transactions", label: "Transactions", icon: LayoutGrid },
  { id: "escrow", label: "Escrow", icon: Wallet },
  { id: "lc", label: "Trade Finance LC", icon: FileText },
  { id: "incoterms", label: "Incoterms", icon: Link2 },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "currency", label: "Multi-Currency", icon: Globe },
  { id: "revenue", label: "Revenue", icon: TrendingUp },
];

export interface InterconnectLinksProps {
  activeTab?: FinancialTabId;
  onNavigateToTab: (tab: FinancialTabId) => void;
  onNavigateToEnquiries?: () => void;
  openEnquiriesCount?: number;
  className?: string;
}

export function InterconnectLinks({
  activeTab,
  onNavigateToTab,
  onNavigateToEnquiries,
  openEnquiriesCount = 0,
  className,
}: InterconnectLinksProps) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-muted-foreground mb-2">Financial & Reporting</p>
      <div className="flex flex-wrap gap-2">
        {TAB_LINKS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={isActive ? "bg-[#A855F7] hover:bg-purple-600 text-white" : ""}
              onClick={() => onNavigateToTab(tab.id)}
            >
              <Icon className="h-3.5 w-3.5 mr-1" />
              {tab.label}
            </Button>
          );
        })}
        {openEnquiriesCount > 0 && onNavigateToEnquiries && (
          <Button variant="outline" size="sm" className="border-amber-300 text-amber-700" onClick={onNavigateToEnquiries}>
            Enquiry & Support ({openEnquiriesCount})
          </Button>
        )}
      </div>
    </div>
  );
}
