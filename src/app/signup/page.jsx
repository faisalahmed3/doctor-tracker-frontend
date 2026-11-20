
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setNoticeType("error");
      setNotice("Passwords do not match. Please try again.");
      return;
    }

    setNoticeType("success");

    setNotice(
      "Registration form completed! Account creation will be connected to the backend later."
    );
  };

  return (
    <AuthLayout>

      {/* Heading */}
      <div className="mb-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e6f5f1] px-3 py-2 text-[11px] font-semibold text-[#167d73]">
          <ShieldCheck size={14} />
          CREATE YOUR ACCOUNT
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#102a43] sm:text-4xl">
          Get started
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create your account to access Doctor Tracker.
        </p>
      </div>

      {/* Signup Card */}
      <div className="card rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60">

        <div className="card-body gap-4 p-6 sm:p-7">

          <div>
            <h2 className="text-lg font-bold text-[#102a43]">
              Create Account
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Fill in your information below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name */}
            <AuthInputField
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              icon={User}
              autoComplete="name"
              minLength={2}
            />

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
            <AuthPasswordField
              label="Password"
              name="password"
              placeholder="Create a password"
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              minLength={8}
              autoComplete="new-password"
            />

            {/* Confirm Password */}
            <AuthPasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              showPassword={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              minLength={8}
              autoComplete="new-password"
            />

            {/* Terms */}
            <div className="pt-1">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="checkbox checkbox-sm mt-0.5 rounded-md border-slate-300 [--chkbg:#167d73] [--chkfg:white]"
                />

                <span className="text-xs leading-5 text-slate-500">
                  I agree to the terms of service and privacy policy.
                </span>
              </label>
            </div>

            {/* Notice */}
            {notice && (
              <div
                role="status"
                className={`alert rounded-xl p-3 text-xs ${
                  noticeType === "error"
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-[#b8e5d8] bg-[#effaf6] text-[#126b59]"
                }`}
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
              Create Account
              <ArrowRight size={17} />
            </button>

          </form>

          {/* Login Navigation */}
          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#167d73] transition hover:text-[#105d56]"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>

    </AuthLayout>
  );
}
