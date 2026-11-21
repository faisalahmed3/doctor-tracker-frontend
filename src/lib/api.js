
import axios from "axios";
import api from "@/lib/axios";

export class ApiError extends Error {
  constructor(message, status = 0, errors = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;

    this.response = {
      status,
      data: { message, errors },
    };
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    ...config
  } = options;

  try {
    const response = await api.request({
      ...config,
      url: endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
      method,
      data: body,
      headers,
    });

    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const status = error.response?.status || 0;
    const data = error.response?.data;

    throw new ApiError(
      data?.message ||
        (status === 0
          ? "Unable to connect to the server."
          : error.message || "Request failed."),
      status,
      data?.errors || null
    );
  }
};
