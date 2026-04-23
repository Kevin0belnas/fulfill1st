import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.68.4:3000/api';

const ManageSocialMediaLinks = () => {
  const location = useLocation();
  
  // State for social links data - now grouped by author
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorImage: null,
    platform: 'website',
    username: '',
    url: '',
    isActive: true,
    description: '',
    customLabel: '',
    displayOrder: 0
  });
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showAuthorLinks, setShowAuthorLinks] = useState(null);

  const platforms = [
    { value: 'twitter', label: 'Twitter', icon: '🐦', color: 'from-sky-400 to-sky-600' },
    { value: 'facebook', label: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-800' },
    { value: 'instagram', label: 'Instagram', icon: '📷', color: 'from-pink-500 to-purple-600' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-900' },
    { value: 'youtube', label: 'YouTube', icon: '▶️', color: 'from-red-600 to-red-700' },
    { value: 'website', label: 'Website', icon: '🌐', color: 'from-emerald-500 to-green-600' },
    { value: 'goodreads', label: 'Goodreads', icon: '📚', color: 'from-amber-500 to-yellow-600' },
    { value: 'amazon', label: 'Amazon Author Page', icon: '🛒', color: 'from-orange-500 to-yellow-600' },
    { value: 'blog', label: 'Personal Blog', icon: '✍️', color: 'from-indigo-500 to-purple-600' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
    { value: 'threads', label: 'Threads', icon: '🧵', color: 'from-purple-500 to-pink-500' },
    { value: 'other', label: 'Other Platform', icon: '🔗', color: 'from-gray-500 to-gray-700' }
  ];

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Show scroll-to-top button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch social media links on component mount
  useEffect(() => {
    fetchSocialLinks();
  }, []);

  // Filter authors based on search
  useEffect(() => {
    const filtered = authors.filter(author =>
      author.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.authorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.links?.some(link => 
        link.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAuthors(filtered);
  }, [searchTerm, authors]);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/social-media-links`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch social media links');
      }
      
      const data = await response.json();
      const authorsList = data.success ? data.data : (data.authors || data);
      setAuthors(authorsList);
      setFilteredAuthors(authorsList);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      toast.error('Failed to load social media links');
    } finally {
      setLoading(false);
    }
  };

  // Convert file to Base64 with compression
  const compressImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          }, 'image/jpeg', quality);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Modal Functions
  const openAddModal = (author = null) => {
    resetForm();
    if (author) {
      setFormData(prev => ({
        ...prev,
        authorName: author.authorName,
        authorEmail: author.authorEmail || '',
        displayOrder: author.links?.length || 0
      }));
      if (author.authorImage) {
        setImagePreview(author.authorImage);
        setFormData(prev => ({ ...prev, authorImage: author.authorImage }));
      }
      setSelectedAuthor(author);
    } else {
      setSelectedAuthor(null);
    }
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (link, author) => {
    setFormData({
      authorName: author.authorName,
      authorEmail: author.authorEmail || '',
      authorImage: null,
      platform: link.platform || 'website',
      username: link.username || '',
      url: link.url || '',
      isActive: link.isActive !== undefined ? link.isActive : true,
      description: link.description || '',
      customLabel: link.customLabel || '',
      displayOrder: link.displayOrder || 0
    });
    
    if (author.authorImage) {
      setImagePreview(author.authorImage);
    } else {
      setImagePreview('');
    }
    
    setEditingLink(link);
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setSelectedAuthor(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      authorName: '',
      authorEmail: '',
      authorImage: null,
      platform: 'website',
      username: '',
      url: '',
      isActive: true,
      description: '',
      customLabel: '',
      displayOrder: 0
    });
    setImagePreview('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setFormLoading(true);
      try {
        const compressedBase64 = await compressImage(file, 200, 200, 0.7);
        setFormData(prev => ({ ...prev, authorImage: compressedBase64 }));
        setImagePreview(compressedBase64);
        toast.success('Image processed successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image');
      } finally {
        setFormLoading(false);
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, authorImage: null }));
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.authorName.trim() || !formData.url.trim()) {
      toast.error('Author name and URL are required');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setFormLoading(true);

    try {
      const submitData = {
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        platform: formData.platform,
        username: formData.username,
        url: formData.url,
        isActive: formData.isActive,
        description: formData.description,
        customLabel: formData.customLabel,
        displayOrder: formData.displayOrder,
        authorImage: formData.authorImage
      };

      const url = editingLink 
        ? `${API_BASE_URL}/social-media-links/${editingLink.id}`
        : `${API_BASE_URL}/social-media-links`;
      
      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (editingLink ? 'Failed to update' : 'Failed to add'));
      }

      toast.success(editingLink ? 'Social media link updated successfully!' : 'Social media link added successfully!');
      fetchSocialLinks();
      closeModal();
    } catch (error) {
      console.error('Error saving social media link:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLink = async (linkId, authorName) => {
    if (!window.confirm(`Are you sure you want to delete this social media link for ${authorName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/social-media-links/${linkId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete social media link');
      }

      toast.success('Social media link deleted successfully');
      fetchSocialLinks();
    } catch (error) {
      console.error('Error deleting social media link:', error);
      toast.error('Failed to delete social media link');
    }
  };

  const getPlatformIcon = (platform) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj?.icon || '🔗';
  };

  const getPlatformColor = (platform) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj?.color || 'from-gray-500 to-gray-700';
  };

  const getPlatformLabel = (platform) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj?.label || platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  // Stats calculation
  const getStats = () => {
    const totalAuthors = authors.length;
    const totalLinks = authors.reduce((sum, author) => sum + (author.links?.length || 0), 0);
    const uniquePlatforms = new Set();
    authors.forEach(author => {
      author.links?.forEach(link => uniquePlatforms.add(link.platform));
    });
    
    // Count links by platform
    const platformCount = {};
    authors.forEach(author => {
      author.links?.forEach(link => {
        platformCount[link.platform] = (platformCount[link.platform] || 0) + 1;
      });
    });
    
    const mostUsedPlatform = Object.entries(platformCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    
    return { totalAuthors, totalLinks, uniquePlatforms: uniquePlatforms.size, mostUsedPlatform };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-emerald-700">Loading social media links...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50 pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Manage Social Media Links</h1>
            <p className="mt-2 text-emerald-700">
              Manage author profiles and their social media connections
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => openAddModal()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Author/Link
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-emerald-100 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600">Total Authors</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.totalAuthors}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600">Total Links</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalLinks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-cyan-100 mr-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-cyan-600">Unique Platforms</p>
                <p className="text-2xl font-bold text-cyan-900">{stats.uniquePlatforms}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-purple-100 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-purple-600">Avg Links/Author</p>
                <p className="text-2xl font-bold text-purple-900">
                  {(stats.totalLinks / stats.totalAuthors || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100 mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center flex-1">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by author name, email, platform, or username..."
                    className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white placeholder-emerald-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="space-y-6">
          {filteredAuthors.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-emerald-100">
              <svg className="w-16 h-16 mx-auto text-emerald-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-emerald-600 font-medium mb-2">No authors found</p>
              <p className="text-emerald-500 text-sm mb-4">
                {searchTerm ? 'Try a different search term' : 'Add your first author to get started'}
              </p>
              <button
                onClick={() => openAddModal()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition duration-200 text-sm font-medium"
              >
                Add New Author
              </button>
            </div>
          ) : (
            filteredAuthors.map((author) => (
              <div key={author.authorName} className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100 hover:shadow-lg transition-shadow">
                {/* Author Header */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {author.authorImage ? (
                          <img
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-md"
                            src={author.authorImage}
                            alt={author.authorName}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.authorName)}&background=10b981&color=fff`;
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-2 border-emerald-100 shadow-md">
                            <span className="text-2xl font-bold text-emerald-700">
                              {author.authorName?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-900">{author.authorName}</h3>
                        {author.authorEmail && (
                          <p className="text-sm text-emerald-600">{author.authorEmail}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-emerald-500">
                            {author.links?.length || 0} social link{author.links?.length !== 1 ? 's' : ''}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${author.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                            {author.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAddModal(author)}
                        className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition text-sm font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Link
                      </button>
                      <button
                        onClick={() => setShowAuthorLinks(showAuthorLinks === author.authorName ? null : author.authorName)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                      >
                        {showAuthorLinks === author.authorName ? 'Hide Links' : 'Show Links'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Links Section */}
                <AnimatePresence>
                  {showAuthorLinks === author.authorName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6">
                        {author.links?.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-emerald-600">No social media links added yet.</p>
                            <button
                              onClick={() => openAddModal(author)}
                              className="mt-2 text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                            >
                              Add first link →
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {author.links.map((link) => (
                              <div key={link.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-transparent rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPlatformColor(link.platform)} flex items-center justify-center shadow-sm`}>
                                    <span className="text-xl">{getPlatformIcon(link.platform)}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-emerald-900">
                                        {link.customLabel || getPlatformLabel(link.platform)}
                                      </span>
                                      {link.username && (
                                        <span className="text-xs text-emerald-500">@{link.username}</span>
                                      )}
                                    </div>
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline break-all"
                                    >
                                      {link.url}
                                    </a>
                                    {link.description && (
                                      <p className="text-xs text-emerald-500 mt-1">{link.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${link.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                                    {link.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                  <button
                                    onClick={() => openEditModal(link, author)}
                                    className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition"
                                    title="Edit"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLink(link.id, author.authorName)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={closeModal}></div>
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {editingLink ? 'Edit Social Media Link' : selectedAuthor ? 'Add Social Media Link' : 'Add New Author'}
                    </h3>
                    <p className="text-sm text-emerald-100 mt-1">
                      {editingLink ? 'Update the social media link' : selectedAuthor ? `Add a new link for ${selectedAuthor.authorName}` : 'Create a new author profile'}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Author Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <span>👤</span> Author Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Author Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="authorName"
                        value={formData.authorName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        placeholder="John Doe"
                        required
                        disabled={!!selectedAuthor}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Author Email
                      </label>
                      <input
                        type="email"
                        name="authorEmail"
                        value={formData.authorEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        placeholder="author@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Author Image
                    </label>
                    <div className="flex items-center space-x-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-300 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-2 border-emerald-200">
                          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="authorImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={formLoading}
                        />
                        <label
                          htmlFor="authorImage"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-emerald-300 rounded-xl text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 transition w-full justify-center"
                        >
                          {formLoading ? 'Processing...' : 'Upload Image'}
                        </label>
                        <p className="text-xs text-emerald-500 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Information */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <span>🔗</span> Social Media Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Platform <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        {platforms.map(p => (
                          <option key={p.value} value={p.value}>
                            {p.icon} {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Custom Label (Optional)
                      </label>
                      <input
                        type="text"
                        name="customLabel"
                        value={formData.customLabel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        placeholder="e.g., Primary Twitter, Author Blog"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Username/Handle
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      placeholder="@username"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
                      placeholder="Brief description of this social profile..."
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleInputChange}
                      className="w-24 px-3 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      min="0"
                      max="99"
                    />
                    <p className="text-xs text-emerald-500 mt-1">Lower numbers appear first</p>
                  </div>
                  
                  <div className="flex items-center p-3 bg-white rounded-xl border border-emerald-200">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    <label htmlFor="isActive" className="ml-3 flex-1">
                      <span className="text-sm font-medium text-emerald-900">Active Status</span>
                      <p className="text-xs text-emerald-500">When active, this link will be visible to users</p>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border-2 border-emerald-300 rounded-xl text-emerald-700 hover:bg-emerald-50 transition font-medium"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Saving...' : (editingLink ? 'Update Link' : (selectedAuthor ? 'Add Link' : 'Create Author'))}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ManageSocialMediaLinks;