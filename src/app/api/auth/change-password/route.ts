import { NextResponse } from "next/server";
import { mockUsers } from "../login/route";

export async function POST(req: Request) {
  const { username, currentPassword, newPassword } = await req.json();

  if (!username || !currentPassword || !newPassword) {
    return NextResponse.json(
      { message: "username, currentPassword and newPassword are required." },
      { status: 400 }
    );
  }

  const user = mockUsers.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json(
      { message: "User not found." },
      { status: 404 }
    );
  }

  if (user.password !== currentPassword) {
    return NextResponse.json(
      { message: "Current password is incorrect." },
      { status: 400 }
    );
  }

  user.password = newPassword;
  user.mustChangePassword = false;

  return NextResponse.json({ success: true });
}
