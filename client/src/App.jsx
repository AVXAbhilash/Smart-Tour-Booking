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

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import CancellationPolicy from "./pages/legal/CancellationPolicy";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

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

  // --- 1. ROUTE IDENTIFICATION LOGIC ---
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  
  // List of auth-related paths where we hide global navigation
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthRoute = authPaths.some(path => location.pathname.startsWith(path));

  // --- 2. LAYOUT VISIBILITY LOGIC ---
  // Hide Navbar/Footer on Admin and Auth screens
  const showNavbar = !isAdminRoute && !isAuthRoute;
  
  // Hide Footer on Admin, Auth, and Home (since Home often has its own specialized footer)
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
          <Route path="/home" element={<Navigate to="/" replace />} /> 
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route path="/faq" element={<FAQ />} />

          {/* ----- PROTECTED USER ROUTES ----- */}
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

          {/* ----- ADMIN ROUTES (Should ideally use an AdminRoute wrapper) ----- */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/tours" 
            element={<ProtectedRoute adminOnly={true}><ManageTours /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/bookings" 
            element={<ProtectedRoute adminOnly={true}><ViewBookings /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/users" 
            element={<ProtectedRoute adminOnly={true}><ManageUsers /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/reviews" 
            element={<ProtectedRoute adminOnly={true}><ManageReviews /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/account" 
            element={<ProtectedRoute adminOnly={true}><AdminAccount /></ProtectedRoute>} 
          />

          {/* ----- LEGAL ROUTES ----- */}
          <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms-of-service" element={<TermsOfService />} />
          <Route path="/legal/cancellation-policy" element={<CancellationPolicy />} />

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