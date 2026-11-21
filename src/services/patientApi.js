
import { apiRequest } from "@/lib/api";

const encodeId = (id) => encodeURIComponent(String(id));

const toDateOnly = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ""
      : value.toISOString().slice(0, 10);
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

const normalizePatient = (patient) => {
  if (!patient || typeof patient !== "object") return null;

  const id = patient.id ?? patient._id;

  return {
    ...patient,
    id: id == null ? "" : String(id),
    registeredAt: toDateOnly(
      patient.registeredAt ?? patient.createdAt
    ),
  };
};

const preparePatientData = (data = {}) => {
  const payload = {};

  if (data.name !== undefined) {
    payload.name = String(data.name).trim();
  }

  if (data.age !== undefined) {
    payload.age = Number(data.age);
  }

  if (data.condition !== undefined) {
    payload.condition = String(data.condition).trim();
  }

  return payload;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

const normalizeResponseList = (response) => ({
  ...response,
  data: Array.isArray(response?.data)
    ? response.data.map(normalizePatient).filter(Boolean)
    : [],
});

const normalizeResponseItem = (response) => ({
  ...response,
  data: normalizePatient(response?.data),
});

export const patientApi = {
  getAll: async (params = {}) => {
    const query = buildQuery(params);

    const response = await apiRequest(
      `/patients${query ? `?${query}` : ""}`
    );

    return normalizeResponseList(response);
  },

  getByDoctor: async (doctorId) => {
    const response = await apiRequest(
      `/patients/doctor/${encodeId(doctorId)}`
    );

    return normalizeResponseList(response);
  },

  create: async (doctorId, patientData) => {
    const response = await apiRequest(
      `/patients/doctor/${encodeId(doctorId)}`,
      {
        method: "POST",
        body: preparePatientData(patientData),
      }
    );

    return normalizeResponseItem(response);
  },

  update: async (doctorId, patientId, updates) => {
    const response = await apiRequest(
      `/patients/doctor/${encodeId(doctorId)}/${encodeId(patientId)}`,
      {
        method: "PATCH",
        body: preparePatientData(updates),
      }
    );

    return normalizeResponseItem(response);
  },

  delete: async (doctorId, patientId) =>
    apiRequest(
      `/patients/doctor/${encodeId(doctorId)}/${encodeId(patientId)}`,
      { method: "DELETE" }
    ),

  transfer: async (oldDoctorId, patientId, newDoctorId) => {
    const response = await apiRequest(
      `/patients/doctor/${encodeId(oldDoctorId)}/${encodeId(patientId)}/transfer`,
      {
        method: "POST",
        body: { newDoctorId },
      }
    );

    return normalizeResponseItem(response);
  },
};
