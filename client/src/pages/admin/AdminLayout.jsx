import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Star, CalendarCheck, Settings, LogOut, Globe } from 'lucide-react';

const AdminLayout = ({ children, title = "Admin Panel" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Tours', path: '/admin/tours', icon: Map },
    { name: 'View Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'My Profile', path: '/admin/account', icon: Settings }, // Renamed to My Profile
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary-500/10 p-2 rounded-xl border border-primary-500/20">
              <Globe className="text-primary-400" size={24} />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Booking<span className="text-primary-400">Buddy</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:border-red-500/20 transition-all">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 py-2 px-4 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Online</span>
            </div>
            
            {/* CLICKABLE PROFILE AVATAR */}
            <Link 
              to="/admin/account" 
              className="relative rounded-full ring-2 ring-transparent hover:ring-primary-500 transition-all duration-300 hover:scale-105 focus:outline-none shadow-lg"
              title="View Profile"
            >
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150" 
                alt="Admin Profile" 
                className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" 
              />
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;