import React, { useState } from 'react';
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
import Sidebar from './Sidebar';
import AppDash from './AppDash';
import PrivateRoute from './PrivateRoute';
import './App.css';

function App() {
  const initialRole = localStorage.getItem('userRole') || '';
  const initialUsername = localStorage.getItem('username') || '';
  const initialPhoneNumber = localStorage.getItem('phoneNumber') || '';
  const initialEmail = localStorage.getItem('email') || '';

  const [role, setRole] = useState(initialRole);
  const [username, setUsername] = useState(initialUsername);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [email, setEmail] = useState(initialEmail);

  const handleLogin = (userRole, userName) => {
    setRole(userRole);
    setUsername(userName);
    
    // Logging the logged-in user and their role
    console.log(`User logged in: ${userName}`);
    console.log(`Role: ${userRole}`);
  };

  const handleLogout = () => {
    setRole('');
    setUsername('');
    setPhoneNumber('');
    setEmail('');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('email');
  };

  const isAuthenticated = !!role;

  return (
    <div className="App">
      <Router>
        {isAuthenticated && <Sidebar role={role} username={username} onLogout={handleLogout} />}

        <div className={`main-content ${role ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/signin" element={<Signin />} />
            
            {/* Role-specific Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Admin']}>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/form"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Creator', 'Admin']}>
                  <Form />
                </PrivateRoute>
              }
            />
            <Route
              path="/projectorder"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Creator', 'Viewer', 'Admin']}>
                  <ProjectOrd />
                </PrivateRoute>
              }
            />
            <Route
              path="/vendor"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Admin']}>
                  <VendorManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/location"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Admin']}>
                  <LocationManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/creator"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Creator']}>
                  <Creator />
                </PrivateRoute>
              }
            />
            <Route
              path="/viewer"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Viewer']}>
                  <Viewer />
                </PrivateRoute>
              }
            />
            <Route
              path="/approver"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Approver']}>
                  <Approver username={username} />
                </PrivateRoute>
              }
            />
            <Route
              path="/usermanagement"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Admin']}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/AppDash"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Approver']}>
                  <AppDash />
                </PrivateRoute>
              }
            />
            <Route
              path="/signin-admin"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Admin']}>
                  <Signin />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/settings"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} role={role} allowedRoles={['Creator', 'Viewer', 'Approver', 'Admin']}>
                  <Settings />
                </PrivateRoute>
              }
            /> */}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
