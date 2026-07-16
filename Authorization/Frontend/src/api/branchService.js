// Branch API service
import api from "./authService";

// GET /api/branch/getallbranches
export const getAllBranches = async () => {
  const res = await api.get("/branch/getallbranches");
  return res.data; // { Success, Message, Data: [...] }
};

// GET /api/branch/getbranchbyid/:id
export const getBranchById = async (id) => {
  const res = await api.get(`/branch/getbranchbyid/${id}`);
  return res.data;
};

// POST /api/branch/addbranch
export const createBranch = async (branchDto) => {
  const { id, ...data } = branchDto;
  const res = await api.post("/branch/addbranch", data);
  return res.data;
};

// PUT /api/branch/updatebranch
export const updateBranch = async (branchDto) => {
  const res = await api.put("/branch/updatebranch", branchDto);
  return res.data;
};

// DELETE /api/branch/deletebrach{id}  ← note: typo in controller URL (no slash)
export const deleteBranch = async (id) => {
  const res = await api.delete(`/branch/deletebrach${id}`);
  return res.data;
};
