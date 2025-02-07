import React, { useEffect, useState } from "react";
import { getBatches, deleteBatch } from "../api/batches";
import BatchForm from "../components/BatchForm";
import Table from "../components/Table";
import Alert from "../components/Alert";
import ModalDialog from "../components/ModalDialog";
import { Button } from "@mui/material";

const BatchManagementPage = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      setError("Failed to fetch batches.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      await deleteBatch(id);
      setMessage("Batch deleted successfully.");
      fetchBatches();
    } catch (err) {
      setError("Failed to delete batch.");
    }
  };

  const handleEditClick = (batch) => {
    setSelectedBatch(batch);
    setOpenEditModal(true);
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setSelectedBatch(null);
  };

  const handleBatchUpdate = async () => {
    await fetchBatches();
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      <h2>Batch Management</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      <Button
        variant="contained"
        color="primary"
        className="mb-2"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Hide Form" : "Add Batch"}
      </Button>

      {showAddForm && <BatchForm refreshBatches={fetchBatches} />}

      <Table
        columns={[
          { field: "id", headerName: "ID", width: 90 },
          { field: "batchName", headerName: "Batch Name", width: 250 },
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
        rows={batches.map((batch) => ({
          id: batch.id,
          batchName: batch.batchName,
        }))}
      />

      <ModalDialog
        open={openEditModal}
        handleClose={handleCloseModal}
        title="Edit Batch"
      >
        {selectedBatch && (
          <BatchForm batch={selectedBatch} refreshBatches={handleBatchUpdate} />
        )}
      </ModalDialog>
    </div>
  );
};

export default BatchManagementPage;
