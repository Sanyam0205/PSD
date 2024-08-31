import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Signin.module.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://13.234.47.87:5000/api/login', { email, password });
    
            const { role, firstName, id, phoneNumber, email } = response.data; 
            console.log('Login successful:', response.data);
    
            // Save the user information in localStorage
            localStorage.setItem('userId', id);
            localStorage.setItem('userRole', role);
            localStorage.setItem('username', firstName);
            localStorage.setItem('phoneNumber', phoneNumber);
            localStorage.setItem('email', email);
    
            onLogin(role, firstName, phoneNumber, email);
    
            switch (role) {
                case 'Creator':
                    navigate('/creator');
                    break;
                case 'Viewer':
                    navigate('/viewer');
                    break;
                case 'Approver':
                    navigate('/approver');
                    break;
                case 'Admin':
                    navigate('/home');
                    break;
                default:
                    console.error('Unknown role:', role);
                    break;
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <h1 className={styles.header}>Login</h1>
                <div className={styles.uiForm}>
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
                    <button type="submit" className={styles.button}>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
