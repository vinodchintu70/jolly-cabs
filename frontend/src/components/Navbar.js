import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBiking, FaBars, FaTimes, FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/bikes', label: 'Bikes' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold gradient-text">
          <FaBiking className="text-indigo-400 text-2xl" /> Jolly Cabs
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors ${pathname === l.to ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 glass px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-white transition-colors">
                <FaUserCircle className="text-indigo-400" /> {user.name}
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-12 w-48 glass border border-white/10 rounded-xl overflow-hidden shadow-xl">
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-purple-400 hover:bg-white/5 transition-colors">
                      🛡️ Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                    <FaUser /> My Profile
                  </Link>
                  <Link to="/my-bookings" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                    📋 My Bookings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors border-t border-white/10">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline py-2 px-4 text-sm">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-sm">Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm ${pathname === l.to ? 'text-indigo-400' : 'text-slate-300'}`}>{l.label}</Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-slate-300 text-sm">My Profile</Link>
              <Link to="/my-bookings" onClick={() => setOpen(false)} className="text-slate-300 text-sm">My Bookings</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setOpen(false)} className="text-purple-400 text-sm">Admin Panel</Link>}
              <button onClick={handleLogout} className="text-left text-red-400 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline text-center text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center text-sm">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
