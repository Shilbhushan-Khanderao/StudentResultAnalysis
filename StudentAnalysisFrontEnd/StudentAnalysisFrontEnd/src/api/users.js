import axios from './axios';
const BASEURI = "http://localhost:8080/api"

export const getUsers = async () => {
    const response = await axios.get(`${BASEURI}/users`);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${BASEURI}/users/${id}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(`${BASEURI}/users`, userData);
    return response.data;
};

export const assignRole = async (id, role) => {
    const response = await axios.post(`${BASEURI}/users/${id}/assign-role?role=${role}`);
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${BASEURI}/users/${id}`);
};
