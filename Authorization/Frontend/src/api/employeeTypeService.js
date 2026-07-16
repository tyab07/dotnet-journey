// Employee Type API service
import api from "./authService";

export const getAllEmployeeTypes = async () => {
  const res = await api.get("/employeetype/getallemployeetypes");
  return res.data;
};

export const createEmployeeType = async (dto) => {
  const { id, ...data } = dto;
  const res = await api.post("/employeetype/addemployeetype", data);
  return res.data;
};

export const updateEmployeeType = async (dto) => {
  const res = await api.put("/employeetype/updateemployeetype", dto);
  return res.data;
};

export const deleteEmployeeType = async (id) => {
  const res = await api.delete(`/employeetype/deleteemployeetype/${id}`);
  return res.data;
};
