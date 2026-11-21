
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ShieldCheck, RefreshCw } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const { status, authError, checkAuth } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] p-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldCheck size={26} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-[#102a43]">
            Session Verification Failed
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {typeof authError === "string" && authError
              ? authError
              : "Unable to verify your session. Please try again."}
          </p>

          <button
            type="button"
            onClick={checkAuth}
            className="btn mt-5 rounded-xl border-0 bg-[#167d73] text-white hover:bg-[#12675f]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-3 block w-full text-sm font-medium text-slate-500 hover:text-[#167d73]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <div className="text-center" aria-live="polite">
          <span className="loading loading-spinner loading-lg text-[#167d73]" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
