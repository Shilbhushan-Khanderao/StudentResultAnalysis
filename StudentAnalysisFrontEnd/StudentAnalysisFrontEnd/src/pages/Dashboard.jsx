import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mt-5">
            <h2>Welcome, {user?.username}!</h2>
            <p>Role: {user?.roles}</p>
        </div>
    );
};

export default Dashboard;
