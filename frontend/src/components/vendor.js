import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vendorCode: '',
    contactperson: '',
    address: '',
    email: '',
    contact: '',
    gstNumber: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://0.0.0.0:5000/api/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.vendorCode) {
        const existingVendor = vendors.find(vendor => vendor.vendorCode === formData.vendorCode);
        if (existingVendor) {
          await axios.put(`http://0.0.0.0:5000/api/vendors/${formData.vendorCode}`, formData);
        } else {
          await axios.post('http://0.0.0.0:5000/api/vendors', formData);
        }
      } else {
        console.error('Vendor code is required.');
      }
      fetchVendors();
      setFormData({
        name: '',
        vendorCode: '',
        contactperson: '',
        address: '',
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
        await axios.delete(`http://0.0.0.0:5000/api/vendors/${code}`);
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
        email: existingVendor.email,
        contact: existingVendor.contact,
        gstNumber: existingVendor.gstNumber
      });
    } else {
      console.error('Vendor not found.');
    }
  };

  return (
    <div className="form-container">
      <h2>Vendor Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="item-field">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>Vendor Code:</label>
          <input type="text" name="vendorCode" value={formData.vendorCode} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>Contact Person:</label>
          <input type="text" name="contactperson" value={formData.contactperson} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>Contact:</label>
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
        </div>
        <div className="item-field">
          <label>GST Number:</label>
          <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
        </div>
        <button type="submit">Add/Update Vendor</button>
      </form>
      <h3>Vendors</h3>
      <ul>
        {vendors.map(vendor => (
          <li key={vendor._id} className="item">
            <div className="item-fields">
              <div className="item-field"><strong>Name:</strong> {vendor.name}</div>
              <div className="item-field"><strong>Code:</strong> {vendor.vendorCode}</div>
              <div className="item-field"><strong>Contact Person:</strong> {vendor.contactperson}</div>
              <div className="item-field"><strong>Email:</strong> {vendor.email}</div>
              <div className="item-field"><strong>Contact:</strong> {vendor.contact}</div>
              <div className="item-field"><strong>GST Number:</strong> {vendor.gstNumber}</div>
              <div className="item-field">
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
