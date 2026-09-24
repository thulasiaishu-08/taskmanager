import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    apiClient
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setToken(null);
        localStorage.removeItem("access_token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function login(email, password) {
    const res = await apiClient.post("/auth/login", { email, password });
    localStorage.setItem("access_token", res.data.access_token);
    setToken(res.data.access_token);
  }

  async function register(email, password) {
    await apiClient.post("/auth/register", { email, password });
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
