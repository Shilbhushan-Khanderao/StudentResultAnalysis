import axios from './axios';

// Get student trend data
export const getStudentTrend = async (studentId) => {
    const response = await axios.get('/trends/student-trend', {
        params: { studentId },
    });
    return response.data; // Returns trend data
};

// Get subject-wise trend
export const getSubjectTrend = async (subjectId) => {
    const response = await axios.get('/trends/subject-trend', {
        params: { subjectId },
    });
    return response.data; // Returns subject trend
};
