const express = require('express');
const nutritionController = require('../controllers/nutritionController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET api/nutrition/foods
// @desc    Get all food items or search
// @access  Private
router.get('/foods', auth, nutritionController.getFoods);

// @route   POST api/nutrition/calculate
// @desc    Calculate aggregated macro/micronutrients from grams input
// @access  Private
router.post('/calculate', auth, nutritionController.calculateNutrition);

module.exports = router;
