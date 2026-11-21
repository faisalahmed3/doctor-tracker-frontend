
"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus, RefreshCw, AlertCircle, LoaderCircle } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import DoctorFormModal from "@/components/doctors/DoctorFormModal";
import DoctorPatientsModal from "@/components/doctors/DoctorPatientsModal";
import DoctorTable from "@/components/doctors/DoctorTable";
import DoctorStats from "@/components/doctors/DoctorStats";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorPagination from "@/components/doctors/DoctorPagination";
import { useHealthcare } from "@/context/HealthcareContext";
import { confirmAction, showSuccess, showError } from "@/lib/sweetAlert";

const PAGE_SIZE = 5;

const isActiveDoctor = (doctor) =>
  String(doctor?.status ?? "active").toLowerCase() !== "inactive";

const toDateKey = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ""
      : value.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();
  const datePart = raw.match(/^\d{4}-\d{2}-\d{2}/);

  if (datePart) return datePart[0];

  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
};

export default function DoctorsPage() {
  const {
    doctors = [],
    addDoctor,
    deleteDoctor,
    addPatient,
    deletePatient,
    refreshDoctors,
    loading,
    isMutating,
    error,
    clearError,
  } = useHealthcare();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSavingDoctor, setIsSavingDoctor] = useState(false);
  const [deletingDoctorId, setDeletingDoctorId] = useState(null);

  const activeDoctors = useMemo(
    () => doctors.filter(isActiveDoctor),
    [doctors]
  );

  const specializations = useMemo(
    () =>
      [
        ...new Set(
          activeDoctors
            .map((doctor) => doctor.specialization?.trim())
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [activeDoctors]
  );

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return activeDoctors.filter((doctor) => {
      const searchableFields = [
        doctor.name,
        doctor.specialization,
        doctor.hospital,
        doctor.email,
        doctor.phone,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesSpecialization =
        specialization === "all" ||
        doctor.specialization?.trim() === specialization;

      const createdAt = toDateKey(doctor.createdAt);
      const matchesFromDate = !fromDate || createdAt >= fromDate;
      const matchesToDate = !toDate || createdAt <= toDate;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [activeDoctors, searchTerm, specialization, fromDate, toDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) setCurrentPage(safePage);
  }, [currentPage, safePage]);

  const paginatedDoctors = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredDoctors.slice(start, start + PAGE_SIZE);
  }, [filteredDoctors, safePage]);

  const showingStart = filteredDoctors.length
    ? (safePage - 1) * PAGE_SIZE + 1
    : 0;

  const showingEnd = Math.min(
    safePage * PAGE_SIZE,
    filteredDoctors.length
  );

  const totalPatients = useMemo(
    () =>
      activeDoctors.reduce(
        (total, doctor) =>
          total +
          (Array.isArray(doctor.patients) ? doctor.patients.length : 0),
        0
      ),
    [activeDoctors]
  );

  const selectedDoctor =
    activeDoctors.find((doctor) => doctor.id === selectedDoctorId) ?? null;

  const handleAddDoctor = async (formData) => {
    if (isSavingDoctor || isMutating) return false;

    try {
      const confirmation = await confirmAction({
        title: "Add New Doctor?",
        text: `Are you sure you want to add ${formData.name}?`,
        icon: "question",
        confirmText: "Yes, Add Doctor",
        cancelText: "Cancel",
      });

      if (!confirmation?.isConfirmed) return false;

      setIsSavingDoctor(true);
      clearError?.();

      const payload = {
        name: formData.name.trim(),
        specialization: formData.specialization.trim(),
        hospital: formData.hospital.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      const newDoctor = await addDoctor(payload);

      if (!newDoctor?.id) {
        throw new Error("The server did not return a valid doctor record.");
      }

      setCurrentPage(1);
      setShowAddModal(false);

      await showSuccess(
        "Doctor Added Successfully!",
        `${newDoctor.name} has been added to the doctor directory.`
      );

      return true;
    } catch (err) {
      console.error("Create doctor failed:", err);

      await showError(
        "Failed to Add Doctor",
        err.message || "Unable to save the doctor."
      );

      return false;
    } finally {
      setIsSavingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (deletingDoctorId !== null || isMutating) return;

    const doctor = activeDoctors.find((item) => item.id === doctorId);
    if (!doctor) return;

    const patientCount = Array.isArray(doctor.patients)
      ? doctor.patients.length
      : 0;

    try {
      const confirmation = await confirmAction({
        title: "Deactivate Doctor?",
        text:
          patientCount > 0
            ? `${doctor.name} has ${patientCount} assigned patient(s). The doctor's record and patient data will be preserved, but the doctor will be removed from the active directory. Continue?`
            : `Are you sure you want to deactivate ${doctor.name}?`,
        icon: "warning",
        confirmText: "Yes, Deactivate",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!confirmation?.isConfirmed) return;

      setDeletingDoctorId(doctorId);
      clearError?.();

      await deleteDoctor(doctorId);

      if (selectedDoctorId === doctorId) {
        setSelectedDoctorId(null);
      }

      await showSuccess(
        "Doctor Deactivated!",
        `${doctor.name} has been removed from the active directory.`
      );
    } catch (err) {
      console.error("Deactivate doctor failed:", err);

      await showError(
        "Failed to Deactivate Doctor",
        err.message || "Please try again."
      );
    } finally {
      setDeletingDoctorId(null);
    }
  };

  const handleAddPatient = async (doctorId, patientData) => {
    const savedPatient = await addPatient(doctorId, {
      name: String(patientData.name ?? "").trim(),
      age: Number(patientData.age),
      condition: String(patientData.condition ?? "").trim(),
    });

    if (!savedPatient?.id) {
      throw new Error("The patient could not be saved to the database.");
    }

    return savedPatient;
  };

  const handleDeletePatient = async (doctorId, patientId) => {
    const result = await deletePatient(doctorId, patientId);

    if (!result) {
      throw new Error("The patient could not be deleted.");
    }

    return true;
  };

  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSpecialization("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    specialization !== "all" ||
    fromDate ||
    toDate
  );

  const handleRefresh = async () => {
    try {
      clearError?.();
      await refreshDoctors();
    } catch (err) {
      console.error("Refresh doctors failed:", err);

      await showError(
        "Unable to Refresh",
        err.message || "Failed to fetch doctor records."
      );
    }
  };

  return (
    <AdminLayout
      title="Doctors"
      description="Manage doctor profiles and their assigned patients."
    >
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#167d73]">
            Doctor Directory
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#102a43]">
            All Doctors
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            View and manage your registered medical professionals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || isMutating}
            aria-label="Refresh doctors"
            title="Refresh doctors"
            className="btn btn-square h-11 min-h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={loading || isMutating || isSavingDoctor}
            className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-5 text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 hover:bg-[#12675f] disabled:opacity-60"
          >
            <UserPlus size={18} />
            Add New Doctor
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold text-red-700">
                Unable to complete the request
              </p>
              <p className="mt-1 text-xs text-red-600">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={clearError}
            className="text-xs font-semibold text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <DoctorStats
        totalDoctors={activeDoctors.length}
        totalPatients={totalPatients}
        totalSpecializations={specializations.length}
      />

      <DoctorFilters
        searchTerm={searchTerm}
        specialization={specialization}
        specializations={specializations}
        fromDate={fromDate}
        toDate={toDate}
        resultCount={filteredDoctors.length}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={updateFilter(setSearchTerm)}
        onSpecializationChange={updateFilter(setSpecialization)}
        onFromDateChange={updateFilter(setFromDate)}
        onToDateChange={updateFilter(setToDate)}
        onReset={handleResetFilters}
      />

      {loading && doctors.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <LoaderCircle
            size={34}
            className="animate-spin text-[#167d73]"
          />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Loading doctors...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Retrieving records from the database.
          </p>
        </div>
      ) : (
        <>
          <DoctorTable
            doctors={paginatedDoctors}
            onViewPatients={setSelectedDoctorId}
            onDeleteDoctor={handleDeleteDoctor}
            deletingDoctorId={deletingDoctorId}
          />

          <DoctorPagination
            currentPage={safePage}
            totalPages={totalPages}
            showingStart={showingStart}
            showingEnd={showingEnd}
            totalItems={filteredDoctors.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showAddModal && (
        <DoctorFormModal
          onClose={() => {
            if (!isSavingDoctor) setShowAddModal(false);
          }}
          onSubmit={handleAddDoctor}
        />
      )}

      {selectedDoctor && (
        <DoctorPatientsModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctorId(null)}
          onAddPatient={handleAddPatient}
          onDeletePatient={handleDeletePatient}
        />
      )}
    </AdminLayout>
  );
}
