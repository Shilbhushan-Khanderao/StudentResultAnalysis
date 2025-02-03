import axios from './axios';
const BASEURI = "http://localhost:8080/api"

export const getSubjects = async () => {
    const response = await axios.get(`${BASEURI}/subjects`);
    return response.data;
};

export const getSubjectById = async (id) => {
    const response = await axios.get(`${BASEURI}/subjects/${id}`);
    return response.data;
};

export const createSubject = async (subjectData) => {
    const response = await axios.post(`${BASEURI}/subjects`, subjectData);
    return response.data;
};

export const updateSubject = async (id, subjectData) => {
    const response = await axios.put(`${BASEURI}/subjects/${id}`, subjectData);
    return response.data;
};

export const deleteSubject = async (id) => {
    await axios.delete(`${BASEURI}/subjects/${id}`);
};
