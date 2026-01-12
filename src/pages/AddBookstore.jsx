import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AddBookstore = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
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
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append('image', formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/bookstores`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Bookstore added successfully!');
        navigate('/company/manage-bookstore');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding bookstore:', error);
      alert('Failed to add bookstore. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Bookstore</h1>
        <p className="text-gray-600">Add a new bookstore partner to the system</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bookstore Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block">
                      <span className="sr-only">Choose image</span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-lg file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 800×400px JPG or PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Bookstore Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bookstore Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bookstore name"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., New York, NY"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Independent">Independent</option>
                  <option value="Modern">Modern</option>
                  <option value="Premium">Premium</option>
                  <option value="Indie">Indie</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="space-y-4">
              {/* Logo Emoji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Emoji (optional)
                </label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="📚"
                  maxLength="2"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 w-10">
                    {formData.rating}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                </div>
              </div>

              {/* Reviews Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reviews Count
                </label>
                <input
                  type="number"
                  name="reviews"
                  value={formData.reviews}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100"
                  min="0"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contact@bookstore.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          </div>

          {/* Third Column - Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Established Year
              </label>
              <input
                type="number"
                name="established"
                value={formData.established}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2010"
                min="1900"
                max="2024"
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full address"
            />
          </div>

          {/* Description - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the bookstore..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/company/manage-bookstore')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
            >
              {loading ? 'Adding...' : 'Add Bookstore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookstore;