"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profile_picture_url?: string;
  hotel_id?: number | null;
  hotel?: { name: string; id: number } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: (skipApiCall?: boolean) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: set a cookie with optional expiry in days
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

// Helper: delete a cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure`;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = (userData: any): User => {
    if (!userData) return userData;
    let roleStr = "";
    if (typeof userData.role === 'string') {
      roleStr = userData.role.toLowerCase();
    } else if (typeof userData.role === 'object' && userData.role?.name) {
      roleStr = userData.role.name.toLowerCase();
    } else if (userData.role_name) {
      roleStr = userData.role_name.toLowerCase();
    } else if (userData.role_id === 1) {
      roleStr = 'admin';
    } else if (userData.role_id === 3) {
      roleStr = 'receptionist';
    } else {
      roleStr = 'user';
    }
    return {
      ...userData,
      role: roleStr
    };
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await api.get("/profile");
          const normalized = normalizeUser(response.data.user);
          setUser(normalized);
          // Sync cookies with fresh profile data for middleware
          setCookie('auth_token', storedToken);
          setCookie('user_role', normalized.role);
        } catch (error) {
          console.log("No active session or token expired.");
          localStorage.removeItem("token");
          deleteCookie('auth_token');
          deleteCookie('user_role');
          setToken(null);
          setUser(null);
        }
      } else {
        // No token — clear cookies too
        deleteCookie('auth_token');
        deleteCookie('user_role');
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = (newToken: string, userData: any) => {
    const normalized = normalizeUser(userData);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(normalized);
    // Set cookies so Next.js middleware can read them for route protection
    setCookie('auth_token', newToken);
    setCookie('user_role', normalized.role);
  };

  const logout = async (skipApiCall = false) => {
    try {
      if (token && !skipApiCall) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      localStorage.removeItem("token");
      deleteCookie('auth_token');
      deleteCookie('user_role');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
