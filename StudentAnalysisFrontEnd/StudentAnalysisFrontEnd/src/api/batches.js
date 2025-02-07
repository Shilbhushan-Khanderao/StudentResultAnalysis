import axios from "./axios";

export const getBatches = async () => {
  const response = await axios.get(`/batches`);
  return response.data;
};

export const getBatchById = async (id) => {
  const response = await axios.get(`/batches/${id}`);
  return response.data;
};

export const createBatch = async (batchData) => {
  const response = await axios.post(`/batches`, batchData);
  return response.data;
};

export const updateBatch = async (id, batchData) => {
  const response = await axios.put(`/batches/${id}`, batchData);
  return response.data;
};

export const deleteBatch = async (id) => {
  await axios.delete(`/batches/${id}`);
};
