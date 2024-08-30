// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role, onLogout }) {
  const navigate = useNavigate(); // Use the navigate hook for navigation

  // Handle logout and navigate to the login page
  const handleLogout = () => {
    onLogout(); // Clear role or perform other logout actions
    navigate('/'); // Redirect to the login page
  };
  return (
    <div className="sidebar">
      <ul>
        {/* Role-based Links */}
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
          </>
        )}
        {/* Common Logout Button for All Roles */}
        <li>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
