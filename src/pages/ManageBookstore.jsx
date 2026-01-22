// pages/ManageBookstores.jsx
import { useState, useEffect, useRef } from 'react';
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

const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const config = ENV_CONFIG[isProduction ? 'production' : 'development'];

const ManageBookstores = () => {
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBookstore, setSelectedBookstore] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [stats, setStats] = useState({ total: 0, categories: 0, active: 0 });
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, inactive
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  // Premium green theme
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
      secondary: 'bg-gradient-to-r from-emerald-100/50 to-teal-100/50',
      card: 'bg-white/95 backdrop-blur-sm',
      modal: 'bg-white/90 backdrop-blur-xl'
    },
    text: {
      primary: 'text-emerald-900',
      secondary: 'text-emerald-700',
      light: 'text-emerald-600',
      accent: 'text-teal-600',
      white: 'text-white'
    },
    border: {
      light: 'border-emerald-100',
      medium: 'border-emerald-200',
      dark: 'border-emerald-300'
    },
    gradient: {
      primary: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      secondary: 'bg-gradient-to-r from-emerald-400 to-teal-400',
      accent: 'bg-gradient-to-r from-lime-500 to-green-500',
      dark: 'bg-gradient-to-r from-emerald-700 to-teal-700'
    },
    category: {
      Independent: 'from-emerald-500 to-emerald-600',
      Modern: 'from-blue-500 to-cyan-500',
      Premium: 'from-purple-500 to-pink-500',
      Indie: 'from-orange-500 to-amber-500',
      Academic: 'from-indigo-500 to-purple-500'
    }
  };

  useEffect(() => {
    fetchBookstores();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [bookstores]);

  const fetchBookstores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/bookstores`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setBookstores(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookstores:', error);
      showToast('Failed to load bookstores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const categories = [...new Set(bookstores.map(b => b.category).filter(Boolean))];
    setStats({
      total: bookstores.length,
      categories: categories.length,
      active: bookstores.filter(b => b.rating >= 4).length
    });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/bookstores/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        showToast('Bookstore deleted successfully', 'success');
        fetchBookstores();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting bookstore:', error);
      showToast('Failed to delete bookstore. Please try again.', 'error');
    }
  };

  const handleEdit = (bookstore) => {
    setSelectedBookstore(bookstore);
    setFormData({
      name: bookstore.name || '',
      location: bookstore.location || '',
      address: bookstore.address || '',
      established: bookstore.established || '',
      description: bookstore.description || '',
      email: bookstore.email || '',
      phone: bookstore.phone || '',
      website: bookstore.website || '',
      logo: bookstore.logo || '📚',
      category: bookstore.category || 'Independent',
      rating: bookstore.rating || 0,
      reviews: bookstore.reviews || 0,
      image: null
    });
    
    if (bookstore.image_url) {
      const imageUrl = bookstore.image_url.startsWith('http') 
        ? bookstore.image_url 
        : `${config.imageBaseUrl}${bookstore.image_url}`;
      setPreviewImage(imageUrl);
    }
    
    setShowEditModal(true);
  };

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    established: '',
    description: '',
    email: '',
    phone: '',
    website: '',
    logo: '📚',
    category: 'Independent',
    rating: 0,
    reviews: 0,
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showToast('Image size should be less than 10MB', 'error');
          return;
        }
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          showToast('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
          return;
        }
        
        setFormData(prev => ({ ...prev, [name]: file }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (name === 'rating') {
      // Round rating to one decimal place
      const roundedValue = Math.round(parseFloat(value) * 10) / 10;
      setFormData(prev => ({ ...prev, [name]: roundedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${config.apiBaseUrl}/bookstores`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showToast('Bookstore added successfully!', 'success');
        setShowAddModal(false);
        resetForm();
        fetchBookstores();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error adding bookstore:', error);
      showToast('Failed to add bookstore. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${config.apiBaseUrl}/bookstores/${selectedBookstore.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        showToast('Bookstore updated successfully!', 'success');
        setShowEditModal(false);
        resetForm();
        fetchBookstores();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error updating bookstore:', error);
      showToast('Failed to update bookstore. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      established: '',
      description: '',
      email: '',
      phone: '',
      website: '',
      logo: '📚',
      category: 'Independent',
      rating: 0,
      reviews: 0,
      image: null
    });
    setPreviewImage(null);
    setSelectedBookstore(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBookstores = [...bookstores].sort((a, b) => {
    if (sortConfig.key === 'rating') {
      return sortConfig.direction === 'ascending' 
        ? (a.rating || 0) - (b.rating || 0)
        : (b.rating || 0) - (a.rating || 0);
    } else if (sortConfig.key === 'established') {
      return sortConfig.direction === 'ascending' 
        ? (a.established || 0) - (b.established || 0)
        : (b.established || 0) - (a.established || 0);
    } else {
      return sortConfig.direction === 'ascending'
        ? (a[sortConfig.key] || '').localeCompare(b[sortConfig.key] || '')
        : (b[sortConfig.key] || '').localeCompare(a[sortConfig.key] || '');
    }
  });

  const filteredBookstores = sortedBookstores.filter(bookstore => {
    const matchesSearch = bookstore.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookstore.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'active' && bookstore.rating >= 4) ||
                         (activeFilter === 'inactive' && bookstore.rating < 4);
    
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(bookstores.map(b => b.category).filter(Boolean))];

  // Loading skeleton
  if (loading && bookstores.length === 0) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} p-4 sm:p-6 lg:p-8`}>
        <div className="max-w-screen mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-emerald-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 w-64 bg-emerald-200 rounded animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-emerald-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-emerald-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg.primary} p-4 sm:p-6 lg:p-8`}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl ${
              toast.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-rose-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? '✅' : '❌'}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-screen mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2"
            >
              Manage Bookstores
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-600"
            >
              Manage all bookstore partners in your literary network
            </motion.p>
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className={`${theme.gradient.primary} text-white font-medium py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg flex items-center gap-2 self-start lg:self-center`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Bookstore
          </motion.button>
        </div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Total Stores</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.total}</p>
              </div>
              <div className="text-2xl text-emerald-500">📚</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Categories</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.categories}</p>
              </div>
              <div className="text-2xl text-emerald-500">🏷️</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(stats.categories * 20, 100)}%` }}></div>
            </div>
          </div>

          <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Highly Rated (4+)</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.active}</p>
              </div>
              <div className="text-2xl text-emerald-500">⭐</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}></div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg mb-6`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, location, or category..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 placeholder-emerald-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeFilter === 'all'
                    ? `${theme.gradient.primary} text-white shadow-lg`
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                All Stores
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeFilter === 'active'
                    ? `${theme.gradient.primary} text-white shadow-lg`
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                Highly Rated
              </motion.button>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={activeFilter === 'all' ? '' : activeFilter}
                onChange={(e) => setActiveFilter(e.target.value || 'all')}
                className="w-full lg:w-auto px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>{category}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bookstores Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${theme.bg.card} rounded-2xl shadow-xl overflow-hidden border ${theme.border.light}`}
        >
          {filteredBookstores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-100">
                <thead className="bg-emerald-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Bookstore
                        <svg className={`w-4 h-4 transition-transform ${sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-1">
                        Rating
                        <svg className={`w-4 h-4 transition-transform ${sortConfig.key === 'rating' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors"
                      onClick={() => handleSort('established')}
                    >
                      <div className="flex items-center gap-1">
                        Established
                        <svg className={`w-4 h-4 transition-transform ${sortConfig.key === 'established' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-emerald-50">
                  {filteredBookstores.map((bookstore) => (
                    <motion.tr 
                      key={bookstore.id} 
                      className="hover:bg-emerald-50/50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="text-2xl mr-3">{bookstore.logo || '📚'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-emerald-900">{bookstore.name}</div>
                            <div className="text-sm text-emerald-600 truncate max-w-xs">{bookstore.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-emerald-900">{bookstore.location}</div>
                        {bookstore.address && (
                          <div className="text-xs text-emerald-600 truncate max-w-xs">{bookstore.address}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium bg-gradient-to-r ${theme.category[bookstore.category] || theme.category.Independent} text-white rounded-full inline-flex items-center gap-1`}>
                          {bookstore.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-medium text-emerald-900">
                            {typeof bookstore.rating === 'number' 
                              ? bookstore.rating.toFixed(1) 
                              : parseFloat(bookstore.rating || 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-emerald-600">
                            ({bookstore.reviews || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-emerald-900">
                        {bookstore.established || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(bookstore)}
                            className="p-2 text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(bookstore.id, bookstore.name)}
                            className="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                          {bookstore.website && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={bookstore.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Visit Website"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                            </motion.a>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="text-5xl mb-4 text-emerald-300">📚</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                {bookstores.length === 0 
                  ? 'No bookstores found' 
                  : 'No matching bookstores'}
              </h3>
              <p className="text-emerald-600 mb-6">
                {bookstores.length === 0 
                  ? 'Start by adding your first bookstore to build your collection.' 
                  : 'Try adjusting your search criteria or filters.'}
              </p>
              {bookstores.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className={`${theme.gradient.primary} text-white font-medium py-2 px-6 rounded-lg hover:shadow-xl transition-all duration-300 shadow-lg`}
                >
                  Add First Bookstore
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Pagination/Info */}
        {filteredBookstores.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-emerald-600">
            <div>
              Showing <span className="font-medium">{filteredBookstores.length}</span> of <span className="font-medium">{bookstores.length}</span> bookstores
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Click column headers to sort</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Bookstore Modal */}
      <BookstoreModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Bookstore"
        formData={formData}
        previewImage={previewImage}
        fileInputRef={fileInputRef}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Add Bookstore"
        theme={theme}
      />

      {/* Edit Bookstore Modal */}
      <BookstoreModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Bookstore"
        formData={formData}
        previewImage={previewImage}
        fileInputRef={fileInputRef}
        onChange={handleChange}
        onSubmit={handleUpdate}
        loading={loading}
        submitText="Update Bookstore"
        theme={theme}
        currentImage={selectedBookstore?.image_url}
        imageBaseUrl={config.imageBaseUrl}
      />
    </div>
  );
};

// Reusable Modal Component
const BookstoreModal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  previewImage, 
  fileInputRef, 
  onChange, 
  onSubmit, 
  loading, 
  submitText,
  theme,
  currentImage,
  imageBaseUrl
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`${theme.bg.modal} mt-15 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${theme.border.light}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>
              <p className="text-emerald-600 mt-1">Fill in the details to {title.toLowerCase()}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="mt-10">
              <label className="block text-sm font-medium text-emerald-700 mb-3">
                Bookstore Image
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-emerald-200 overflow-hidden bg-emerald-50 flex items-center justify-center">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : currentImage && imageBaseUrl ? (
                      <img 
                        src={currentImage.startsWith('http') ? currentImage : `${imageBaseUrl}${currentImage}`}
                        alt="Current"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = `
                            <div class="text-emerald-400 text-center p-4">
                              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span class="text-sm">Current image</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="text-emerald-400 text-center p-4">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">No image selected</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={onChange}
                      className="block w-full text-sm text-emerald-600
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-xl file:border-0
                        file:text-sm file:font-medium
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100
                        file:transition-colors"
                    />
                    <p className="text-xs text-emerald-500 mt-2">
                      Recommended: 800×400px JPG or PNG (max 10MB)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Logo Emoji */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Logo Emoji
                      </label>
                      <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={onChange}
                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 text-center text-2xl"
                        placeholder="📚"
                        maxLength="2"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Rating: <span className="font-bold text-emerald-600">{formData.rating}</span>
                      </label>
                      <input
                        type="range"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={onChange}
                        className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-emerald-500 mt-1">
                        <span>0</span>
                        <span>2.5</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Bookstore Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="Enter bookstore name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="e.g., New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                >
                  <option value="Independent">Independent</option>
                  <option value="Modern">Modern</option>
                  <option value="Premium">Premium</option>
                  <option value="Indie">Indie</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="established"
                  value={formData.established}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="e.g., 2010"
                  min="1900"
                  max="2024"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="contact@bookstore.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                placeholder="Full address of the bookstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Reviews Count
              </label>
              <input
                type="number"
                name="reviews"
                value={formData.reviews}
                onChange={onChange}
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                placeholder="Number of reviews"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 resize-none"
                placeholder="Describe the bookstore, its specialties, and unique features..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 ${theme.gradient.primary} text-white rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  submitText
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageBookstores;