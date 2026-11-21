"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Stethoscope,
  Users,
  Activity,
  UserCheck,
  RefreshCw,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import StatCard from "@/components/common/StatCard";
import {
  RegistrationChart,
  PatientsPerDoctorChart,
} from "@/components/dashboard/DashboardCharts";

import { dashboardApi } from "@/services/dashboardApi";

const getArray = (value) =>
  Array.isArray(value) ? value : [];

const formatNumber = (value) => {
  const number = Number(value);
  return (Number.isFinite(number) ? number : 0).toLocaleString("en-GB");
};

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeRequest = useRef(null);

  const loadDashboard = useCallback(async () => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;

    setLoading(true);
    setError("");

    try {
      const response = await dashboardApi.getSummary({
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (!response?.success || !response?.data) {
        throw new Error(
          response?.message || "Invalid dashboard response."
        );
      }

      setDashboard(response.data);
    } catch (err) {
      if (controller.signal.aborted) return;

      console.error("Dashboard loading error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load dashboard statistics."
      );
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [loadDashboard]);

  const monthlyRegistrations = getArray(
    dashboard?.monthlyRegistrations
  );

  const patientsPerDoctor = getArray(
    dashboard?.patientsPerDoctor
  );

  const recentPatients = getArray(
    dashboard?.recentPatients
  );

  const recentDoctors = getArray(
    dashboard?.recentDoctors
  );

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of doctor and patient management."
    >
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#167d73]">
            ANALYTICS OVERVIEW
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#102a43]">
            Healthcare Dashboard
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Statistics calculated from your MongoDB records.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="btn h-10 min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !dashboard ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <span className="loading loading-spinner loading-lg text-[#167d73]" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading dashboard statistics...
          </p>
        </div>
      ) : !dashboard ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <AlertCircle
            size={30}
            className="mx-auto text-red-400"
          />

          <h3 className="mt-3 font-semibold text-[#102a43]">
            Dashboard data unavailable
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Check your API connection and try again.
          </p>

          <button
            type="button"
            onClick={loadDashboard}
            className="btn btn-sm mt-5 rounded-lg border-0 bg-[#167d73] text-white hover:bg-[#12675f]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Doctors"
              value={dashboard.totalDoctors}
              description={`${formatNumber(dashboard.activeDoctors)} active doctors`}
              icon={Stethoscope}
              iconBackground="bg-blue-50"
              iconColor="text-blue-600"
            />

            <StatCard
              title="Total Patients"
              value={dashboard.totalPatients}
              description="All registered patient records"
              icon={Users}
              iconBackground="bg-[#e8f5f2]"
              iconColor="text-[#167d73]"
            />

            <StatCard
              title="Doctors With Patients"
              value={dashboard.doctorsWithPatients}
              description="Doctors with assigned patient records"
              icon={UserCheck}
              iconBackground="bg-amber-50"
              iconColor="text-amber-600"
            />

            <StatCard
              title="Specializations"
              value={dashboard.totalSpecializations}
              description="Unique medical specialties"
              icon={Activity}
              iconBackground="bg-violet-50"
              iconColor="text-violet-600"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <RegistrationChart data={monthlyRegistrations} />

            <PatientsPerDoctorChart data={patientsPerDoctor} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <RecentPatients patients={recentPatients} />

            <RecentDoctors doctors={recentDoctors} />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays size={14} />
            Dashboard data refreshes when this page loads or when you select Refresh Data.
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function RecentPatients({ patients }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h2 className="text-base font-bold text-[#102a43]">
            Recent Patients
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest registered patients
          </p>
        </div>

        <a
          href="/patients"
          className="text-xs font-semibold text-[#167d73] hover:underline"
        >
          View All →
        </a>
      </div>

      <div className="divide-y divide-slate-100">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <div
              key={patient.id || patient._id}
              className="flex items-center gap-3 p-4 sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
                <Users size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#102a43]">
                  {patient.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {patient.condition || "Not specified"}
                  {" · "}
                  {patient.doctorName || "Unassigned"}
                </p>
              </div>

              <span className="hidden shrink-0 text-[11px] text-slate-400 sm:block">
                {patient.registeredAt
                  ? new Date(patient.registeredAt).toLocaleDateString("en-GB")
                  : "—"}
              </span>
            </div>
          ))
        ) : (
          <p className="p-8 text-center text-sm text-slate-400">
            No patients registered yet.
          </p>
        )}
      </div>
    </section>
  );
}

function RecentDoctors({ doctors }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
        <div>
          <h2 className="text-base font-bold text-[#102a43]">
            Recent Doctors
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest doctor registrations
          </p>
        </div>

        <a
          href="/doctors"
          className="text-xs font-semibold text-[#167d73] hover:underline"
        >
          View All →
        </a>
      </div>

      <div className="divide-y divide-slate-100">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div
              key={doctor.id || doctor._id}
              className="flex items-center gap-3 p-4 sm:px-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Stethoscope size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#102a43]">
                  {doctor.name}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {doctor.specialization || "Not specified"}
                  {" · "}
                  {Number(doctor.patientCount) || 0} patients
                </p>
              </div>

              <span className="hidden shrink-0 text-[11px] text-slate-400 sm:block">
                {doctor.createdAt
                  ? new Date(doctor.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </span>
            </div>
          ))
        ) : (
          <p className="p-8 text-center text-sm text-slate-400">
            No doctors registered yet.
          </p>
        )}
      </div>
    </section>
  );
}
