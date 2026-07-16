// ─── Employees page ───────────────────────────────────────────────────────────
//
// This page has two completely different views depending on role:
//
//   Employee role  → Shows ONLY the logged-in employee's own profile card.
//                    The backend already filters the data by the JWT email claim,
//                    so only one record comes back. We render it as a read-only card.
//
//   Admin / SuperAdmin → Full CRUD table: view all employees, add, edit, delete.
//
// CONCEPTS you'll learn here:
//   useState  → holds the list of employees, form data, modal open state
//   useEffect → loads data when the component first mounts
//   async/await → waiting for API responses
//   Conditional rendering → showing/hiding the modal OR the profile card
//   Controlled form → simple useState because the fields (FK dropdowns) are dynamic
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeService";
import { getAllBranches }       from "../api/branchService";
import { getAllDepartments }    from "../api/departmentService";
import { getAllDesignations }   from "../api/designationService";
import { getAllEmployeeTypes }  from "../api/employeeTypeService";

// Empty form state — used when opening the "Add" modal
const EMPTY_FORM = {
  id: "",
  name: "",
  email: "",
  dob: "",
  departmentId: "",
  designationId: "",
  branchId: "",
  employeeTypeId: "",
};

function Employees() {
  const { getRole } = useAuth();
  const isEmployee = getRole() === "Employee";

  // ── State ──────────────────────────────────────────────────────────────────
  const [employees, setEmployees]     = useState([]);   // the list from the API
  const [branches, setBranches]       = useState([]);   // for the dropdown
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [empTypes, setEmpTypes]       = useState([]);

  const [loading, setLoading]         = useState(true); // initial load
  const [error, setError]             = useState("");

  const [modalOpen, setModalOpen]     = useState(false);
  const [isEditing, setIsEditing]     = useState(false);  // add vs edit mode
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  // ── Load all data on first render ─────────────────────────────────────────
  // useEffect with empty dependency array [] runs once when component mounts.
  // This is equivalent to "componentDidMount" in class components.
  useEffect(() => {
    loadAll();
  }, []); // ← empty array means "run once on mount"

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      if (isEmployee) {
        // Employee: backend filters by JWT email → returns only their own record
        const empRes = await getAllEmployees();
        setEmployees(empRes.data ?? []);
      } else {
        // Admin/SuperAdmin: run all API calls in parallel — faster than one-by-one
        // Promise.all waits for ALL of them to finish
        const [empRes, branchRes, deptRes, desigRes, typeRes] = await Promise.all([
          getAllEmployees(),
          getAllBranches(),
          getAllDepartments(),
          getAllDesignations(),
          getAllEmployeeTypes(),
        ]);

        // Employee API uses ResponseResult wrapper: { isSuccess, data: [...] }
        setEmployees(empRes.data ?? []);

        // Other APIs use: { success, data: [...] } (camelCase after ASP.NET serialization)
        setBranches(branchRes.data ?? []);
        setDepartments(deptRes.data ?? []);
        setDesignations(desigRes.data ?? []);
        setEmpTypes(typeRes.data ?? []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open Add modal ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setIsEditing(false);
    setModalOpen(true);
  };

  // ── Open Edit modal — pre-fill the form with the selected row's data ───────
  const openEdit = (emp) => {
    // CONCEPT — DateOnly serialization:
    //   .NET's DateOnly type comes from the backend as "2000-01-15" (ISO string).
    //   HTML <input type="date"> needs exactly that format, so we just pass it through.
    //   If it's null/undefined, we use empty string so the input is blank.
    const dobStr = emp.dob
      ? (typeof emp.dob === "string" ? emp.dob.split("T")[0] : "")
      : "";

    setForm({
      id:             emp.id,
      name:           emp.name,
      email:          emp.email ?? "",
      dob:            dobStr,
      departmentId:   emp.departmentId ?? "",
      designationId:  emp.designationId ?? "",
      branchId:       emp.branchId ?? "",
      employeeTypeId: emp.employeeTypeId ?? "",
    });
    setFormError("");
    setIsEditing(true);
    setModalOpen(true);
  };

  // ── Handle form field changes ──────────────────────────────────────────────
  // A single handler for all fields using the input's "name" attribute.
  // e.target.name  → which field changed (e.g. "name", "email")
  // e.target.value → the new value
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Save (Add or Edit) ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        await updateEmployee(form);
      } else {
        await createEmployee(form);
      }
      setModalOpen(false);
      loadAll(); // refresh the table
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete employee "${emp.name}"?`)) return;
    try {
      await deleteEmployee(emp); // your controller takes the full EmployeeDto
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  // ── Common loading / error states ──────────────────────────────────────────
  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (error)   return <p className="text-red-500">{error}</p>;

  // ══════════════════════════════════════════════════════════════════════════
  // EMPLOYEE VIEW — personal profile card (read-only)
  // ══════════════════════════════════════════════════════════════════════════
  if (isEmployee) {
    const emp = employees[0]; // backend returns only the logged-in employee's record

    if (!emp) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-lg mx-auto mt-8">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-lg font-semibold text-gray-800">No Profile Found</h2>
          <p className="text-sm text-gray-500 mt-2">
            Your employee profile has not been set up yet. Please contact your Admin.
          </p>
        </div>
      );
    }

    // Helper — formats an ISO date string to a human-readable date
    const formatDate = (dob) => {
      if (!dob) return "—";
      try { return new Date(dob).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }); }
      catch { return dob; }
    };

    // Helper — renders a single label/value row inside a details card
    const InfoRow = ({ label, value }) => (
      <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0">
        <span className="sm:w-40 text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="mt-0.5 sm:mt-0 text-sm font-medium text-gray-800">{value || "—"}</span>
      </div>
    );

    return (
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── Profile header ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl select-none">
            👤
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{emp.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{emp.designationName ?? "Employee"}</p>
            <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
              {emp.employeeTypeName ?? "—"}
            </span>
          </div>
        </div>

        {/* ── Personal information card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-5 py-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">
            Personal Information
          </h3>
          <InfoRow label="Full Name"     value={emp.name} />
          <InfoRow label="Email"         value={emp.email} />
          <InfoRow label="Date of Birth" value={formatDate(emp.dob)} />
        </div>

        {/* ── Work details card ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-5 py-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">
            Work Details
          </h3>
          <InfoRow label="Department"    value={emp.departmentName} />
          <InfoRow label="Designation"   value={emp.designationName} />
          <InfoRow label="Branch"        value={emp.branchName} />
          <InfoRow label="Employee Type" value={emp.employeeTypeName} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN / SUPERADMIN VIEW — full CRUD table
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div>
      {/* Page header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {employees.length} Employee{employees.length !== 1 ? "s" : ""}
        </h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
        >
          + Add Employee
        </button>
      </div>

      {/* Data table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "Department", "Designation", "Branch", "Type", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{emp.name}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.email ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.departmentName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.designationName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.branchName ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{emp.employeeTypeName ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(emp)} className="text-blue-600 hover:underline mr-3 text-xs">Edit</button>
                    <button onClick={() => handleDelete(emp)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit Employee" : "Add Employee"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
            <input name="dob" type="date" value={form.dob} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Dropdowns for Foreign Keys */}
          {[
            { label: "Department",     name: "departmentId",   list: departments },
            { label: "Designation",    name: "designationId",  list: designations },
            { label: "Branch",         name: "branchId",       list: branches },
            { label: "Employee Type",  name: "employeeTypeId", list: empTypes },
          ].map(({ label, name, list }) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <select name={name} value={form[name]} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select —</option>
                {list.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          ))}

          {formError && <p className="text-red-500 text-xs">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Employees;
