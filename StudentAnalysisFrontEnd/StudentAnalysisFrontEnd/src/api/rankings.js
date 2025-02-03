import axios from './axios';
const BASEURI = "http://localhost:8080/api"

export const getRankings = async () => {
    const response = await axios.get(`${BASEURI}/rankings`);
    return response.data;
};

export const getStudentRanking = async (studentId) => {
    const response = await axios.get(`${BASEURI}/rankings/${studentId}`);
    return response.data;
};

export const calculateRanks = async () => {
    await axios.get(`${BASEURI}/rankings/calculate`);
};
