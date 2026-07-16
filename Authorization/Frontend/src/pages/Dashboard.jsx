// ─── Dashboard landing page ───────────────────────────────────────────────────
//
// This is the default page (index route) shown at "/" after a user logs in.
//
// KEY CONCEPT — Role-based Dashboard View:
//   Instead of showing the same view to everyone, we check the user's role from
//   the decoded JWT token (via useAuth). We then render a view specific to that role.
//
//   - SuperAdmin: Shows cards for system administration (Users, Employees, etc.)
//   - Admin: Shows cards for managing HR resources (Employees, Departments, Branches)
//   - Employee / User: Shows a friendly personal welcome page
//
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { getRole, user } = useAuth();
  const role = getRole();

  // Helper to extract email for display
  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    user?.email ||
    "User";

  // ── Render view for SuperAdmin ──
  if (role === "SuperAdmin") {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">SuperAdmin Workspace</h2>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-gray-700">{email}</span>. You have full system-wide permissions.
          </p>
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">System Users</h3>
              <p className="text-sm text-gray-500 mt-1">Manage user accounts, passwords, and roles.</p>
            </div>
            <Link to="/users" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
              Go to Users →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Employees</h3>
              <p className="text-sm text-gray-500 mt-1">View, register, and update employee profiles.</p>
            </div>
            <Link to="/employees" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
              Go to Employees →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Organization</h3>
              <p className="text-sm text-gray-500 mt-1">Configure departments, branches, and designations.</p>
            </div>
            <Link to="/branches" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
              Go to Branches →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render view for Admin ──
  if (role === "Admin") {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Admin Workspace</h2>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-gray-700">{email}</span>. You can manage HR entries and employees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Employee Directory</h3>
              <p className="text-sm text-gray-500 mt-1">Access all records, update job details, and types.</p>
            </div>
            <Link to="/employees" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
              Open Directory →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Departments & Branches</h3>
              <p className="text-sm text-gray-500 mt-1">Configure physical locations and departmental setups.</p>
            </div>
            <Link to="/departments" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
              Manage Setup →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render view for Employee / User ──
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl select-none">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Logged in as <span className="font-semibold text-gray-700">{email}</span>
              {" · "}
              <span className="text-xs text-gray-400 font-medium">{role ?? "User"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">🪪</div>
            <h3 className="font-semibold text-gray-800 text-lg">My Profile</h3>
            <p className="text-sm text-gray-500 mt-1">
              View your personal details, designation, department, and branch.
            </p>
          </div>
          <Link to="/employees" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
            View Profile →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-800 text-lg">My Salary</h3>
            <p className="text-sm text-gray-500 mt-1">
              View your salary slips, bonuses, deductions, and payment status.
            </p>
          </div>
          <Link to="/salaries" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">
            View Salary Slips →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
