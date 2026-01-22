// components/ManagementNavbar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManagementNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          } else {
            navigate('/company/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/company/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://192.168.68.13:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/company/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isBookstoreActive = () => {
    const path = window.location.pathname;
    return (
      path.includes('/company/manage-bookstore') ||
      path.includes('/manage-authors') ||
      path.includes('/manage-books')
    );
  };

  return (
    <nav className="bg-gray-800 shadow-lg z-[1000] fixed w-full top-0">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <NavLink to="/company/manage" className="flex items-center">
              <span className="text-xl font-bold text-white">BookHub Management</span>
            </NavLink>
            
            <div className="hidden md:flex items-center space-x-1">
              <span className="text-gray-300 text-sm">|</span>
              <span className="text-gray-400 text-sm">
                {user?.name || 'Admin Panel'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/company/manage" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-300 border-b-2 border-blue-300 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Dashboard
            </NavLink>
            
            {/* Bookstore Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition duration-200 ${
                  isBookstoreActive()
                    ? 'text-blue-300 border-b-2 border-blue-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Bookstore</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-700 rounded-lg shadow-lg py-2 z-50">
                  <NavLink 
                    to="/company/manage-bookstore" 
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    Manage Bookstores
                  </NavLink>
                  <NavLink 
                    to="/manage-authors" 
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    Manage Authors
                  </NavLink>
                  <NavLink 
                    to="/manage-books" 
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`
                    }
                    onClick={() => setDropdownOpen(false)}
                  >
                    Manage Books
                  </NavLink>
                </div>
              )}
            </div>
            <NavLink 
              to="/manage-social-media-links" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-300 border-b-2 border-blue-300 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Manage Links
            </NavLink>
            
            {/* Add more tabs here as needed */}
            <NavLink 
              to="/manage-book-events" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-300 border-b-2 border-blue-300 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Manage Book Events
            </NavLink>
            
            <NavLink 
              to="/manage-tradpub" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-300 border-b-2 border-blue-300 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Manage TradPub
            </NavLink>
          </div>

          {/* User Menu and Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:block text-gray-300 text-sm">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                className="text-gray-300 hover:text-white"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-gray-800 ${mobileDropdownOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink 
            to="/company/manage" 
            className="block text-gray-300 hover:text-white px-3 py-2"
            onClick={() => setMobileDropdownOpen(false)}
          >
            Dashboard
          </NavLink>
          
          {/* Mobile Bookstore Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="flex items-center justify-between w-full text-left px-3 py-2 text-gray-300 hover:text-white"
            >
              <span>Bookstore</span>
              <svg 
                className={`w-4 h-4 transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`ml-4 space-y-1 ${mobileDropdownOpen ? 'block' : 'hidden'}`}>
              <NavLink 
                to="/company/manage-bookstore" 
                className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                onClick={() => setMobileDropdownOpen(false)}
              >
                Manage Bookstores
              </NavLink>
              <NavLink 
                to="/manage-authors" 
                className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                onClick={() => setMobileDropdownOpen(false)}
              >
                Manage Authors
              </NavLink>
              <NavLink 
                to="/manage-books" 
                className="block text-gray-300 hover:text-white px-3 py-2 text-sm"
                onClick={() => setMobileDropdownOpen(false)}
              >
                Manage Books
              </NavLink>
            </div>
          </div>
          
          {/* Additional mobile tabs */}
          <NavLink 
            to="/manage-book-events" 
            className="block text-gray-300 hover:text-white px-3 py-2"
            onClick={() => setMobileDropdownOpen(false)}
          >
            Manage Book Events
          </NavLink>
          
          <NavLink 
            to="/reports" 
            className="block text-gray-300 hover:text-white px-3 py-2"
            onClick={() => setMobileDropdownOpen(false)}
          >
            Reports
          </NavLink>
          
          {user && (
            <div className="px-3 py-2 text-gray-400 text-sm border-t border-gray-700">
              Logged in as: {user.email}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ManagementNavbar;