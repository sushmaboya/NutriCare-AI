import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Register = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valError, setValError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValError(null);

    if (!name || !email || !password) {
      setValError('Please enter all fields');
      return;
    }

    if (password.length < 6) {
      setValError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register({ name, email, password });
    if (res.success) {
      navigate('/profile'); // Onboard to profile immediately after register
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-100 dark:shadow-none relative overflow-hidden transition-all duration-300">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25 mb-4 animate-pulse">
            <Heart size={28} className="fill-current" />
          </div>
          <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 text-center">
            Sign up to generate your custom AI nutrition profile
          </p>
        </div>

        {/* Server & Client Error Alerts */}
        {(error || valError) && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium animate-fadeIn">
            {valError || error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative">
          
          {/* Full Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 transition-all duration-200 text-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 transition-all duration-200 text-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-emerald-500 transition duration-200" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-11 py-3 text-sm focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/10 transition-all duration-200 text-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Redirect link */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 relative">
          Already have an account?{' '}
          <Link
            to="/login"
            onClick={clearError}
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
