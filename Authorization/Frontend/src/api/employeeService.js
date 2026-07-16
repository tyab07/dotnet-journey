// Employee API service
// All functions use the shared api instance (interceptor adds token automatically)
import api from "./authService";

// ─── Helper: sanitize DTO before sending ──────────────────────────────────────
//
// WHY THIS EXISTS:
//   C# has strict types. For example, DepartmentId is `Guid?` in the DTO.
//   If we send an empty string "" for that field, .NET's model binder tries to
//   parse "" as a Guid, fails, and returns 400 Bad Request.
//
// FIX:
//   We convert any "" (empty string) FK field values to null before the request.
//   .NET happily accepts null for a Guid? property.
//
//   We also strip the dob field entirely if it's empty/null, so the backend
//   gets no dob rather than an unparseable empty value.
//
// ─────────────────────────────────────────────────────────────────────────────
const sanitizeEmployee = (dto) => {
  const guidFields = ["departmentId", "designationId", "branchId", "employeeTypeId"];
  const clean = { ...dto };

  // Convert empty strings to null for all Guid? fields
  guidFields.forEach((field) => {
    if (clean[field] === "") clean[field] = null;
  });

  // Strip dob if empty (DateOnly? can't parse "")
  if (!clean.dob) delete clean.dob;

  return clean;
};

// GET /api/employee/GetAllEmployees
export const getAllEmployees = async () => {
  const res = await api.get("/employee/GetAllEmployees");
  return res.data; // { status, data: [...], message }
};

// GET /api/employee/GetEmployeeById/:id
export const getEmployeeById = async (id) => {
  const res = await api.get(`/employee/GetEmployeeById/${id}`);
  return res.data;
};

// POST /api/employee/RegisterEmployee
export const createEmployee = async (employeeDto) => {
  const { id, ...rest } = employeeDto; // Remove empty id
  const data = sanitizeEmployee(rest); // Clean up empty Guid fields
  const res = await api.post("/employee/RegisterEmployee", data);
  return res.data;
};

// PUT /api/employee/UpdateEmployee
export const updateEmployee = async (employeeDto) => {
  const data = sanitizeEmployee(employeeDto); // Clean up empty Guid fields
  const res = await api.put("/employee/UpdateEmployee", data);
  return res.data;
};

// DELETE /api/employee/DeleteEmployee
// NOTE: your controller accepts the full EmployeeDto in the body (not just an id)
export const deleteEmployee = async (employeeDto) => {
  const res = await api.delete("/employee/DeleteEmployee", { data: employeeDto });
  return res.data;
};
