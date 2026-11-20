
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  Users,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

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

export default function AdminLayout({
  children,
  title,
  description,
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* Logo */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-6">

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
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
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-ghost btn-sm btn-square lg:hidden"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>

        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">

          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">

            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-[#e8f5f2] text-[#167d73]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#102a43]"
                  }`}
                >
                  <Icon size={19} />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#167d73]" />
                  )}
                </Link>
              );
            })}

          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div className="border-t border-slate-100 p-4">

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

          <div className="mt-4 flex items-center gap-3 px-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102a43] text-xs font-bold text-white">
              AD
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Administrator
              </p>

              <p className="text-[10px] text-slate-400">
                Admin Workspace
              </p>
            </div>

          </div>
        </div>

      </aside>

      {/* Main Application */}
      <div className="flex min-h-screen flex-col lg:pl-[260px]">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="btn btn-ghost btn-square btn-sm lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm font-semibold text-[#102a43]">
                {title}
              </p>

              <p className="text-[11px] text-slate-400">
                Doctor Tracker / {title}
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-slate-700">
                Admin User
              </p>

              <p className="text-[10px] text-slate-400">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5f2] text-sm font-bold text-[#167d73]">
              AU
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          <div className="mx-auto max-w-7xl">

            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-[#102a43] sm:text-3xl">
                {title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {description}
              </p>
            </div>

            {children}

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-[11px] text-slate-400">
          © 2026 Doctor Tracker. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
