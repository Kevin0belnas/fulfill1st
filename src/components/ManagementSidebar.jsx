// components/ManagementSidebar.jsx
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManagementSidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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
      await fetch('http://192.168.68.13:3000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/company/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <div className={`bg-gray-800 shadow-lg h-screen sticky top-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'hidden'}`}>
              <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h1 className="text-white font-bold text-lg truncate">BookHub</h1>
            </div>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {sidebarOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* User Info */}
          <div className={`p-4 border-b border-gray-700 ${!sidebarOpen && 'hidden'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm truncate">{user?.name || 'Admin'}</p>
                <p className="text-gray-400 text-xs truncate">{user?.email || 'admin@bookhub.com'}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            <NavLink 
              to="/company/manage" 
              end
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title="Dashboard"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span className="ml-3 truncate">Dashboard</span>}
            </NavLink>
            
            <NavLink 
              to="/company/manage-bookstore" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title="Manage Bookstores"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {sidebarOpen && <span className="ml-3 truncate">Bookstores</span>}
            </NavLink>
            
            <NavLink 
              to="/company/manage-authors" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title="Manage Authors"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {sidebarOpen && <span className="ml-3 truncate">Authors</span>}
            </NavLink>
            
            <NavLink 
              to="/company/manage-books" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              title="Manage Books"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {sidebarOpen && <span className="ml-3 truncate">Books</span>}
            </NavLink>
          </nav>

          {/* Logout Button */}
          <div className={`p-4 border-t border-gray-700 ${!sidebarOpen && 'px-2'}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition duration-200 ${!sidebarOpen && 'p-2'}`}
              title={!sidebarOpen ? "Logout" : ""}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <nav className="bg-gray-800 shadow-lg">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-white font-bold text-lg">BookHub Admin</div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar Menu */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        ></div>
        
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 shadow-lg">
          {/* Mobile Sidebar Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <h1 className="text-white font-bold text-lg">BookHub Admin</h1>
            </div>
            <button
              onClick={closeMobileMenu}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
                <p className="text-gray-400 text-xs">{user?.email || 'admin@bookhub.com'}</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="p-4 space-y-1">
            <NavLink 
              to="/company/manage" 
              end
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="ml-3">Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/company/manage-bookstore" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="ml-3">Bookstores</span>
            </NavLink>
            
            <NavLink 
              to="/company/manage-authors" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="ml-3">Authors</span>
            </NavLink>
            
            <NavLink 
              to="/company/manage-books" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="ml-3">Books</span>
            </NavLink>
          </nav>

          {/* Mobile Logout Button */}
          <div className="absolute bottom-0 w-full p-4">
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} pt-0 md:pt-0`}>
        <div className="p-4 md:p-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagementSidebar;