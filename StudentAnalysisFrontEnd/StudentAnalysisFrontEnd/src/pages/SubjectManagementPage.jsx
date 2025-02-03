import React, { useEffect, useState } from 'react';
import { getSubjects, deleteSubject } from '../api/subjects';
import SubjectForm from '../components/SubjectForm';
import Table from '../components/Table';
import Alert from '../components/Alert';

const SubjectManagementPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const data = await getSubjects();
            setSubjects(data);
        } catch (err) {
            setError('Failed to fetch subjects.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            await deleteSubject(id);
            setMessage('Subject deleted successfully.');
            fetchSubjects();
        } catch (err) {
            setError('Failed to delete subject.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Subject Management</h2>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}

            <SubjectForm refreshSubjects={fetchSubjects} subject={selectedSubject} />

            <Table
                columns={[
                    { header: 'ID', accessor: 'id' },
                    { header: 'Subject Name', accessor: 'name' },
                    { header: 'Type', accessor: 'type' },
                    { header: 'Actions', accessor: 'actions' },
                ]}
                data={subjects.map((subject) => ({
                    ...subject,
                    actions: (
                        <>
                            <button className="btn btn-warning me-2" onClick={() => setSelectedSubject(subject)}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(subject.id)}>
                                Delete
                            </button>
                        </>
                    ),
                }))}
            />
        </div>
    );
};

export default SubjectManagementPage;
