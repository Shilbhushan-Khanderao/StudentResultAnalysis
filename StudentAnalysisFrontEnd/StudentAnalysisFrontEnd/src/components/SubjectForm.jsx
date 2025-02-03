import React, { useState, useEffect } from 'react';
import { createSubject, updateSubject } from '../api/subjects';
import Alert from './Alert';

const SubjectForm = ({ refreshSubjects, subject }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (subject) {
            setName(subject.name);
            setType(subject.type);
        }
    }, [subject]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !type) {
            setError('All fields are required.');
            return;
        }

        try {
            if (subject) {
                await updateSubject(subject.id, { name, type });
                setMessage('Subject updated successfully.');
            } else {
                await createSubject({ name, type });
                setMessage('Subject added successfully.');
            }
            refreshSubjects();
        } catch (err) {
            setError('Failed to save subject.');
        }
    };

    return (
        <div className="mb-5">
            <h4>{subject ? 'Edit Subject' : 'Add Subject'}</h4>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Subject Name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group mb-3">
                    <label>Type</label>
                    <input type="text" className="form-control" value={type} onChange={(e) => setType(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">{subject ? 'Update' : 'Add'} Subject</button>
            </form>
        </div>
    );
};

export default SubjectForm;
