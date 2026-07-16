// Department API service
import api from "./authService";

// GET /api/department/getAllDepartment
export const getAllDepartments = async () => {
  const res = await api.get("/department/getAllDepartment");
  return res.data;
};

// GET /api/department/getdepartmentbyid/:id
export const getDepartmentById = async (id) => {
  const res = await api.get(`/department/getdepartmentbyid/${id}`);
  return res.data;
};

// POST /api/department/addDepartment
export const createDepartment = async (dto) => {
  const { id, ...data } = dto;
  const res = await api.post("/department/addDepartment", data);
  return res.data;
};

// PUT /api/department/updateDepartment
export const updateDepartment = async (dto) => {
  const res = await api.put("/department/updateDepartment", dto);
  return res.data;
};

// DELETE /api/department/{id}
export const deleteDepartment = async (id) => {
  const res = await api.delete(`/department/${id}`);
  return res.data;
};
