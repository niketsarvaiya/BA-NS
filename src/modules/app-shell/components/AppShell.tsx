"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { useRequireAuth } from "@/modules/auth/utils/guards";
import { primaryNav, filterNavByRole, useActivePath } from "../utils/navigation";
import type { NavItem } from "../types";
import { Button } from "@/components/ui/button";
import { GlobalNoteComposer } from "@/modules/notes/components/GlobalNoteComposer";
import { GlobalChatUI } from "@/modules/global-chat/components/GlobalChatUI";
import { useGlobalChat } from "@/modules/global-chat/context/GlobalChatContext";
import { useTheme } from "@/providers/ThemeProvider";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { authorized, loading } = useRequireAuth();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(true);
  const { pathname, isActive } = useActivePath();
  const {
    totalUnread: chatUnread,
    isPanelOpen: isMessagingOpen,
    togglePanel: toggleMessagingPanel,
  } = useGlobalChat();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <p>Checking authentication…</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  const navItems = filterNavByRole(primaryNav, user?.role ?? null);

  // Core section: include Dashboard, Field, and Projects in the main stack.
  const coreItems = navItems.filter((item) =>
    ["Dashboard", "Field", "Projects"].includes(item.label)
  );
  const projectsItem = navItems.find((item) => item.label === "Projects");
  const workspaceItems = projectsItem?.children ?? [];
  const adminItems = navItems.filter((item) =>
    ["Reports", "Admin Panel"].includes(item.label)
  );

  const currentLabel = getCurrentLabel(pathname, navItems);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-card backdrop-blur-xl transition-all duration-200 ${
          sidebarCollapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shadow-sm">
              <span className="text-primary font-semibold text-sm">BA</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  Beyond Assist
                </span>
                <span className="text-[11px] text-muted-foreground">Operations OS</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          <div>
            {!sidebarCollapsed && (
              <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Core
              </p>
            )}
            <div className="space-y-1">
              {coreItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  collapsed={sidebarCollapsed}
                  active={isActive(item.href)}
                  onNavigate={(href) => router.push(href)}
                />
              ))}
            </div>
          </div>

          {!!workspaceItems.length && !sidebarCollapsed && (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setShowWorkspace((v) => !v)}
                className="flex w-full items-center justify-between px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-smooth"
              >
                <span>Project Workspace</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-150 ${
                    showWorkspace ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {showWorkspace && (
                <div className="space-y-0.5">
                  {workspaceItems.map((child) => (
                    <SidebarItem
                      key={child.href}
                      item={child}
                      collapsed={false}
                      active={isActive(child.href)}
                      onNavigate={(href) => router.push(href)}
                      sub
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {!!adminItems.length && (
            <div>
              {!sidebarCollapsed && (
                <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Admin
                </p>
              )}
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    collapsed={sidebarCollapsed}
                    active={isActive(item.href)}
                    onNavigate={(href) => router.push(href)}
                  />
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <SidebarUserFooter
            name={user?.name}
            role={user?.role}
            collapsed={sidebarCollapsed}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 flex w-72 flex-col border-r border-border bg-card backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shadow-sm">
                  <span className="text-primary font-semibold text-sm">BA</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm tracking-tight text-foreground">
                    Beyond Assist
                  </span>
                  <span className="text-[11px] text-muted-foreground">Operations OS</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
              <div>
                <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Core
                </p>
                <div className="space-y-1">
                  {coreItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      collapsed={false}
                      active={isActive(item.href)}
                      onNavigate={(href) => {
                        router.push(href);
                        setMobileOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>

              {!!workspaceItems.length && (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setShowWorkspace((v) => !v)}
                    className="flex w-full items-center justify-between px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <span>Project Workspace</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-150 ${
                        showWorkspace ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {showWorkspace && (
                    <div className="space-y-0.5">
                      {workspaceItems.map((child) => (
                        <SidebarItem
                          key={child.href}
                          item={child}
                          collapsed={false}
                          active={isActive(child.href)}
                          onNavigate={(href) => {
                            router.push(href);
                            setMobileOpen(false);
                          }}
                          sub
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!!adminItems.length && (
                <div>
                  <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Admin
                  </p>
                  <div className="space-y-1">
                    {adminItems.map((item) => (
                      <SidebarItem
                        key={item.href}
                        item={item}
                        collapsed={false}
                        active={isActive(item.href)}
                        onNavigate={(href) => {
                          router.push(href);
                          setMobileOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="sticky top-0 z-30 border-b border-border bg-card backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-3 md:px-5">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-smooth md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Left: breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Overview
              </span>
              <span className="h-3 w-px bg-border" />
              <p className="truncate text-sm font-medium text-foreground">
                {currentLabel}
              </p>
            </div>

            {/* Center: project switcher */}
            <div className="flex-1 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs text-foreground shadow-sm hover:bg-accent hover:border-primary/40 transition-smooth"
              >
                <span className="truncate max-w-[140px] md:max-w-[200px]">
                  Current Project (placeholder)
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Right: actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex h-8 rounded-full text-xs hover:-translate-y-px transition-all duration-150"
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                <span>Search</span>
                <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  Cmd K
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMessagingPanel}
                className="relative h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                aria-label={isMessagingOpen ? "Close messaging" : "Open messaging"}
              >
                <MessageCircle className="h-4 w-4" />
                {chatUnread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-semibold text-white">
                    {chatUnread}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Bell className="h-4 w-4" />
              </Button>

              {/* Optional quick Beyond Calm / Beyond Neo toggle */}
              <ThemeQuickToggle />

              <ProfileMenu
                userName={user?.name}
                role={user?.role}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Global Add Note FAB & composer (hidden on auth pages since AppShell is not mounted there) */}
        <GlobalNoteComposer />
        {/* Global chat bar + floating windows (supportive, never dominant) */}
        <GlobalChatUI />
      </div>
    </div>
  );
}

function getCurrentLabel(pathname: string | null, navItems: NavItem[]): string {
  if (!pathname) return "Dashboard";

  let activeParent: NavItem | null = null;
  let activeChild: NavItem | null = null;

  for (const item of navItems) {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      activeParent = item;
    }
    if (item.children) {
      for (const child of item.children) {
        if (pathname === child.href || pathname.startsWith(`${child.href}/`)) {
          activeParent = item;
          activeChild = child;
          break;
        }
      }
    }
  }

  if (activeParent?.label === "Projects" && activeChild) {
    return `Projects / ${activeChild.label}`;
  }

  return activeParent?.label ?? "Dashboard";
}

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate: (href: string) => void;
  sub?: boolean;
}

function SidebarItem({ item, collapsed, active, onNavigate, sub = false }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        onClick={() => onNavigate(item.href)}
        className={`relative group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 ${
          sub ? "text-[11px]" : "text-xs"
        } font-medium transition-smooth ${
          active
            ? "bg-primary/10 text-foreground border border-primary/20"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" />
        )}
        <span className={`inline-flex items-center justify-center rounded-md ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:text-foreground"
        } ${
          sub ? "h-6 w-6" : "h-7 w-7"
        }`}>
          <Icon className={sub ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </span>
        {!collapsed && (
          <span className="flex-1 truncate text-left">{item.label}</span>
        )}
      </button>
    </div>
  );
}

interface ProfileMenuProps {
  userName?: string;
  role?: string;
  onLogout: () => void;
}

function getRoleLabel(role?: string) {
  if (!role) return "";
  const map: Record<string, string> = {
    admin: "Admin",
    supervisor: "Supervisor",
    technician: "Installer",
    programmer: "Programmer",
    qc: "QC",
    store: "Store",
  };
  return map[role] ?? role;
}

function ProfileMenu({ userName, role, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const roleLabel = getRoleLabel(role);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border bg-card px-2.5 py-1.5 text-xs md:text-sm text-foreground shadow-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {userName?.charAt(0).toUpperCase() ?? "U"}
        </span>
        <span className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-xs font-medium truncate max-w-[120px]">
            {userName ?? "User"}
          </span>
          {roleLabel && (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {roleLabel}
            </span>
          )}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 rounded-md border border-border bg-card p-1 text-xs shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-foreground hover:bg-muted transition-smooth"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            <User className="h-3.5 w-3.5" />
            <span>View Profile</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-smooth"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface SidebarUserFooterProps {
  name?: string;
  role?: string;
  collapsed: boolean;
  onLogout: () => void;
}

function ThemeQuickToggle() {
  const { theme, toggleTheme } = useTheme();
  const isNeo = theme === "neo";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[11px] text-muted-foreground shadow-sm hover:text-foreground hover:border-primary/50 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-smooth"
      aria-label={isNeo ? "Switch to Beyond Calm" : "Switch to Beyond Neo"}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px]">
        <Sparkles className="h-3 w-3" />
      </span>
      <span className="hidden sm:inline">
        {isNeo ? "Beyond Neo" : "Beyond Calm"}
      </span>
      <span className="inline sm:hidden">{isNeo ? "Neo" : "Calm"}</span>
    </button>
  );
}

function SidebarUserFooter({ name, role, collapsed, onLogout }: SidebarUserFooterProps) {
  const initial = name?.charAt(0).toUpperCase() ?? "U";
  const roleLabel = getRoleLabel(role);

  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-smooth"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-muted px-2.5 py-2 shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="truncate text-xs font-medium text-foreground">
            {name ?? "User"}
          </span>
          {roleLabel && (
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {roleLabel}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
        aria-label="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
