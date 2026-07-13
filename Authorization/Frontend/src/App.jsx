import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <ProtectedRoute
                                roles={["Admin", "SuperAdmin", "User", "Employee"]}
                            >
                                <Employees />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="employees"
                        element={
                            <ProtectedRoute
                                roles={["Admin", "SuperAdmin", "User", "Employee"]}
                            >
                                <Employees />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="users"
                        element={
                            <ProtectedRoute
                                roles={["SuperAdmin"]}
                            >
                                <Users />
                            </ProtectedRoute>
                        }
                    />

                </Route>

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;