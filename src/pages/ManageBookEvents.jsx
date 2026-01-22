import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
  import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 
  'http://localhost:3000';

const ManageBookEvents = () => {
  const navigate = useNavigate();
  
  // States for table
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  
  // States for modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    authorName: '',
    bookstoreLocation: '',
    address: '',
    description: '',
    featuredBooks: '',
    eventType: 'Book Signing',
    status: 'Upcoming',
    featured: false
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('status', statusFilter);
      if (eventTypeFilter !== 'all') queryParams.append('eventType', eventTypeFilter);

      const response = await fetch(`${API_BASE_URL}/events?${queryParams}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      console.log('📋 Fetched events data:', data); // Debug log
      
      if (data.success) {
        setEvents(data.data);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchEvents();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setEventTypeFilter('all');
    fetchEvents();
  };

  // Open modal for adding new event
  const handleAddEvent = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal for editing event
  const handleEditEvent = (event) => {
    console.log('✏️ Editing event:', event);
    
    // Format dates for input fields (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    };

    // Format gallery images - extract just filenames from paths
    const extractImageFilenames = (images) => {
      if (!images || !Array.isArray(images)) return [];
      
      return images.map(img => {
        // If it's a full URL, extract just the filename
        if (img.startsWith('http')) {
          return img.split('/').pop();
        }
        // If it starts with /uploads/, extract filename
        if (img.startsWith('/uploads/')) {
          return img.split('/').pop();
        }
        // If it's already just a filename
        return img;
      });
    };

    setFormData({
      title: event.title || '',
      startDate: formatDateForInput(event.start_date) || '',
      endDate: formatDateForInput(event.end_date) || '',
      authorName: event.author_name || '',
      bookstoreLocation: event.bookstore_location || '',
      address: event.address || '',
      description: event.description || '',
      featuredBooks: event.featured_books || '',
      eventType: event.event_type || 'Book Signing',
      status: event.status || 'Upcoming',
      featured: event.featured || false
    });
    
    // Set existing images with full URLs for display
    if (event.gallery_images && event.gallery_images.length > 0) {
      console.log('🖼️ Event gallery images:', event.gallery_images);
      
      const imageFilenames = extractImageFilenames(event.gallery_images);
      console.log('📸 Extracted filenames:', imageFilenames);
      
      // Create full URLs for display
      const fullUrls = imageFilenames.map(filename => {
        // Check if it's already a full URL
        if (filename.startsWith('http')) return filename;
        return `${IMAGE_BASE_URL}/uploads/events/${filename}`;
      });
      
      setExistingImages(fullUrls);
    } else {
      setExistingImages([]);
    }
    
    setGalleryImages([]);
    setEditingEvent(event);
    setShowModal(true);
  };

  // Delete event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        alert('Event deleted successfully');
        fetchEvents();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      authorName: '',
      bookstoreLocation: '',
      address: '',
      description: '',
      featuredBooks: '',
      eventType: 'Book Signing',
      status: 'Upcoming',
      featured: false
    });
    setGalleryImages([]);
    setExistingImages([]);
    setEditingEvent(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Form change handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Image upload handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const fileObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setGalleryImages(prev => [...prev, ...fileObjects]);
    e.target.value = '';
  };

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(galleryImages[index].preview);
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageUrl) => {
    if (!editingEvent) return;
    
    // Extract filename from URL
    const imageName = imageUrl.split('/').pop();
    console.log('🗑️ Deleting image:', imageName);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${editingEvent.id}/image/${imageName}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      console.log('Delete image response:', data);
      
      if (data.success) {
        setExistingImages(prev => prev.filter(img => !img.includes(imageName)));
        alert('Image removed successfully');
        // Refresh events to get updated data
        fetchEvents();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fileObjects = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setGalleryImages(prev => [...prev, ...fileObjects]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    const submitFormData = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'featured') {
        submitFormData.append(key, formData[key] ? 'true' : 'false');
      } else {
        submitFormData.append(key, formData[key]);
      }
    });

    console.log('📤 Form data being submitted:', Object.fromEntries(submitFormData));

    // Append gallery images as files
    galleryImages.forEach((imageObj) => {
      console.log('🖼️ Adding image file:', imageObj.file.name);
      submitFormData.append('galleryImages', imageObj.file);
    });

    try {
      const url = editingEvent ? `${API_BASE_URL}/events/${editingEvent.id}` : `${API_BASE_URL}/events`;
      const method = editingEvent ? 'PUT' : 'POST';

      console.log(`📡 Sending ${method} request to:`, url);

      const response = await fetch(url, {
        method,
        credentials: 'include',
        body: submitFormData,
      });

      const data = await response.json();
      console.log('📥 Response:', data);

      if (data.success) {
        alert(`Event ${editingEvent ? 'updated' : 'added'} successfully!`);
        // Clean up object URLs
        galleryImages.forEach(image => {
          if (image.preview) {
            URL.revokeObjectURL(image.preview);
          }
        });
        handleCloseModal();
        fetchEvents();
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert(`Failed to ${editingEvent ? 'update' : 'add'} event. Please try again. Error: ${error.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Helper functions for table
  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Past':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Book Signing': 'bg-purple-100 text-purple-800',
      'Reading': 'bg-green-100 text-green-800',
      'Workshop': 'bg-yellow-100 text-yellow-800',
      'Book Fair': 'bg-indigo-100 text-indigo-800',
      'Author Talk': 'bg-blue-100 text-blue-800',
      'Book Launch': 'bg-pink-100 text-pink-800',
      'Literary Festival': 'bg-orange-100 text-orange-800',
      'Club': 'bg-red-100 text-red-800',
      'Children': 'bg-teal-100 text-teal-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date range for display
  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return 'Date not set';
    if (startDate === endDate) return formatDateForDisplay(startDate);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return `${startDate || '?'} - ${endDate || '?'}`;
    }
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    }
    
    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
  };

  // Get image URL for display
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it starts with /uploads/, prepend the base URL
    if (imagePath.startsWith('/uploads/')) {
      return `${IMAGE_BASE_URL}${imagePath}`;
    }
    
    // If it's just a filename, assume it's in uploads/events
    if (imagePath.includes('.jpg') || imagePath.includes('.jpeg') || imagePath.includes('.png') || 
        imagePath.includes('.gif') || imagePath.includes('.webp')) {
      return `${IMAGE_BASE_URL}/uploads/events/${imagePath}`;
    }
    
    return null;
  };

  // Loading state
  if (loading && events.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Add Button */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Book Events</h1>
            <p className="text-gray-600">Add, edit, and manage book events</p>
          </div>
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Book Signing">Book Signing</option>
                <option value="Reading">Reading</option>
                <option value="Workshop">Workshop</option>
                <option value="Book Fair">Book Fair</option>
                <option value="Author Talk">Author Talk</option>
                <option value="Book Launch">Book Launch</option>
                <option value="Literary Festival">Literary Festival</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 w-full"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No events found. Click "Add New Event" to create one.
                  </td>
                </tr>
              ) : (
                events.map((event) => {
                  const firstImage = event.gallery_images?.[0] || null;
                  const imageUrl = getImageUrl(firstImage);
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={event.title}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/48/3B82F6/FFFFFF?text=${event.title?.charAt(0) || 'E'}`;
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description?.substring(0, 60) || 'No description'}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{event.author_name}</div>
                        <div className="text-sm text-gray-500">
                          {event.featured_books ? event.featured_books.substring(0, 30) + '...' : 'No books listed'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDateRange(event.start_date, event.end_date)}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{event.bookstore_location}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{event.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          {event.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Modal */}
      {showModal && (
        <>
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-gray-500/75 z-40"></div>
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h3>
                    
                    {/* Debug info */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Editing Event ID: {editingEvent?.id} | 
                        Start Date: {formData.startDate} | 
                        End Date: {formData.endDate} | 
                        Existing Images: {existingImages.length}
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Information */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Frankfurter Buchmesse 2025"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date *
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date *
                            </label>
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Author Name *
                            </label>
                            <input
                              type="text"
                              name="authorName"
                              value={formData.authorName}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Dickson Lane"
                            />
                          </div>
                        </div>

                        {/* Location Information */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Event Type
                            </label>
                            <select
                              name="eventType"
                              value={formData.eventType}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Book Signing">Book Signing</option>
                              <option value="Reading">Reading</option>
                              <option value="Workshop">Workshop</option>
                              <option value="Book Fair">Book Fair</option>
                              <option value="Author Talk">Author Talk</option>
                              <option value="Book Launch">Book Launch</option>
                              <option value="Literary Festival">Literary Festival</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bookstore/Location Name *
                            </label>
                            <input
                              type="text"
                              name="bookstoreLocation"
                              value={formData.bookstoreLocation}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Frankfurter Buchmesse"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address *
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Full address"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Upcoming">Upcoming</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Past">Past</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                          Featured Event
                        </label>
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Gallery Images
                        </label>
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <div className="space-y-2">
                            <svg 
                              className="mx-auto h-12 w-12 text-gray-400" 
                              stroke="currentColor" 
                              fill="none" 
                              viewBox="0 0 48 48"
                            >
                              <path 
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div>
                              <label 
                                htmlFor="image-upload" 
                                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-block"
                              >
                                Select Images
                                <input
                                  id="image-upload"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-2">
                                or drag and drop images here
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF, WEBP up to 10MB each. Max 10 images.
                            </p>
                          </div>
                        </div>

                        {/* Image Previews */}
                        {(existingImages.length > 0 || galleryImages.length > 0) && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Event Images ({existingImages.length + galleryImages.length})
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {/* Existing Images */}
                              {existingImages.map((image, index) => (
                                <div key={`existing-${index}`} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Event ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://via.placeholder.com/150/3B82F6/FFFFFF?text=Image+${index + 1}`;
                                    }}
                                  />
                                  {editingEvent && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveExistingImage(image)}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}

                              {/* New Images */}
                              {galleryImages.map((image, index) => (
                                <div key={`new-${index}`} className="relative group">
                                  <img
                                    src={image.preview}
                                    alt={`New ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveNewImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Featured Books */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Featured Books
                        </label>
                        <textarea
                          name="featuredBooks"
                          value={formData.featuredBooks}
                          onChange={handleChange}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 'Kakaki, The Medicine Woman' and 'The 10...'"
                        />
                        <p className="text-xs text-gray-500 mt-1">List the books that will be featured at this event</p>
                      </div>

                      {/* Event Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe the book event..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={modalLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {modalLoading && (
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {modalLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBookEvents;