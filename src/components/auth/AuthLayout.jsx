
import {
  Activity,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <main
      data-theme="light"
      className="min-h-screen bg-[#f4f7fb] lg:h-screen lg:overflow-hidden"
    >
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <section className="relative hidden min-h-0 overflow-hidden bg-[#102a43] px-10 py-7 text-white lg:flex lg:h-full lg:flex-col lg:justify-between xl:px-16">

          {/* Background Decorations */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#167d73]/20 blur-3xl" />

          {/* Brand */}
          <div className="relative z-10 flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#167d73] shadow-lg">
              <Stethoscope size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-wide">
                Doctor Tracker
              </h2>
              <p className="text-xs text-blue-200">
                Healthcare Management System
              </p>
            </div>
          </div>

          {/* Main Branding Content */}
          <div className="relative z-10 my-4 max-w-xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-medium text-teal-200">
              <Activity size={14} />
              SMART HEALTHCARE MANAGEMENT
            </div>

            <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
              Better care starts with
              <span className="mt-1 block text-[#55c6b3]">
                better organization.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/75">
              Manage doctors, organize patient records and monitor
              healthcare activities from one simple and secure
              administrative workspace.
            </p>

            {/* Feature Cards */}
            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#167d73]/30 text-[#65d6c2]">
                  <Users size={19} />
                </div>

                <h3 className="text-sm font-semibold">
                  Doctor Management
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-blue-100/60">
                  Organize doctor profiles and patient assignments.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#167d73]/30 text-[#65d6c2]">
                  <HeartPulse size={19} />
                </div>

                <h3 className="text-sm font-semibold">
                  Patient Tracking
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-blue-100/60">
                  Keep patient information organized and accessible.
                </p>
              </div>

            </div>

            {/* Workspace Overview */}
            <div className="mt-5 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-100/60">
                    WORKSPACE OVERVIEW
                  </p>

                  <h3 className="mt-1 text-sm font-semibold">
                    Healthcare at a glance
                  </h3>
                </div>

                <div className="rounded-lg bg-[#167d73]/30 p-2 text-[#65d6c2]">
                  <Activity size={20} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ["01", "Dashboard"],
                  ["02", "Doctors"],
                  ["03", "Patients"],
                ].map(([number, label]) => (
                  <div key={label}>
                    <p className="text-xl font-bold">{number}</p>
                    <p className="mt-1 text-[10px] text-blue-100/60">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Left Footer */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-white/10 pt-4 text-[11px] text-blue-100/50">
            <p>© 2026 Doctor Tracker</p>

            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Secure Admin Workspace
            </div>
          </div>
        </section>

        {/* RIGHT CONTENT PANEL */}
        <section className="flex min-h-screen items-center justify-center px-5 py-7 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-10 lg:py-4">

          <div className="w-full max-w-md">

            {/* Mobile Branding */}
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#167d73] text-white">
                <Stethoscope size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#102a43]">
                  Doctor Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Healthcare Management System
                </p>
              </div>
            </div>

            {/* Login or Signup Content */}
            {children}

            {/* Right Footer */}
            <p className="mt-5 text-center text-[11px] text-slate-400">
              © 2026 Doctor Tracker. All rights reserved.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
