// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import AuthSuccess from './pages/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';

import Websites from './pages/Websites';
import WebsiteCreation from './createWebsite/websiteCreation';
import CategoryCreation from './createWebsite/categoryCreation';
import WebsiteDetails from './pages/WebsiteDetails';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/websites" element={
                <ProtectedRoute>
                  <Websites />
                </ProtectedRoute>
              } />

              <Route path="/create-website" element={
                <ProtectedRoute>
                  <WebsiteCreation />
                </ProtectedRoute>
              } />

              <Route path="/create-categories/:websiteId" element={
                <ProtectedRoute>
                  <CategoryCreation />
                </ProtectedRoute>
              } />

              <Route path="/website/:websiteId" element={
                <ProtectedRoute>
                  <WebsiteDetails />
                </ProtectedRoute>
              } />

            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
      
      {/* Add React Query DevTools for development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;