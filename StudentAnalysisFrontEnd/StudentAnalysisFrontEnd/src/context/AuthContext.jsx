import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem('token') || null);
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
    const navigate = useNavigate();

    const login = (newToken, userDetails) => {
        setToken(newToken);
        setUser(userDetails);
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(userDetails));
    
        // Redirect based on role
        if (userDetails.roles.includes('ADMIN')) {
            navigate('/admin');
        } else if (userDetails.roles.includes('TEACHER')) {
            navigate('/dashboard');
        } else {
            navigate('/unauthorized');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login'); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
