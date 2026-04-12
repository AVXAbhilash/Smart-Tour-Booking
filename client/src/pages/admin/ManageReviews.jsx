import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Star, Trash2, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH REVIEWS ON LOAD ---
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const { data } = await axios.get('http://localhost:5200/api/reviews', config);
        
        // --- THE FIX IS HERE ---
        // If your backend wraps the array in 'data.reviews', use that. 
        // Otherwise, just use 'data' if it's already an array!
        setReviews(data.reviews || data); 
        
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reviews");
        setIsLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  // --- HANDLE DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`http://localhost:5200/api/reviews/${id}`, config);
      
      // Instantly remove the deleted review from the UI
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Customer Reviews">
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader className="animate-spin mb-4 text-primary-500" size={40} />
          <p className="font-bold tracking-wide">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center shadow-lg">
          <h3 className="text-xl font-bold text-white mb-2">No Reviews Yet</h3>
          <p className="text-slate-500">Your customers haven't left any reviews across the platform.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg relative group transition-all hover:border-slate-700 hover:shadow-xl">
              
              <button 
                onClick={() => handleDelete(review._id)}
                disabled={isDeleting}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete Review"
              >
                <Trash2 size={16} />
              </button>

              {/* Dynamic Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-700"} 
                  />
                ))}
              </div>

              <p className="text-slate-300 font-medium mb-4 leading-relaxed line-clamp-4">
                "{review.reviewText}"
              </p>

              <div className="text-sm font-bold text-slate-500 mt-auto pt-4 border-t border-slate-800/50">
                <span className="text-white">
                  {review.user?.firstName} {review.user?.lastName}
                </span> 
                <span className="mx-2">•</span> 
                <span className="text-primary-400 truncate block sm:inline mt-1 sm:mt-0">
                  {review.tour?.title || 'Unknown Tour'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageReviews;