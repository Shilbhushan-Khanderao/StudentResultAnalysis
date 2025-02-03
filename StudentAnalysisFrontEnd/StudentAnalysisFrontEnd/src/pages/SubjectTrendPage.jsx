import React, { useState } from 'react';
import { getSubjectTrend } from '../api/trends';
import Chart from '../components/Chart';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const SubjectTrendPage = () => {
    const [subjectId, setSubjectId] = useState('');
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetchTrend = async () => {
        if (!subjectId) {
            setError('Please enter a valid subject ID.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await getSubjectTrend(subjectId);
            setTrendData(data);
        } catch (err) {
            setError('Failed to fetch subject trend data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Subject Performance Trend</h2>
            {error && <Alert type="error" message={error} />}
            <div className="form-group mb-3">
                <label>Subject ID</label>
                <input
                    type="text"
                    className="form-control"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    placeholder="Enter Subject ID"
                />
            </div>
            <button className="btn btn-primary" onClick={handleFetchTrend}>
                View Trend
            </button>
            {loading && <Loader />}
            {trendData && (
                <div className="mt-5">
                    <h4>Average Trend for Subject</h4>
                    <Chart
                        type="line"
                        data={{
                            labels: ['Assessment 1', 'Assessment 2', 'Assessment 3'], // Example labels
                            datasets: [
                                {
                                    label: 'Average Marks',
                                    data: Object.values(trendData),
                                    fill: false,
                                    borderColor: 'rgba(75, 192, 192, 0.6)',
                                    tension: 0.1,
                                },
                            ],
                        }}
                        options={{ responsive: true, plugins: { legend: { position: 'top' } } }}
                    />
                </div>
            )}
        </div>
    );
};

export default SubjectTrendPage;
