
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getMessages, createMessage } = require('../controllers/chatController');

// Get all messages from MongoDB
router.get('/', auth, getMessages);

// POST a new message to MongoDB
router.post('/:id', auth, createMessage);

module.exports = router;
