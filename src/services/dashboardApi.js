
import { apiRequest } from "@/lib/api";

export const dashboardApi = {
  getSummary: (options = {}) =>
    apiRequest("/dashboard/summary", {
      ...options,
      method: "GET",
    }),
};
