
import api from "@/lib/axios";

// Admin Login
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data.data.user;
};

// Admin Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

// Get Current Logged-in User
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.data.user;
};
