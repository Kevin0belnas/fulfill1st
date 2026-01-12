// pages/AddAuthor.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AddAuthor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookstores, setBookstores] = useState([]);
  const [formData, setFormData] = useState({
    bookstore_id: '',
    name: '',
    genre: '',
    bio: '',
    avatar: '👤',
    books_count: 0
  });

  useEffect(() => {
    // Fetch all bookstores for dropdown
    fetchBookstores();
  }, []);

  const fetchBookstores = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookstores`, {
        credentials: 'include'
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'books_count' ? parseInt(value) || 0 : value
    }));
  };

  // In handleSubmit function of AddAuthor.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.bookstore_id) {
    alert('Please select a bookstore');
    return;
  }
  
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      alert('Author added successfully!');
      navigate(`/`);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error adding author:', error);
    alert('Failed to add author. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Author</h1>
        <p className="text-gray-600">
          Add an author to a specific bookstore
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bookstore *
                </label>
                <select
                  name="bookstore_id"
                  value={formData.bookstore_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Bookstore --</option>
                  {bookstores.map(bookstore => (
                    <option key={bookstore.id} value={bookstore.id}>
                      {bookstore.name} - {bookstore.location}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose which bookstore this author is associated with
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre/Specialization
                </label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fiction, Mystery, Science"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Books Published
                </label>
                <input
                  type="number"
                  name="books_count"
                  value={formData.books_count}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar Emoji
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="👤"
                    maxLength="2"
                  />
                  <div className="text-2xl">{formData.avatar || '👤'}</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter an emoji to represent the author
                </p>
              </div>
            </div>
          </div>

          {/* Biography - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Biography
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about the author's background, achievements, and writing style..."
            />
          </div>

          {/* Display selected bookstore info */}
          {formData.bookstore_id && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Selected Bookstore:</h3>
              {(() => {
                const selectedBookstore = bookstores.find(b => b.id == formData.bookstore_id);
                return selectedBookstore ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedBookstore.logo || '📚'}</div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedBookstore.name}</p>
                      <p className="text-sm text-gray-600">{selectedBookstore.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        This author will be associated with "{selectedBookstore.name}"
                      </p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/bookstore')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
            >
              {loading ? 'Adding...' : 'Add Author'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;