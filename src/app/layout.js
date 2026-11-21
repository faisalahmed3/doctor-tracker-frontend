
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import "sweetalert2/dist/sweetalert2.min.css";

import AppProviders from "@/components/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Doctor Tracker | Healthcare Management System",
  description:
    "Secure healthcare management system for doctors and patient records.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
