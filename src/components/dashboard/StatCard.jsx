
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBackground = "bg-teal-50",
  iconColor = "text-[#167d73]",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#102a43] sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          <Icon size={23} />
        </div>

      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
}
