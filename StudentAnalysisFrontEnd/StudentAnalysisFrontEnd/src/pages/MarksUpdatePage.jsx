import React, { useState } from "react";
import { updateStudentMarks } from "../api/marks";
import Alert from "../components/Alert";

const MarksUpdatePage = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [theoryMarks, setTheoryMarks] = useState("");
  const [iaMarks, setIaMarks] = useState("");
  const [labMarks, setLabMarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!rollNumber || !subjectName || !theoryMarks || !iaMarks || !labMarks) {
      setError("Please fill in all the fields.");
      return;
    }
    try {
      await updateStudentMarks(
        rollNumber,
        subjectName,
        parseInt(theoryMarks),
        parseInt(iaMarks),
        parseInt(labMarks)
      );
      setMessage("Marks updated successfully for the student.");
    } catch (err) {
      setError("Failed to update marks.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Marks</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      <div className="form-group mb-3">
        <label>Roll Number</label>
        <input
          type="text"
          className="form-control"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          placeholder="Enter Roll Number"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Subject Name</label>
        <input
          type="text"
          className="form-control"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter Subject Name"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Theory Marks</label>
        <input
          type="number"
          className="form-control"
          value={theoryMarks}
          onChange={(e) => setTheoryMarks(e.target.value)}
          placeholder="Enter Theory Marks"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>IA Marks</label>
        <input
          type="number"
          className="form-control"
          value={iaMarks}
          onChange={(e) => setIaMarks(e.target.value)}
          placeholder="Enter IA Marks"
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Lab Marks</label>
        <input
          type="number"
          className="form-control"
          value={labMarks}
          onChange={(e) => setLabMarks(e.target.value)}
          placeholder="Enter Lab Marks"
          required
        />
      </div>
      {loading && <Loader />}
      <button
        className="btn btn-primary mt-3"
        onClick={handleSingleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Single Subject Marks"}
      </button>
    </div>
  );
};

export default MarksUpdatePage;
