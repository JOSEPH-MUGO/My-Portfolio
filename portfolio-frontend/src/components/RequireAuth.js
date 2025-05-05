
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';


export default function RequireAuth({ children }) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const location = useLocation();

  if (!isAdmin) {
    // If not logged in, redirect to /admin/login, preserving the attempted path
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If logged in, render the protected children
  return children;
}
