import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { PDFViewer } from '@react-pdf/renderer';
import ProjectOrderPDF from './ProjectOrderPdf';
import './custom.css';

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
    amount: 0,
    subItems: [],
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [shippingPhoneNumber, setShippingPhoneNumber] = useState('');
  const [topsection, settopsection] = useState(
    '\nCollection, Transportation, Recycling of Post-Consumer Plastic Waste on Behalf of Rekart Innovations Pvt. Ltd.\n' +
    'Dear Sir,\n' +
    'This is in reference to Work Order for Rekart Innovations Pvt Ltd. We hereby offer you to Fulfillment of Collection,\n' +
    'Transportation, Recycling of Post-Consumer Plastic Waste on Behalf of Rekart Innovations Pvt. Ltd as per\n' +
    'PWM 2016 (and its amendments) and respective state Rules in connection with collection, storage, Transportation\n' +
    'and Disposal of Post- Consumers at below mentioned.'
  );
  const [Notes, setNotes] = useState(
    '\nIt may be noted that the above work will be carried out to our complete satisfaction if any amendment or alteration\n' +
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
const [showPDFPreview, setShowPDFPreview] = useState(false);  // Add this line
const [showsubItems, setShowsubItems] = useState(false);
const [signature, setSignature] = useState(null);
const [signatureUrl, setSignatureUrl] = useState('');


  // Fetch vendor details when vendor code changes
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        if (vendorCode) {
          const response = await axios.get(`http://localhost:5000/api/vendors/${vendorCode}`);
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

  const calculateAmount = (item) => {
    const discountAmount = (item.ratePerUnit * item.quantity * item.discount) / 100;
    const amountAfterDiscount = item.ratePerUnit * item.quantity - discountAmount;
    const gstAmount = (amountAfterDiscount * item.gstPercentage) / 100;
    return amountAfterDiscount + gstAmount;
  };


  const calculateTotalAmount = useCallback(() => {
    let total = 0;
    items.forEach(item => {
      total += item.amount;
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          total += subItem.amount;
        });
      }
    });
    setTotalAmount(Math.round(total)); // Round off the total amount
  }, [items]);
  
  useEffect(() => {
    calculateTotalAmount();
  }, [items, calculateTotalAmount]);

  const handleAddItem = () => {
    setItems((prevItems) => [...prevItems, { ...item, sno: prevItems.length + 1 }]);
    setItem({
      description: '',
      unit: '',
      quantity: 0,
      ratePerUnit: 0,
      discount: 0,
      gstPercentage: 0,
      amount: 0,
      subItems: [],
    });
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  const togglesubItems = () => {
    setShowsubItems(!showsubItems);
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
      amount: calculateAmount({ ...prevItem, [name]: value }),
    }));
  };
  
  const handleSubItemChange = (e, index) => {
    const { name, value } = e.target;
    setItem((prevItem) => {
      const newSubItems = [...prevItem.subItems];
      const updatedSubItem = { ...newSubItems[index], [name]: value };
  
      // Calculate amount for the updated sub-item
      const updatedSubItemWithAmount = {
        ...updatedSubItem,
        amount: calculateAmount(updatedSubItem),
      };
  
      // Update the subItems array with the recalculated sub-item
      newSubItems[index] = updatedSubItemWithAmount;
  
      // Recalculate the total amount for the main item, if needed
      return { ...prevItem, subItems: newSubItems };
    });
  };
  const handleAddSubItem = () => {
    setItem((prevItem) => ({
      ...prevItem,
      subItems: [
        ...prevItem.subItems,
        {
          description: '',
          unit: '',
          quantity: 0,
          ratePerUnit: 0,
          gstPercentage: 0,
          discount: 0,
          amount: 0,
        },
      ],
    }));
  };

  const handleRemoveSubItem = (index) => {
    setItem((prevItem) => ({
      ...prevItem,
      subItems: prevItem.subItems.filter((_, i) => i !== index),
    }));
  };
  
  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file);
      setSignature(file);
    } else {
      console.log("No file selected");
    }
  };  
  
  const handlesignUpload = async () => {
    if (!signature) {
      console.log("No signature file selected");
      return;
    }

    const formData = new FormData();
    formData.append("signature", signature);

    try {
      console.log("Uploading signature...");
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload response:", response);
      setSignatureUrl(response.data.filePath);
    } catch (error) {
      console.error("Error uploading signature", error);
    }
  };

  useEffect(() => {
    if (signatureUrl) {
      console.log("Signature URL:", signatureUrl);
    }
  }, [signatureUrl]);
  
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
        tnc,
        signature: {
          fileName: signature?.name,
          filePath: signatureUrl,
          fileSize: signature?.size,
          mimeType: signature?.type,
        },
      };
      // Submit project order
      await axios.post('http://localhost:5000/api/project-orders', projectOrder);
      // Generate PDF
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

        <div className="custom-text-section">
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
                <option value="">Select One</option>
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
              <input type="number" name="quantity" value={item.quantity} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Rate Per Unit:</label>
              <input type="number" name="ratePerUnit" value={item.ratePerUnit} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Discount:</label>
              <input type="number" name="discount" value={item.discount} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>GST:</label>
              <input type="number" name="gstPercentage" value={item.gstPercentage} onChange={handleItemChange} />
            </div>
            <div className="item-field">
              <label>Amount:</label>
              <input type="number" name="amount" value={item.amount} readOnly />
            </div>
          </div>
          <button type="button" onClick={handleAddItem}>Add Item</button>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={showsubItems}
              onChange={togglesubItems}
            />
             Add Sub-Items
          </label>
        </div>

      {showsubItems && (
        <div className='subitem-section'>
          <h3>Sub-Items</h3>
          {(item.subItems || []).map((subItem, index) => (
            <div key={index}>
              <div className="item-field">
                <label>Description:</label>
                <input
                  type="text"
                  name="description"
                  value={subItem.description || ''}
                  onChange={(e) => handleSubItemChange(e, index)}
                />
              </div>

              <div className="item-field">
                <label>Unit:</label>
                <select
                  name="unit"
                  value={subItem.unit || ''}
                  onChange={(e) => handleSubItemChange(e, index)}
                >
                  <option value="">Select One</option>
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
                  value={subItem.quantity || 0}
                  onChange={(e) => handleSubItemChange(e, index)}
                />
              </div>

              <div className="item-field">
                <label>Rate Per Unit:</label>
                <input
                  type="number"
                  name="ratePerUnit"
                  value={subItem.ratePerUnit || 0}
                  onChange={(e) => handleSubItemChange(e, index)}
                />
              </div>

              <div className="item-field">
                <label>Discount (%):</label>
                <input
                  type="number"
                  name="discount"
                  value={subItem.discount || 0}
                  onChange={(e) => handleSubItemChange(e, index)}
                />
              </div>

              <div className="item-field">
                <label>Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={subItem.amount || 0}
                  disabled
                />
              </div>

              <div className="item-field">
                <button type="button" onClick={() => handleRemoveSubItem(index)}>Remove Sub-Item</button>
              </div>
            </div>

          ))}
          <button type="button" onClick={handleAddSubItem}>Add Sub-Item</button>
        </div>
      )}

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
              <label>Discount:</label>
              <input type="number" value={item.discount} readOnly />
            </div>
            <div className="item-field">
              <label>GST:</label>
              <input type="number" value={item.gstPercentage} readOnly />
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

            {/* Render sub-items */}
            {item.subItems && item.subItems.length > 0 && (
              <div className="subitem-section">
                <h3>Sub-Items</h3>
                {item.subItems.map((subItem, subIndex) => (
                  <div key={`${index}-${subIndex}`} className="sub-item">
                    <div className="item-field">
                      <label>Serial No:</label>
                      <input type="text" value={`${item.sno}.${subIndex + 1}`} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Description:</label>
                      <input type="text" value={subItem.description} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Unit:</label>
                      <input type="text" value={subItem.unit} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Quantity:</label>
                      <input type="number" value={subItem.quantity} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Rate Per Unit:</label>
                      <input type="number" value={subItem.ratePerUnit} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Discount:</label>
                      <input type="number" value={subItem.discount} readOnly />
                    </div>
                    <div className="item-field">
                      <label>GST:</label>
                      <input type="number" value={subItem.gstPercentage} readOnly />
                    </div>
                    <div className="item-field">
                      <label>Amount:</label>
                      <input type="number" value={subItem.amount} readOnly />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

        <div className="signature-section">
        <label>Signature:</label>
        <input type="file" accept="image/*" onChange={handleSignatureChange} />
        <button type="button" onClick={handlesignUpload}>Upload Signature</button>
        {signatureUrl && <img src={`http://localhost:5000${signatureUrl}`} alt="Signature"  />}
        
        </div>
        <button type="button" onClick={() => setShowPDFPreview(true)}>Preview PDF</button>
        <div>

        </div>
        <button type="button" onClick={() => setShowPDFPreview(false)}>Close PDF</button>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {showPDFPreview && (
        <PDFViewer width="100%" height="600">
          <ProjectOrderPDF
            vendorCode={vendorCode}
            name={name}
            contactperson={contactperson}
            address={address}
            email={email}
            contact={contact}
            gstNumber={gstNumber}
            billToAddress={billToAddress}
            billToGstNumber={billToGstNumber}
            shippingAddress={shippingAddress}
            pinCode={pinCode}
            state={state}
            shippingPhoneNumber={shippingPhoneNumber}
            poNumber={poNumber}
            poDate={poDate}
            type={type}
            items={items}
            totalAmount={totalAmount}
            topsection={topsection}
            Notes={Notes}
            tnc={tnc}
            signature={signatureUrl}
          />
        </PDFViewer>
      )}
    </div>
  );
};

export default Form;