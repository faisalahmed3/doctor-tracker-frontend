
export default function AuthInputField({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  autoComplete,
  required = true,
  minLength,
}) {
  return (
    <div className="form-control">
      <label className="label pb-1">
        <span className="label-text text-sm font-semibold text-slate-700">
          {label}
        </span>
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className="input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-11 text-sm text-slate-800 transition focus:border-[#167d73] focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  );
}
