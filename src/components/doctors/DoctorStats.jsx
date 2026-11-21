
import { Stethoscope, Users, Activity } from "lucide-react";

const statsConfig = [
  {
    label: "Total Doctors",
    icon: Stethoscope,
    iconStyle: "bg-blue-50 text-blue-600",
    valueKey: "totalDoctors",
  },
  {
    label: "Assigned Patients",
    icon: Users,
    iconStyle: "bg-teal-50 text-[#167d73]",
    valueKey: "totalPatients",
  },
  {
    label: "Specializations",
    icon: Activity,
    iconStyle: "bg-violet-50 text-violet-600",
    valueKey: "totalSpecializations",
  },
];

export default function DoctorStats({
  totalDoctors = 0,
  totalPatients = 0,
  totalSpecializations = 0,
}) {
  const values = {
    totalDoctors,
    totalPatients,
    totalSpecializations,
  };

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statsConfig.map(({ label, icon: Icon, iconStyle, valueKey }) => (
        <div
          key={valueKey}
          className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
          >
            <Icon size={22} />
          </div>

          <div>
            <p className="text-xs text-slate-400">{label}</p>

            <p className="mt-1 text-2xl font-bold text-[#102a43]">
              {values[valueKey]}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
