import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import axios from 'axios'; // <-- 1. Import axios

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  
  // 2. Add loading and error states
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Check if passwords match before bothering the server
    if(formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);

    // 3. Clever fix: Split the single "name" input into firstName and lastName for your backend
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0];
    // If they only type one word, default their last name to an empty string or a placeholder
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User'; 

    try {
      // 4. Send the request to your Express backend
      const response = await axios.post('http://localhost:5200/api/users/register', {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password
        // Note: phone and profileImage are optional in your model, so we don't need them here!
      });

      const userData = response.data;

      // 5. Save the token and user info so they are instantly logged in
      localStorage.setItem('userToken', userData.token);
      localStorage.setItem('userInfo', JSON.stringify({
        _id: userData._id,
        firstName: userData.firstName,
        email: userData.email,
        role: userData.role
      }));

      // 6. Redirect them to the home page!
      navigate('/');

    } catch (err) {
      // Grab the exact error message from your backend (e.g., "User already exists")
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" 
          alt="Mountain Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10 my-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30">
              <Globe className="text-white" size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              Briskode<span className="text-primary-400">Tours</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Join the Journey</h2>
          <p className="text-primary-100/70">Create an account to book your next adventure.</p>
        </div>

        {/* 7. Display the backend error message if registration fails */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-primary-300" />
              </div>
              <input 
                type="text" 
                name="name"
                required
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-primary-300" />
              </div>
              <input 
                type="email" 
                name="email"
                required
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-primary-300" />
              </div>
              <input 
                type="password" 
                name="password"
                required
                minLength="6" // Let's enforce your backend's 6-character rule on the frontend too!
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-100 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-primary-300" />
              </div>
              <input 
                type="password" 
                name="confirmPassword"
                required
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-primary-200/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-primary-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'} text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 mt-6`}
          >
            {loading ? 'Creating Account...' : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-primary-100/70 mt-8 text-sm">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;