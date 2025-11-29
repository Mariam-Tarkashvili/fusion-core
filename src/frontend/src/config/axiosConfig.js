// src/config/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for request/response
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling here
    return Promise.reject(error.response?.data?.message || error.message || "API Error");
  }
);

export default instance;
