/**
 * Mineral Bridge Admin RBAC – 4-level hierarchy
 * CEO | Operations Manager | Support Agent | Data Entry Clerk
 */

export type AdminRole = "ceo" | "operations_manager" | "support_agent" | "data_clerk";

export const ADMIN_ROLES: { value: AdminRole; label: string; description: string }[] = [
  { value: "ceo", label: "CEO / Super Admin", description: "Full access: all modules, user management, billing, system config" },
  { value: "operations_manager", label: "Operations Manager", description: "Orders, Financial & Reporting, Transport; view Enquiry/User Mgmt" },
  { value: "support_agent", label: "Support Agent", description: "Enquiry & Support, User Mgmt (basic); view Orders read-only" },
  { value: "data_clerk", label: "Data Entry Clerk", description: "View Orders, log calls, basic status; no money, LC, Analytics, User Mgmt" },
];

/** Access level for a module: full (read+write+actions), view (read-only), log (limited log/update), or none */
export type ModuleAccess = "full" | "view" | "log" | "none";

/** Dashboard view id → minimum role access. "full" = can do everything, "view" = read-only, "log" = limited, "none" = hidden. */
export const MODULE_ACCESS: Record<string, Partial<Record<AdminRole, ModuleAccess>>> = {
  dashboard:            { ceo: "full", operations_manager: "full", support_agent: "full", data_clerk: "full" },
  "miner-dashboard":    { ceo: "full", operations_manager: "view", support_agent: "view", data_clerk: "none" },
  users:                { ceo: "full", operations_manager: "view", support_agent: "view", data_clerk: "none" },
  minerals:             { ceo: "full", operations_manager: "full", support_agent: "view", data_clerk: "view" },
  "sell-minerals":      { ceo: "full", operations_manager: "full", support_agent: "view", data_clerk: "view" },
  orders:               { ceo: "full", operations_manager: "full", support_agent: "view", data_clerk: "view" },
  enquiries:            { ceo: "full", operations_manager: "view", support_agent: "full", data_clerk: "log" },
  finance:              { ceo: "full", operations_manager: "full", support_agent: "view", data_clerk: "none" },
  "finance-transactions": { ceo: "full", operations_manager: "full", support_agent: "view", data_clerk: "none" },
  "finance-send-qr":     { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  "finance-call-buyer":  { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  "finance-reserve-escrow": { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  "finance-testing":     { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  "finance-lc-issued":   { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  "finance-release":     { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  content:              { ceo: "full", operations_manager: "none", support_agent: "none", data_clerk: "none" },
  analytics:            { ceo: "full", operations_manager: "view", support_agent: "none", data_clerk: "none" },
  compliance:            { ceo: "full", operations_manager: "view", support_agent: "view", data_clerk: "none" },
  disputes:             { ceo: "full", operations_manager: "view", support_agent: "view", data_clerk: "none" },
  partners:             { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  logistics:            { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  insurance:            { ceo: "full", operations_manager: "full", support_agent: "none", data_clerk: "none" },
  settings:             { ceo: "full", operations_manager: "view", support_agent: "view", data_clerk: "none" },
};


/** Permissions (granular actions). CEO has all. */
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  ceo: ["*"],
  operations_manager: [
    "orders_read", "orders_write", "orders_delete",
    "financial_read", "financial_write", "escrow_reserve", "qr_send", "release_payment", "lc_issue",
    "transport_read", "transport_write",
    "enquiry_read", "user_read", "compliance_read", "disputes_read",
  ],
  support_agent: [
    "enquiry_read", "enquiry_write", "user_read", "user_basic",
    "orders_read", "compliance_read", "disputes_read", "log_create", "log_update",
  ],
  data_clerk: [
    "orders_read", "log_create", "log_update", "qr_sent_mark",
  ],
};

function resolveModuleAccess(view: string): Partial<Record<AdminRole, ModuleAccess>> {
  return MODULE_ACCESS[view] ?? { ceo: "full" };
}

/**
 * Returns whether the given role can access the dashboard view.
 * "none" or missing = no access; "log", "view", "full" = can see the module.
 */
export function hasModuleAccess(role: AdminRole, view: string): boolean {
  const access = resolveModuleAccess(view)[role];
  return access === "full" || access === "view" || access === "log";
}

/**
 * Returns the access level for the role on this view ("full" | "view" | "log" | "none").
 */
export function getModuleAccessLevel(role: AdminRole, view: string): ModuleAccess {
  return resolveModuleAccess(view)[role] ?? "none";
}

/**
 * Returns whether the role has the given permission (or wildcard *).
 */
export function hasPermission(role: AdminRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (perms.includes("*")) return true;
  if (permission === "*") return true;
  if (perms.includes(permission)) return true;
  const [prefix] = permission.split("_");
  if (perms.some((p) => p === `${prefix}_*` || p === "*")) return true;
  return false;
}

/**
 * Returns whether the role has at least the required access for the view (e.g. "full" for write actions).
 */
export function hasMinimumAccess(role: AdminRole, view: string, minimum: ModuleAccess): boolean {
  const level = getModuleAccessLevel(role, view);
  const order: ModuleAccess[] = ["none", "log", "view", "full"];
  return order.indexOf(level) >= order.indexOf(minimum);
}

export function getPermissionsForRole(role: AdminRole): string[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function getRoleLabel(role: AdminRole): string {
  return ADMIN_ROLES.find((r) => r.value === role)?.label ?? role;
}
