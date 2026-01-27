import { NextResponse } from "next/server";
import type { AuthUser, UserRole } from "@/modules/auth/types";

interface MockUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  password: string;
  mustChangePassword: boolean;
}

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Admin User",
    username: "admin",
    role: "admin",
    password: "admin123",
    mustChangePassword: false,
  },
  {
    id: "2",
    name: "Supervisor User",
    username: "supervisor",
    role: "supervisor",
    password: "supervisor123",
    mustChangePassword: true,
  },
  {
    id: "3",
    name: "Technician User",
    username: "technician",
    role: "technician",
    password: "tech123",
    mustChangePassword: false,
  },
  {
    id: "4",
    name: "Programmer User",
    username: "programmer",
    role: "programmer",
    password: "prog123",
    mustChangePassword: false,
  },
  {
    id: "5",
    name: "QC User",
    username: "qc",
    role: "qc",
    password: "qc123",
    mustChangePassword: false,
  },
  {
    id: "6",
    name: "Store User",
    username: "store",
    role: "store",
    password: "store123",
    mustChangePassword: false,
  },
  {
    id: "7",
    name: "Field Electrician",
    username: "electrician",
    role: "technician",
    password: "electrician123",
    mustChangePassword: false,
  },
];

function createAccessToken(user: AuthUser): string {
  return Buffer.from(`${user.username}:${Date.now()}`).toString("base64");
}

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  const found = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    return NextResponse.json(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  }

  const user: AuthUser = {
    id: found.id,
    name: found.name,
    username: found.username,
    role: found.role,
    mustChangePassword: found.mustChangePassword,
  };

  const accessToken = createAccessToken(user);

  return NextResponse.json({ accessToken, user });
}
