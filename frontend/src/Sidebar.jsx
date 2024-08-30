import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role, onLogout, username }) { // Add username prop
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="sidebar">
      {/* <div className="profile-section">
        <h3>{username}</h3> 
        <Link to="/Settings" className="settings-link">Settings</Link>
      </div> */}
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
            <li><Link to="/usermanagement">User</Link></li>
            <li><Link to="/location">Location</Link></li>
            <li><Link to="/vendor">Vendor</Link></li>
            <li><Link to="/Signin">Signin</Link></li>
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
