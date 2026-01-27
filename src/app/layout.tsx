import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { NotesProvider } from "@/modules/notes/context/NotesContext";
import { GlobalChatProvider } from "@/modules/global-chat/context/GlobalChatContext";
import { DelightEngineProvider } from "@/modules/delight-engine/context/DelightEngineContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beyond Assist V1",
  description: "Beyond Assist V1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            {/* Notes + Chat + Delight providers keep state consistent across app routes. */}
            <NotesProvider>
              <GlobalChatProvider>
                <DelightEngineProvider>
                  {children}
                </DelightEngineProvider>
              </GlobalChatProvider>
            </NotesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
