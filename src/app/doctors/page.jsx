
"use client";

import { useEffect, useMemo, useState } from "react";
import { UserPlus } from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import DoctorFormModal from "@/components/doctors/DoctorFormModal";
import DoctorPatientsModal from "@/components/doctors/DoctorPatientsModal";
import DoctorTable from "@/components/doctors/DoctorTable";
import DoctorStats from "@/components/doctors/DoctorStats";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorPagination from "@/components/doctors/DoctorPagination";

import { useHealthcare } from "@/context/HealthcareContext";

import {
  confirmAction,
  showSuccess,
  showError,
} from "@/lib/sweetAlert";

const PAGE_SIZE = 5;

export default function DoctorsPage() {
  // Global healthcare state
  const {
    doctors = [],
    addDoctor,
    addPatient,
    deletePatient,
    deleteDoctor,
  } = useHealthcare();

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Available specializations
  const specializations = useMemo(
    () =>
      [
        ...new Set(
          doctors
            .map((doctor) => doctor.specialization?.trim())
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [doctors]
  );

  // Search and filter doctors
  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
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

      const registrationDate = String(
        doctor.createdAt ?? ""
      ).slice(0, 10);

      const matchesFromDate =
        !fromDate || registrationDate >= fromDate;

      const matchesToDate =
        !toDate || registrationDate <= toDate;

      return (
        matchesSearch &&
        matchesSpecialization &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [
    doctors,
    searchTerm,
    specialization,
    fromDate,
    toDate,
  ]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDoctors.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const paginatedDoctors = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;

    return filteredDoctors.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredDoctors, safePage]);

  const showingStart = filteredDoctors.length
    ? (safePage - 1) * PAGE_SIZE + 1
    : 0;

  const showingEnd = Math.min(
    safePage * PAGE_SIZE,
    filteredDoctors.length
  );

  // Dashboard statistics
  const totalPatients = useMemo(
    () =>
      doctors.reduce(
        (total, doctor) =>
          total +
          (Array.isArray(doctor.patients)
            ? doctor.patients.length
            : 0),
        0
      ),
    [doctors]
  );

  // Selected doctor
  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === selectedDoctorId
  );

  // Add doctor
  const handleAddDoctor = async (formData) => {
    try {
      const confirmation = await confirmAction({
        title: "Add New Doctor?",
        text: `Are you sure you want to add ${formData.name}?`,
        icon: "question",
        confirmText: "Yes, Add Doctor",
        cancelText: "Cancel",
      });

      if (!confirmation.isConfirmed) return;

      const newDoctor = {
        ...formData,
        id: `DOC-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        patients: [],
      };

      // Update global context
      addDoctor(newDoctor);

      setCurrentPage(1);
      setShowAddModal(false);

      await showSuccess(
        "Doctor Added Successfully!",
        `${formData.name} has been added to the doctor directory.`
      );
    } catch (error) {
      console.error("Add doctor error:", error);

      await showError(
        "Failed to Add Doctor",
        "Something went wrong. Please try again."
      );
    }
  };

  // Delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    const doctor = doctors.find(
      (item) => item.id === doctorId
    );

    if (!doctor) return;

    try {
      const patientCount = doctor.patients?.length || 0;

      const confirmation = await confirmAction({
        title: "Delete Doctor?",
        text: patientCount > 0
          ? `${doctor.name} has ${patientCount} assigned patients. Deleting this doctor will also remove their patient records from the current demo data.`
          : `Are you sure you want to delete ${doctor.name}?`,
        icon: "warning",
        confirmText: "Yes, Delete",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!confirmation.isConfirmed) return;

      // Update global context
      deleteDoctor(doctorId);

      if (selectedDoctorId === doctorId) {
        setSelectedDoctorId(null);
      }

      await showSuccess(
        "Doctor Deleted!",
        `${doctor.name} has been removed from the doctor directory.`
      );
    } catch (error) {
      console.error("Delete doctor error:", error);

      await showError(
        "Failed to Delete Doctor",
        "Something went wrong. Please try again."
      );
    }
  };

  // Add patient
  const handleAddPatient = (doctorId, patient) => {
    addPatient(doctorId, patient);
  };

  // Delete patient
  const handleDeletePatient = (doctorId, patientId) => {
    deletePatient(doctorId, patientId);
  };

  // Update filters
  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  // Reset filters
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

  return (
    <AdminLayout
      title="Doctors"
      description="Manage doctor profiles and their assigned patients."
    >
      {/* Page Header */}
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

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-5 text-sm font-semibold text-white shadow-lg shadow-[#167d73]/20 hover:bg-[#12675f]"
        >
          <UserPlus size={18} />
          Add New Doctor
        </button>
      </section>

      {/* Statistics */}
      <DoctorStats
        totalDoctors={doctors.length}
        totalPatients={totalPatients}
        totalSpecializations={specializations.length}
      />

      {/* Search and Filters */}
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

      {/* Doctor Table */}
      <DoctorTable
        doctors={paginatedDoctors}
        onViewPatients={setSelectedDoctorId}
        onDeleteDoctor={handleDeleteDoctor}
      />

      {/* Pagination */}
      <DoctorPagination
        currentPage={safePage}
        totalPages={totalPages}
        showingStart={showingStart}
        showingEnd={showingEnd}
        totalItems={filteredDoctors.length}
        onPageChange={setCurrentPage}
      />

      {/* Add Doctor Modal */}
      {showAddModal && (
        <DoctorFormModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDoctor}
        />
      )}

      {/* Doctor Patients Modal */}
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
