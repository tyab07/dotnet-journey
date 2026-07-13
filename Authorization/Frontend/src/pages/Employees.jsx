import React, { useEffect, useState } from "react";
import {
  getAllEmployees,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employeeApi";

const initialForm = {
  id: "",
  name: "",
  email: "",
  dob: "",
  department: "",
  position: "",
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load employees.");
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setIsEditing(false);
  };

  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data?.title === "string") {
      return data.title;
    }

    if (data?.errors) {
      const firstError = Object.values(data.errors)
        .flat()
        .find(Boolean);

      if (firstError) {
        return firstError;
      }
    }

    return "Something went wrong.";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      dob: formData.dob || null,
      department: formData.department.trim(),
      position: formData.position.trim(),
    };

    try {
      if (isEditing) {
        await updateEmployee(payload);
        setMessage("Employee updated successfully.");
      } else {
        await registerEmployee(payload);
        setMessage("Employee created successfully.");
      }

      await loadEmployees();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (employee) => {
    setFormData({
      ...employee,
      dob: employee.dob ? employee.dob.split("T")[0] : "",
    });
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(`Delete ${employee.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteEmployee(employee);
      setMessage("Employee deleted successfully.");
      await loadEmployees();
      if (isEditing && formData.id === employee.id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err) || "Delete failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Employees</h2>
          <p className="text-sm text-slate-600">Manage employee records with create, update, and delete actions.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          {employees.length} Records
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{isEditing ? "Edit Employee" : "Add Employee"}</h3>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={formData.id} />

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isEditing}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Department
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700 md:col-span-2">
            Position
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 transition focus:border-slate-400"
              required
            />
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
            >
              {isEditing ? "Update Employee" : "Save Employee"}
            </button>
            <span className="text-xs text-slate-500">Email is used as the lookup key for update and delete.</span>
          </div>
        </form>

        {message && <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-xs uppercase tracking-[0.2em] text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {employees?.map((employee) => (
                <tr key={employee.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{employee.name}</td>
                  <td className="px-4 py-3 text-slate-700">{employee.email}</td>
                  <td className="px-4 py-3 text-slate-700">{employee.dob ? new Date(employee.dob).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-3 text-slate-700">{employee.department}</td>
                  <td className="px-4 py-3 text-slate-700">{employee.position}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(employee)}
                        className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(employee)}
                        className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;