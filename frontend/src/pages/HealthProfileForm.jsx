import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  User, 
  Scale, 
  Ruler, 
  Target, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Loader2,
  Bookmark
} from 'lucide-react';

const HealthProfileForm = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('Healthy Balanced Diet');
  const [selectedDeficiencies, setSelectedDeficiencies] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const deficienciesList = [
    'Iron deficiency',
    'Vitamin deficiency',
    'Protein deficiency',
    'Calcium deficiency',
    'Vitamin D deficiency'
  ];

  const diseasesList = [
    'Diabetes',
    'High BP',
    'Cholesterol',
    'Kidney disease',
    'Thyroid'
  ];

  const goalsList = [
    'Weight Loss',
    'Weight Gain',
    'Muscle Building',
    'Healthy Balanced Diet',
    'Manage Vitals'
  ];

  // Fetch existing profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await healthAPI.getProfile();
        if (res.success && res.profile) {
          const p = res.profile;
          setAge(p.age || '');
          setGender(p.gender || 'Male');
          setWeight(p.weight || '');
          setHeight(p.height || '');
          setFitnessGoals(p.fitnessGoals || 'Healthy Balanced Diet');
          setSelectedDeficiencies(p.deficiencies || []);
          setSelectedDiseases(p.diseases || []);
        }
      } catch (err) {
        console.error('Failed to load profile details', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Calculate BMI in real-time
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(2));
      setBmi(calculatedBmi);

      // BMI Categories
      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiCategory('Normal Weight');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    } else {
      setBmi(null);
      setBmiCategory('');
    }
  }, [weight, height]);

  const handleDeficiencyToggle = (deficiency) => {
    if (selectedDeficiencies.includes(deficiency)) {
      setSelectedDeficiencies(selectedDeficiencies.filter(d => d !== deficiency));
    } else {
      setSelectedDeficiencies([...selectedDeficiencies, deficiency]);
    }
  };

  const handleDiseaseToggle = (disease) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(selectedDiseases.filter(d => d !== disease));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!age || !weight || !height) {
      setErrorMsg('Please fill in age, weight, and height.');
      setLoading(false);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const res = await healthAPI.updateProfile({
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        deficiencies: selectedDeficiencies,
        diseases: selectedDiseases,
        fitnessGoals
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Profile saved successfully!');
        window.scrollTo(0, 0);
        setTimeout(() => {
          navigate('/'); // Redirect to dashboard
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Server error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  // Get color for BMI tag
  const getBmiBadgeColor = () => {
    if (bmiCategory === 'Underweight') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
    if (bmiCategory === 'Normal Weight') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
    if (bmiCategory === 'Overweight') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
  };

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-sm text-slate-400">Loading your profile data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Title */}
        <div>
          <h1 className="font-extrabold text-3xl tracking-tight">Health Profile Onboarding</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Complete your clinical parameters to generate a highly-targeted diet and avoid foods schema
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fadeIn">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium animate-fadeIn">
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Vitals Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity className="text-emerald-500" size={18} />
              Vitals & Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Age (Years)
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-950 dark:text-white cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Weight (kg)
                </label>
                <div className="relative group">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    placeholder="e.g. 72.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
                  Height (cm)
                </label>
                <div className="relative group">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-950 dark:text-white"
                  />
                </div>
              </div>

            </div>

            {/* Real-time BMI Display Box */}
            {bmi && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
                <div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Calculated BMI Index</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Updated automatically based on your height and weight inputs.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-3xl text-emerald-600 dark:text-emerald-400 tracking-tight">{bmi}</span>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-bold ${getBmiBadgeColor()}`}>
                    {bmiCategory}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fitness Goal & Deficiencies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Fitness Goal */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="text-emerald-500" size={18} />
                Primary Fitness Goal
              </h2>
              <div className="space-y-2.5">
                {goalsList.map((g) => (
                  <label
                    key={g}
                    className={`
                      flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 select-none
                      ${fitnessGoals === g
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/20'
                      }
                    `}
                  >
                    <span>{g}</span>
                    <input
                      type="radio"
                      name="fitnessGoal"
                      value={g}
                      checked={fitnessGoals === g}
                      onChange={() => setFitnessGoals(g)}
                      className="accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Deficiencies */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Bookmark className="text-emerald-500" size={18} />
                Deficiencies (Select All That Apply)
              </h2>
              <p className="text-xs text-slate-400">We will recommend vitamin/mineral rich diets based on these targets.</p>
              <div className="space-y-2.5">
                {deficienciesList.map((def) => {
                  const isChecked = selectedDeficiencies.includes(def);
                  return (
                    <label
                      key={def}
                      onClick={() => handleDeficiencyToggle(def)}
                      className={`
                        flex items-center gap-3.5 p-3.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 select-none
                        ${isChecked 
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/20'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="accent-emerald-500 w-4.5 h-4.5 rounded-md cursor-pointer"
                      />
                      <span>{def}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Diseases Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              Disease Warnings & Vitals Check (Select All That Apply)
            </h2>
            <p className="text-xs text-slate-400">
              Crucial: NutriCare AI will automatically filter out and warn you against foods that trigger or exacerbate these conditions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {diseasesList.map((disease) => {
                const isChecked = selectedDiseases.includes(disease);
                return (
                  <div
                    key={disease}
                    onClick={() => handleDiseaseToggle(disease)}
                    className={`
                      flex items-center gap-3 p-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-200 select-none
                      ${isChecked
                        ? 'border-red-500 bg-red-500/5 text-red-700 dark:text-red-400' 
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-800/20'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="accent-red-500 w-4.5 h-4.5 rounded-md cursor-pointer"
                    />
                    <span>{disease}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 flex items-center gap-2.5 transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving Health Parameters...</span>
                </>
              ) : (
                'Save Profile & Generate Suggestions'
              )}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
};

export default HealthProfileForm;
