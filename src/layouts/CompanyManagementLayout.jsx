// layouts/CompanyManagementLayout.jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ManagementNavbar from '../components/ManagementNavbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const CompanyManagementLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.success && data.user?.role === 'admin');
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/company/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ManagementNavbar />
      <div className="pt-16"> {/* Offset for fixed navbar */}
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyManagementLayout;