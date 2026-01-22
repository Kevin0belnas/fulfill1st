// pages/ManageBooks.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ManageBooks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-emerald-700">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Manage Books</h1>
            <p className="text-emerald-700">
              View and manage all books across authors and bookstores
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-xl transition duration-200 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Book
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600">Total Books</p>
                <p className="text-2xl font-bold text-emerald-900">{books.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600">Bookstores</p>
                <p className="text-2xl font-bold text-green-900">{bookstores.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-emerald-600">Active Authors</p>
                <p className="text-2xl font-bold text-emerald-900">{authors.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-lg font-semibold text-emerald-900">Books Catalog</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Book Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px 6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Bookstore
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-emerald-600 mb-4">
                        <svg className="w-16 h-16 mx-auto text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-emerald-600 font-medium mb-2">No books found</p>
                      <p className="text-emerald-500 text-sm mb-4">Add your first book to get started</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition duration-200 text-sm"
                      >
                        Add Your First Book
                      </button>
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-emerald-50 transition duration-150">
                      <td className="px-6 py-5">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {book.image_url ? (
                              <img 
                                src={getFullImageUrl(book.image_url)} 
                                alt={book.title}
                                className="h-20 w-14 object-cover rounded-lg shadow-md border border-emerald-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${API_BASE_URL.replace('/api', '')}/uploads/books/default-book.jpg`;
                                }}
                              />
                            ) : (
                              <div className="h-20 w-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center shadow-sm border border-emerald-200">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-emerald-900 truncate">
                              {book.title}
                            </div>
                            <div className="mt-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200`}>
                                {book.genre || 'No genre'}
                              </span>
                            </div>
                            {book.description && (
                              <div className="text-sm text-emerald-600 truncate max-w-xs mt-2">
                                {book.description.substring(0, 80)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-emerald-900">{book.author_name}</div>
                            <div className="text-xs text-emerald-500">Author</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-green-900">{book.bookstore_name}</div>
                            <div className="text-xs text-green-500">Bookstore</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-emerald-700">
                              {formatDisplayDate(book.published_date)}
                            </div>
                            <div className="text-xs text-emerald-500">Published</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="px-3 py-2 bg-emerald-50 rounded-lg inline-block">
                          <div className="text-sm font-bold text-emerald-900">
                            {formatPrice(book.price)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(book)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-200 flex items-center text-sm font-medium"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 flex items-center text-sm font-medium"
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
          {books.length > 0 && (
            <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100 text-sm text-emerald-600">
              Showing {books.length} book{books.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Add Book Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-emerald-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Add New Book</h2>
                    <p className="text-emerald-100">Fill in the book details below</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-emerald-100 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Select Bookstore *
                      </label>
                      <select
                        name="bookstore_id"
                        value={formData.bookstore_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value="" className="text-emerald-400">-- Select a Bookstore --</option>
                        {bookstores.map(bookstore => (
                          <option key={bookstore.id} value={bookstore.id} className="text-emerald-900">
                            {bookstore.name} - {bookstore.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Select Author *
                      </label>
                      <select
                        name="author_id"
                        value={formData.author_id}
                        onChange={handleChange}
                        required
                        disabled={!formData.bookstore_id || authors.length === 0}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-emerald-50 disabled:text-emerald-400"
                      >
                        <option value="" className="text-emerald-400">-- Select an Author --</option>
                        {authors.length === 0 && formData.bookstore_id ? (
                          <option value="" disabled className="text-emerald-400">
                            No authors found for this bookstore. Add authors first.
                          </option>
                        ) : null}
                        {authors.map(author => (
                          <option key={author.id} value={author.id} className="text-emerald-900">
                            {author.name}
                          </option>
                        ))}
                      </select>
                      {formData.bookstore_id && authors.length === 0 && (
                        <p className="text-xs text-red-500 mt-2">
                          ⚠️ No authors available. Please add authors to this bookstore first.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Book Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-3">
                      Book Cover Image
                    </label>
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Book cover preview" 
                              className="h-40 w-28 object-cover rounded-xl shadow-lg border-2 border-emerald-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200 shadow-md"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="h-40 w-28 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-300">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 bg-gradient-to-br from-emerald-50 to-transparent">
                          <div className="space-y-3 text-center">
                            <svg className="mx-auto h-12 w-12 text-emerald-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex justify-center text-sm text-emerald-600">
                              <label htmlFor="book-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50 transition duration-200">
                                <span>Choose an image</span>
                                <input 
                                  id="book-image-upload" 
                                  name="book-image" 
                                  type="file" 
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-3 self-center">or drag and drop</p>
                            </div>
                            <p className="text-xs text-emerald-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Book Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter book title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.01"
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="e.g., 19.99"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Genre
                        </label>
                        <input
                          type="text"
                          name="genre"
                          value={formData.genre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="e.g., Fiction, Mystery, Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Published Date
                        </label>
                        <input
                          type="date"
                          name="published_date"
                          value={formData.published_date}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        ISBN
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., 978-3-16-148410-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Describe the book..."
                    />
                  </div>

                  {/* Selected Bookstore & Author Info */}
                  {(selectedBookstore || selectedAuthor) && (
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5">
                      <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Selection Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedBookstore && (
                          <div className="bg-white p-4 rounded-lg border border-emerald-100">
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl bg-emerald-100 p-3 rounded-lg">{selectedBookstore.logo || '📚'}</div>
                              <div>
                                <p className="font-semibold text-emerald-900">Bookstore</p>
                                <p className="text-sm text-emerald-700">{selectedBookstore.name}</p>
                                <p className="text-xs text-emerald-500">{selectedBookstore.location}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedAuthor && (
                          <div className="bg-white p-4 rounded-lg border border-emerald-100">
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl bg-green-100 p-3 rounded-lg">{selectedAuthor.avatar || '👤'}</div>
                              <div>
                                <p className="font-semibold text-green-900">Author</p>
                                <p className="text-sm text-green-700">{selectedAuthor.name}</p>
                                <p className="text-xs text-green-500">
                                  {selectedAuthor.genre || 'No genre specified'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 transition duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      {loading || uploadingImage ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </span>
                      ) : 'Add Book'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && selectedBook && (
          <div className="fixed inset-0 bg-emerald-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Edit Book</h2>
                    <p className="text-emerald-100">Update the book details</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="text-emerald-100 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Same form structure as Add Modal, with different submit handler */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Select Bookstore *
                      </label>
                      <select
                        name="bookstore_id"
                        value={formData.bookstore_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value="" className="text-emerald-400">-- Select a Bookstore --</option>
                        {bookstores.map(bookstore => (
                          <option key={bookstore.id} value={bookstore.id} className="text-emerald-900">
                            {bookstore.name} - {bookstore.location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        Select Author *
                      </label>
                      <select
                        name="author_id"
                        value={formData.author_id}
                        onChange={handleChange}
                        required
                        disabled={!formData.bookstore_id || authors.length === 0}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-emerald-50 disabled:text-emerald-400"
                      >
                        <option value="" className="text-emerald-400">-- Select an Author --</option>
                        {authors.length === 0 && formData.bookstore_id ? (
                          <option value="" disabled className="text-emerald-400">
                            No authors found for this bookstore. Add authors first.
                          </option>
                        ) : null}
                        {authors.map(author => (
                          <option key={author.id} value={author.id} className="text-emerald-900">
                            {author.name}
                          </option>
                        ))}
                      </select>
                      {formData.bookstore_id && authors.length === 0 && (
                        <p className="text-xs text-red-500 mt-2">
                          ⚠️ No authors available. Please add authors to this bookstore first.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Book Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-3">
                      Book Cover Image
                    </label>
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                      <div className="flex-shrink-0">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Book cover preview" 
                              className="h-40 w-28 object-cover rounded-xl shadow-lg border-2 border-emerald-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200 shadow-md"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="h-40 w-28 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-300">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 bg-gradient-to-br from-emerald-50 to-transparent">
                          <div className="space-y-3 text-center">
                            <svg className="mx-auto h-12 w-12 text-emerald-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex justify-center text-sm text-emerald-600">
                              <label htmlFor="edit-book-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50 transition duration-200">
                                <span>Choose an image</span>
                                <input 
                                  id="edit-book-image-upload" 
                                  name="edit-book-image" 
                                  type="file" 
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-3 self-center">or drag and drop</p>
                            </div>
                            <p className="text-xs text-emerald-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                            {selectedBook.image_url && (
                              <p className="text-xs text-emerald-600 mt-2 font-medium">
                                Current image will be replaced
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Book Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Enter book title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.01"
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="e.g., 19.99"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Genre
                        </label>
                        <input
                          type="text"
                          name="genre"
                          value={formData.genre}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="e.g., Fiction, Mystery, Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Published Date
                        </label>
                        <input
                          type="date"
                          name="published_date"
                          value={formData.published_date}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-700 mb-2">
                        ISBN
                      </label>
                      <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="e.g., 978-3-16-148410-0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Describe the book..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploadingImage}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 transition duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      {loading || uploadingImage ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : 'Update Book'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default ManageBooks;