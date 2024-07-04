import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './custom.css';
import { jsPDF } from 'jspdf';
import letterhead from '../assets/images.png';
import footer from '../assets/footer.png';
import 'jspdf-autotable';

const Form = () => {
  const [vendorCode, setVendorCode] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [contactperson, setPerson] = useState('')
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [billToAddress, setBillToAddress] = useState('');
  const [billToGstNumber, setBillToGstNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().substring(0, 10));
  const [type, setType] = useState('');
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    sno: 0,
    description: '',
    unit: '',
    quantity: 0,
    ratePerUnit: 0,
    gstPercentage:0,
    discount: 0,
    amount: 0
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [shippingPhoneNumber, setShippingPhoneNumber] = useState('');
  const [topsection, settopsection] = useState(
    'SUBJECT: Collection, Transportation, Recycling of Post-Consumer Plastic Waste on Behalf of Rekart Innovations Pvt. Ltd.\n' +
    'Dear Sir,\n' +
    'This is in reference to Work Order for Rekart Innovations Pvt Ltd. We hereby offer you to Fulfillment of Collection,\n' +
    'Transportation, Recycling of Post-Consumer Plastic Waste on Behalf of Rekart Innovations Pvt. Ltd as per\n' +
    'PWM 2016 (and its amendments) and respective state Rules in connection with collection, storage, Transportation\n' +
    'and Disposal of Post- Consumers at below mentioned.'
  );
  const [Notes, setNotes] = useState(
    'It may be noted that the above work will be carried out to our complete satisfaction if any amendment or alteration\n' +
    'are to be carried out due to mistakes or violation of any Rules on your parts, no extra payment will be payable for\n' +
    'that.\n' +
    'You will be paid Service Charges as specified against the quantity of plastic Waste (N-MLP) collected and recycled as\n' +
    'per state wise Post-Consumer (N-MLP) Target.\n' +
    'Note:\n' +
    '1. Payment will be done within 45 days after receiving the EPR Credits.\n' +
    '2. Below Listed Documents also required for processing the Invoice.\n' +
    '  • GST Invoice for Collection & Recycling (HSN Code 3915)\n' +
    '  • E-way Bill Copy\n' +
    '  • Weighing Slip of collection/Loading Slip\n' +
    '  • LR Slip/ Transporter Bill of Transport\n' +
    '  • Un-Loading Weighing Slip'
  );
  const [tnc, settnc] = useState(
`1. This PO Supersedes all previous discussions, offers & documents.
2. All Above materials must be dispatched as per delivery schedules.
3. All Pages of this document must be signed individually by authorized signatory.
4. All Items should be strictly as per specification and quality norms defined and mentioned in said Purchase order by Rekart Innovation PVT. LTD.
5. All Statutory government requirements, regulations & levies shall be born & adhered by the vendor and agrees to indemnify the client for any liability.
6. Delivery of material at site should be accompanies with copy of Purchase order, Challan, Test Certificate of material and weighment Slip.
7. Proper bills have to be submitted along with the certification of the project in charge for the supply completed.
8. Vendor will seek consent from Project Manager w.r.t. Each material and its quantity before delivery, Vendor will also inform project team at least 1 working day before delivery of material.
9. All correspondence must have reference to this P.O. and should be directed at the above address only.
10. This Purchase Order is Subject to Jurisdiction of The Gurgaon Court Only.
11. Payment: within 0 days after the material deliver at site.
    - 0% advance, 0% against Proforma Invoice.
    - 0% advance, pending within 0 days after the material deliver at site.
12. Warranty: 1 year from the date of Invoice if any manufacturing defect.
13. Rate inclusive of transportation, loading, unloading and handover at site.
14. Delivery Schedule: urgent basis.`);

  // Fetch vendor details when vendor code changes
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        if (vendorCode) {
          const response = await axios.get(`http://ec2-15-207-87-2.ap-south-1.compute.amazonaws.com:5000/api/vendors/${vendorCode}`);
          const vendor = response.data;
          setError('');
          // Set vendor details to corresponding state variables
          setName(vendor.name || '');
          setPerson(vendor.contactperson || '');
          setAddress(vendor.address || '');
          setEmail(vendor.email || '');
          setContact(vendor.contact || '');
          setGstNumber(vendor.gstNumber || '');
          setBillToAddress(vendor.billToAddress || '');
        } else {
          // Reset all fields when vendorCode is empty
          resetForm();
        }
      } catch (error) {
        setError('Vendor not found');
      }
    };
    fetchVendor();
  }, [vendorCode]);
  
  // Reset all form fields
  const resetForm = () => {
    setName('');
    setPerson('');
    setAddress('');
    setEmail('');
    setContact('');
    setGstNumber('');
    setBillToAddress('');
    setBillToGstNumber('');
    setPoNumber('');
    setPoDate(new Date().toISOString().substring(0, 10));
    setType('');
    setItems([]);
    setTotalAmount(0);
  };

  // Event handlers for form fields
  const handleVendorCodeChange = (e) => {
    setVendorCode(e.target.value);
  };

  const handleProjectOrderChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'contactperson':
        setPerson(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'contact':
        setContact(value);
        break;
      case 'gstNumber':
        setGstNumber(value);
        break;
      case 'billToAddress':
        setBillToAddress(value);
        break;
      case 'billToGstNumber':
        setBillToGstNumber(value);
        break;
      case 'shippingAddress':
        setShippingAddress(value);
        break;
      case 'pinCode':
        setPinCode(value);
        break;
      case 'state':
        setState(value);
        break;
      case 'shippingPhoneNumber':
        setShippingPhoneNumber(value);
        break;
      case 'poNumber':
        setPoNumber(value);
        break;
      case 'poDate':
        setPoDate(value);
        break;
      default:
        break;
    }
  };
  
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    // Generate a PO number based on the selected type
    if (selectedType) {
      const prefix = selectedType === 'material' ? 'M' : 'S';
      setPoNumber(`${prefix}-${new Date().getTime()}`); // Example PO number generation logic
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...item, [name]: value };

    if (name === 'quantity' || name === 'ratePerUnit' || name === 'gstPercentage' || name === 'discount') {
      const quantity = name === 'quantity' ? parseFloat(value) : parseFloat(item.quantity);
      const ratePerUnit = name === 'ratePerUnit' ? parseFloat(value) : parseFloat(item.ratePerUnit);
      const gstPercentage = name === 'gstPercentage' ? parseFloat(value) : parseFloat(item.gstPercentage);
      const discount = name === 'discount' ? parseFloat(value) : parseFloat(item.discount);
      // Assuming gstPercentage is the GST percentage for the item
      updatedItem.amount = quantity * ratePerUnit * (1 + gstPercentage / 100) * (1 - discount / 100);

    }
    setItem(updatedItem);
  };

  const handleAddItem = () => {
    const newItem = {
      sno: items.length + 1,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      ratePerUnit: item.ratePerUnit,
      gstPercentage: item.gstPercentage,
      discount: item.discount,
      amount: item.amount
    };
    setItems([...items, newItem]);
    setTotalAmount(totalAmount + item.amount);
    setItem({
      sno: items.length + 2, // Increment for the next item
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
    const removedItem = items[index];
    const updatedItems = items.filter((_, i) => i !== index);
    
    // Update sno for remaining items
    const updatedItemsWithSno = updatedItems.map((item, idx) => ({
      ...item,
      sno: idx + 1
    }));
    setItems(updatedItemsWithSno);
    setTotalAmount(totalAmount - removedItem.amount);
  }

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
      const imageHeight = 22;
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
        doc.text(`PO Number: ${poNumber}`, textX, 35);
        doc.text(`PO Date: ${poDate}`, textX, 40);
        drawBorder(); // Draw border after adding header
      };
  
      const addFooter = () => {
        doc.addImage(footerdata, 'PNG', 10, pageHeight - footerHeight - 10, pageWidth - 20, footerHeight);
        // Add page number at the bottom corner
        const pageNumber = doc.internal.getNumberOfPages();
        doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 5);
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
          [`Name: ${name}`, `Address: ${billToAddress}`, `Address: ${shippingAddress}`],
          ['Contact Person: ' + contactperson, `GST Number: ${billToGstNumber}`, `Pin Code: ${pinCode}`],
          [`Address: ${address}`, ``, ``],
          [`Email: ${email}`, '', `State: ${state}`],
          ['Contact Number: ' + contact, '', `Phone Number: ${shippingPhoneNumber}`],
          [`GST Number: ${gstNumber}`, '', '']
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
      // Top Section the items table
      const topsectionLines = doc.splitTextToSize(topsection, pageWidth - 2 * textX);
      const topsectionHeight = doc.getTextDimensions(topsectionLines).h;
      checkSpaceAndAddPage(topsectionHeight + 10);
      doc.text(topsectionLines, textX, textY);
      textY += topsectionHeight + 10;
  
      // Generate table for items
      const tableData = items.map(item => [
        { content: item.sno, styles: { valign: 'middle' } },
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
      // Notes for the items table
      const NotesLines = doc.splitTextToSize(Notes, pageWidth - 2 * textX);
      const NotesHeight = doc.getTextDimensions(NotesLines).h;
      if (doc.internal.pageSize.getHeight() - textY - footerHeight - marginBottom < NotesHeight + 10) {
        addNewPage();
        textY = headerHeight + 10; // Start after the header on the new page
      }
      doc.text(NotesLines, textX, textY);
      textY += NotesHeight + 10; // Adjust for the end of the notes section
      // Terms and Conditions section
      const tncLines = doc.splitTextToSize(tnc, pageWidth - 2 * textX);
      const tncHeight = doc.getTextDimensions(tncLines).h;
      if (doc.internal.pageSize.getHeight() - textY - footerHeight - marginBottom < tncHeight + 10) {
        addNewPage();
        textY = headerHeight + 10; // Start after the header on the new page
      }
      doc.text(tncLines, textX, textY);
      drawBorder(); // Draw border after adding header, footer, and content on the last page
  
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // Re-throw error to propagate it
    }
  };
  
  const handlePreviewPDF = () => {
    try {
      const doc = generatePDF();
      if (!doc) {
        throw new Error('Failed to generate PDF document.');
      }
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      // Handle or log the error further as needed
    }
  };
  
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectOrder = {
        vendorCode,
        name,
        contactperson,
        address,
        email,
        contact,
        gstNumber,
        billToAddress,
        billToGstNumber,
        shippingAddress,
        pinCode,
        state,
        shippingPhoneNumber,
        poNumber,
        poDate,
        type,
        items,
        totalAmount,
        topsection,
        Notes,
        tnc
      };
      // Submit project order
      await axios.post('http://ec2-15-207-87-2.ap-south-1.compute.amazonaws.com:5000/api/project-orders', projectOrder);
      // Generate PDF
      const doc = generatePDF();
      doc.save('project_orders.pdf');
      alert('Project order submitted successfully');
    } catch (error) {
      console.error(error);
      alert('Error submitting project order');
    }
  };
  
  return (
    <div className="form-container">
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="po-section">
        <div className="po-number-section">
                <h2>PO Number</h2>
                <div>
                  <label>PO Number:</label>
                  <input type="text" name="poNumber" value={poNumber} onChange={handleProjectOrderChange} readOnly />
                </div>
                <div>
                  <label>PO Date:</label>
                  <input type="date" name="poDate" value={poDate} onChange={handleProjectOrderChange} />
                </div>
                <div className="type-section">
                  <label>Type:</label>
                  <label className="custom-radio">
                    <input type="radio" name="type" value="material" onChange={handleTypeChange} />
                    <span className="custom-radio-button"></span> Material
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="type" value="service" onChange={handleTypeChange} />
                    <span className="custom-radio-button"></span> Service
                  </label>
                </div>
          </div>
          </div>
        {/* Custom text fields */}
        <div className='custom-text-section'>
          <label>Top Section:</label>
          <textarea value={topsection} onChange={(e) => settopsection(e.target.value)} />
        </div>
          <div className="grid">              
              <div className="vendor-section">
                <h2>Vendor Details</h2>
                <div className="vendor-code">
                  <label>Vendor Code:</label>
                  <input type="text" value={vendorCode} onChange={handleVendorCodeChange} />
                </div>
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={name} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Contact Person:</label>
                  <input type="text" name="contactperson" value={contactperson} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Address:</label>
                  <input type="text" name="address" value={address} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="email" name="email" value={email} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Contact Number:</label>
                  <input type="text" name="contact" value={contact} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>GST Number:</label>
                  <input type="text" name="gstNumber" value={gstNumber} onChange={handleProjectOrderChange} />
                </div>
              </div>
              <div className="bill-to-section">
                <h2>Bill to Address</h2>
                <div>
                  <label>Address:</label>
                  <input type="text" name="billToAddress" value={billToAddress} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>GST Number:</label>
                  <input type="text" name="billToGstNumber" value={billToGstNumber} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Shipping Address:</label>
                  <input type="text" name="shippingAddress" value={shippingAddress} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Pin Code:</label>
                  <input type="text" name="pinCode" value={pinCode} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>State:</label>
                  <input type="text" name="state" value={state} onChange={handleProjectOrderChange} />
                </div>
                <div>
                  <label>Shipping Phone Number:</label>
                  <input type="text" name="shippingPhoneNumber" value={shippingPhoneNumber} onChange={handleProjectOrderChange} />
                </div>
              </div>
        </div>
        <div className="add-item-section">
          <h2>Add Item</h2>
          <div className="item-fields">
            <div className="item-field">
              <label>Description:</label>
              <input type="text" name="description" value={item.description} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Unit:</label>
              <select name="unit" value={item.unit} onChange={handleItemChange}>
                <option value="">Select One </option>
                <option value="kg">Kilogram (kg)</option>
                <option value="metricTon">Metric Ton</option>
                <option value="metre">Metre (m)</option>
                <option value="squareMetre">Square Metre (m²)</option>
                <option value="cubicMetre">Cubic Metre (m³)</option>
                <option value="litre">Litre (L)</option>
                <option value="gallon">Gallon</option>
              </select>
            </div>
            <div className="item-field">
              <label>Quantity:</label>
              <input type="number" name="quantity" value={item.quantity} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Rate Per Unit:</label>
              <input type="number" name="ratePerUnit" value={item.ratePerUnit} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>GST: </label>
              <input type="number" name="gstPercentage" value={item.gstPercentage} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Discount: </label>
              <input type="number" name="discount" value={item.discount} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Amount:</label>
              <input type="number" name="amount" value={item.amount} readOnly />
            </div>
          </div>
          <button type="button" onClick={handleAddItem}>Add Item</button>
        </div>
        <div className="items-section">
          <h2>Items</h2>
          {items.map((item, index) => (
            <div key={index} className="item">
              <div className="item-field">
                <label>Serial No:</label>
                <input type="text" value={item.sno} readOnly />
              </div>
              <div className="item-field">
                <label>Description:</label>
                <input type="text" value={item.description} readOnly />
              </div>
              <div className="item-field">
                <label>Unit:</label>
                <input type="text" value={item.unit} readOnly />
              </div>
              <div className="item-field">
                <label>Quantity:</label>
                <input type="number" value={item.quantity} readOnly />
              </div>
              <div className="item-field">
                <label>Rate Per Unit:</label>
                <input type="number" value={item.ratePerUnit} readOnly />
              </div>
              <div className="item-field">
                <label>GST:</label>
                <input type="number" value={item.gstPercentage} readOnly />
              </div>
              <div className="item-field">
                <label>Discount</label>
                <input type="number" value={item.discount} readOnly />
              </div>
              <div className="item-field">
                <label>Amount:</label>
                <input type="number" value={item.amount} readOnly />
              </div>
              <button
                type="button"
                className="delete-button"
                onClick={() => handleDeleteItem(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
        <div className="total-amount-section">
          <h2>Total Amount</h2>
          <div>
            <label>Total Amount:</label>
            <input type="number" value={totalAmount} readOnly />
          </div>
        </div>
        <div className='custom-text-section'>
          <label>Notes:</label>
          <textarea value={Notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className='custom-text-section'>
          <label>Terms And Condition: </label>
          <textarea value={tnc} onChange={(e) => settnc(e.target.value)} />
        </div>
        <div>
        <button type="button" onClick={handlePreviewPDF}>Preview PDF</button>
        </div>
        <div>
        <button type="submit">Submit</button>
        </div>
      </form>
      {isPreviewOpen && (
        <div className="pdf-preview-modal">
          <div className="pdf-preview-content">
            <button className="close-preview-button" onClick={handleClosePreview}>Close Preview</button>
            <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;