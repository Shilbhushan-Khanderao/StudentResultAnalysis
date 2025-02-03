import React, { useEffect, useState } from 'react';
import { getRankings, calculateRanks } from '../api/rankings';
import Table from '../components/Table';
import Alert from '../components/Alert';

const RankingPage = () => {
    const [rankings, setRankings] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        try {
            const data = await getRankings();
            setRankings(data);
        } catch (err) {
            setError('Failed to fetch rankings.');
        }
    };

    const handleCalculateRanks = async () => {
        try {
            await calculateRanks();
            setMessage('Ranks calculated successfully.');
            fetchRankings();
        } catch (err) {
            setError('Failed to calculate rankings.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Ranking Management</h2>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}

            <button className="btn btn-primary mb-3" onClick={handleCalculateRanks}>
                Calculate Rankings
            </button>

            <Table
                columns={[
                    { header: 'Rank', accessor: 'rank' },
                    { header: 'Old Rank', accessor: 'oldRank' },
                    { header: 'Student Name', accessor: 'student.name' },
                    { header: 'Percentage', accessor: 'percentage' },
                ]}
                data={rankings}
            />
        </div>
    );
};

export default RankingPage;
