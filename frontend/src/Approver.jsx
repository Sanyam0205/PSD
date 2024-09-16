import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import ProjectOrderPDF from "./components/ProjectOrderPdf.js";
import styles from './Approver.css';

const Approver = ({ firstName }) => {
  const [poList, setPoList] = useState([]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  useEffect(() => {
    const fetchPoList = async () => {
      try {
        const response = await axios.get("http://13.234.47.87:5000/api/project-orders/all");
        if (Array.isArray(response.data)) {
          const formattedPoList = response.data.map((po) => ({
            ...po,
            poDate: po.poDate ? po.poDate.split('T')[0] : '',
          }));
          setPoList(formattedPoList);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching PO list:", error);
      }
    };
    
    fetchPoList();
  }, []);

  const handleApprove = async (po) => {
    try {
      const updatedPo = { ...po, status: "Approved", approvedBy: firstName };
      const response = await axios.put(`http://13.234.47.87:5000/api/project-orders/${po.poNumber}`, updatedPo);

      if (response.status === 200) {
        setPoList((prevList) =>
          prevList.map((item) =>
            item.poNumber === po.poNumber ? { ...item, status: "Approved", approvedBy: firstName } : item
          )
        );
      }
    } catch (error) {
      console.error("Error approving PO:", error);
    }
  };

  const handlePending = async (po) => {
    try {
      const updatedPo = { ...po, status: "Pending" };
      const response = await axios.put(`http://13.234.47.87:5000/api/project-orders/${po.poNumber}`, updatedPo);

      if (response.status === 200) {
        setPoList((prevList) =>
          prevList.map((item) =>
            item.poNumber === po.poNumber ? { ...item, status: "Pending" } : item
          )
        );
      }
    } catch (error) {
      console.error("Error marking PO as pending:", error);
    }
  };

  const handlePoClick = (po) => {
    setSelectedPo(po);
    setShowPDFPreview(true);
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
    setSelectedPo(null);
  };

  return (
    <div className="form-container">
      <h2>Purchase Orders - Approver</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Vendor Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {poList.map((po, index) => (
            <tr key={index}>
              <td>{po.poNumber}</td>
              <td>{po.name}</td>
              <td>{po.status || "Pending"}</td>
              <td>
                <button onClick={() => handleApprove(po)}>Approve</button>
                <button onClick={() => handlePending(po)}>Mark as Pending</button>
                <button onClick={() => handlePoClick(po)}>View PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default Approver;
