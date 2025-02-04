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

// Ensure requiredRole is always treated as an array
const requiredRolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

// Check if the user has ANY of the required roles
if (requiredRolesArray.length > 0 && !requiredRolesArray.some(role => user.roles.includes(role))) {
return <Navigate to="/unauthorized" />;
}

return <Outlet />;
};

export default ProtectedRoute;
