import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorMedia = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // State for social links
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredAuthor, setHoveredAuthor] = useState(null);

  // Platform data with enhanced styling
  const platformData = {
    'twitter': { icon: '🐦', label: 'Twitter', color: 'from-blue-400 to-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
    'facebook': { icon: '📘', label: 'Facebook', color: 'from-blue-600 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
    'instagram': { icon: '📷', label: 'Instagram', color: 'from-pink-500 to-purple-500', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700' },
    'linkedin': { icon: '💼', label: 'LinkedIn', color: 'from-blue-700 to-blue-800', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
    'youtube': { icon: '▶️', label: 'YouTube', color: 'from-red-500 to-red-600', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
    'website': { icon: '🌐', label: 'Website', color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-700' },
    'goodreads': { icon: '📚', label: 'Goodreads', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700' },
    'amazon': { icon: '🛒', label: 'Amazon', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700' },
    'blog': { icon: '✍️', label: 'Blog', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700' },
    'other': { icon: '🔗', label: 'Other', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-700' }
  };

  // Fetch social media links on component mount
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/social-media-links`);
      
      if (!response.ok) throw new Error('Failed to fetch social media links');
      
      const data = await response.json();
      // Filter only active links for public display
      const activeLinks = data.filter(link => link.isActive);
      setSocialLinks(activeLinks);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      toast.error('Failed to load authors');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique authors from social links
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
    
    // Convert to array and add counts
    return Array.from(authorMap.values()).map(author => ({
      ...author,
      totalLinks: author.links.length,
      platforms: Array.from(author.platforms)
    })).sort((a, b) => b.totalLinks - a.totalLinks);
  };

  // Get filtered authors based on search
  const getFilteredAuthors = () => {
    const uniqueAuthors = getUniqueAuthors();
    
    if (!searchTerm) return uniqueAuthors;
    
    return uniqueAuthors.filter(author =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Open author profile modal
  const openAuthorProfile = (author) => {
    setSelectedAuthor(author);
  };

  // Close author profile modal
  const closeAuthorProfile = () => {
    setSelectedAuthor(null);
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

  const stats = getStats();
  const filteredAuthors = getFilteredAuthors();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Discovering amazing authors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Enhanced Hero Section with Parallax */}
      <div className="relative overflow-hidden pt-24 pb-32 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-1/4 left-1/4 animate-float text-4xl opacity-20">👤</div>
          <div className="absolute top-1/3 right-1/4 animate-float animation-delay-1000 text-4xl opacity-20">📚</div>
          <div className="absolute bottom-1/4 left-1/3 animate-float animation-delay-2000 text-4xl opacity-20">✍️</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-pulse">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
            <span className="text-white text-sm font-medium">Live • {stats.totalAuthors} Authors Active</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Amplified Voices
            </span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl text-white/90">Featured Authors</span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            We're giving talented authors the spotlight they deserve. 
            Follow their journey across platforms and discover amazing literary works.
          </p>
          
          {/* Interactive Stats with Hover Effects */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: stats.totalAuthors, label: 'Featured Authors', icon: '👥', color: 'from-blue-500 to-cyan-500' },
              { value: stats.totalLinks, label: 'Social Profiles', icon: '🔗', color: 'from-purple-500 to-pink-500' },
              { value: stats.uniquePlatforms, label: 'Platforms', icon: '📱', color: 'from-green-500 to-teal-500' },
              { value: stats.mostConnectedAuthor.split(' ')[0], label: 'Most Connected', icon: '🏆', color: 'from-yellow-500 to-orange-500' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Floating Search Bar */}
        <div className="sticky top-4 z-20 mb-12">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-1 max-w-2xl mx-auto border border-gray-200/50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for authors by name, email, or description..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl bg-transparent focus:outline-none focus:ring-0 placeholder-gray-400"
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
          
          {/* Quick Filter Chips */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {['All Authors', 'Most Popular', 'Newest', 'Trending'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.toLowerCase().replace(' ', '')
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Authors Grid */}
        {filteredAuthors.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-200/50 mb-16">
            <div className="text-8xl mb-8 animate-pulse">🔍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No matching authors found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              {searchTerm ? `We couldn't find any authors matching "${searchTerm}"` : 'Check back soon for new featured authors!'}
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Authors
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Authors <span className="text-blue-600">({filteredAuthors.length})</span>
                </h2>
                <div className="text-gray-500">
                  Sorted by <span className="font-semibold text-gray-700">Most Connected</span>
                </div>
              </div>
            </div>

            {/* Enhanced Authors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredAuthors.map((author, index) => {
                const platformDataObj = author.platforms.map(p => platformData[p]);
                const isHovered = hoveredAuthor === author.name;
                
                return (
                  <div
                    key={author.name}
                    className="group relative"
                    onMouseEnter={() => setHoveredAuthor(author.name)}
                    onMouseLeave={() => setHoveredAuthor(null)}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-1000 ${isHovered ? 'opacity-30' : ''}`}></div>
                    
                    {/* Author Card */}
                    <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                      {/* Card Header with Gradient */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}></div>
                        
                        {/* Author Avatar */}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                          <div className="relative">
                            {author.image ? (
                              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                                <img 
                                  src={`${API_BASE_URL}${author.image}`} 
                                  alt={author.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-2xl flex items-center justify-center text-3xl font-bold text-blue-700 transform group-hover:scale-110 transition-transform duration-500">
                                {author.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {/* Verified Badge */}
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full shadow-lg">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="pt-16 pb-6 px-6 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {author.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {author.description || 'Featured author with amplified social presence'}
                        </p>
                        
                        {/* Platform Badges */}
                        <div className="flex justify-center gap-2 mb-6 flex-wrap">
                          {author.platforms.slice(0, 3).map((platform, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${platformData[platform].bg} ${platformData[platform].border} ${platformData[platform].text} transform group-hover:scale-105 transition-transform duration-300`}
                            >
                              <span className="mr-1.5">{platformData[platform].icon}</span>
                              {platformData[platform].label}
                            </span>
                          ))}
                          {author.platforms.length > 3 && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium">
                              +{author.platforms.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="flex justify-center gap-4 text-sm text-gray-500 mb-6">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            {author.totalLinks} profiles
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Amplified
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => openAuthorProfile(author)}
                          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg group-hover:shadow-xl"
                        >
                          <span className="flex items-center justify-center">
                            View Profile
                            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </button>
                      </div>

                      {/* Hover Effect Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Enhanced CTA Section */}
        <div className="relative overflow-hidden rounded-3xl mb-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Amplify Your Voice?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our exclusive community of authors receiving premium social media amplification.
              Reach thousands of new readers and grow your literary presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Get Started Free
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                Schedule a Demo
              </button>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 animate-float text-4xl opacity-20">📚</div>
          <div className="absolute bottom-4 right-4 animate-float animation-delay-1500 text-4xl opacity-20">✍️</div>
        </div>
      </div>

      {/* Enhanced Author Profile Modal */}
      {selectedAuthor && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"></div>
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header with Gradient */}
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {selectedAuthor.image ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/30">
                        <img 
                          src={`${API_BASE_URL}${selectedAuthor.image}`} 
                          alt={selectedAuthor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white/30 flex items-center justify-center text-2xl font-bold text-blue-700">
                        {selectedAuthor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedAuthor.name}</h3>
                      <p className="text-blue-100">Amplified Author Profile</p>
                    </div>
                  </div>
                  <button
                    onClick={closeAuthorProfile}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Author Bio */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">About This Author</h4>
                  <p className="text-gray-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    {selectedAuthor.description || 'This author is part of our amplified voices program, receiving premium social media exposure across multiple platforms to connect with readers worldwide.'}
                  </p>
                </div>

                {/* Social Links Grid */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Connect Across Platforms</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAuthor.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative overflow-hidden rounded-2xl p-6 border ${platformData[link.platform].border} ${platformData[link.platform].bg} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                      >
                        {/* Background Gradient on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${platformData[link.platform].color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-4xl mr-4">{platformData[link.platform].icon}</span>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">
                                {platformData[link.platform].label}
                              </div>
                              {link.username && (
                                <div className="text-gray-600">@{link.username}</div>
                              )}
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        {link.description && (
                          <div className="relative mt-4 text-sm text-gray-600">
                            {link.description}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Author Stats */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Amplification Stats</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {selectedAuthor.totalLinks}
                      </div>
                      <div className="text-gray-600">Social Profiles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                        {selectedAuthor.platforms.length}
                      </div>
                      <div className="text-gray-600">Platforms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                        Active
                      </div>
                      <div className="text-gray-600">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                        ★★★★★
                      </div>
                      <div className="text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 text-sm">
                    Last updated • Just now
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeAuthorProfile}
                      className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                      Follow All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 pb-12 relative overflow-hidden">
        {/* Footer Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl mb-4">📚✨</div>
              <h3 className="text-2xl font-bold mb-4">Amplified Voices</h3>
              <p className="text-gray-400">
                We help talented authors shine brighter in the digital space.
                Join our mission to amplify literary voices worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['All Authors', 'How It Works', 'Success Stories', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Stay Connected</h4>
              <p className="text-gray-400 mb-6">
                Subscribe to our newsletter for updates on featured authors and amplification opportunities.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-r-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <div className="text-gray-400">
              © {new Date().getFullYear()} Amplified Voices. All rights reserved.
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Made with ❤️ for the literary community
            </div>
          </div>
        </div>
      </footer>

      {/* Global Animations */}
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
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

export default AuthorMedia;