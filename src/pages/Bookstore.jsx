import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Bookstore = () => {
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredBookstore, setHoveredBookstore] = useState(null);

  useEffect(() => {
    fetchBookstores();
  }, []);

  const fetchBookstores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/bookstores`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBookstores(data.data || []);
      } else {
        setBookstores(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookstores:', error);
      setError('Failed to load bookstores. Please check if the backend server is running.');
      setBookstores([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookstores based on search and category
  const filteredBookstores = bookstores.filter(bookstore => {
    const matchesSearch = bookstore.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || bookstore.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from actual database
  const categories = [...new Set(bookstores.map(b => b.category).filter(Boolean))];

  // Function to get image URL - FIXED
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // The backend returns paths like: /uploads/bookstores/filename.jpg
  // Construct full URL to your API domain
  return `https://api.fulfill1st.com${imageUrl}`;
};

  // Category color mapping
  const categoryColors = {
    'Independent': 'from-blue-500 to-cyan-500',
    'Chain': 'from-purple-500 to-pink-500',
    'Specialty': 'from-green-500 to-emerald-500',
    'Online': 'from-orange-500 to-red-500',
    'Academic': 'from-indigo-500 to-purple-500',
    'Used': 'from-yellow-500 to-amber-500',
    'Default': 'from-gray-500 to-gray-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-xl text-gray-600 animate-pulse">Discovering amazing bookstores...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200"
        >
          {/* Emoji and Title */}
          <div className="text-7xl md:text-8xl mb-8 animate-pulse">📚✨</div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Bookstores Are Coming Soon!
          </h3>
          
          {/* Main Message */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">
              Our bookstore directory is currently being prepared with amazing literary destinations.
            </p>
            <p className="text-gray-500">
              We're curating the best bookstores to bring you an exceptional browsing experience.
            </p>
          </div>
          
          {/* Countdown/Schedule Box */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Coming Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">In Development</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Stay tuned for the launch of our exclusive bookstore network!
            </p>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-medium text-gray-900 mb-1">Curated Selection</h4>
              <p className="text-sm text-gray-500">Handpicked bookstores worldwide</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <h4 className="font-medium text-gray-900 mb-1">Verified Reviews</h4>
              <p className="text-sm text-gray-500">Authentic reader experiences</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📍</div>
              <h4 className="font-medium text-gray-900 mb-1">Interactive Maps</h4>
              <p className="text-sm text-gray-500">Easy location discovery</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={fetchBookstores}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Check Status
            </button>
            
            <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow border border-gray-300">
              Notify Me on Launch
            </button>
          </div>
          
          {/* Optional: Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 underline">
                support@example.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              {bookstores.length} Bookstore Partners
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Literary Havens
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-gray-700">Our Bookstore Network</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Discover curated bookstores from around the world. Each offers a unique reading experience and connects you with amazing literature.
            </motion.p>
          </div>

          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search by name, location, or description..."
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select 
                    className="appearance-none w-full lg:w-auto bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Stores
                </button>
                {categories.slice(0, 4).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                <span className="text-blue-600">{filteredBookstores.length}</span> Bookstore{filteredBookstores.length !== 1 ? 's' : ''} Found
              </h2>
              {selectedCategory && (
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bookstore Grid */}
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {filteredBookstores.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-200/50 mb-8"
            >
              <div className="text-8xl mb-8 animate-pulse">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No bookstores found</h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria' 
                  : 'No bookstores available in the database yet'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredBookstores.map((bookstore, index) => {
                  const categoryColor = categoryColors[bookstore.category] || categoryColors['Default'];
                  const isHovered = hoveredBookstore === bookstore.id;
                  
                  return (
                    <motion.div
                      key={bookstore.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      onMouseEnter={() => setHoveredBookstore(bookstore.id)}
                      onMouseLeave={() => setHoveredBookstore(null)}
                      className="relative group"
                    >
                      {/* Glow Effect */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${categoryColor} rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000 ${isHovered ? 'opacity-30' : ''}`}></div>
                      
                      {/* Card Container */}
                      <Link to={`/bookstore/${bookstore.id}`}>
                        <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 h-full">
                          {/* Image Section with Gradient Overlay */}
                          <div className="relative h-56 overflow-hidden">
                            {bookstore.image_url ? (
                              <>
                                <img 
                                  src={getImageUrl(bookstore.image_url)}
                                  alt={bookstore.name}
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const parent = e.target.parentElement;
                                    parent.innerHTML = `
                                      <div class="w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center">
                                        <div class="text-6xl text-white/80">${bookstore.logo || '📚'}</div>
                                      </div>
                                    `;
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </>
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${categoryColor} flex items-center justify-center`}>
                                <div className="text-7xl text-white/80 transform group-hover:scale-125 transition-transform duration-500">
                                  {bookstore.logo || '📚'}
                                </div>
                              </div>
                            )}
                            
                            {/* Category Badge */}
                            <div className="absolute top-4 right-4">
                              <span className={`px-4 py-1.5 bg-gradient-to-r ${categoryColor} text-white text-xs font-bold rounded-full shadow-lg`}>
                                {bookstore.category || 'Independent'}
                              </span>
                            </div>
                            
                            {/* Rating Badge */}
                            {(bookstore.rating || bookstore.rating === 0) && (
                              <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                                <span className="text-yellow-500">★</span>
                                <span className="text-gray-900 font-bold">
                                  {typeof bookstore.rating === 'number' 
                                    ? bookstore.rating.toFixed(1) 
                                    : parseFloat(bookstore.rating || 0).toFixed(1)}
                                </span>
                                {bookstore.reviews > 0 && (
                                  <span className="text-gray-600 text-xs">({bookstore.reviews})</span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Content Section */}
                          <div className="p-6">
                            {/* Store Header */}
                            <div className="mb-4">
                              <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                                {bookstore.name}
                              </h3>
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">{bookstore.location}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                              {bookstore.description || 'A wonderful bookstore waiting for your discovery.'}
                            </p>

                            {/* Store Features */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {bookstore.established && (
                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Est. {bookstore.established}
                                </span>
                              )}
                              {bookstore.website && (
                                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                  </svg>
                                  Online
                                </span>
                              )}
                            </div>

                            {/* Footer with CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="text-sm text-gray-500">
                                View details
                              </div>
                              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                                Explore Store
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Hover Effect Line */}
                          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {bookstores.length}
              </div>
              <div className="text-gray-700 font-medium">Total Stores</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {categories.length}
              </div>
              <div className="text-gray-700 font-medium">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {bookstores.filter(b => b.established).length}
              </div>
              <div className="text-gray-700 font-medium">Established</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                {bookstores.filter(b => b.website).length}
              </div>
              <div className="text-gray-700 font-medium">Online</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-lg mb-6">
            Want to add your bookstore to our network?
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Become a Partner
          </button>
        </motion.div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Bookstore;