"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";

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

export default function PatientsPage() {
  // Global healthcare data
  const {
    doctors = [],
    patients = [],
    addPatient,
    updatePatient,
    deletePatient,
  } = useHealthcare();

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Available medical conditions
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

  // Statistics
  const assignedDoctors = useMemo(
    () =>
      new Set(
        patients.map((patient) => patient.doctorId)
      ).size,
    [patients]
  );

  const totalConditions = conditions.length;

  // Search and filter
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
        patient.doctorId === doctorFilter;

      const matchesCondition =
        conditionFilter === "all" ||
        patient.condition?.trim() === conditionFilter;

      const registrationDate = String(
        patient.registeredAt ?? ""
      ).slice(0, 10);

      const matchesFromDate =
        !fromDate || registrationDate >= fromDate;

      const matchesToDate =
        !toDate || registrationDate <= toDate;

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesCondition &&
        matchesFromDate &&
        matchesToDate
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

  // Pagination
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

    return filteredPatients.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredPatients, safePage]);

  const showingStart = filteredPatients.length
    ? (safePage - 1) * PAGE_SIZE + 1
    : 0;

  const showingEnd = Math.min(
    safePage * PAGE_SIZE,
    filteredPatients.length
  );

  // Active filters
  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    doctorFilter !== "all" ||
    conditionFilter !== "all" ||
    fromDate ||
    toDate
  );

  // Open Add Modal
  const handleOpenAdd = () => {
    setSelectedPatient(null);
    setShowFormModal(true);
  };

  // Open Edit Modal
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowFormModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedPatient(null);
  };

  // Add or Update Patient
  const handleSavePatient = async (formData) => {
    const isEditing = Boolean(selectedPatient);

    try {
      if (isEditing) {
        // Edit confirmation
        const confirmation = await confirmAction({
          title: "Update Patient?",
          text: `Are you sure you want to update ${formData.name}'s information?`,
          icon: "question",
          confirmText: "Yes, Update",
          cancelText: "Cancel",
        });

        if (!confirmation.isConfirmed) return;

        updatePatient(
          selectedPatient.doctorId,
          selectedPatient.id,
          formData.doctorId,
          {
            name: formData.name,
            age: formData.age,
            condition: formData.condition,
          }
        );

        handleCloseModal();

        await showSuccess(
          "Patient Updated Successfully!",
          `${formData.name}'s information has been updated.`
        );
      } else {
        // Add confirmation
        const confirmation = await confirmAction({
          title: "Add New Patient?",
          text: `Are you sure you want to register ${formData.name}?`,
          icon: "question",
          confirmText: "Yes, Add Patient",
          cancelText: "Cancel",
        });

        if (!confirmation.isConfirmed) return;

        const newPatient = {
          id: `PAT-${Date.now()}`,
          name: formData.name,
          age: formData.age,
          condition: formData.condition,
          registeredAt: new Date().toISOString().slice(0, 10),
        };

        addPatient(formData.doctorId, newPatient);

        setCurrentPage(1);
        handleCloseModal();

        await showSuccess(
          "Patient Added Successfully!",
          `${formData.name} has been added to the patient directory.`
        );
      }
    } catch (error) {
      console.error("Patient save error:", error);

      await showError(
        isEditing
          ? "Failed to Update Patient"
          : "Failed to Add Patient",
        "Something went wrong. Please try again."
      );
    }
  };

  // Delete Patient
  const handleDeletePatient = async (patient) => {
    try {
      const confirmation = await confirmAction({
        title: "Delete Patient?",
        text: `Are you sure you want to delete ${patient.name}'s record? This action cannot be undone.`,
        icon: "warning",
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!confirmation.isConfirmed) return;

      deletePatient(patient.doctorId, patient.id);

      await showSuccess(
        "Patient Deleted Successfully!",
        `${patient.name}'s record has been removed.`
      );
    } catch (error) {
      console.error("Patient deletion error:", error);

      await showError(
        "Failed to Delete Patient",
        "Something went wrong. Please try again."
      );
    }
  };

  // Filter update helper
  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDoctorFilter("all");
    setConditionFilter("all");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  return (
    <AdminLayout
      title="Patients"
      description="Manage patient records and doctor assignments."
    >
      {/* Page Header */}
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

        <button
          type="button"
          onClick={handleOpenAdd}
          disabled={doctors.length === 0}
          className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-5 text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 hover:bg-[#12675f] disabled:opacity-50"
        >
          <UserPlus size={18} />
          Add New Patient
        </button>
      </section>

      {/* No Doctors Warning */}
      {doctors.length === 0 && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-800">
            You need to register a doctor before adding patients.
          </p>

          <Link
            href="/doctors"
            className="text-sm font-semibold text-[#167d73] hover:underline"
          >
            Go to Doctors →
          </Link>
        </div>
      )}

      {/* Statistics */}
      <PatientStats
        totalPatients={patients.length}
        assignedDoctors={assignedDoctors}
        totalConditions={totalConditions}
      />

      {/* Filters */}
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

      {/* Patient Table */}
      <PatientTable
        patients={paginatedPatients}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />

      {/* Pagination */}
      <DoctorPagination
        currentPage={safePage}
        totalPages={totalPages}
        showingStart={showingStart}
        showingEnd={showingEnd}
        totalItems={filteredPatients.length}
        onPageChange={setCurrentPage}
      />

      {/* Add / Edit Patient Modal */}
      {showFormModal && (
        <PatientFormModal
          key={selectedPatient?.id || "new-patient"}
          patient={selectedPatient}
          doctors={doctors}
          onClose={handleCloseModal}
          onSubmit={handleSavePatient}
        />
      )}
    </AdminLayout>
  );
}
