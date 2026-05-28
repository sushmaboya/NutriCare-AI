const HealthProfile = require('../models/HealthProfile');

// @route   GET api/health/profile
// @desc    Get user health profile
// @access  Private
exports.getHealthProfile = async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(200).json({ success: true, profile: null });
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error fetching health profile' });
  }
};

// @route   POST api/health/profile
// @desc    Create or update user health profile
// @access  Private
exports.updateHealthProfile = async (req, res) => {
  const { age, gender, weight, height, deficiencies, diseases, fitnessGoals } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    age,
    gender,
    weight,
    height,
    deficiencies: Array.isArray(deficiencies) ? deficiencies : [],
    diseases: Array.isArray(diseases) ? diseases : [],
    fitnessGoals
  };

  try {
    let profile = await HealthProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      // Using pre-save hook triggers when using .save(), so we should assign values and call save()
      profile.age = age;
      profile.gender = gender;
      profile.weight = weight;
      profile.height = height;
      profile.deficiencies = profileFields.deficiencies;
      profile.diseases = profileFields.diseases;
      profile.fitnessGoals = fitnessGoals;
      
      await profile.save();
      return res.json({ success: true, message: 'Health profile updated', profile });
    }

    // Create new
    profile = new HealthProfile(profileFields);
    await profile.save();
    
    res.json({ success: true, message: 'Health profile created', profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error updating health profile' });
  }
};
