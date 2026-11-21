
"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function AuthPasswordField({
  label = "Password",
  name,
  placeholder,
  showPassword,
  onToggle,
  minLength = 8,
  autoComplete = "current-password",
  disabled = false,
}) {
  return (
    <div className="form-control">
      {label && (
        <label htmlFor={name} className="label pb-1">
          <span className="label-text text-sm font-semibold text-slate-700">
            {label}
          </span>
        </label>
      )}

      <div className="relative">
        <LockKeyhole
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          disabled={disabled}
          className="input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 transition focus:border-[#167d73] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#167d73] disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
