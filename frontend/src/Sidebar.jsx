import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

function Sidebar({ role, onLogout, username, phoneNumber, email }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('userId'); // Clear the user ID on logout
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="profile-section" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{username}</h3>
        {isExpanded && (
          <div className="user-details">
            <p>Email: {email}</p>
            <p>Phone: {phoneNumber}</p>
            <p>Role: {role}</p>
          </div>
        )}
      </div>

      <ul>
        {role === 'Creator' && (
          <>
            <li><Link to="/creator">Home</Link></li>
            <li><Link to="/form">Form</Link></li>
            <li><Link to="/projectorder">Project Order</Link></li>
          </>
        )}
        {role === 'Viewer' && (
          <>
            <li><Link to="/viewer">Home</Link></li>
            <li><Link to="/projectorder">Project Order</Link></li>
          </>
        )}
        {role === 'Approver' && (
          <>
            <li><Link to="/AppDash">Dashboard</Link></li>
            <li><Link to="/approver">Home</Link></li>
          </>
        )}
        {role === 'Admin' && (
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/form">Form</Link></li>
            <li><Link to="/projectorder">Project Order</Link></li>
            <li><Link to="/usermanagement">User Management</Link></li>
            <li><Link to="/location">Location</Link></li>
            <li><Link to="/vendor">Vendor</Link></li>
            <li><Link to="/signin">Signin</Link></li>
          </>
        )}
        <li>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
