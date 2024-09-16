import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  // const location = useLocation();
  const [userDetails, setUserDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const storedFirstName = localStorage.getItem('firstName');
      const storedLastName = localStorage.getItem('lastName');
      const storedRole = localStorage.getItem('userRole');

      setIsAuthenticated(authStatus === 'true');
      setRole(storedRole || '');
      setFirstName(storedFirstName || '');
      setLastName(storedLastName || '');
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        axios.get(`http://13.234.47.87:5000/api/users/${userId}`)
          .then(response => {
            setUserDetails(response.data);
          })
          .catch(error => {
            console.error('Error fetching user details:', error);
            // Set basic user details from localStorage if API call fails
            setUserDetails({
              firstName: localStorage.getItem('firstName') || 'N/A',
              lastName: localStorage.getItem('lastName') || 'N/A',
              email: localStorage.getItem('email') || 'N/A',
              phoneNumber: localStorage.getItem('phoneNumber') || 'N/A'
            });
          });
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('phoneNumber');
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    navigate('/');
  };


  return (
    <div className="sidebar">
      <div className="profile-section" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : `${firstName} ${lastName}`}</h3>
        {isExpanded && userDetails && (
          <div className="user-details">
            <p>Email: {userDetails.email}</p>
            <p>Phone: {userDetails.phoneNumber}</p>
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
