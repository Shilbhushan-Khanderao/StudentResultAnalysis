import axios from './axios';

// Fetch all students
export const getStudents = async () => {
    const response = await axios.get('/students');
    return response.data; // Returns a list of students
};

// Fetch all subjects
export const getSubjects = async () => {
    const response = await axios.get('/subjects'); 
    return response.data; // Returns a list of subjects
};

// Fetch all subjects
export const getBatches = async () => {
    const response = await axios.get('/batches'); 
    return response.data; // Returns a list of subjects
};