import axios from "./axios";

// Upload students via CSV
export const uploadStudents = async (formData) => {
  try {
    const response = await axios.post(`/students/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudents = async () => {
  const response = await axios.get(`/students`);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await axios.post(`/students`, studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`/students/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  await axios.delete(`/students/${id}`);
};
