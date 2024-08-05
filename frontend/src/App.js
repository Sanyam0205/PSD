import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/header'; // Adjust the path as necessary
import Form from './components/form';
import ProjectOrd from './components/projectorder';
import VendorManagement from './components/vendor';
import Homepage from './components/homepage';
import LocationManagement from './components/location';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/form" element={<Form />} />
          <Route path="/projectorder" element={<ProjectOrd />} />
          <Route path="/vendor" element={<VendorManagement/>} />
          <Route path="/" element={<Homepage />} />
          <Route path="/location" element={<LocationManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;