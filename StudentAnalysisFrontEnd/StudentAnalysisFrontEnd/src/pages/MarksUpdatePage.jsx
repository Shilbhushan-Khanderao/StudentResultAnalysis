import React, { useState } from "react";
import { updateStudentMarks } from "../api/marks";
import Alert from "../components/Alert";
import Loader from "../components/Loader"; // ✅ Import the Loader component
import { Button, TextField, Container, Typography } from "@mui/material";

const MarksUpdatePage = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [theoryMarks, setTheoryMarks] = useState("");
  const [iaMarks, setIaMarks] = useState("");
  const [labMarks, setLabMarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Manage loading state

  const handleUpdate = async () => {
    if (!rollNumber || !subjectName || !theoryMarks || !iaMarks || !labMarks) {
      setError("Please fill in all the fields.");
      return;
    }

    try {
      setLoading(true); // ✅ Set loading to true before API call

      await updateStudentMarks(
        rollNumber,
        subjectName,
        parseInt(theoryMarks),
        parseInt(iaMarks),
        parseInt(labMarks)
      );

      setMessage("Marks updated successfully for the student.");
      setError("");
      setRollNumber("");
      setSubjectName("");
      setTheoryMarks("");
      setIaMarks("");
      setLabMarks("");
    } catch (err) {
      setError("Failed to update marks.");
      setMessage("");
    } finally {
      setLoading(false); // ✅ Ensure loading is turned off after request
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Update Marks
      </Typography>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}
      <TextField
        fullWidth
        label="Roll Number"
        variant="outlined"
        margin="normal"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Subject Name"
        variant="outlined"
        margin="normal"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Theory Marks"
        type="number"
        variant="outlined"
        margin="normal"
        value={theoryMarks}
        onChange={(e) => setTheoryMarks(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="IA Marks"
        type="number"
        variant="outlined"
        margin="normal"
        value={iaMarks}
        onChange={(e) => setIaMarks(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Lab Marks"
        type="number"
        variant="outlined"
        margin="normal"
        value={labMarks}
        onChange={(e) => setLabMarks(e.target.value)}
        required
      />
      {loading && <Loader />} {/* ✅ Show loader when updating */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: "1rem" }}
        onClick={handleUpdate} // ✅ Corrected onClick function
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Marks"}
      </Button>
    </Container>
  );
};

export default MarksUpdatePage;
