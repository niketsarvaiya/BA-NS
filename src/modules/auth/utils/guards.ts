"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "../types";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  return { authorized: !!user, loading };
}

export function useRequireRole(allowedRoles: UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [allowedRoles, loading, router, user]);

  return {
    authorized: !!user && !!user.role && allowedRoles.includes(user.role),
    loading,
  };
}

export function requireAuth(user: unknown): boolean {
  return !!user;
}

export function requireRole(user: { role?: UserRole } | null, roles: UserRole[]) {
  if (!user?.role) return false;
  return roles.includes(user.role);
}
