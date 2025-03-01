import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Student Analysis</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {user && user.roles.includes('ADMIN') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                            </li>
                        )}
                        {user ? (
                            <li className="nav-item">
                                <button className="btn btn-danger" onClick={logout}>Logout</button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
