import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './custom.css';
import ProjectOrderPDF from './ProjectOrderPdf';
import { PDFViewer } from '@react-pdf/renderer';
import Select from 'react-select';

const ProjectOrd = () => {
  const [poNumbers, setPoNumbers] = useState([]);
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

  useEffect(() => {
    const fetchPoNumbers = async () => {
      try {
        const response = await axios.get('http://13.234.47.87:5000/api/project-orders/all');
        const poOptions = response.data.map(po => ({
          value: po.poNumber,
          label: `${po.poNumber} - ${po.name}`,
        }));
        setPoNumbers(poOptions);
      } catch (error) {
        console.error('Error fetching PO numbers:', error);
      }
    };

    fetchPoNumbers();
  }, []);

  const calculateAmount = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const ratePerUnit = parseFloat(item.ratePerUnit) || 0;
    const gstPercentage = parseFloat(item.gstPercentage) || 0;
    const discount = parseFloat(item.discount) || 0;

    const baseAmount = quantity * ratePerUnit;
    const discountAmount = (baseAmount * discount) / 100;
    const amountAfterDiscount = baseAmount - discountAmount;
    const gstAmount = (amountAfterDiscount * gstPercentage) / 100;
    
    return amountAfterDiscount + gstAmount;
  };

  const calculateItemTotalAmount = (item) => {
    const itemAmount = calculateAmount(item);
    const subItemsAmount = item.subItems ? item.subItems.reduce((total, subItem) => total + calculateAmount(subItem), 0) : 0;
    return itemAmount + subItemsAmount;
  };
  
  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + calculateItemTotalAmount(item), 0);
  };
  
  const recalculateAmounts = (items) => {
    return items.map(item => {
      const updatedSubItems = item.subItems ? item.subItems.map(subItem => ({
        ...subItem,
        amount: calculateAmount(subItem)
      })) : [];
      return { 
        ...item, 
        amount: calculateAmount(item),
        totalAmount: calculateItemTotalAmount({...item, subItems: updatedSubItems}),
        subItems: updatedSubItems
      };
    });
  };

  const handleSelectChange = (selectedOption) => {
    setSearchedPoNumber(selectedOption ? selectedOption.value : null);
  };

  const handleSearchProjectOrder = async (e) => {
    e.preventDefault();
    if (!searchedPoNumber) return;
    try {
      const response = await axios.get(`http://13.234.47.87:5000/api/project-orders/${searchedPoNumber}`);
      const formattedProjectOrder = {
        ...response.data,
        poDate: response.data.poDate.split('T')[0], // Format date to "yyyy-MM-dd"
      };
      setSearchedProjectOrder(formattedProjectOrder);
      setShowPDFPreview(true);
    } catch (error) {
      console.error('Project order not found');
      setSearchedProjectOrder(null);
    }
  };

  const handleEditProjectOrderChange = (e, field) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setSearchedProjectOrder({ ...searchedProjectOrder, [field]: value });
  };

const handleEditItemChange = (e, index, field) => {
  const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
  const updatedItems = [...searchedProjectOrder.items];
  updatedItems[index] = { ...updatedItems[index], [field]: value };

  const recalculatedItems = recalculateAmounts(updatedItems);
  const totalAmount = calculateTotalAmount(recalculatedItems);

  setSearchedProjectOrder({
    ...searchedProjectOrder,
    items: recalculatedItems,
    totalAmount: totalAmount
  });
};

