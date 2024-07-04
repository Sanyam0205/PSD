// UserManagement.js

import React, { useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [newUsername, setNewUsername] = useState('');

  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://ec2-15-207-87-2.ap-south-1.compute.amazonaws.com:5000/api/users/login', { username: newUsername });
      // Handle successful user addition
      console.log(response.data);
    } catch (error) {
      console.error(error);
      // Handle user addition error
    }
  };

  return (
    <div className='form-container'>
      <h2>User Management</h2>
      <div>
        <label>New Username:</label>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      {/* Display existing users */}
    </div>
  );
};

export default UserManagement;
