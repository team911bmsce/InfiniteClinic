import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticated_user, login, logout, register } from "../api/endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const get_authenticated_user = async () => {
    try {
      const fetchedUser = await authenticated_user();
      setUser(fetchedUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username, password) => {
    const data = await login(username, password);
    if (data && data.user) {
      setUser(data.user); // backend sends { user: {...} }
      nav("/");
    } else {
      alert("Incorrect username or password");
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    nav("/login");
  };

  const registerUser = async (
    username,
    email,
    password,
    confirm_password,
    role = "patient"
  ) => {
    try {
      if (password === confirm_password) {
        const data = await register(username, email, password, role);
        if (data) {
          alert("User successfully registered");
          nav("/login");
        }
      } else {
        alert("Passwords do not match");
      }
    } catch {
      alert("Error registering user");
    }
  };

  useEffect(() => {
    get_authenticated_user();
  }, [window.location.pathname]);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, logoutUser, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
