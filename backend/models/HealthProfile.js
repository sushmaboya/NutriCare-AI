const mongoose = require('mongoose');

const HealthProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [1, 'Age must be positive']
  },
  gender: {
    type: String,
    required: [true, 'Please add gender'],
    enum: ['Male', 'Female', 'Other']
  },
  weight: {
    type: Number,
    required: [true, 'Please add weight in kilograms'],
    min: [1, 'Weight must be positive']
  },
  height: {
    type: Number,
    required: [true, 'Please add height in centimeters'],
    min: [1, 'Height must be positive']
  },
  deficiencies: {
    type: [String],
    default: [],
    enum: ['Iron deficiency', 'Vitamin deficiency', 'Protein deficiency', 'Calcium deficiency', 'Vitamin D deficiency']
  },
  diseases: {
    type: [String],
    default: [],
    enum: ['Diabetes', 'High BP', 'Cholesterol', 'Kidney disease', 'Thyroid']
  },
  fitnessGoals: {
    type: String,
    required: [true, 'Please select a fitness goal'],
    enum: ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Healthy Balanced Diet', 'Manage Vitals']
  },
  bmi: {
    type: Number
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate BMI hook before saving
HealthProfileSchema.pre('save', function (next) {
  // height in meters = cm / 100
  const heightInMeters = this.height / 100;
  this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HealthProfile', HealthProfileSchema);
