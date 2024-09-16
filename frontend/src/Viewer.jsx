import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import Select from 'react-select';
import ProjectOrderPDF from "./components/ProjectOrderPdf.js"; // Ensure this path is correct

const Viewer = () => {
  const [poList, setPoList] = useState([]); // List of POs
  const [selectedPo, setSelectedPo] = useState(null); // Selected PO for PDF preview
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Fetch the list of POs on component mount
  useEffect(() => {
    const fetchPoList = async () => {
      try {
        const response = await axios.get("http://13.234.47.87:5000/api/project-orders/all");
        
        // Check if the response data is an array and filter for approved POs
        if (Array.isArray(response.data)) {
          const approvedPoList = response.data
            .filter(po => po.status === "Approved") // Filter POs with "Approved" status
            .map((po) => ({
              ...po,
              poDate: po.poDate ? po.poDate.split('T')[0] : '', // Format date to "yyyy-MM-dd"
            }));
          setPoList(approvedPoList);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching PO list:", error);
      }
    };
    
    fetchPoList();
  }, []);

  // Handler for selecting a PO to preview
  const handlePoClick = (po) => {
    setSelectedPo(po);
    setShowPDFPreview(true);
  };

  // Close PDF Preview
  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
    setSelectedPo(null);
  };

  // Map POs for react-select
  const poOptions = poList.map(po => ({
    value: po,
    label: `${po.poNumber} - ${po.name}`
  }));

  // Handle selection from dropdown
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      handlePoClick(selectedOption.value);
    }
  };

  return (
    <div className="form-container">
      <h2>Approved Purchase Orders</h2>
      
      {/* PO Search Box */}
      <Select
        options={poOptions}
        onChange={handleSelectChange}
        placeholder="Search POs by Number or Name..."
        isSearchable
        className="po-search-box"
      />
      
      {/* <table>
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Vendor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {poList.map((po, index) => (
            <tr key={index}>
              <td>{po.poNumber}</td>
              <td>{po.name}</td>
              <td>
                <button onClick={() => handlePoClick(po)}>View PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      {showPDFPreview && selectedPo && (
        <div className="pdf-preview">
          <h3>PDF Preview - PO Number: {selectedPo.poNumber}</h3>
          <PDFViewer width="100%" height="600" style={{ border: '1px solid black' }}>
            <ProjectOrderPDF
              vendorCode={selectedPo.vendorCode}
              name={selectedPo.name}
              contactperson={selectedPo.contactperson}
              address={selectedPo.address}
              district={selectedPo.district}
              state={selectedPo.state}
              pinCode={selectedPo.pinCode}
              email={selectedPo.email}
              contact={selectedPo.contact}
              gstNumber={selectedPo.gstNumber}
              locationCode={selectedPo.locationCode}
              billtoname={selectedPo.billtoname}
              billtocp={selectedPo.billtocp}
              billToAddress={selectedPo.billToAddress}
              billToDistrict={selectedPo.billToDistrict}
              billToState={selectedPo.billToState}
              billToPinCode={selectedPo.billToPinCode}
              billToContact={selectedPo.billToContact}
              billToEmail={selectedPo.billToEmail}
              billToGstNumber={selectedPo.billToGstNumber}
              shippingAddress={selectedPo.shippingAddress}
              deliveryLocationCode={selectedPo.deliveryLocationCode}
              deliveryName={selectedPo.deliveryName}
              delcp={selectedPo.delcp}
              deliveryDistrict={selectedPo.deliveryDistrict}
              deliveryState={selectedPo.deliveryState}
              deliveryPinCode={selectedPo.deliveryPinCode}
              deliveryContact={selectedPo.deliveryContact}
              deliveryEmail={selectedPo.deliveryEmail}
              deliveryGstNumber={selectedPo.deliveryGstNumber}
              poNumber={selectedPo.poNumber}
              poDate={selectedPo.poDate}
              podeliverydate={selectedPo.podeliverydate}
              type={selectedPo.type}
              items={selectedPo.items}
              totalAmount={selectedPo.totalAmount}
              topsection={selectedPo.topsection}
              Notes={selectedPo.Notes}
              tnc={selectedPo.tnc}
              signature={selectedPo.signatureUrl}
            />
          </PDFViewer>
          <button onClick={handleClosePDFPreview}>Close PDF Preview</button>
        </div>
      )}
    </div>
  );
};

export default Viewer;
