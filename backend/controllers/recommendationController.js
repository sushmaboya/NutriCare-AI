const HealthProfile = require('../models/HealthProfile');
const FoodItem = require('../models/FoodItem');

// Helper to estimate calorie targets based on Harris-Benedict BMR equation
const calculateCalorieTarget = (profile) => {
  const { gender, weight, height, age, fitnessGoals } = profile;
  
  let bmr = 0;
  if (gender === 'Male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    // Female & Other standard estimation
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Assuming light activity multiplier (1.375)
  let maintainCalories = Math.round(bmr * 1.375);

  let target = maintainCalories;
  if (fitnessGoals === 'Weight Loss') {
    target = maintainCalories - 500;
  } else if (fitnessGoals === 'Weight Gain') {
    target = maintainCalories + 500;
  } else if (fitnessGoals === 'Muscle Building') {
    target = maintainCalories + 300;
  }

  // Cap minimum calories at 1200 for safety
  return Math.max(1200, target);
};

// Generate rule-based health insights
const generateHealthInsights = (profile) => {
  const insights = [];
  const { bmi, deficiencies, diseases, fitnessGoals } = profile;

  // BMI insights
  if (bmi < 18.5) {
    insights.push('Your BMI indicates you are underweight. Prioritize calorie-dense, nutrient-rich foods like nuts, dairy, and wholesome complex grains.');
  } else if (bmi >= 18.5 && bmi < 25) {
    insights.push('Your BMI is in the healthy range! Continue maintaining a balanced lifestyle with regular physical activity and a nutrient-rich diet.');
  } else if (bmi >= 25 && bmi < 30) {
    insights.push('Your BMI indicates you are overweight. We recommend incorporating a slight calorie deficit alongside portion control, high-fiber, and lean protein meals.');
  } else {
    insights.push('Your BMI suggests obesity. Focus on whole foods, low-glycemic carbs, high dietary fiber, and consult a professional for sustained healthy fat loss.');
  }

  // Goal insights
  if (fitnessGoals === 'Muscle Building') {
    insights.push('For muscle hypertrophy, aim for 1.6g to 2.2g of protein per kg of body weight daily. Include paneer, eggs, legumes, and lean poultry.');
  }

  // Disease warnings
  if (diseases.includes('Diabetes')) {
    insights.push('To manage blood sugar levels, stay hydrated and limit refined sugars, white rice, and high-glycemic flours. Rely on oats, quinoa, and vegetables.');
  }
  if (diseases.includes('High BP')) {
    insights.push('For blood pressure control, lower your daily sodium intake and load up on potassium-rich foods like spinach, curd, and citrus fruits.');
  }
  if (diseases.includes('Kidney disease')) {
    insights.push('With kidney concerns, it is crucial to regulate phosphorus, potassium, and oxalates. Avoid excessive dark green leafies like spinach and high-fat dairy.');
  }

  // Deficiency insights
  if (deficiencies.includes('Iron deficiency')) {
    insights.push('Boost iron absorption by pairing iron-rich foods (spinach, lentils) with Vitamin C sources (lemon juice, oranges). Avoid drinking tea/coffee right after meals.');
  }
  if (deficiencies.includes('Vitamin D deficiency')) {
    insights.push('Since Vitamin D is fat-soluble, consume Vitamin D rich foods (fortified milk, mushrooms, eggs) with healthy fats for better absorption, and enjoy early morning sunlight.');
  }

  return insights;
};

// @route   GET api/recommendations/summary
// @desc    Get comprehensive health dashboard summary (BMI, goals, food lists)
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        message: 'No health profile found. Please complete your health onboarding.'
      });
    }

    const { deficiencies, diseases } = profile;
    const targetCalories = calculateCalorieTarget(profile);
    const healthInsights = generateHealthInsights(profile);

    // 1. Fetch recommended foods based on deficiencies
    let recommendedFoods = [];
    if (deficiencies.length > 0) {
      recommendedFoods = await FoodItem.find({
        recommendedForDeficiencies: { $in: deficiencies }
      });
    }

    // 2. Fetch good foods based on diseases
    let diseaseGoodFoods = [];
    if (diseases.length > 0) {
      diseaseGoodFoods = await FoodItem.find({
        goodForDiseases: { $in: diseases }
      });
    }

    // Combine recommended foods and remove duplicates
    const allRecommendedMap = new Map();
    recommendedFoods.forEach(food => allRecommendedMap.set(food._id.toString(), food));
    diseaseGoodFoods.forEach(food => allRecommendedMap.set(food._id.toString(), food));
    
    let combinedRecommended = Array.from(allRecommendedMap.values());

    // 3. Fetch foods to avoid based on diseases
    let avoidedFoods = [];
    if (diseases.length > 0) {
      avoidedFoods = await FoodItem.find({
        avoidForDiseases: { $in: diseases }
      });
    }

    // Filter out avoided foods from the recommended list just in case of conflicts (safety precaution)
    const avoidIds = new Set(avoidedFoods.map(f => f._id.toString()));
    combinedRecommended = combinedRecommended.filter(food => !avoidIds.has(food._id.toString()));

    // Fallback if combinedRecommended is empty (just return some healthy balanced defaults)
    if (combinedRecommended.length === 0) {
      combinedRecommended = await FoodItem.find({ avoidForDiseases: { $nin: diseases } }).limit(5);
    }

    // Macros distribution estimation
    let proteinPct = 25, carbsPct = 50, fatPct = 25; // Balanced
    if (profile.fitnessGoals === 'Muscle Building') {
      proteinPct = 35; carbsPct = 40; fatPct = 25;
    } else if (profile.fitnessGoals === 'Weight Loss') {
      proteinPct = 30; carbsPct = 40; fatPct = 30;
    }

    const dailyProteinGrams = Math.round((targetCalories * (proteinPct / 100)) / 4);
    const dailyCarbsGrams = Math.round((targetCalories * (carbsPct / 100)) / 4);
    const dailyFatGrams = Math.round((targetCalories * (fatPct / 100)) / 9);

    res.json({
      success: true,
      hasProfile: true,
      profile: {
        ...profile.toObject(),
        targetCalories,
        macronutrientTargets: {
          protein: dailyProteinGrams,
          carbohydrates: dailyCarbsGrams,
          fat: dailyFatGrams
        }
      },
      recommendedFoods: combinedRecommended,
      avoidedFoods,
      healthInsights
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error generating dashboard summary' });
  }
};

