import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, removeAuthToken } from "../lib/api";

type Role = "Candidate" | "HR";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name: string, role: "HR_Recruiter" | "Student_Candidate") => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Helper to map backend role to frontend role
const mapRole = (backendRole: string): Role => {
  if (backendRole === "HR_Recruiter") return "HR";
  if (backendRole === "Student_Candidate") return "Candidate";
  return "Candidate"; // default
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Token exists, but we need to verify it's valid
      // For now, we'll just check if user data exists in localStorage
      const userData = localStorage.getItem("user_data");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser(parsed);
        } catch (e) {
          // Invalid data, clear it
          localStorage.removeItem("user_data");
          removeAuthToken();
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.user && response.token) {
        const userData: User = {
          id: response.user.id,
          username: response.user.email,
          email: response.user.email,
          name: response.user.name,
          role: mapRole(response.user.role),
        };
        
        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "HR_Recruiter" | "Student_Candidate"
  ): Promise<User | null> => {
    try {
      setLoading(true);
      const response = await authAPI.register(email, password, name, role);
      
      if (response.user && response.token) {
        const userData: User = {
          id: response.user.id,
          username: response.user.email,
          email: response.user.email,
          name: response.user.name,
          role: mapRole(response.user.role),
        };
        
        setUser(userData);
        localStorage.setItem("user_data", JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error: any) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    localStorage.removeItem("user_data");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Export register function type
export type RegisterFunction = (
  email: string,
  password: string,
  name: string,
  role: "HR_Recruiter" | "Student_Candidate"
) => Promise<User | null>;

export default AuthContext;
