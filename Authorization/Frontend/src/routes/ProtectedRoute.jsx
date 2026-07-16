// ─── What is this file? ───────────────────────────────────────────────────────
//
// This file is a "Route Guard".
//
// PROBLEM it solves:
//   Some pages (dashboard, employees) should only be visible to logged-in users.
//   Some pages (users list) should only be visible to certain roles (SuperAdmin).
//   Without a guard, anyone could just type /dashboard in the URL bar and get in.
//
// SOLUTION:
//   We wrap protected routes with <ProtectedRoute> in App.jsx.
//   Before rendering the page, we check:
//     1. Is the user logged in? (has a token)
//     2. Does the user have one of the allowed roles?
//   If not → redirect them away.
//
// ─────────────────────────────────────────────────────────────────────────────

// Navigate → a React Router component that redirects to another URL
// (it's like calling navigate() but as JSX)
import { Navigate } from "react-router-dom";

// useAuth → gets the current auth state from our global context
import { useAuth } from "../context/AuthContext";

// ─── Component ────────────────────────────────────────────────────────────────
//
// Props:
//   children → the page component to show if access is allowed
//   roles    → optional array of allowed role strings
//              e.g. ["SuperAdmin"] or ["Admin", "SuperAdmin"]
//              If not provided, any logged-in user can access the route.
//
function ProtectedRoute({ children, roles }) {
  const { token, getRole } = useAuth();

  // Check 1: Not logged in → send to login page
  // "replace" means the login page replaces the current history entry,
  // so the user can't press Back to get to the protected page.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check 2: Role check (only if the route requires specific roles)
  if (roles && roles.length > 0) {
    const userRole = getRole();

    // roles.includes(userRole) → true if the user's role is in the allowed list
    if (!roles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // All checks passed → render the actual page
  return children;
}

export default ProtectedRoute;
