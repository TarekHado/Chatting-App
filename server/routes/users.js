const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', auth, userController.getUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/me', auth, userController.profile);

module.exports = router;