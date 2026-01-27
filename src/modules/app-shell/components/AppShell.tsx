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
  Sun,
  Moon,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { useRequireAuth } from "@/modules/auth/utils/guards";
import { primaryNav, filterNavByRole, useActivePath } from "../utils/navigation";
import type { NavItem } from "../types";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";
import { GlobalNoteComposer } from "@/modules/notes/components/GlobalNoteComposer";
import { GlobalChatUI } from "@/modules/global-chat/components/GlobalChatUI";
import { useGlobalChat } from "@/modules/global-chat/context/GlobalChatContext";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { authorized, loading } = useRequireAuth();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const coreItems = navItems.filter((item) =>
    ["Dashboard", "Projects"].includes(item.label)
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
        className={`hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-200 ${
          sidebarCollapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-200 dark:border-zinc-800/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shadow-sm">
              <span className="text-primary font-semibold text-sm">BA</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm tracking-tight">
                  Beyond Assist
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-400">Operations OS</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
          <div>
            {!sidebarCollapsed && (
              <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
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
                className="flex w-full items-center justify-between px-1 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition-colors"
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
                <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
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

        <div className="border-t border-zinc-300 dark:border-zinc-800/60 px-3 py-3">
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
          <aside className="relative z-50 flex w-72 flex-col border-r border-zinc-300 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/95 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-300 dark:border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center shadow-sm">
                  <span className="text-primary font-semibold text-sm">BA</span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm tracking-tight">
                    Beyond Assist
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-400">Operations OS</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs">
              <div>
                <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
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
                    className="flex w-full items-center justify-between px-1 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 transition-colors"
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
                  <p className="px-1 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
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
        <header className="sticky top-0 z-30 border-b border-zinc-300 dark:border-zinc-800/60 bg-white dark:bg-slate-950/80 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-3 md:px-5">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-slate-950 md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Left: breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
                Overview
              </span>
              <span className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
              <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                {currentLabel}
              </p>
            </div>

            {/* Center: project switcher */}
            <div className="flex-1 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-200 shadow-sm hover:bg-zinc-200 dark:bg-zinc-800 hover:border-zinc-300 dark:border-zinc-700 transition-colors"
              >
                <span className="truncate max-w-[140px] md:max-w-[200px]">
                  Current Project (placeholder)
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-500" />
              </button>
            </div>

            {/* Right: actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex h-8 rounded-full border-zinc-300 dark:border-zinc-700 bg-zinc-900/60 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800/80 hover:-translate-y-px transition-transform transition-colors duration-150"
              >
                <Search className="mr-1.5 h-3.5 w-3.5" />
                <span>Search</span>
                <span className="ml-2 rounded-full bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:text-zinc-400">
                  Cmd K
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 rounded-full text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-900/70 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMessagingPanel}
                className="relative h-8 w-8 rounded-full text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-900/70 transition-colors"
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
                className="h-8 w-8 rounded-full text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-900/70 transition-colors"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <ProfileMenu
                userName={user?.name}
                role={user?.role}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,244,245,0.10),_transparent_55%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
              {children}
            </div>
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
        } font-medium transition-colors duration-150 ${
          active
            ? "bg-zinc-900/90 text-zinc-900 dark:text-zinc-50 shadow-[0_0_0_1px_rgba(113,113,122,0.7)]"
            : "text-zinc-400 dark:text-zinc-400 hover:bg-zinc-900/70 hover:text-zinc-800 dark:text-zinc-100"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary" />
        )}
        <span className={`inline-flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-100 ${
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

function ProfileMenu({ userName, role, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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
          {role && (
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {role}
            </span>
          )}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-1 text-xs shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900"
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
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-red-400 hover:bg-red-950/40"
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

function SidebarUserFooter({ name, role, collapsed, onLogout }: SidebarUserFooterProps) {
  const initial = name?.charAt(0).toUpperCase() ?? "U";

  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-900/80 px-2.5 py-2 shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <div className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
          {initial}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
            {name ?? "User"}
          </span>
          {role && (
            <span className="text-[11px] uppercase tracking-wide text-zinc-900 dark:text-zinc-500">
              {role}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-zinc-400 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 transition-colors"
        aria-label="Sign out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
