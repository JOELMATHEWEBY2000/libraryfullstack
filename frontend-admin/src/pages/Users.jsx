import { useEffect, useState } from "react";
import usersApi from "../api/usersApi";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await usersApi.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UPDATE USER STATUS
  // ======================
  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    const confirmUpdate = window.confirm(
      `Change user status to "${newStatus}"?`
    );
    if (!confirmUpdate) return;

    try {
      await usersApi.updateStatus(id, newStatus);
      loadUsers(); // refresh list
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update user status");
    }
  };

  // ======================
  // DELETE USER
  // ======================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await usersApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user", err);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return <div className="users-container">Loading users...</div>;
  }

  return (
    <div className="users-container">
      <h1>Users Management</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name || "-"}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>
                  <span
                    className={
                      user.status === "active"
                        ? "status-active"
                        : "status-blocked"
                    }
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() =>
                      handleUpdateStatus(user.id, user.status)
                    }
                  >
                    {user.status === "active" ? "Block" : "Activate"}
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
