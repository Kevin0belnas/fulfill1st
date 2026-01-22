// components/ManageSocialMediaLinks.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const ManageSocialMediaLinks = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  
  // State for social links data
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorImage: null,
    platform: 'website',
    username: '',
    url: '',
    isActive: true,
    description: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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

  // Filter links based on search
  useEffect(() => {
    const filtered = socialLinks.filter(link =>
      link.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLinks(filtered);
  }, [searchTerm, socialLinks]);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/social-media-links`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch social media links');
      
      const data = await response.json();
      setSocialLinks(data);
      setFilteredLinks(data);
    } catch (error) {
      console.error('Error fetching social media links:', error);
      toast.error('Failed to load social media links');
    } finally {
      setLoading(false);
    }
  };

  // Modal Functions
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (link) => {
    setFormData({
      authorName: link.authorName || '',
      authorEmail: link.authorEmail || '',
      authorImage: null,
      platform: link.platform || 'website',
      username: link.username || '',
      url: link.url || '',
      isActive: link.isActive !== undefined ? link.isActive : true,
      description: link.description || ''
    });
    
    if (link.authorImage) {
      setImagePreview(`${API_BASE_URL}${link.authorImage}`);
    } else {
      setImagePreview('');
    }
    
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
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
      description: ''
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

  const handlePlatformChange = (e) => {
    const platform = e.target.value;
    setFormData(prev => ({ ...prev, platform }));
    
    if (formData.username && platform !== 'other') {
      const urlPatterns = {
        twitter: `https://twitter.com/${formData.username}`,
        instagram: `https://instagram.com/${formData.username}`,
        facebook: `https://facebook.com/${formData.username}`,
        linkedin: `https://linkedin.com/in/${formData.username}`,
        youtube: `https://youtube.com/${formData.username}`
      };
      
      if (urlPatterns[platform]) {
        setFormData(prev => ({ ...prev, url: urlPatterns[platform] }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setFormData(prev => ({ ...prev, authorImage: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      const formDataToSend = new FormData();
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('authorEmail', formData.authorEmail);
      formDataToSend.append('platform', formData.platform);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('url', formData.url);
      formDataToSend.append('isActive', formData.isActive);
      formDataToSend.append('description', formData.description);
      
      if (formData.authorImage instanceof File) {
        formDataToSend.append('authorImage', formData.authorImage);
      }

      const url = editingLink 
        ? `${API_BASE_URL}/social-media-links/${editingLink._id}`
        : `${API_BASE_URL}/social-media-links`;
      
      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(editingLink ? 'Failed to update social media link' : 'Failed to add social media link');
      }

      toast.success(editingLink ? 'Social media link updated successfully!' : 'Social media link added successfully!');
      fetchSocialLinks();
      closeModal();
    } catch (error) {
      console.error('Error saving social media link:', error);
      toast.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social media link?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/social-media-links/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete social media link');

      toast.success('Social media link deleted successfully');
      fetchSocialLinks();
    } catch (error) {
      console.error('Error deleting social media link:', error);
      toast.error('Failed to delete social media link');
    }
  };

  const getPlatformIcon = (platform) => {
    const iconMap = {
      'twitter': '🐦',
      'facebook': '📘',
      'instagram': '📷',
      'linkedin': '💼',
      'youtube': '▶️',
      'website': '🌐',
      'goodreads': '📚',
      'amazon': '🛒',
      'blog': '✍️',
      'other': '🔗'
    };
    return iconMap[platform?.toLowerCase()] || '🔗';
  };

  const getPlatformColor = (platform) => {
    const platformObj = platforms.find(p => p.value === platform);
    return platformObj?.color || 'from-gray-500 to-gray-700';
  };

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
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">Manage Social Media Links</h1>
            <p className="mt-2 text-emerald-700">
              Connect authors with their social media profiles
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Link
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-emerald-100 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600">Total Links</p>
                <p className="text-2xl font-bold text-emerald-900">{socialLinks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600">Active Links</p>
                <p className="text-2xl font-bold text-green-900">
                  {socialLinks.filter(link => link.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-emerald-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-emerald-100 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600">Unique Platforms</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {[...new Set(socialLinks.map(link => link.platform))].length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Table Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by author, platform, or username..."
                    className="w-full px-4 py-2 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white placeholder-emerald-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                Showing {filteredLinks.length} of {socialLinks.length} links
              </div>
            </div>
          </div>

          {/* Social Links Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Link
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto text-emerald-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-emerald-600 font-medium mb-2">No social media links found</p>
                        <p className="text-emerald-500 text-sm mb-4">
                          {searchTerm ? 'Try a different search term' : 'Add your first social media link to get started'}
                        </p>
                        <button
                          onClick={openAddModal}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition duration-200 text-sm font-medium"
                        >
                          Add New Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => (
                    <tr key={link.id || link._id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {imagePreview || link.authorImage ? (
                              <img
                                className="h-12 w-12 rounded-xl object-cover border-2 border-emerald-100"
                                src={link.authorImage ? `${API_BASE_URL}${link.authorImage}` : imagePreview}
                                alt={link.authorName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(link.authorName)}&background=10b981&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-2 border-emerald-100">
                                <span className="text-lg font-semibold text-emerald-700">
                                  {link.authorName?.charAt(0).toUpperCase() || 'A'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-emerald-900">{link.authorName}</div>
                            <div className="text-xs text-emerald-500">{link.authorEmail || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPlatformColor(link.platform)} flex items-center justify-center mr-3`}>
                            <span className="text-lg">{getPlatformIcon(link.platform)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-emerald-900 capitalize">{link.platform}</div>
                            {link.username && (
                              <div className="text-xs text-emerald-500">@{link.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-800 text-sm truncate inline-block max-w-xs hover:underline"
                        >
                          {link.url}
                        </a>
                        {link.description && (
                          <div className="text-xs text-emerald-400 truncate max-w-xs mt-1">
                            {link.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          link.isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openEditModal(link)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-200 flex items-center text-sm font-medium"
                            title="Edit"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(link.id || link._id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 flex items-center text-sm font-medium"
                            title="Delete"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed mt-20 inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"></div>
          
          {/* Modal */}
          <div className="fixed mt-20 inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-screen w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
              style={{
                animation: 'slideUp 0.3s ease-out',
              }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 border-b border-emerald-100 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {editingLink ? 'Edit Social Media Link' : 'Add New Social Media Link'}
                      </h3>
                      <p className="text-sm text-emerald-100 mt-1">
                        {editingLink ? 'Update the author social media information' : 'Add a new author social media profile'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-emerald-600/20 rounded-lg transition-colors duration-200 group"
                  >
                    <svg className="w-5 h-5 text-white group-hover:text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Author Information Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-emerald-900">Author Information</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            Author Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="authorName"
                              value={formData.authorName}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            Author Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="authorEmail"
                              value={formData.authorEmail}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                              placeholder="author@example.com"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Author Image Upload - Enhanced */}
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Author Image
                        </label>
                        <div className="flex items-center space-x-6">
                          <div className="relative group">
                            {imagePreview ? (
                              <>
                                <img
                                  src={imagePreview}
                                  alt="Author preview"
                                  className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-200"
                                />
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center border-4 border-white shadow-lg">
                                <div className="text-center">
                                  <svg className="w-8 h-8 text-emerald-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span className="text-xs text-emerald-500 mt-1 block">No Image</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              id="authorImage"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="authorImage"
                              className="cursor-pointer inline-flex items-center px-4 py-3 border-2 border-dashed border-emerald-300 rounded-xl text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-200 w-full justify-center group"
                            >
                              <svg className="w-5 h-5 mr-3 text-emerald-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Upload Author Image
                            </label>
                            <p className="text-xs text-emerald-500 mt-2 text-center">
                              PNG, JPG, GIF up to 5MB. Recommended: 400×400px
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Information Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="p-1.5 bg-emerald-500 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-emerald-900">Social Media Information</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            Platform <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <select
                              name="platform"
                              value={formData.platform}
                              onChange={handlePlatformChange}
                              className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                            >
                              {platforms.map(platform => (
                                <option key={platform.value} value={platform.value}>
                                  {platform.icon} {platform.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-emerald-700 mb-2">
                            Username/Handle
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white"
                              placeholder="@username"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          URL <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white"
                            placeholder="https://example.com/profile"
                            required
                          />
                        </div>
                        <p className="text-xs text-emerald-500 mt-2 ml-1">
                          Enter the full URL including https://
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Description (Optional)
                        </label>
                        <div className="relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                            placeholder="Brief description about this social media profile..."
                            maxLength="200"
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-emerald-400">
                            {formData.description.length}/200
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-white rounded-xl border border-emerald-200">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-emerald-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </div>
                        <label htmlFor="isActive" className="ml-3 flex-1">
                          <span className="text-sm font-medium text-emerald-900">Active Status</span>
                          <p className="text-xs text-emerald-500">When active, this link will be visible to users</p>
                        </label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          formData.isActive 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-6 py-3 border-2 border-emerald-300 rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5"
                      disabled={formLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-sm font-semibold text-white hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {formLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingLink ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          {editingLink ? (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Update Link
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              Create Link
                            </>
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-40"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ManageSocialMediaLinks;