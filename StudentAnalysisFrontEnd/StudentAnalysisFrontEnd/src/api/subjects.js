import axios from "./axios";

export const getSubjects = async () => {
  const response = await axios.get(`/subjects`);
  console.log(response.data);
  return response.data;
};

export const getSubjectById = async (id) => {
  const response = await axios.get(`/subjects/${id}`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axios.post(`/subjects`, subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await axios.put(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  await axios.delete(`/subjects/${id}`);
};
