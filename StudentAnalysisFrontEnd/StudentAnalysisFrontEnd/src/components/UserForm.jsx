import React, { useState } from "react";
import { createUser } from "../api/users";
import Alert from "./Alert";

const UserForm = ({ refreshUsers }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TEACHER"); // Default role
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      console.log("Sending user creation request:", {
        username,
        password,
        roles: [role],
      });

      await createUser({ username, password, roles: [role] });

      setMessage(`User '${username}' added successfully.`);
      setUsername("");
      setPassword("");
      setError("");
      refreshUsers();
    } catch (err) {
      console.error("User creation error:", err);
      setError(err.message || "Failed to create user.");
    }
  };

  return (
    <div className="mb-5">
      <h4>Add New User</h4>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}
      <form onSubmit={handleSubmit}>
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
            required
          >
            <option value="TEACHER">Teacher</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
