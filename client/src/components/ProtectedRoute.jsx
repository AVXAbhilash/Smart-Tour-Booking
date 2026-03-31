import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // We will check localStorage for a 'token'. 
  // (We will generate this real token with our Node/Express backend soon!)
  const isAuthenticated = localStorage.getItem('userToken');
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the login page, but remember where they were trying to go!
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are logged in, let them access the page
  return children;
};

export default ProtectedRoute;