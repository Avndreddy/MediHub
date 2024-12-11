import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole'); // e.g., 'customer', 'doctor', 'pharmacy'

  // Check if the user's role is allowed to access this route
  const isAllowed = allowedRoles.includes(userRole);

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" />;
  }
  
  if (!isAllowed) {
    // Redirect to home page if the user role is not allowed
    return <Navigate to="/" />;
  }

  // Render the protected component if the user is logged in and has the right role
  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
