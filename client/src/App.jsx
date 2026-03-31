import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// User Pages
import Home from "./pages/user/Home";
import Packages from "./pages/user/Packages";
import TourDetails from "./pages/user/TourDetails";
import BookingHistory from "./pages/user/BookingHistory";
import Profile from "./pages/user/Profile";
import FAQ from "./pages/user/FAQ"; 

// Legals

import PrivacyPolicy from "./pages/legal/PrivacyPolicy"
import TermsOfService from "./pages/legal/TermsOfService"
import CancellationPolicy from "./pages/legal/CancellationPolicy"

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTours from "./pages/admin/ManageTours";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageReviews from "./pages/admin/ManageReviews";
import ViewBookings from "./pages/admin/ViewBookings";
import AdminAccount from "./pages/admin/AdminAccount";

// 404 Page
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  // --- 1. IDENTIFY THE CURRENT ROUTE ---
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register";
  
  // FIX: Here is the missing variable! This tells the app if we are on the Home page.
  const isHomePage = location.pathname === "/";

  // --- 2. LAYOUT LOGIC ---
  // Show Navbar everywhere EXCEPT Admin and Auth (Login/Register) screens
  const showNavbar = !isAdminRoute && !isAuthRoute;
  
  // Show the Global Footer everywhere EXCEPT Admin, Auth, AND the Home page 
  // (Because we imported the Footer directly into the bottom of Home.jsx!)
  const showGlobalFooter = !isAdminRoute && !isAuthRoute && !isHomePage;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">

      <ScrollToTop />
      
      {/* GLOBAL NAVBAR */}
      {showNavbar && <Navbar />}

      <main className={`flex-grow ${showNavbar ? "pt-16 md:pt-20" : ""}`}>
        <Routes>
          {/* ----- PUBLIC ROUTES ----- */}
          <Route path="/" element={<Home />} />
          
          {/* Automatically redirect any old "/home" links to "/" to keep URLs clean */}
          <Route path="/home" element={<Navigate to="/" replace />} /> 
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />

          {/* ----- PROTECTED USER ROUTES (Must be logged in to access) ----- */}
          <Route 
            path="/tours" 
            element={<ProtectedRoute><Packages /></ProtectedRoute>} 
          />
          <Route 
            path="/tours/:id" 
            element={<ProtectedRoute><TourDetails /></ProtectedRoute>} 
          />
          <Route 
            path="/my-bookings" 
            element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />

          {/* ----- ADMIN ROUTES ----- */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tours" element={<ManageTours />} />
          <Route path="/admin/bookings" element={<ViewBookings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/reviews" element={<ManageReviews />} />
          <Route path="/admin/account" element={<AdminAccount />} />

          <Route path="/legal/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/legal/TermsOfService" element={<TermsOfService />} />
          <Route path="/legal/CancellationPolicy" element={<CancellationPolicy />} />

          {/* ----- 404 CATCH-ALL ----- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* GLOBAL FOOTER */}
      {showGlobalFooter && <Footer />}
      
    </div>
  );
}

export default App;