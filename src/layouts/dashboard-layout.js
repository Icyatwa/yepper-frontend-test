// dashboard-layout.js
import * as React from 'react';
import { useAuth } from "@clerk/clerk-react";
import { Outlet, Navigate } from "react-router-dom";
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardLayout() {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingSpinner />;
  
  if (!userId) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}