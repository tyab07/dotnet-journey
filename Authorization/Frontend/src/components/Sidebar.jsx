import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard",          path: "/",               roles: null },
  { label: "Employees",          path: "/employees",      roles: ["Admin", "SuperAdmin"] },
  { label: "My Profile",         path: "/employees",      roles: ["Employee"] },
  { label: "Branches",           path: "/branches",       roles: ["Admin", "SuperAdmin"] },
  { label: "Departments",        path: "/departments",    roles: ["Admin", "SuperAdmin"] },
  { label: "Designations",       path: "/designations",   roles: ["Admin", "SuperAdmin"] },
  { label: "Employee Types",     path: "/employee-types", roles: ["Admin", "SuperAdmin"] },
  { label: "Salaries",           path: "/salaries",       roles: ["Admin", "SuperAdmin"] },
  { label: "Employee Documents", path: "/documents",      roles: ["Admin", "SuperAdmin"] },
  { label: "My Salary",          path: "/salaries",       roles: ["Employee"] },
  { label: "Users",              path: "/users",          roles: ["SuperAdmin"] },
];

function Sidebar() {
  const { getRole } = useAuth();
  const userRole = getRole();

  return (
    <aside className="h-screen w-56 bg-gray-800 flex flex-col flex-shrink-0">
      <div className="px-4 py-5 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg">HR System</h2>
        <p className="text-gray-400 text-xs mt-0.5">Management Portal</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const allowed = item.roles === null || item.roles.includes(userRole);
          if (!allowed) return null;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-700">
        <p className="text-gray-500 text-xs">Role: {userRole ?? "—"}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
