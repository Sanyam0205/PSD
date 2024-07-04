const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    // You can set any JWT secret key in your .env or config
    const token = jwt.sign({ username: 'admin' }, 'your_jwt_secret_key', {
      expiresIn: '1h',
    });
    return res.json({ token, message: 'Logged in as admin' });
  }

  return res.status(400).json({ message: 'Invalid credentials' });
};

module.exports = { loginUser };
