import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { Camera, ShieldCheck, Mail, Lock, User, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const AdminAccount = () => {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // We use firstName and lastName here because that is how your Mongoose User schema is structured!
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("userProfileImage") || 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=38bdf8'
  );

  const fileInputRef = useRef(null);

  // --- FETCH ADMIN DATA ON LOAD ---
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const { data } = await axios.get('http://localhost:5200/api/users/profile', config);
        
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        });

        if (data.profileImage) {
          setProfileImage(data.profileImage);
        }
        
        setLoading(false);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
        setLoading(false);
      }
    };
    
    fetchAdminProfile();
  }, []);

  // --- HANDLE IMAGE UPLOAD ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setMessage({ type: 'info', text: 'Uploading image...' });
      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      // 1. Upload the physical file
      const { data: imagePath } = await axios.post('http://localhost:5200/api/upload', formData, config);
      const fullImageUrl = `http://localhost:5200${imagePath}`;

      setProfileImage(fullImageUrl);

      // 2. Save the new URL to the database profile instantly
      const profileConfig = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5200/api/users/profile', { profileImage: fullImageUrl }, profileConfig);

      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });

      // Update local storage so the Navbar avatar updates instantly
      localStorage.setItem("userProfileImage", fullImageUrl);
      window.dispatchEvent(new Event("profileImageUpdated"));

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    }
  };

  // --- HANDLE FORM SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Update Profile Info
      await axios.put('http://localhost:5200/api/users/profile', profileData, config);

      // 2. Update Password (Only if they typed a new one)
      if (passwords.newPassword) {
        if (!passwords.currentPassword) {
          setMessage({ type: 'error', text: 'Current password is required to set a new password.' });
          setSaving(false);
          return;
        }
        await axios.put('http://localhost:5200/api/users/password', passwords, config);
        // Clear passwords from UI after success
        setPasswords({ currentPassword: '', newPassword: '' }); 
      }

      setMessage({ type: 'success', text: 'Account updated successfully!' });

      // Update user info in local storage so the Navbar name updates
      const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
      userInfo.firstName = profileData.firstName;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update account.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="My Profile">
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-primary-500" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Profile">
      <div className="max-w-4xl">
        
        {/* --- NOTIFICATION BANNER --- */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold ${
            message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
            message.type === 'info' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
            'bg-green-500/10 text-green-400 border border-green-500/20'
          }`}>
            {message.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* --- PROFILE HEADER CARD --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full pointer-events-none"></div>

          {/* Avatar & Hidden File Input */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <img 
              src={profileImage} 
              alt="Admin Avatar" 
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 shadow-2xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white mb-1" size={24} />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
            </div>
            {/* The hidden input that actually handles the file selection */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>

          <div className="text-center md:text-left z-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-medium mb-4">
              <Mail size={16} /> {profileData.email}
            </div>
            <span className="inline-flex items-center gap-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
              <ShieldCheck size={16} /> Full System Access
            </span>
          </div>
        </div>

        {/* --- EDIT PROFILE FORM --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <User className="text-primary-400" size={20} /> Update Credentials
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">First Name</label>
                <input 
                  type="text" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                  required
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50" 
                />
              </div>

              {/* Last Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Last Name</label>
                <input 
                  type="text" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                  required
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50" 
                />
              </div>

              {/* Email Input (Spans full width on md screens) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  required
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50 mt-6">
              <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                <Lock className="text-primary-400" size={20} /> Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    placeholder="••••••••" 
                    disabled={saving}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    placeholder="Leave blank to keep current" 
                    disabled={saving}
                    className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all disabled:opacity-50" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 disabled:opacity-70"
              >
                {saving && <Loader size={18} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAccount;