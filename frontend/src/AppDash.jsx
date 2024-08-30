import React, { useState, useEffect } from "react";
import axios from "axios";

const AppDash = () => {
  const [stats, setStats] = useState({ approved: 0, pending: 0 });

  // Fetch statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://13.234.47.87:5000/api/project-orders/all");

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          const approvedCount = response.data.filter((po) => po.status === "Approved").length;
          const pendingCount = response.data.filter((po) => po.status === "Pending").length;

          setStats({
            approved: approvedCount,
            pending: pendingCount,
          });
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching PO stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="form-container">
      <h2>Approver Dashboard</h2>
      <div className="cards-container">
        <div className="card">
          <h3>Total Approved POs</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="card">
          <h3>Total Pending POs</h3>
          <p>{stats.pending}</p>
        </div>
      </div>
    </div>
  );
};

export default AppDash;
