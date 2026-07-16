// Salary API service
import api from "./authService";

// GET /api/salary/salaries
export const getAllSalaries = async () => {
  const res = await api.get("/salary/salaries");
  return res.data; // { isSuccess, data: [...], message }
};

// GET /api/salary/getsalarybyid/{id}
export const getSalaryById = async (id) => {
  const res = await api.get(`/salary/getsalarybyid/${id}`);
  return res.data;
};

// POST /api/salary/addsalary
export const createSalary = async (salaryDto) => {
  const { id, ...data } = salaryDto;
  const res = await api.post("/salary/addsalary", data);
  return res.data;
};

// PUT /api/salary/updatesalary
export const updateSalary = async (salaryDto) => {
  const res = await api.put("/salary/updatesalary", salaryDto);
  return res.data;
};
