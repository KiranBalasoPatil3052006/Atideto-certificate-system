import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, FileText, LayoutDashboard, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/preview', label: 'Certificate Generator', icon: Award },
    { path: '/offer-letter', label: 'Offer Letter', icon: FileText },
    { path: '/verify', label: 'Verify Portal', icon: ShieldCheck },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/assets/atideto-logo.png" alt="ATIDETO" className="h-8 object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-none group-hover:text-[#2F2FE4] transition-colors">
                ATIDETO
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                Certificate System
              </span>
            </div>
          </Link>
          <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2F2FE4]/10 text-[#2F2FE4] border border-[#2F2FE4]/20">
            v2.0 React
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2F2FE4] text-white shadow-md shadow-[#2F2FE4]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: User / Auth Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 pl-2">
                <div className="w-7 h-7 rounded-full bg-[#2F2FE4]/10 text-[#2F2FE4] flex items-center justify-center font-bold text-xs">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-slate-500 leading-none">{user?.email || 'admin@atideto.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-xs font-semibold transition-all"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
