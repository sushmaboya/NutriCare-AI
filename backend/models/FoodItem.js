const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grains & Cereals', 'Lentils & Pulses', 'Vegetables', 'Fruits', 'Dairy Products', 'Nuts & Seeds', 'Poultry & Seafood', 'Beverages', 'Other']
  },
  calories: {
    type: Number, // per 100g
    required: true
  },
  protein: {
    type: Number, // grams per 100g
    required: true
  },
  carbohydrates: {
    type: Number, // grams per 100g
    required: true
  },
  fat: {
    type: Number, // grams per 100g
    required: true
  },
  vitamins: {
    type: [String],
    default: []
  },
  minerals: {
    type: [String],
    default: []
  },
  // Recommended deficiencies this food can cure
  recommendedForDeficiencies: {
    type: [String],
    default: [],
    enum: ['Iron deficiency', 'Vitamin deficiency', 'Protein deficiency', 'Calcium deficiency', 'Vitamin D deficiency']
  },
  // Disease relationships
  avoidForDiseases: {
    type: [String],
    default: [],
    enum: ['Diabetes', 'High BP', 'Cholesterol', 'Kidney disease', 'Thyroid']
  },
  goodForDiseases: {
    type: [String],
    default: [],
    enum: ['Diabetes', 'High BP', 'Cholesterol', 'Kidney disease', 'Thyroid']
  },
  isIndianDiet: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);
