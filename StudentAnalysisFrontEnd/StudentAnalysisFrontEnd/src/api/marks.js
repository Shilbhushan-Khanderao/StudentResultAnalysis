import axios from './axios';

// Upload single subject marks
export const uploadSingleSubjectMarks = async (file, subjectName) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectName', subjectName);

    const response = await axios.post('/marks/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Upload multiple subjects marks
export const uploadMultipleSubjectsMarks = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/marks/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// Update marks for a single student
export const updateStudentMarks = async (rollNumber, subjectName, theoryMarks, iaMarks, labMarks) => {
    const response = await axios.put('/marks/update/single', {
        rollNumber,
        subjectName,
        theoryMarks,
        iaMarks,
        labMarks,
    });
    return response.data;
};
