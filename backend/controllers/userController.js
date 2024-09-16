const User = require('../models/User');

// Controller to handle login
const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch (error) {
        res.status(401).send(error);
    }
};

// Controller to handle registration
const registerUser = async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).send(error);
    }
};

// Controller to get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send(error);
    }
};

// Controller to update a user
const updateUser = async (req, res) => {
    const updates = req.body;
    const options = { new: true }; // This option returns the updated document

    try {
        const user = await User.findByIdAndUpdate(req.params.id, updates, options);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).send(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log(`Attempting to delete user with ID: ${req.params.id}`);
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send(error);
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUsers,
    updateUser,
    deleteUser
};
