
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import PatientFormModal from "@/components/patients/PatientFormModal";
import PatientTable from "@/components/patients/PatientTable";
import PatientStats from "@/components/patients/PatientStats";
import PatientFilters from "@/components/patients/PatientFilters";
import DoctorPagination from "@/components/doctors/DoctorPagination";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  confirmAction,
  showSuccess,
  showError,
} from "@/lib/sweetAlert";

const PAGE_SIZE = 5;

const isActiveDoctor = (doctor) =>
  String(doctor?.status ?? "active").toLowerCase() !== "inactive";

const getErrorMessage = (error) => {
  if (Array.isArray(error?.errors) && error.errors.length) {
    return error.errors
      .map((item) => item?.message)
      .filter(Boolean)
      .join(", ");
  }

  return error?.message || "Something went wrong. Please try again.";
};

const toDateKey = (value) => {
  if (!value) return "";

  const raw = value instanceof Date
    ? value.toISOString()
    : String(value).trim();

  const match = raw.match(/^\d{4}-\d{2}-\d{2}/);

  if (match) return match[0];

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
};

export default function PatientsPage() {
  const {
    doctors = [],
    patients = [],
    addPatient,
    updatePatient,
    deletePatient,
    loading,
    isMutating,
    error,
    clearError,
    refreshDoctors,
  } = useHealthcare();

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isBusy = isSaving || isMutating || deletingPatientId !== null;

  const activeDoctors = useMemo(
    () => doctors.filter(isActiveDoctor),
    [doctors]
  );

  const formDoctors = useMemo(() => {
    if (!selectedPatient) return activeDoctors;

    const currentDoctor = doctors.find(
      (doctor) =>
        String(doctor.id) === String(selectedPatient.doctorId)
    );

    if (!currentDoctor || isActiveDoctor(currentDoctor)) {
      return activeDoctors;
    }

    return [currentDoctor, ...activeDoctors];
  }, [doctors, activeDoctors, selectedPatient]);

  const conditions = useMemo(
    () =>
      [
        ...new Set(
          patients
            .map((patient) => patient.condition?.trim())
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [patients]
  );

  const assignedDoctors = useMemo(
    () =>
      new Set(
        patients
          .map((patient) => patient.doctorId)
          .filter(Boolean)
          .map(String)
      ).size,
    [patients]
  );

  const filteredPatients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return patients.filter((patient) => {
      const searchableFields = [
        patient.id,
        patient.name,
        patient.condition,
        patient.doctorName,
        patient.specialization,
        patient.hospital,
      ];

      const matchesSearch =
        !query ||
        searchableFields.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesDoctor =
        doctorFilter === "all" ||
        String(patient.doctorId) === doctorFilter;

      const matchesCondition =
        conditionFilter === "all" ||
        patient.condition?.trim() === conditionFilter;

      const registeredAt = toDateKey(patient.registeredAt);

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesCondition &&
        (!fromDate || registeredAt >= fromDate) &&
        (!toDate || registeredAt <= toDate)
      );
    });
  }, [
    patients,
    searchTerm,
    doctorFilter,
    conditionFilter,
    fromDate,
    toDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const paginatedPatients = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredPatients.slice(start, start + PAGE_SIZE);
  }, [filteredPatients, safePage]);

  const showingStart = filteredPatients.length
    ? (safePage - 1) * PAGE_SIZE + 1
    : 0;

  const showingEnd = Math.min(
    safePage * PAGE_SIZE,
    filteredPatients.length
  );

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    doctorFilter !== "all" ||
    conditionFilter !== "all" ||
    fromDate ||
    toDate
  );

  const handleOpenAdd = () => {
    if (isBusy || activeDoctors.length === 0) return;

    setSelectedPatient(null);
    setShowFormModal(true);
  };

  const handleEditPatient = (patient) => {
    if (isBusy || !patient) return;

    setSelectedPatient(patient);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    if (isBusy) return;

    setShowFormModal(false);
    setSelectedPatient(null);
  };

  const handleSavePatient = async (formData) => {
    if (isBusy) return false;

    const isEditing = Boolean(selectedPatient);

    const name = String(formData.name ?? "").trim();
    const ageRaw = String(formData.age ?? "").trim();
    const age = Number(ageRaw);
    const condition = String(formData.condition ?? "").trim();
    const doctorId = String(formData.doctorId ?? "").trim();

    if (
      name.length < 2 ||
      name.length > 80 ||
      !ageRaw ||
      !Number.isInteger(age) ||
      age < 0 ||
      age > 130 ||
      condition.length < 2 ||
      condition.length > 200
    ) {
      await showError(
        "Invalid Patient Information",
        "Please provide a valid name, age and medical condition."
      );
      return false;
    }

    const selectedDoctor = formDoctors.find(
      (doctor) => String(doctor.id) === doctorId
    );

    if (!selectedDoctor) {
      await showError(
        "Invalid Doctor",
        "Please select a valid doctor."
      );
      return false;
    }

    const isCurrentDoctor =
      isEditing &&
      String(selectedPatient.doctorId) === doctorId;

    if (!isActiveDoctor(selectedDoctor) && !isCurrentDoctor) {
      await showError(
        "Doctor Inactive",
        "New patient assignments require an active doctor."
      );
      return false;
    }

    const payload = { name, age, condition };

    setIsSaving(true);

    try {
      const confirmation = await confirmAction({
        title: isEditing ? "Update Patient?" : "Add New Patient?",
        text: isEditing
          ? `Are you sure you want to update ${name}'s information?`
          : `Are you sure you want to register ${name} under ${selectedDoctor.name}?`,
        icon: "question",
        confirmText: isEditing ? "Yes, Update" : "Yes, Add Patient",
        cancelText: "Cancel",
      });

      if (!confirmation?.isConfirmed) return false;

      clearError?.();

      if (isEditing) {
        const updatedPatient = await updatePatient(
          selectedPatient.doctorId,
          selectedPatient.id,
          doctorId,
          payload
        );

        if (!updatedPatient?.id) {
          throw new Error("The server did not return an updated patient.");
        }

        setShowFormModal(false);
        setSelectedPatient(null);

        await showSuccess(
          "Patient Updated Successfully!",
          `${name}'s information has been updated.`
        );

        return true;
      }

      const savedPatient = await addPatient(doctorId, payload);

      if (!savedPatient?.id) {
        throw new Error("The server did not return a saved patient.");
      }

      setCurrentPage(1);
      setShowFormModal(false);
      setSelectedPatient(null);

      await showSuccess(
        "Patient Added Successfully!",
        `${savedPatient.name} has been registered successfully.`
      );

      return true;
    } catch (err) {
      console.error("Patient save error:", err);

      await showError(
        isEditing ? "Failed to Update Patient" : "Failed to Add Patient",
        getErrorMessage(err)
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePatient = async (patient) => {
    if (isBusy || !patient?.id || !patient?.doctorId) return false;

    setDeletingPatientId(patient.id);

    try {
      const confirmation = await confirmAction({
        title: "Delete Patient?",
        text: `Are you sure you want to permanently delete ${patient.name}'s record? This action cannot be undone.`,
        icon: "warning",
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!confirmation?.isConfirmed) return false;

      clearError?.();

      const success = await deletePatient(
        patient.doctorId,
        patient.id
      );

      if (!success) {
        throw new Error("Patient deletion was not confirmed.");
      }

      await showSuccess(
        "Patient Deleted Successfully!",
        `${patient.name}'s record has been removed.`
      );

      return true;
    } catch (err) {
      console.error("Patient deletion error:", err);

      await showError(
        "Failed to Delete Patient",
        getErrorMessage(err)
      );

      return false;
    } finally {
      setDeletingPatientId(null);
    }
  };

  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDoctorFilter("all");
    setConditionFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    if (loading || isBusy) return;

    try {
      clearError?.();
      await refreshDoctors();
    } catch (err) {
      console.error("Patient refresh error:", err);

      await showError(
        "Unable to Refresh Patients",
        getErrorMessage(err)
      );
    }
  };

  return (
    <AdminLayout
      title="Patients"
      description="Manage patient records and doctor assignments."
    >
      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#167d73]">
            Patient Directory
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#102a43]">
            All Patients
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            View, register and manage patient information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || isBusy}
            aria-label="Refresh patients"
            title="Refresh patients"
            className="btn btn-square h-11 min-h-11 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={loading || isBusy || activeDoctors.length === 0}
            className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-5 text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 hover:bg-[#12675f] disabled:opacity-50"
          >
            <UserPlus size={18} />
            Add New Patient
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

      {!loading && activeDoctors.length === 0 && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-800">
            You need an active doctor before registering new patients.
          </p>

          <Link
            href="/doctors"
            className="text-sm font-semibold text-[#167d73] hover:underline"
          >
            Go to Doctors →
          </Link>
        </div>
      )}

      <PatientStats
        totalPatients={patients.length}
        assignedDoctors={assignedDoctors}
        totalConditions={conditions.length}
      />

      <PatientFilters
        searchTerm={searchTerm}
        doctorFilter={doctorFilter}
        conditionFilter={conditionFilter}
        doctors={doctors}
        conditions={conditions}
        fromDate={fromDate}
        toDate={toDate}
        resultCount={filteredPatients.length}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={updateFilter(setSearchTerm)}
        onDoctorChange={updateFilter(setDoctorFilter)}
        onConditionChange={updateFilter(setConditionFilter)}
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
            Loading patients...
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Retrieving patient records from the database.
          </p>
        </div>
      ) : (
        <>
          <PatientTable
            patients={paginatedPatients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            isBusy={isBusy}
            deletingPatientId={deletingPatientId}
          />

          <DoctorPagination
            currentPage={safePage}
            totalPages={totalPages}
            showingStart={showingStart}
            showingEnd={showingEnd}
            totalItems={filteredPatients.length}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showFormModal && (
        <PatientFormModal
          key={selectedPatient?.id || "new-patient"}
          patient={selectedPatient}
          doctors={formDoctors}
          onClose={handleCloseModal}
          onSubmit={handleSavePatient}
          isSubmitting={isSaving || isMutating}
        />
      )}
    </AdminLayout>
  );
}
