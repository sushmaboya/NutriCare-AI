import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken, getUser } from '../services/auth';

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="font-bold text-xl text-sky-600 dark:text-sky-400">HealthWise AI</Link>
        <nav className="flex items-center gap-3 text-sm md:text-base">
          <Link to="/" className="hover:text-sky-600 dark:hover:text-sky-300">Home</Link>
          {token && <Link to="/dashboard" className="hover:text-sky-600 dark:hover:text-sky-300">Dashboard</Link>}
          {token && <Link to="/profile" className="hover:text-sky-600 dark:hover:text-sky-300">Profile</Link>}
          {!token && <Link to="/login" className="hover:text-sky-600 dark:hover:text-sky-300">Login</Link>}
          {!token && <Link to="/register" className="hover:text-sky-600 dark:hover:text-sky-300">Register</Link>}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
          {token && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
