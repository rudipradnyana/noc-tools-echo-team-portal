import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';

export default function App() {
  const { user, isAuthenticated } = useAuth();

  // If user is not logged in, render the Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Role-based branching: Admin vs Employee
  if (user?.accessLevel === 'admin') {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}
