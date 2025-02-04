import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor for adding the Authorization header if needed
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
