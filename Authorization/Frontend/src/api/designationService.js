// Designation API service
import api from "./authService";

export const getAllDesignations = async () => {
  const res = await api.get("/designation/getalldesignations");
  return res.data;
};

export const createDesignation = async (dto) => {
  const { id, ...data } = dto;
  const res = await api.post("/designation/adddesignation", data);
  return res.data;
};

export const updateDesignation = async (dto) => {
  const res = await api.put("/designation/updatedesignation", dto);
  return res.data;
};

export const deleteDesignation = async (id) => {
  const res = await api.delete(`/designation/deletedesignation/${id}`);
  return res.data;
};
