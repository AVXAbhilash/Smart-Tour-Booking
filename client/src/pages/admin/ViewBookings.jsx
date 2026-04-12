import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { Loader, AlertCircle, Search, X, Calendar, MapPin, CreditCard, User, Mail, CheckCircle, XCircle, IndianRupee } from 'lucide-react';

const ViewBookings = () => {
  // --- STATES ---
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Details Modal States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- NEW: CUSTOM REFUND ACTION MODAL STATES ---
  const [refundPrompt, setRefundPrompt] = useState({ isOpen: false, bookingId: null });
  const [refundState, setRefundState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [refundMessage, setRefundMessage] = useState('');

  // --- FETCH BOOKINGS ON LOAD ---
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const { data } = await axios.get('http://localhost:5200/api/bookings', config);
        
        setBookings(data.bookings || []);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
        setIsLoading(false);
      }
    };
    
    fetchAllBookings();
  }, []);

  // --- HANDLERS ---
  const handleOpenDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBooking(null), 300);
  };

  // --- NEW: REFUND WORKFLOW HANDLERS ---
  const triggerRefundProcess = (id) => {
    setRefundState('idle');
    setRefundPrompt({ isOpen: true, bookingId: id });
  };

  const executeRefundProcess = async () => {
    setRefundState('loading');
    
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.patch(`http://localhost:5200/api/bookings/${refundPrompt.bookingId}/process-refund`, {}, config);
      
      // Update UI Data
      setBookings(bookings.map(b => b._id === refundPrompt.bookingId ? data.booking : b));
      setSelectedBooking(data.booking); 
      
      // Show Success UI
      setRefundState('success');
      setRefundMessage('Refund has been successfully logged as completed.');
    } catch (err) {
      // Show Error UI
      setRefundState('error');
      setRefundMessage(err.response?.data?.message || "An error occurred while processing the refund.");
    }
  };

  const closeRefundPrompt = () => {
    setRefundPrompt({ isOpen: false, bookingId: null });
    setTimeout(() => setRefundState('idle'), 300);
  };

  // --- SEARCH FILTER LOGIC ---
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    const bId = (booking.bookingId || booking._id).toLowerCase();
    const cName = `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.toLowerCase();
    const cEmail = (booking.user?.email || '').toLowerCase();
    const tTitle = (booking.tour?.title || '').toLowerCase();

    return (
      bId.includes(searchLower) ||
      cName.includes(searchLower) ||
      cEmail.includes(searchLower) ||
      tTitle.includes(searchLower)
    );
  });

  // --- HELPER: FORMAT STATUS BADGE ---
  const renderStatusBadge = (status, refundStatus) => {
    if (status === 'Cancelled') {
      if (refundStatus && refundStatus !== 'Not Eligible') {
        const isPending = refundStatus === 'Pending';
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
            isPending 
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            Refund {refundStatus}
          </span>
        );
      }
      return (
        <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
          Cancelled
        </span>
      );
    }
    
    if (status === 'Completed') {
      return (
        <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
          Completed
        </span>
      );
    }

    return (
      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
        Upcoming
      </span>
    );
  };

  return (
    <AdminLayout title="View Bookings">
      
      {/* --- TOP ACTIONS BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search bookings, users, or tours..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-sm"
          />
        </div>
        <div className="text-slate-400 font-bold text-sm bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 shadow-sm">
          Total Records: <span className="text-white">{filteredBookings.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* --- BOOKINGS TABLE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                <th className="px-6 py-4 font-black">Booking ID</th>
                <th className="px-6 py-4 font-black">Customer</th>
                <th className="px-6 py-4 font-black">Tour</th>
                <th className="px-6 py-4 font-black">Status</th>
                <th className="px-6 py-4 font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm font-medium text-slate-300">
              
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <Loader className="animate-spin mx-auto mb-2 text-primary-500" size={24} />
                    Loading system bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No bookings found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono font-bold">
                      #{booking.bookingId || booking._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-white font-bold flex flex-col">
                      {booking.user?.firstName} {booking.user?.lastName}
                      <span className="text-xs text-slate-500 font-normal">{booking.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {booking.tour?.title || 'Tour Removed'}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatusBadge(booking.status, booking.refundStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleOpenDetails(booking)}
                        className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-wider transition-colors bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BOOKING DETAILS MODAL (z-50) --- */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto transition-opacity">
          <div className="bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl border border-slate-700/50 my-8 overflow-hidden transform transition-all">
            
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/30">
              <div>
                <p className="text-primary-400 font-bold text-sm tracking-widest uppercase mb-1">Booking Details</p>
                <h3 className="text-2xl font-black text-white font-mono">#{selectedBooking.bookingId || selectedBooking._id}</h3>
              </div>
              <button 
                onClick={handleCloseDetails} 
                className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800/50">
                <div className="flex-1">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Current Status</p>
                  {renderStatusBadge(selectedBooking.status, selectedBooking.refundStatus)}
                </div>
                <div className="flex-1 border-l border-slate-800 pl-4">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Booked On</p>
                  <p className="text-white font-bold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h4 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                    <User size={18} className="text-primary-500" /> Customer Info
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-white font-bold mb-1">{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</p>
                    <p className="text-slate-400 text-sm flex items-center gap-2 mb-1">
                      <Mail size={14} /> {selectedBooking.user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                    <MapPin size={18} className="text-primary-500" /> Trip Details
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-white font-bold mb-2">{selectedBooking.tour?.title || 'Tour Deleted'}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-slate-400 flex items-center gap-2">
                        <Calendar size={14} /> Date:
                      </div>
                      <div className="text-white font-bold text-right">
                        {new Date(selectedBooking.selectedDate).toLocaleDateString()}
                      </div>
                      <div className="text-slate-400 flex items-center gap-2">
                        <User size={14} /> Guests:
                      </div>
                      <div className="text-white font-bold text-right">
                        {selectedBooking.guests} Person(s)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4">
                  <h4 className="text-lg font-black text-white flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-primary-500" /> Payment & Billing
                  </h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                        <CreditCard size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">
                          {selectedBooking.paymentDetails?.cardBrand || 'Card'} ending in {selectedBooking.paymentDetails?.last4 || '****'}
                        </p>
                        <p className="text-slate-500 text-xs uppercase tracking-wider">{selectedBooking.paymentDetails?.cardName || 'Cardholder'}</p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-right">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="text-3xl font-black text-emerald-400">₹{selectedBooking.totalAmount?.toLocaleString()}</p>
                    </div>

                  </div>

                  {/* --- INLINE REFUND ACTION BAR --- */}
                  {selectedBooking.refundStatus === 'Pending' && (
                    <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                          <AlertCircle size={20} />
                        </div>
                        <p className="text-sm font-bold text-orange-200">This refund is awaiting manual processing.</p>
                      </div>
                      <button 
                        onClick={() => triggerRefundProcess(selectedBooking._id)}
                        className="w-full md:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-900/20 active:scale-95 text-sm"
                      >
                        Process Refund
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-800/30 border-t border-slate-800 flex justify-end">
              <button 
                onClick={handleCloseDetails} 
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- NEW: CUSTOM REFUND ACTION OVERLAY (z-[60]) --- */}
      {refundPrompt.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-opacity">
          <div className="bg-slate-900 rounded-[2rem] w-full max-w-sm shadow-2xl border border-slate-700/50 p-8 text-center transform transition-all">
            
            {/* IDLE / CONFIRMATION STATE */}
            {refundState === 'idle' && (
              <>
                <div className="w-16 h-16 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                  <IndianRupee size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Process Refund?</h3>
                <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                  Have you manually returned the funds via your payment gateway or bank? This action will mark the record as completed.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={executeRefundProcess} 
                    className="w-full px-4 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-900/20"
                  >
                    Yes, Mark as Refunded
                  </button>
                  <button 
                    onClick={closeRefundPrompt} 
                    className="w-full px-4 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* LOADING STATE */}
            {refundState === 'loading' && (
              <div className="py-8">
                <Loader className="animate-spin mx-auto mb-4 text-orange-500" size={48} />
                <h3 className="text-xl font-black text-white">Updating System...</h3>
              </div>
            )}

            {/* SUCCESS STATE */}
            {refundState === 'success' && (
              <>
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Refund Completed</h3>
                <p className="text-slate-400 font-medium mb-8">{refundMessage}</p>
                <button 
                  onClick={closeRefundPrompt} 
                  className="w-full px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Done
                </button>
              </>
            )}

            {/* ERROR STATE */}
            {refundState === 'error' && (
              <>
                <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <XCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Action Failed</h3>
                <p className="text-slate-400 font-medium mb-8">{refundMessage}</p>
                <button 
                  onClick={closeRefundPrompt} 
                  className="w-full px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                >
                  Close
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default ViewBookings;