// @route   GET api/recommendations/diet-plan
// @desc    Generate a custom structured 4-meal Indian diet plan based on user health parameters
// @access  Private
exports.generateDietPlan = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'No health profile found. Please complete your health onboarding first.'
      });
    }

    const { diseases, deficiencies } = profile;
    const targetCalories = calculateCalorieTarget(profile);

    // Fetch permitted foods
    const allowedFoods = await FoodItem.find({
      avoidForDiseases: { $nin: diseases }
    });

    // Helper to group allowed foods by category for plan building
    const foodsByCategory = (cat) => allowedFoods.filter(f => f.category === cat);
    
    const grains = foodsByCategory('Grains & Cereals');
    const lentils = foodsByCategory('Lentils & Pulses');
    const veggies = foodsByCategory('Vegetables');
    const fruits = foodsByCategory('Fruits');
    const dairy = foodsByCategory('Dairy Products');
    const nuts = foodsByCategory('Nuts & Seeds');
    const poultry = foodsByCategory('Poultry & Seafood');

    // Default fallbacks in case categories are empty (safety mock objects)
    const fallbackGrain = grains[0] || { name: 'Whole Wheat Roti', calories: 264, protein: 9.1, carbohydrates: 58.4, fat: 1.5 };
    const fallbackLentil = lentils[0] || { name: 'Yellow Moong Dal (Cooked)', calories: 105, protein: 7.3, carbohydrates: 19.1, fat: 0.3 };
    const fallbackVeggie = veggies[0] || { name: 'Spinach (Palak)', calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4 };
    const fallbackFruit = fruits[0] || { name: 'Oranges', calories: 47, protein: 0.9, carbohydrates: 11.8, fat: 0.1 };
    const fallbackDairy = dairy[0] || { name: 'Curd (Dahi)', calories: 60, protein: 3.5, carbohydrates: 4.7, fat: 3.0 };

    // Structure a plan representing ~Breakfast (25%), ~Lunch (35%), ~Dinner (30%), ~Snack (10%)
    
    // 1. Breakfast (High carb/protein, fruit or grain + dairy)
    let breakfastMain = fallbackGrain;
    let breakfastSub = fallbackDairy;
    let breakfastWeight = 100; // grams

    if (profile.fitnessGoals === 'Weight Loss') {
      breakfastMain = grains.find(g => g.name.includes('Oats')) || fallbackGrain;
      breakfastSub = dairy.find(d => d.name.includes('Milk')) || fallbackDairy;
    } else if (deficiencies.includes('Calcium deficiency') || deficiencies.includes('Vitamin D deficiency')) {
      breakfastSub = dairy.find(d => d.name.includes('Curd')) || fallbackDairy;
    }

    const bValMultiplier = breakfastWeight / 100;
    const breakfast = {
      mealName: 'Breakfast',
      time: '08:30 AM',
      items: [
        { name: `${breakfastMain.name}`, quantity: '75g cooked portion', calories: Math.round(breakfastMain.calories * 0.75), protein: parseFloat((breakfastMain.protein * 0.75).toFixed(1)), carbs: parseFloat((breakfastMain.carbohydrates * 0.75).toFixed(1)), fat: parseFloat((breakfastMain.fat * 0.75).toFixed(1)) },
        { name: `${breakfastSub.name}`, quantity: '150ml portion', calories: Math.round(breakfastSub.calories * 1.5), protein: parseFloat((breakfastSub.protein * 1.5).toFixed(1)), carbs: parseFloat((breakfastSub.carbohydrates * 1.5).toFixed(1)), fat: parseFloat((breakfastSub.fat * 1.5).toFixed(1)) }
      ]
    };

    // 2. Lunch (Heavy meal - Grain + Lentil/Poultry + Veggie)
    let lunchProtein = fallbackLentil;
    let lunchGrain = grains.find(g => g.name.includes('Basmati Rice')) || fallbackGrain;
    let lunchVeg = fallbackVeggie;

    // Disease adjust for lunch
    if (diseases.includes('Diabetes')) {
      lunchGrain = grains.find(g => g.name.includes('Roti')) || fallbackGrain; // Avoid white rice
    }
    if (profile.fitnessGoals === 'Muscle Building') {
      lunchProtein = poultry.find(p => p.name.includes('Chicken')) || dairy.find(d => d.name.includes('Paneer')) || fallbackLentil;
    } else if (deficiencies.includes('Iron deficiency')) {
      lunchVeg = veggies.find(v => v.name.includes('Spinach')) || fallbackVeggie;
    }

    const lunch = {
      mealName: 'Lunch',
      time: '01:30 PM',
      items: [
        { name: `${lunchGrain.name}`, quantity: '120g portion', calories: Math.round(lunchGrain.calories * 1.2), protein: parseFloat((lunchGrain.protein * 1.2).toFixed(1)), carbs: parseFloat((lunchGrain.carbohydrates * 1.2).toFixed(1)), fat: parseFloat((lunchGrain.fat * 1.2).toFixed(1)) },
        { name: `${lunchProtein.name}`, quantity: '150g portion', calories: Math.round(lunchProtein.calories * 1.5), protein: parseFloat((lunchProtein.protein * 1.5).toFixed(1)), carbs: parseFloat((lunchProtein.carbohydrates * 1.5).toFixed(1)), fat: parseFloat((lunchProtein.fat * 1.5).toFixed(1)) },
        { name: `${lunchVeg.name}`, quantity: '100g serving', calories: Math.round(lunchVeg.calories * 1.0), protein: parseFloat((lunchVeg.protein * 1.0).toFixed(1)), carbs: parseFloat((lunchVeg.carbohydrates * 1.0).toFixed(1)), fat: parseFloat((lunchVeg.fat * 1.0).toFixed(1)) }
      ]
    };

    // 3. Dinner (Medium meal - Grain + Veg/Lentil or Light Prot)
    let dinnerProtein = dairy.find(d => d.name.includes('Paneer')) || dairy.find(d => d.name.includes('Tofu')) || fallbackLentil;
    let dinnerGrain = grains.find(g => g.name.includes('Roti')) || fallbackGrain;
    let dinnerVeg = veggies.find(v => v.name.includes('Broccoli')) || fallbackVeggie;

    if (diseases.includes('Thyroid')) {
      dinnerVeg = veggies.find(v => v.name.includes('Spinach')) || fallbackVeggie; // Avoid broccoli for thyroid
    }
    if (diseases.includes('Cholesterol') || diseases.includes('Kidney disease')) {
      dinnerProtein = dairy.find(d => d.name.includes('Tofu')) || fallbackLentil; // Avoid high fat paneer
    }

    const dinner = {
      mealName: 'Dinner',
      time: '08:00 PM',
      items: [
        { name: `${dinnerGrain.name}`, quantity: '100g portion (approx. 2 Rotis)', calories: Math.round(dinnerGrain.calories * 1.0), protein: parseFloat((dinnerGrain.protein * 1.0).toFixed(1)), carbs: parseFloat((dinnerGrain.carbohydrates * 1.0).toFixed(1)), fat: parseFloat((dinnerGrain.fat * 1.0).toFixed(1)) },
        { name: `${dinnerProtein.name}`, quantity: '100g serving', calories: Math.round(dinnerProtein.calories * 1.0), protein: parseFloat((dinnerProtein.protein * 1.0).toFixed(1)), carbs: parseFloat((dinnerProtein.carbohydrates * 1.0).toFixed(1)), fat: parseFloat((dinnerProtein.fat * 1.0).toFixed(1)) },
        { name: `${dinnerVeg.name}`, quantity: '80g steamed', calories: Math.round(dinnerVeg.calories * 0.8), protein: parseFloat((dinnerVeg.protein * 0.8).toFixed(1)), carbs: parseFloat((dinnerVeg.carbohydrates * 0.8).toFixed(1)), fat: parseFloat((dinnerVeg.fat * 0.8).toFixed(1)) }
      ]
    };

    // 4. Evening Snacks (Light - Nuts / Fruit / Seeds)
    let snackItem = fallbackFruit;
    if (profile.fitnessGoals === 'Muscle Building' || deficiencies.includes('Protein deficiency')) {
      snackItem = nuts.find(n => n.name.includes('Almonds')) || fallbackFruit;
    } else if (deficiencies.includes('Vitamin deficiency')) {
      snackItem = fruits.find(f => f.name.includes('Oranges')) || fallbackFruit;
    }

    const snack = {
      mealName: 'Snacks',
      time: '05:00 PM',
      items: [
        { name: `${snackItem.name}`, quantity: '50g serving', calories: Math.round(snackItem.calories * 0.5), protein: parseFloat((snackItem.protein * 0.5).toFixed(1)), carbs: parseFloat((snackItem.carbohydrates * 0.5).toFixed(1)), fat: parseFloat((snackItem.fat * 0.5).toFixed(1)) }
      ]
    };

    // Aggregate Plan Totals
    const meals = [breakfast, lunch, dinner, snack];
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;

    meals.forEach(m => {
      m.items.forEach(i => {
        totalCal += i.calories;
        totalProt += i.protein;
        totalCarb += i.carbs;
        totalFat += i.fat;
      });
    });

    res.json({
      success: true,
      targetCalories,
      planSummary: {
        calories: Math.round(totalCal),
        protein: parseFloat(totalProt.toFixed(1)),
        carbohydrates: parseFloat(totalCarb.toFixed(1)),
        fat: parseFloat(totalFat.toFixed(1))
      },
      meals
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error generating personalized diet plan' });
  }
};
