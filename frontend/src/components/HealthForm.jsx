import { useMemo } from 'react';
import { calculateBMI } from '../utils/bmi';

function HealthForm({ data, setData, onSubmit, loading }) {
  const bmi = useMemo(() => calculateBMI(data.weight, data.height), [data.weight, data.height]);

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white/90 dark:bg-slate-900/90 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Age
          <input
            type="number"
            min="1"
            value={data.age}
            onChange={(e) => setData({ ...data, age: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Gender
          <select
            value={data.gender}
            onChange={(e) => setData({ ...data, gender: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
            required
          >
            <option value="">Choose gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          Weight (kg)
          <input
            type="number"
            min="1"
            value={data.weight}
            onChange={(e) => setData({ ...data, weight: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Height (cm)
          <input
            type="number"
            min="1"
            value={data.height}
            onChange={(e) => setData({ ...data, height: e.target.value })}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
            required
          />
        </label>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">Calculated BMI: <strong>{bmi}</strong></p>

      <label className="block space-y-2 text-sm font-medium">
        Deficiencies
        <select
          multiple
          value={data.deficiencies}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
            setData({ ...data, deficiencies: values });
          }}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
        >
          <option value="Iron deficiency">Iron deficiency</option>
          <option value="Vitamin deficiency">Vitamin deficiency</option>
          <option value="Protein deficiency">Protein deficiency</option>
          <option value="Calcium deficiency">Calcium deficiency</option>
          <option value="Vitamin D deficiency">Vitamin D deficiency</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium">
        Diseases / Conditions
        <select
          multiple
          value={data.diseases}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
            setData({ ...data, diseases: values });
          }}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
        >
          <option value="Diabetes">Diabetes</option>
          <option value="High BP">High BP</option>
          <option value="Cholesterol">Cholesterol</option>
          <option value="Kidney disease">Kidney disease</option>
          <option value="Thyroid">Thyroid</option>
        </select>
      </label>

      <label className="block space-y-2 text-sm font-medium">
        Fitness goal
        <select
          value={data.fitnessGoals}
          onChange={(e) => setData({ ...data, fitnessGoals: e.target.value })}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-950"
          required
        >
          <option value="">Choose a goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Weight Gain">Weight Gain</option>
          <option value="Muscle Building">Muscle Building</option>
          <option value="Healthy Balanced Diet">Healthy Balanced Diet</option>
          <option value="Manage Vitals">Manage Vitals</option>
        </select>
      </label>

      <button
        type="submit"
        className="w-full py-3 rounded-2xl bg-sky-600 text-white hover:bg-sky-500 disabled:bg-slate-400"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Health Profile'}
      </button>
    </form>
  );
}

export default HealthForm;
