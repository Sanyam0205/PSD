const express = require('express');
const router = express.Router();
const {
    loginUser,
    registerUser,
    getUsers,
    updateUser,
    deleteUser // Import the deleteUser controller
} = require('../controllers/userController');

// Route for user login
router.post('/login', loginUser);

// Route for user registration
router.post('/register', registerUser);

// Route to get all users
router.get('/users', getUsers);

// Route to update a user
router.put('/users/:id', updateUser);

// Route to delete a user
router.delete('/users/:id', deleteUser);

module.exports = router;
