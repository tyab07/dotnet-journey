import api from "./api";

export const login = (data) => {
  return api.post("/Auth/login", data);
};

export const register = (data) => {
  return api.post("/Auth/register", data);
};

export const registerUser = (data) => {
  return api.post("/Auth/register", data);
};