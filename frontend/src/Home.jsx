import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

const Home = () => {
  const [userStats, setUserStats] = useState({ creators: 0, viewers: 0, approvers: 0 });
  const [poStats, setPoStats] = useState({ approved: 0, pending: 0 });

  useEffect(() => {
    fetchUserStats();
    fetchPoStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/users');
      const users = response.data;
      const stats = { creators: 0, viewers: 0, approvers: 0 };
      users.forEach(user => {
        if (user.role === 'Creator') {
          stats.creators++;
        } else if (user.role === 'Viewer') {
          stats.viewers++;
        } else if (user.role === 'Approver') {
          stats.approvers++;
        }
      });
  
      setUserStats(stats);
      console.log("Final User Stats:", stats); // Final stats after processing all users
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };
  
  
  
  const fetchPoStats = async () => {
    try {
      const response = await axios.get('http://13.234.47.87:5000/api/project-orders/all');
      const orders = response.data;
      const stats = { approved: 0, pending: 0 };
      orders.forEach(order => {
        if (order.status === 'Approved') {
          stats.approved++;
        } else if (order.status === 'Pending') {
          stats.pending++;
        }
      });
  
      console.log('Final PO Stats:', stats); // Log the final stats
      setPoStats(stats);
    } catch (error) {
      console.error('Error fetching PO stats:', error);
    }
  };
  

  return (
    <div className={styles.dashboard}>
      <div className={styles.card}>
        <h3>Users</h3>
        <p>Creators: {userStats.creators}</p>
        <p>Viewers: {userStats.viewers}</p>
        <p>Approvers: {userStats.approvers}</p>
      </div>
      <div className={styles.card}>
        <h3>Purchase Orders (POs)</h3>
        <p>Approved: {poStats.approved}</p>
        <p>Pending: {poStats.pending}</p>
      </div>
    </div>
  );
};

export default Home;
