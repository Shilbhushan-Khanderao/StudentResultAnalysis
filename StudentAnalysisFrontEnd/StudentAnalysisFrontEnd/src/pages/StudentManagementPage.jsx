import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents, deleteStudent } from "../api/students";
import StudentForm from "../components/StudentForm";
import Table from "../components/Table";
import Alert from "../components/Alert";

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to fetch students.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await deleteStudent(id);
      setMessage("Student deleted successfully.");
      fetchStudents();
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Management</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/students/upload" className="btn btn-primary">
          Upload Students
        </Link>
      </div>

      <StudentForm refreshStudents={fetchStudents} student={selectedStudent} />

      <Table
        columns={[
          { header: "ID", accessor: "id" },
          { header: "Name", accessor: "name" },
          { header: "Roll Number", accessor: "rollNumber" },
          { header: "Batch", accessor: "batch.batchName" },
          { header: "Actions", accessor: "actions" },
        ]}
        data={students.map((student) => ({
          ...student,
          actions: (
            <>
              <button
                className="btn btn-warning me-2"
                onClick={() => setSelectedStudent(student)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </button>
            </>
          ),
        }))}
      />
    </div>
  );
};

export default StudentManagementPage;
