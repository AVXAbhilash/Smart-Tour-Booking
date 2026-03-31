import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, Search, Moon, Sun, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // --- SYNC NAVBAR IMAGE STATE ---
  const [navProfileImage, setNavProfileImage] = useState(() => {
    return localStorage.getItem('userProfileImage') || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150";
  });

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('userToken');
  const isActive = (path) => location.pathname === path;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || false;
  });

  // Listener to update Navbar image when changed on Profile page
  useEffect(() => {
    const handleProfileUpdate = () => {
      setNavProfileImage(localStorage.getItem('userProfileImage') || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150");
    };

    window.addEventListener('profileImageUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileImageUpdated', handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setIsProfileOpen(false);
    setIsOpen(false);
    localStorage.removeItem('userToken'); 
    localStorage.removeItem('userProfileImage'); // Clear image on logout
    navigate('/'); 
  };

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-slate-800 py-2' 
        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors shadow-md shadow-primary-200 dark:shadow-primary-900/50">
              <Globe className="text-white" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Booking<span className="text-primary-600 dark:text-primary-400">Buddy</span>
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400 dark:text-slate-400 group-focus-within:text-primary-600 transition-colors" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..." 
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100/80 dark:bg-slate-800/80 border border-transparent rounded-full text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary-200 transition-all text-slate-900 dark:text-white"
              />
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
            <Link to="/" className={`font-bold transition-colors ${isActive('/') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Home</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/tours" className={`font-bold transition-colors ${isActive('/tours') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Packages</Link>
                <Link to="/my-bookings" className={`font-bold transition-colors ${isActive('/my-bookings') ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>My Bookings</Link>
              </>
            )}
            
            <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>

            <button onClick={toggleDarkMode} className="p-2.5 bg-gray-100 dark:bg-slate-800 text-slate-600 hover:text-primary-600 rounded-full transition-all">
              {isDarkMode ? <Sun size={20} className="text-primary-400" /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center focus:outline-none ring-2 ring-transparent hover:ring-primary-500 rounded-full transition-all">
                  {/* FIX: Syncs with Nav State Image */}
                  <img src={navProfileImage} alt="User Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md" />
                </button>
                
                <div className={`absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-all origin-top-right ${isProfileOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">John Doe</p>
                    <p className="text-xs font-medium text-slate-500 truncate">john@example.com</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
                      <User size={16} /> My Account
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-slate-900 dark:bg-primary-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-slate-800 dark:hover:bg-primary-500 transition-colors shadow-lg">
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 text-slate-600 hover:text-primary-600 transition-colors">
              {isDarkMode ? <Sun size={22} className="text-primary-400" /> : <Moon size={22} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-primary-600 p-2 bg-gray-100 rounded-full transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-white dark:bg-slate-900 border-t border-gray-100 shadow-2xl transition-all duration-300 origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-6 flex flex-col">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-primary-50 rounded-2xl">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/tours" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-primary-50 rounded-2xl">All Packages</Link>
              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-primary-50 rounded-2xl">My Bookings</Link>
              <div className="h-px bg-gray-200 my-4"></div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold">
                <LogOut size={18} /> Log Out
              </button>
            </>
          ) : (
            <button onClick={() => { setIsOpen(false); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mt-2 bg-primary-600 text-white rounded-2xl font-bold">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;