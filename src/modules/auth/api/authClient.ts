"use client";

import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
} from "../types";

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data?.message || "Failed to sign in. Please try again.";
    throw new Error(message);
  }

  return res.json();
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = data?.message || "Failed to change password.";
    throw new Error(message);
  }

  return res.json();
}
