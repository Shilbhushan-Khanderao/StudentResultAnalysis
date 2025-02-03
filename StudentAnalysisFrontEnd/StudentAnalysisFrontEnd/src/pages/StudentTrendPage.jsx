import React, { useState, useEffect } from 'react';
import { getStudentTrend } from '../api/trends';
import { getStudents } from '../api/common'; // New API for fetching students
import Chart from '../components/Chart';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const StudentTrendPage = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data);
            } catch (err) {
                setError('Failed to load students.');
            }
        };
        fetchStudents();
    }, []);

    const handleFetchTrend = async () => {
        if (!selectedStudent) {
            setError('Please select a student.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await getStudentTrend(selectedStudent);
            setTrendData(data);
        } catch (err) {
            setError('Failed to fetch student trend data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Student Performance Trend</h2>
            {error && <Alert type="error" message={error} />}
            <div className="form-group mb-3">
                <label>Select Student</label>
                <select
                    className="form-control"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    <option value="">-- Select Student --</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.name} (ID: {student.id})
                        </option>
                    ))}
                </select>
            </div>
            <button className="btn btn-primary" onClick={handleFetchTrend}>
                View Trend
            </button>
            {loading && <Loader />}
            {trendData && (
                <div className="mt-5">
                    <h4>Performance Trends for {trendData.studentName}</h4>
                    <Chart
                        type="line"
                        data={{
                            labels: Object.keys(trendData.trendData),
                            datasets: Object.entries(trendData.trendData).map(([subject, marks]) => ({
                                label: subject,
                                data: marks,
                                fill: false,
                                borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                tension: 0.1,
                            })),
                        }}
                        options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentTrendPage;
