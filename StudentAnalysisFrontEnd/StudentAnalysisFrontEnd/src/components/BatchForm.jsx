import React, { useState, useEffect } from 'react';
import { createBatch, updateBatch } from '../api/batches';
import Alert from './Alert';

const BatchForm = ({ refreshBatches, batch }) => {
    const [batchName, setBatchName] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (batch) {
            setBatchName(batch.batchName);
        }
    }, [batch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!batchName) {
            setError('Batch name is required.');
            return;
        }

        try {
            if (batch) {
                await updateBatch(batch.id, { batchName });
                setMessage('Batch updated successfully.');
            } else {
                await createBatch({ batchName });
                setMessage('Batch added successfully.');
            }
            refreshBatches();
        } catch (err) {
            setError('Failed to save batch.');
        }
    };

    return (
        <div className="mb-5">
            <h4>{batch ? 'Edit Batch' : 'Add Batch'}</h4>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Batch Name</label>
                    <input type="text" className="form-control" value={batchName} onChange={(e) => setBatchName(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">{batch ? 'Update' : 'Add'} Batch</button>
            </form>
        </div>
    );
};

export default BatchForm;
