
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { initialDoctors } from "@/data/doctorsData";

const HealthcareContext = createContext(null);

// Normalize initial data
const normalizeDoctors = (data) =>
  Array.isArray(data)
    ? data.map((doctor) => ({
        ...doctor,
        patients: Array.isArray(doctor.patients)
          ? doctor.patients
          : [],
      }))
    : [];

export function HealthcareProvider({ children }) {
  const [doctors, setDoctors] = useState(() =>
    normalizeDoctors(initialDoctors)
  );

  // ==========================================
  // DERIVED PATIENT DATA
  // ==========================================

  const patients = useMemo(
    () =>
      doctors.flatMap((doctor) =>
        doctor.patients.map((patient) => ({
          ...patient,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialization: doctor.specialization,
          hospital: doctor.hospital,
        }))
      ),
    [doctors]
  );

  // ==========================================
  // DOCTOR OPERATIONS
  // ==========================================

  // Add doctor
  const addDoctor = useCallback((doctor) => {
    if (!doctor?.id) return false;

    setDoctors((previous) => {
      const exists = previous.some(
        (item) => item.id === doctor.id
      );

      if (exists) return previous;

      return [
        {
          ...doctor,
          patients: Array.isArray(doctor.patients)
            ? doctor.patients
            : [],
        },
        ...previous,
      ];
    });

    return true;
  }, []);

  // Update doctor
  const updateDoctor = useCallback((doctorId, updates) => {
    setDoctors((previous) =>
      previous.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              ...updates,
              id: doctor.id,
              patients: doctor.patients,
            }
          : doctor
      )
    );
  }, []);

  // Delete doctor
  const deleteDoctor = useCallback((doctorId) => {
    setDoctors((previous) =>
      previous.filter(
        (doctor) => doctor.id !== doctorId
      )
    );
  }, []);

  // ==========================================
  // PATIENT OPERATIONS
  // ==========================================

  // Add patient to a doctor
  const addPatient = useCallback((doctorId, patient) => {
    if (!patient?.id) return;

    setDoctors((previous) => {
      const doctorExists = previous.some(
        (doctor) => doctor.id === doctorId
      );

      const patientExists = previous.some((doctor) =>
        doctor.patients.some(
          (item) => item.id === patient.id
        )
      );

      if (!doctorExists || patientExists) {
        return previous;
      }

      return previous.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              patients: [
                ...doctor.patients,
                patient,
              ],
            }
          : doctor
      );
    });
  }, []);

  // Update patient and transfer between doctors
  const updatePatient = useCallback(
    (oldDoctorId, patientId, newDoctorId, updates) => {
      setDoctors((previous) => {
        const oldDoctor = previous.find(
          (doctor) => doctor.id === oldDoctorId
        );

        const newDoctor = previous.find(
          (doctor) => doctor.id === newDoctorId
        );

        if (!oldDoctor || !newDoctor) {
          return previous;
        }

        const existingPatient = oldDoctor.patients.find(
          (patient) => patient.id === patientId
        );

        if (!existingPatient) {
          return previous;
        }

        const updatedPatient = {
          ...existingPatient,
          ...updates,
          id: patientId,
        };

        // Same doctor: update patient details
        if (oldDoctorId === newDoctorId) {
          return previous.map((doctor) =>
            doctor.id === oldDoctorId
              ? {
                  ...doctor,
                  patients: doctor.patients.map(
                    (patient) =>
                      patient.id === patientId
                        ? updatedPatient
                        : patient
                  ),
                }
              : doctor
          );
        }

        // Different doctor: transfer patient
        return previous.map((doctor) => {
          if (doctor.id === oldDoctorId) {
            return {
              ...doctor,
              patients: doctor.patients.filter(
                (patient) => patient.id !== patientId
              ),
            };
          }

          if (doctor.id === newDoctorId) {
            return {
              ...doctor,
              patients: [
                ...doctor.patients,
                updatedPatient,
              ],
            };
          }

          return doctor;
        });
      });
    },
    []
  );

  // Delete patient
  const deletePatient = useCallback(
    (doctorId, patientId) => {
      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor.id === doctorId
            ? {
                ...doctor,
                patients: doctor.patients.filter(
                  (patient) => patient.id !== patientId
                ),
              }
            : doctor
        )
      );
    },
    []
  );

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = useMemo(
    () => ({
      // Data
      doctors,
      patients,

      // Doctor methods
      addDoctor,
      updateDoctor,
      deleteDoctor,

      // Patient methods
      addPatient,
      updatePatient,
      deletePatient,
    }),
    [
      doctors,
      patients,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      addPatient,
      updatePatient,
      deletePatient,
    ]
  );

  return (
    <HealthcareContext.Provider value={value}>
      {children}
    </HealthcareContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useHealthcare() {
  const context = useContext(HealthcareContext);

  if (!context) {
    throw new Error(
      "useHealthcare must be used inside HealthcareProvider."
    );
  }

  return context;
}
