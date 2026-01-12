// pages/AddAuthor.jsx - Renamed to ManageAuthors.jsx or AuthorsManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ManageAuthors = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [formData, setFormData] = useState({
    bookstore_id: '',
    name: '',
    genre: '',
    bio: '',
    avatar: '👤',
    books_count: 0
  });

  useEffect(() => {
    fetchAuthors();
    fetchBookstores();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/authors`, {
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
    } finally {
      setLoading(false);
    }
  };

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
        setShowAddModal(false);
        resetForm();
        fetchAuthors();
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
      alert('Please select a bookstore');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/authors/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Author updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchAuthors();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating author:', error);
      alert('Failed to update author. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (authorId) => {
    if (!window.confirm('Are you sure you want to delete this author?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authors/${authorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        alert('Author deleted successfully!');
        fetchAuthors();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author. Please try again.');
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

  const getBookstoreName = (bookstoreId) => {
    const bookstore = bookstores.find(b => b.id === bookstoreId);
    return bookstore ? bookstore.name : 'Unknown Bookstore';
  };

  if (loading && authors.length === 0) {
    return (
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading authors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Authors</h1>
          <p className="text-gray-600">
            View and manage all authors across bookstores
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Author
        </button>
      </div>

      {/* Authors Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookstore
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Books
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No authors found. Add your first author!
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{author.avatar || '👤'}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{author.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {author.bio ? `${author.bio.substring(0, 60)}...` : 'No biography'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getBookstoreName(author.bookstore_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {author.genre || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {author.books_count} books
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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

      {/* Add Author Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Author</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                  </div>
                </div>

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

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
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
        </div>
      )}

      {/* Edit Author Modal */}
      {showEditModal && selectedAuthor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Author</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                  </div>
                </div>

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

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Updating...' : 'Update Author'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAuthors;