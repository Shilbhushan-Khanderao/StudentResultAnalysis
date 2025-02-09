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
