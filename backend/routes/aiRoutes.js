const express = require('express');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST api/ai/chat
// @desc    Interact with AI assistant
// @access  Private
router.post('/chat', auth, aiController.chatWithAssistant);

module.exports = router;
