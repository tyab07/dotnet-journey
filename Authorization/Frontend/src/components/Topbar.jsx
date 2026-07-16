// ─── Topbar component ─────────────────────────────────────────────────────────
//
// The horizontal bar at the top of each page.
// Shows: current page title + logged-in user's email + logout button.
//
// ─────────────────────────────────────────────────────────────────────────────
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// We accept a "title" prop from the parent page so each page can show its own name
function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();              // clears token from context + localStorage
    navigate("/login");   // redirect to login page
  };

  // Read the email from the decoded JWT claims
  // .NET Identity stores email under this long key
  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    user?.email ||
    "User";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">

      {/* Page title — passed as a prop from the current page */}
      <h1 className="text-gray-800 font-semibold text-base">{title}</h1>

      {/* Right side: email + logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
