import axios from "./axios";

export const getRankings = async () => {
  const response = await axios.get(`/rankings`);
  return response.data;
};

export const getStudentRanking = async (studentId) => {
  const response = await axios.get(`/rankings/${studentId}`);
  return response.data;
};

export const calculateRanks = async () => {
  await axios.get(`/rankings/calculate`);
};
