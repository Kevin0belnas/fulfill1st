import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Globe, 
  Mail, 
  Book, 
  Tag, 
  Search, 
  Filter, 
  ChevronDown, 
  RefreshCw,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Award,
  Star,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function TradePub() {
  const [publishers, setPublishers] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch publishers on component mount
  useEffect(() => {
    fetchPublishers();
  }, []);

  // Extract unique genres for filter
  const uniqueGenres = [...new Set(publishers
    .filter(p => p.genre)
    .flatMap(p => p.genre.split(',').map(g => g.trim()))
    .filter(g => g)
  )].sort();

  // Filter publishers based on search and filters
  useEffect(() => {
    let filtered = publishers;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(publisher =>
        publisher.company_name.toLowerCase().includes(query) ||
        (publisher.genre && publisher.genre.toLowerCase().includes(query)) ||
        (publisher.emails && publisher.emails.some(email => 
          email.toLowerCase().includes(query)
        )) ||
        (publisher.guidelines && publisher.guidelines.toLowerCase().includes(query))
      );
    }
    
    // Genre filter
    if (genreFilter !== 'all') {
      filtered = filtered.filter(publisher => 
        publisher.genre && publisher.genre.includes(genreFilter)
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(publisher => publisher.status === statusFilter);
    }
    
    setFilteredPublishers(filtered);
  }, [searchQuery, genreFilter, statusFilter, publishers]);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/trad-publishers`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setPublishers(data.data);
        showToastMessage('Publishers loaded successfully!', 'success');
      } else {
        throw new Error(data.error || 'Failed to load publishers');
      }
    } catch (err) {
      console.error('Error fetching publishers:', err);
      setError(err.message);
      showToastMessage(err.message, 'error');
      setPublishers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setGenreFilter('all');
    setStatusFilter('all');
    showToastMessage('Filters cleared!', 'success');
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={12} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
        <XCircle size={12} />
        Inactive
      </span>
    );
  };

  const getGenreColor = (genre) => {
    const colors = {
      'fiction': 'from-emerald-500 to-green-600',
      'non-fiction': 'from-green-500 to-emerald-600',
      'academic': 'from-lime-400 to-green-500',
      'children': 'from-emerald-400 to-cyan-500',
      'science': 'from-green-400 to-teal-500',
      'biography': 'from-teal-400 to-cyan-500',
      'history': 'from-amber-400 to-yellow-500',
      'poetry': 'from-purple-400 to-pink-500'
    };
    
    const genreLower = genre.toLowerCase();
    for (const [key, value] of Object.entries(colors)) {
      if (genreLower.includes(key)) {
        return value;
      }
    }
    
    return 'from-emerald-400 to-green-500';
  };

  // Calculate stats
  const stats = {
    total: publishers.length,
    active: publishers.filter(p => p.status === 'active').length,
    genres: uniqueGenres.length,
    emails: publishers.reduce((sum, p) => sum + (p.emails?.length || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-sm">
                  <Book className="text-white" size={28} />
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-emerald-200/50 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-64 bg-emerald-200/50 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-emerald-100">
                <div className="h-4 w-24 bg-emerald-200/50 rounded mb-3 animate-pulse"></div>
                <div className="h-8 w-16 bg-emerald-200/50 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-emerald-200/50 rounded animate-pulse"></div>
                  <div className="h-4 bg-emerald-200/50 rounded animate-pulse"></div>
                  <div className="h-10 bg-emerald-200/50 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-right-5 duration-300`}>
          <div className={`rounded-xl p-4 shadow-lg border backdrop-blur-sm ${
            toastType === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
              : 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                toastType === 'success' 
                  ? 'bg-emerald-100' 
                  : 'bg-rose-100'
              }`}>
                {toastType === 'success' ? (
                  <CheckCircle className="text-emerald-600" size={20} />
                ) : (
                  <AlertCircle className="text-rose-600" size={20} />
                )}
              </div>
              <p className={`font-medium ${
                toastType === 'success' 
                  ? 'text-emerald-800' 
                  : 'text-rose-800'
              }`}>
                {toastMessage}
              </p>
              <button
                onClick={() => setShowToast(false)}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center mb-4">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {publishers.length} Traditional Publishers
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Traditional Publishing Houses
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              Discover established publishing companies for manuscript submissions
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: stats.total, label: 'Publishers', icon: Building },
              { value: stats.active, label: 'Active', icon: CheckCircle },
              { value: stats.genres, label: 'Genres', icon: Tag },
              { value: stats.emails, label: 'Contacts', icon: Mail }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/80 rounded-lg border border-emerald-100 shadow-sm">
                <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-emerald-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-5">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg shadow-emerald-100/40 p-4 border border-emerald-100/70">
            <div className="flex flex-col lg:flex-row gap-3 mb-3">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search publishers by name, genre, or email..."
                    className="w-full pl-10 pr-8 py-2.5 bg-white border border-emerald-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm text-emerald-900 placeholder-emerald-500/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-emerald-500 hover:text-emerald-700"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  showFilters || genreFilter !== 'all' || statusFilter !== 'all'
                    ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-white shadow-sm'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                <Filter size={14} className="inline mr-1" />
                Filters
              </button>

              {/* Clear Filters */}
              {(searchQuery || genreFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium hover:bg-emerald-200 transition-all flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  Clear
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-emerald-100/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-emerald-700 mb-2">
                      Status Filter
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          statusFilter === 'all'
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-white shadow-sm'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        All Status
                      </button>
                      <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          statusFilter === 'active'
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-white shadow-sm'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setStatusFilter('inactive')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          statusFilter === 'inactive'
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-white shadow-sm'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-emerald-700 mb-2">
                      Genre Filter
                    </label>
                    <div className="relative">
                      <select
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="w-full px-3 py-1.5 pr-8 rounded-lg border border-emerald-100 bg-white text-emerald-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 appearance-none cursor-pointer"
                      >
                        <option value="all">All Genres</option>
                        {uniqueGenres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-emerald-500">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-emerald-900">
              {filteredPublishers.length} publisher{filteredPublishers.length !== 1 ? 's' : ''} found
            </h2>
            {(statusFilter !== 'all' || genreFilter !== 'all') && (
              <div className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                {statusFilter !== 'all' && `Status: ${statusFilter}`}
                {statusFilter !== 'all' && genreFilter !== 'all' && ' • '}
                {genreFilter !== 'all' && `Genre: ${genreFilter}`}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600" />
              <span className="text-sm text-rose-800">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-rose-400 hover:text-rose-600"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Publishers Grid */}
        {filteredPublishers.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center border border-emerald-100 shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 mb-4">
                <Book className="text-emerald-400" size={48} />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">
                No publishers found
              </h3>
              <p className="text-emerald-700/80 mb-4 max-w-md text-sm">
                {searchQuery || statusFilter !== 'all' || genreFilter !== 'all'
                  ? 'Try adjusting your filters to find what you\'re looking for'
                  : 'No traditional publishers available at the moment'}
              </p>
              {(searchQuery || statusFilter !== 'all' || genreFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 text-white text-sm font-medium rounded-lg hover:shadow transition-all flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredPublishers.map((publisher) => (
              <div 
                key={publisher.id} 
                className="group bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:border-emerald-300"
              >
                <div className="p-4">
                  {/* Publisher Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                        <Building className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-sm line-clamp-1">
                          {publisher.company_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(publisher.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Genre Tags */}
                  {publisher.genre && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {publisher.genre.split(',').slice(0, 2).map((g, idx) => {
                          const genreText = g.trim();
                          return (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getGenreColor(genreText)} text-white border border-emerald-200`}
                            >
                              <Tag size={10} />
                              {genreText}
                            </span>
                          );
                        })}
                        {publisher.genre.split(',').length > 2 && (
                          <span className="text-xs text-emerald-600/70">
                            +{publisher.genre.split(',').length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Guidelines Preview */}
                  {publisher.guidelines && (
                    <p className="text-sm text-emerald-700/80 mb-3 line-clamp-2 text-xs">
                      {publisher.guidelines}
                    </p>
                  )}
                  
                  {/* Contact Information */}
                  <div className="space-y-1.5 mb-3">
                    {publisher.emails && publisher.emails.slice(0, 2).map((email, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs">
                        <Mail className="text-emerald-500" size={12} />
                        <a 
                          href={`mailto:${email}`}
                          className="text-emerald-700 hover:text-emerald-600 truncate"
                        >
                          {email}
                        </a>
                      </div>
                    ))}
                    {publisher.emails && publisher.emails.length > 2 && (
                      <div className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">
                        +{publisher.emails.length - 2} more email{publisher.emails.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                  
                  {/* Website */}
                  {publisher.website && (
                    <a
                      href={publisher.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 mb-3 group/link"
                    >
                      <Globe size={12} />
                      Visit Website
                      <ExternalLink size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {filteredPublishers.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-emerald-100 shadow-lg shadow-emerald-100/40 mb-4">
            <h3 className="text-sm font-semibold text-emerald-900 mb-3">Publishing Insights</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: filteredPublishers.length, label: 'Filtered Publishers', icon: Building },
                { value: uniqueGenres.length, label: 'Total Genres', icon: Tag },
                { value: filteredPublishers.filter(p => p.website).length, label: 'Websites', icon: Globe },
                { value: filteredPublishers.reduce((sum, p) => sum + (p.emails?.length || 0), 0), label: 'Email Contacts', icon: Mail }
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
    </div>
  );
}