import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AddBookEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dateRange: '',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      dateRange: value
    }));

    // Parse the date range into start and end dates
    if (value.includes('-')) {
      const dates = value.split('-').map(d => d.trim());
      if (dates.length === 2) {
        setFormData(prev => ({
          ...prev,
          startDate: dates[0],
          endDate: dates[1]
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for API
    const eventData = {
      ...formData,
      // Ensure we have proper date fields for the API
      date: formData.dateRange,
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Book event added successfully!');
        navigate('/admin/events');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding book event:', error);
      alert('Failed to add book event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book Event</h1>
        <p className="text-gray-600">Add a new book event to the system</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g., Frankfurter Buchmesse 2025 - Book Signing & Reading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range *
                </label>
                <input
                  type="text"
                  name="dateRange"
                  value={formData.dateRange}
                  onChange={handleDateRangeChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., October 7-11, 2025"
                />
                <p className="text-xs text-gray-500 mt-1">Format: Month Day-Day, Year</p>
              </div>

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
                  placeholder="e.g., Ludwig-Erhard-Anlage 1, 60327 Frankfurt am Main, Germany"
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
            </div>
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
              placeholder="Describe the book event. For example: Join the author for book signings, readings from his latest works..."
            />
          </div>

          {/* Preview Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{formData.title || 'Event Title'}</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {formData.dateRange || 'Date Range'}
                  </p>
                </div>
                {formData.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                <span className="font-medium">Author:</span> {formData.authorName || 'Author Name'}
              </p>
              
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {formData.bookstoreLocation || 'Location Name'}
              </p>
              
              <p className="text-sm text-gray-700">
                {formData.description || 'Event description will appear here...'}
              </p>
              
              {formData.featuredBooks && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Featured Books:</span> {formData.featuredBooks}
                </p>
              )}
              
              <p className="text-sm text-gray-500">
                {formData.address || 'Event address will appear here...'}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
            >
              {loading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookEvent;