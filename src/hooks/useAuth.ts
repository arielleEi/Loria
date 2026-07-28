"use client";
import { useState, useEffect, useCallback } from "react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  plan: "free" | "pro";
  creditsUsed: number;
  creditsLimit: number;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, refetch: fetchUser, logout };
}
