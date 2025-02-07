import React, { useEffect, useState } from "react";
import { getSubjects, deleteSubject } from "../api/subjects";
import SubjectForm from "../components/SubjectForm";
import Table from "../components/Table";
import Alert from "../components/Alert";
import ModalDialog from "../components/ModalDialog";
import { Button } from "@mui/material";

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      setError("Failed to fetch subjects.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    try {
      await deleteSubject(id);
      setMessage("Subject deleted successfully.");
      fetchSubjects();
    } catch (err) {
      setError("Failed to delete subject.");
    }
  };

  const handleEditClick = (subject) => {
    setSelectedSubject(subject);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedSubject(null);
  };

  const handleSubjectUpdate = async () => {
    await fetchSubjects();
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      <h2>Subject Management</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      <Button
        variant="contained"
        color="primary"
        className="mb-2"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Hide Form" : "Add Subject"}
      </Button>

      {showAddForm && <SubjectForm refreshSubjects={fetchSubjects} />}

      <Table
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          { field: "name", headerName: "Subject Name", width: 250 },
          { field: "type", headerName: "Type", width: 200 },
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
        rows={subjects.map((subject) => ({
          id: subject.id,
          name: subject.name,
          type: subject.type,
        }))}
      />

      <ModalDialog
        open={openEditModal}
        handleClose={handleCloseModal}
        title="Edit Subject"
      >
        {selectedSubject && (
          <SubjectForm
            subject={selectedSubject}
            refreshSubjects={handleSubjectUpdate}
          />
        )}
      </ModalDialog>
    </div>
  );
};

export default SubjectManagementPage;
