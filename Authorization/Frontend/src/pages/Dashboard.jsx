import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import {
  getDashboard,
  getEmployeesByDepartment,
  getEmployeesByBranch,
  getEmployeesByDesignation,
} from "../api/dashboardService";

const BAR_COLOR_DEPT   = "#4f86c6";
const BAR_COLOR_BRANCH = "#6aab9c";
const BAR_HOVER_DEPT   = "#3a6da8";
const BAR_HOVER_BRANCH = "#4d8a7a";

const PIE_COLORS = [
  "#4f86c6", "#6aab9c", "#e07b5a", "#a47bbf",
  "#e8b84b", "#5aaedb", "#d46e7e", "#7db87a",
];

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value ?? "—"}</p>
    </div>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-gray-700 mb-0.5">{label}</p>
      <p className="text-gray-500">{payload[0].value} Employee{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-gray-700 mb-0.5">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value} Employee{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

function BarChartCard({ title, data, barColor, barHoverColor, onBarClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">{title}</h3>
      {data?.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 15, left: -10, bottom: 65 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar
              dataKey="count"
              radius={[5, 5, 0, 0]}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
              style={{ cursor: "pointer" }}
              onMouseEnter={(_, i) => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {data.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={hovered === i ? barHoverColor : barColor} 
                  onClick={() => onBarClick(entry)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No data available.
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2 text-center">Click a bar to view employees</p>
    </div>
  );
}

function PieChartCard({ title, data, onSliceClick }) {
  const [hovered, setHovered] = useState(null);

  const renderLabel = ({ name, percent }) =>
    `${name} (${(percent * 100).toFixed(0)}%)`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-5">{title}</h3>
      {data?.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={95}
              label={renderLabel}
              labelLine
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
              onClick={(entry) => onSliceClick(entry)}
              style={{ cursor: "pointer" }}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={PIE_COLORS[i % PIE_COLORS.length]}
                  opacity={hovered === null || hovered === i ? 1 : 0.6}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400">
          No data available.
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2 text-center">Click a slice to view employees</p>
    </div>
  );
}

function EmployeeTable({ employees, search, sortField, onSortChange }) {
  const sorted = useMemo(() => {
    const filtered = employees.filter((e) =>
      [e.name, e.designation, e.branch, e.department, e.email, e.employeeType]
        .some((v) => v?.toLowerCase().includes(search.toLowerCase()))
    );
    return [...filtered].sort((a, b) => {
      const av = (a[sortField] ?? "").toLowerCase();
      const bv = (b[sortField] ?? "").toLowerCase();
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
  }, [employees, search, sortField]);

  const SortBtn = ({ field, label }) => (
    <button
      onClick={() => onSortChange(field)}
      className={`text-xs px-2.5 py-1 rounded border transition-colors ${
        sortField === field
          ? "bg-gray-700 text-white border-gray-700"
          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-2 mb-4">
        <SortBtn field="name"        label="Sort by Name" />
        <SortBtn field="designation" label="Sort by Designation" />
        <SortBtn field="branch"      label="Sort by Branch" />
        <SortBtn field="department"  label="Sort by Department" />
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          {employees.length === 0 ? "No employees found." : "No results match your search."}
        </div>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                {["Name", "Designation", "Branch", "Department", "Employee Type", "Email"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.employeeId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-gray-800 whitespace-nowrap">{e.name || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{e.designation || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{e.branch || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{e.department || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{e.employeeType || "—"}</td>
                  <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{e.email || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmployeePopup({ title, fetchFn, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [sortField, setSortField] = useState("name");

  useEffect(() => {
    fetchFn()
      .then(setEmployees)
      .catch(() => setError("Failed to load employees. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
        style={{ width: "min(900px, 95vw)", height: "min(600px, 90vh)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
            {!loading && !error && (
              <p className="text-xs text-gray-400 mt-0.5">{employees.length} employee{employees.length !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pt-3 pb-1 flex-shrink-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, designation, email…"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-hidden px-5 py-3">
          {loading ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading employees…</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-sm text-red-500">{error}</div>
          ) : (
            <EmployeeTable
              employees={employees}
              search={search}
              sortField={sortField}
              onSortChange={setSortField}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { getRole, user } = useAuth();
  const role  = getRole();
  const email =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    user?.email ||
    "User";

  const isAdmin = role === "Admin" || role === "SuperAdmin";

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [popup, setPopup]     = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    getDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const openDeptPopup  = (item) => setPopup({ title: `${item.label} — Department`, fetchFn: () => getEmployeesByDepartment(item.id) });
  const openBranchPopup= (item) => setPopup({ title: `${item.label} — Branch`,     fetchFn: () => getEmployeesByBranch(item.id) });
  const openDesigPopup = (item) => setPopup({ title: `${item.label} — Designation`,fetchFn: () => getEmployeesByDesignation(item.id) });

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl select-none">👤</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Welcome back!</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Logged in as <span className="font-semibold text-gray-700">{email}</span>
                {" · "}
                <span className="text-xs text-gray-400">{role ?? "User"}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">🪪</div>
              <h3 className="font-semibold text-gray-800 text-lg">My Profile</h3>
              <p className="text-sm text-gray-500 mt-1">View your personal details, designation, department, and branch.</p>
            </div>
            <Link to="/employees" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">View Profile →</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-800 text-lg">My Salary</h3>
              <p className="text-sm text-gray-500 mt-1">View your salary slips, bonuses, deductions, and payment status.</p>
            </div>
            <Link to="/salaries" className="mt-4 inline-block text-sm text-blue-600 hover:underline font-medium">View Salary Slips →</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <p className="text-gray-500 text-sm">Loading dashboard…</p>;
  if (error)   return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <>
      {popup && (
        <EmployeePopup title={popup.title} fetchFn={popup.fetchFn} onClose={() => setPopup(null)} />
      )}

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            {role === "SuperAdmin" ? "SuperAdmin" : "Admin"} Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Employees" value={data.totalEmployees} />
            <StatCard label="Departments"     value={data.totalDepartments} />
            <StatCard label="Branches"        value={data.totalBranches} />
            <StatCard label="Designations"    value={data.totalDesignations} />
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartCard
                title="Employees by Department"
                data={data.departmentDistribution}
                barColor={BAR_COLOR_DEPT}
                barHoverColor={BAR_HOVER_DEPT}
                onBarClick={openDeptPopup}
              />
              <BarChartCard
                title="Employees by Branch"
                data={data.branchDistribution}
                barColor={BAR_COLOR_BRANCH}
                barHoverColor={BAR_HOVER_BRANCH}
                onBarClick={openBranchPopup}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChartCard
                title="Employees by Designation"
                data={data.designationDistribution}
                onSliceClick={openDesigPopup}
              />
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-gray-700">Quick Navigation</h3>
                <Link to="/employees"   className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <p className="font-semibold text-gray-700 text-sm">Employees</p>
                  <p className="text-xs text-gray-400 mt-0.5">View and manage all employee records</p>
                </Link>
                <Link to="/departments" className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <p className="font-semibold text-gray-700 text-sm">Departments</p>
                  <p className="text-xs text-gray-400 mt-0.5">Manage departments and structure</p>
                </Link>
                {role === "SuperAdmin" && (
                  <Link to="/users" className="block border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors">
                    <p className="font-semibold text-gray-700 text-sm">System Users</p>
                    <p className="text-xs text-gray-400 mt-0.5">Manage user accounts and roles</p>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
