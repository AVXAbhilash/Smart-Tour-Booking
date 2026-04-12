import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Shield, ShieldAlert, Trash2, Plus, X, Loader, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ManageUsers = () => {
  // --- DATABASE STATES ---
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Get current logged-in admin's ID to prevent self-deletion
  const currentUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currentUserId = currentUserInfo._id;

  // --- FETCH USERS ON LOAD ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const { data } = await axios.get('http://localhost:5200/api/users', config);
        setUsers(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users");
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- HANDLE DELETE ---
  const handleDeleteUser = async (id, role) => {
    // Safety checks
    if (id === currentUserId) {
      alert("You cannot delete your own admin account!");
      return;
    }
    const confirmMessage = role === 'admin' 
      ? "WARNING: You are about to delete an Admin account. Are you sure?" 
      : "Are you sure you want to delete this user?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:5200/api/users/${id}`, config);
      
      // Remove from UI
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    }
  };

  // --- HANDLE ADD USER ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const { data } = await axios.post('http://localhost:5200/api/users', formData, config);
      
      // Add the new user to the UI immediately
      setUsers([...users, data]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter users for the search bar
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Users">
      
      {/* --- TOP ACTIONS BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* --- USERS TABLE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">User</th>
                <th className="px-6 py-4 font-black">Email</th>
                <th className="px-6 py-4 font-black">Role</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    <Loader className="animate-spin mx-auto mb-2 text-primary-500" size={24} />
                    Loading system users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      <img 
                        src={user.profileImage || 'https://via.placeholder.com/40'} 
                        alt="avatar" 
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                          <ShieldAlert size={12} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                          <Shield size={12} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Hide the delete button if this is the currently logged-in admin */}
                      {user._id !== currentUserId ? (
                        <button 
                          onClick={() => handleDeleteUser(user._id, user.role)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider px-2">You</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD USER MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-700/50 my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-black text-white">Add New User</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                disabled={isProcessing} 
                className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">First Name</label>
                  <input type="text" required disabled={isProcessing} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Name</label>
                  <input type="text" required disabled={isProcessing} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email Address</label>
                <input type="email" required disabled={isProcessing} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Password</label>
                <input type="password" required disabled={isProcessing} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Account Role</label>
                <select disabled={isProcessing} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="user">Standard User</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" disabled={isProcessing} onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 text-slate-300 font-bold hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-70 flex items-center gap-2">
                  {isProcessing ? <Loader size={16} className="animate-spin" /> : null}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageUsers;