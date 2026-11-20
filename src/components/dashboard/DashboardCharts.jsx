
"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

export function PatientRegistrationChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6 flex items-center justify-between gap-3">

        <div>
          <h3 className="text-base font-bold text-[#102a43]">
            Patient Registrations
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Monthly registration statistics
          </p>
        </div>

        <span className="rounded-lg bg-[#e8f5f2] px-3 py-2 text-[10px] font-semibold text-[#167d73]">
          Last 6 Months
        </span>

      </div>

      <div className="h-[280px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >

            <defs>
              <linearGradient
                id="patientGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#167d73"
                  stopOpacity={0.25}
                />

                <stop
                  offset="95%"
                  stopColor="#167d73"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e9eef4"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Area
              type="monotone"
              dataKey="patients"
              name="New Patients"
              stroke="#167d73"
              strokeWidth={3}
              fill="url(#patientGradient)"
              activeDot={{ r: 5, strokeWidth: 0 }}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export function PatientsPerDoctorChart({ data }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-6">

        <h3 className="text-base font-bold text-[#102a43]">
          Patients per Doctor
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Patient distribution among doctors
        </p>

      </div>

      <div className="h-[280px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e9eef4"
            />

            <XAxis
              dataKey="doctor"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />

            <Tooltip contentStyle={tooltipStyle} />

            <Bar
              dataKey="patients"
              name="Patients"
              fill="#167d73"
              radius={[6, 6, 0, 0]}
              barSize={30}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}
