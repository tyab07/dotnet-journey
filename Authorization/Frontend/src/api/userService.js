// User API service  (SuperAdmin only)
import api from "./authService";

export const getAllUsers = async () => {
  const res = await api.get("/auth/getallusers");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/auth/getuserbyid/${id}`);
  return res.data;
};

// POST /api/auth/register  (SuperAdmin only)
export const createUser = async (userDto) => {
  const { id, ...data } = userDto;
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const updateUser = async (userDto) => {
  const res = await api.put("/auth/updateuser", userDto);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/auth/deleteuser/${id}`);
  return res.data;
};
