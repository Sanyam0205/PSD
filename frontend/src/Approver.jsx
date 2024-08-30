import React, { useState, useEffect } from "react";
import axios from "axios";

const Approver = () => {
  const [poList, setPoList] = useState([]); // List of POs

  // Fetch the list of POs on component mount
  useEffect(() => {
    const fetchPoList = async () => {
      try {
        const response = await axios.get("http://13.234.47.87:5000/api/project-orders/all");
        
        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          const formattedPoList = response.data.map((po) => ({
            ...po,
            poDate: po.poDate ? po.poDate.split('T')[0] : '', // Format date to "yyyy-MM-dd"
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

  // Handler to mark a PO as approved
  const handleApprove = async (po) => {
    try {
      const updatedPo = { ...po, status: "Approved" };
      const response = await axios.put(`http://13.234.47.87:5000/api/project-orders/${po.poNumber}`, updatedPo);

      if (response.status === 200) {
        setPoList((prevList) =>
          prevList.map((item) =>
            item.poNumber === po.poNumber ? { ...item, status: "Approved" } : item
          )
        );
      }
    } catch (error) {
      console.error("Error approving PO:", error);
    }
  };

  // Handler to mark a PO as pending
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

  return (
    <div className="form-container">
      <h2>Purchase Orders - Approver</h2>
      <table>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Approver;
