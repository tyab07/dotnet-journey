import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {

    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                            Auth Demo
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            Home
                        </Link>

                        {(user?.role === "Admin" || user?.role === "SuperAdmin" || user?.role === "User" || user?.role === "Employee") && (
                            <Link
                                to="/employees"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                Employees
                            </Link>
                        )}

                        {user?.role === "SuperAdmin" && (
                            <Link
                                to="/users"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                Users
                            </Link>
                        )}

                        <button
                            onClick={logout}
                            className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;