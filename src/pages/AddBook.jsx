// pages/AddBook.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookstores, setBookstores] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    bookstore_id: '',
    author_id: '',
    title: '',
    price: '',
    genre: '',
    published_date: '',
    isbn: '',
    description: ''
  });

  useEffect(() => {
    // Fetch all bookstores for dropdown
    fetchBookstores();
  }, []);

  // Fetch authors when a bookstore is selected
  useEffect(() => {
    if (formData.bookstore_id) {
      fetchAuthors(formData.bookstore_id);
    } else {
      setAuthors([]);
    }
  }, [formData.bookstore_id]);

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

  const fetchAuthors = async (bookstoreId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/authors/bookstore/${bookstoreId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthors(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // In handleSubmit function of AddBook.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.bookstore_id) {
    alert('Please select a bookstore');
    return;
  }
  
  if (!formData.author_id) {
    alert('Please select an author');
    return;
  }
  
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price) || 0
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Book added successfully!');
      navigate(`/bookstore/${formData.bookstore_id}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add book. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const selectedBookstore = bookstores.find(b => b.id == formData.bookstore_id);
  const selectedAuthor = authors.find(a => a.id == formData.author_id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book</h1>
        <p className="text-gray-600">
          Add a book to a specific author and bookstore
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bookstore Selection */}
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
            </div>

            {/* Author Selection (depends on bookstore) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Author *
              </label>
              <select
                name="author_id"
                value={formData.author_id}
                onChange={handleChange}
                required
                disabled={!formData.bookstore_id || authors.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Select an Author --</option>
                {authors.length === 0 && formData.bookstore_id ? (
                  <option value="" disabled>
                    No authors found for this bookstore. Add authors first.
                  </option>
                ) : null}
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {formData.bookstore_id && authors.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No authors available. Please add authors to this bookstore first.
                </p>
              )}
            </div>

            {/* Book Information */}
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 19.99"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Published Date
                  </label>
                  <input
                    type="date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 978-3-16-148410-0"
                />
              </div>
            </div>
          </div>

          {/* Description */}
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
              placeholder="Describe the book..."
            />
          </div>

          {/* Selected Bookstore & Author Info */}
          {(selectedBookstore || selectedAuthor) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">Selection Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBookstore && (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedBookstore.logo || '📚'}</div>
                    <div>
                      <p className="font-medium text-gray-900">Bookstore</p>
                      <p className="text-sm text-gray-600">{selectedBookstore.name}</p>
                      <p className="text-xs text-gray-500">{selectedBookstore.location}</p>
                    </div>
                  </div>
                )}
                {selectedAuthor && (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{selectedAuthor.avatar || '👤'}</div>
                    <div>
                      <p className="font-medium text-gray-900">Author</p>
                      <p className="text-sm text-gray-600">{selectedAuthor.name}</p>
                      <p className="text-xs text-gray-500">
                        {selectedAuthor.genre || 'No genre specified'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;