import { Button } from "../ui/button";
import { useRole } from "../../contexts/RoleContext";

interface PermissionButtonProps extends React.ComponentProps<typeof Button> {
  /** Permission required to show the button (e.g. "escrow_reserve"). */
  permission: string;
  /** Optional: require minimum role instead of permission. */
  requiredRole?: import("../../lib/permissions").AdminRole;
  children: React.ReactNode;
}

/**
 * Renders the button only if the current user has the given permission (or required role).
 * Otherwise returns null.
 */
export function PermissionButton({
  permission,
  requiredRole,
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const { hasAccess } = useRole();
  const allowed = requiredRole ? hasAccess(requiredRole) : hasAccess(permission);
  if (!allowed) return null;
  return <Button {...buttonProps}>{children}</Button>;
}
