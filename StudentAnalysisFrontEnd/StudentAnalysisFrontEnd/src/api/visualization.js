import axios from "./axios";

// Fetch student performance data for visualization
export const getStudentPerformanceData = async (studentId) => {
  const response = await axios.get(`/visuals/student/${studentId}`);
  return response.data; // Returns performance data
};

// Fetch batch performance data for visualization
export const getBatchPerformanceData = async (batchId) => {
  const response = await axios.get(`/visuals/batch/${batchId}`);
  return response.data; // Returns batch performance data
};
