import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { AdminRole } from "../lib/permissions";
import {
  hasModuleAccess,
  hasPermission,
  getModuleAccessLevel,
  getPermissionsForRole,
  getRoleLabel,
} from "../lib/permissions";
import type { ModuleAccess } from "../lib/permissions";

const ADMIN_REGISTRY_KEY = "mineral_bridge_admin_registry";

/** Logged-in user (no password). */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

/** Stored admin with password (for registry only). */
export interface StoredAdmin extends AdminUser {
  password: string;
  status: string;
}

export type AdminUpdatePayload = Partial<Pick<StoredAdmin, "name" | "email" | "role" | "status">> & { password?: string };

const defaultAdmins: StoredAdmin[] = [
  { id: "1", name: "Admin", email: "admin@mineralbridge.com", password: "demo123", role: "ceo", status: "Active" },
  { id: "2", name: "Sarah Connor", email: "sarah@mineralbridge.com", password: "demo123", role: "ceo", status: "Active" },
  { id: "3", name: "John Smith", email: "john@mineralbridge.com", password: "demo123", role: "operations_manager", status: "Active" },
  { id: "4", name: "Emily Chen", email: "emily@mineralbridge.com", password: "demo123", role: "support_agent", status: "Inactive" },
];

function loadAdminRegistry(): StoredAdmin[] {
  try {
    const raw = localStorage.getItem(ADMIN_REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredAdmin[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return defaultAdmins;
}

function saveAdminRegistry(list: StoredAdmin[]) {
  localStorage.setItem(ADMIN_REGISTRY_KEY, JSON.stringify(list));
}

interface RoleContextValue {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
  role: AdminRole | null;
  permissions: string[];
  hasAccess: (requiredRoleOrPermission: AdminRole | string) => boolean;
  hasModuleAccess: (view: string) => boolean;
  getModuleAccessLevel: (view: string) => ModuleAccess;
  getRoleLabel: (r: AdminRole) => string;
  /** Admin registry (email + password). Create admins in Settings → Admin Users. */
  adminRegistry: StoredAdmin[];
  addAdmin: (admin: Omit<StoredAdmin, "id" | "status">) => void;
  updateAdmin: (id: string, updates: AdminUpdatePayload) => void;
  removeAdmin: (id: string) => void;
  /** Validate credentials; returns AdminUser (no password) if valid. */
  getAdminByCredentials: (email: string, password: string) => AdminUser | null;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [adminRegistry, setAdminRegistry] = useState<StoredAdmin[]>(() => loadAdminRegistry());
  const role = user?.role ?? null;

  useEffect(() => {
    saveAdminRegistry(adminRegistry);
  }, [adminRegistry]);

  const addAdmin = (admin: Omit<StoredAdmin, "id" | "status">) => {
    const id = String(Date.now());
    setAdminRegistry((prev) => [...prev, { ...admin, id, status: "Active" }]);
  };

  const updateAdmin = (id: string, updates: AdminUpdatePayload) => {
    setAdminRegistry((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const removeAdmin = (id: string) => {
    setAdminRegistry((prev) => prev.filter((a) => a.id !== id));
  };

  const getAdminByCredentials = (email: string, password: string): AdminUser | null => {
    const normalized = email.trim().toLowerCase();
    const found = adminRegistry.find(
      (a) => a.email.toLowerCase() === normalized && a.password === password && a.status === "Active"
    );
    if (!found) return null;
    return { id: found.id, email: found.email, name: found.name, role: found.role };
  };

  const value = useMemo<RoleContextValue>(() => {
    const permissions = role ? getPermissionsForRole(role) : [];
    return {
      user,
      setUser,
      role,
      permissions,
      hasAccess(required: AdminRole | string) {
        if (!role) return false;
        const roleKeys: AdminRole[] = ["ceo", "operations_manager", "support_agent", "data_clerk"];
        if (roleKeys.includes(required as AdminRole)) {
          const hierarchy = { ceo: 0, operations_manager: 1, support_agent: 2, data_clerk: 3 };
          return hierarchy[role] <= hierarchy[required as AdminRole];
        }
        return hasPermission(role, required);
      },
      hasModuleAccess(view: string) {
        return role ? hasModuleAccess(role, view) : false;
      },
      getModuleAccessLevel(view: string) {
        return role ? getModuleAccessLevel(role, view) : "none";
      },
      getRoleLabel: getRoleLabel,
      adminRegistry,
      addAdmin,
      updateAdmin,
      removeAdmin,
      getAdminByCredentials,
    };
  }, [user, role, adminRegistry]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

export function useRoleOptional(): RoleContextValue | null {
  return useContext(RoleContext);
}
