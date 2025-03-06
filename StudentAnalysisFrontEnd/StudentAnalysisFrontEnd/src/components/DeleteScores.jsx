import React, { useState, useEffect } from "react";
import {
  deleteStudentSubjectScore,
  deleteAllScoresForStudent,
  deleteSubjectScoresForAll,
  deleteAllScores,
} from "../api/marks";
import { getStudents } from "../api/students";
import { getSubjects } from "../api/subjects";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

const DeleteScores = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    getStudents().then(setStudents);
    getSubjects().then(setSubjects);
  }, []);

  const handleDeleteScore = async (type) => {
    if (type === "single" && selectedStudent && selectedSubject) {
      await deleteStudentSubjectScore(selectedStudent, selectedSubject);
      alert("Deleted subject score for student");
    } else if (type === "allStudent" && selectedStudent) {
      await deleteAllScoresForStudent(selectedStudent);
      alert("Deleted all scores for student");
    } else if (type === "allSubject" && selectedSubject) {
      await deleteSubjectScoresForAll(selectedSubject);
      alert("Deleted all scores for subject");
    } else if (type === "all") {
      await deleteAllScores();
      alert("Deleted all scores");
    } else {
      alert("Please select required fields");
    }
  };

  return (
    <Box>
      <Typography variant="h6">Delete Scores</Typography>

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Select Student</InputLabel>
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name} ({student.rollNumber})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ my: 1 }}>
        <InputLabel>Select Subject</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDeleteScore("single")}
      >
        Delete Score for Selected Student & Subject
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 1 }}
        onClick={() => handleDeleteScore("allStudent")}
      >
        Delete All Scores for Selected Student
      </Button>
      <Button
        variant="contained"
        color="warning"
        sx={{ m: 1 }}
        onClick={() => handleDeleteScore("allSubject")}
      >
        Delete Subject Scores for All Students
      </Button>
      <Button
        variant="contained"
        color="error"
        sx={{ m: 1 }}
        onClick={() => handleDeleteScore("all")}
      >
        Delete All Scores
      </Button>
    </Box>
  );
};

export default DeleteScores;
