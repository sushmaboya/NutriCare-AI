import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Activity, 
  PlusCircle, 
  MessageSquare, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Heart
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Health Profile', path: '/profile', icon: User },
    { name: 'Nutrition Calculator', path: '/calculator', icon: PlusCircle },
    { name: 'AI Recommendation Assistant', path: '/assistant', icon: MessageSquare },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
            <Heart size={20} className="fill-current animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
            NutriCare AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            aria-label="Open Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out shadow-lg md:shadow-none md:relative md:transform-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Heart size={22} className="fill-current animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              NutriCare AI
            </span>
          </div>
          <button 
            className="md:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info Widget */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user?.name || 'User Profile'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email || 'health@nutricare.ai'}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all group duration-200
                  ${isActive 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 dark:shadow-emerald-500/10' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }
                `}
              >
                <Icon size={18} className={`transition group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Light/Dark Toggle for Desktop */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="hidden md:flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className="w-8 h-4 rounded-full bg-slate-200 dark:bg-slate-700 relative p-0.5 transition-colors">
              <div className={`w-3.5 h-3 rounded-full bg-white dark:bg-slate-900 shadow-sm transform transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogoutClick}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition group"
          >
            <LogOut size={18} className="text-red-500 transition group-hover:translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition duration-300"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
