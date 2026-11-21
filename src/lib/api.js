
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://doctor-tracker-backend-teal.vercel.app/api/v1"
).replace(/\/+$/, "");

// ==========================================
// CUSTOM API ERROR
// ==========================================

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// ==========================================
// REUSABLE API REQUEST
// ==========================================

export const apiRequest = async (
  endpoint,
  options = {}
) => {
  const {
    method = "GET",
    body,
    headers = {},
    ...fetchOptions
  } = options;

  const isFormData =
    typeof FormData !== "undefined" &&
    body instanceof FormData;

  const url = `${API_BASE_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  let response;

  try {
    response = await fetch(url, {
      ...fetchOptions,

      method,

      // Send HTTP-only authentication cookies.
      credentials: "include",

      // Always retrieve fresh database information.
      cache: "no-store",

      headers: {
        Accept: "application/json",

        ...(body !== undefined && !isFormData
          ? { "Content-Type": "application/json" }
          : {}),

        ...headers,
      },

      ...(body !== undefined
        ? {
            body: isFormData
              ? body
              : JSON.stringify(body),
          }
        : {}),
    });
  } catch (error) {
    throw new ApiError(
      "Unable to connect to the server. Please check your internet or backend server.",
      0
    );
  }

  // ==========================================
  // PARSE RESPONSE
  // ==========================================

  let result = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // ==========================================
  // HANDLE API ERRORS
  // ==========================================

  if (!response.ok) {
    throw new ApiError(
      result?.message || "Something went wrong.",
      response.status,
      result?.errors || null
    );
  }

  return result;
};
