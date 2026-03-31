// src/components/TourCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star } from 'lucide-react';

const TourCard = ({ tour }) => {
  return (
    <Link
      to={`/tours/${tour.id}`}
      className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-primary-900/20 transition-all duration-500 border border-gray-100 dark:border-slate-800 flex flex-col h-full hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden m-3 rounded-[2rem]">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Floating Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-black flex items-center gap-1.5 shadow-lg dark:text-white">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />{" "}
          {tour.rating}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 font-bold mb-3">
          <MapPin size={16} /> {tour.location}
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {tour.title}
        </h3>

        <div className="mt-auto flex justify-between items-end border-t border-gray-100 dark:border-slate-800 pt-5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Duration
            </span>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
              <Clock size={18} className="text-primary-500 dark:text-primary-400" /> {tour.days} Days
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">
              Starting from
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{tour.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;