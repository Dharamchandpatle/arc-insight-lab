import React, { createContext, useContext, useState } from "react";

type Role = "Candidate" | "HR";

export interface User {
  username: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const mockUsers = [
  { username: "candidate", password: "1234", role: "Candidate" as Role },
  { username: "hr", password: "1234", role: "HR" as Role },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // simulate async
    await new Promise((r) => setTimeout(r, 300));
    const found = mockUsers.find((u) => u.username === username && u.password === password);
    if (found) {
      const u: User = { username: found.username, role: found.role };
      setUser(u);
      return u;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
