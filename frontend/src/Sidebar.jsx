import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role, onLogout, firstName = '', lastName = '' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    localStorage.clear();
    navigate('/');
  };



  return (
    <div className="sidebar">
      <div className="profile-section">
        <h3>{firstName}</h3>
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
