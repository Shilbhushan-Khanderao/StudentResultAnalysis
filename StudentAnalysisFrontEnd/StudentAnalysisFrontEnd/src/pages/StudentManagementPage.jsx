import React, { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../api/students";
import StudentForm from "../components/StudentForm";
import Table from "../components/Table";
import Alert from "../components/Alert";
import ModalDialog from "../components/ModalDialog";
import { Button } from "@mui/material";
import StudentUploadPage from "./StudentUploadPage"; // Import the updated upload page

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false); // State for upload modal

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

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedStudent(null);
  };

  const handleStudentUpdate = async () => {
    await fetchStudents(); // Refresh student list
    handleCloseModal(); // Automatically close modal on successful update
  };

  return (
    <div className="container mt-5">
      <h2>Student Management</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      {/* Add & Upload Buttons */}
      <div className="mb-3">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ marginRight: "10px" }}
        >
          {showAddForm ? "Hide Form" : "Add Student"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenUploadModal(true)}
        >
          Upload Students
        </Button>
      </div>

      {/* Conditionally Render Student Form */}
      {showAddForm && <StudentForm refreshStudents={fetchStudents} />}

      {/* Students Table */}
      <Table
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          { field: "rollNumber", headerName: "Roll Number", width: 150 },
          { field: "name", headerName: "Name", width: 250 },
          { field: "batchName", headerName: "Batch", width: 200 },
          {
            field: "actions",
            headerName: "Actions",
            width: 250,
            renderCell: (params) => (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={() => handleEditClick(params.row)}
                  style={{ marginRight: "8px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(params.row.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rows={students.map((student) => ({
          id: student.id,
          rollNumber: student.rollNumber,
          name: student.name,
          batchName: student.batch?.batchName || "N/A",
        }))}
      />

      {/* Edit Student Modal */}
      <ModalDialog open={openEditModal} handleClose={handleCloseModal} title="Edit Student">
        {selectedStudent && (
          <StudentForm student={selectedStudent} refreshStudents={handleStudentUpdate} />
        )}
      </ModalDialog>

      {/* Upload Student Modal */}
      <ModalDialog
        open={openUploadModal}
        handleClose={() => setOpenUploadModal(false)}
        title="Upload Students"
      >
        <StudentUploadPage refreshStudents={fetchStudents} handleClose={() => setOpenUploadModal(false)} />
      </ModalDialog>
    </div>
  );
};

export default StudentManagementPage;
