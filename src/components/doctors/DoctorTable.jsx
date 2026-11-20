
"use client";

import {
  Users,
  Eye,
  Mail,
  Phone,
  Building2,
  Stethoscope,
} from "lucide-react";

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DoctorAvatar({ name }) {
  const initials = name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-sm font-bold text-[#167d73]">
      {initials}
    </div>
  );
}

export default function DoctorTable({ doctors, onViewPatients }) {
  if (doctors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Stethoscope size={27} />
        </div>

        <h3 className="mt-4 font-bold text-[#102a43]">
          No doctors found
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Try changing your search or filter criteria.
        </p>

      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

        <div className="overflow-x-auto">

          <table className="table w-full">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Doctor</th>
                <th>Specialization</th>
                <th>Hospital</th>
                <th>Contact</th>
                <th>Patients</th>
                <th>Added Date</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>

              {doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/70"
                >

                  {/* Doctor */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <DoctorAvatar name={doctor.name} />

                      <div>
                        <p className="whitespace-nowrap text-sm font-semibold text-[#102a43]">
                          {doctor.name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {doctor.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Specialization */}
                  <td>
                    <span className="inline-flex whitespace-nowrap rounded-lg bg-[#e8f5f2] px-3 py-1.5 text-xs font-medium text-[#167d73]">
                      {doctor.specialization}
                    </span>
                  </td>

                  {/* Hospital */}
                  <td>
                    <div className="flex max-w-[180px] items-center gap-2 text-xs text-slate-600">
                      <Building2 size={15} className="shrink-0 text-slate-400" />
                      <span>{doctor.hospital}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td>
                    <div className="space-y-2">

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        <span>{doctor.email}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone size={13} className="text-slate-400" />
                        <span>{doctor.phone}</span>
                      </div>

                    </div>
                  </td>

                  {/* Patients */}
                  <td>
                    <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                      <Users size={14} className="text-[#167d73]" />

                      <span className="text-xs font-bold text-slate-700">
                        {doctor.patients.length}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {formatDate(doctor.createdAt)}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => onViewPatients(doctor.id)}
                      className="btn btn-sm rounded-lg border-[#d5ebe5] bg-white text-xs font-semibold text-[#167d73] hover:border-[#167d73] hover:bg-[#e8f5f2]"
                    >
                      <Eye size={15} />
                      View Patients
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>
      </div>

      {/* MOBILE / TABLET CARDS */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">

        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">
                <DoctorAvatar name={doctor.name} />

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[#102a43]">
                    {doctor.name}
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {doctor.id}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-lg bg-[#e8f5f2] px-2.5 py-1.5 text-[10px] font-semibold text-[#167d73]">
                {doctor.specialization}
              </span>

            </div>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">

              <div className="flex items-start gap-2 text-xs text-slate-500">
                <Building2 size={15} className="mt-0.5 shrink-0 text-slate-400" />
                <span>{doctor.hospital}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={15} className="shrink-0 text-slate-400" />
                <span className="break-all">{doctor.email}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={15} className="shrink-0 text-slate-400" />
                <span>{doctor.phone}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">

                <div>
                  <p className="text-[10px] text-slate-400">
                    Total Patients
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#102a43]">
                    {doctor.patients.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onViewPatients(doctor.id)}
                  className="btn btn-sm rounded-lg border-0 bg-[#167d73] text-xs text-white hover:bg-[#12675f]"
                >
                  <Eye size={15} />
                  View Patients
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>
    </>
  );
}
