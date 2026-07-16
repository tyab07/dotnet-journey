// ─── Imports ──────────────────────────────────────────────────────────────────
// useState  → built-in React hook to hold local component state (e.g. loading, error)
import { useState } from "react";

// useForm   → from "react-hook-form"
//   WHY? Without it, you'd write useState for every field + manual validation logic.
//   useForm gives you: field registration, validation rules, and error messages in one hook.
import { useForm } from "react-hook-form";

// useNavigate → from "react-router-dom"
//   WHY? After a successful login we need to redirect the user to the dashboard.
//   useNavigate() returns a function you call like: navigate("/")
import { useNavigate } from "react-router-dom";

// useAuth → our own custom hook (lives in context/AuthContext.jsx)
//   WHY? We need to save the JWT token globally so all pages can access it.
//   We call login(token) here to store it after a successful API response.
import { useAuth } from "../context/AuthContext";

// loginUser → our axios function (lives in api/authService.js)
//   WHY? We keep all API calls in one place so if the URL changes we fix it in one file.
import { loginUser } from "../api/authService";

// ─── Component ────────────────────────────────────────────────────────────────
function Login() {
  // useAuth gives us the login() function to save the token globally
  const { login } = useAuth();

  // navigate() lets us go to a different page programmatically
  const navigate = useNavigate();

  // Local state: error message from the server (e.g. "Invalid password")
  const [serverError, setServerError] = useState("");

  // Local state: true while waiting for the API response (disables the button)
  const [isLoading, setIsLoading] = useState(false);

  // Local state: controls whether the password text is visible
  // false → type="password" (dots)   true → type="text" (readable)
  const [showPassword, setShowPassword] = useState(false);

  // ── react-hook-form setup ──────────────────────────────────────────────────
  // register  → connects an <input> to the form (replaces onChange + value)
  // handleSubmit → wraps your onSubmit; it validates first, then calls your function
  // formState.errors → object that holds validation error messages per field
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ── Form submit handler ────────────────────────────────────────────────────
  // "data" is the object with { email, password } — react-hook-form builds it automatically
  const onSubmit = async (data) => {
    setServerError(""); // clear any old error
    setIsLoading(true); // show loading state

    try {
      // Call the API — this sends: POST /api/auth/login  { email, password }
      // The backend returns: { isSuccess: true, data: { token, message }, message }
      const response = await loginUser(data.email, data.password);

      if (response.status && response.data?.token) {
        // Save the token in Context (and in localStorage via AuthContext)
        login(response.data.token);

        // Redirect to the home/dashboard page
        navigate("/", { replace: true });
      } else {
        // Backend returned success=false (wrong password, user not found, etc.)
        setServerError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      // ── Categorize the error precisely ──────────────────────────────────────
      //
      // err.code === "ERR_NETWORK"
      //   → The request never reached the server.
      //     Cause: backend is not running, or wrong port in authService.js
      //
      // err.response → the server DID reply but with an error status code
      //   err.response.status === 404 → controller returned NotFound()
      //     (your AuthController does this when the user email is not found)
      //   err.response.status === 400 → controller returned BadRequest()
      //     (your AuthController does this for a wrong password)
      //   err.response.data.message   → the exact message string from your .NET controller
      //
      // Everything else → unexpected error (e.g. 500 server crash)

      let msg = "An unexpected error occurred. Please try again.";

      if (err.code === "ERR_NETWORK") {
        // Backend is not reachable — most likely not running
        msg = "Cannot connect to the server. Please make sure the backend is running.";
      } else if (err.response) {
        // Server replied — use the message from the .NET controller
        // err.response.data is the full ResponseResult object your backend returns
        msg = err.response.data?.message || `Server error (${err.response.status})`;
      }

      setServerError(msg);
    } finally {
      // This always runs — whether success or error
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    /*
      Tailwind classes used here:
      min-h-screen       → full viewport height
      flex items-center justify-center → center the card vertically & horizontally
      bg-gray-100        → light gray page background
    */
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {/* Card container */}
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-8">

        {/* ── Header ── */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
          Sign In
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your credentials to continue
        </p>

        {/* ── Form ── */}
        {/*
          handleSubmit(onSubmit):
            react-hook-form intercepts the submit event,
            runs validation on all fields,
            and only calls onSubmit(data) if everything is valid.
        */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* ── Email field ── */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              /*
                ...register("email", { rules })
                  This connects the input to react-hook-form.
                  "email" is the field name → it shows up as data.email in onSubmit.
                  The rules object defines validation:
                    required → field cannot be empty
                    pattern  → must match email format
              */
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />

            {/* Show validation error if the email field has an error */}
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* ── Password field ── */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            {/* 
              NOTE (learn): In JSX, {comment} blocks are only valid between children,
              NOT between props. Use // comments above the element instead.

              The type prop switches based on showPassword state:
                showPassword = false → type="password" → browser shows dots
                showPassword = true  → type="text"     → browser shows plain text

              pr-10 adds right padding so text doesn't go under the Show/Hide button.
            */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full border rounded-md px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
              />

              {/*
                Toggle button — sits inside the input visually.
                type="button" is IMPORTANT: without it, clicking this button
                would submit the form (default type for <button> is "submit").

                onClick: flips showPassword between true and false.
                  (v) => !v  is shorthand for the current value flipped.
              */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1 select-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* ── Server error banner ── */}
          {/*
            Only renders if serverError is not an empty string.
            This shows errors that come from the backend (not from form validation).
          */}
          {serverError && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-md px-4 py-3 mb-4">
              {serverError}
            </div>
          )}

          {/* ── Submit button ── */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-md transition-colors"
          >
            {/*
              Show different text based on loading state:
              - isLoading = true  → "Signing in…"
              - isLoading = false → "Sign In"
            */}
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
