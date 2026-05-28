const express = require('express');
const healthController = require('../controllers/healthController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET api/health/profile
// @desc    Get user health profile
// @access  Private
router.get('/profile', auth, healthController.getHealthProfile);

// @route   POST api/health/profile
// @desc    Create or update user health profile
// @access  Private
router.post('/profile', auth, healthController.updateHealthProfile);

module.exports = router;
