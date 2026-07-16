// ─── DashboardLayout ──────────────────────────────────────────────────────────
//
// This is the shared shell for all protected pages.
// It renders:  Sidebar (left) | Topbar (top) + Page content (right)
//
// CONCEPT — <Outlet />:
//   React Router renders the matched child route INSIDE <Outlet />.
//   So when the URL is /employees, the <Employees /> component
//   is injected where <Outlet /> sits.
//   This lets all pages share the same Sidebar + Topbar without repeating them.
//
// ─────────────────────────────────────────────────────────────────────────────
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// Map URL paths to human-readable page titles shown in the Topbar
const PAGE_TITLES = {
  "/employees":      "Employees / My Profile",
  "/branches":       "Branches",
  "/departments":    "Departments",
  "/designations":   "Designations",
  "/employee-types": "Employee Types",
  "/salaries":       "Salaries / My Salary",
  "/users":          "Users",
};

function DashboardLayout() {
  // useLocation() gives us the current URL path (e.g. "/employees")
  // We use it to look up the page title for the Topbar
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Dashboard";

  return (
    // flex → Sidebar and main content side by side
    // h-screen → fill the full viewport height
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Left sidebar — fixed width, never scrolls */}
      <Sidebar />

      {/* Right side: Topbar on top, scrollable page content below */}
      {/*
        flex-1   → takes all remaining horizontal space
        flex-col → stack Topbar and content vertically
        overflow-hidden → let the inner content scroll, not the whole page
      */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />

        {/* Page content — this area scrolls if content is long */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* React Router puts the matched page component here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
