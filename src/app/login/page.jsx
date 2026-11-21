
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Info,
  Mail,
  ShieldCheck,
} from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import AuthInputField from "@/components/auth/AuthInputField";
import AuthPasswordField from "@/components/auth/AuthPasswordField";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || status === "loading") return;

    setLoading(true);
    setError("");
    setNotice("");

    const formData = new FormData(e.currentTarget);

    const credentials = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    try {
      await login(credentials);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (err.request
            ? "Unable to connect to the server. Please try again."
            : err.message || "Something went wrong. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || status === "loading";

  if (status === "authenticated") return null;

  return (
    <AuthLayout>
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
            <AuthInputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="admin@example.com"
              icon={Mail}
              autoComplete="username"
              disabled={isBusy}
            />

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => {
                    setNotice(
                      "Please contact your system administrator for password recovery."
                    );
                    setError("");
                  }}
                  className="text-xs font-semibold text-[#167d73] hover:text-[#105d56] disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>

              <AuthPasswordField
                label={null}
                name="password"
                placeholder="Enter your password"
                showPassword={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                minLength={8}
                autoComplete="current-password"
                disabled={isBusy}
              />
            </div>

            {notice && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700"
              >
                <Info size={17} className="mt-0.5 shrink-0" />
                {notice}
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
              >
                <Info size={17} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isBusy}
              className="btn h-11 min-h-11 w-full rounded-xl border-0 bg-[#167d73] text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 transition hover:bg-[#12675f] disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Contact your system administrator to get authorized access.
            </p>
          </div>

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
                This workspace is restricted to authorized administrative users.
                Your account access is protected by authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
