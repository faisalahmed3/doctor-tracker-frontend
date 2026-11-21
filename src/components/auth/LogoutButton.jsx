
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  confirmAction,
  showSuccess,
  showError,
} from "@/lib/sweetAlert";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const confirmation = await confirmAction({
        title: "Logout?",
        text: "Are you sure you want to leave your admin workspace?",
        icon: "warning",
        confirmText: "Yes, Logout",
        cancelText: "Cancel",
      });

      if (!confirmation?.isConfirmed) return;

      await logout();

      await showSuccess(
        "Logged Out Successfully",
        "You have been securely logged out."
      );

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      await showError(
        "Logout Failed",
        error.response?.data?.message ||
          "Unable to logout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="btn btn-ghost flex items-center gap-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <LogOut size={17} />
      )}

      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
