import axios from "./axios";

// Fetch top N students (Leaderboard)
export const getLeaderboard = async (limit = 10) => {
  const response = await axios.get(`rankings/leaderboard?limit=${limit}`);
  return response.data;
};

// Fetch rankings for a specific batch
export const getBatchRankings = async (batchId) => {
  const response = await axios.get(`rankings/batch/${batchId}`);
  return response.data;
};

// Calculate and update rankings
export const calculateRanks = async () => {
  await axios.get(`/rankings/calculate`);
};

// Fetch student ranking history
export const getRankingHistory = async (studentId) => {
  const response = await axios.get(`/rankings/history/${studentId}`);
  return response.data;
};

// Fetch student ranking comparison
export const getRankComparison = async (studentId) => {
  const response = await axios.get(`/rankings/compare/${studentId}`);
  return response.data;
};