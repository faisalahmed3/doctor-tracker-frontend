
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [notice, setNotice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice(
      "Login interface is working! Backend authentication will be connected later."
    );
  };

  return (
    <main
      data-theme="light"
      className="min-h-screen bg-[#f4f7fb] lg:h-screen lg:overflow-hidden"
    >
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-2">

        {/* LEFT BRANDING SECTION */}
        <section className="relative hidden min-h-0 overflow-hidden bg-[#102a43] px-10 py-7 text-white lg:flex lg:h-full lg:flex-col lg:justify-between xl:px-16">

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

          {/* Main Content */}
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

          {/* Footer */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-white/10 pt-4 text-[11px] text-blue-100/50">
            <p>© 2026 Doctor Tracker</p>

            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Secure Admin Workspace
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN SECTION */}
        <section className="flex min-h-screen items-center justify-center px-5 py-7 sm:px-10 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-10 lg:py-4">

          <div className="w-full max-w-md">

            {/* Mobile Brand */}
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

            {/* Heading */}
            <div className="mb-5">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e6f5f1] px-3 py-2 text-[11px] font-semibold text-[#167d73]">
                <ShieldCheck size={14} />
                SECURE ADMIN ACCESS
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to access your healthcare management dashboard.
              </p>

            </div>

            {/* Login Card */}
            <div className="card rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60">

              <div className="card-body gap-4 p-6 sm:p-7">

                <div>
                  <h2 className="text-lg font-bold text-[#102a43]">
                    Admin Login
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter your credentials to continue.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Email */}
                  <div className="form-control">

                    <label className="label pb-1">
                      <span className="label-text text-sm font-semibold text-slate-700">
                        Email Address
                      </span>
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        required
                        className="input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm text-slate-800 outline-none focus:border-[#167d73] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-control">

                    <div className="mb-1 flex items-center justify-between">
                      <label className="label py-0">
                        <span className="label-text text-sm font-semibold text-slate-700">
                          Password
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setNotice(
                            "Password recovery will be available after backend integration."
                          )
                        }
                        className="text-xs font-semibold text-[#167d73] hover:text-[#105d56]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        minLength={6}
                        className="input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none focus:border-[#167d73] focus:bg-white focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#167d73]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="checkbox checkbox-sm rounded-md border-slate-300 [--chkbg:#167d73] [--chkfg:white]"
                      />

                      <span className="text-xs text-slate-600">
                        Remember me
                      </span>
                    </label>
                  </div>

                  {/* Notice */}
                  {notice && (
                    <div
                      role="status"
                      className="alert rounded-xl border border-[#b8e5d8] bg-[#effaf6] p-3 text-xs text-[#126b59]"
                    >
                      <CheckCircle2 size={17} />
                      <span>{notice}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn h-11 min-h-11 w-full rounded-xl border-0 bg-[#167d73] text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 transition hover:-translate-y-0.5 hover:bg-[#12675f]"
                  >
                    Sign In
                    <ArrowRight size={17} />
                  </button>

                </form>

                {/* Sign Up Link */}
                <div className="border-t border-slate-100 pt-4 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-bold text-[#167d73] transition hover:text-[#105d56]"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-[#167d73]"
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Your security matters
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      This workspace is designed for authorized
                      administrative access.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <p className="mt-5 text-center text-[11px] text-slate-400">
              © 2026 Doctor Tracker. All rights reserved.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
