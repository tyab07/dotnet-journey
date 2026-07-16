import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login         from "./pages/Login";
import Dashboard     from "./pages/Dashboard";
import Employees     from "./pages/Employees";
import Branches      from "./pages/Branches";
import Departments   from "./pages/Departments";
import Designations  from "./pages/Designations";
import EmployeeTypes from "./pages/EmployeeTypes";
import Salaries      from "./pages/Salaries";
import Users         from "./pages/Users";
import Unauthorized  from "./pages/Unauthorized";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute  from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route — no token required */}
        <Route path="/login" element={<Login />} />

        {/* Protected layout — all children share the Sidebar + Topbar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* index → matches exactly "/" and renders the Dashboard page */}
          <Route index element={<Dashboard />} />

          {/* Admin + SuperAdmin + Employee routes */}
          <Route path="employees"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin", "Employee"]}><Employees /></ProtectedRoute>}
          />
          <Route path="branches"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin"]}><Branches /></ProtectedRoute>}
          />
          <Route path="departments"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin"]}><Departments /></ProtectedRoute>}
          />
          <Route path="designations"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin"]}><Designations /></ProtectedRoute>}
          />
          <Route path="employee-types"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin"]}><EmployeeTypes /></ProtectedRoute>}
          />
          <Route path="salaries"
            element={<ProtectedRoute roles={["Admin", "SuperAdmin", "Employee"]}><Salaries /></ProtectedRoute>}
          />

          {/* SuperAdmin only */}
          <Route path="users"
            element={<ProtectedRoute roles={["SuperAdmin"]}><Users /></ProtectedRoute>}
          />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Any unknown URL → redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;