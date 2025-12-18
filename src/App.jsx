import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import InvestmentRequests from './pages/admin/InvestmentRequests';
import Payouts from './pages/admin/Payouts';
import InvestmentPlans from './pages/admin/InvestmentPlans';
import AppSettings from './pages/admin/AppSettings';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="requests" element={<InvestmentRequests />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="plans" element={<InvestmentPlans />} />
        <Route path="settings" element={<AppSettings />} />
      </Route>
    </Routes>
  );
}

export default App;