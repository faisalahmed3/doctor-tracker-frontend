
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import {
  doctorApi,
  normalizeDoctor,
  normalizePatient,
} from "@/services/doctorApi";
import { patientApi } from "@/services/patientApi";

const HealthcareContext = createContext(null);

const preparePatientUpdates = (data = {}) =>
  Object.fromEntries(
    ["name", "age", "condition"]
      .filter((key) => data[key] !== undefined)
      .map((key) => [
        key,
        typeof data[key] === "string"
          ? data[key].trim()
          : data[key],
      ])
  );

export function HealthcareProvider({ children }) {
  const { status } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingMutations, setPendingMutations] = useState(0);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const requestVersion = useRef(0);
  const isMutating = pendingMutations > 0;

  const fetchDoctors = useCallback(async () => {
    const version = ++requestVersion.current;

    setLoading(true);
    setError(null);

    try {
      const allDoctors = [];
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await doctorApi.getAll({
          page,
          limit: 100,
        });

        const batch = Array.isArray(response?.data)
          ? response.data
          : [];

        allDoctors.push(
          ...batch.map(normalizeDoctor).filter(Boolean)
        );

        hasNextPage =
          batch.length > 0 &&
          response?.pagination?.hasNextPage === true;

        page += 1;
      }

      if (version === requestVersion.current) {
        setDoctors(allDoctors);
        setPagination({
          totalDoctors: allDoctors.length,
        });
      }

      return allDoctors;
    } catch (err) {
      if (version === requestVersion.current) {
        setError(err.message || "Failed to retrieve doctors.");
      }

      throw err;
    } finally {
      if (version === requestVersion.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      requestVersion.current += 1;

      setDoctors([]);
      setPagination(null);
      setError(null);
      setLoading(status === "loading");

      return undefined;
    }

    fetchDoctors().catch((err) => {
      console.error("Healthcare data loading failed:", err);
    });

    return () => {
      requestVersion.current += 1;
    };
  }, [status, fetchDoctors]);

  const runMutation = useCallback(async (operation) => {
    setPendingMutations((count) => count + 1);

    try {
      return await operation();
    } finally {
      setPendingMutations((count) =>
        Math.max(0, count - 1)
      );
    }
  }, []);

  const addDoctor = useCallback(
    (doctorData) =>
      runMutation(async () => {
        const response = await doctorApi.create(doctorData);
        const newDoctor = normalizeDoctor(response?.data);

        if (!newDoctor?.id) {
          throw new Error("Invalid doctor response from the server.");
        }

        setDoctors((previous) => [
          newDoctor,
          ...previous.filter(
            (doctor) => doctor.id !== newDoctor.id
          ),
        ]);

        return newDoctor;
      }),
    [runMutation]
  );

  const getDoctorById = useCallback(async (doctorId) => {
    const response = await doctorApi.getById(doctorId);

    return normalizeDoctor(response?.data);
  }, []);

  const updateDoctor = useCallback(
    (doctorId, updates) =>
      runMutation(async () => {
        const response = await doctorApi.update(
          doctorId,
          updates
        );

        const updatedDoctor = normalizeDoctor(response?.data);

        if (!updatedDoctor?.id) {
          throw new Error(
            "The server did not return the updated doctor."
          );
        }

        setDoctors((previous) =>
          previous.map((doctor) =>
            doctor.id === String(doctorId)
              ? updatedDoctor
              : doctor
          )
        );

        return updatedDoctor;
      }),
    [runMutation]
  );

  const deleteDoctor = useCallback(
    (doctorId) =>
      runMutation(async () => {
        const response = await doctorApi.deactivate(doctorId);
        const updatedDoctor = normalizeDoctor(response?.data);
        const id = String(doctorId);

        setDoctors((previous) =>
          previous.map((doctor) => {
            if (doctor.id !== id) return doctor;

            return updatedDoctor?.id
              ? updatedDoctor
              : { ...doctor, status: "Inactive" };
          })
        );

        return updatedDoctor ?? {
          id,
          status: "Inactive",
        };
      }),
    [runMutation]
  );

  const addPatient = useCallback(
    (doctorId, patientData) =>
      runMutation(async () => {
        const response = await patientApi.create(
          doctorId,
          patientData
        );

        const newPatient = normalizePatient(response?.data);

        if (!newPatient?.id) {
          throw new Error("Invalid patient response from the server.");
        }

        const id = String(doctorId);

        setDoctors((previous) =>
          previous.map((doctor) =>
            doctor.id === id
              ? {
                  ...doctor,
                  patients: [
                    ...doctor.patients,
                    newPatient,
                  ],
                }
              : doctor
          )
        );

        return newPatient;
      }),
    [runMutation]
  );

  const updatePatient = useCallback(
    (oldDoctorId, patientId, newDoctorId, updates = {}) =>
      runMutation(async () => {
        const oldId = String(oldDoctorId);
        const destinationId = String(newDoctorId || oldDoctorId);
        const patientIdString = String(patientId);
        const patientUpdates = preparePatientUpdates(updates);

        try {
          let updatedPatient = null;

          if (Object.keys(patientUpdates).length > 0) {
            const response = await patientApi.update(
              oldId,
              patientIdString,
              patientUpdates
            );

            updatedPatient = normalizePatient(response?.data);

            if (!updatedPatient?.id) {
              throw new Error(
                "The server did not return the updated patient."
              );
            }
          }

          if (destinationId !== oldId) {
            const response = await patientApi.transfer(
              oldId,
              patientIdString,
              destinationId
            );

            updatedPatient = normalizePatient(response?.data);

            if (!updatedPatient?.id) {
              throw new Error(
                "The server did not return the transferred patient."
              );
            }
          }

          if (!updatedPatient) {
            throw new Error("No patient changes were provided.");
          }

          if (destinationId === oldId) {
            setDoctors((previous) =>
              previous.map((doctor) =>
                doctor.id === oldId
                  ? {
                      ...doctor,
                      patients: doctor.patients.map((patient) =>
                        patient.id === patientIdString
                          ? updatedPatient
                          : patient
                      ),
                    }
                  : doctor
              )
            );
          } else {
            setDoctors((previous) =>
              previous.map((doctor) => {
                if (doctor.id === oldId) {
                  return {
                    ...doctor,
                    patients: doctor.patients.filter(
                      (patient) => patient.id !== patientIdString
                    ),
                  };
                }

                if (doctor.id === destinationId) {
                  return {
                    ...doctor,
                    patients: [
                      ...doctor.patients,
                      updatedPatient,
                    ],
                  };
                }

                return doctor;
              })
            );
          }

          return updatedPatient;
        } catch (err) {
          try {
            await fetchDoctors();
          } catch (refreshError) {
            console.error(
              "Patient state refresh failed:",
              refreshError
            );
          }

          throw err;
        }
      }),
    [runMutation, fetchDoctors]
  );

  const deletePatient = useCallback(
    (doctorId, patientId) =>
      runMutation(async () => {
        await patientApi.delete(doctorId, patientId);

        setDoctors((previous) =>
          previous.map((doctor) =>
            doctor.id === String(doctorId)
              ? {
                  ...doctor,
                  patients: doctor.patients.filter(
                    (patient) => patient.id !== String(patientId)
                  ),
                }
              : doctor
          )
        );

        return true;
      }),
    [runMutation]
  );

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      doctors,
      patients,
      pagination,
      loading,
      isMutating,
      error,
      clearError,
      fetchDoctors,
      refreshDoctors: fetchDoctors,
      getDoctorById,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      addPatient,
      updatePatient,
      deletePatient,
    }),
    [
      doctors,
      patients,
      pagination,
      loading,
      isMutating,
      error,
      clearError,
      fetchDoctors,
      getDoctorById,
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

export function useHealthcare() {
  const context = useContext(HealthcareContext);

  if (!context) {
    throw new Error(
      "useHealthcare must be used inside HealthcareProvider."
    );
  }

  return context;
}
