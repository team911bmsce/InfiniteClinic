import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/auth/";

const LOGIN_URL = `${BASE_URL}login/`;
const REGISTER_URL = `${BASE_URL}register/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const TODOS_URL = `${BASE_URL}todos/`;
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;

axios.defaults.withCredentials = true;

// ---- AUTH ENDPOINTS ----
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      { withCredentials: true }
    );
    return response.data; // Contains user object with role
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const register = async (username, email, password, role = "patient") => {
  try {
    const response = await axios.post(
      REGISTER_URL,
      { username, email, password, role },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

export const logout = async () => {
  const response = await axios.post(LOGOUT_URL, {}, { withCredentials: true });
  return response.data;
};

export const authenticated_user = async () => {
  const response = await axios.get(AUTHENTICATED_URL, {
    withCredentials: true,
  });
  return response.data; // Returns {id, username, email, role}
};

// ---- TODO ENDPOINT ----
export const get_todos = async () => {
  const response = await axios.get(TODOS_URL, { withCredentials: true });
  return response.data;
};
