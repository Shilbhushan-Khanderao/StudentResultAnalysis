import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="row">
        {/* User Management - Admin Only */}
        <div className="col-md-4">
          <Link
            to="/users"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>User Management</h5>
              <p>View, assign roles, and manage users.</p>
            </div>
          </Link>
        </div>

        {/* Student Management - Accessible by Admin & Teacher */}
        <div className="col-md-4">
          <Link
            to="/students"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Student Management</h5>
              <p>View, add, update, and delete students.</p>
            </div>
          </Link>
        </div>

        {/* Batch Management - Accessible by Admin & Teacher */}
        <div className="col-md-4">
          <Link
            to="/batches"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Batch Management</h5>
              <p>Manage batches and student assignments.</p>
            </div>
          </Link>
        </div>

        {/* Subject Management - Accessible by Admin & Teacher */}
        <div className="col-md-4">
          <Link
            to="/subjects"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Subject Management</h5>
              <p>View, add, update, and delete subjects.</p>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link
            to="/score-management"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Score Management</h5>
              <p>Manage all score related stuff.</p>
            </div>
          </Link>
        </div>

        {/* Rankings - Admin Only */}
        <div className="col-md-4">
          <Link
            to="/rankings"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Ranking Management</h5>
              <p>Calculate and view student rankings.</p>
            </div>
          </Link>
        </div>

        {/* Reports - Accessible by Admin & Teacher */}
        <div className="col-md-4">
          <Link
            to="/reports"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Reports</h5>
              <p>Generate student and batch reports.</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link
            to="/ranking-history"
            className="card text-center p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>Ranking History</h5>
              <p>View ranking history.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
