// pages/ManageAuthors.jsx
import { useState, useEffect, useRef } from 'react';
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

const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const config = ENV_CONFIG[isProduction ? 'production' : 'development'];

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookstore, setSelectedBookstore] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const location = useLocation();

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
    }
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchAuthors();
    fetchBookstores();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/authors`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthors(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      showToast('Failed to load authors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookstores = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/bookstores`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookstores(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching bookstores:', error);
    }
  };

  const [formData, setFormData] = useState({
    bookstore_id: '',
    name: '',
    genre: '',
    bio: '',
    avatar: '👤',
    books_count: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'books_count' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookstore_id) {
      showToast('Please select a bookstore', 'error');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Author added successfully!', 'success');
        setShowAddModal(false);
        resetForm();
        fetchAuthors();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error adding author:', error);
      showToast('Failed to add author. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (author) => {
    setSelectedAuthor(author);
    setFormData({
      bookstore_id: author.bookstore_id,
      name: author.name,
      genre: author.genre || '',
      bio: author.bio || '',
      avatar: author.avatar || '👤',
      books_count: author.books_count || 0
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.bookstore_id) {
      showToast('Please select a bookstore', 'error');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/authors/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Author updated successfully!', 'success');
        setShowEditModal(false);
        resetForm();
        fetchAuthors();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error updating author:', error);
      showToast('Failed to update author. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (authorId, authorName) => {
    if (!window.confirm(`Are you sure you want to delete author "${authorName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/authors/${authorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Author deleted successfully!', 'success');
        fetchAuthors();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      showToast('Failed to delete author. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      bookstore_id: '',
      name: '',
      genre: '',
      bio: '',
      avatar: '👤',
      books_count: 0
    });
    setSelectedAuthor(null);
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

  const sortedAuthors = [...authors].sort((a, b) => {
    if (sortConfig.key === 'books_count') {
      return sortConfig.direction === 'ascending' 
        ? (a.books_count || 0) - (b.books_count || 0)
        : (b.books_count || 0) - (a.books_count || 0);
    } else {
      return sortConfig.direction === 'ascending'
        ? (a[sortConfig.key] || '').localeCompare(b[sortConfig.key] || '')
        : (b[sortConfig.key] || '').localeCompare(a[sortConfig.key] || '');
    }
  });

  const filteredAuthors = sortedAuthors.filter(author => {
    const matchesSearch = author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         author.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBookstore = selectedBookstore === 'all' || author.bookstore_id === parseInt(selectedBookstore);
    
    return matchesSearch && matchesBookstore;
  });

  const getBookstoreName = (bookstoreId) => {
    const bookstore = bookstores.find(b => b.id === bookstoreId);
    return bookstore ? bookstore.name : 'Unknown Bookstore';
  };

  // Stats calculation
  const stats = {
    total: authors.length,
    byBookstore: bookstores.map(bookstore => ({
      name: bookstore.name,
      count: authors.filter(a => a.bookstore_id === bookstore.id).length
    })).filter(item => item.count > 0),
    genres: [...new Set(authors.map(a => a.genre).filter(Boolean))].length
  };

  // Loading skeleton
  if (loading && authors.length === 0) {
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
              Manage Authors
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-600"
            >
              Manage all authors across your bookstore network
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
            Add New Author
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
                <p className="text-sm text-emerald-600 font-medium mb-1">Total Authors</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.total}</p>
              </div>
              <div className="text-2xl text-emerald-500">✍️</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Unique Genres</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.genres}</p>
              </div>
              <div className="text-2xl text-emerald-500">🏷️</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(stats.genres * 20, 100)}%` }}></div>
            </div>
          </div>

          <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium mb-1">Bookstores</p>
                <p className="text-3xl font-bold text-emerald-900">{bookstores.length}</p>
              </div>
              <div className="text-2xl text-emerald-500">📚</div>
            </div>
            <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min(bookstores.length * 10, 100)}%` }}></div>
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
                  placeholder="Search authors by name, genre, or biography..."
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

            {/* Bookstore Filter */}
            <div className="relative">
              <select
                value={selectedBookstore}
                onChange={(e) => setSelectedBookstore(e.target.value)}
                className="w-full lg:w-auto px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 appearance-none"
              >
                <option value="all">All Bookstores</option>
                {bookstores.map(bookstore => (
                  <option key={bookstore.id} value={bookstore.id}>
                    {bookstore.name}
                  </option>
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

        {/* Authors Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${theme.bg.card} rounded-2xl shadow-xl overflow-hidden border ${theme.border.light}`}
        >
          {filteredAuthors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-100">
                <thead className="bg-emerald-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Author
                        <svg className={`w-4 h-4 transition-transform ${sortConfig.key === 'name' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider">
                      Bookstore
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider">
                      Genre
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-emerald-600 uppercase tracking-wider cursor-pointer hover:bg-emerald-100 transition-colors"
                      onClick={() => handleSort('books_count')}
                    >
                      <div className="flex items-center gap-1">
                        Books
                        <svg className={`w-4 h-4 transition-transform ${sortConfig.key === 'books_count' && sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  {filteredAuthors.map((author) => (
                    <motion.tr 
                      key={author.id} 
                      className="hover:bg-emerald-50/50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="text-3xl mr-4">{author.avatar || '👤'}</div>
                          </div>
                          <div>
                            <div className="font-medium text-emerald-900">{author.name}</div>
                            <div className="text-sm text-emerald-600 truncate max-w-xs mt-1">
                              {author.bio ? `${author.bio.substring(0, 80)}...` : 'No biography available'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-emerald-900 font-medium">
                          {getBookstoreName(author.bookstore_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full">
                          {author.genre || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-900 font-bold">
                            {author.books_count || 0}
                          </span>
                          <span className="text-sm text-emerald-600">books</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(author)}
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
                            onClick={() => handleDelete(author.id, author.name)}
                            className="p-2 text-rose-600 hover:text-rose-900 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="text-5xl mb-4 text-emerald-300">✍️</div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                {authors.length === 0 
                  ? 'No authors found' 
                  : 'No matching authors'}
              </h3>
              <p className="text-emerald-600 mb-6">
                {authors.length === 0 
                  ? 'Start by adding your first author to build your collection.' 
                  : 'Try adjusting your search criteria or filters.'}
              </p>
              {authors.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className={`${theme.gradient.primary} text-white font-medium py-2 px-6 rounded-lg hover:shadow-xl transition-all duration-300 shadow-lg`}
                >
                  Add First Author
                </motion.button>
              )}
            </div>
          )}
        </motion.div>

        {/* Distribution by Bookstore */}
        {stats.byBookstore.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className={`${theme.bg.card} rounded-2xl p-6 border ${theme.border.light} shadow-lg`}>
              <h3 className="text-lg font-bold text-emerald-900 mb-4">Authors by Bookstore</h3>
              <div className="space-y-3">
                {stats.byBookstore.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm text-emerald-700">{item.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${(item.count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-emerald-900 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 ${theme.gradient.primary} text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add Author Modal */}
      <AuthorModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Author"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Add Author"
        theme={theme}
        bookstores={bookstores}
      />

      {/* Edit Author Modal */}
      <AuthorModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Edit Author"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleUpdate}
        loading={loading}
        submitText="Update Author"
        theme={theme}
        bookstores={bookstores}
      />
    </div>
  );
};

// Reusable Author Modal Component
const AuthorModal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  onChange, 
  onSubmit, 
  loading, 
  submitText,
  theme,
  bookstores
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
        className={`${theme.bg.modal} rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${theme.border.light}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-emerald-900">{title}</h2>
              <p className="text-emerald-600 mt-1">Fill in the author details</p>
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
            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-6xl mb-4">{formData.avatar || '👤'}</div>
              <p className="text-sm text-emerald-600">Avatar Preview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bookstore Selection */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Select Bookstore *
                </label>
                <select
                  name="bookstore_id"
                  value={formData.bookstore_id}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                >
                  <option value="">-- Select a Bookstore --</option>
                  {bookstores.map(bookstore => (
                    <option key={bookstore.id} value={bookstore.id}>
                      {bookstore.name} - {bookstore.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="Enter author name"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Genre/Specialization
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="e.g., Fiction, Mystery, Science"
                />
              </div>

              {/* Books Count */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Books Published
                </label>
                <input
                  type="number"
                  name="books_count"
                  value={formData.books_count}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900"
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>

              {/* Avatar Emoji */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-700 mb-2">
                  Avatar Emoji
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={onChange}
                    className="flex-1 px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 text-center text-2xl"
                    placeholder="👤"
                    maxLength="2"
                  />
                  <div className="text-3xl text-emerald-600">
                    {formData.avatar || '👤'}
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">
                Author Biography
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-900 resize-none"
                placeholder="Write about the author's background, achievements, and writing style..."
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

export default ManageAuthors;