import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser, assignRole } from '../api/users';
import Table from '../components/Table';
import Alert from '../components/Alert';
import UserForm from '../components/UserForm';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            setMessage('User deleted successfully.');
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user.');
        }
    };

    const handleAssignRole = async (id, role) => {
        try {
            await assignRole(id, role);
            setMessage('Role assigned successfully.');
            fetchUsers();
        } catch (err) {
            setError('Failed to assign role.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}

            <UserForm refreshUsers={fetchUsers} />

            <Table
                columns={[
                    { header: 'ID', accessor: 'id' },
                    { header: 'Username', accessor: 'username' },
                    { header: 'Roles', accessor: 'roles' },
                    { header: 'Actions', accessor: 'actions' },
                ]}
                data={users.map((user) => ({
                    ...user,
                    roles: user.roles.map(role => role.name).join(', '),
                    actions: (
                        <>
                            <button className="btn btn-info me-2" onClick={() => handleAssignRole(user.id, 'ADMIN')}>
                                Assign Admin
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>
                                Delete
                            </button>
                        </>
                    ),
                }))}
            />
        </div>
    );
};

export default UserManagementPage;
