import { NavLink } from 'react-router-dom';

const FulfillmentNav = () => {
  return (
    <nav className="bg-gray-900 shadow-lg z-[1000] fixed w-full top-0">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
            {/* Back to Services Button */}
            <NavLink
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition duration-200"
            >
              <svg 
                className="w-5 h-5 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              <span className="text-sm font-medium">Back to Services</span>
            </NavLink>
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">BookHub</span>
            </NavLink>
            
            
          </div>

          {/* Navigation Links - Public Only */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/bookstore" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Bookstore
            </NavLink>

            <NavLink 
              to="/author-media" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Author Media
            </NavLink>
            
            <NavLink 
              to="/book-events" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Book Events
            </NavLink>
            
            <NavLink 
              to="/cinematic" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Cinematic
            </NavLink>
            
            <NavLink 
              to="/tradpub" 
              className={({ isActive }) => 
                isActive 
                  ? 'text-blue-400 border-b-2 border-blue-400 px-3 py-2 text-sm font-medium'
                  : 'text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-200'
              }
            >
              Trad Pub
            </NavLink>
          </div>

          {/* No auth buttons in public navbar */}
          <div className="flex items-center">
            {/* Empty for now - no login button visible */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FulfillmentNav;