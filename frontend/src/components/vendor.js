import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './location.module.css';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vendorCode: '',
    contactperson: '',
    address: '',
    district: '',
    state: '',
    pinCode: '',
    email: '',
    contact: '',
    gstNumber: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateVendorCode = () => {
    if (vendors.length === 0) return 'VEN00001';
    const codes = vendors.map(vendor => parseInt(vendor.vendorCode.replace('VEN', '')));
    const maxCode = Math.max(...codes);
    return `VEN${String(maxCode + 1).padStart(5, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.vendorCode) {
        formData.vendorCode = generateVendorCode();
      }
      const existingVendor = vendors.find(vendor => vendor.vendorCode === formData.vendorCode);
      if (existingVendor) {
        await axios.put(`http://13.234.47.87:5000/api/vendors/${formData.vendorCode}`, formData);
      } else {
        await axios.post('http://13.234.47.87:5000/api/vendors', formData);
      }
      fetchVendors();
      setFormData({
        name: '',
        vendorCode: '',
        contactperson: '',
        address: '',
        district: '',
        state: '',
        pinCode: '',
        email: '',
        contact: '',
        gstNumber: ''
      });
    } catch (error) {
      console.error('Error submitting vendor:', error);
    }
  };

  const handleDelete = async (code) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vendor?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://13.234.47.87:5000/api/vendors/${code}`);
        fetchVendors();
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const handleUpdate = (code) => {
    const existingVendor = vendors.find(vendor => vendor.vendorCode === code);
    if (existingVendor) {
      setFormData({
        name: existingVendor.name,
        vendorCode: existingVendor.vendorCode,
        contactperson: existingVendor.contactperson,
        address: existingVendor.address,
        district: existingVendor.district,
        state: existingVendor.state,
        pinCode: existingVendor.pinCode,
        email: existingVendor.email,
        contact: existingVendor.contact,
        gstNumber: existingVendor.gstNumber
      });
    } else {
      console.error('Vendor not found.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Vendor Management</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['item-field']}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>Contact Person:</label>
          <input type="text" name="contactperson" value={formData.contactperson} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>District:</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>state:</label>
          <input type="text" name="state" value={formData.state} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>Pin Code:</label>
          <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>Contact:</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
        </div>
        <div className={styles['item-field']}>
          <label>GST Number:</label>
          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
        </div>
        <button type="submit">Add/Update Vendor</button>
      </form>
      <h3>Vendors</h3>
      <ul>
        {vendors.map(vendor => (
          <li key={vendor._id} className={styles.item}>
            <div className={styles['item-fields']}>
              <div className={styles['item-field']}><strong>Name:</strong> <span>{vendor.name}</span></div>
              <div className={styles['item-field']}><strong>Code:</strong> <span>{vendor.vendorCode}</span></div>
              <div className={styles['item-field']}><strong>Contact Person:</strong> <span>{vendor.contactperson}</span></div>
              <div className={styles['item-field']}><strong>Address:</strong> <span>{vendor.address}</span></div>
              <div className={styles['item-field']}><strong>District:</strong> <span>{vendor.district}</span></div>
              <div className={styles['item-field']}><strong>state:</strong> <span>{vendor.state}</span></div>
              <div className={styles['item-field']}><strong>Pin Code:</strong> <span>{vendor.pinCode}</span></div>
              <div className={styles['item-field']}><strong>Email:</strong> <span>{vendor.email}</span></div>
              <div className={styles['item-field']}><strong>Contact:</strong> <span>{vendor.contact}</span></div>
              <div className={styles['item-field']}><strong>GST Number:</strong> <span>{vendor.gstNumber}</span></div>
              <div className={styles['item-field']}>
                <button onClick={() => handleDelete(vendor.vendorCode)}>Delete</button>
                <button onClick={() => handleUpdate(vendor.vendorCode)}>Update</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorManagement;
