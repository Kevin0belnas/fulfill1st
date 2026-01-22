import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Globe, 
  Mail, 
  Book, 
  CheckCircle, 
  XCircle, 
  Save, 
  X, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Building,
  ExternalLink,
  Loader2,
  Filter,
  RefreshCw,
  Copy,
  Star,
  Shield,
  Users,
  Tag,
  Info,
  Leaf,
  Sprout,
  Trees
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function for API calls
const apiRequest = async (url, method = 'GET', data = null, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    method,
    headers,
    credentials: 'include',
    ...options,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default function ManageTradPub() {
  const [publishers, setPublishers] = useState([]);
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingPublisher, setEditingPublisher] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    company_name: '',
    genre: '',
    website: '',
    guidelines: '',
    emails: [''],
    status: 'active'
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Unique genres for filter
  const [uniqueGenres, setUniqueGenres] = useState([]);
  
  // View mode
  const [viewMode, setViewMode] = useState('table');
  
  // Selected publishers for batch operations
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  
  // Ref for modal
  const modalRef = useRef(null);

  // Fetch publishers on component mount
  useEffect(() => {
    fetchPublishers();
  }, []);

  // Extract unique genres
  useEffect(() => {
    const genres = [...new Set(publishers
      .filter(p => p.genre)
      .map(p => p.genre)
      .flatMap(g => g.split(',').map(s => s.trim()))
      .filter(g => g)
    )];
    setUniqueGenres(genres);
  }, [publishers]);

  // Filter and paginate publishers
  useEffect(() => {
    let filtered = publishers;
    
    if (searchQuery) {
      filtered = filtered.filter(publisher =>
        publisher.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (publisher.genre && publisher.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (publisher.emails && publisher.emails.some(email => 
          email.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (publisher.website && publisher.website.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(publisher => publisher.status === statusFilter);
    }
    
    if (genreFilter !== 'all') {
      filtered = filtered.filter(publisher => 
        publisher.genre && publisher.genre.includes(genreFilter)
      );
    }
    
    setFilteredPublishers(filtered);
    setCurrentPage(1);
    setSelectedPublishers([]);
  }, [searchQuery, statusFilter, genreFilter, publishers]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPublishers = filteredPublishers.slice(startIndex, endIndex);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest(`${API_BASE_URL}/trad-publishers`);
      if (data.success) {
        setPublishers(data.data);
      }
    } catch (err) {
      console.error('Error fetching publishers:', err);
      setError(err.message || 'Failed to fetch publishers');
      showToastMessage(err.message || 'Failed to fetch publishers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmailField = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, '']
    });
  };

  const handleRemoveEmailField = (index) => {
    const newEmails = [...formData.emails];
    newEmails.splice(index, 1);
    setFormData({
      ...formData,
      emails: newEmails
    });
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData({
      ...formData,
      emails: newEmails
    });
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      genre: '',
      website: '',
      guidelines: '',
      emails: [''],
      status: 'active'
    });
    setEditingPublisher(null);
  };

  const handleShowModal = (type, publisher = null) => {
    setModalType(type);
    if (type === 'edit' && publisher) {
      setEditingPublisher(publisher);
      setFormData({
        company_name: publisher.company_name,
        genre: publisher.genre || '',
        website: publisher.website || '',
        guidelines: publisher.guidelines || '',
        emails: publisher.emails && publisher.emails.length > 0 ? [...publisher.emails] : [''],
        status: publisher.status || 'active'
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const filteredEmails = formData.emails.filter(email => email.trim() !== '');
    
    const submitData = {
      ...formData,
      emails: filteredEmails
    };
    
    try {
      setLoading(true);
      
      if (modalType === 'add') {
        const data = await apiRequest(`${API_BASE_URL}/trad-publishers`, 'POST', submitData);
        if (data.success) {
          setPublishers([data.data, ...publishers]);
          showToastMessage('Publisher added successfully!', 'success');
          handleCloseModal();
        }
      } else {
        const data = await apiRequest(
          `${API_BASE_URL}/trad-publishers/${editingPublisher.id}`,
          'PUT',
          submitData
        );
        if (data.success) {
          const updatedPublishers = publishers.map(pub =>
            pub.id === editingPublisher.id ? data.data : pub
          );
          setPublishers(updatedPublishers);
          showToastMessage('Publisher updated successfully!', 'success');
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving publisher:', err);
      setError(err.message || 'Failed to save publisher');
      showToastMessage(err.message || 'Failed to save publisher', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this publisher?')) {
      return;
    }
    
    try {
      setLoading(true);
      const data = await apiRequest(`${API_BASE_URL}/trad-publishers/${id}`, 'DELETE');
      if (data.success) {
        const updatedPublishers = publishers.filter(pub => pub.id !== id);
        setPublishers(updatedPublishers);
        showToastMessage('Publisher deleted successfully!', 'success');
      }
    } catch (err) {
      console.error('Error deleting publisher:', err);
      showToastMessage(err.message || 'Failed to delete publisher', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPublishers.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedPublishers.length} publisher(s)?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const promises = selectedPublishers.map(id => 
        apiRequest(`${API_BASE_URL}/trad-publishers/${id}`, 'DELETE')
      );
      await Promise.all(promises);
      
      const updatedPublishers = publishers.filter(pub => !selectedPublishers.includes(pub.id));
      setPublishers(updatedPublishers);
      setSelectedPublishers([]);
      showToastMessage(`${selectedPublishers.length} publisher(s) deleted successfully!`, 'success');
    } catch (err) {
      console.error('Error deleting publishers:', err);
      showToastMessage('Failed to delete publishers', 'error');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const handleExportCSV = () => {
    const headers = ['Company Name', 'Genre', 'Website', 'Emails', 'Status', 'Created Date', 'Guidelines'];
    const csvData = filteredPublishers.map(publisher => [
      publisher.company_name,
      publisher.genre || '',
      publisher.website || '',
      publisher.emails?.join('; ') || '',
      publisher.status,
      formatDate(publisher.created_at),
      publisher.guidelines?.replace(/[\n\r,]/g, ' ') || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `traditional-publishers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenreFilter('all');
    setShowFilters(false);
    fetchPublishers();
  };

  const toggleSelectPublisher = (id) => {
    setSelectedPublishers(prev =>
      prev.includes(id)
        ? prev.filter(pId => pId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPublishers.length === currentPublishers.length) {
      setSelectedPublishers([]);
    } else {
      setSelectedPublishers(currentPublishers.map(p => p.id));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToastMessage('Copied to clipboard!', 'success');
  };

  // Apply Bookstore page theme colors
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
      card: 'bg-white/95 backdrop-blur-sm',
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


  if (loading && publishers.length === 0) {
    return (
      <div className={`min-h-screen ${theme.bg.primary}`}>
        <div className="max-w-screen mx-auto">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-green-200 blur-xl rounded-full"></div>
                <Loader2 className="animate-spin h-16 w-16 text-emerald-600 mx-auto mb-4 relative z-10" />
              </div>
              <p className="mt-4 text-emerald-700 text-lg font-medium">
                Loading publishers...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg.primary} p-4 md:p-6`}>
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
        {/* Header - Matching Bookstore style */}
        <div className="mb-6">
          <div className="text-center mb-4">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {publishers.length} Publishers
            </div>
            
            {/* Title - Matching Bookstore */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Traditional Publishers
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              Manage traditional publishing companies and their contact information
            </p>
          </div>

          {/* Compact Stats - Matching Bookstore */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: publishers.length, label: 'Publishers' },
              { value: uniqueGenres.length, label: 'Genres' },
              { value: publishers.filter(p => p.status === 'active').length, label: 'Active' },
              { value: publishers.reduce((sum, p) => sum + (p.emails?.length || 0), 0), label: 'Emails' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/80 rounded-lg border border-emerald-100 shadow-sm">
                <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-emerald-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            <button
              onClick={() => handleShowModal('add')}
              className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all flex items-center justify-center gap-2`}
            >
              <Plus size={16} />
              Add Publisher
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white border border-emerald-100 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Search and Filters - Matching Bookstore style */}
        <div className="mb-5">
          <div className={`${theme.bg.card} rounded-xl ${theme.shadow.card} p-4 ${theme.border.light} border`}>
            <div className="flex flex-col lg:flex-row gap-3 mb-3">
              {/* Search Input - Matching Bookstore */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-emerald-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search publishers..."
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

              {/* View Toggle - Matching Bookstore */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' 
                    ? `${theme.gradient.primary} text-white shadow-sm` 
                    : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
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
              </div>

              {/* Filter Button - Matching Bookstore */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                  showFilters || statusFilter !== 'all' || genreFilter !== 'all'
                    ? `${theme.gradient.primary} text-white shadow-sm`
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                <Filter size={14} className="inline mr-1" />
                Filters
              </button>

              {/* Clear Filters - Matching Bookstore */}
              {(searchQuery || statusFilter !== 'all' || genreFilter !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-medium hover:bg-emerald-200 transition-all flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  Clear
                </button>
              )}
            </div>

            {/* Advanced Filters - Shown when showFilters is true */}
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
                            ? `${theme.gradient.primary} text-white shadow-sm`
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          statusFilter === 'active'
                            ? `${theme.gradient.primary} text-white shadow-sm`
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setStatusFilter('inactive')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          statusFilter === 'inactive'
                            ? `${theme.gradient.primary} text-white shadow-sm`
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
                    <select
                      value={genreFilter}
                      onChange={(e) => setGenreFilter(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-100 bg-white text-emerald-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400"
                    >
                      <option value="all">All Genres</option>
                      {uniqueGenres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count - Matching Bookstore */}
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

        {/* Bulk Actions - Compact version */}
        {selectedPublishers.length > 0 && (
          <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-emerald-600" />
                <span className="text-sm text-emerald-800">
                  {selectedPublishers.length} publisher(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-rose-500 text-white text-xs font-medium rounded hover:bg-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedPublishers([])}
                  className="px-3 py-1 border border-emerald-200 text-emerald-700 text-xs font-medium rounded hover:bg-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
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

        {/* Publishers Table/Grid View */}
        {viewMode === 'table' ? (
          <div className={`${theme.bg.card} rounded-xl ${theme.shadow.card} border ${theme.border.light} overflow-hidden mb-6`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPublishers.length === currentPublishers.length && currentPublishers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100/50">
                  {currentPublishers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center">
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
                              : 'Get started by adding your first traditional publisher'}
                          </p>
                          {!searchQuery && statusFilter === 'all' && genreFilter === 'all' && (
                            <button
                              onClick={() => handleShowModal('add')}
                              className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all flex items-center gap-2`}
                            >
                              <Plus size={16} />
                              Add First Publisher
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentPublishers.map((publisher) => (
                      <tr 
                        key={publisher.id} 
                        className={`hover:bg-emerald-50/50 transition-all duration-300 ${
                          selectedPublishers.includes(publisher.id) 
                            ? 'bg-emerald-50/70 border-l-4 border-l-emerald-400' 
                            : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedPublishers.includes(publisher.id)}
                            onChange={() => toggleSelectPublisher(publisher.id)}
                            className="rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
                                <Building className="text-emerald-600" size={16} />
                              </div>
                              <h4 className="font-semibold text-emerald-900 text-sm group">
                                {publisher.company_name}
                                <button
                                  onClick={() => copyToClipboard(publisher.company_name)}
                                  className="ml-1 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                  <Copy size={10} />
                                </button>
                              </h4>
                            </div>
                            {publisher.website && (
                              <a
                                href={publisher.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                              >
                                <Globe size={12} />
                                Visit Website
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {publisher.genre ? (
                            <div className="flex flex-wrap gap-1">
                              {publisher.genre.split(',').slice(0, 2).map((g, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                                >
                                  <Tag size={10} />
                                  {g.trim()}
                                </span>
                              ))}
                              {publisher.genre.split(',').length > 2 && (
                                <span className="text-xs text-emerald-600">
                                  +{publisher.genre.split(',').length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-emerald-400 italic text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {publisher.emails && publisher.emails.length > 0 ? (
                            <div className="space-y-1">
                              {publisher.emails.slice(0, 1).map((email, idx) => (
                                <div key={idx} className="flex items-center gap-1 group">
                                  <div className="p-1 rounded bg-emerald-50">
                                    <Mail className="text-emerald-500" size={12} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={`mailto:${email}`}
                                      className="text-xs text-emerald-700 hover:text-emerald-600 transition-colors truncate block"
                                    >
                                      {email}
                                    </a>
                                  </div>
                                </div>
                              ))}
                              {publisher.emails.length > 1 && (
                                <button 
                                  onClick={() => copyToClipboard(publisher.emails.join(', '))}
                                  className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                                >
                                  +{publisher.emails.length - 1} more
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-emerald-400 italic text-sm">No emails</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(publisher.status)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleShowModal('edit', publisher)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 transition-all duration-300 group"
                              title="Edit"
                            >
                              <Pencil size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(publisher.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 group"
                              title="Delete"
                            >
                              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentPublishers.length > 0 && (
              <div className="px-4 py-3 border-t border-emerald-100/50 bg-emerald-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-emerald-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredPublishers.length)} of {filteredPublishers.length} publishers
                    </div>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-2 py-1 rounded border border-emerald-200 bg-white text-emerald-900 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-300"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded border border-emerald-200 text-emerald-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage <= 2) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 1) {
                        pageNum = totalPages - 2 + i;
                      } else {
                        pageNum = currentPage - 1 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2.5 py-1.5 text-sm rounded transition-all duration-300 ${
                            currentPage === pageNum
                              ? `${theme.gradient.primary} text-white shadow-sm`
                              : 'border border-emerald-200 text-emerald-700 hover:bg-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <span className="px-1 text-emerald-400">...</span>
                    )}
                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-2.5 py-1.5 text-sm rounded transition-all duration-300 ${
                          currentPage === totalPages
                            ? `${theme.gradient.primary} text-white shadow-sm`
                            : 'border border-emerald-200 text-emerald-700 hover:bg-white'
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded border border-emerald-200 text-emerald-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View - Matching Bookstore style */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {currentPublishers.length === 0 ? (
              <div className="col-span-full bg-white/90 rounded-xl p-8 text-center border border-emerald-100 shadow-sm">
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
                      : 'Get started by adding your first traditional publisher'}
                  </p>
                  {!searchQuery && statusFilter === 'all' && genreFilter === 'all' && (
                    <button
                      onClick={() => handleShowModal('add')}
                      className={`px-4 py-2 ${theme.gradient.primary} text-white text-sm font-medium rounded-lg hover:shadow transition-all flex items-center gap-2`}
                    >
                      <Plus size={16} />
                      Add First Publisher
                    </button>
                  )}
                </div>
              </div>
            ) : (
              currentPublishers.map((publisher) => (
                <div 
                  key={publisher.id} 
                  className="group bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="p-4">
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
                            <span className="text-xs text-emerald-600/70">
                              {formatDate(publisher.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedPublishers.includes(publisher.id)}
                        onChange={() => toggleSelectPublisher(publisher.id)}
                        className="rounded border-emerald-300 text-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    
                    {publisher.genre && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {publisher.genre.split(',').slice(0, 3).map((g, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              <Tag size={10} />
                              {g.trim()}
                            </span>
                          ))}
                          {publisher.genre.split(',').length > 3 && (
                            <span className="text-xs text-emerald-600/70">
                              +{publisher.genre.split(',').length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {publisher.guidelines && (
                      <p className="text-sm text-emerald-700/80 mb-3 line-clamp-2 text-xs">
                        {publisher.guidelines}
                      </p>
                    )}
                    
                    <div className="space-y-1.5 mb-3">
                      {publisher.emails && publisher.emails.slice(0, 2).map((email, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                          <Mail className="text-emerald-500" size={12} />
                          <span className="text-emerald-700 truncate">{email}</span>
                        </div>
                      ))}
                      {publisher.emails && publisher.emails.length > 2 && (
                        <div className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer">
                          +{publisher.emails.length - 2} more emails
                        </div>
                      )}
                    </div>
                    
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
                    
                    <div className="flex items-center justify-between pt-3 border-t border-emerald-100/50">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleShowModal('edit', publisher)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 transition-all duration-300"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(publisher.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <button className="text-xs text-emerald-600/70 hover:text-emerald-700 transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats Section - Matching Bookstore */}
        {filteredPublishers.length > 0 && (
          <div className={`${theme.bg.card} rounded-xl p-4 border border-emerald-100 ${theme.shadow.card} mb-4`}>
            <h3 className="text-sm font-semibold text-emerald-900 mb-3">Collection Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: filteredPublishers.length, label: 'Filtered Publishers' },
                { value: uniqueGenres.length, label: 'Genres' },
                { value: filteredPublishers.filter(p => p.website).length, label: 'Websites' },
                { value: filteredPublishers.reduce((sum, p) => sum + (p.emails?.length || 0), 0), label: 'Emails' }
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

      {/* Modal - Updated to match Bookstore style */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gradient-to-br from-emerald-900/10 via-green-900/10 to-teal-900/10 backdrop-blur-sm transition-opacity duration-300"
              onClick={handleCloseModal}
            ></div>
            
            {/* Modal Content */}
            <div 
              ref={modalRef}
              className="relative bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-xl w-full max-w-md border border-emerald-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Sprout className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {modalType === 'add' ? 'Add New Publisher' : 'Edit Publisher'}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-800 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                        placeholder="Enter publisher company name"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Genre */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-1">
                          Genre
                        </label>
                        <input
                          type="text"
                          value={formData.genre}
                          onChange={(e) => setFormData({...formData, genre: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                          placeholder="e.g., Fiction, Non-fiction"
                        />
                      </div>
                      
                      {/* Website */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-800 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    {/* Guidelines */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-800 mb-1">
                        Submission Guidelines
                      </label>
                      <textarea
                        value={formData.guidelines}
                        onChange={(e) => setFormData({...formData, guidelines: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm resize-none"
                        placeholder="Enter submission guidelines..."
                      />
                    </div>
                    
                    {/* Emails */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-emerald-800">
                          Contact Emails
                        </label>
                        <button
                          type="button"
                          onClick={handleAddEmailField}
                          className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus size={12} />
                          Add Email
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {formData.emails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-emerald-200 bg-white text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm"
                                placeholder="contact@example.com"
                              />
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveEmailField(index)}
                                className="p-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-all duration-300"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-800 mb-2">
                        Status
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            formData.status === 'active'
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-emerald-300'
                          }`}>
                            {formData.status === 'active' && (
                              <CheckCircle size={12} className="text-white" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="status"
                            value="active"
                            checked={formData.status === 'active'}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="hidden"
                          />
                          <span className="text-sm text-emerald-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            formData.status === 'inactive'
                              ? 'border-emerald-300 bg-emerald-300'
                              : 'border-emerald-300'
                          }`}>
                            {formData.status === 'inactive' && (
                              <XCircle size={12} className="text-white" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name="status"
                            value="inactive"
                            checked={formData.status === 'inactive'}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                            className="hidden"
                          />
                          <span className="text-sm text-emerald-700">Inactive</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="flex gap-2 mt-6 pt-4 border-t border-emerald-100/50">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-white transition-all duration-300 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          {modalType === 'add' ? 'Add Publisher' : 'Update'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}