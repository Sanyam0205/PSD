import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editableUser, setEditableUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: ''  // New password field
  });
  const roles = ['creator', 'viewer', 'approver', 'admin'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
        const adminCount = users.filter(user => user.role === 'admin').length;

        const userToDelete = users.find(user => user._id === userId);
        if (userToDelete.role === 'admin' && adminCount <= 1) {
            alert('There must be at least one admin. Deletion is not allowed.');
            return;
        }

        await axios.delete(`http://13.234.47.87:5000/api/users/${userId}`);
        fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};


  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditableUser({ ...user, password: '' }); // Prepopulate fields, but leave password empty
  };

  const handleUpdate = async () => {
    try {
      const adminCount = users.filter(user => user.role === 'admin').length;

      if (editableUser.role !== 'admin' && users.find(user => user._id === editingUserId).role === 'admin' && adminCount <= 1) {
        alert('There must be at least one admin. Role change is not allowed.');
        return;
      }

      const updateData = { ...editableUser };
      if (!editableUser.password) {
        delete updateData.password; // Remove password from update if it's empty
      }

      await axios.put(`http://13.234.47.87:5000/api/users/${editingUserId}`, updateData);
      setEditingUserId(null); // Exit edit mode
      fetchUsers(); // Refresh the user list after updating
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    setEditableUser({
      ...editableUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Password</th> {/* New password column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="firstName"
                      value={editableUser.firstName}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastName"
                      value={editableUser.lastName}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={editableUser.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editableUser.phoneNumber}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={editableUser.role}
                      onChange={handleChange}
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="password"
                      name="password"
                      value={editableUser.password}
                      onChange={handleChange}
                      placeholder="New Password"
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faSave}
                      className="action-icon save-icon"
                      onClick={handleUpdate}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="action-icon cancel-icon"
                      onClick={() => setEditingUserId(null)}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                  <td>*******</td> {/* Masked password */}
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="action-icon edit-icon"
                      onClick={() => handleEdit(user)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="action-icon delete-icon"
                      onClick={() => handleDelete(user._id)}
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
