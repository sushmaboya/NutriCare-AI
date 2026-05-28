const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET api/recommendations/summary
// @desc    Get dashboard metrics, foods lists, and alerts
// @access  Private
router.get('/summary', auth, recommendationController.getDashboardSummary);

// @route   GET api/recommendations/diet-plan
// @desc    Generate a custom daily 4-meal plan
// @access  Private
router.get('/diet-plan', auth, recommendationController.generateDietPlan);

module.exports = router;
