import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
