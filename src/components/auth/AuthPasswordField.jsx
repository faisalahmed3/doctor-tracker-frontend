
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function AuthPasswordField({
  label = "Password",
  name,
  placeholder,
  showPassword,
  onToggle,
  minLength = 8,
  autoComplete = "current-password",
}) {
  return (
    <div className="form-control">

      <label className="label pb-1">
        <span className="label-text text-sm font-semibold text-slate-700">
          {label}
        </span>
      </label>

      <div className="relative">

        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          className="input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 transition focus:border-[#167d73] focus:bg-white focus:outline-none"
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#167d73]"
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
