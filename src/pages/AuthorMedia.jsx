import { useState, useEffect, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Environment-aware configuration
const ENV_CONFIG = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:3000'
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.fulfill1st.com/api',
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'https://api.fulfill1st.com'
  }
};

// Detect environment
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const config = ENV_CONFIG[isProduction ? 'production' : 'development'];

const AuthorMedia = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  //const [hoveredAuthor, setHoveredAuthor] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  
  // Compact green theme palette
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-25 via-green-50/50 to-emerald-50',
      card: 'bg-white/95 backdrop-blur-sm',
      glass: 'bg-white/10 backdrop-blur-sm'
    },
    text: {
      primary: 'text-emerald-900',
      secondary: 'text-emerald-800',
      muted: 'text-emerald-600/90'
    },
    border: {
      light: 'border-emerald-100/70',
      medium: 'border-emerald-200'
    },
    gradient: {
      primary: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500',
    },
    shadow: {
      card: 'shadow-lg shadow-emerald-100/40',
      hover: 'shadow-xl shadow-emerald-200/40'
    }
  };

  // Platform data - compact version
  const platformData = {
    'twitter': { icon: '🐦', label: 'Twitter', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'facebook': { icon: '📘', label: 'Facebook', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'instagram': { icon: '📷', label: 'Instagram', color: 'from-emerald-400 via-green-500 to-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'linkedin': { icon: '💼', label: 'LinkedIn', color: 'from-emerald-400 to-emerald-700', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'youtube': { icon: '▶️', label: 'YouTube', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'website': { icon: '🌐', label: 'Website', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'goodreads': { icon: '📚', label: 'Goodreads', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'amazon': { icon: '🛒', label: 'Amazon', color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'blog': { icon: '✍️', label: 'Blog', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    'other': { icon: '🔗', label: 'Other', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' }
  };

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

  // Compact Loading skeleton
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Compact Hero Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 w-40 bg-emerald-200/50 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 w-3/4 bg-emerald-200/50 rounded-xl mx-auto mb-3 animate-pulse"></div>
          </div>

          {/* Compact Search Skeleton */}
          <div className="mb-6 bg-white/80 rounded-2xl p-4 shadow border border-emerald-100/50">
            <div className="h-10 bg-emerald-100/50 rounded-lg animate-pulse"></div>
          </div>

          {/* Compact Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl shadow border border-emerald-100/50 overflow-hidden">
                <div className="h-40 bg-emerald-100/50 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-emerald-100/50 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-emerald-100/50 rounded mb-3 animate-pulse"></div>
                  <div className="h-12 bg-emerald-100/50 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact Error state
  if (error) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className={`text-center ${theme.bg.card} rounded-2xl ${theme.shadow.card} p-6 ${theme.border.light} border`}>
            <div className="text-6xl mb-4 text-emerald-400">👥</div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Connection Issue</h3>
            <p className="text-sm text-emerald-700 mb-4">{error}</p>
            <button 
              onClick={fetchSocialLinks}
              className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all flex items-center justify-center gap-2`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-h-screen ${theme.bg.primary} pt-5 pb-8 relative`}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Development banner */}
      {!isProduction && (
        <div className="fixed top-3 right-3 z-50">
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            Dev
          </div>
        </div>
      )}

      {/* Main Container - Compact */}
      <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6">
        {/* Compact Hero Section */}
        <div className="mb-6">
          <div className="text-center mb-5">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {stats.totalAuthors} Authors
            </div>
            
            {/* Compact Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Amplified Voices
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              Connect with featured authors across social platforms
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: stats.totalAuthors, label: 'Authors' },
              { value: stats.totalLinks, label: 'Profiles' },
              { value: stats.uniquePlatforms, label: 'Platforms' },
              { value: stats.totalLinks / stats.totalAuthors || 0, label: 'Avg/Author' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/80 rounded-lg border border-emerald-100 shadow-sm">
                <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-emerald-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Search and Filters */}
        <div className="mb-5">
          <div className={`${theme.bg.card} rounded-xl ${theme.shadow.card} p-4 ${theme.border.light} border`}>
            {/* Search Input */}
            <div className="mb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search authors..."
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-emerald-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm text-emerald-900 placeholder-emerald-500/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-emerald-500 hover:text-emerald-700"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* View Toggle and Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' 
                    ? `${theme.gradient.primary} text-white shadow-sm` 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' 
                    ? `${theme.gradient.primary} text-white shadow-sm` 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Platform Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${activeFilter === 'all'
                    ? `${theme.gradient.primary} text-white shadow-sm`
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  All
                </button>
                {['twitter', 'instagram', 'youtube', 'website'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setActiveFilter(platform)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${activeFilter === platform
                      ? `${theme.gradient.primary} text-white shadow-sm`
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {platformData[platform].icon} {platformData[platform].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-emerald-900">
              {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''} found
            </h2>
            {activeFilter !== 'all' && (
              <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                {platformData[activeFilter]?.label || activeFilter}
              </div>
            )}
          </div>
        </div>

        {/* Authors Grid/List */}
        <AnimatePresence mode="wait">
          {filteredAuthors.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-emerald-100 shadow-sm mb-4">
              <div className="text-4xl mb-3 text-emerald-400">🔍</div>
              <h3 className="text-base font-medium text-emerald-900 mb-2">No authors found</h3>
              <p className="text-sm text-emerald-600 mb-4">
                {searchTerm ? `No results for "${searchTerm}"` : 'No authors available'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all`}
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {filteredAuthors.map((author, index) => (
                <CompactAuthorCard 
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
            <div className="space-y-3 mb-6">
              {filteredAuthors.map((author, index) => (
                <CompactAuthorListItem 
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

        {/* Compact Stats Section */}
        {filteredAuthors.length > 0 && (
          <div className={`${theme.bg.card} rounded-xl p-4 border border-emerald-100 ${theme.shadow.card} mb-4`}>
            <h3 className="text-sm font-semibold text-emerald-900 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: stats.totalAuthors, label: 'Total Authors' },
                { value: stats.totalLinks, label: 'Profiles' },
                { value: stats.uniquePlatforms, label: 'Platforms' },
                { value: stats.mostUsedPlatform, label: 'Top Platform' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                  <div className="text-xs text-emerald-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compact Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-4 right-4 ${theme.gradient.primary} text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all z-40`}
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Compact Author Profile Modal */}
      {selectedAuthor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-emerald-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedAuthor.image ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30">
                        <img 
                          src={getImageUrl(selectedAuthor.image)} 
                          alt={selectedAuthor.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                <div class="text-sm font-bold text-emerald-700">${selectedAuthor.name?.charAt(0).toUpperCase() || 'A'}</div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-white/30 flex items-center justify-center text-sm font-bold text-emerald-700">
                        {selectedAuthor.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white">{selectedAuthor.name}</h3>
                      <p className="text-emerald-100 text-xs">Author Profile</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAuthor(null)}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Author Bio */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">About</h4>
                  <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    {selectedAuthor.description || 'Featured author with amplified social presence.'}
                  </p>
                </div>

                {/* Social Links */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-emerald-900 mb-2">Social Profiles</h4>
                  <div className="space-y-2">
                    {selectedAuthor.links?.slice(0, 5).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3 rounded-lg border ${platformData[link.platform]?.bg} ${theme.border.light} hover:shadow-sm transition-all`}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{platformData[link.platform]?.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-emerald-900">
                              {platformData[link.platform]?.label}
                            </div>
                            {link.username && (
                              <div className="text-xs text-emerald-600">@{link.username}</div>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Author Stats */}
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <h5 className="text-sm font-semibold text-emerald-900 mb-2">Stats</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-base font-bold text-emerald-700">{selectedAuthor.totalLinks}</div>
                      <div className="text-xs text-emerald-600">Profiles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-emerald-700">{selectedAuthor.platforms?.length || 0}</div>
                      <div className="text-xs text-emerald-600">Platforms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-emerald-700">Active</div>
                      <div className="text-xs text-emerald-600">Status</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="border-t border-emerald-100 p-3">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-emerald-600">
                    Last updated • Just now
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAuthor(null)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium rounded-lg hover:shadow transition-all">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Compact Author Card Component
const CompactAuthorCard = ({ author, platformData, getImageUrl, openAuthorProfile, theme }) => {
  const imageUrl = getImageUrl(author.image);

  return (
    <div 
      onClick={openAuthorProfile}
      className="group cursor-pointer"
    >
      <div className={`relative ${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border ${theme.border.light} group-hover:border-emerald-300/50 h-full`}>
        {/* Image Section */}
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500">
            <div className="absolute inset-0 flex items-center justify-center">
              {imageUrl ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow">
                  <img 
                    src={imageUrl} 
                    alt={author.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                          <div class="text-lg font-bold text-emerald-700">${author.name?.charAt(0).toUpperCase() || 'A'}</div>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-white/30 flex items-center justify-center text-lg font-bold text-emerald-700 shadow">
                  {author.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-emerald-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
            {author.name}
          </h3>
          <p className="text-xs text-emerald-600 mb-2 line-clamp-2 h-8">
            {author.description || 'Featured author'}
          </p>

          {/* Platform Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {author.platforms?.slice(0, 2).map((platform, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${platformData[platform]?.bg} ${platformData[platform]?.text}`}
              >
                {platformData[platform]?.icon}
              </span>
            ))}
            {author.platforms?.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">
                +{author.platforms.length - 2}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-emerald-500">
            <span>{author.totalLinks} profiles</span>
            <span className="group-hover:text-emerald-700 transition-colors flex items-center">
              View
              <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Author List Item
const CompactAuthorListItem = ({ author, platformData, getImageUrl, openAuthorProfile, theme }) => {
  const imageUrl = getImageUrl(author.image);

  return (
    <div 
      onClick={openAuthorProfile}
      className="group cursor-pointer"
    >
      <div className={`${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 border ${theme.border.light} group-hover:border-emerald-300/50`}>
        <div className="flex items-center p-3">
          {/* Avatar */}
          <div className="flex-shrink-0 mr-3">
            {imageUrl ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-100">
                <img 
                  src={imageUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                        <div class="text-sm font-bold text-emerald-700">${author.name?.charAt(0).toUpperCase() || 'A'}</div>
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                {author.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm text-emerald-900 truncate">
                {author.name}
              </h3>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {author.totalLinks} profiles
              </span>
            </div>
            
            <p className="text-xs text-emerald-600 mb-2 line-clamp-1">
              {author.description || 'Featured author'}
            </p>
            
            <div className="flex items-center gap-1">
              {author.platforms?.slice(0, 3).map((platform, idx) => (
                <span key={idx} className="text-xs text-emerald-500">
                  {platformData[platform]?.icon}
                </span>
              ))}
              {author.platforms?.length > 3 && (
                <span className="text-xs text-emerald-500">+{author.platforms.length - 3}</span>
              )}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="ml-2 text-emerald-400 group-hover:text-emerald-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorMedia;