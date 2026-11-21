
import api from "@/lib/axios";

const extractUser = (response) => {
  const user = response?.data?.data?.user;

  if (!user) {
    throw new Error(
      response?.data?.message || "Invalid authentication response."
    );
  }

  return user;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return extractUser(response);
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return extractUser(response);
};
