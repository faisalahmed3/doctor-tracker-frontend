
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { initialDoctors } from "@/data/doctorsData";

const HealthcareContext = createContext(null);

export function HealthcareProvider({ children }) {
  const [doctors, setDoctors] = useState(initialDoctors);

  // Flatten all patients for global access
  const patients = useMemo(
    () =>
      doctors.flatMap((doctor) =>
        (doctor.patients || []).map((patient) => ({
          ...patient,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
        }))
      ),
    [doctors]
  );

  // Add doctor
  const addDoctor = (doctor) => {
    setDoctors((prev) => [doctor, ...prev]);
  };

  // Add patient
  const addPatient = (doctorId, patient) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              patients: [
                ...(doctor.patients || []),
                patient,
              ],
            }
          : doctor
      )
    );
  };

  // Update patient, including doctor assignment
  const updatePatient = (
    oldDoctorId,
    patientId,
    newDoctorId,
    updates
  ) => {
    setDoctors((prev) =>
      prev.map((doctor) => {
        const existing = (doctor.patients || []).find(
          (patient) => patient.id === patientId
        );

        const remaining = (doctor.patients || []).filter(
          (patient) => patient.id !== patientId
        );

        if (doctor.id === newDoctorId) {
          return {
            ...doctor,
            patients: [
              ...remaining,
              {
                ...existing,
                ...updates,
                id: patientId,
              },
            ],
          };
        }

        if (doctor.id === oldDoctorId) {
          return {
            ...doctor,
            patients: remaining,
          };
        }

        return doctor;
      })
    );
  };

  // Delete patient
  const deletePatient = (doctorId, patientId) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              patients: (doctor.patients || []).filter(
                (patient) => patient.id !== patientId
              ),
            }
          : doctor
      )
    );
  };

  const value = useMemo(
    () => ({
      doctors,
      patients,
      addDoctor,
      addPatient,
      updatePatient,
      deletePatient,
    }),
    [doctors, patients]
  );

  return (
    <HealthcareContext.Provider value={value}>
      {children}
    </HealthcareContext.Provider>
  );
}

export function useHealthcare() {
  const context = useContext(HealthcareContext);

  if (!context) {
    throw new Error(
      "useHealthcare must be used inside HealthcareProvider"
    );
  }

  return context;
}
