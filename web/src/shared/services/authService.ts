import { type AuthUser, type Role } from "../types/auth.types";
import { mockUsers } from "../mock/mockUsers";

const STORAGE_KEY = "nexus.CurrentUser";

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
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
