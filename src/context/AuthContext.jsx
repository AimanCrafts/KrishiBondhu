import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  getSession,
  logout as logoutStorage,
  isTokenExpired,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const originalTokenRef = useRef(null);

  const logout = () => {
    logoutStorage();
    setUser(null);
    userRef.current = null;
    originalTokenRef.current = null;
  };

  useEffect(() => {
    const session = getSession();
    const token = localStorage.getItem("kb_token");

    if (session && isTokenExpired()) {
      logoutStorage();
      setUser(null);
      userRef.current = null;
      originalTokenRef.current = null;
    } else if (session) {
      setUser(session);
      userRef.current = session;
      originalTokenRef.current = token;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("kb_token");
      const session = getSession();
      const currentUser = userRef.current;

      if (!currentUser) return;
      if (!session || !currentToken) { logout(); return; }

      if (!originalTokenRef.current) {
        originalTokenRef.current = currentToken;
        return;
      }

      if (currentToken !== originalTokenRef.current) { logout(); return; }
      if (isTokenExpired()) { logout(); return; }

    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("kb_token");
      const session = getSession();
      if (!session || !currentToken) {
        if (userRef.current) logout();
        return;
      }
      if (currentToken !== originalTokenRef.current || isTokenExpired()) {
        if (userRef.current) logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (userData) => {
    const token = localStorage.getItem("kb_token");
    setUser(userData);
    userRef.current = userData;
    originalTokenRef.current = token;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
