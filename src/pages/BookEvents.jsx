import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.68.4:3000/api';
const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL ? 
import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 
  'http://192.168.68.4:3000';

const BookEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [showPastEvents, setShowPastEvents] = useState(true);
  const [stats, setStats] = useState({
    total_events: 0,
    upcoming_events: 0,
    featured_events: 0,
    total_attendees: 0
  });
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Compact theme palette
  const theme = {
    bg: {
      primary: 'bg-gradient-to-br from-emerald-25 via-green-50/50 to-emerald-50',
      card: 'bg-white/95 backdrop-blur-sm',
      dark: 'bg-gradient-to-r from-emerald-800 to-green-900'
    },
    text: {
      primary: 'text-emerald-900',
      secondary: 'text-emerald-800',
      muted: 'text-emerald-600/90',
      white: 'text-white'
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

  // Event type colors
  const getEventTypeColor = (type) => {
    const colors = {
      'Book Signing': 'bg-purple-100 text-purple-800 border-purple-200',
      'Reading': 'bg-green-100 text-green-800 border-green-200',
      'Workshop': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Book Fair': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Author Talk': 'bg-blue-100 text-blue-800 border-blue-200',
      'Book Launch': 'bg-pink-100 text-pink-800 border-pink-200',
      'Literary Festival': 'bg-orange-100 text-orange-800 border-orange-200',
      'Club': 'bg-red-100 text-red-800 border-red-200',
      'Children': 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colors[type] || 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filterType, searchTerm, showPastEvents]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('eventType', filterType);
      if (searchTerm) params.append('search', searchTerm);
      params.append('showPast', showPastEvents.toString());
      params.append('limit', '50');
      
      const url = `${API_BASE_URL}/events-display?${params}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const processedEvents = (data.data || []).map(event => ({
          ...event,
          gallery_images: event.gallery_images?.map(img => getImageUrl(img)) || []
        }));
        
        setEvents(processedEvents);
        setFeaturedEvents(processedEvents.filter(event => event.featured));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('Failed to load events. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events-display/stats`);
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Date not set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced getImageUrl function to handle Base64
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // Handle Base64 images (starts with data:image)
    if (imagePath.startsWith('data:image')) {
      return imagePath;
    }
    
    // Handle full URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Handle paths starting with /uploads/
    if (imagePath.startsWith('/uploads/')) {
      return `${IMAGE_BASE_URL}${imagePath}`;
    }
    
    // Handle just filenames
    if (imagePath.includes('.jpg') || imagePath.includes('.jpeg') || imagePath.includes('.png') || 
        imagePath.includes('.gif') || imagePath.includes('.webp')) {
      const filename = imagePath.split('/').pop();
      return `${IMAGE_BASE_URL}/uploads/events/${filename}`;
    }
    
    return imagePath;
  };

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setActiveImageIndex(0);
    setShowEventModal(true);
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
    setActiveImageIndex(0);
  };

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const navigateLightbox = (direction) => {
    const newIndex = lightboxIndex + direction;
    if (newIndex >= 0 && newIndex < lightboxImages.length) {
      setLightboxIndex(newIndex);
    }
  };

  const handleRegister = async (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) {
      showNotification('Event not found', 'error');
      return;
    }
    
    if (event.status === 'Past') {
      showNotification('This event has already ended', 'error');
      return;
    }
    
    // Check if already registered
    const existingReg = localStorage.getItem(`event_reg_${eventId}`);
    if (existingReg) {
      showNotification('You are already registered for this event', 'info');
      return;
    }
    
    // Create a custom modal for registration instead of using prompt
    const name = prompt('Enter your name:');
    if (!name) return;
    
    const email = prompt('Enter your email:');
    if (!email) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    const phone = prompt('Phone number (optional):');
    const notes = prompt('Any notes or special requests (optional):');
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          phone: phone || '', 
          notes: notes || '' 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store registration in localStorage
        localStorage.setItem(`event_reg_${eventId}`, JSON.stringify({
          name,
          email,
          registeredAt: new Date().toISOString()
        }));
        
        showNotification(`Successfully registered for "${event.title}"!`, 'success');
        
        // Refresh events to update attendee count
        fetchEvents();
        fetchStats();
      } else {
        showNotification(data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Registration not available. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for notifications
  const showNotification = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
      type === 'success' ? 'bg-emerald-500 text-white' :
      type === 'error' ? 'bg-rose-500 text-white' :
      'bg-emerald-600 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  if (loading && events.length === 0) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center py-16">
            <div className="relative inline-block mb-4">
              <div className="w-12 h-12 border-3 border-emerald-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-emerald-700">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Hero Section */}
        <div className="mb-6">
          <div className="text-center mb-5">
            {/* Status Badge */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-800 text-xs font-medium mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              {stats.total_events} Events
            </div>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 mb-2">
              Book Events & Author Meetups
            </h1>
            <p className="text-sm text-emerald-700/90 max-w-xl mx-auto">
              Join our community of book lovers. Meet authors, attend workshops, and discover new stories.
            </p>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-5">
            {[
              { value: stats.total_events, label: 'Total' },
              { value: stats.upcoming_events, label: 'Upcoming' },
              { value: stats.featured_events, label: 'Featured' },
              { value: stats.total_attendees, label: 'Attendees' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-2 bg-white/80 rounded-lg border border-emerald-100 shadow-sm">
                <div className="text-base font-bold text-emerald-700">{stat.value}</div>
                <div className="text-xs text-emerald-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`${theme.bg.card} rounded-lg ${theme.shadow.card} p-4 ${theme.border.light} border mb-6`}>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-emerald-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-300 focus:border-emerald-400 text-sm text-emerald-900 placeholder-emerald-500/60"
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 rounded-lg border border-emerald-100 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-300 text-sm bg-white"
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
              <button
                onClick={() => setShowPastEvents(!showPastEvents)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  showPastEvents 
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                    : `${theme.gradient.primary} text-white hover:shadow-md`
                }`}
              >
                {showPastEvents ? 'Hide Past' : 'Show Past'}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-emerald-900">Featured Events</h2>
              <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-medium rounded">
                Featured
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event) => {
                const firstImage = event.gallery_images?.[0] || null;
                
                return (
                  <div 
                    key={event.id}
                    onClick={() => handleCardClick(event)}
                    className={`${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border ${theme.border.light} group cursor-pointer transform hover:-translate-y-1`}
                  >
                    {/* Image container */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-r from-emerald-400 to-green-500">
                      {firstImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <img
                            src={firstImage}
                            alt={event.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-col items-center justify-center w-full h-full">
                                    <span class="text-3xl text-white mb-1">📚</span>
                                    <span class="text-xs text-white/80">${event.event_type}</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <span className="text-3xl text-white mb-1">📚</span>
                          <span className="text-xs text-white/80">{event.event_type}</span>
                        </div>
                      )}
                      
                      {/* Overlay badges */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-emerald-900 mb-1 group-hover:text-emerald-700 transition-colors truncate">
                        {event.title}
                      </h3>
                      <p className="text-xs text-emerald-600 mb-2">with {event.author_name}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-emerald-600">
                          <svg className="w-3 h-3 mr-1.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center text-xs text-emerald-600">
                          <svg className="w-3 h-3 mr-1.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate">{event.bookstore_location}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          event.status === 'Upcoming' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : event.status === 'Ongoing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status || 'Unknown'}
                        </span>
                        <span className="text-emerald-600 group-hover:text-emerald-700 transition-colors">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-emerald-900">
              {showPastEvents ? 'All Events' : 'Upcoming Events'}
              <span className="text-sm font-normal text-emerald-600 ml-1">({events.length})</span>
            </h2>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-emerald-100">
              <div className="text-3xl mb-2 text-emerald-400">📅</div>
              <h3 className="text-sm font-semibold text-emerald-800 mb-1">No events found</h3>
              <p className="text-xs text-emerald-600 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try changing your search or filters' 
                  : 'Check back later for upcoming events'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setShowPastEvents(true);
                }}
                className={`px-3 py-1.5 ${theme.gradient.primary} text-white text-xs font-medium rounded hover:shadow transition-all`}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {events.map((event) => {
                const firstImage = event.gallery_images?.[0] || null;
                
                return (
                  <div 
                    key={event.id}
                    onClick={() => handleCardClick(event)}
                    className={`${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 overflow-hidden border ${theme.border.light} group cursor-pointer transform hover:-translate-y-1`}
                  >
                    {/* Image container */}
                    <div className="relative h-36 bg-gradient-to-r from-emerald-400 to-green-500">
                      {firstImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <img
                            src={firstImage}
                            alt={event.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex flex-col items-center justify-center w-full h-full">
                                    <span class="text-2xl text-white mb-0.5">📚</span>
                                    <span class="text-xs text-white/80">${event.event_type}</span>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          <span className="text-2xl text-white mb-0.5">📚</span>
                          <span className="text-xs text-white/80">Book Event</span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getEventTypeColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                        {event.featured && (
                          <span className="px-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded text-xs">
                            ⭐
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2 h-8">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-emerald-600">
                          <svg className="w-3 h-3 mr-1.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate">{formatDate(event.start_date)}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-emerald-600">
                          <svg className="w-3 h-3 mr-1.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="truncate">{event.bookstore_location}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-emerald-600">
                          {event.attendees_count || 0} attending
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegister(event.id);
                          }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                            event.status === 'Past' 
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          disabled={event.status === 'Past'}
                        >
                          {event.status === 'Past' ? 'Ended' : 'Register'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleCloseModal}
          ></div>
          
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full mt-10 items-center justify-center p-3">
              <div 
                className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] animate-slide-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-3 right-3 z-50 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="overflow-y-auto max-h-[90vh]">
                  {/* Event Details - TOP SECTION */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getEventTypeColor(selectedEvent.event_type)}`}>
                        {selectedEvent.event_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedEvent.status === 'Upcoming' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : selectedEvent.status === 'Ongoing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedEvent.status || 'Unknown'}
                      </span>
                      {selectedEvent.featured && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-emerald-900 mb-3">{selectedEvent.title}</h2>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-emerald-800">
                        <svg className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>Presented by: <strong>{selectedEvent.author_name}</strong></span>
                      </div>
                      
                      <div className="flex items-start text-sm text-emerald-800">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <div>{formatFullDate(selectedEvent.start_date)}</div>
                          {selectedEvent.end_date && selectedEvent.end_date !== selectedEvent.start_date && (
                            <div className="text-xs text-emerald-600 mt-1">
                              to {formatFullDate(selectedEvent.end_date)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-emerald-800">
                        <svg className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{selectedEvent.bookstore_location}</span>
                      </div>
                      
                      <div className="flex items-start text-sm text-emerald-800">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 0l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 000-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{selectedEvent.address}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-emerald-700 mb-6 leading-relaxed">
                      {selectedEvent.description}
                    </div>
                    
                    {selectedEvent.featured_books && (
                      <div className="mb-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <h4 className="text-sm font-semibold text-emerald-900 mb-2">Featured Books</h4>
                        <p className="text-sm text-emerald-700">{selectedEvent.featured_books}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Gallery - BOTTOM SECTION */}
                  {selectedEvent.gallery_images && selectedEvent.gallery_images.length > 0 && (
                    <div className="border-t border-emerald-100 pt-4 px-4 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-emerald-900">Event Gallery</h3>
                        <span className="text-xs text-emerald-600">
                          {selectedEvent.gallery_images.length} photo{selectedEvent.gallery_images.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {selectedEvent.gallery_images.slice(0, 6).map((img, index) => {
                          // Show "more" indicator on the 6th image if there are more than 6
                          if (index === 5 && selectedEvent.gallery_images.length > 6) {
                            return (
                              <div 
                                key="more"
                                className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                onClick={() => openLightbox(selectedEvent.gallery_images, 5)}
                              >
                                <div className="text-center z-10">
                                  <div className="text-white text-xl font-bold mb-1">
                                    +{selectedEvent.gallery_images.length - 5}
                                  </div>
                                  <div className="text-white/90 text-xs">View All</div>
                                </div>
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                              </div>
                            );
                          }
                          
                          return (
                            <div 
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden bg-emerald-100 group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                              onClick={() => openLightbox(selectedEvent.gallery_images, index)}
                            >
                              <img
                                src={img}
                                alt={`Event image ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  const parent = e.target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center">
                                        <span class="text-3xl text-emerald-600">📷</span>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                              <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {index + 1}/{selectedEvent.gallery_images.length}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Lightbox Modal for Fullscreen Image View */}
      {showLightbox && lightboxImages.length > 0 && (
        <>
          <div 
            className="fixed inset-0 bg-black/90 z-50"
            onClick={closeLightbox}
          ></div>
          
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative max-w-5xl w-full mx-4">
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Main image */}
              <div className="relative">
                <img
                  src={lightboxImages[lightboxIndex]}
                  alt={`Full size image ${lightboxIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                
                {/* Navigation buttons */}
                {lightboxImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox(-1);
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox(1);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Image counter */}
              <div className="text-center mt-4 text-white text-sm">
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookEvents;