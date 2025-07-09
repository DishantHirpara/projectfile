import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  // Check if user is logged in and is an admin
  if (!token || !user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 