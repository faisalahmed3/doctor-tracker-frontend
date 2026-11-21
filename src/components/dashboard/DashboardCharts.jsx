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
  Legend,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-GB");

const formatMonth = (value) => {
  if (!/^\d{4}-\d{2}$/.test(String(value))) return value;

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
};

function ChartCard({ title, description, children, badge }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#102a43]">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        {badge && (
          <span className="rounded-lg bg-[#e8f5f2] px-3 py-2 text-[10px] font-semibold text-[#167d73]">
            {badge}
          </span>
        )}
      </div>

      <div className="h-[280px] w-full min-w-0">
        {children}
      </div>
    </section>
  );
}

const ChartTooltip = () => ({
  contentStyle: tooltipStyle,
  formatter: (value, name) => [
    formatNumber(value),
    name,
  ],
});

export function RegistrationChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <ChartCard
      title="Registration Trends"
      description="Monthly doctor and patient registrations"
      badge="Last 6 Months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
        >
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
            tickFormatter={formatMonth}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />

          <Tooltip
            {...ChartTooltip()}
            labelFormatter={formatMonth}
          />

          <Legend
            wrapperStyle={{
              fontSize: "11px",
              paddingTop: "12px",
            }}
          />

          <Area
            type="monotone"
            dataKey="patients"
            name="Patients"
            stroke="#167d73"
            strokeWidth={3}
            fill="#167d73"
            fillOpacity={0.12}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />

          <Area
            type="monotone"
            dataKey="doctors"
            name="Doctors"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="#60a5fa"
            fillOpacity={0.08}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PatientRegistrationChart({ data = [] }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <ChartCard
      title="Patient Registrations"
      description="Monthly patient registration statistics"
      badge="Last 6 Months"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
        >
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
            tickFormatter={formatMonth}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />

          <Tooltip
            {...ChartTooltip()}
            labelFormatter={formatMonth}
          />

          <Area
            type="monotone"
            dataKey="patients"
            name="New Patients"
            stroke="#167d73"
            strokeWidth={3}
            fill="#167d73"
            fillOpacity={0.15}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PatientsPerDoctorChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data.map((doctor) => ({
        doctor:
          doctor.doctor ||
          doctor.name ||
          "Unknown",
        patients: Math.max(
          0,
          Number(doctor.patients ?? doctor.patientCount) || 0
        ),
      }))
    : [];

  return (
    <ChartCard
      title="Patients per Doctor"
      description="Patient distribution among registered doctors"
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 5, left: -20, bottom: 35 }}
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
              height={55}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />

            <Tooltip {...ChartTooltip()} />

            <Bar
              dataKey="patients"
              name="Patients"
              fill="#167d73"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          No doctor records available.
        </div>
      )}
    </ChartCard>
  );
}
