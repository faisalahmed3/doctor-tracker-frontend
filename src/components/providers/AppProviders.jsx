
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { HealthcareProvider } from "@/context/HealthcareContext";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <HealthcareProvider>
        {children}
      </HealthcareProvider>
    </AuthProvider>
  );
}
