import React, { useState } from "react";
import { registerUser } from "../api/authApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "User",
};

const Users = () => {
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [statusType, setStatusType] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const extractResponseMessage = (response) => {
    const data = response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    if (typeof data?.data?.message === "string") {
      return data.data.message;
    }

    if (typeof data?.data === "string") {
      return data.data;
    }

    return null;
  };

  const getErrorMessage = (err) => {
    const data = err.response?.data;

    if (typeof data === "string") {
      return data;
    }

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

    if (err.message) {
      return err.message;
    }

    return "Unable to create user.";
  };

  const handleChange = (event) => {
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
    setStatusType("idle");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      console.log("[Users Page] Submitting register payload:", payload);

      const response = await registerUser(payload);
      console.log("[Users Page] Register response:", response);

      const resultMessage = extractResponseMessage(response) || "User created successfully.";

      setStatusType("success");
      setMessage(resultMessage);
      setFormData(initialForm);
    } catch (err) {
      console.error("[Users Page] Register failed:", err);
      setStatusType("error");
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
        SuperAdmin Access
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Users Management</h2>
        <p className="mt-2 text-slate-600">Only SuperAdmin can access this page.</p>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-500"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-500"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Password
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 pr-20 text-slate-900 outline-none transition focus:border-emerald-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Role
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-emerald-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </select>
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>

        {statusType === "success" && message && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            {message}
          </div>
        )}

        {statusType === "error" && error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;