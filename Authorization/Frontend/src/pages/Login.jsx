import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);

      // Your API returns:
      // {
      //   success: true,
      //   message: "...",
      //   data: {
      //      token: "..."
      //   }
      // }

      const token = response.data.data.token;

      loginUser(token);

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />

        {errors.email && (
          <p className="text-sm text-rose-600">
            {errors.email.message}
          </p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-slate-400"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 3,
              message: "Minimum length is 3",
            },
            maxLength: {
              value: 20,
              message: "Maximum length is 20",
            },
          })}
        />

        {errors.password && (
          <p className="text-sm text-rose-600">
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-400"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;