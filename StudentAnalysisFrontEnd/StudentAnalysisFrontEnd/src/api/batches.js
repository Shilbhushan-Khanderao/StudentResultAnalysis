import axios from './axios';
const BASEURI = "http://localhost:8080/api"

export const getBatches = async () => {
    const response = await axios.get(`${BASEURI}/batches`);
    return response.data;
};

export const getBatchById = async (id) => {
    const response = await axios.get(`${BASEURI}/batches/${id}`);
    return response.data;
};

export const createBatch = async (batchData) => {
    const response = await axios.post(`${BASEURI}/batches`, batchData);
    return response.data;
};

export const updateBatch = async (id, batchData) => {
    const response = await axios.put(`${BASEURI}/batches/${id}`, batchData);
    return response.data;
};

export const deleteBatch = async (id) => {
    await axios.delete(`${BASEURI}/batches/${id}`);
};
