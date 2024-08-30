import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        role: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch user data when the component mounts
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://13.234.47.87:5000/api/users/{userId}');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://13.234.47.87:5000/api/users/${user._id}`, user);
            setUser(response.data);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile.');
        }
    };

    return (
        <div className="form-container">
            <h2>Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input 
                        type="text" 
                        name="firstName" 
                        value={user.firstName} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        value={user.lastName} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={user.phoneNumber} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={user.email} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label>Role:</label>
                    <input 
                        type="text" 
                        name="role" 
                        value={user.role} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                    />
                </div>
                {isEditing ? (
                    <button type="submit">Save</button>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
                )}
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Settings;
