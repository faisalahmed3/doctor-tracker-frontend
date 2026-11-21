
import { apiRequest } from "@/lib/api";

const DOCTOR_FIELDS = [
  "name",
  "specialization",
  "hospital",
  "phone",
  "email",
];

export const toDateOnly = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ""
      : value.toISOString().slice(0, 10);
  }

  if (typeof value === "number") {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? ""
      : date.toISOString().slice(0, 10);
  }

  const raw = String(value).trim();

  if (!raw) return "";

  const datePart = raw.match(/^\d{4}-\d{2}-\d{2}/);

  if (datePart) return datePart[0];

  const date = new Date(raw);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
};

export const normalizePatient = (patient) => {
  if (!patient || typeof patient !== "object") return null;

  return {
    ...patient,
    id: String(patient.id ?? patient._id ?? ""),
    registeredAt: toDateOnly(
      patient.registeredAt ?? patient.createdAt
    ),
  };
};

export const normalizeDoctor = (doctor) => {
  if (!doctor || typeof doctor !== "object") return null;

  return {
    ...doctor,
    id: String(doctor.id ?? doctor._id ?? ""),
    name: String(doctor.name ?? ""),
    patients: Array.isArray(doctor.patients)
      ? doctor.patients.map(normalizePatient).filter(Boolean)
      : [],
    createdAt: toDateOnly(doctor.createdAt),
  };
};

const prepareDoctorData = (data = {}) =>
  Object.fromEntries(
    DOCTOR_FIELDS
      .filter((field) => data[field] !== undefined)
      .map((field) => [
        field,
        typeof data[field] === "string"
          ? data[field].trim()
          : data[field],
      ])
  );

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const doctorApi = {
  getAll: async (params = {}) => {
    const query = buildQuery(params);

    const response = await apiRequest(
      `/doctors${query ? `?${query}` : ""}`
    );

    return {
      ...response,
      data: Array.isArray(response?.data)
        ? response.data.map(normalizeDoctor).filter(Boolean)
        : [],
    };
  },

  getById: async (id) => {
    const response = await apiRequest(
      `/doctors/${encodeURIComponent(id)}`
    );

    return {
      ...response,
      data: normalizeDoctor(response?.data),
    };
  },

  create: async (doctorData) => {
    const response = await apiRequest("/doctors", {
      method: "POST",
      body: prepareDoctorData(doctorData),
    });

    return {
      ...response,
      data: normalizeDoctor(response?.data),
    };
  },

  update: async (id, updates) => {
    const response = await apiRequest(
      `/doctors/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: prepareDoctorData(updates),
      }
    );

    return {
      ...response,
      data: normalizeDoctor(response?.data),
    };
  },

  deactivate: async (id) => {
    const response = await apiRequest(
      `/doctors/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    return {
      ...response,
      data: normalizeDoctor(response?.data),
    };
  },
};
