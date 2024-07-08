import React, { useState } from 'react';
import axios from 'axios';
import './custom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import letterhead from '../assets/images.png';
import footer from '../assets/footer.png';

const ProjectOrd = () => {
  const [searchedPoNumber, setSearchedPoNumber] = useState('');
  const [searchedProjectOrder, setSearchedProjectOrder] = useState(null);
  const [newItem, setNewItem] = useState({
    sno: '', // Initial sno for the new item
    description: '',
    unit: '',
    quantity: 0,
    ratePerUnit: 0,
    gstPercentage:0,
    discount: 0,
    amount: 0
  });

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const imagedata = letterhead;
      const footerdata = footer;
  
      doc.setFontSize(11);
      doc.setFont('Times', 'normal');
  
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const imageWidth = 50;
      const imageHeight = 25; // Adjusted height for the image
      const imageX = (pageWidth - imageWidth) / 2;
      const imageY = 10;
  
      const textX = 12;
      const footerHeight = 30; // Approximate height of the footer image
      const headerHeight = 40; // Approximate height for the header section
      const marginBottom = 10; // Margin from bottom of the page
  
      const drawBorder = () => {
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Draw border around content
      };
  
      const addHeader = () => {
        doc.addImage(imagedata, 'PNG', imageX, imageY, imageWidth, imageHeight);
        doc.text(`PO Number: ${searchedProjectOrder.poNumber}`, textX, 35); // Use searchedProjectOrder.poNumber instead of searchedPoNumber
        doc.text(`PO Date: ${searchedProjectOrder.poDate}`, textX, 40); // Use searchedProjectOrder.poDate instead of searchedProjectOrder.poDate
        drawBorder(); // Draw border after adding header
      };
  
      const addFooter = () => {
        doc.addImage(footerdata, 'PNG', 10, pageHeight - footerHeight - 10, pageWidth - 20, footerHeight);
        // Add page number at the bottom corner
        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 10);
        drawBorder(); // Draw border after adding footer
      };
  
      const addNewPage = () => {
        doc.addPage();
        addHeader();
        addFooter();
      };
  
      const checkSpaceAndAddPage = (requiredHeight) => {
        if (doc.internal.pageSize.getHeight() - doc.autoTable.previous.finalY - footerHeight - marginBottom < requiredHeight) {
          addNewPage();
        }
      };
  
      addHeader();
      addFooter();
  
      let textY = 50; // Initial textY to give space for the header image and details
  
      // Vendor Details Table
      doc.autoTable({
        startY: textY,
        head: [['Vendor Details', 'Bill to Details', 'Ship to Details']],
        body: [
          [`Name: ${searchedProjectOrder.name}`, `Address: ${searchedProjectOrder.billToAddress}`, `Address: ${searchedProjectOrder.shippingAddress}`],
          [`Address: ${searchedProjectOrder.address}`, `GST Number: ${searchedProjectOrder.billToGstNumber}`, `Pin Code: ${searchedProjectOrder.pinCode}`],
          [`Email: ${searchedProjectOrder.email}`, '', `State: ${searchedProjectOrder.state}`],
          [`GST Number: ${searchedProjectOrder.gstNumber}`, '', `Phone Number: ${searchedProjectOrder.shippingPhoneNumber}`]
        ],
        theme: 'plain',
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
        bodyStyles: { textColor: [0, 0, 0] },
        didDrawPage: function (data) {
          drawBorder(); // Draw border after adding header and footer on each page
        }
      });
  
      textY = doc.autoTable.previous.finalY + 10; // Adjust for the end of the vendor table
  
      // Top Section or items table
      const topsectionLines = doc.splitTextToSize(searchedProjectOrder.topsection, pageWidth - 2 * textX);
      const topsectionHeight = doc.getTextDimensions(topsectionLines).h;
      checkSpaceAndAddPage(topsectionHeight + 10);
      doc.text(topsectionLines, textX, textY);
      textY += topsectionHeight + 10;
  
      // Generate table for items
      const tableData = searchedProjectOrder.items.map(item => [
        item.sno,
        item.description,
        item.unit,
        item.quantity,
        item.ratePerUnit,
        item.gstPercentage,
        item.discount,
        item.amount
      ]);
      const tableHead = [['S.No.', 'Description', 'Unit', 'Quantity', 'Rate Per Unit', 'GST %', 'Discount %', 'Amount']];
  
      doc.autoTable({
        startY: textY,
        head: tableHead,
        body: tableData,
        theme: 'plain',
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1 },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
        bodyStyles: { textColor: [0, 0, 0] },
        didDrawPage: function (data) {
          addFooter();
          drawBorder(); // Draw border after adding header and footer on each page
        },
        willDrawCell: function (data) {
          // Adjust y position for multiline cells to keep rows together
          if (data.cell && data.cell.textPos && data.cell.raw && typeof data.cell.raw === 'object' && data.cell.raw.styles && data.cell.raw.styles.valign === 'middle') {
            const textPos = data.cell.textPos;
            const lineHeight = data.doc.internal.getLineHeight();
            const cellHeight = data.cell.height || lineHeight * data.row.raw.length;
            const cellHeightOffset = (cellHeight - lineHeight) / 2;
            textPos.y += cellHeightOffset;
          }
        }
      });
  
      textY = doc.autoTable.previous.finalY + 10; // Adjust for the end of the items table
  
      // Add heading for Notes section
      const notesHeading = "Notes:";
      const notesHeadingHeight = doc.getTextDimensions(notesHeading).h;
      checkSpaceAndAddPage(notesHeadingHeight + 10);
      doc.text(notesHeading, textX, textY);
      textY += notesHeadingHeight + 5;
  
      // Notes section
      const NotesLines = doc.splitTextToSize(searchedProjectOrder.Notes, pageWidth - 2 * textX);
      const NotesHeight = doc.getTextDimensions(NotesLines).h;
      checkSpaceAndAddPage(NotesHeight + 10);
      doc.text(NotesLines, textX, textY);
      textY += NotesHeight + 10;
  
      // Add heading for Terms and Conditions section
      const tncHeading = "Terms and Conditions:";
      const tncHeadingHeight = doc.getTextDimensions(tncHeading).h;
      checkSpaceAndAddPage(tncHeadingHeight + 10);
      doc.text(tncHeading, textX, textY);
      textY += tncHeadingHeight + 5;
  
      // Terms and Conditions section
      const tncLines = doc.splitTextToSize(searchedProjectOrder.tnc, pageWidth - 2 * textX);
      const tncHeight = doc.getTextDimensions(tncLines).h;
      checkSpaceAndAddPage(tncHeight + 10);
      doc.text(tncLines, textX, textY);
      drawBorder(); // Draw border after adding header, footer, and content on the last page
  
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // Re-throw error to propagate it
    }
  };
  
  
  const handleSearchPoNumberChange = (e) => {
    setSearchedPoNumber(e.target.value);
  };

  const handleSearchProjectOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://ec2-35-154-228-4.ap-south-1.compute.amazonaws.com:5000/api/project-orders/${searchedPoNumber}`);
      const formattedProjectOrder = {
        ...response.data,
        poDate: response.data.poDate.split('T')[0] // Format date to "yyyy-MM-dd"
      };
      setSearchedProjectOrder(formattedProjectOrder);
    } catch (error) {
      console.error('Project order not found');
      setSearchedProjectOrder(null);
    }
  };

  const handleEditProjectOrderChange = (e, field) => {
    const value = e.target.value;
    setSearchedProjectOrder({ ...searchedProjectOrder, [field]: value });
  };

  const handleEditItemChange = (e, index, field) => {
    const value = e.target.value;
    const updatedItems = [...searchedProjectOrder.items];
    updatedItems[index][field] = value;

    // Update amount for the item if quantity or ratePerUnit is changed
    if (field === 'quantity' || field === 'ratePerUnit' || field === 'gstPercentage' || field === 'discount') {
      const quantity = field === 'quantity' ? parseFloat(value) : parseFloat(updatedItems[index].quantity);
      const ratePerUnit = field === 'ratePerUnit' ? parseFloat(value) : parseFloat(updatedItems[index].ratePerUnit);
      const gstPercentage = field === 'gstPercentage' ? parseFloat(value) : parseFloat(updatedItems[index].gstPercentage);
      const discount = field === 'discount' ? parseFloat(value) : parseFloat(updatedItems[index].discount);
      // Assuming gstPercentage is the GST percentage for the item
      updatedItems[index].amount = quantity * ratePerUnit * (1 + gstPercentage / 100) * (1 - discount / 100);
    }

    setSearchedProjectOrder({ ...searchedProjectOrder, items: updatedItems });
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedProjectOrder = {
      ...searchedProjectOrder,
      totalAmount: calculateTotalAmount(searchedProjectOrder.items)
    };

    try {
      await axios.put(`http://ec2-35-154-228-4.ap-south-1.compute.amazonaws.com:5000/api/project-orders/${searchedPoNumber}`, updatedProjectOrder);
      alert('Project order updated successfully');
      const doc = generatePDF();
      doc.save('project_orders.pdf');
    } catch (error) {
      console.error(error);
      alert('Error updating project order');
    }
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...newItem, [name]: value };
  
    // Calculate amount based on quantity, ratePerUnit, gstPercentage, and discount
    if (name === 'quantity' || name === 'ratePerUnit' || name === 'gstPercentage' || name === 'discount') {
      const quantity = parseFloat(updatedItem.quantity);
      const ratePerUnit = parseFloat(updatedItem.ratePerUnit);
      const gstPercentage = parseFloat(updatedItem.gstPercentage);
      const discount = parseFloat(updatedItem.discount);
  
      updatedItem.amount = quantity * ratePerUnit * (1 + gstPercentage / 100) * (1 - discount / 100);
    }
  
    setNewItem(updatedItem);
  };
  
  const handleAddNewItem = () => {
    const newSno = searchedProjectOrder.items.length + 1; // Calculate new sno
    const newItemToAdd = {
      sno: newSno,
      description: newItem.description,
      unit: newItem.unit,
      quantity: parseFloat(newItem.quantity),
      ratePerUnit: parseFloat(newItem.ratePerUnit),
      gstPercentage: parseFloat(newItem.gstPercentage),
      discount: parseFloat(newItem.discount),
      amount: newItem.amount
    };
  
    const updatedItems = [...searchedProjectOrder.items, newItemToAdd];
    setSearchedProjectOrder({
      ...searchedProjectOrder,
      items: updatedItems,
      totalAmount: calculateTotalAmount(updatedItems)
    });
  
    // Reset newItem state for next entry
    setNewItem({
      sno: newSno + 1, // Increment sno for the next item
      description: '',
      unit: '',
      quantity: 0,
      ratePerUnit: 0,
      gstPercentage: 0,
      discount: 0,
      amount: 0
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
      totalAmount: calculateTotalAmount(updatedItems)
    });
  };
  
  return (
    <div className="form-container">
      {/* Search project order by PO number */}
      <form onSubmit={handleSearchProjectOrder} className="search-form">
        <div className="search-section">
          <label>Search Project Order by PO Number:</label>
          <input type="text" value={searchedPoNumber} onChange={handleSearchPoNumberChange} />
          <button type="submit">Search</button>
        </div>
      </form>

      {/* Display fetched project order details */}
      {searchedProjectOrder && (
        <div className="edit-section">
          <h2>Edit Project Order</h2>
          <form onSubmit={handleEditSubmit}>
            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea value={searchedProjectOrder.topsection} onChange={(e) => handleEditProjectOrderChange(e.target.value)} />
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
                        <div className="item-field">
                          <label>Unit:</label>
                          <select 
                            name="unit" 
                            value={item.unit} 
                            onChange={(e) => handleEditItemChange(e, index, "unit")}
                          >
                            <option value="choose">Select One </option>
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
                            value={item.quantity}
                            onChange={(e) => handleEditItemChange(e, index, "quantity")}
                          />
                        </div>
                        <div className="item-field">
                          <label>Rate Per Unit:</label>
                          <input
                            type="number"
                            name="ratePerUnit"
                            value={item.ratePerUnit}
                            onChange={(e) => handleEditItemChange(e, index, "ratePerUnit")}
                          />
                        </div>
                        <div className="item-field">
                          <label>GST:</label>
                          <input
                            type="number"
                            name="gstPercentage"
                            value={item.gstPercentage}
                            onChange={(e) => handleEditItemChange(e, index, "gstPercentage")}
                          />
                        </div>
                        <div className="item-field">
                          <label>Discount:</label>
                          <input
                            type="number"
                            name="discount"
                            value={item.discount}
                            onChange={(e) => handleEditItemChange(e, index, "discount")}
                          />
                        </div>
                        <div className="item-field">
                          <label>Amount:</label>
                          <input
                            type="number"
                            name="amount"
                            value={item.amount}
                            readOnly
                          />
                        </div>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDeleteItem(index)}
                        >
                        <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
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
                      {/* Add new item section */}
          <div className="edit-add-item-section">
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
                            <option value="choose">Select One </option>
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
                <label>Discount: </label>
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
            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea value={searchedProjectOrder.Notes} onChange={(e) => handleEditItemChange(e.target.value)} />
            </div>
            <div className='custom-text-section'>
              <label>Top Section:</label>
              <textarea value={searchedProjectOrder.tnc} onChange={(e) => handleEditItemChange(e.target.value)} />
            </div>

          </div>
            <button type="submit">Update Project Order</button>
          </form>

        </div>
      )}
    </div>
  );
};

export default ProjectOrd;
