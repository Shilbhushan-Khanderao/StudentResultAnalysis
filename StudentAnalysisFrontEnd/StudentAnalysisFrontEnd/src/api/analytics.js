import axios from './axios';

// Get top performers
export const getTopPerformers = async (batchId, limit) => {
    const response = await axios.get('/analytics/top-performers', {
        params: { batchId, limit },
    });
    return response.data; // Returns list of top performers
};

// Get subject-wise averages
export const getSubjectAverages = async () => {
    const response = await axios.get('/analytics/subject-averages');
    return response.data; // Returns subject averages
};

// Get batch-wise performance
export const getBatchPerformance = async () => {
    const response = await axios.get('/analytics/batch-performance');
    return response.data; // Returns batch performance metrics
};

// Get rank progress of a student
export const getRankProgress = async (studentId) => {
    const response = await axios.get('/analytics/rank-progress', {
        params: { studentId },
    });
    return response.data; // Returns rank progress
};
