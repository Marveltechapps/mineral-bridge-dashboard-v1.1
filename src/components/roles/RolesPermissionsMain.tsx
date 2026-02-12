import { useState } from "react";
import { RolesManagementPage } from "./RolesManagementPage";
import { CreateEditRole } from "./CreateEditRole";
import { ActivityLogs } from "./ActivityLogs";
import { SecurityTracking } from "./SecurityTracking";

type View = "list" | "create-role" | "edit-role" | "activity-logs" | "security";

interface RolesPermissionsMainProps {
  initialView?: View;
}

export function RolesPermissionsMain({ initialView = "list" }: RolesPermissionsMainProps) {
  const [currentView, setCurrentView] = useState<View>(initialView);
  const [selectedRoleId, setSelectedRoleId] = useState<string | undefined>();

  const handleNavigate = (view: string, roleId?: string) => {
    setCurrentView(view as View);
    setSelectedRoleId(roleId);
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedRoleId(undefined);
  };

  switch (currentView) {
    case "create-role":
      return <CreateEditRole onBack={handleBack} />;
    case "edit-role":
      return <CreateEditRole roleId={selectedRoleId} onBack={handleBack} />;
    case "activity-logs":
      return <ActivityLogs />;
    case "security":
      return <SecurityTracking />;
    case "list":
    default:
      return <RolesManagementPage onNavigate={handleNavigate} />;
  }
}
