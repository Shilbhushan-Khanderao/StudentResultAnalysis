import axios from "./axios";

// Fetch Marksheet data
export const fetchMarksheet = async (batchId) => {
  try {
    const response = await axios.get(`/marks/marksheet?batchId=${batchId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching marksheet data", error);
    return [];
  }
};

// Fetch marksheet for selected subjects
export const fetchMarksheetForSubjects = async (batchId, subjectIds) => {
  const queryParams = new URLSearchParams();
  queryParams.append("batchId", batchId);

  subjectIds.forEach((id) => {
    queryParams.append("subjectIds", id);
  });

  const response = await axios.get(
    `/marks/marksheet/subjects?${queryParams.toString()}`
  );
  return response.data.data;
};

// Upload single subject marks
export const uploadSingleSubjectMarks = async (file, subjectName) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subjectName", subjectName);

  const response = await axios.post("/marks/upload/single", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Upload multiple subjects marks
export const uploadMultipleSubjectsMarks = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/marks/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update marks for a single student
export const updateStudentMarks = async (
  rollNumber,
  subjectName,
  theoryMarks,
  iaMarks,
  labMarks
) => {
  const response = await axios.put("/marks/update/single", {
    rollNumber,
    subjectName,
    theoryMarks,
    iaMarks,
    labMarks,
  });
  return response.data;
};

// Delete a specific subject’s score for a student
export const deleteStudentSubjectScore = async (studentId, subjectId) => {
  await axios.delete(`/marks/student/${studentId}/subject/${subjectId}`);
};

// Delete all subject scores for a student
export const deleteAllScoresForStudent = async (studentId) => {
  await axios.delete(`/marks/student/${studentId}/all`);
};

// Delete a specific subject’s score for all students
export const deleteSubjectScoresForAll = async (subjectId) => {
  await axios.delete(`/marks/subject/${subjectId}/all`);
};

// Delete all scores for all students
export const deleteAllScores = async () => {
  await axios.delete(`/marks/all`);
};
