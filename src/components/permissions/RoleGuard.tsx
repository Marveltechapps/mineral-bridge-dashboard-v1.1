import type { AdminRole } from "../../lib/permissions";
import { useRole } from "../../contexts/RoleContext";
import { AccessDenied } from "./AccessDenied";

interface RoleGuardProps {
  children: React.ReactNode;
  /** Minimum role required (CEO can access everything; hierarchy: ceo > operations_manager > support_agent > data_clerk). */
  required?: AdminRole;
  /** Or require a specific permission string (e.g. "escrow_reserve"). */
  permission?: string;
  /** Optional fallback when access is denied. */
  fallback?: React.ReactNode;
  /** Optional callback when access is denied (e.g. go back). */
  onDenied?: () => void;
}

export function RoleGuard({
  children,
  required,
  permission,
  fallback,
  onDenied,
}: RoleGuardProps) {
  const { hasAccess, role } = useRole();

  const allowed = (() => {
    if (required) return hasAccess(required);
    if (permission) return hasAccess(permission);
    return true;
  })();

  if (allowed) return <>{children}</>;

  if (fallback !== undefined) return <>{fallback}</>;

  return (
    <AccessDenied
      title="Access denied"
      message={role ? "Your role doesn't have permission to view this section." : "Please log in to continue."}
      onBack={onDenied}
    />
  );
}
