import axios from "./axios";

// Login API
export const login = async (username, password) => {
  const response = await axios.post(`/auth/login`, {
    username,
    password,
  });
  return response.data; // Returns token and user details
};

// Register API
export const register = async (username, password, role) => {
  const response = await axios.post(`/auth/register`, {
    username,
    password,
    role,
  });
  return response.data; // Returns success message
};
