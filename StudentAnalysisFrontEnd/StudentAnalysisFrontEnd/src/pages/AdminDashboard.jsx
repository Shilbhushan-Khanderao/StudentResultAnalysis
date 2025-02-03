import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="container mt-5">
            <h2>Admin Dashboard</h2>
            <div className="row">
                <div className="col-md-4">
                    <Link to="/users" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>User Management</h5>
                        <p>View, assign roles, and manage users.</p>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to="/students" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>Student Management</h5>
                        <p>View, add, update, and delete students.</p>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to="/batches" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>Batch Management</h5>
                        <p>Manage batches and student assignments.</p>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to="/subjects" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>Subject Management</h5>
                        <p>View, add, update, and delete subjects.</p>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to="/rankings" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>Rankings</h5>
                        <p>Calculate and view student rankings.</p>
                    </Link>
                </div>
                <div className="col-md-4">
                    <Link to="/reports" className="card text-center p-3 mb-3 shadow-sm">
                        <h5>Reports</h5>
                        <p>Generate student and batch reports.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
