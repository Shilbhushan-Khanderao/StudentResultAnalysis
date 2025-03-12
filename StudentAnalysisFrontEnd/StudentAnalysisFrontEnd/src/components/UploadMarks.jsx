import React, { useState } from "react";
import {
  uploadSingleSubjectMarks,
  uploadMultipleSubjectsMarks,
  uploadProjectAndGACGrades,
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

const UploadMarks = ({ type }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch subjects only if uploading marks (not for Project & GAC)
  useState(() => {
    if (type === "marks") {
      getSubjects().then(setSubjects);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      if (type === "marks") {
        if (!selectedSubject) {
          setError("Please select a subject");
          return;
        }
        await uploadSingleSubjectMarks(file, selectedSubject);
        setMessage(`Marks uploaded successfully for ${selectedSubject}`);
      } else if (type === "multiple-marks") {
        await uploadMultipleSubjectsMarks(file);
        setMessage("Marks uploaded successfully for multiple subjects");
      } else if (type === "project-gac") {
        await uploadProjectAndGACGrades(file);
        setMessage("Project and GAC grades uploaded successfully!");
      }

      setError("");
      setFile(null);
      setSelectedSubject("");
    } catch (err) {
      setError(`Failed to upload ${type}`);
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 3,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" gutterBottom>
        {type === "marks" && "Upload Subject Marks"}
        {type === "multiple-marks" && "Upload Multiple Subjects Marks"}
        {type === "project-gac" && "Upload Project & GAC Grades"}
      </Typography>

      {message && <Typography color="green">{message}</Typography>}
      {error && <Typography color="red">{error}</Typography>}

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-control mb-3"
      />

      {type === "marks" && (
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Select Subject</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </Button>
    </Box>
  );
};

export default UploadMarks;
