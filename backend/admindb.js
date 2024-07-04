// addAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Admin credentials
const adminUsername = 'admin';
const adminPassword = 'adminpassword';

// Hash the admin password
bcrypt.hash(adminPassword, 10, async (err, hashedPassword) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }

    // Create admin user object
    const adminUser = new User({
        username: adminUsername,
        password: hashedPassword,
        isAdmin: true
    });

    try {
        // Save admin user to the database
        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (err) {
        console.error('Error creating admin user:', err);
    } finally {
        // Close MongoDB connection
        mongoose.connection.close();
    }
});
