// ─── Sidebar component ────────────────────────────────────────────────────────
//
// This is the left navigation panel shown on all protected pages.
//
// KEY CONCEPTS:
//   NavLink (react-router-dom) → like <Link> but adds an "active" class
//     automatically when the current URL matches the link's path.
//     We use this to highlight the active menu item.
//
//   Role-based rendering → we read the user's role from AuthContext and
//     only show the "Users" link for SuperAdmin.
//
// ─────────────────────────────────────────────────────────────────────────────
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Each nav item: label to show, path to navigate to, and required role(s).
// null roles = any logged-in user can see it.
//
// NOTE — Employee-specific labels:
//   Employees page  → shown as "My Profile" for employees (same route, different experience)
//   Salaries page   → shown as "My Salary"  for employees
const NAV_ITEMS = [
  { label: "Dashboard",      path: "/",               roles: null },
  { label: "Employees",      path: "/employees",      roles: ["Admin", "SuperAdmin"] },
  { label: "My Profile",     path: "/employees",      roles: ["Employee"] },
  { label: "Branches",       path: "/branches",       roles: ["Admin", "SuperAdmin"] },
  { label: "Departments",    path: "/departments",    roles: ["Admin", "SuperAdmin"] },
  { label: "Designations",   path: "/designations",   roles: ["Admin", "SuperAdmin"] },
  { label: "Employee Types", path: "/employee-types", roles: ["Admin", "SuperAdmin"] },
  { label: "Salaries",       path: "/salaries",       roles: ["Admin", "SuperAdmin"] },
  { label: "My Salary",      path: "/salaries",       roles: ["Employee"] },
  { label: "Users",          path: "/users",          roles: ["SuperAdmin"] },
];

function Sidebar() {
  const { getRole } = useAuth();
  const userRole = getRole();

  return (
    // h-screen → full viewport height so sidebar fills the page
    // w-56     → fixed width (14rem / 224px)
    // flex-shrink-0 → don't let it shrink when content area grows
    <aside className="h-screen w-56 bg-gray-800 flex flex-col flex-shrink-0">

      {/* App title / logo area */}
      <div className="px-4 py-5 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg">HR System</h2>
        <p className="text-gray-400 text-xs mt-0.5">Management Portal</p>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          // If item has required roles, check the user has one of them.
          // If roles is null, show to everyone.
          const allowed =
            item.roles === null || item.roles.includes(userRole);

          if (!allowed) return null; // hide this link

          return (
            <NavLink
              key={item.path}
              to={item.path}
              // NavLink's className can be a function that receives { isActive }
              // We use this to change the styling of the active link.
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"   // active link style
                    : "text-gray-300 hover:bg-gray-700 hover:text-white" // normal style
                }`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom role indicator */}
      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-gray-500 text-xs">Role: {userRole ?? "—"}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
