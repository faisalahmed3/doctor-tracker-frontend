
"use client";

import {
  Stethoscope,
  Users,
  UserRound,
  UserPlus,
  Activity,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/dashboard/StatCard";

import {
  PatientRegistrationChart,
  PatientsPerDoctorChart,
} from "@/components/dashboard/DashboardCharts";

import {
  monthlyPatientData,
  doctorPatientData,
} from "@/data/dashboardData";

export default function DashboardPage() {

  // Temporary dashboard statistics
  // Replace with API data during backend integration.

  const dashboardStats = [
    {
      title: "Total Doctors",
      value: "24",
      description: "Registered doctors",
      icon: Stethoscope,
      iconBackground: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Patients",
      value: "1,284",
      description: "Patients across all doctors",
      icon: Users,
      iconBackground: "bg-teal-50",
      iconColor: "text-[#167d73]",
    },
    {
      title: "Avg. Patients / Doctor",
      value: "53.5",
      description: "Average patient distribution",
      icon: UserRound,
      iconBackground: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "New Patients",
      value: "86",
      description: "Registered in the last 30 days",
      icon: UserPlus,
      iconBackground: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      description="Monitor your healthcare operations and performance."
    >

      {/* Dashboard Overview */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#167d73]">
            Overview
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#102a43]">
            Healthcare Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            A summary of your doctors and patient records.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 sm:self-center">

          <span className="h-2 w-2 rounded-full bg-amber-500" />

          <span className="text-xs font-semibold text-amber-700">
            Demo Data
          </span>

          <span className="hidden text-[11px] text-amber-600 sm:inline">
            API integration pending
          </span>

        </div>

      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            iconBackground={stat.iconBackground}
            iconColor={stat.iconColor}
          />
        ))}

      </section>

      {/* Analytics Charts */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <PatientRegistrationChart
          data={monthlyPatientData}
        />

        <PatientsPerDoctorChart
          data={doctorPatientData}
        />

      </section>

      {/* Dashboard Information */}
      <section className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
            <Activity size={22} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#102a43]">
              Dashboard Analytics
            </h3>

            <p className="mt-1 text-xs leading-6 text-slate-500">
              This dashboard provides an overview of doctor
              registrations, patient distribution and monthly
              patient registrations. The current figures are
              demonstration data and will be replaced by live
              database statistics through the REST API.
            </p>
          </div>

        </div>

      </section>

    </AdminLayout>
  );
}
