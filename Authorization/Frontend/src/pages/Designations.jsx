// ─── Designations page ────────────────────────────────────────────────────────
//
// This page shows a table of designations and lets Admin/SuperAdmin:
//   - View all designations
//   - Add a new designation
//   - Edit an existing designation
//   - Delete a designation
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import {
  getAllDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
} from "../api/designationService";

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
};

function Designations() {
  const { getRole } = useAuth();
  const isEmployee = getRole() === "Employee";

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadDesignations();
  }, []);

  const loadDesignations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllDesignations();
      // Res contains: { Success: true, Message: "...", Data: [...] }
      setDesignations(res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load designations.");
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

  const openEdit = (desig) => {
    setForm({
      id: desig.id,
      name: desig.name,
      description: desig.description ?? "",
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

    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        await updateDesignation(form);
      } else {
        await createDesignation(form);
      }
      setModalOpen(false);
      loadDesignations();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (desig) => {
    if (!window.confirm(`Delete designation "${desig.name}"?`)) return;
    try {
      await deleteDesignation(desig.id);
      loadDesignations();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading designations…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {designations.length} Designation{designations.length !== 1 ? "s" : ""}
        </h2>
        {!isEmployee && (
          <button
            onClick={openAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
          >
            + Add Designation
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {(isEmployee
                ? ["Name", "Description"]
                : ["Name", "Description", "Actions"]
              ).map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {designations.length === 0 ? (
              <tr>
                <td colSpan={isEmployee ? 2 : 3} className="px-4 py-8 text-center text-gray-400">
                  No designations found.
                </td>
              </tr>
            ) : (
              designations.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
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
        title={isEditing ? "Edit Designation" : "Add Designation"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Designation name" />
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

export default Designations;
