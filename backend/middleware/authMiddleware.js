// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;

    // Check if token exists
    if (token) {
        jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            } else {
                // Attach decoded token to request object
                req.user = decodedToken;
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Token not provided' });
    }
};

module.exports = { requireAuth };
