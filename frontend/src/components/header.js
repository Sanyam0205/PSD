import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">Your Logo</Link>
      </div>
      {/* Navigation Links */}
      <div className="nav-link">
        <Link to="/form">Form</Link>
      </div>
      <div className="nav-link">
        <Link to="/projectorder">ProjectOrder</Link>
      </div>
      <div className="nav-link">
        <Link to="/vendor">VendorManagement</Link>
      </div>
      <div className="nav-link">
        <Link to="/Login">Login</Link>
      </div>
      {/* Add more navigation links here */}
    </nav>
  );
};

export default Navbar;
