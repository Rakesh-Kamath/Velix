import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/profile");
      console.log('Profile fetch response:', res.data);
      setUser(res.data.user);
    } catch (error) {
      console.error('Profile fetch error:', error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log('Attempting login with:', { email });
    const res = await api.post("/auth/login", { email, password });
    console.log('Login response:', res.data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    // Small delay to ensure state is properly set
    await new Promise(resolve => setTimeout(resolve, 50));
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  };

  const loginWithGoogle = async (token) => {
    const res = await api.post("/auth/google", { token });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    // Small delay to ensure state is properly set
    await new Promise(resolve => setTimeout(resolve, 50));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Small delay to ensure state is properly set
    setTimeout(() => {}, 10);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

