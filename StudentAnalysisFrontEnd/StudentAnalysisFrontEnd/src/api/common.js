import axios from './axios';

// Fetch all students
export const getStudents = async () => {
    const response = await axios.get('/students'); // Adjust endpoint as needed
    return response.data; // Returns a list of students
};

// Fetch all subjects
export const getSubjects = async () => {
    const response = await axios.get('/subjects'); // Adjust endpoint as needed
    return response.data; // Returns a list of subjects
};

// Fetch all subjects
export const getBatches = async () => {
    const response = await axios.get('/batches'); // Adjust endpoint as needed
    return response.data; // Returns a list of subjects
};