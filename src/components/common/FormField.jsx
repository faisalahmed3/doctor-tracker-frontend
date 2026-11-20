
export default function FormField({
  id,
  label,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
