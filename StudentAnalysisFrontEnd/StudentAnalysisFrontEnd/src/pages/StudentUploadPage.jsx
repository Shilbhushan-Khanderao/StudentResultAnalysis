import React, { useState } from "react";
import { uploadStudents } from "../api/students";
import Alert from "../components/Alert";

const StudentUploadPage = ({ refreshStudents }) => {
  const [file, setFile] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !batchName) {
      setError("Please select a file and enter a batch name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("batchName", batchName);

    try {
      const response = await uploadStudents(formData);
      console.log("Upload Response:", response);
      setMessage("Students uploaded successfully.");
      setFile(null);
      setBatchName("");
      refreshStudents();
    } catch (err) {
        console.error("Error uploading students:", err);
        if (err.response) {
            console.error("Server Response:", err.response.data);
            setError(err.response.data.message || "Failed to upload students.");
        } else {
            setError("Failed to upload students.");
        }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Students Data</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Batch Name</label>
          <input
            type="text"
            className="form-control"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Upload CSV File</label>
          <input
            type="file"
            className="form-control"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
};

export default StudentUploadPage;
