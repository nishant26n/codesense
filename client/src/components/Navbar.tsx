import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-700/50 transition-shadow">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Code<span className="text-brand-400">Sense</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`btn-ghost text-sm ${location.pathname === '/dashboard' ? 'text-brand-400 bg-brand-500/10' : ''}`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 font-medium hidden sm:block">{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-ghost text-sm text-gray-500">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm ml-1">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
