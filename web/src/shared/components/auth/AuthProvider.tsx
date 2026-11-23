import { useState, type ReactNode } from "react";
import { type AuthUser } from "../../types/auth.types";
import { AuthContext } from "./AuthContext";
import * as authService from "../../services/authService";

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    authService.getCurrentUser(),
  );

  const login = (next: AuthUser) => {
    authService.setCurrentUser(next);
    setUser(next);
  };

  const logout = () => {
    authService.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user , login , logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;