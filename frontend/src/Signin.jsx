import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Signin.module.css'; // Import the CSS module

function Signin() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Creator'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://13.234.47.87:5000/api/register', { 
                firstName, 
                lastName, 
                phoneNumber, 
                email, 
                password, 
                role 
            });
            console.log('Registration successful:', response.data);
            navigate('/home');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit}>
                    <h1 className={styles.header}>Register</h1>
                    <div className={styles.uiForm}>
                        <div className={styles.field}>
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>User Role</label>
                            <select 
                                name="role" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className={styles.inputField}
                            >
                                <option value="Creator">Creator</option>
                                <option value="Viewer">Viewer</option>
                                <option value="Approver">Approver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.button}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signin;
