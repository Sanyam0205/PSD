import React, { useState } from 'react';
import axios from 'axios';
import './custom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ProjectOrderPDF from './ProjectOrderPdf';
import { PDFViewer } from '@react-pdf/renderer';


const ProjectOrd = () => {
  const [searchedPoNumber, setSearchedPoNumber] = useState('');
  const [searchedProjectOrder, setSearchedProjectOrder] = useState(null);
  const [newItem, setNewItem] = useState({
    sno: '',
    description: '',
    unit: '',
    quantity: 0,
    ratePerUnit: 0,
    gstPercentage: 0,
    discount: 0,
    amount: 0,
    subItems: [], // Initialize subItems for new item
  });
  const [signature, setSignature] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState('');
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearchPoNumberChange = (e) => {
    e.preventDefault();
    setSearchedPoNumber(e.target.value);
  };

  const handleSearchProjectOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://ec2-13-234-47-87.ap-south-1.compute.amazonaws.com:5000/api/project-orders/${searchedPoNumber}`);
      const formattedProjectOrder = {
        ...response.data,
        poDate: response.data.poDate.split('T')[0] // Format date to "yyyy-MM-dd"
      };
      setSearchedProjectOrder(formattedProjectOrder);
      setShowPDFPreview(true);
    } catch (error) {
      console.error('Project order not found');
      setSearchedProjectOrder(null);
    }
  };

  const handleEditProjectOrderChange = (e, field) => {
    const value = e.target.value;
    setSearchedProjectOrder({ ...searchedProjectOrder, [field]: value });
  };
  
  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setSignature(file);
    } else {
      console.log('No file selected');
    }
  };

  const handlesignUpload = async () => {
    if (!signature) {
      console.log('No signature file selected');
      return;
    }

    const formData = new FormData();
    formData.append('signature', signature);

    try {
      console.log('Uploading signature...');
      const response = await axios.post('http://13.234.47.87:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload response:', response);
      setSignatureUrl(response.data.filePath);
    } catch (error) {
      console.error('Error uploading signature', error);
    }
  };

  const calculateAmount = (item) => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.reduce((total, subItem) => {
        const discountAmount = (subItem.ratePerUnit * subItem.quantity * subItem.discount) / 100;
        const amountAfterDiscount = subItem.ratePerUnit * subItem.quantity - discountAmount;
        const gstAmount = (amountAfterDiscount * subItem.gstPercentage) / 100;
        return total + amountAfterDiscount + gstAmount;
      }, 0);
    } else {
      const discountAmount = (item.ratePerUnit * item.quantity * item.discount) / 100;
      const amountAfterDiscount = item.ratePerUnit * item.quantity - discountAmount;
      const gstAmount = (amountAfterDiscount * item.gstPercentage) / 100;
      return amountAfterDiscount + gstAmount;
    }
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleEditItemChange = (e, index, field) => {
    const value = e.target.value;
    const updatedItems = [...searchedProjectOrder.items];
    updatedItems[index][field] = value;

    // Update amount for the item if quantity, ratePerUnit, GST, or discount is changed
    if (['quantity', 'ratePerUnit', 'gstPercentage', 'discount'].includes(field)) {
      updatedItems[index].amount = calculateAmount(updatedItems[index]);
    }

    setSearchedProjectOrder({ ...searchedProjectOrder, items: updatedItems });
  };

  const handleEditSubItemChange = (e, index, subIndex, field) => {
    const value = e.target.value;
    const updatedItems = [...searchedProjectOrder.items];
    const updatedSubItems = [...updatedItems[index].subItems];
    updatedSubItems[subIndex][field] = value;
  
    // Recalculate amount for sub-item and item
    updatedItems[index].subItems = updatedSubItems;
    updatedItems[index].amount = calculateAmount(updatedItems[index]);
  
    setSearchedProjectOrder({ ...searchedProjectOrder, items: updatedItems });
  };
  
  
  const handleDeleteSubItem = (index, subIndex) => {
    const updatedItems = [...searchedProjectOrder.items];
    updatedItems[index].subItems.splice(subIndex, 1);
  
    setSearchedProjectOrder({ ...searchedProjectOrder, items: updatedItems });
  };
  
  
  const handleAddSubItem = (index) => {
    const newSubItem = { description: "", quantity: 0, ratePerUnit: 0 };
    const updatedItems = [...searchedProjectOrder.items];
    updatedItems[index].subItems = [...updatedItems[index].subItems, newSubItem];
  
    setSearchedProjectOrder({ ...searchedProjectOrder, items: updatedItems });
  };
  
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedProjectOrder = {
      ...searchedProjectOrder,
      totalAmount: calculateTotalAmount(searchedProjectOrder.items)
    };

    try {
      await axios.put(`http://ec2-13-234-47-87.ap-south-1.compute.amazonaws.com:5000/api/project-orders/${searchedPoNumber}`, updatedProjectOrder);
      alert('Project order updated successfully');
    } catch (error) {
      console.error(error);
      alert('Error updating project order');
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem, [name]: value };

    // Update item calculations
    updatedItem.amount = calculateAmount(updatedItem);

    setNewItem(updatedItem);
  };

  const handleAddNewItem = () => {
    const newSno = searchedProjectOrder.items.length + 1;
    const newItemToAdd = { ...newItem, sno: newSno };

    const updatedItems = [...searchedProjectOrder.items, newItemToAdd];
    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: updatedItems,
      totalAmount: calculateTotalAmount(updatedItems)
    });

    // Reset newItem state for next entry
    setNewItem({
      sno: newSno + 1,
      description: '',
      unit: '',
      quantity: 0,
      ratePerUnit: 0,
      gstPercentage: 0,
      discount: 0,
      amount: 0,
      subItems: []
    });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = searchedProjectOrder.items.filter((_, i) => i !== index);

    // Update sno for remaining items after deletion
    const updatedItemsWithSno = updatedItems.map((item, idx) => ({
      ...item,
      sno: idx + 1 // Update sno starting from 1
    }));

    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: updatedItemsWithSno,
      totalAmount: calculateTotalAmount(updatedItemsWithSno)
    });
  };
  
  return (
    <div className='form-container'>
      {!isEditing ? (
        <>
          {showPDFPreview && searchedProjectOrder && (
            <PDFViewer width="100%" height="600">
              <ProjectOrderPDF
                vendorCode={searchedProjectOrder.vendorCode}
                name={searchedProjectOrder.name}
                contactperson={searchedProjectOrder.contactperson}
                address={searchedProjectOrder.address}
                district={searchedProjectOrder.district}
                state={searchedProjectOrder.state}
                pinCode={searchedProjectOrder.pinCode}
                email={searchedProjectOrder.email}
                contact={searchedProjectOrder.contact}
                gstNumber={searchedProjectOrder.gstNumber}
                locationCode={searchedProjectOrder.locationCode}
                billtoname={searchedProjectOrder.billtoname}
                billtocp={searchedProjectOrder.billtocp}
                billToAddress={searchedProjectOrder.billToAddress}
                billToDistrict={searchedProjectOrder.billToDistrict}
                billToState={searchedProjectOrder.billToState}
                billToPinCode={searchedProjectOrder.billToPinCode}
                billToContact={searchedProjectOrder.billToContact}
                billToEmail={searchedProjectOrder.billToEmail}
                billToGstNumber={searchedProjectOrder.billToGstNumber}
                shippingAddress={searchedProjectOrder.shippingAddress}
                deliveryLocationCode={searchedProjectOrder.deliveryLocationCode}
                deliveryName={searchedProjectOrder.deliveryName}
                delcp={searchedProjectOrder.delcp}
                deliveryDistrict={searchedProjectOrder.deliveryDistrict}
                deliveryState={searchedProjectOrder.deliveryState}
                deliveryPinCode={searchedProjectOrder.deliveryPinCode}
                deliveryContact={searchedProjectOrder.deliveryContact}
                deliveryEmail={searchedProjectOrder.deliveryEmail}
                deliveryGstNumber={searchedProjectOrder.deliveryGstNumber}
                poNumber={searchedPoNumber}
                poDate={searchedProjectOrder.poDate}
                podeliverydate={searchedProjectOrder.podeliverydate}
                type={searchedProjectOrder.type}
                items={searchedProjectOrder.items}
                totalAmount={searchedProjectOrder.totalAmount}
                topsection={searchedProjectOrder.topsection}
                Notes={searchedProjectOrder.Notes}
                tnc={searchedProjectOrder.tnc}
                signature={signatureUrl}
                // Add more props as per your ProjectOrderPDF component requirements
              />
            </PDFViewer>
          )}
          {!showPDFPreview && (
            <div >
            {/* Search project order by PO number */}
            <form onSubmit={handleSearchProjectOrder} className="search-form">
              <div className="search-section">
                <label>Search Project Order by PO Number:</label>
                <input 
                  type="text" 
                  value={searchedPoNumber} 
                  onChange={handleSearchPoNumberChange} 
                />
                <button type="submit">Search</button>
              </div>
            </form>
            </div>
          )}
          {showPDFPreview && (
            <button type="button" onClick={() => setIsEditing(true)}>Edit PO</button>
          )}
        </>
      ) : (
        <div className="edit-section">
          <h2>Edit Project Order</h2>
          <form onSubmit={handleEditSubmit}>
            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea 
                value={searchedProjectOrder.topsection} 
                onChange={(e) => handleEditProjectOrderChange(e, "topsection")} 
              />
            </div>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={searchedProjectOrder.name}
                onChange={(e) => handleEditProjectOrderChange(e, "name")}
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={searchedProjectOrder.address}
                onChange={(e) => handleEditProjectOrderChange(e, "address")}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={searchedProjectOrder.email}
                onChange={(e) => handleEditProjectOrderChange(e, "email")}
              />
            </div>
            <div>
              <label>GST Number:</label>
              <input
                type="text"
                name="gstNumber"
                value={searchedProjectOrder.gstNumber}
                onChange={(e) => handleEditProjectOrderChange(e, "gstNumber")}
              />
            </div>
            <div>
              <label>Bill To Address:</label>
              <input
                type="text"
                name="billToAddress"
                value={searchedProjectOrder.billToAddress}
                onChange={(e) => handleEditProjectOrderChange(e, "billToAddress")}
              />
            </div>
            <div>
              <label>Shipping Address:</label>
              <input
                type="text"
                name="shippingAddress"
                value={searchedProjectOrder.shippingAddress}
                onChange={(e) => handleEditProjectOrderChange(e, "shippingAddress")}
              />
            </div>
            <div>
              <label>Pin Code:</label>
              <input
                type="text"
                name="pinCode"
                value={searchedProjectOrder.pinCode}
                onChange={(e) => handleEditProjectOrderChange(e, "pinCode")}
              />
            </div>
            <div>
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={searchedProjectOrder.state}
                onChange={(e) => handleEditProjectOrderChange(e, "state")}
              />
            </div>
            <div>
              <label>Shipping Phone Number:</label>
              <input
                type="text"
                name="shippingPhoneNumber"
                value={searchedProjectOrder.shippingPhoneNumber}
                onChange={(e) => handleEditProjectOrderChange(e, "shippingPhoneNumber")}
              />
            </div>
            <div>
              <label>PO Date:</label>
              <input
                type="date"
                name="poDate"
                value={searchedProjectOrder.poDate}
                onChange={(e) => handleEditProjectOrderChange(e, "poDate")}
              />
            </div>

            {searchedProjectOrder.items.length > 0 && (
              <div>
                <h3>Items</h3>
                <ul>
                  {searchedProjectOrder.items.map((item, index) => (
                    <li key={index} className="item">
                      <div className="item-fields">
                        <div className="item-field">
                          <label>Serial No:</label>
                          <input type="text" value={item.sno} readOnly />
                        </div>
                        <div className="item-field">
                          <label>Description:</label>
                          <input
                            type="text"
                            name="description"
                            value={item.description}
                            onChange={(e) => handleEditItemChange(e, index, "description")}
                          />
                        </div>
                        {/* Other fields remain unchanged */}
                      </div>
                      
                      <button
                            type="button"
                            onClick={() => handleDeleteItem(index)}
                          >
                            Delete Item
                          </button>

                      {/* Sub-items Section */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="sub-items-section">
                          <h4>Sub-items</h4>
                          <ul>
                            {item.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="sub-item">
                                <div className="sub-item-field">
                                  <label>Sub-item Description:</label>
                                  <input
                                    type="text"
                                    value={subItem.description}
                                    onChange={(e) => handleEditSubItemChange(e, index, subIndex, "description")}
                                  />
                                </div>
                                <div className="sub-item-field">
                                  <label>Quantity:</label>
                                  <input
                                    type="number"
                                    value={subItem.quantity}
                                    onChange={(e) => handleEditSubItemChange(e, index, subIndex, "quantity")}
                                  />
                                </div>
                                <div className="sub-item-field">
                                  <label>Rate:</label>
                                  <input
                                    type="number"
                                    value={subItem.ratePerUnit}
                                    onChange={(e) => handleEditSubItemChange(e, index, subIndex, "rate")}
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={() => handleDeleteSubItem(index, subIndex)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={() => handleAddSubItem(index)}
                          >
                            Add Sub-item
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label>Total Amount:</label>
              <input
                type="number"
                name="totalAmount"
                value={calculateTotalAmount(searchedProjectOrder.items)}
                readOnly
              />
            </div>
            <h3>Add New Item</h3>
              <div className="item-fields">
                <div className="item-field">
                  <label>Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={newItem.description}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="item-field">
                  <label>Unit:</label>
                  <select
                    name="unit"
                    value={newItem.unit}
                    onChange={(e) => handleNewItemChange(e, "unit")}
                  >
                    <option value="choose">Select One</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="metricTon">Metric Ton</option>
                    <option value="metre">Metre (m)</option>
                    <option value="squareMetre">Square Metre (m²)</option>
                    <option value="cubicMetre">Cubic Metre (m³)</option>
                    <option value="litre">Litre (L)</option>
                    <option value="gallon">Gallon</option>
                    <option value="pcs">PCS</option>
                    <option value="nos">Nos</option>
                  </select>
                </div>
                <div className="item-field">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="item-field">
                  <label>Rate Per Unit:</label>
                  <input
                    type="number"
                    name="ratePerUnit"
                    value={newItem.ratePerUnit}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="item-field">
                  <label>GST:</label>
                  <input
                    type="text"
                    name="gstPercentage"
                    value={newItem.gstPercentage}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="item-field">
                  <label>Discount:</label>
                  <input
                    type="text"
                    name="discount"
                    value={newItem.discount}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="item-field">
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={newItem.amount}
                    readOnly
                  />
                </div>
                <button type="button" onClick={handleAddNewItem}>
                  Add Item
                </button>
              </div>

              <div className="sub-items-section">
                <h4>Sub-Items</h4>
                {newItem.subItems && newItem.subItems.length > 0 ? (
                  newItem.subItems.map((subItem, subIndex) => (
                    <div key={subIndex} className="sub-item-fields">
                      <div className="item-field">
                        <label>Description:</label>
                        <input
                          type="text"
                          name="description"
                          value={subItem.description}
                          onChange={(e) => handleEditSubItemChange(e, subIndex, "description")}
                        />
                      </div>
                      <div className="item-field">
                        <label>Quantity:</label>
                        <input
                          type="number"
                          name="quantity"
                          value={subItem.quantity}
                          onChange={(e) => handleEditSubItemChange(e, subIndex, "quantity")}
                        />
                      </div>
                      <div className="item-field">
                        <label>Rate:</label>
                        <input
                          type="number"
                          name="rate"
                          value={subItem.rate}
                          onChange={(e) => handleEditSubItemChange(e, subIndex, "rate")}
                        />
                      </div>
                      <button type="button" onClick={() => handleDeleteSubItem(subIndex)}>
                        Remove Sub-Item
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No sub-items added yet.</p>
                )}
                <button type="button" onClick={handleAddSubItem}>
                  Add Sub-Item
                </button>

            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea value={searchedProjectOrder.Notes} onChange={(e) => handleEditItemChange(e.target.value)} />
            </div>
            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea value={searchedProjectOrder.tnc} onChange={(e) => handleEditItemChange(e.target.value)} />
            </div>
            {showPDFPreview &&  (
            <PDFViewer width="100%" height="600">
              <ProjectOrderPDF
                vendorCode={searchedProjectOrder.vendorCode}
                name={searchedProjectOrder.name}
                contactperson={searchedProjectOrder.contactperson}
                address={searchedProjectOrder.address}
                district={searchedProjectOrder.district}
                state={searchedProjectOrder.state}
                pinCode={searchedProjectOrder.pinCode}
                email={searchedProjectOrder.email}
                contact={searchedProjectOrder.contact}
                gstNumber={searchedProjectOrder.gstNumber}
                locationCode={searchedProjectOrder.locationCode}
                billtoname={searchedProjectOrder.billtoname}
                billtocp={searchedProjectOrder.billtocp}
                billToAddress={searchedProjectOrder.billToAddress}
                billToDistrict={searchedProjectOrder.billToDistrict}
                billToState={searchedProjectOrder.billToState}
                billToPinCode={searchedProjectOrder.billToPinCode}
                billToContact={searchedProjectOrder.billToContact}
                billToEmail={searchedProjectOrder.billToEmail}
                billToGstNumber={searchedProjectOrder.billToGstNumber}
                shippingAddress={searchedProjectOrder.shippingAddress}
                deliveryLocationCode={searchedProjectOrder.deliveryLocationCode}
                deliveryName={searchedProjectOrder.deliveryName}
                delcp={searchedProjectOrder.delcp}
                deliveryDistrict={searchedProjectOrder.deliveryDistrict}
                deliveryState={searchedProjectOrder.deliveryState}
                deliveryPinCode={searchedProjectOrder.deliveryPinCode}
                deliveryContact={searchedProjectOrder.deliveryContact}
                deliveryEmail={searchedProjectOrder.deliveryEmail}
                deliveryGstNumber={searchedProjectOrder.deliveryGstNumber}
                poNumber={searchedPoNumber}
                poDate={searchedProjectOrder.poDate}
                podeliverydate={searchedProjectOrder.podeliverydate}
                type={searchedProjectOrder.type}
                items={searchedProjectOrder.items}
                totalAmount={searchedProjectOrder.totalAmount}
                topsection={searchedProjectOrder.topsection}
                Notes={searchedProjectOrder.Notes}
                tnc={searchedProjectOrder.tnc}
                signature={signatureUrl}
                // Add more props as per your ProjectOrderPDF component requirements
              />
            </PDFViewer>
          )}
            <button type="button" onClick={() => setShowPDFPreview(true)}>Preview PDF</button>
            <div>
            </div>
            <button type="button" onClick={() => setShowPDFPreview(false)}>Close PDF</button>
            </div>
            <div className="signature-section">
              <label>Signature:</label>
              <input type="file" accept="image/*" onChange={handleSignatureChange} />
              <button type="button" onClick={handlesignUpload}>Upload Signature</button>
              {signatureUrl && <img src={`http://13.234.47.87:5000${signatureUrl}`} alt="Signature"  />}
            </div>
              <button type="submit">Update Project Order</button>
            </form>
          </div>
        )}
      </div>
  );
};

export default ProjectOrd;
