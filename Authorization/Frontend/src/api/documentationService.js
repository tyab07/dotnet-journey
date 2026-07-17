import api from "./authService";

export const getAllDocumentations = () =>
  api.get("/EmployeeDocumentation/getalldocumentations").then((r) => r.data.data);

export const getDocumentationsByEmployeeId = (employeeId) =>
  api.get(`/EmployeeDocumentation/getbyemployeeid/${employeeId}`).then((r) => r.data.data);

export const uploadDocumentFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/EmployeeDocumentation/uploadfile", form, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

export const addDocumentation = (dto) =>
  api.post("/EmployeeDocumentation/adddocumentation", dto).then((r) => r.data);

export const deleteDocumentation = (id) =>
  api.delete(`/EmployeeDocumentation/deletedocumentation/${id}`).then((r) => r.data);

export const downloadDocumentUrl = (filePath) =>
  `http://localhost/api/EmployeeDocumentation/downloadfile?filePath=${encodeURIComponent(filePath)}`;
