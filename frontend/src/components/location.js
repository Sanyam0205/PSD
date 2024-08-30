import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './location.module.css'; // Importing CSS Module

const LocationManagement = () => {
  const initialFormData = {
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
  };

  const [location, setLocation] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/location');
      setLocation(response.data);
    } catch (error) {
      setError('Error fetching locations.');
      console.error('Error fetching location:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateLocationCode = () => {
    if (location.length === 0) return 'LOC00001';
    const codes = location.map(loc => parseInt(loc.locationCode.replace('LOC', ''), 10));
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
      setFormData(initialFormData);
    } catch (error) {
      setError('Error submitting location.');
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
        setError('Error deleting location.');
        console.error('Error deleting location:', error);
      }
    }
  };

  const handleUpdate = (code) => {
    const existingLocation = location.find(loc => loc.locationCode === code);
    if (existingLocation) {
      setFormData(existingLocation);
    } else {
      setError('Location not found.');
      console.error('Location not found.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Location Management</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.itemField}>
          <label>Bill To Name:</label>
          <input type="text" name="billtoname" value={formData.billtoname} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To Contact Name:</label>
          <input type="text" name="billtocp" value={formData.billtocp} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To Address:</label>
          <input type="text" name="billToAddress" value={formData.billToAddress} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To District:</label>
          <input type="text" name="billToDistrict" value={formData.billToDistrict} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To State:</label>
          <input type="text" name="billToState" value={formData.billToState} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To Pin Code:</label>
          <input type="text" name="billToPinCode" value={formData.billToPinCode} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To GST Number:</label>
          <input type="text" name="billToGstNumber" value={formData.billToGstNumber} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To Contact:</label>
          <input type="text" name="billToContact" value={formData.billToContact} onChange={handleChange} required />
        </div>
        <div className={styles.itemField}>
          <label>Bill To Email:</label>
          <input type="email" name="billToEmail" value={formData.billToEmail} onChange={handleChange} required />
        </div>
        <button type="submit" className={styles.submitButton}>Add/Update Location</button>
      </form>
      <h3>Locations</h3>
      <ul className={styles.locationList}>
        {location.map(loc => (
          <li key={loc._id} className={styles.item}>
            <div className={styles.itemFields}>
              <div className={styles.itemField}><strong>Code:</strong> {loc.locationCode}</div>
              <div className={styles.itemField}><strong>Name:</strong> {loc.billtoname}</div>
              <div className={styles.itemField}><strong>Contact Name:</strong> {loc.billtocp}</div>
              <div className={styles.itemField}><strong>Address:</strong> {loc.billToAddress}</div>
              <div className={styles.itemField}><strong>District:</strong> {loc.billToDistrict}</div>
              <div className={styles.itemField}><strong>State:</strong> {loc.billToState}</div>
              <div className={styles.itemField}><strong>Pin Code:</strong> {loc.billToPinCode}</div>
              <div className={styles.itemField}><strong>GST Number:</strong> {loc.billToGstNumber}</div>
              <div className={styles.itemField}><strong>Contact:</strong> {loc.billToContact}</div>
              <div className={styles.itemField}><strong>Email:</strong> {loc.billToEmail}</div>
              <div className={styles.itemField}>
                <button onClick={() => handleDelete(loc.locationCode)} className={styles.deleteButton}>Delete</button>
                <button onClick={() => handleUpdate(loc.locationCode)} className={styles.updateButton}>Update</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationManagement;
