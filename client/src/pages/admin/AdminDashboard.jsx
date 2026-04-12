import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Map,
  Users,
  Star,
  CalendarCheck,
  Settings,
  LogOut,
  TrendingUp,
  IndianRupee,
  Activity,
  Globe,
  Loader,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    activeBookings: 0,
    totalUsers: 0,
    activeTours: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);

  // Get current admin details
  // Get current admin details
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  
  // Use database image, or fallback to generic avatar
  const userProfileImage = localStorage.getItem("userProfileImage") || `https://ui-avatars.com/api/?name=${userInfo.firstName || 'Admin'}&background=0f172a&color=38bdf8`;

  // --- FETCH DASHBOARD DATA ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch everything simultaneously for maximum speed
        const [bookingsRes, usersRes, toursRes] = await Promise.all([
          axios.get("http://localhost:5200/api/bookings", config),
          axios.get("http://localhost:5200/api/users", config),
          axios.get("http://localhost:5200/api/tours", config) // Assumes public route doesn't need token, but safe to pass
        ]);

        const allBookings = bookingsRes.data.bookings || [];
        const allUsers = usersRes.data || [];
        const allTours = toursRes.data || [];

        // Calculate Stats
        // 1. Filter out cancelled bookings for active counts and revenue
        const activeBookingsList = allBookings.filter(b => b.status !== "Cancelled");
        
        // 2. Sum up total revenue
        const totalRevenue = activeBookingsList.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

        setStats({
          revenue: totalRevenue,
          activeBookings: activeBookingsList.length,
          totalUsers: allUsers.length,
          activeTours: allTours.length
        });

        // 3. Grab the first 5 bookings for the recent activity table
        setRecentBookings(allBookings.slice(0, 5));
        
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userProfileImage");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Tours", path: "/admin/tours", icon: Map },
    { name: "View Bookings", path: "/admin/bookings", icon: CalendarCheck },
    { name: "Manage Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Account Settings", path: "/admin/account", icon: Settings },
  ];

  // Helper to get initials for the avatar circle
  const getInitials = (firstName = "", lastName = "") => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex overflow-hidden">
      {/* --- PREMIUM DARK SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-20">
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

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-primary-500/10 text-primary-400 border border-primary-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              {item.name}
            </Link>
          ))}
        </nav>

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
            <h1 className="text-2xl font-black text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Welcome back, {userInfo.firstName || "Admin"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 py-2 px-4 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                System Online
              </span>
            </div>
            <img
              src={userProfileImage}
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover"
            />
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader className="animate-spin text-primary-500 mb-4" size={40} />
              <p className="text-slate-500 font-bold">Crunching system data...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20">
                      <IndianRupee className="text-primary-400" size={24} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                      <TrendingUp size={12} /> Live
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium text-sm mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-white">₹{stats.revenue.toLocaleString()}</h3>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                      <CalendarCheck className="text-blue-400" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-sm mb-1">Active Bookings</p>
                  <h3 className="text-3xl font-black text-white">{stats.activeBookings.toLocaleString()}</h3>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                      <Users className="text-purple-400" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-sm mb-1">Total Users</p>
                  <h3 className="text-3xl font-black text-white">{stats.totalUsers.toLocaleString()}</h3>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                      <Activity className="text-orange-400" size={24} />
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium text-sm mb-1">Active Tours</p>
                  <h3 className="text-3xl font-black text-white">{stats.activeTours.toLocaleString()}</h3>
                </div>
              </div>

              {/* Recent Activity Table Area */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-white">Recent Bookings</h3>
                  <Link to="/admin/bookings" className="text-sm font-bold text-primary-400 hover:text-primary-300">
                    View All
                  </Link>
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
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                            No recent bookings found.
                          </td>
                        </tr>
                      ) : (
                        recentBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                {getInitials(booking.user?.firstName, booking.user?.lastName)}
                              </div>
                              <span className="text-white font-bold">
                                {booking.user?.firstName} {booking.user?.lastName}
                              </span>
                            </td>
                            <td className="px-6 py-4">{booking.tour?.title || "Tour Removed"}</td>
                            <td className="px-6 py-4 text-slate-500">
                              {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-6 py-4 font-bold text-white">₹{booking.totalAmount?.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              {booking.status === 'Cancelled' ? (
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                                  Cancelled
                                </span>
                              ) : booking.status === 'Completed' ? (
                                <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                                  Completed
                                </span>
                              ) : (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                                  Confirmed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;