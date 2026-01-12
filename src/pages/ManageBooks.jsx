// pages/ManageBooks.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ManageBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    bookstore_id: '',
    author_id: '',
    title: '',
    price: '',
    genre: '',
    published_date: '',
    isbn: '',
    description: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBooks();
    fetchBookstores();
  }, []);

  // Fetch authors when a bookstore is selected in form
  useEffect(() => {
    if (formData.bookstore_id) {
      fetchAuthors(formData.bookstore_id);
    } else {
      setAuthors([]);
    }
  }, [formData.bookstore_id]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBooks(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadBookImage = async () => {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/books/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data.imageUrl;
      } else {
        alert(`Error uploading image: ${data.error}`);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

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
      let imageUrl = formData.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        const uploadedImageUrl = await uploadBookImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Format the date for backend
      let formattedDate = formData.published_date;
      if (formattedDate) {
        // Convert YYYY-MM-DD to ISO string for MySQL
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      } else {
        formattedDate = null;
      }

      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          published_date: formattedDate,
          image_url: imageUrl
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Book added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchBooks();
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

  const handleEdit = (book) => {
    setSelectedBook(book);
    
    // Format the date for the input field
    let formattedDate = '';
    if (book.published_date) {
      // Convert database date to YYYY-MM-DD format for date input
      const date = new Date(book.published_date);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }
    
    setFormData({
      bookstore_id: book.bookstore_id,
      author_id: book.author_id,
      title: book.title,
      price: book.price,
      genre: book.genre || '',
      published_date: formattedDate,
      isbn: book.isbn || '',
      description: book.description || '',
      image_url: book.image_url || ''
    });
    
    // Set image preview if book has an image
    if (book.image_url) {
      // Ensure image URL is absolute
      const fullImageUrl = book.image_url.startsWith('http') 
        ? book.image_url 
        : `${API_BASE_URL.replace('/api', '')}${book.image_url}`;
      setImagePreview(fullImageUrl);
    } else {
      setImagePreview(null);
    }
    
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
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
      let imageUrl = formData.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        const uploadedImageUrl = await uploadBookImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Format the date for backend
      let formattedDate = formData.published_date;
      if (formattedDate) {
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      } else {
        formattedDate = null;
      }

      const response = await fetch(`${API_BASE_URL}/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
          published_date: formattedDate,
          image_url: imageUrl
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Book updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchBooks();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        alert('Book deleted successfully!');
        fetchBooks();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      bookstore_id: '',
      author_id: '',
      title: '',
      price: '',
      genre: '',
      published_date: '',
      isbn: '',
      description: '',
      image_url: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setSelectedBook(null);
  };

  const selectedBookstore = bookstores.find(b => b.id == formData.bookstore_id);
  const selectedAuthor = authors.find(a => a.id == formData.author_id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
  };

  // Helper function to get full image URL
  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    // Ensure the URL has the correct base path
    if (url.startsWith('/uploads/')) {
      return `${API_BASE_URL.replace('/api', '')}${url}`;
    }
    return url;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && books.length === 0) {
    return (
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Books</h1>
          <p className="text-gray-600">
            View and manage all books across authors and bookstores
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Book
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookstore
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No books found. Add your first book!
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {book.image_url ? (
                            <img 
                              src={getFullImageUrl(book.image_url)} 
                              alt={book.title}
                              className="h-16 w-12 object-cover rounded-md shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `${API_BASE_URL.replace('/api', '')}/uploads/books/default-book.jpg`;
                              }}
                            />
                          ) : (
                            <div className="h-16 w-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-md flex items-center justify-center shadow-sm">
                              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {book.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {book.genre || 'No genre'}
                            </span>
                          </div>
                          {book.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                              {book.description.substring(0, 60)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{book.author_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{book.bookstore_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDisplayDate(book.published_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(book.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
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

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed mt-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white mt-10 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
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
                </div>

                {/* Book Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Cover Image
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Book cover preview" 
                            className="h-32 w-24 object-cover rounded-lg shadow-md border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="book-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload an image</span>
                              <input 
                                id="book-image-upload" 
                                name="book-image" 
                                type="file" 
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
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
                    disabled={loading || uploadingImage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                  >
                    {loading || uploadingImage ? 'Adding...' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && selectedBook && (
        <div className="fixed mt-10 inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white mt-10 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Book</h2>
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
                </div>

                {/* Book Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Cover Image
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Book cover preview" 
                            className="h-32 w-24 object-cover rounded-lg shadow-md border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="edit-book-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                              <span>Upload an image</span>
                              <input 
                                id="edit-book-image-upload" 
                                name="edit-book-image" 
                                type="file" 
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          {selectedBook.image_url && (
                            <p className="text-xs text-green-600 mt-2">
                              Current image will be replaced
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
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
                    disabled={loading || uploadingImage}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200"
                  >
                    {loading || uploadingImage ? 'Updating...' : 'Update Book'}
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

export default ManageBooks;