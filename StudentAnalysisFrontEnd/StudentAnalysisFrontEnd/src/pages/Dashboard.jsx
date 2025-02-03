import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container mt-5">
            <h2>Welcome, {user?.username}!</h2>
            <p>Role: {user?.role}</p>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
