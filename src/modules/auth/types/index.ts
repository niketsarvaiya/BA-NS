export type UserRole =
  | "admin"
  | "supervisor"
  | "technician"
  | "programmer"
  | "qc"
  | "store";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ChangePasswordPayload {
  username: string;
  currentPassword: string;
  newPassword: string;
}
