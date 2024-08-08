import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationManagement = () => {
  const [location, setLocation] = useState([]);
  const [formData, setFormData] = useState({
    locationCode: '',
    billtoname: '',
    billtocp: '',
    billToAddress: '',
    billToDistrict: '',
    billToState: '',
    billToPinCode: '',
    billToGstNumber: '',
    billToContact: '',
    billToEmail: ''
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/location');
      setLocation(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLocationCode = () => {
    if (location.length === 0) return 'LOC00001';
    const codes = location.map(loc => parseInt(loc.locationCode.replace('LOC', '')));
    const maxCode = Math.max(...codes);
    return `LOC${String(maxCode + 1).padStart(5, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.locationCode) {
        formData.locationCode = generateLocationCode();
      }
      const existingLocation = location.find(loc => loc.locationCode === formData.locationCode);
      if (existingLocation) {
        await axios.put(`http://13.234.47.87:5000/api/location/${formData.locationCode}`, formData);
      } else {
        await axios.post('http://13.234.47.87:5000/api/location', formData);
      }
      fetchLocation();
      setFormData({
        locationCode: '',
        billtoname: '',
        billtocp:'',
        billToAddress: '',
        billToDistrict: '',
        billToState: '',
        billToPinCode: '',
        billToGstNumber: '',
        billToContact: '',
        billToEmail: ''
      });
    } catch (error) {
      console.error('Error submitting location:', error);
    }
  };

  const handleDelete = async (code) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this location?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://13.234.47.87:5000/api/location/${code}`);
        fetchLocation();
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const handleUpdate = (code) => {
    const existingLocation = location.find(loc => loc.locationCode === code);
    if (existingLocation) {
      setFormData({
        locationCode: existingLocation.locationCode,
        billtoname: existingLocation.billtoname,
        billtocp: existingLocation.billtocp,
        billToAddress: existingLocation.billToAddress,
        billToDistrict: existingLocation.billToDistrict,
        billToState: existingLocation.billToState,
        billToPinCode: existingLocation.billToPinCode,
        billToGstNumber: existingLocation.billToGstNumber,
        billToContact: existingLocation.billToContact,
        billToEmail: existingLocation.billToEmail
      });
    } else {
      console.error('Location not found.');
    }
  };

  return (
    <div className="form-container">
      <h2>Location Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="item-field">
          <label>Bill To Name:</label>
          <input type="text" name="billtoname" value={formData.billtoname} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To Contact Name:</label>
          <input type="text" name="billtocp" value={formData.billtocp} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To Address:</label>
          <input type="text" name="billToAddress" value={formData.billToAddress} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To District:</label>
          <input type="text" name="billToDistrict" value={formData.billToDistrict} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To State:</label>
          <input type="text" name="billToState" value={formData.billToState} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To Pin Code:</label>
          <input type="text" name="billToPinCode" value={formData.billToPinCode} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To GST Number:</label>
          <input type="text" name="billToGstNumber" value={formData.billToGstNumber} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To Contact:</label>
          <input type="text" name="billToContact" value={formData.billToContact} onChange={handleChange} required />
        </div>
        <div className="item-field">
          <label>Bill To Email:</label>
          <input type="email" name="billToEmail" value={formData.billToEmail} onChange={handleChange} required />
        </div>
        <button type="submit">Add/Update Location</button>
      </form>
      <h3>location</h3>
      <ul>
        {location.map(location => (
          <li key={location._id} className="item">
            <div className="item-fields">
              <div className="item-field"><strong>Code:</strong> {location.locationCode}</div>
              <div className="item-field"><strong>Name:</strong> {location.billtoname}</div>
              <div className="item-field"><strong>Contact Name:</strong> {location.billtocp}</div>
              <div className="item-field"><strong>Address:</strong> {location.billToAddress}</div>
              <div className="item-field"><strong>District:</strong> {location.billToDistrict}</div>
              <div className="item-field"><strong>State:</strong> {location.billToState}</div>
              <div className="item-field"><strong>Pin Code:</strong> {location.billToPinCode}</div>
              <div className="item-field"><strong>GST Number:</strong> {location.billToGstNumber}</div>
              <div className="item-field"><strong>Contact:</strong> {location.billToContact}</div>
              <div className="item-field"><strong>Email:</strong> {location.billToEmail}</div>
              <div className="item-field">
                <button onClick={() => handleDelete(location.locationCode)}>Delete</button>
                <button onClick={() => handleUpdate(location.locationCode)}>Update</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationManagement;
