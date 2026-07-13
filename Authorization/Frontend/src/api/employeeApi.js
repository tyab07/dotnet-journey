import api from "./api";

export const getAllEmployees = () => {
    return api.get("/Employee/GetAllEmployees");
};

export const getEmployeeById = (id) => {
    return api.get(`/Employee/GetEmployeeById/${id}`);
};

export const registerEmployee = (employee) => {
    return api.post("/Employee/RegisterEmployee", employee);
};

export const updateEmployee = (employee) => {
    return api.put("/Employee/UpdateEmployee", employee);
};

export const deleteEmployee = (employee) => {
    return api.delete("/Employee/DeleteEmployee", {
        data: employee,
    });
};