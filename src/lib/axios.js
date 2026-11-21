
import axios from "axios";

const fallbackURL =
  process.env.NODE_ENV === "production"
    ? "https://doctor-tracker-backend-dusky.vercel.app/api/v1"
    : "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: (
    process.env.NEXT_PUBLIC_API_URL || fallbackURL
  ).replace(/\/+$/, ""),

  withCredentials: true,
  timeout: 20000,

  headers: {
    Accept: "application/json",
  },
});

export default api;
