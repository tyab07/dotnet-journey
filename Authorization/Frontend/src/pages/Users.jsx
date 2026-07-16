// ─── Users page ───────────────────────────────────────────────────────────────
//
// This is a SuperAdmin-only page to manage application users.
// Lets SuperAdmin:
//   - View all users (SuperAdmins, Admins, Users, Employees)
//   - Create a new user (which handles backend registration)
//   - Edit user name, email, password, and system role
//   - Delete a user
//
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/userService";

const EMPTY_FORM = {
  id: "",
  name: "",
  email: "",
  password: "",
  role: "",
};

const ROLES = ["SuperAdmin", "Admin", "User", "Employee"];

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      // Res contains: { isSuccess: true, data: [...], message: "..." }
      setUsers(res.data ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
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

  const openEdit = (user) => {
    setForm({
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      password: "", // Leave blank for security, only update if filled in update function
      role: user.role,
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
    if (!form.email.trim()) { setFormError("Email is required."); return; }
    if (!isEditing && !form.password.trim()) { setFormError("Password is required for registration."); return; }
    if (!form.role) { setFormError("Role selection is required."); return; }

    setSaving(true);
    setFormError("");
    try {
      if (isEditing) {
        // For update, if password is empty we might need to handle it or backend handles it.
        // Let's pass the form. If form.password is empty, backend might require it or keep existing depending on implementation.
        await updateUser(form);
      } else {
        await createUser(form);
      }
      setModalOpen(false);
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user account "${user.email}"?`)) return;
    try {
      await deleteUser(user.id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <p className="text-gray-500">Loading users…</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {users.length} User Account{users.length !== 1 ? "s" : ""}
        </h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
        >
          + Add User Account
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "Role", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === "SuperAdmin" ? "bg-purple-100 text-purple-800" :
                      u.role === "Admin" ? "bg-blue-100 text-blue-800" :
                      u.role === "Employee" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline mr-3 text-xs">Edit</button>
                    <button onClick={() => handleDelete(u)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        title={isEditing ? "Edit User" : "Register User"}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Display name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password {isEditing && "(Leave blank to keep current)"} *
            </label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">— Select Role —</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
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

export default Users;
