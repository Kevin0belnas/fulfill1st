import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Bookstore = () => {
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredBookstore, setHoveredBookstore] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();
  const gridRef = useRef(null);

  // Compact theme palette
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

  // Compact category colors
  const categoryColors = {
    'Independent': 'from-emerald-500 to-green-600',
    'Chain': 'from-green-500 to-emerald-600',
    'Specialty': 'from-lime-400 to-green-500',
    'Online': 'from-emerald-400 to-cyan-500',
    'Academic': 'from-green-400 to-teal-500',
    'Used': 'from-amber-400 to-yellow-500',
    'Default': 'from-emerald-400 to-green-500'
  };

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchBookstores();
  }, []);

  const fetchBookstores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = `${config.apiBaseUrl}/bookstores`;
      
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setBookstores(data.success ? (data.data || []) : (data || []));
    } catch (error) {
      console.error('Error:', error);
      if (!isProduction) {
        await tryFallbackEndpoints();
      } else {
        setError(`Failed to load. ${error.message}`);
        setBookstores([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const tryFallbackEndpoints = async () => {
    const fallbackEndpoints = [
      'http://localhost:3000/api/bookstores',
      'http://192.168.68.4:3000/api/bookstores',
      'http://127.0.0.1:3000/api/bookstores'
    ];
    
    for (const endpoint of fallbackEndpoints) {
      try {
        const response = await fetch(endpoint, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setBookstores(data.success ? (data.data || []) : (data || []));
          return;
        }
      } catch (err) {
        console.error('Error:', err);
        continue;
      }
    }
    
    setError('Backend server not found.');
    setBookstores([]);
  };

  const categories = [...new Set(bookstores.map(b => b.category).filter(Boolean))];

  const sortedBookstores = [...bookstores].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'established':
        return (b.established || 0) - (a.established || 0);
      default:
        return 0;
    }
  });

  const filteredBookstores = sortedBookstores.filter(bookstore => {
    const matchesSearch = bookstore.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || bookstore.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) {
      const cleanPath = imageUrl.startsWith('/uploads') ? imageUrl : `/uploads${imageUrl}`;
      return `${config.imageBaseUrl}${cleanPath}`;
    }
    return `${config.imageBaseUrl}/uploads/bookstores/${imageUrl}`;
  };

  // Compact Loading skeleton
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          {/* Hero Skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 w-40 bg-emerald-200/50 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 w-3/4 bg-emerald-200/50 rounded-xl mx-auto mb-3 animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="mb-6 bg-white/80 rounded-2xl p-4 shadow border border-emerald-100/50">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 h-10 bg-emerald-100/50 rounded-lg animate-pulse"></div>
              <div className="w-full lg:w-40 h-10 bg-emerald-100/50 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="max-w-xl mx-auto px-3 sm:px-4 lg:px-6 py-8 relative z-10">
          <div className={`text-center ${theme.bg.card} rounded-2xl ${theme.shadow.card} p-6 ${theme.border.light} border`}>
            <div className="text-6xl mb-4 text-emerald-400">📚</div>
            <h3 className="text-xl font-bold text-emerald-900 mb-3">Connection Issue</h3>
            <p className="text-sm text-emerald-700 mb-4">{error}</p>
            <button 
              onClick={fetchBookstores}
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
      {/* Development banner */}
      {!isProduction && (
        <div className="fixed top-3 right-3 z-50">
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            Dev
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6">
        {/* Compact Hero Section */}
        <div className="mb-6">
          <div className="text-center mb-5">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {bookstores.length} Bookstores
            </div>
            
            {/* Compact Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Literary Havens
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              Discover curated bookstores celebrating literature and community
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: bookstores.length, label: 'Stores' },
              { value: categories.length, label: 'Categories' },
              { value: bookstores.filter(b => b.rating >= 4).length, label: '4+ Stars' },
              { value: bookstores.filter(b => b.established < 2000).length, label: 'Classic' }
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
            <div className="flex flex-col lg:flex-row gap-3 mb-3">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search bookstores..."
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

              {/* View Toggle */}
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

              {/* Sort Dropdown */}
              <div className="relative">
                <select 
                  className="appearance-none w-full bg-white border border-emerald-100 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm cursor-pointer text-emerald-900"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default" className="text-emerald-500/60">Sort by</option>
                  <option value="rating" className="text-emerald-900">Highest Rated</option>
                  <option value="name" className="text-emerald-900">Name A-Z</option>
                  <option value="established" className="text-emerald-900">Newest First</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-emerald-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${!selectedCategory
                  ? `${theme.gradient.primary} text-white shadow-sm`
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                All
              </button>
              {categories.slice(0, 6).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${selectedCategory === category
                    ? `${theme.gradient.primary} text-white shadow-sm`
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {category}
                </button>
              ))}
              {categories.length > 6 && (
                <button className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium hover:bg-emerald-200">
                  +{categories.length - 6}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-emerald-900">
              {filteredBookstores.length} bookstore{filteredBookstores.length !== 1 ? 's' : ''} found
            </h2>
            {selectedCategory && (
              <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                {selectedCategory}
              </div>
            )}
          </div>
        </div>

        {/* Bookstore Grid/List */}
        <div ref={gridRef}>
          <AnimatePresence mode="wait">
            {filteredBookstores.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-emerald-100 shadow-sm mb-4">
                <div className="text-4xl mb-3 text-emerald-400">🔍</div>
                <h3 className="text-base font-medium text-emerald-900 mb-2">No bookstores found</h3>
                <p className="text-sm text-emerald-600 mb-4">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search' 
                    : 'Start adding bookstores'}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all`}
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                <AnimatePresence>
                  {filteredBookstores.map((bookstore, index) => (
                    <CompactBookstoreCard 
                      key={bookstore.id} 
                      bookstore={bookstore} 
                      index={index}
                      categoryColors={categoryColors}
                      getImageUrl={getImageUrl}
                      theme={theme}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <AnimatePresence>
                  {filteredBookstores.map((bookstore, index) => (
                    <CompactBookstoreListItem 
                      key={bookstore.id} 
                      bookstore={bookstore} 
                      index={index}
                      categoryColors={categoryColors}
                      getImageUrl={getImageUrl}
                      theme={theme}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Compact Stats Section */}
        {filteredBookstores.length > 0 && (
          <div className={`${theme.bg.card} rounded-xl p-4 border border-emerald-100 ${theme.shadow.card} mb-4`}>
            <h3 className="text-sm font-semibold text-emerald-900 mb-3">Collection Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: bookstores.length, label: 'Total Stores' },
                { value: categories.length, label: 'Categories' },
                { value: bookstores.filter(b => b.established).length, label: 'Established' },
                { value: bookstores.filter(b => b.website).length, label: 'Online Stores' }
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
    </div>
  );
};

// Compact Grid Card Component
const CompactBookstoreCard = ({ bookstore, index, categoryColors, getImageUrl, theme }) => {
  const categoryColor = categoryColors[bookstore.category] || categoryColors['Default'];
  const imageUrl = getImageUrl(bookstore.image_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <Link 
        to={`/bookstore/${bookstore.id}`}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.location.href = `/bookstore/${bookstore.id}`;
          }, 300);
        }}
        className="block"
      >
        <div className={`relative ${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border ${theme.border.light} group-hover:border-emerald-300/50 h-full`}>
          {/* Image Section */}
          <div className="relative h-40 overflow-hidden">
            {imageUrl ? (
              <img 
                src={imageUrl}
                alt={bookstore.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  parent.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center">
                      <div class="text-4xl text-white/90">${bookstore.logo || '📚'}</div>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                <div className="text-4xl text-white/90">
                  {bookstore.logo || '📚'}
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 bg-gradient-to-r ${categoryColor} text-white text-xs font-bold rounded shadow-sm`}>
                {bookstore.category || 'Ind'}
              </span>
            </div>
            
            {/* Rating Badge */}
            {(bookstore.rating || bookstore.rating === 0) && (
              <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-white/90 px-2 py-1 rounded shadow-sm">
                <span className="text-amber-500 text-xs">★</span>
                <span className="text-emerald-900 font-bold text-xs">
                  {typeof bookstore.rating === 'number' 
                    ? bookstore.rating.toFixed(1) 
                    : parseFloat(bookstore.rating || 0).toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-emerald-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
              {bookstore.name}
            </h3>
            <div className="flex items-center text-emerald-700 mb-2 text-xs">
              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{bookstore.location}</span>
            </div>

            <p className="text-xs text-emerald-600 mb-3 line-clamp-2 h-8">
              {bookstore.description || 'A sanctuary for book lovers'}
            </p>

            {/* Store Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {bookstore.established && (
                <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-xs">
                  Est. {bookstore.established}
                </span>
              )}
              {bookstore.website && (
                <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-xs">
                  Online
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-emerald-500">
              <span>View details</span>
              <span className="group-hover:text-emerald-700 transition-colors flex items-center">
                Visit
                <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Compact List Item Component
const CompactBookstoreListItem = ({ bookstore, index, categoryColors, getImageUrl, theme }) => {
  const categoryColor = categoryColors[bookstore.category] || categoryColors['Default'];
  const imageUrl = getImageUrl(bookstore.image_url);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <Link 
        to={`/bookstore/${bookstore.id}`}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.location.href = `/bookstore/${bookstore.id}`;
          }, 300);
        }}
        className="block"
      >
        <div className={`${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 border ${theme.border.light} group-hover:border-emerald-300/50`}>
          <div className="flex items-center p-3">
            {/* Image */}
            <div className="flex-shrink-0 mr-3">
              {imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-100">
                  <img 
                    src={imageUrl}
                    alt={bookstore.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center">
                          <div class="text-2xl text-white/90">${bookstore.logo || '📚'}</div>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                  <div className="text-2xl text-white/90">
                    {bookstore.logo || '📚'}
                  </div>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm text-emerald-900 truncate">
                  {bookstore.name}
                </h3>
                {(bookstore.rating || bookstore.rating === 0) && (
                  <div className="flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                    <span className="text-amber-500">★</span>
                    <span className="text-emerald-900 font-bold">
                      {typeof bookstore.rating === 'number' 
                        ? bookstore.rating.toFixed(1) 
                        : parseFloat(bookstore.rating || 0).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-emerald-700 mb-1 text-xs">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{bookstore.location}</span>
              </div>
              
              <p className="text-xs text-emerald-600 mb-2 line-clamp-1">
                {bookstore.description || 'Bookstore'}
              </p>
              
              <div className="flex items-center gap-1">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${categoryColor} text-white text-xs rounded`}>
                  {bookstore.category || 'Ind'}
                </span>
                {bookstore.established && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded">
                    Est. {bookstore.established}
                  </span>
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
      </Link>
    </motion.div>
  );
};

export default Bookstore;