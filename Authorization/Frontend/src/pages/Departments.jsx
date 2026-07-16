// ─── Departments page ─────────────────────────────────────────────────────────
//
// This page shows a table of departments and lets Admin/SuperAdmin:
//   - View all departments
//   - Add a new department
//   - Edit an existing department
//   - Delete a department
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/departmentService";

const EMPTY_FORM = {
  id: "",
  name: "",
  hodName: "",
  description: "",
  location: "",
};

function Departments() {
  const { getRole } = useAuth();
  const isEmployee = getRole() === "Employee";

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllDepartments();
      // Res contains: { Success: true, Message: "...", Data: [...] }
      setDepartments(res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments.");
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

  const openEdit = (dept) => {
    setForm({
      id: dept.id,
      name: dept.name,
      hodName: dept.hodName,
      description: dept.description ?? "",
      location: dept.location ?? "",
    });
    setFormError("");
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Name is required."); return; }
    if (!form.hodName.trim()) { setFormError("HOD Name is required."); return; }

    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        await updateDepartment(form);
      } else {
        await createDepartment(form);
      }
      setModalOpen(false);
      loadDepartments();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete department "${dept.name}"?`)) return;
    try {
      await deleteDepartment(dept.id);
      loadDepartments();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading departments…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {departments.length} Department{departments.length !== 1 ? "s" : ""}
        </h2>
        {!isEmployee && (
          <button
            onClick={openAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
          >
            + Add Department
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {(isEmployee
                ? ["Name", "HOD", "Location", "Description"]
                : ["Name", "HOD", "Location", "Description", "Actions"]
              ).map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={isEmployee ? 4 : 5} className="px-4 py-8 text-center text-gray-400">
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                  <td className="px-4 py-3 text-gray-600">{d.hodName}</td>
                  <td className="px-4 py-3 text-gray-600">{d.location ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{d.description ?? "—"}</td>
                  {!isEmployee && (
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(d)} className="text-blue-600 hover:underline mr-3 text-xs">Edit</button>
                      <button onClick={() => handleDelete(d)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit Department" : "Add Department"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">HOD Name *</label>
            <input name="hodName" value={form.hodName} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HOD name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Building / Floor" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description" rows="3" />
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

export default Departments;
