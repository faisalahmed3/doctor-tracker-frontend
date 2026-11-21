
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "@/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [authError, setAuthError] = useState("");

  // Verify the existing session
  const checkAuth = useCallback(async () => {
    setStatus("loading");
    setAuthError("");

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setStatus("authenticated");

      return currentUser;
    } catch (error) {
      setUser(null);

      const statusCode = error.response?.status;

      if (statusCode === 401 || statusCode === 403) {
        setStatus("unauthenticated");
        return null;
      }

      setStatus("error");

      setAuthError(
        error.response?.data?.message ||
          "Unable to verify your authentication session."
      );

      return null;
    }
  }, []);

  // Check authentication when application loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (credentials) => {
    const authenticatedUser = await loginUser(credentials);

    setUser(authenticatedUser);
    setStatus("authenticated");
    setAuthError("");

    return authenticatedUser;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await logoutUser();

    setUser(null);
    setStatus("unauthenticated");
    setAuthError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      authError,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      logout,
      checkAuth,
    }),
    [
      user,
      status,
      authError,
      login,
      logout,
      checkAuth,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
