import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "http://192.168.100.2:3000/api/v1/" || process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com", // Use environment variables for flexibility
  timeout: 10000, // Timeout limit (optional)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = token;
    }
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
