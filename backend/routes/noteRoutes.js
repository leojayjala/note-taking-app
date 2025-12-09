// routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { verifyToken } = require('../middleware/auth');

console.log('✅ noteRoutes.js loaded');

router.use(verifyToken); // All note routes require authentication

router.post('/', noteController.createNote);
router.get('/', noteController.getAllNotes);

module.exports = router;