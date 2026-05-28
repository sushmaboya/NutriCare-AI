const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const FoodItem = require('../models/FoodItem');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const foodItems = [
  {
    name: 'Spinach (Palak)',
    category: 'Vegetables',
    calories: 23,
    protein: 2.9,
    carbohydrates: 3.6,
    fat: 0.4,
    vitamins: ['A', 'C', 'K', 'B9 (Folate)'],
    minerals: ['Iron', 'Calcium', 'Magnesium', 'Potassium'],
    recommendedForDeficiencies: ['Iron deficiency', 'Vitamin deficiency', 'Calcium deficiency'],
    goodForDiseases: ['Diabetes', 'High BP', 'Cholesterol'],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Paneer (Cottage Cheese)',
    category: 'Dairy Products',
    calories: 265,
    protein: 18.3,
    carbohydrates: 1.2,
    fat: 20.8,
    vitamins: ['D', 'B12', 'A'],
    minerals: ['Calcium', 'Phosphorus', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Calcium deficiency', 'Vitamin D deficiency'],
    goodForDiseases: ['Thyroid'],
    avoidForDiseases: ['Cholesterol', 'Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Chickpeas (Chole)',
    category: 'Lentils & Pulses',
    calories: 164,
    protein: 8.9,
    carbohydrates: 27.4,
    fat: 2.6,
    vitamins: ['B6', 'Folate', 'E'],
    minerals: ['Iron', 'Magnesium', 'Potassium', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Oats',
    category: 'Grains & Cereals',
    calories: 389,
    protein: 16.9,
    carbohydrates: 66.3,
    fat: 6.9,
    vitamins: ['B1', 'B5', 'Folate'],
    minerals: ['Magnesium', 'Iron', 'Zinc', 'Phosphorus'],
    recommendedForDeficiencies: ['Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Whole Wheat Roti',
    category: 'Grains & Cereals',
    calories: 264,
    protein: 9.1,
    carbohydrates: 58.4,
    fat: 1.5,
    vitamins: ['B1', 'B3', 'B6'],
    minerals: ['Magnesium', 'Iron', 'Selenium'],
    recommendedForDeficiencies: ['Iron deficiency'],
    goodForDiseases: ['Cholesterol', 'High BP'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Chicken Breast',
    category: 'Poultry & Seafood',
    calories: 165,
    protein: 31.0,
    carbohydrates: 0.0,
    fat: 3.6,
    vitamins: ['B3', 'B6', 'B12', 'D'],
    minerals: ['Selenium', 'Phosphorus', 'Iron', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency', 'Vitamin D deficiency'],
    goodForDiseases: ['Thyroid'],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Boiled Eggs',
    category: 'Poultry & Seafood',
    calories: 143,
    protein: 12.6,
    carbohydrates: 0.7,
    fat: 9.5,
    vitamins: ['D', 'B12', 'A', 'B2', 'B5'],
    minerals: ['Selenium', 'Calcium', 'Iron', 'Zinc', 'Phosphorus'],
    recommendedForDeficiencies: ['Protein deficiency', 'Vitamin D deficiency', 'Vitamin deficiency', 'Iron deficiency'],
    goodForDiseases: ['Thyroid'],
    avoidForDiseases: ['Cholesterol'],
    isIndianDiet: true
  },
  {
    name: 'Milk (Double Toned)',
    category: 'Dairy Products',
    calories: 47,
    protein: 3.4,
    carbohydrates: 4.9,
    fat: 1.5,
    vitamins: ['D', 'B12', 'A', 'B2'],
    minerals: ['Calcium', 'Phosphorus', 'Potassium'],
    recommendedForDeficiencies: ['Calcium deficiency', 'Vitamin D deficiency', 'Vitamin deficiency'],
    goodForDiseases: [],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Almonds (Badam)',
    category: 'Nuts & Seeds',
    calories: 579,
    protein: 21.2,
    carbohydrates: 21.7,
    fat: 49.9,
    vitamins: ['E', 'B2', 'B3'],
    minerals: ['Calcium', 'Magnesium', 'Iron', 'Zinc', 'Phosphorus'],
    recommendedForDeficiencies: ['Protein deficiency', 'Calcium deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Button Mushrooms',
    category: 'Vegetables',
    calories: 22,
    protein: 3.1,
    carbohydrates: 3.3,
    fat: 0.3,
    vitamins: ['D', 'B2', 'B3', 'B5'],
    minerals: ['Selenium', 'Potassium', 'Phosphorus', 'Copper'],
    recommendedForDeficiencies: ['Vitamin D deficiency', 'Vitamin deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Oranges',
    category: 'Fruits',
    calories: 47,
    protein: 0.9,
    carbohydrates: 11.8,
    fat: 0.1,
    vitamins: ['C', 'A', 'B1'],
    minerals: ['Calcium', 'Potassium', 'Magnesium'],
    recommendedForDeficiencies: ['Vitamin deficiency'],
    goodForDiseases: ['High BP', 'Cholesterol'],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Yellow Moong Dal (Cooked)',
    category: 'Lentils & Pulses',
    calories: 105,
    protein: 7.3,
    carbohydrates: 19.1,
    fat: 0.3,
    vitamins: ['B1', 'B5', 'B9 (Folate)'],
    minerals: ['Iron', 'Potassium', 'Magnesium', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'High BP', 'Cholesterol'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Curd (Dahi)',
    category: 'Dairy Products',
    calories: 60,
    protein: 3.5,
    carbohydrates: 4.7,
    fat: 3.0,
    vitamins: ['D', 'B2', 'B12'],
    minerals: ['Calcium', 'Phosphorus', 'Potassium'],
    recommendedForDeficiencies: ['Calcium deficiency', 'Vitamin D deficiency', 'Protein deficiency'],
    goodForDiseases: ['High BP', 'Thyroid'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'White Basmati Rice (Cooked)',
    category: 'Grains & Cereals',
    calories: 130,
    protein: 2.7,
    carbohydrates: 28.0,
    fat: 0.3,
    vitamins: ['B1', 'B3'],
    minerals: ['Selenium', 'Iron'],
    recommendedForDeficiencies: [],
    goodForDiseases: [],
    avoidForDiseases: ['Diabetes'],
    isIndianDiet: true
  },
  {
    name: 'Broccoli',
    category: 'Vegetables',
    calories: 34,
    protein: 2.8,
    carbohydrates: 7.0,
    fat: 0.4,
    vitamins: ['C', 'A', 'K', 'B9 (Folate)'],
    minerals: ['Calcium', 'Iron', 'Potassium', 'Phosphorus'],
    recommendedForDeficiencies: ['Vitamin deficiency', 'Calcium deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP'],
    avoidForDiseases: ['Thyroid'],
    isIndianDiet: true
  },
  {
    name: 'Quinoa',
    category: 'Grains & Cereals',
    calories: 120,
    protein: 4.4,
    carbohydrates: 21.3,
    fat: 1.9,
    vitamins: ['B6', 'E', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Zinc', 'Potassium'],
    recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP'],
    avoidForDiseases: [],
    isIndianDiet: false
  },
  {
    name: 'Tofu',
    category: 'Dairy Products',
    calories: 76,
    protein: 8.0,
    carbohydrates: 1.9,
    fat: 4.8,
    vitamins: ['B1', 'E'],
    minerals: ['Calcium', 'Iron', 'Magnesium', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Calcium deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP', 'Thyroid'],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Walnuts (Akhrot)',
    category: 'Nuts & Seeds',
    calories: 654,
    protein: 15.2,
    carbohydrates: 13.7,
    fat: 65.2,
    vitamins: ['B6', 'Folate', 'E'],
    minerals: ['Calcium', 'Iron', 'Magnesium', 'Zinc', 'Copper'],
    recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'Cholesterol', 'High BP', 'Thyroid'],
    avoidForDiseases: [],
    isIndianDiet: true
  },
  {
    name: 'Papaya',
    category: 'Fruits',
    calories: 43,
    protein: 0.5,
    carbohydrates: 10.8,
    fat: 0.3,
    vitamins: ['C', 'A', 'E', 'Folate'],
    minerals: ['Calcium', 'Potassium', 'Magnesium'],
    recommendedForDeficiencies: ['Vitamin deficiency'],
    goodForDiseases: ['Diabetes', 'High BP', 'Cholesterol'],
    avoidForDiseases: ['Kidney disease'],
    isIndianDiet: true
  },
  {
    name: 'Chia Seeds',
    category: 'Nuts & Seeds',
    calories: 486,
    protein: 16.5,
    carbohydrates: 42.1,
    fat: 30.7,
    vitamins: ['A', 'B1', 'B2', 'B3'],
    minerals: ['Calcium', 'Iron', 'Magnesium', 'Phosphorus', 'Zinc'],
    recommendedForDeficiencies: ['Protein deficiency', 'Calcium deficiency', 'Iron deficiency'],
    goodForDiseases: ['Diabetes', 'High BP', 'Cholesterol'],
    avoidForDiseases: [],
    isIndianDiet: false
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthcare';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully for seeding.');

    // Clear existing
    await FoodItem.deleteMany();
    console.log('Cleared existing FoodItems collection.');

    // Insert new seed
    await FoodItem.insertMany(foodItems);
    console.log(`Successfully seeded ${foodItems.length} FoodItems into database.`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
