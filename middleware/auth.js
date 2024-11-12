
const jwt = require('jsonwebtoken');
const { blackListedTokens } = require('../server/controllers/userController');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied. No Token Provided');
    try {
        if (blackListedTokens.includes(token)) res.status(403).send('Logged out');
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token.');
    }
    
}

