

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://doctor-tracker-backend-teal.vercel.app/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  timeout: 15000,
});

export default api;
