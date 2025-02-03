import React, { useState, useEffect } from 'react';
import { createStudent, updateStudent } from '../api/students';
import { getBatches } from '../api/common';
import Alert from './Alert';

const StudentForm = ({ refreshStudents, student }) => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [batchId, setBatchId] = useState('');
    const [batches, setBatches] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBatches();
        if (student) {
            setName(student.name);
            setRollNumber(student.rollNumber);
            setBatchId(student.batch.id);
        }
    }, [student]);

    const fetchBatches = async () => {
        try {
            const data = await getBatches();
            setBatches(data);
        } catch (err) {
            setError('Failed to load batches.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !rollNumber || !batchId) {
            setError('All fields are required.');
            return;
        }

        try {
            if (student) {
                await updateStudent(student.id, { name, rollNumber, batch: { id: batchId } });
                setMessage('Student updated successfully.');
            } else {
                await createStudent({ name, rollNumber, batch: { id: batchId } });
                setMessage('Student added successfully.');
            }
            refreshStudents();
        } catch (err) {
            setError('Failed to save student.');
        }
    };

    return (
        <div className="mb-5">
            <h4>{student ? 'Edit Student' : 'Add Student'}</h4>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label>Roll Number</label>
                    <input type="text" className="form-control" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label>Batch</label>
                    <select className="form-control" value={batchId} onChange={(e) => setBatchId(e.target.value)} required>
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                                {batch.batchName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">{student ? 'Update' : 'Add'} Student</button>
            </form>
        </div>
    );
};

export default StudentForm;
