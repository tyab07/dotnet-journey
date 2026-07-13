import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7290/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("[Frontend API Request]", config.method?.toUpperCase(), config.url, config.data);

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("[Frontend API Response]", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("[Frontend API Error]", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default api;