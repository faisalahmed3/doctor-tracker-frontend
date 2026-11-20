
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";

import { HealthcareProvider } from "@/context/HealthcareContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Doctor Tracker",
    template: "%s | Doctor Tracker",
  },
  description:
    "A healthcare management system for managing doctors, patients and healthcare activities.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <HealthcareProvider>
          {children}
        </HealthcareProvider>
      </body>
    </html>
  );
}
