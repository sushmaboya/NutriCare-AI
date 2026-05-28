import React, { useState, useEffect } from 'react';
import { nutritionAPI, healthAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Search, 
  Plus, 
  Trash2, 
  Flame, 
  Beef, 
  Compass, 
  Droplet,
  Info,
  Calendar,
  Sparkles,
  Loader2
} from 'lucide-react';

const NutritionCalculator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState(100);
  const [diaryItems, setDiaryItems] = useState([]);
  const [profile, setProfile] = useState(null);
  
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    vitamins: [],
    minerals: []
  });

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Fetch search results when query changes
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim() !== '') {
        setSearching(true);
        try {
          const res = await nutritionAPI.getFoods(searchQuery);
          if (res.success) {
            setSearchResults(res.foods);
          }
        } catch (err) {
          console.warn('Backend food search API offline, using local mock dictionary:', err.message);
          // High-fidelity standard list of seeds for perfect offline preview
          const mockFoods = [
            { _id: 'mock-f1', name: 'Paneer (Cottage Cheese)', category: 'Dairy Products', calories: 265, protein: 18.3, carbohydrates: 1.2, fat: 20.8, vitamins: ['D', 'B12'], minerals: ['Calcium'], recommendedForDeficiencies: ['Protein deficiency', 'Calcium deficiency'] },
            { _id: 'mock-f2', name: 'Whole Wheat Roti', category: 'Grains & Cereals', calories: 264, protein: 9.1, carbohydrates: 58.4, fat: 1.5, vitamins: ['B1'], minerals: ['Iron'], recommendedForDeficiencies: ['Iron deficiency'] },
            { _id: 'mock-f3', name: 'Spinach (Palak)', category: 'Vegetables', calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4, vitamins: ['A', 'C'], minerals: ['Iron', 'Calcium'], recommendedForDeficiencies: ['Iron deficiency', 'Calcium deficiency'] },
            { _id: 'mock-f4', name: 'Yellow Moong Dal (Cooked)', category: 'Lentils & Pulses', calories: 105, protein: 7.3, carbohydrates: 19.1, fat: 0.3, vitamins: ['B9'], minerals: ['Iron', 'Potassium'], recommendedForDeficiencies: ['Protein deficiency', 'Iron deficiency'] },
            { _id: 'mock-f5', name: 'Boiled Eggs', category: 'Poultry & Seafood', calories: 143, protein: 12.6, carbohydrates: 0.7, fat: 9.5, vitamins: ['D', 'B12'], minerals: ['Iron'], recommendedForDeficiencies: ['Protein deficiency', 'Vitamin D deficiency'] }
          ];
          const filtered = mockFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setSearchResults(filtered);
        } finally {
          setSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Load user targets if profile exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await healthAPI.getProfile();
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Calculate cumulative totals from database on items change
  useEffect(() => {
    const calculateTotals = async () => {
      if (diaryItems.length === 0) {
        setTotals({
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          vitamins: [],
          minerals: []
        });
        return;
      }

      setLoading(true);
      try {
        const calculatePayload = diaryItems.map(item => ({
          foodId: item.food._id,
          grams: item.grams
        }));

        const res = await nutritionAPI.calculate(calculatePayload);
        if (res.success) {
          setTotals(res.summary);
        }
      } catch (err) {
        console.warn('Backend calculate API offline, computing totals locally:', err.message);
        let c = 0, p = 0, cb = 0, f = 0;
        let vits = new Set(), mins = new Set();
        diaryItems.forEach(item => {
          const mult = item.grams / 100;
          c += item.food.calories * mult;
          p += item.food.protein * mult;
          cb += item.food.carbohydrates * mult;
          f += item.food.fat * mult;
          if (item.food.vitamins) item.food.vitamins.forEach(v => vits.add(v));
          if (item.food.minerals) item.food.minerals.forEach(m => mins.add(m));
        });
        setTotals({
          calories: Math.round(c),
          protein: parseFloat(p.toFixed(1)),
          carbohydrates: parseFloat(cb.toFixed(1)),
          fat: parseFloat(f.toFixed(1)),
          vitamins: Array.from(vits),
          minerals: Array.from(mins)
        });
      } finally {
        setLoading(false);
      }
    };

    calculateTotals();
  }, [diaryItems]);

  const handleAddFood = () => {
    if (!selectedFood || grams <= 0) return;

    const newItem = {
      id: Date.now().toString(), // unique runtime ID
      food: selectedFood,
      grams: parseFloat(grams)
    };

    setDiaryItems([...diaryItems, newItem]);
    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
    setGrams(100);
  };

  const handleRemoveFood = (id) => {
    setDiaryItems(diaryItems.filter(item => item.id !== id));
  };

  const handleQuickPortion = (g) => {
    setGrams(g);
  };

  // Safe estimation targets
  const dailyTargetCalories = profile ? (profile.fitnessGoals === 'Weight Loss' ? 1600 : profile.fitnessGoals === 'Weight Gain' ? 2400 : 2000) : 2000;
  const targetProtein = profile ? (profile.fitnessGoals === 'Muscle Building' ? 120 : 70) : 70;
  const targetCarbs = 250;
  const targetFat = 65;

  const percentage = (value, target) => {
    return Math.min(100, Math.round((value / target) * 100));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-extrabold text-3xl tracking-tight font-outfit">Nutrition & Portion Calculator</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Add food portions in grams to aggregate cumulative macro-nutrients and verify daily targets
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-2xl flex items-center gap-2 text-emerald-600 dark:text-emerald-300 font-semibold text-sm">
            <Calendar size={16} />
            <span>Today's Log</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Item & Diary Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Search and Selector Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-outfit">
                <Sparkles className="text-emerald-500" size={18} />
                Search & Add Food
              </h2>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
                  <input
                    type="text"
                    placeholder="Search Indian foods (e.g. Roti, Paneer, Dal, Chicken)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-950 dark:text-white"
                  />
                  {searching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" size={18} />
                  )}
                </div>

                {/* Search Dropdown Results */}
                {searchResults.length > 0 && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 animate-fadeIn">
                    {searchResults.map((food) => (
                      <div
                        key={food._id}
                        onClick={() => {
                          setSelectedFood(food);
                          setSearchQuery(food.name);
                          setSearchResults([]);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-semibold">{food.name}</span>
                          <span className="text-xs text-slate-400 ml-2">({food.category})</span>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{food.calories} kcal / 100g</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* selected food input parameters */}
                {selectedFood && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/60 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedFood.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Base Macros: P: {selectedFood.protein}g | C: {selectedFood.carbohydrates}g | F: {selectedFood.fat}g (per 100g)</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100/60 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                        {selectedFood.category}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Gram input */}
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight (Grams)</label>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={grams}
                          onChange={(e) => setGrams(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-950 dark:text-white"
                        />
                      </div>

                      {/* Quick helpers */}
                      <div className="flex items-center gap-2 self-end">
                        {[50, 100, 150, 200].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleQuickPortion(val)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition border ${grams === val ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
                          >
                            {val}g
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddFood}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition text-sm"
                    >
                      <Plus size={16} />
                      Add to Daily Diary
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Diary Items List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between font-outfit">
                <span>Food Diary</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                  {diaryItems.length} {diaryItems.length === 1 ? 'item' : 'items'}
                </span>
              </h2>

              {diaryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-650 gap-3 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <Info size={30} className="text-slate-300 dark:text-slate-700" />
                  <p className="text-sm font-medium">Your diary is empty. Search and add portions above.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                  {diaryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-850/10 border border-slate-150 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 transition"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.food.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.grams}g</span>
                          <span>•</span>
                          <span>{Math.round(item.food.calories * (item.grams / 100))} kcal</span>
                          <span>•</span>
                          <span>P: {parseFloat((item.food.protein * (item.grams / 100)).toFixed(1))}g</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFood(item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 hover:text-red-600 dark:text-red-400 transition"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Aggregated Totals Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cumulative Summary Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-4 font-outfit">
                <Flame className="text-orange-500 fill-current" size={20} />
                Daily Nutrition Aggregates
              </h2>

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 z-20 rounded-3xl flex items-center justify-center backdrop-blur-xs">
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                </div>
              )}

              {/* Total Calories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-outfit">
                    <Flame size={16} className="text-orange-500" />
                    Calories
                  </span>
                  <span className="font-extrabold text-lg text-slate-850 dark:text-slate-150">
                    {totals.calories} <span className="text-xs font-semibold text-slate-400">/ {dailyTargetCalories} kcal</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500" 
                    style={{ width: `${percentage(totals.calories, dailyTargetCalories)}%` }}
                  />
                </div>
                <div className="flex justify-end text-[10px] font-bold text-slate-400 uppercase">
                  {percentage(totals.calories, dailyTargetCalories)}% Target Met
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                
                {/* Protein */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 font-outfit">
                    <Beef size={12} className="text-red-500" />
                    Protein
                  </div>
                  <div className="font-extrabold text-sm">{totals.protein}g</div>
                  <div className="text-[10px] text-slate-400">Target: {targetProtein}g</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
                    <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${percentage(totals.protein, targetProtein)}%` }} />
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 font-outfit">
                    <Compass size={12} className="text-sky-500" />
                    Carbs
                  </div>
                  <div className="font-extrabold text-sm">{totals.carbohydrates}g</div>
                  <div className="text-[10px] text-slate-400">Target: {targetCarbs}g</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
                    <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${percentage(totals.carbohydrates, targetCarbs)}%` }} />
                  </div>
                </div>

                {/* Fats */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 font-outfit">
                    <Droplet size={12} className="text-amber-500" />
                    Fats
                  </div>
                  <div className="font-extrabold text-sm">{totals.fat}g</div>
                  <div className="text-[10px] text-slate-400">Target: {targetFat}g</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${percentage(totals.fat, targetFat)}%` }} />
                  </div>
                </div>

              </div>

              {/* Accumulated Micronutrients */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-outfit">Accumulated Micro-Nutrients</h3>
                
                {/* Vitamins */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">Vitamins:</div>
                  {totals.vitamins.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No vitamins tracked</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {totals.vitamins.map(vit => (
                        <span key={vit} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                          Vitamin {vit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Minerals */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500">Minerals:</div>
                  {totals.minerals.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No minerals tracked</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {totals.minerals.map(min => (
                        <span key={min} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50">
                          {min}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default NutritionCalculator;
