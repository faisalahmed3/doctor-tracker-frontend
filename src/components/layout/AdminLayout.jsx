
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  confirmAction,
  showError,
} from "@/lib/sweetAlert";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    name: "Patients",
    href: "/patients",
    icon: Users,
  },
];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "AD";

const formatRole = (role) =>
  String(role || "Administrator")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function NavigationItem({ item, active, onNavigate }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "bg-[#e8f5f2] text-[#167d73]"
          : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
      }`}
    >
      <Icon
        size={19}
        className={`shrink-0 ${
          active
            ? "text-[#167d73]"
            : "text-slate-400 group-hover:text-[#167d73]"
        }`}
      />

      <span>{item.name}</span>

      {active && (
        <span className="ml-auto h-2 w-2 rounded-full bg-[#167d73]" />
      )}
    </Link>
  );
}

export default function AdminLayout({
  children,
  title = "Dashboard",
  description = "",
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const adminName = user?.name?.trim() || "Administrator";
  const adminEmail = user?.email || "Admin Workspace";
  const adminRole = formatRole(user?.role);
  const initials = getInitials(adminName);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const confirmation = await confirmAction({
        title: "Sign Out?",
        text: "Are you sure you want to sign out of Doctor Tracker?",
        icon: "warning",
        confirmText: "Yes, Sign Out",
        cancelText: "Cancel",
      });

      if (!confirmation?.isConfirmed) return;

      await logout();

      closeMobileMenu();

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      await showError(
        "Logout Failed",
        "Unable to sign out. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f4f7fb] text-slate-800">
        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          />
        )}

        <aside
          id="admin-sidebar"
          aria-label="Main navigation"
          className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-6">
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#167d73] text-white shadow-lg shadow-[#167d73]/20">
                <Stethoscope size={22} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#102a43]">
                  Doctor Tracker
                </h2>

                <p className="text-[10px] text-slate-400">
                  Healthcare Management
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close navigation"
              className="btn btn-ghost btn-sm btn-square lg:hidden"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-7">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-2">
              {navigation.map((item) => (
                <NavigationItem
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  onNavigate={closeMobileMenu}
                />
              ))}
            </nav>
          </div>

          <div className="shrink-0 border-t border-slate-100 p-4">
            <div className="rounded-xl bg-[#f4f7fb] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#167d73]">
                <ShieldCheck size={18} />

                <span className="text-xs font-semibold">
                  Secure Workspace
                </span>
              </div>

              <p className="text-[11px] leading-5 text-slate-500">
                Manage healthcare information from one centralized platform.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl p-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#102a43] text-xs font-bold text-white">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {adminName}
                </p>

                <p className="truncate text-[10px] text-slate-400">
                  {adminEmail}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <LogOut size={16} />
              )}

              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col lg:pl-[260px]">
          <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileMenuOpen}
                aria-controls="admin-sidebar"
                className="btn btn-ghost btn-square btn-sm lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#102a43]">
                  {title}
                </p>

                <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Doctor Tracker</span>
                  <ChevronRight size={12} />
                  <span className="truncate">{title}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <div className="hidden text-right sm:block">
                <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700">
                  {adminName}
                </p>

                <p className="text-[10px] text-slate-400">
                  {adminRole}
                </p>
              </div>

              <div
                title={adminName}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5f2] text-sm font-bold text-[#167d73]"
              >
                {initials}
              </div>
            </div>
          </header>

          <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight text-[#102a43] sm:text-3xl">
                  {title}
                </h1>

                {description && (
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                )}
              </div>

              {children}
            </div>
          </main>

          <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-[11px] text-slate-400">
            © {currentYear ? `${currentYear} ` : ""}Doctor Tracker. All rights reserved.
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
