// ─── Branches page ─────────────────────────────────────────────────────────────
//
// This page shows a table of branches and lets Admin/SuperAdmin:
//   - View all branches
//   - Add a new branch
//   - Edit an existing branch
//   - Delete a branch
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../api/branchService";

const EMPTY_FORM = {
  id: "",
  name: "",
  address: "",
  city: "",
  phoneNumber: "",
};

function Branches() {
  const { getRole } = useAuth();
  const isEmployee = getRole() === "Employee";

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllBranches();
      // Res contains: { Success: true, Message: "...", Data: [...] }
      setBranches(res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load branches.");
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

  const openEdit = (branch) => {
    setForm({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phoneNumber: branch.phoneNumber ?? "",
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
    if (!form.address.trim()) { setFormError("Address is required."); return; }
    if (!form.city.trim()) { setFormError("City is required."); return; }

    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        await updateBranch(form);
      } else {
        // Send create branch request.
        // We omit id when creating or let the server overwrite it
        await createBranch(form);
      }
      setModalOpen(false);
      loadBranches();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (branch) => {
    if (!window.confirm(`Delete branch "${branch.name}"?`)) return;
    try {
      await deleteBranch(branch.id);
      loadBranches();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading branches…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {branches.length} Branch{branches.length !== 1 ? "es" : ""}
        </h2>
        {!isEmployee && (
          <button
            onClick={openAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
          >
            + Add Branch
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {(isEmployee
                ? ["Name", "Address", "City", "Phone Number"]
                : ["Name", "Address", "City", "Phone Number", "Actions"]
              ).map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {branches.length === 0 ? (
              <tr>
                <td colSpan={isEmployee ? 4 : 5} className="px-4 py-8 text-center text-gray-400">
                  No branches found.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{b.name}</td>
                  <td className="px-4 py-3 text-gray-600">{b.address}</td>
                  <td className="px-4 py-3 text-gray-600">{b.city}</td>
                  <td className="px-4 py-3 text-gray-600">{b.phoneNumber ?? "—"}</td>
                  {!isEmployee && (
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(b)} className="text-blue-600 hover:underline mr-3 text-xs">Edit</button>
                      <button onClick={() => handleDelete(b)} className="text-red-500 hover:underline text-xs">Delete</button>
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
        title={isEditing ? "Edit Branch" : "Add Branch"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Branch name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
            <input name="city" value={form.city} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="555-0199" />
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

export default Branches;
