import axios from "./axios";
const BASEURI = "http://localhost:8080/api";

// Login API
export const login = async (username, password) => {
  const response = await axios.post(`${BASEURI}/auth/login`, {
    username,
    password,
  });
  return response.data; // Returns token and user details
};

// Register API
export const register = async (username, password, role) => {
  const response = await axios.post(`http://localhost:8080/api/auth/register`, {
    username,
    password,
    role,
  });
  return response.data; // Returns success message
};
