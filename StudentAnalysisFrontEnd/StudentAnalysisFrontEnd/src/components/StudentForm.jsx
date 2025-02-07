import React, { useState, useEffect } from "react";
import { createStudent } from "../api/students";
import { getBatches } from "../api/common";
import Alert from "./Alert";
import { TextField, MenuItem, Button, Box, Typography } from "@mui/material";

const StudentForm = ({ refreshStudents }) => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [batchId, setBatchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      setError("Failed to load batches.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !rollNumber || !batchId) {
      setError("All fields are required.");
      return;
    }

    try {
      await createStudent({ name, rollNumber, batch: { id: batchId } });
      setMessage("Student added successfully.");
      refreshStudents(); // Refresh student list
      setName("");
      setRollNumber("");
      setBatchId("");
    } catch (err) {
      setError("Failed to save student.");
      console.error("Student save error:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 500,
        marginBottom: 2,
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5">{"Add Student"}</Typography>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Roll Number"
        variant="outlined"
        fullWidth
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        required
      />
      <TextField
        select
        label="Batch"
        variant="outlined"
        fullWidth
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        required
      >
        <MenuItem value="">Select Batch</MenuItem>
        {batches.map((batch) => (
          <MenuItem key={batch.id} value={batch.id}>
            {batch.batchName}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Student
      </Button>
    </Box>
  );
};

export default StudentForm;
