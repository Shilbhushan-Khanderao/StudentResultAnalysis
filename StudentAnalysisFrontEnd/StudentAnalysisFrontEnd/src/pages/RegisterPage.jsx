import React, { useState } from 'react';
import { register } from '../api/auth';
import Alert from '../components/Alert';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('TEACHER');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, role);
            setMessage('User registered successfully');
            setUsername('');
            setPassword('');
        } catch (err) {
            setError('Failed to register user');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}
            <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Role</label>
                    <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="TEACHER">Teacher</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
