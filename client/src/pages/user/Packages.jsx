import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { tourData } from "../data/tours";
import TourCard from "../../components/TourCard";

const durationRanges = {
  
  "1 - 3 Days": [1, 3],
  "4 - 7 Days": [4, 7],
  "8 - 14 Days": [8, 14],
  "15+ Days": [15, 999], 
};

const Packages = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || ""; 

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // --- FIX: INCREASED DEFAULT MAX PRICE TO 50,000 ---
  const [maxPrice, setMaxPrice] = useState(50000); 
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDurations, setSelectedDurations] = useState([]);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  const handleDurationToggle = (duration) => {
    setSelectedDurations((prev) =>
      prev.includes(duration)
        ? prev.filter((d) => d !== duration) 
        : [...prev, duration] 
    );
  };

  const filteredTours = tourData.filter((tour) => {
    // 1. Price Check
    const matchesPrice = tour.price <= maxPrice;

    // 2. Search Check
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      tour.title.toLowerCase().includes(query) ||
      tour.location.toLowerCase().includes(query) ||
      (tour.type && tour.type.toLowerCase().includes(query)) ||
      (tour.price && tour.price.toString().includes(query)); 

    // 3. Duration Check
    const matchesDuration = 
      selectedDurations.length === 0 || 
      selectedDurations.some((rangeKey) => {
        const [min, max] = durationRanges[rangeKey];
        return tour.days >= min && tour.days <= max;
      });

    return matchesPrice && matchesSearch && matchesDuration;
  });

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">
      <div className="relative h-[40vh] bg-slate-900 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
          alt="Explore Packages"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="relative z-10 text-center px-4 mt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Explore All Packages
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto font-medium">
            Find the perfect destination for your next unforgettable journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:-mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <button
            className="lg:hidden w-full bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 flex justify-center items-center gap-2"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal size={18} /> Filters & Sorting
          </button>

          <aside className={`w-full lg:w-1/4 ${isMobileFilterOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl lg:shadow-sm border border-gray-100 dark:border-slate-800 sticky top-28 transition-colors">
              <div className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                <Filter size={20} className="text-primary-600 dark:text-primary-400" /> Filter Tours
              </div>

              {/* 1. Search Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Location, type, or price..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 text-slate-900 dark:text-white transition-colors text-sm font-medium placeholder-gray-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* 2. Price Range Slider */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Max Price: ₹{maxPrice.toLocaleString()}
                </label>
                {/* FIX: INCREASED MAX TO 50,000 AND STEP TO 500 */}
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-600 h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium">
                  <span>₹500</span>
                  <span>₹50,000+</span>
                </div>
              </div>

              {/* 3. Duration Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Duration</label>
                <div className="space-y-3">
                  {Object.keys(durationRanges).map((duration, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDurations.includes(duration)}
                        onChange={() => handleDurationToggle(duration)}
                        className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-gray-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {duration}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button 
                onClick={() => {
                  setMaxPrice(50000); // FIX: Reset to new max
                  setSearchQuery("");
                  setSelectedDurations([]);
                }}
                className="w-full bg-primary-50 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white font-bold py-3 rounded-xl transition-colors mt-4"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Right Column */}
          <main className="w-full lg:w-3/4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTours.length}</span> tours found
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sort by:</span>
                <div className="relative w-full sm:w-48">
                  <select className="w-full appearance-none bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600 font-medium text-sm cursor-pointer">
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 dark:text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                    No tours match your current filters.
                  </p>
                  <button 
                    onClick={() => { setMaxPrice(50000); setSearchQuery(""); setSelectedDurations([]); }}
                    className="mt-4 text-primary-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {filteredTours.length > 0 && (
              <div className="mt-10 flex justify-center">
                <button className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-600 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-bold py-3 px-8 rounded-xl transition-colors">
                  Load More Packages
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Packages;