const FoodItem = require('../models/FoodItem');

// @route   GET api/nutrition/foods
// @desc    Get all food items or search by query
// @access  Private
exports.getFoods = async (req, res) => {
  try {
    const { query } = req.query;
    let foods;
    
    if (query) {
      foods = await FoodItem.find({
        name: { $regex: query, $options: 'i' }
      });
    } else {
      foods = await FoodItem.find({});
    }

    res.json({ success: true, count: foods.length, foods });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching foods' });
  }
};

// @route   POST api/nutrition/calculate
// @desc    Calculate total nutrition for given food items and weights in grams
// @access  Private
exports.calculateNutrition = async (req, res) => {
  const { items } = req.body; // Expects [{ foodId: 'id', grams: 150 }]

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Please provide food items and weights in grams' });
  }

  try {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let accumulatedVitamins = new Set();
    let accumulatedMinerals = new Set();
    
    const detailedSummary = [];

    for (const item of items) {
      const { foodId, grams } = item;
      
      if (!foodId || !grams || isNaN(grams) || grams <= 0) {
        continue;
      }

      const food = await FoodItem.findById(foodId);
      if (!food) {
        continue;
      }

      // Calculations are per 100g
      const multiplier = grams / 100;
      const cal = parseFloat((food.calories * multiplier).toFixed(1));
      const prot = parseFloat((food.protein * multiplier).toFixed(1));
      const carb = parseFloat((food.carbohydrates * multiplier).toFixed(1));
      const fatVal = parseFloat((food.fat * multiplier).toFixed(1));

      totalCalories += cal;
      totalProtein += prot;
      totalCarbs += carb;
      totalFat += fatVal;

      food.vitamins.forEach(vit => accumulatedVitamins.add(vit));
      food.minerals.forEach(min => accumulatedMinerals.add(min));

      detailedSummary.push({
        foodId: food._id,
        name: food.name,
        grams,
        calories: cal,
        protein: prot,
        carbohydrates: carb,
        fat: fatVal
      });
    }

    res.json({
      success: true,
      summary: {
        calories: parseFloat(totalCalories.toFixed(1)),
        protein: parseFloat(totalProtein.toFixed(1)),
        carbohydrates: parseFloat(totalCarbs.toFixed(1)),
        fat: parseFloat(totalFat.toFixed(1)),
        vitamins: Array.from(accumulatedVitamins),
        minerals: Array.from(accumulatedMinerals)
      },
      detailedSummary
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error calculating nutrition' });
  }
};
