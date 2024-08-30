// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from './components/form';
import ProjectOrd from './components/projectorder';
import VendorManagement from './components/vendor';
import LocationManagement from './components/location';
import Home from './Home';
import Signin from './Signin';
import Login from './Login';
import Creator from './Creator';
import Viewer from './Viewer';
import Approver from './Approver';
import UserManagement from './UserManagement';
import Sidebar from './Sidebar'; // Import the Sidebar component
import './App.css';
import AppDash from './AppDash';

function App() {
  // Read the initial role from localStorage, if available
  const initialRole = localStorage.getItem('userRole') || '';
  const [role, setRole] = useState(initialRole); // State to manage user role

  // Handle login to set the role
  const handleLogin = (userRole) => {
    setRole(userRole);
    localStorage.setItem('userRole', userRole); // Save role to localStorage
  };

  // Effect to clear role if logging out
  const handleLogout = () => {
    setRole('');
    localStorage.removeItem('userRole'); // Clear role from localStorage
  };

  return (
    <div className="App">
      <Router>
        {/* Render the Sidebar only if the user role is set */}
        {role && <Sidebar role={role} onLogout={handleLogout} />} {/* Pass onLogout to Sidebar */}

        <div className={`main-content ${role ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} /> {/* Pass the handleLogin function */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/home" element={<Home />} />
            <Route path="/form" element={<Form />} />
            <Route path="/projectorder" element={<ProjectOrd />} />
            <Route path="/vendor" element={<VendorManagement />} />
            <Route path="/location" element={<LocationManagement />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="/approver" element={<Approver />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/AppDash" element={<AppDash/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
