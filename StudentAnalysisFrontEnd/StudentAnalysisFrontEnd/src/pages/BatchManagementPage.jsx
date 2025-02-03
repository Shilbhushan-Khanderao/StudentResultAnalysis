import React, { useEffect, useState } from 'react';
import { getBatches, deleteBatch } from '../api/batches';
import BatchForm from '../components/BatchForm';
import Table from '../components/Table';
import Alert from '../components/Alert';

const BatchManagementPage = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getBatches();
            setBatches(data);
        } catch (err) {
            setError('Failed to fetch batches.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this batch?')) return;
        try {
            await deleteBatch(id);
            setMessage('Batch deleted successfully.');
            fetchBatches();
        } catch (err) {
            setError('Failed to delete batch.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Batch Management</h2>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}

            <BatchForm refreshBatches={fetchBatches} batch={selectedBatch} />

            <Table
                columns={[
                    { header: 'ID', accessor: 'id' },
                    { header: 'Batch Name', accessor: 'batchName' },
                    { header: 'Actions', accessor: 'actions' },
                ]}
                data={batches.map((batch) => ({
                    ...batch,
                    actions: (
                        <>
                            <button className="btn btn-warning me-2" onClick={() => setSelectedBatch(batch)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(batch.id)}>
                                Delete
                            </button>
                        </>
                    ),
                }))}
            />
        </div>
    );
};

export default BatchManagementPage;
