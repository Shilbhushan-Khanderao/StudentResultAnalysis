import React, { useState } from "react";
import {
  uploadSingleSubjectMarks,
  uploadMultipleSubjectsMarks,
} from "../api/marks";
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

const UploadMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [file, setFile] = useState(null);

  useState(() => {
    getSubjects().then(setSubjects);
  }, []);

  const handleUploadMarks = async (isMultiple) => {
    if (!file) return alert("Please select a file");
    if (!isMultiple && !selectedSubject)
      return alert("Please select a subject");

    if (isMultiple) {
      await uploadMultipleSubjectsMarks(file);
      alert("Uploaded marks for multiple subjects");
    } else {
      await uploadSingleSubjectMarks(file, selectedSubject);
      alert("Uploaded marks for selected subject");
    }
  };

  return (
    <Box>
      <Typography variant="h6">Upload Marks</Typography>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Select Subject (For Single Upload)</InputLabel>
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
        onClick={() => handleUploadMarks(false)}
      >
        Upload Single Subject Marks
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 1 }}
        onClick={() => handleUploadMarks(true)}
      >
        Upload Multiple Subjects Marks
      </Button>
    </Box>
  );
};

export default UploadMarks;