const handleEditSubItemChange = (e, itemIndex, subIndex, field) => {
  const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
  const updatedItems = [...searchedProjectOrder.items];
  updatedItems[itemIndex].subItems[subIndex] = { 
    ...updatedItems[itemIndex].subItems[subIndex], 
    [field]: value 
  };

  const recalculatedItems = recalculateAmounts(updatedItems);
  const totalAmount = calculateTotalAmount(recalculatedItems);

  setSearchedProjectOrder({
    ...searchedProjectOrder,
    items: recalculatedItems,
    totalAmount: totalAmount
  });
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

  const handleAddSubItem = (index) => {
    const updatedItems = [...searchedProjectOrder.items];
    if (!updatedItems[index].subItems) {
      updatedItems[index].subItems = [];
    }
    updatedItems[index].subItems.push({
      description: '',
      quantity: 0,
      ratePerUnit: 0,
      gstPercentage: 0,
      discount: 0,
      amount: 0
    });
  
    const recalculatedItems = recalculateAmounts(updatedItems);
    const totalAmount = calculateTotalAmount(recalculatedItems);
  
    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: recalculatedItems,
      totalAmount: totalAmount
    });
  };

  const handleDeleteSubItem = (itemIndex, subIndex) => {
    const updatedItems = [...searchedProjectOrder.items];
    updatedItems[itemIndex].subItems.splice(subIndex, 1);
  
    const recalculatedItems = recalculateAmounts(updatedItems);
    const totalAmount = calculateTotalAmount(recalculatedItems);
  
    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: recalculatedItems,
      totalAmount: totalAmount
    });
  };

  const handleAddNewItem = () => {
    const newItem = {
      sno: searchedProjectOrder.items.length + 1,
      description: '',
      unit: '',
      quantity: 0,
      ratePerUnit: 0,
      gstPercentage: 0,
      discount: 0,
      amount: 0,
      subItems: [],
    };

    const updatedItems = [...searchedProjectOrder.items, newItem];
    const recalculatedItems = recalculateAmounts(updatedItems);
    const totalAmount = calculateTotalAmount(recalculatedItems);

    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: recalculatedItems,
      totalAmount: totalAmount
    });
  };

  const handleDeleteItem = (index) => {
    const updatedItems = searchedProjectOrder.items.filter((_, i) => i !== index);

    // Update sno for remaining items after deletion
    const updatedItemsWithSno = updatedItems.map((item, idx) => ({
      ...item,
      sno: idx + 1, // Update sno starting from 1
    }));

    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: updatedItemsWithSno,
      totalAmount: calculateTotalAmount(updatedItemsWithSno),
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedProjectOrder = {
      ...searchedProjectOrder,
      totalAmount: calculateTotalAmount(searchedProjectOrder.items),
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

  return (
    <div className="form-container">
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
            <div>
              {/* Search project order by PO number */}
              <form onSubmit={handleSearchProjectOrder} className="search-form">
                <div className="search-section">
                  <label>Search Project Order by PO Number:</label>
                  <Select
                    options={poNumbers}
                    onChange={handleSelectChange}
                    placeholder="Enter or select PO number"
                    isClearable
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
            <div className="custom-text-section">
              <label>Top Section:</label>
              <textarea
                value={searchedProjectOrder.topsection}
                onChange={(e) => handleEditProjectOrderChange(e, "topsection")}
              />
            </div>
            <div>
              <label>Vendor Code:</label>
              <input
                type="text"
                value={searchedProjectOrder.vendorCode}
                onChange={(e) => handleEditProjectOrderChange(e, "vendorCode")}
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

            <div>
              <h3>Items</h3>
              {searchedProjectOrder.items.map((item, index) => (
                <div key={index} className="item">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleEditItemChange(e, index, "description")}
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleEditItemChange(e, index, "quantity")}
                  />
                  <input
                    type="number"
                    value={item.ratePerUnit}
                    onChange={(e) => handleEditItemChange(e, index, "ratePerUnit")}
                  />
                  <input
                    type="number"
                    value={item.gstPercentage}
                    onChange={(e) => handleEditItemChange(e, index, "gstPercentage")}
                  />
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleEditItemChange(e, index, "discount")}
                  />
                    {/* <span>Item Amount: {(item.amount || 0).toFixed(2)}</span> */}
                    <span>Total Amount (including sub-items): {(item.totalAmount || 0).toFixed(2)}</span>
                  
                  {/* Sub-items section */}
                  <div>
                    <h4>Sub-items</h4>
                    {item.subItems && item.subItems.map((subItem, subIndex) => (
                      <div key={subIndex} className="sub-item">
                        <input
                          type="text"
                          value={subItem.description}
                          onChange={(e) => handleEditSubItemChange(e, index, subIndex, "description")}
                        />
                        <input
                          type="number"
                          value={subItem.quantity}
                          onChange={(e) => handleEditSubItemChange(e, index, subIndex, "quantity")}
                        />
                        <input
                          type="number"
                          value={subItem.ratePerUnit}
                          onChange={(e) => handleEditSubItemChange(e, index, subIndex, "ratePerUnit")}
                        />
                        <input
                          type="number"
                          value={subItem.gstPercentage}
                          onChange={(e) => handleEditSubItemChange(e, index, subIndex, "gstPercentage")}
                        />
                        <input
                          type="number"
                          value={subItem.discount}
                          onChange={(e) => handleEditSubItemChange(e, index, subIndex, "discount")}
                        />
                        <span>Amount: {(subItem.amount || 0).toFixed(2)}</span>
                        <button type="button" onClick={() => handleDeleteSubItem(index, subIndex)}>Delete Sub-item</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddSubItem(index)}>Add Sub-item</button>
                  </div>
                  
                  <button type="button" onClick={() => handleDeleteItem(index)}>Delete Item</button>
                </div>
              ))}
              <button type="button" onClick={handleAddNewItem}>Add New Item</button>
            </div>
            <div>
              <label>Total Amount:</label>
              <input
                type="number"
                value={(searchedProjectOrder.totalAmount || 0).toFixed(2)}
                readOnly
              />
            </div>

            {/* <h3>Add New Item</h3>
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
              <button
                type="button"
            onClick={handleAddNewItem}
          >
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
        </div> */}

        <div className="custom-text-section">
          <label>Top Section:</label>
          <textarea value={searchedProjectOrder.Notes} onChange={(e) => handleEditItemChange(e.target.value)} />
        </div>
        <div className="custom-text-section">
          <label>Top Section:</label>
          <textarea value={searchedProjectOrder.tnc} onChange={(e) => handleEditItemChange(e.target.value)} />
          </div>

          {showPDFPreview && (
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
          <button type="button" onClick={() => setShowPDFPreview(true)}>
            Preview PDF
          </button>
          <div>
            <button type="button" onClick={() => setShowPDFPreview(false)}>
              Close PDF
            </button>
          </div>
          <div className="signature-section">
            <label>Signature:</label>
            <input type="file" accept="image/*" onChange={handleSignatureChange} />
            <button type="button" onClick={handlesignUpload}>
              Upload Signature
            </button>
            {signatureUrl && (
              <img src={`http://13.234.47.87:5000${signatureUrl}`} alt="Signature" />
            )}
          </div>
          <button type="submit">Update Project Order</button>
        </form>
      </div>
    )}
  </div>
    );
  };
  
  export default ProjectOrd;