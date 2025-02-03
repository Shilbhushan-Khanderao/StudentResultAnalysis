import axios from './axios';
const BASEURI = "http://localhost:8080/api"

export const getStudents = async () => {
    const response = await axios.get(`${BASEURI}/students`);
    return response.data;
};

export const getStudentById = async (id) => {
    const response = await axios.get(`${BASEURI}/students/${id}`);
    return response.data;
};

export const createStudent = async (studentData) => {
    const response = await axios.post(`${BASEURI}/students`, studentData);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await axios.put(`${BASEURI}/students/${id}`, studentData);
    return response.data;
};

export const deleteStudent = async (id) => {
    await axios.delete(`${BASEURI}/students/${id}`);
};
