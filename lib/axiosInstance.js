import axios from "axios";
import store from "@/store";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com", // Use environment variables for flexibility
  timeout: 120000, // Timeout limit (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let accessToken;

    if (!accessToken) {
      const { auth } = store.getState();
      accessToken = auth.token;
    }

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    
    config.headers["X-Request-Source"] = typeof window !== "undefined" ? window.location.origin : "server";

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
