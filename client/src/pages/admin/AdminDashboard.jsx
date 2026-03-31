import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Users,
  Star,
  CalendarCheck,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Activity,
  Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Tours', path: '/admin/tours', icon: Map },
    { name: 'View Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Account Settings', path: '/admin/account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex overflow-hidden">
      
      {/* --- PREMIUM DARK SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
        
        {/* Admin Brand */}
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500/10 p-2 rounded-xl border border-primary-500/20">
              <Globe className="text-primary-400" size={24} />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Booking<span className="text-primary-400">Buddy</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
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

        {/* Bottom Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-400 font-bold rounded-xl hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-20 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Dashboard Overview</h1>
            <p className="text-sm font-medium text-slate-500">Welcome back, Super Admin</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 py-2 px-4 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">System Online</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150" 
              alt="Admin" 
              className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            />
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20">
                  <DollarSign className="text-primary-400" size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> +12.5%
                </span>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-white">$45,231.89</h3>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                  <CalendarCheck className="text-blue-400" size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} /> +5.2%
                </span>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-1">Active Bookings</p>
              <h3 className="text-3xl font-black text-white">1,204</h3>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                  <Users className="text-purple-400" size={24} />
                </div>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-1">Total Users</p>
              <h3 className="text-3xl font-black text-white">8,439</h3>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Activity className="text-orange-400" size={24} />
                </div>
              </div>
              <p className="text-slate-400 font-medium text-sm mb-1">Active Tours</p>
              <h3 className="text-3xl font-black text-white">42</h3>
            </div>
          </div>

          {/* Recent Activity Table Area */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">Recent Bookings</h3>
              <button className="text-sm font-bold text-primary-400 hover:text-primary-300">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                    <th className="px-6 py-4 font-black">Customer</th>
                    <th className="px-6 py-4 font-black">Tour Package</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black">Amount</th>
                    <th className="px-6 py-4 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">AJ</div>
                      Alex Johnson
                    </td>
                    <td className="px-6 py-4">Swiss Alps Explorer</td>
                    <td className="px-6 py-4 text-slate-500">Oct 12, 2023</td>
                    <td className="px-6 py-4 font-bold text-white">$1,299</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold">Confirmed</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">MR</div>
                      Maria Rodriguez
                    </td>
                    <td className="px-6 py-4">Bali Beach Retreat</td>
                    <td className="px-6 py-4 text-slate-500">Oct 11, 2023</td>
                    <td className="px-6 py-4 font-bold text-white">$849</td>
                    <td className="px-6 py-4">
                      <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-md text-xs font-bold">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;