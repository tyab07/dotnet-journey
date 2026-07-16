// ─── What is this file? ───────────────────────────────────────────────────────
//
// This file creates a "global store" for the user's login state using React's
// built-in Context API.
//
// PROBLEM it solves:
//   Without context, if the Navbar, Sidebar, and Profile page all need to know
//   "who is logged in?", you'd have to pass props through every component.
//   This is called "prop drilling" and gets messy fast.
//
// SOLUTION:
//   Context lets you wrap the whole app in <AuthProvider> and then ANY component
//   can call useAuth() to read the token or user — no prop passing needed.
//
// ─────────────────────────────────────────────────────────────────────────────

// createContext → creates the context object (the "global store")
// useContext    → lets any component read from that context
// useState      → holds the token and user state
// useEffect     → runs code when the token changes (sync to localStorage)
import { createContext, useContext, useState, useEffect } from "react";

// jwtDecode → reads the payload inside a JWT token
//
// A JWT looks like: xxxxx.yyyyy.zzzzz
//   - Part 1 (xxxxx): header  — type and algorithm
//   - Part 2 (yyyyy): payload — your actual data (email, role, expiry)
//   - Part 3 (zzzzz): signature — proves the token hasn't been tampered with
//
// jwtDecode only reads Part 2. It does NOT verify the signature — that's the
// backend's job. We use it just to display the user's name/role in the UI.
import { jwtDecode } from "jwt-decode";

// Step 1: Create the context
// null is the default value (before the Provider sets real values)
const AuthContext = createContext(null);

// ─── Provider Component ───────────────────────────────────────────────────────
//
// This wraps the entire app (see main.jsx).
// It holds the state and makes it available to all child components.
//
export function AuthProvider({ children }) {

  // token → the raw JWT string, e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // We initialize it from localStorage so the user stays logged in after a page refresh.
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // user → the decoded payload from the JWT, e.g. { email, role, exp, ... }
  // We decode the stored token on startup (if there is one).
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    try {
      return jwtDecode(stored);
    } catch {
      return null; // token was corrupted
    }
  });

  // ── Sync effect ─────────────────────────────────────────────────────────────
  // Runs every time "token" changes.
  // If we have a token → decode it and save to localStorage
  // If token is null  → clear localStorage (user logged out)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if the token has expired (exp is in seconds, Date.now() is ms)
        if (decoded.exp * 1000 < Date.now()) {
          logout(); // auto-logout on expiry
        } else {
          setUser(decoded);
          localStorage.setItem("token", token);
        }
      } catch {
        logout(); // bad token
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]); // ← dependency array: only re-run when "token" changes

  // ── login() ─────────────────────────────────────────────────────────────────
  // Called from Login.jsx after a successful API response.
  // Saves the raw JWT string → the useEffect above will handle the rest.
  const login = (rawToken) => {
    setToken(rawToken);
  };

  // ── logout() ────────────────────────────────────────────────────────────────
  // Clears everything. Any component can call this (e.g. a "Sign Out" button).
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // ── getRole() ────────────────────────────────────────────────────────────────
  // .NET Identity stores the role under a long Microsoft claim URL.
  // This helper hides that ugly detail from other components.
  const getRole = () => {
    if (!user) return null;
    return (
      user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      user.role ||
      null
    );
  };

  // Step 2: Provide the values to all children
  // Any component that calls useAuth() gets: token, user, login, logout, getRole
  return (
    <AuthContext.Provider value={{ token, user, login, logout, getRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
//
// Instead of writing:
//   const { login } = useContext(AuthContext);
//
// Components just write:
//   const { login } = useAuth();
//
// The error check ensures this hook is only used inside <AuthProvider>.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
