import { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Environment-aware configuration - NO CHANGES
const ENV_CONFIG = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://192.168.68.4:3000/api',
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'http://192.168.68.4:3000'
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.fulfill1st.com/api',
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'https://api.fulfill1st.com'
  }
};

// Detect environment - NO CHANGES
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const config = ENV_CONFIG[isProduction ? 'production' : 'development'];

const AuthorMedia = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  
  // Enhanced vibrant theme palette with gradients
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-50 via-white to-cyan-50/50',
      card: 'bg-white/95 backdrop-blur-md',
      glass: 'bg-white/30 backdrop-blur-xl',
      modal: 'bg-gradient-to-br from-white via-emerald-50/30 to-cyan-50/20'
    },
    text: {
      primary: 'text-emerald-900',
      secondary: 'text-emerald-800/90',
      muted: 'text-emerald-600/80',
      light: 'text-white'
    },
    border: {
      light: 'border-emerald-100/60',
      medium: 'border-emerald-200/80',
      accent: 'border-emerald-300/40',
      glow: 'border-emerald-400/20'
    },
    gradient: {
      primary: 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400',
      secondary: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
      accent: 'bg-gradient-to-r from-emerald-500 to-cyan-500',
      card: 'bg-gradient-to-br from-white via-emerald-50/50 to-cyan-50/50',
      hover: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500'
    },
    shadow: {
      card: 'shadow-2xl shadow-emerald-200/30 hover:shadow-3xl hover:shadow-emerald-300/40',
      soft: 'shadow-xl shadow-emerald-100/20',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      inner: 'shadow-inset-emerald'
    },
    animation: {
      pulse: 'animate-pulse-subtle'
    }
  };

  // Enhanced platform data with more vibrant colors
  const platformData = {
    'twitter': { 
      icon: '🐦', 
      label: 'Twitter', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-sky-100/80',
      hover: 'hover:from-emerald-200 hover:to-sky-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'facebook': { 
      icon: '📘', 
      label: 'Facebook', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-blue-100/80',
      hover: 'hover:from-emerald-200 hover:to-blue-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'instagram': { 
      icon: '📷', 
      label: 'Instagram', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-pink-100/80',
      hover: 'hover:from-emerald-200 hover:to-pink-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'linkedin': { 
      icon: '💼', 
      label: 'LinkedIn', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-blue-100/80',
      hover: 'hover:from-emerald-200 hover:to-blue-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'youtube': { 
      icon: '▶️', 
      label: 'YouTube', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-red-100/80',
      hover: 'hover:from-emerald-200 hover:to-red-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'website': { 
      icon: '🌐', 
      label: 'Website', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-green-100/80',
      hover: 'hover:from-emerald-200 hover:to-green-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'goodreads': { 
      icon: '📚', 
      label: 'Goodreads', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-amber-100/80',
      hover: 'hover:from-emerald-200 hover:to-amber-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'amazon': { 
      icon: '🛒', 
      label: 'Amazon', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-yellow-100/80',
      hover: 'hover:from-emerald-200 hover:to-yellow-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'blog': { 
      icon: '✍️', 
      label: 'Blog', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-purple-100/80',
      hover: 'hover:from-emerald-200 hover:to-purple-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    },
    'other': { 
      icon: '🔗', 
      label: 'Other', 
      bg: 'bg-gradient-to-br from-emerald-100/80 to-gray-100/80',
      hover: 'hover:from-emerald-200 hover:to-gray-200',
      text: 'text-emerald-800',
      border: 'border-emerald-200/60'
    }
  };

  // Custom CSS for additional effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse-subtle {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
      .line-clamp-2 { 
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .shadow-inset-emerald {
        box-shadow: inset 0 2px 4px 0 rgba(16, 185, 129, 0.1);
      }
      .glass-effect {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      @media (max-width: 640px) {
        .mobile-stack { flex-direction: column; }
        .mobile-full { width: 100%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch social media links
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = `${config.apiBaseUrl}/social-media-links`;
      
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const activeLinks = data.success 
        ? (data.data || []).filter(link => link.isActive)
        : (data || []).filter(link => link.isActive);
      setSocialLinks(activeLinks);
    } catch (error) {
      console.error('Error:', error);
      if (!isProduction) {
        await tryFallbackEndpoints();
      } else {
        setError(`Failed to load. ${error.message}`);
        setSocialLinks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const tryFallbackEndpoints = async () => {
    const fallbackEndpoints = [
      'http://localhost:3000/api/social-media-links',
      'http://192.168.68.4:3000/api/social-media-links',
      'http://127.0.0.1:3000/api/social-media-links'
    ];
    
    for (const endpoint of fallbackEndpoints) {
      try {
        const response = await fetch(endpoint, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const activeLinks = data.success 
            ? (data.data || []).filter(link => link.isActive)
            : (data || []).filter(link => link.isActive);
          setSocialLinks(activeLinks);
          return;
        }
      } catch (err) {
        console.error('Error:', err);
        continue;
      }
    }
    
    setError('Backend server not found.');
    setSocialLinks([]);
  };

  // Extract unique authors
  const getUniqueAuthors = () => {
    const authorMap = new Map();
    
    socialLinks.forEach(link => {
      if (!authorMap.has(link.authorName)) {
        authorMap.set(link.authorName, {
          name: link.authorName,
          email: link.authorEmail,
          image: link.authorImage,
          links: [link],
          platforms: new Set([link.platform]),
          description: link.description
        });
      } else {
        const existingAuthor = authorMap.get(link.authorName);
        existingAuthor.links.push(link);
        existingAuthor.platforms.add(link.platform);
      }
    });
    
    return Array.from(authorMap.values()).map(author => ({
      ...author,
      totalLinks: author.links.length,
      platforms: Array.from(author.platforms)
    })).sort((a, b) => b.totalLinks - a.totalLinks);
  };

  // Get filtered authors
  const getFilteredAuthors = () => {
    const uniqueAuthors = getUniqueAuthors();
    if (!searchTerm) return uniqueAuthors;
    
    return uniqueAuthors.filter(author =>
      author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get stats
  const getStats = () => {
    const uniqueAuthors = getUniqueAuthors();
    const totalLinks = socialLinks.length;
    
    return {
      totalAuthors: uniqueAuthors.length,
      totalLinks,
      uniquePlatforms: [...new Set(socialLinks.map(link => link.platform))].length,
      mostConnectedAuthor: uniqueAuthors[0]?.name || 'None',
      mostUsedPlatform: Object.entries(
        socialLinks.reduce((acc, link) => {
          acc[link.platform] = (acc[link.platform] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    };
  };

  // Image URL handler
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) {
      const cleanPath = imageUrl.startsWith('/uploads') ? imageUrl : `/uploads${imageUrl}`;
      return `${config.imageBaseUrl}${cleanPath}`;
    }
    return `${config.imageBaseUrl}/uploads/authors/${imageUrl}`;
  };

  const stats = getStats();
  const filteredAuthors = getFilteredAuthors();

  // Enhanced Loading skeleton
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Enhanced Hero Skeleton */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8 pt-4"
          >
            <div className="h-8 w-56 bg-gradient-to-r from-emerald-300/30 to-cyan-300/30 rounded-full mx-auto mb-6 animate-pulse-subtle"></div>
            <div className="h-12 max-w-2xl mx-auto bg-gradient-to-r from-emerald-300/20 via-emerald-200/20 to-cyan-300/20 rounded-2xl mb-4 animate-pulse-subtle"></div>
            <div className="h-4 w-80 max-w-xs mx-auto bg-emerald-300/20 rounded-full animate-pulse-subtle"></div>
          </motion.div>

          {/* Enhanced Search Skeleton */}
          <div className={`mb-6 ${theme.bg.glass} glass-effect rounded-3xl p-5 ${theme.shadow.soft} border ${theme.border.accent}`}>
            <div className="h-14 bg-gradient-to-r from-white/40 to-white/20 rounded-xl animate-pulse-subtle"></div>
          </div>

          {/* Enhanced Grid Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${theme.bg.card} rounded-3xl ${theme.shadow.soft} overflow-hidden border ${theme.border.light} backdrop-blur-sm`}
              >
                <div className="h-40 bg-gradient-to-r from-emerald-200/20 via-emerald-100/20 to-cyan-200/20 animate-pulse-subtle"></div>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-300/30 to-cyan-300/30 mr-3 animate-pulse-subtle"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gradient-to-r from-emerald-300/30 to-emerald-200/30 rounded mb-2 animate-pulse-subtle"></div>
                      <div className="h-3 w-3/4 bg-gradient-to-r from-emerald-200/20 to-emerald-100/20 rounded animate-pulse-subtle"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-emerald-200/15 to-emerald-100/15 rounded mb-3 animate-pulse-subtle"></div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <div className="h-7 w-16 bg-gradient-to-r from-emerald-300/25 to-cyan-300/25 rounded-lg animate-pulse-subtle"></div>
                    <div className="h-7 w-14 bg-gradient-to-r from-emerald-300/25 to-cyan-300/25 rounded-lg animate-pulse-subtle"></div>
                  </div>
                  <div className="h-10 bg-gradient-to-r from-emerald-300/30 to-cyan-300/30 rounded-xl animate-pulse-subtle"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error state
  if (error) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative overflow-hidden`}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${theme.bg.card} glass-effect rounded-3xl ${theme.shadow.card} p-8 sm:p-10 ${theme.border.light} border`}
          >
            <div className="text-8xl mb-6 text-emerald-400/50 animate-float">👥</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-4">Connection Required</h3>
            <p className="text-emerald-700 mb-6 leading-relaxed text-base sm:text-lg">{error}</p>
            <button 
              onClick={fetchSocialLinks}
              className={`px-6 py-3.5 ${theme.gradient.primary} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mx-auto min-w-[200px]`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Connection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg.primary} pt-5 sm:pt-6 pb-8 relative overflow-hidden`}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-emerald-300/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-300/5 rounded-full blur-3xl"></div>
      </div>

      {/* Development banner - Enhanced */}
      {!isProduction && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xl shadow-emerald-500/20 animate-pulse-subtle">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Development Mode
          </div>
        </motion.div>
      )}

      {/* Main Container */}
      <div className="max-w-screen mx-auto px-3 xs:px-4 sm:px-5 lg:px-6 relative z-10">
        {/* Enhanced Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 pt-4"
        >
          <div className="text-center mb-6 sm:mb-8">
            {/* Status Badge */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 border border-emerald-200/80 text-emerald-800 text-sm font-semibold mb-5 shadow-sm"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mr-2 animate-pulse-subtle"></span>
              {stats.totalAuthors} Authors • {stats.totalLinks} Profiles
            </motion.div>
            
            {/* Enhanced Title with gradient */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4 px-2">
              Author Media Hub
            </h1>
            <p className="text-base sm:text-lg text-emerald-700/90 max-w-2xl mx-auto leading-relaxed px-4">
              Connect with featured authors across all social platforms
            </p>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
            {[
              { value: stats.totalAuthors, label: 'Featured Authors', icon: '👥', color: 'from-emerald-400 to-emerald-300' },
              { value: stats.totalLinks, label: 'Social Profiles', icon: '🔗', color: 'from-cyan-400 to-cyan-300' },
              { value: stats.uniquePlatforms, label: 'Platforms', icon: '🌐', color: 'from-emerald-400 to-cyan-400' },
              { value: (stats.totalLinks / stats.totalAuthors || 0).toFixed(1), label: 'Avg/Author', icon: '📊', color: 'from-cyan-400 to-emerald-400' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`text-center p-4 sm:p-5 ${theme.bg.card} rounded-2xl ${theme.shadow.soft} border ${theme.border.light} hover:${theme.shadow.card} transition-all duration-300 cursor-default backdrop-blur-sm`}
              >
                <div className={`text-2xl sm:text-3xl mb-2 sm:mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.icon}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-800 mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-emerald-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.bg.glass} glass-effect rounded-3xl ${theme.shadow.soft} p-4 sm:p-5 ${theme.border.accent} border mb-6 sm:mb-8`}
        >
          {/* Search Input */}
          <div className="mb-4 sm:mb-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search authors by name, email, or description..."
                className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-4 bg-white/90 border border-emerald-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-3 focus:ring-emerald-300/50 focus:border-emerald-400 text-sm sm:text-base text-emerald-900 placeholder-emerald-500/60 shadow-inset-emerald transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced View Toggle and Filters */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' 
                  ? `${theme.gradient.primary} text-white ${theme.shadow.soft} shadow-lg` 
                  : 'bg-emerald-100/80 text-emerald-600 hover:bg-emerald-200 hover:shadow-md'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' 
                  ? `${theme.gradient.primary} text-white ${theme.shadow.soft} shadow-lg` 
                  : 'bg-emerald-100/80 text-emerald-600 hover:bg-emerald-200 hover:shadow-md'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Enhanced Platform Filters with scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeFilter === 'all'
                    ? `${theme.gradient.primary} text-white ${theme.shadow.soft} shadow-lg`
                    : 'bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200 hover:shadow-md'
                  }`}
                >
                  All Platforms
                </button>
                {['twitter', 'instagram', 'youtube', 'website', 'facebook', 'linkedin', 'blog', 'goodreads'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setActiveFilter(platform)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${activeFilter === platform
                      ? `${theme.gradient.primary} text-white ${theme.shadow.soft} shadow-lg`
                      : `${platformData[platform]?.bg} ${platformData[platform]?.text} ${platformData[platform]?.border} border hover:shadow-md hover:scale-105`
                    }`}
                  >
                    <span className="text-base">{platformData[platform]?.icon}</span>
                    <span>{platformData[platform]?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Results Count */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5 sm:mb-6"
        >
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-emerald-900 px-2">
              {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </h2>
            {activeFilter !== 'all' && (
              <div className={`px-4 py-2.5 rounded-xl ${platformData[activeFilter]?.bg} ${platformData[activeFilter]?.border} border flex items-center gap-2 shadow-sm`}>
                <span className="text-lg">{platformData[activeFilter]?.icon}</span>
                <span className="text-sm font-medium text-emerald-900">{platformData[activeFilter]?.label}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Authors Grid/List */}
        <AnimatePresence mode="wait">
          {filteredAuthors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 sm:py-16 bg-white/90 rounded-3xl border border-emerald-100/60 shadow-2xl mb-6 sm:mb-8 backdrop-blur-sm"
            >
              <div className="text-7xl sm:text-8xl mb-6 text-emerald-400/50 animate-float">🔍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-4">No Authors Found</h3>
              <p className="text-emerald-600 mb-6 sm:mb-8 text-base sm:text-lg">
                {searchTerm ? `No results for "${searchTerm}"` : 'No authors available'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className={`px-5 py-3 ${theme.gradient.primary} text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                Clear Filters
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {filteredAuthors.map((author, index) => (
                <EnhancedAuthorCard 
                  key={author.name} 
                  author={author} 
                  index={index}
                  platformData={platformData}
                  getImageUrl={getImageUrl}
                  openAuthorProfile={() => setSelectedAuthor(author)}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5 mb-8">
              {filteredAuthors.map((author, index) => (
                <EnhancedAuthorListItem 
                  key={author.name} 
                  author={author} 
                  index={index}
                  platformData={platformData}
                  getImageUrl={getImageUrl}
                  openAuthorProfile={() => setSelectedAuthor(author)}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Enhanced Stats Section */}
        {filteredAuthors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.bg.card} rounded-3xl p-5 sm:p-6 border ${theme.border.light} ${theme.shadow.soft} mb-6 sm:mb-8 backdrop-blur-sm`}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-4 sm:mb-5 flex items-center gap-2">
              <span className="text-emerald-500">📈</span>
              Platform Insights
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: stats.totalAuthors, label: 'Featured Authors', icon: '👥' },
                { value: stats.totalLinks, label: 'Total Profiles', icon: '🔗' },
                { value: stats.uniquePlatforms, label: 'Active Platforms', icon: '🌐' },
                { value: stats.mostUsedPlatform, label: 'Top Platform', icon: '🏆' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-emerald-50/80 to-cyan-50/80 rounded-2xl border border-emerald-100/60 hover:border-emerald-200 transition-colors duration-300">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 text-emerald-600">{stat.icon}</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-800 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-emerald-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 ${theme.gradient.primary} text-white p-3.5 sm:p-4 rounded-xl shadow-2xl shadow-emerald-500/30 hover:shadow-3xl transition-all duration-300 z-40`}
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}

      {/* Enhanced Author Profile Modal */}
      {selectedAuthor && (
        <EnhancedAuthorProfileModal 
          author={selectedAuthor}
          platformData={platformData}
          getImageUrl={getImageUrl}
          onClose={() => setSelectedAuthor(null)}
          theme={theme}
        />
      )}
    </div>
  );
};

// Enhanced Author Card Component
const EnhancedAuthorCard = ({ author, platformData, getImageUrl, openAuthorProfile, theme }) => {
  const imageUrl = getImageUrl(author.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={openAuthorProfile}
      className="group cursor-pointer h-full"
    >
      <div className={`relative ${theme.bg.card} rounded-3xl ${theme.shadow.card} transition-all duration-500 overflow-hidden border ${theme.border.light} group-hover:border-emerald-300/60 h-full backdrop-blur-sm`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Image Section with gradient overlay */}
        <div className="relative h-40 sm:h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-cyan-500">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {imageUrl ? (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl"
                >
                  <img 
                    src={imageUrl} 
                    alt={author.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                          <div class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">${author.name?.charAt(0).toUpperCase() || 'A'}</div>
                        </div>
                      `;
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 border-4 border-white/30 flex items-center justify-center text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent shadow-2xl"
                >
                  {author.name?.charAt(0).toUpperCase() || 'A'}
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors duration-300 truncate">
            {author.name}
          </h3>
          <p className="text-sm text-emerald-600/90 mb-4 line-clamp-2 leading-relaxed min-h-[3rem]">
            {author.description || 'Featured author with amplified social presence.'}
          </p>

          {/* Platform Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {author.platforms?.slice(0, 3).map((platform, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.1 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${platformData[platform]?.bg} ${platformData[platform]?.text} ${platformData[platform]?.border} border transition-all duration-300 group-hover:shadow-sm`}
              >
                <span className="text-sm">{platformData[platform]?.icon}</span>
                <span className="font-medium">{platformData[platform]?.label}</span>
              </motion.span>
            ))}
            {author.platforms?.length > 3 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 text-xs font-medium border border-emerald-200/60">
                +{author.platforms.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-emerald-100/60">
            <div className="flex items-center justify-between text-sm">
              <div className="text-emerald-900 font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {author.totalLinks} profile{author.totalLinks !== 1 ? 's' : ''}
              </div>
              <span className="text-emerald-500 group-hover:text-emerald-700 transition-colors duration-300 flex items-center gap-1 font-medium">
                View Profile
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Author List Item
const EnhancedAuthorListItem = ({ author, platformData, getImageUrl, openAuthorProfile, theme }) => {
  const imageUrl = getImageUrl(author.image);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onClick={openAuthorProfile}
      className="group cursor-pointer"
    >
      <div className={`${theme.bg.card} rounded-3xl ${theme.shadow.soft} hover:${theme.shadow.card} transition-all duration-500 border ${theme.border.light} group-hover:border-emerald-300/60 backdrop-blur-sm`}>
        <div className="p-4 sm:p-5">
          <div className="flex items-center mobile-stack">
            {/* Avatar */}
            <div className="flex-shrink-0 mr-4 sm:mr-5">
              {imageUrl ? (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-3 border-emerald-100/60 shadow-lg"
                >
                  <img 
                    src={imageUrl}
                    alt={author.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center rounded-2xl">
                          <div class="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">${author.name?.charAt(0).toUpperCase() || 'A'}</div>
                        </div>
                      `;
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 border-3 border-emerald-100/60 flex items-center justify-center text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent shadow-lg"
                >
                  {author.name?.charAt(0).toUpperCase() || 'A'}
                </motion.div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <div className="mb-2 sm:mb-0">
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-1 truncate">
                    {author.name}
                  </h3>
                  <p className="text-sm text-emerald-600/90 line-clamp-1">
                    {author.description || 'Featured author with amplified social presence.'}
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-800 text-sm font-medium border border-emerald-200/60 shadow-sm">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {author.totalLinks} profile{author.totalLinks !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {author.platforms?.slice(0, 4).map((platform, idx) => (
                  <span key={idx} className="text-base sm:text-lg text-emerald-600">
                    {platformData[platform]?.icon}
                  </span>
                ))}
                {author.platforms?.length > 4 && (
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    +{author.platforms.length - 4}
                  </span>
                )}
              </div>
            </div>
            
            {/* Arrow */}
            <div className="ml-4 text-emerald-400 group-hover:text-emerald-600 transition-colors duration-300">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Author Profile Modal
const EnhancedAuthorProfileModal = ({ author, platformData, getImageUrl, onClose, theme }) => {
  const imageUrl = getImageUrl(author.image);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`${theme.bg.modal} glass-effect rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border ${theme.border.glow} backdrop-blur-xl`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {imageUrl ? (
                  <motion.div 
                    whileHover={{ rotate: 5 }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl"
                  >
                    <img 
                      src={imageUrl} 
                      alt={author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
                            <div class="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">${author.name?.charAt(0).toUpperCase() || 'A'}</div>
                          </div>
                        `;
                      }}
                    />
                  </motion.div>
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 border-4 border-white/30 flex items-center justify-center text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent shadow-xl">
                    {author.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{author.name}</h3>
                  <p className="text-emerald-100/90 text-sm">Author Profile</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 hover:rotate-90"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Author Bio */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <span className="text-emerald-500">📖</span>
                About
              </h4>
              <div className="bg-gradient-to-br from-emerald-50/80 to-cyan-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-100/60">
                <p className="text-sm text-emerald-700 leading-relaxed">
                  {author.description || 'Featured author with amplified social presence.'}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                <span className="text-emerald-500">🔗</span>
                Social Profiles
              </h4>
              <div className="space-y-3">
                {author.links?.slice(0, 6).map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className={`group flex items-center justify-between p-4 rounded-2xl border ${platformData[link.platform]?.border} ${platformData[link.platform]?.bg} hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{platformData[link.platform]?.icon}</span>
                      <div>
                        <div className="font-bold text-emerald-900">
                          {platformData[link.platform]?.label}
                        </div>
                        {link.username && (
                          <div className="text-sm text-emerald-600">@{link.username}</div>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Author Stats */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-cyan-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-100/60">
              <h5 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                <span className="text-emerald-500">📊</span>
                Profile Stats
              </h5>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">{author.totalLinks}</div>
                  <div className="text-sm text-emerald-600">Profiles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">{author.platforms?.length || 0}</div>
                  <div className="text-sm text-emerald-600">Platforms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">Active</div>
                  <div className="text-sm text-emerald-600">Status</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-emerald-100/60 p-5 bg-emerald-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-emerald-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated just now
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-white text-emerald-700 font-medium rounded-xl border border-emerald-200/80 hover:bg-emerald-50 hover:shadow-md transition-all duration-300 mobile-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthorMedia;