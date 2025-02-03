import React, { useState } from "react";
import {
  downloadStudentReport,
  downloadStudentPDF,
  downloadBatchPDF,
} from "../api/reports";
import Alert from "../components/Alert";
import FileUpload from "../components/FileUpload";

const ReportsPage = () => {
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDownloadStudentExcel = async () => {
    try {
      await downloadStudentReport(studentId);
      setMessage("Student Excel report downloaded successfully.");
    } catch (err) {
      setError("Failed to download student Excel report.");
    }
  };

  const handleDownloadStudentPDF = async () => {
    try {
      await downloadStudentPDF(studentId);
      setMessage("Student PDF report downloaded successfully.");
    } catch (err) {
      setError("Failed to download student PDF report.");
    }
  };

  const handleDownloadBatchPDF = async () => {
    try {
      await downloadBatchPDF(batchId);
      setMessage("Batch PDF report downloaded successfully.");
    } catch (err) {
      setError("Failed to download batch PDF report.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reports</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      {/* Student Report Section */}
      <div className="mb-5">
        <h4>Download Student Report</h4>
        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            className="form-control mb-3"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
            required
          />
        </div>
        <button
          className="btn btn-primary me-3"
          onClick={handleDownloadStudentExcel}
        >
          Download Excel Report
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleDownloadStudentPDF}
        >
          Download PDF Report
        </button>
      </div>

      {/* Batch Report Section */}
      <div>
        <h4>Download Batch Report</h4>
        <div className="form-group">
          <label>Batch ID</label>
          <input
            type="text"
            className="form-control mb-3"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="Enter Batch ID"
            required
          />
        </div>
        <button className="btn btn-primary" onClick={handleDownloadBatchPDF}>
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
