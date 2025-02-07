import axios from "./axios";

export const getUsers = async () => {
  const response = await axios.get(`/users`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`/users`, userData);
  return response.data;
};

export const assignRole = async (id, role) => {
  const response = await axios.post(`/users/${id}/assign-role?role=${role}`);
  return response.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`/users/${id}`);
};
