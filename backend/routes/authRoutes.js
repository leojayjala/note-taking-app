// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('✅ authRoutes.js loaded');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;