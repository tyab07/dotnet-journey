// ─── Salaries page ─────────────────────────────────────────────────────────────
//
// This page shows a table of salary records and lets Admin/SuperAdmin:
//   - View all salary slips
//   - Add a new salary entry
//   - Edit an existing salary entry
//
// CONCEPTS to learn here:
//   Dynamic value calculations → Net Salary = Basic + Bonus - Deduction
//   Relational lookup in JS    → Matching the salary's EmployeeId with the
//     employee's name from our employees list.
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import {
  getAllSalaries,
  createSalary,
  updateSalary,
} from "../api/salaryService";
import { getAllEmployees } from "../api/employeeService";

const EMPTY_FORM = {
  id: "",
  employeeId: "",
  basicSalary: 0,
  bonus: 0,
  deduction: 0,
  paymentDate: "",
  status: "Pending",
};

function Salaries() {
  const { getRole } = useAuth();
  const isEmployee = getRole() === "Employee";

  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError("");
    try {
      if (isEmployee) {
        // Employee: backend filters salaries by JWT email → only their own slips returned.
        // We do NOT fetch the full employee list because employees cannot add/edit salaries.
        const salRes = await getAllSalaries();
        setSalaries(salRes.data ?? []);
      } else {
        // Admin / SuperAdmin: fetch both salaries and employees so we can resolve
        // EmployeeId → Employee Name in the dropdown and table.
        const [salRes, empRes] = await Promise.all([
          getAllSalaries(),
          getAllEmployees(),
        ]);
        setSalaries(salRes.data ?? []);
        setEmployees(empRes.data ?? []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load salary details.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setIsEditing(false);
    setModalOpen(true);
  };

  const openEdit = (sal) => {
    setForm({
      id: sal.id,
      employeeId: sal.employeeId,
      basicSalary: sal.basicSalary,
      bonus: sal.bonus,
      deduction: sal.deduction,
      paymentDate: sal.paymentDate ? sal.paymentDate.split("T")[0] : "",
      status: sal.status,
    });
    setFormError("");
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep numbers numeric in the state
    const isNumber = ["basicSalary", "bonus", "deduction"].includes(name);
    setForm((prev) => ({
      ...prev,
      [name]: isNumber ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    if (!form.employeeId) { setFormError("Employee selection is required."); return; }
    if (form.basicSalary <= 0) { setFormError("Basic salary must be greater than 0."); return; }
    if (!form.paymentDate) { setFormError("Payment date is required."); return; }

    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        await updateSalary(form);
      } else {
        await createSalary(form);
      }
      setModalOpen(false);
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // Helper to map EmployeeId -> Employee Name
  const getEmployeeName = (empId) => {
    const emp = employees.find((e) => e.id === empId);
    return emp ? emp.name : "Unknown Employee";
  };

  if (loading) return <p className="text-gray-500">Loading salary entries…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // ══════════════════════════════════════════════════════════════════════════
  // EMPLOYEE VIEW — read-only salary slip cards (only their own records)
  // ══════════════════════════════════════════════════════════════════════════
  if (isEmployee) {
    if (salaries.length === 0) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center max-w-lg mx-auto mt-8">
          <div className="text-4xl mb-4">💰</div>
          <h2 className="text-lg font-semibold text-gray-800">No Salary Records</h2>
          <p className="text-sm text-gray-500 mt-2">
            No salary slips have been issued for your account yet.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          My Salary Slips ({salaries.length})
        </h2>

        {salaries.map((sal) => {
          const net = sal.basicSalary + sal.bonus - sal.deduction;
          const isPaid = sal.status === "Paid";
          return (
            <div key={sal.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {/* Slip header — plain gray bar */}
              <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  {sal.paymentDate
                    ? new Date(sal.paymentDate).toLocaleDateString(undefined, { month: "long", year: "numeric" })
                    : "Salary Slip"}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {sal.status}
                </span>
              </div>

              {/* Slip body */}
              <div className="px-5 py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Basic Salary</span>
                  <span className="text-gray-800">RS {sal.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bonus</span>
                  <span className="text-gray-800">+RS {sal.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deductions</span>
                  <span className="text-gray-800">-RS {sal.deduction.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Net Salary</span>
                  <span className="font-bold text-gray-900">RS {net.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ADMIN / SUPERADMIN VIEW — full table + CRUD
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {salaries.length} Salary Entr{salaries.length !== 1 ? "ies" : "y"}
        </h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
        >
          + Add Salary Entry
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Employee Name", "Basic Salary", "Bonus", "Deductions", "Net Salary", "Payment Date", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salaries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No salary records found.
                </td>
              </tr>
            ) : (
              salaries.map((sal) => {
                const netSalary = sal.basicSalary + sal.bonus - sal.deduction;
                return (
                  <tr key={sal.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{getEmployeeName(sal.employeeId)}</td>
                    <td className="px-4 py-3 text-gray-600">RS{sal.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600">+RS{sal.bonus.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-500">-RS{sal.deduction.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">RS{netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {sal.paymentDate ? new Date(sal.paymentDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        sal.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {sal.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(sal)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit Salary Record" : "Add Salary Record"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Employee *</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange}
              disabled={isEditing} // Cannot change employee for an existing record
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
              <option value="">— Select Employee —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Basic Salary *</label>
            <input name="basicSalary" type="number" min="0" value={form.basicSalary} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bonus</label>
            <input name="bonus" type="number" min="0" value={form.bonus} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Deduction</label>
            <input name="deduction" type="number" min="0" value={form.deduction} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-800">
              Calculated Net Salary: RS{(form.basicSalary + form.bonus - form.deduction).toLocaleString()}
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Payment Date *</label>
            <input name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status *</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

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

export default Salaries;
