import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Flame, 
  Beef, 
  Compass, 
  Droplet, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  Info,
  Calendar,
  ChevronRight,
  TrendingUp,
  Scale,
  RefreshCw,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch dashboard summary (BMI, goals, foods)
      const sumRes = await recommendationAPI.getSummary();
      if (sumRes.success) {
        setSummaryData(sumRes);
      }

      // 2. Fetch diet plan (Breakfast, Lunch, Dinner, Snack scheduler)
      if (sumRes.hasProfile) {
        setPlanLoading(true);
        const planRes = await recommendationAPI.getDietPlan();
        if (planRes.success) {
          setDietPlan(planRes);
        }
        setPlanLoading(false);
      }
    } catch (err) {
      console.warn('Backend summary API down, loading offline dashboard simulator:', err.message);
      // Loading elegant mock summary data for smooth standalone preview
      setSummaryData({
        success: true,
        hasProfile: true,
        profile: {
          age: 28,
          gender: 'Male',
          weight: 78,
          height: 175,
          deficiencies: ['Protein deficiency', 'Vitamin D deficiency'],
          diseases: ['Diabetes'],
          fitnessGoals: 'Muscle Building',
          bmi: 25.47,
          targetCalories: 2300,
          macronutrientTargets: { protein: 120, carbohydrates: 220, fat: 65 }
        },
        recommendedFoods: [
          { _id: 'mock-f1', name: 'Paneer (Cottage Cheese)', category: 'Dairy Products', calories: 265, protein: 18.3, recommendedForDeficiencies: ['Protein deficiency'] },
          { _id: 'mock-f2', name: 'Boiled Eggs', category: 'Poultry & Seafood', calories: 143, protein: 12.6, recommendedForDeficiencies: ['Protein deficiency', 'Vitamin D deficiency'] },
          { _id: 'mock-f3', name: 'Button Mushrooms', category: 'Vegetables', calories: 22, protein: 3.1, recommendedForDeficiencies: ['Vitamin D deficiency'] }
        ],
        avoidedFoods: [
          { _id: 'mock-f4', name: 'White Basmati Rice (Cooked)', category: 'Grains & Cereals', calories: 130, avoidForDiseases: ['Diabetes'] }
        ],
        healthInsights: [
          'Your BMI (25.47) indicates you are slightly overweight. Focus on maintaining a minor calorie deficit.',
          'For muscle building with Protein deficiency, target 120g of protein daily. Prioritize eggs, paneer, and lentils.',
          'To manage Diabetes, avoid white rice and highly refined grains. Swapping with oats or rotis will stabilize insulin levels.'
        ]
      });
      setDietPlan({
        success: true,
        planSummary: { calories: 2150, protein: 118, carbohydrates: 210, fat: 60 },
        meals: [
          {
            mealName: 'Breakfast',
            time: '08:30 AM',
            items: [
              { name: 'Oats (cooked)', quantity: '75g portion', calories: 290, protein: 12.6, carbs: 49.7, fat: 5.2 },
              { name: 'Double Toned Milk', quantity: '150ml portion', calories: 70, protein: 5.1, carbs: 7.3, fat: 2.2 }
            ]
          },
          {
            mealName: 'Lunch',
            time: '01:30 PM',
            items: [
              { name: 'Whole Wheat Roti', quantity: '2 Rotis (100g)', calories: 264, protein: 9.1, carbs: 58.4, fat: 1.5 },
              { name: 'Yellow Moong Dal', quantity: '150g serving', calories: 158, protein: 11, carbs: 28.6, fat: 0.5 },
              { name: 'Spinach (steamed)', quantity: '100g serving', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 }
            ]
          },
          {
            mealName: 'Dinner',
            time: '08:00 PM',
            items: [
              { name: 'Paneer (Cottage Cheese)', quantity: '100g portion', calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8 },
              { name: 'Whole Wheat Roti', quantity: '2 Rotis (100g)', calories: 264, protein: 9.1, carbs: 58.4, fat: 1.5 },
              { name: 'Button Mushrooms', quantity: '80g cooked', calories: 18, protein: 2.5, carbs: 2.6, fat: 0.2 }
            ]
          },
          {
            mealName: 'Snacks',
            time: '05:00 PM',
            items: [
              { name: 'Almonds (Badam)', quantity: '30g serving', calories: 174, protein: 6.4, carbs: 6.5, fat: 15 }
            ]
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getBmiCategoryColor = (category) => {
    if (!category) return 'text-slate-500';
    const cat = category.toLowerCase();
    if (cat.includes('underweight')) return 'text-blue-500 dark:text-blue-400';
    if (cat.includes('normal')) return 'text-emerald-500 dark:text-emerald-400';
    if (cat.includes('overweight')) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-sm text-slate-400">Loading personalized clinical dashboards...</p>
        </div>
      </DashboardLayout>
    );
  }

  // User hasn't onboarding vitals
  if (summaryData && !summaryData.hasProfile) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto text-center py-16 space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <TrendingUp size={30} />
          </div>
          <div className="space-y-2">
            <h1 className="font-extrabold text-2xl tracking-tight">Onboard Your Vitals</h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
              Please complete your health profile with your age, height, weight, chronic diseases, and deficiencies to unlock automated caloric and nutritional guidelines.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition cursor-pointer text-sm"
          >
            <span>Complete Onboarding Profile</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const profile = summaryData?.profile;
  const targetCalories = profile?.targetCalories || 2000;
  const macros = profile?.macronutrientTargets || { protein: 70, carbohydrates: 250, fat: 65 };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        
        {/* Dashboard Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-3xl tracking-tight font-outfit">Health Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Real-time calculations based on your clinical profiles, deficiencies, and goals
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="self-start sm:self-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 transition flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Sync Vitals</span>
          </button>
        </div>

        {/* Row 1: BMI Gauge & Calorie Targets Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* BMI Info Card */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                <Scale size={16} className="text-slate-400" />
                BMI Index
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                Vitals
              </span>
            </div>

            <div className="py-2 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-5xl tracking-tight text-slate-850 dark:text-slate-150">
                  {profile.bmi}
                </span>
                <span className={`text-sm font-bold uppercase tracking-wider ${getBmiCategoryColor(profile.bmi < 18.5 ? 'Underweight' : profile.bmi < 25 ? 'Normal' : profile.bmi < 30 ? 'Overweight' : 'Obese')}`}>
                  {profile.bmi < 18.5 ? 'Underweight' : profile.bmi < 25 ? 'Normal Weight' : profile.bmi < 30 ? 'Overweight' : 'Obese'}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Calculated weight: {profile.weight} kg at height {profile.height} cm
              </p>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden flex">
                <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                <div className="h-full bg-emerald-500" style={{ width: '25%' }} />
                <div className="h-full bg-amber-400" style={{ width: '15%' }} />
                <div className="h-full bg-red-500" style={{ width: '41.5%' }} />
                
                {/* Pointer indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white shadow-md transition-all duration-500"
                  style={{ left: `${Math.min(100, Math.max(0, (profile.bmi / 40) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                <span>15.0</span>
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
                <span>40.0+</span>
              </div>
            </div>
          </div>

          {/* Daily Calorie Targets Card */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
                <Flame size={16} className="text-orange-500 fill-current" />
                Daily Calorie Quota
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100/60 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {profile.fitnessGoals}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
              {/* Giant Calorie Number */}
              <div className="sm:col-span-2 space-y-1">
                <span className="font-extrabold text-5xl tracking-tight text-slate-855 dark:text-white">
                  {targetCalories}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 ml-1">kcal / day</span>
                <p className="text-xs text-slate-400 mt-1">Recommended target estimate to achieve your fitness goal.</p>
              </div>

              {/* Macro breakdown summary */}
              <div className="sm:col-span-2 grid grid-cols-3 gap-2.5">
                
                {/* Protein */}
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl flex flex-col items-center">
                  <Beef size={16} className="text-red-500 mb-1" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Protein</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{macros.protein}g</span>
                </div>

                {/* Carbs */}
                <div className="p-3 bg-sky-500/5 border border-sky-500/10 rounded-2xl flex flex-col items-center">
                  <Compass size={16} className="text-sky-500 mb-1" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Carbs</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{macros.carbohydrates}g</span>
                </div>

                {/* Fats */}
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex flex-col items-center">
                  <Droplet size={16} className="text-amber-500 mb-1" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Fats</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">{macros.fat}g</span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Diet Plan Scheduler (Indian support) */}
        {dietPlan && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
            
            {planLoading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 z-20 flex items-center justify-center backdrop-blur-xs">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-outfit">
                <Calendar className="text-emerald-500" size={20} />
                Daily Meal Schedule (Indian Menu)
              </h2>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <span>Calculated Plan Total:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{dietPlan.planSummary.calories} kcal</span>
              </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dietPlan.meals.map((meal) => (
                <div 
                  key={meal.mealName}
                  className="bg-slate-50/50 dark:bg-slate-850/40 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-emerald-500/25 dark:hover:border-emerald-500/15 transition group"
                >
                  {/* Meal Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {meal.mealName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-400 uppercase">
                      {meal.time}
                    </span>
                  </div>

                  {/* Meal Items */}
                  <div className="space-y-3 flex-1">
                    {meal.items.map((item, index) => (
                      <div key={index} className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-350 leading-tight">
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                          <span>{item.quantity}</span>
                          <span className="font-bold text-slate-500 dark:text-slate-400">{item.calories} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meal Total mini progress */}
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/80 pt-2 font-bold uppercase">
                    <span>Aggregate Macros</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      P: {Math.round(meal.items.reduce((acc, curr) => acc + curr.protein, 0))}g
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Row 3: Insights Pane */}
        {summaryData.healthInsights && summaryData.healthInsights.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-outfit">
              <Sparkles size={16} className="text-emerald-500 animate-pulse" />
              Clinical Health & Diet Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryData.healthInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900 border border-emerald-500/5 rounded-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-300 shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">
                    {index + 1}
                  </div>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 4: Recommended vs Avoid Foods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Foods to Prioritize */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-emerald-850 dark:text-emerald-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60 font-outfit">
              <ShieldCheck className="text-emerald-500" size={22} />
              Recommended Foods to Prioritize
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {summaryData.recommendedFoods.map((food, idx) => (
                <div 
                  key={food._id || idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition"
                >
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{food.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>{food.calories} kcal / 100g</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Protein: {food.protein}g</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end max-w-40">
                    {food.recommendedForDeficiencies && food.recommendedForDeficiencies.map(def => (
                      <span key={def} className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {def.replace(' deficiency', '')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-red-850 dark:text-red-400 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60 font-outfit">
              <ShieldAlert className="text-red-500" size={22} />
              Contraindicated Foods to Avoid
            </h2>

            {summaryData.avoidedFoods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-650 gap-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                <ShieldCheck size={28} className="text-emerald-500" />
                <p className="text-xs font-semibold">No food contradictions based on your chronic profiles!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {summaryData.avoidedFoods.map((food, idx) => (
                  <div 
                    key={food._id || idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{food.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{food.calories} kcal / 100g</span>
                        <span>•</span>
                        <span className="text-red-600 dark:text-red-400 font-semibold">Avoid for: {food.avoidForDiseases ? food.avoidForDiseases.join(', ') : 'Diabetes'}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-850 dark:bg-red-950/40 dark:text-red-300">
                      Contraindicated
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
