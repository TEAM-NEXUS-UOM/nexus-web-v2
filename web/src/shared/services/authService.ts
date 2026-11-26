
import { type AuthUser, type Role } from "../types/auth.types";
import { mockUsers } from "../mock/mockUsers";

const STORAGE_KEY = "nexus.CurrentUser";


export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    const fresh = mockUsers.find((u) => u.userId === parsed.userId);
    if (!fresh || !(fresh.role in HOME_PATH)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return fresh;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setCurrentUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function logOut(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getMockUsers(): AuthUser[] {
  return mockUsers;
}

export const LOGIN_PATH = "/signin";

const HOME_PATH: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  MANUFACTURING_ADMIN: "/manufacturer",
  WAREHOUSE_MANAGER: "/warehouse",
  WAREHOUSE_SUPERVISOR: "/warehouse",
  AGENCY_MANAGER: "/agency",
};

export function getHomePath(role: Role): string {
  return HOME_PATH[role];
}
