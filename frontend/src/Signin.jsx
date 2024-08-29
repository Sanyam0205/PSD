import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';


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
            const response = await axios.post('http://localhost:5000/api/register', { 
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
        <div className="form-container">

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="ui form">
                        <div className="field">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label>User Role</label>
                            <select 
                                name="role" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Creator">Creator</option>
                                <option value="Viewer">Viewer</option>
                                <option value="Approver">Approver</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <button type='submit' className="fluid ui button blue">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signin;
