
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

const getErrorStatus = (error) =>
  error?.response?.status ?? error?.status ?? 0;

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [authError, setAuthError] = useState("");

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

      const code = getErrorStatus(error);

      if (code === 401 || code === 403) {
        setStatus("unauthenticated");
        return null;
      }

      setStatus("error");
      setAuthError(getErrorMessage(error));

      return null;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials) => {
    setAuthError("");

    try {
      const authenticatedUser = await loginUser(credentials);

      setUser(authenticatedUser);
      setStatus("authenticated");

      return authenticatedUser;
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
      setAuthError(getErrorMessage(error));

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthError("");

    try {
      await logoutUser();

      setUser(null);
      setStatus("unauthenticated");
    } catch (error) {
      setAuthError(getErrorMessage(error));
      throw error;
    }
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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}
