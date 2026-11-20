
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";

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
    <AuthLayout>

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
            <AuthInputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@example.com"
              icon={Mail}
              autoComplete="email"
            />

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>

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

              <AuthPasswordField
                name="password"
                placeholder="Enter your password"
                showPassword={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                minLength={6}
                autoComplete="current-password"
              />
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

          {/* Signup Navigation */}
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

    </AuthLayout>
  );
}
