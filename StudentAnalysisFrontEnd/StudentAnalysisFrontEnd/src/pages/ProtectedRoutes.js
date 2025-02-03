import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { user } = useAuth();

    // Handle case where user is undefined (avoid crashes)
    if (user === undefined) {
        return null; // Or show a loading spinner
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Check role safely
    if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
