"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
          setUser(normalizeUser(response.data.user));
        } catch (error) {
          console.error("Failed to load profile", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(normalizeUser(userData));
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/logout");
      }
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      localStorage.removeItem("token");
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
