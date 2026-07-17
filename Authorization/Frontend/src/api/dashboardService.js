import api from "./authService";

export const getDashboard = () =>
  api.get("/Dashboard/getDashboard").then((r) => r.data);

export const getEmployeesByDepartment = (departmentId) =>
  api.get(`/Dashboard/department/${departmentId}/employees`).then((r) => r.data.data);

export const getEmployeesByBranch = (branchId) =>
  api.get(`/Dashboard/branch/${branchId}/employees`).then((r) => r.data.data);

export const getEmployeesByDesignation = (designationId) =>
  api.get(`/Dashboard/designation/${designationId}/employees`).then((r) => r.data.data);
