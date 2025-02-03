import React, { useState } from "react";
import {
  uploadSingleSubjectMarks,
  uploadMultipleSubjectsMarks,
} from "../api/marks";
import Alert from "../components/Alert";
import FileUpload from "../components/FileUpload";

const MarksUploadPage = () => {
  const [file, setFile] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSingleUpload = async () => {
    if (!file || !subjectName) {
      setError("Please provide both a file and a subject name.");
      return;
    }
    try {
      await uploadSingleSubjectMarks(file, subjectName);
      setMessage("Marks uploaded successfully for the subject.");
    } catch (err) {
      setError("Failed to upload marks for the subject.");
    }
  };

  const handleMultipleUpload = async () => {
    if (!file) {
      setError("Please provide a file.");
      return;
    }
    try {
      await uploadMultipleSubjectsMarks(file);
      setMessage("Marks uploaded successfully for multiple subjects.");
    } catch (err) {
      setError("Failed to upload marks for multiple subjects.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Marks Upload</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      {/* Single Subject Upload */}
      <div className="mb-5">
        <h4>Upload Single Subject Marks</h4>
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
        <FileUpload
          label="Upload CSV File"
          onFileChange={(file) => setFile(file)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSingleUpload}>
          Upload Single Subject Marks
        </button>
      </div>

      {/* Multiple Subjects Upload */}
      <div>
        <h4>Upload Multiple Subjects Marks</h4>
        <FileUpload
          label="Upload CSV File"
          onFileChange={(file) => setFile(file)}
        />
        <button
          className="btn btn-secondary mt-3"
          onClick={handleMultipleUpload}
        >
          Upload Multiple Subjects Marks
        </button>
      </div>
    </div>
  );
};

export default MarksUploadPage;
