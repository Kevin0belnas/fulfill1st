import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Environment-aware configuration
const ENV_CONFIG = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.fulfill1st.com/api',
  }
};

const currentEnv = import.meta.env.MODE || 'development';
const config = ENV_CONFIG[currentEnv];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // API helper function
  const apiCall = async (endpoint, options = {}) => {
    const url = `${config.apiBaseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call your backend login API
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        console.log('Login successful:', response.data);
        
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        
        // Store user info if needed
        if (response.data.user) {
          localStorage.setItem('user_email', response.data.user.email);
          localStorage.setItem('user_name', response.data.user.name);
        }
        
        // Redirect to agent chat on success
        navigate('/agentchat');
      } else {
        throw new Error(response.error || 'Login failed');
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 sm:p-5 lg:p-6">
      <div className="w-full max-w-[min(420px,90vw)] relative animate-fadeIn">
        {/* Back Button */}
        <button 
          onClick={handleBackClick} 
          className="absolute -top-12 left-0 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          title="Go back to home"
        >
          <svg className="w-5 h-5 fill-gray-600" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white/96 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 animate-slideDown">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8 tracking-tight">
            Agent Portal
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm sm:text-base p-3 sm:p-4 rounded-lg mb-4 sm:mb-5 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@company.com"
              autoFocus
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 sm:mb-7">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Footer Links */}
          <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
            <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-semibold no-underline">
              Forgot password?
            </a>
          </div>
          
          <div className="mt-4 text-center text-gray-500 text-sm sm:text-base">
            Don't have an account?{' '}
            <a href="/create-account" className="text-indigo-600 hover:text-indigo-700 font-semibold no-underline">
              Create one here
            </a>
          </div>
        </form>
      </div>

      {/* Add custom animations to your global CSS or Tailwind config */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;