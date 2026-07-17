// ─── What is this file? ───────────────────────────────────────────────────────
//
// This is the shared axios instance used by ALL service files.
//
// KEY CONCEPT — Request Interceptor:
//   Every protected backend endpoint requires the JWT token in the header:
//     Authorization: Bearer eyJhbGci...
//
//   Without an interceptor, every service function would need to manually do:
//     headers: { Authorization: `Bearer ${token}` }
//
//   Instead, we set up ONE interceptor here that automatically adds the token
//   to EVERY request made through this axios instance.
//
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

// Create a shared axios instance with the base URL of the .NET backend
const api = axios.create({
  baseURL: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
//
// This runs BEFORE every request is sent.
// It reads the token from localStorage and attaches it to the Authorization header.
//
// Why localStorage (not Context)?
//   Interceptors live outside React components, so they can't use useAuth().
//   localStorage is accessible anywhere — even outside React.
//
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Attach the token so the .NET [Authorize] attribute accepts the request
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // must always return config
});

export default api;

// ─── Auth Service ─────────────────────────────────────────────────────────────
// Login does NOT need the interceptor (no token yet), but it still uses this
// axios instance for the base URL.

export const loginUser = async (email, password) => {
  // We don't use api here on purpose — login has no auth header
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};
