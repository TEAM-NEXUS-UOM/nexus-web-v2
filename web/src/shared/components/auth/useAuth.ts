import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside the auth provider");
  return ctx;
}
