import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, assignRole } from "../api/users";
import Table from "../components/Table";
import Alert from "../components/Alert";
import UserForm from "../components/UserForm";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setMessage("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  const handleAssignRole = async (id, role) => {
    try {
      await assignRole(id, role);
      setMessage("Role assigned successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to assign role.");
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
          { field: "id", headerName: "ID", width: 90 },
          { field: "username", headerName: "Username", width: 200 },
          { field: "roles", headerName: "Roles", width: 250 },
          {
            field: "actions",
            headerName: "Actions",
            width: 300,
            sortable: false,
            renderCell: (params) => {
              const isAdmin = params.row.roles.includes("ADMIN"); // Check if user is already an Admin

              return (
                <>
                  {!isAdmin && ( // Show "Assign Admin" only if the user is NOT already an admin
                    <button
                      className="btn btn-info me-2"
                      onClick={() => handleAssignRole(params.row.id, "ADMIN")}
                    >
                      Assign Admin
                    </button>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    Delete
                  </button>
                </>
              );
            },
          },
        ]}
        rows={users.map((user) => ({
          id: user.id,
          username: user.username,
          roles: user.roles?.map((role) => role.name).join(", ") || "No Role",
        }))}
      />
    </div>
  );
};

export default UserManagementPage;
