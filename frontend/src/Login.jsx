// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });

            const userRole = response.data.role;

            console.log('Login successful:', response.data);

            // Set the role in the App component
            onLogin(userRole);

            // Navigate based on user role
            switch (userRole) {
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
                    console.error('Unknown role:', userRole);
                    break;
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
    <div className="container">
        <form style={{ height: "500px" }} onSubmit={handleSubmit}>
            <h1 style={{ marginTop: "20px" }}>Login</h1>
            <div className="ui form" style={{ marginTop: "30px" }}>
                <div className="field">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}

                    />
                </div>
                <div className="field" style={{ marginTop: "30px" }}>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" style={{ marginTop: "50px" }} className="fluid ui button blue">Submit</button>
            </div>
        </form>
    </div>
    );
}

export default Login;
