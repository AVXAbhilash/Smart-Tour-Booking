import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Search, Image as ImageIcon, AlertTriangle, Loader } from 'lucide-react';

const ManageTours = () => {
  // --- DATABASE STATES ---
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    _id: '',
    tourId: '',
    title: '',
    location: '',
    type: 'Mountain Treks',
    price: '',
    days: '',
    description: '',
    includedItems: '',
    image: ''
  });

  // --- FETCH TOURS ON LOAD ---
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('http://localhost:5200/api/tours');
        setTours(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ title: '', location: '', type: 'Mountain Treks', price: '', days: '', description: '', includedItems: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setModalMode('edit');
    setFormData(tour);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (tour) => {
    setTourToDelete(tour);
    setIsDeleteModalOpen(true);
  };

  // --- API CALLS ---
  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Assumes your backend delete route expects the MongoDB _id
      await axios.delete(`http://localhost:5200/api/tours/${tourToDelete._id}`, config);
      
      setTours(tours.filter(t => t._id !== tourToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete tour.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (modalMode === 'add') {
        // Remove _id from payload so MongoDB can auto-generate it
        const payload = { ...formData };
        delete payload._id; 
        delete payload.tourId; 

        const { data } = await axios.post('http://localhost:5200/api/tours', payload, config);
        setTours([...tours, data]); // Add the newly created tour to the UI

      } else {
        // EDIT MODE: We set up your backend to use tourId (e.g. TR-101) for PUT requests!
        const { data } = await axios.put(`http://localhost:5200/api/tours/${formData.tourId}`, formData, config);
        
        // Your backend returns { message: "...", tour: updatedTour }
        const updatedTour = data.tour;
        setTours(tours.map(t => (t._id === updatedTour._id ? updatedTour : t)));
      }
      
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save tour details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tour.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Tours">
      
      {/* --- TOP ACTIONS BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search tours..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-sm"
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} /> Add New Tour
        </button>
      </div>

      {/* --- TOURS TABLE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">Tour Details</th>
                <th className="px-6 py-4 font-black">Location</th>
                <th className="px-6 py-4 font-black">Type & Days</th>
                <th className="px-6 py-4 font-black">Price</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Loader className="animate-spin mx-auto mb-2 text-primary-500" size={24} />
                    Loading system tours...
                  </td>
                </tr>
              ) : filteredTours.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No tours found matching your search.</td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={tour.image || 'https://via.placeholder.com/150'} alt={tour.title} className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
                      <div>
                        <p className="font-bold text-white text-base">{tour.title}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{tour.tourId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tour.location}</td>
                    <td className="px-6 py-4">
                      <span className="block text-white font-bold">{tour.type}</span>
                      <span className="text-xs text-slate-500">{tour.days} Days</span>
                    </td>
                    <td className="px-6 py-4 font-black text-white">₹{Number(tour.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(tour)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleConfirmDelete(tour)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl border border-slate-700/50 my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="text-xl font-black text-white">
                {modalMode === 'add' ? 'Add New Tour' : 'Edit Tour'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} disabled={isProcessing} className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tour Title</label>
                  <input type="text" required disabled={isProcessing} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Location</label>
                  <input type="text" required disabled={isProcessing} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Category / Type</label>
                  <select value={formData.type} disabled={isProcessing} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50">
                    <option>Mountain Treks</option>
                    <option>Beach Holidays</option>
                    <option>City Explorers</option>
                    <option>Adventure</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Price (₹)</label>
                    <input type="number" required disabled={isProcessing} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Days</label>
                    <input type="number" required disabled={isProcessing} value={formData.days} onChange={(e) => setFormData({...formData, days: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Image URL</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-3 top-3.5 text-slate-500" />
                  <input type="url" disabled={isProcessing} value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Included Items (Comma separated)</label>
                <input type="text" disabled={isProcessing} placeholder="e.g., Hotel, Breakfast, Guide" value={formData.includedItems} onChange={(e) => setFormData({...formData, includedItems: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none placeholder-slate-600 disabled:opacity-50" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea rows="3" disabled={isProcessing} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder-slate-600 disabled:opacity-50"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" disabled={isProcessing} onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-300 font-bold hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-70 flex items-center gap-2">
                  {isProcessing ? <Loader size={16} className="animate-spin" /> : null}
                  {modalMode === 'add' ? 'Create Tour' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl border border-slate-700/50 overflow-hidden transform transition-all p-6 text-center">
            <div className="w-16 h-16 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Delete Tour?</h3>
            <p className="text-slate-400 font-medium mb-6">
              Are you sure you want to delete <strong className="text-white">{tourToDelete?.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button disabled={isProcessing} onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button disabled={isProcessing} onClick={handleDelete} className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-70">
                {isProcessing ? <Loader size={16} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ManageTours;