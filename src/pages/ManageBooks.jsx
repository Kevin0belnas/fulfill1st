// pages/ManageBooks.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.68.4:3000/api';

const ManageBooks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
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

  // Load authors when bookstore_id changes in edit mode
  useEffect(() => {
    if (formData.bookstore_id && showEditModal) {
      fetchAuthors(formData.bookstore_id);
    }
  }, [formData.bookstore_id, showEditModal]);

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
      showToast('Failed to load books', 'error');
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
      setLoadingAuthors(true);
      const response = await fetch(`${API_BASE_URL}/authors/bookstore/${bookstoreId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Parse author avatars
          const parsedAuthors = (data.data || []).map(author => {
            let avatar = author.avatar;
            if (typeof avatar === 'string' && avatar.startsWith('[')) {
              try {
                const parsed = JSON.parse(avatar);
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].startsWith('data:image')) {
                  avatar = parsed[0];
                }
              } catch (e) {}
            }
            return { ...author, avatar };
          });
          setAuthors(parsedAuthors);
          return parsedAuthors;
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    } finally {
      setLoadingAuthors(false);
    }
  };

  // Compress image for Base64
  const compressImage = (file, maxWidth = 300, maxHeight = 400, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          }, 'image/jpeg', quality);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        e.target.value = '';
        return;
      }

      try {
        const compressedBase64 = await compressImage(file, 300, 400, 0.7);
        setFormData(prev => ({ ...prev, image_url: compressedBase64 }));
        setImagePreview(compressedBase64);
        showToast('Image processed successfully', 'success');
      } catch (error) {
        console.error('Error processing image:', error);
        showToast('Failed to process image', 'error');
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookstore_id) {
      showToast('Please select a bookstore', 'error');
      return;
    }
    
    if (!formData.author_id) {
      showToast('Please select an author', 'error');
      return;
    }
    
    setLoading(true);

    try {
      let formattedDate = formData.published_date;
      if (formattedDate) {
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
          published_date: formattedDate
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Book added successfully!', 'success');
        setShowAddModal(false);
        resetForm();
        fetchBooks();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      showToast('Failed to add book. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (book) => {
    setSelectedBook(book);
    
    let formattedDate = '';
    if (book.published_date) {
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
    
    setImagePreview(book.image_url || null);
    
    if (book.bookstore_id) {
      await fetchAuthors(book.bookstore_id);
    }
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.bookstore_id) {
      showToast('Please select a bookstore', 'error');
      return;
    }
    
    if (!formData.author_id) {
      showToast('Please select an author', 'error');
      return;
    }
    
    setLoading(true);

    try {
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
          published_date: formattedDate
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Book updated successfully!', 'success');
        setShowEditModal(false);
        resetForm();
        fetchBooks();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      showToast('Failed to update book. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        showToast('Book deleted successfully!', 'success');
        fetchBooks();
      } else {
        showToast(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      showToast('Failed to delete book. Please try again.', 'error');
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
    setImagePreview(null);
    setSelectedBook(null);
  };

  const selectedBookstore = bookstores.find(b => b.id == formData.bookstore_id);
  
  const selectedAuthor = (() => {
    const found = authors.find(a => a.id == formData.author_id);
    if (found) return found;
    
    if (selectedBook && selectedBook.author_id == formData.author_id) {
      let avatar = selectedBook.author_avatar;
      if (typeof avatar === 'string' && avatar.startsWith('[')) {
        try {
          const parsed = JSON.parse(avatar);
          if (Array.isArray(parsed) && parsed.length > 0) {
            avatar = parsed[0];
          }
        } catch (e) {}
      }
      return {
        id: selectedBook.author_id,
        name: selectedBook.author_name,
        genre: selectedBook.author_genre,
        avatar: avatar
      };
    }
    return null;
  })();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

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
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 mb-2">Manage Books</h1>
            <p className="text-emerald-700">View and manage all books across authors and bookstores</p>
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
                <p className="text-sm text-emerald-600">Available Authors</p>
                <p className="text-2xl font-bold text-emerald-900">{authors.length}</p>
              </div>
            </div>
          </div>
        </div>

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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Book Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Bookstore</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
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
                      <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition duration-200 text-sm">
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
                            {book.image_url && book.image_url.startsWith('data:image') ? (
                              <img src={book.image_url} alt={book.title} className="h-20 w-14 object-cover rounded-lg shadow-md border border-emerald-200" />
                            ) : (
                              <div className="h-20 w-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex items-center justify-center shadow-sm border border-emerald-200">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-emerald-900 truncate">{book.title}</div>
                            <div className="mt-2">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                                {book.genre || 'No genre'}
                              </span>
                            </div>
                            {book.description && (
                              <div className="text-sm text-emerald-600 truncate max-w-xs mt-2">{book.description.substring(0, 80)}...</div>
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
                            <div className="text-sm text-emerald-700">{formatDisplayDate(book.published_date)}</div>
                            <div className="text-xs text-emerald-500">Published</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="px-3 py-2 bg-emerald-50 rounded-lg inline-block">
                          <div className="text-sm font-bold text-emerald-900">{formatPrice(book.price)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex space-x-3">
                          <button onClick={() => handleEdit(book)} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition duration-200 flex items-center text-sm font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(book.id, book.title)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition duration-200 flex items-center text-sm font-medium">
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
          <BookModal
            isOpen={showAddModal}
            onClose={() => { setShowAddModal(false); resetForm(); }}
            title="Add New Book"
            formData={formData}
            imagePreview={imagePreview}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
            onSubmit={handleSubmit}
            loading={loading}
            loadingAuthors={loadingAuthors}
            submitText="Add Book"
            bookstores={bookstores}
            authors={authors}
            selectedBookstore={selectedBookstore}
            selectedAuthor={selectedAuthor}
          />
        )}

        {/* Edit Book Modal */}
        {showEditModal && selectedBook && (
          <BookModal
            isOpen={showEditModal}
            onClose={() => { setShowEditModal(false); resetForm(); }}
            title="Edit Book"
            formData={formData}
            imagePreview={imagePreview}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
            onSubmit={handleUpdate}
            loading={loading}
            loadingAuthors={loadingAuthors}
            submitText="Update Book"
            bookstores={bookstores}
            authors={authors}
            selectedBookstore={selectedBookstore}
            selectedAuthor={selectedAuthor}
          />
        )}

        {showScrollTop && (
          <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-40">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Reusable Book Modal Component
const BookModal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  imagePreview,
  onChange, 
  onImageChange,
  onRemoveImage,
  onSubmit, 
  loading, 
  loadingAuthors,
  submitText,
  bookstores,
  authors,
  selectedBookstore,
  selectedAuthor
}) => {
  if (!isOpen) return null;

  const renderAuthorAvatar = (avatar, name) => {
    if (!avatar) {
      return <span className="text-2xl">{name?.charAt(0) || '👤'}</span>;
    }
    
    let avatarUrl = null;
    let displayText = name?.charAt(0) || '👤';
    
    if (typeof avatar === 'string' && avatar.startsWith('[')) {
      try {
        const parsed = JSON.parse(avatar);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].startsWith('data:image')) {
          avatarUrl = parsed[0];
        }
      } catch (e) {}
    } else if (typeof avatar === 'string' && avatar.startsWith('data:image')) {
      avatarUrl = avatar;
    } else if (typeof avatar === 'string' && !avatar.startsWith('data:image')) {
      displayText = avatar;
    }
    
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={name}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-2xl">${name?.charAt(0) || '👤'}</span>`;
            }
          }}
        />
      );
    }
    
    return <span className="text-2xl">{displayText}</span>;
  };

  return (
    <div className="fixed inset-0 bg-emerald-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{title}</h2>
              <p className="text-emerald-100">Fill in the book details below</p>
            </div>
            <button onClick={onClose} className="text-emerald-100 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Select Bookstore *</label>
                <select
                  name="bookstore_id"
                  value={formData.bookstore_id}
                  onChange={onChange}
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
                <label className="block text-sm font-medium text-emerald-700 mb-2">Select Author *</label>
                <select
                  name="author_id"
                  value={formData.author_id}
                  onChange={onChange}
                  required
                  disabled={!formData.bookstore_id || loadingAuthors}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white disabled:bg-emerald-50 disabled:text-emerald-400"
                >
                  <option value="" className="text-emerald-400">-- Select an Author --</option>
                  {loadingAuthors && formData.bookstore_id && (
                    <option value="" disabled className="text-emerald-400">Loading authors...</option>
                  )}
                  {authors.map(author => (
                    <option key={author.id} value={author.id} className="text-emerald-900">
                      {author.name}
                    </option>
                  ))}
                  {!loadingAuthors && authors.length === 0 && formData.bookstore_id && (
                    <option value="" disabled className="text-emerald-400">No authors found. Add authors first.</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-3">Book Cover Image</label>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Book cover preview" className="h-40 w-28 object-cover rounded-xl shadow-lg border-2 border-emerald-200" />
                      <button type="button" onClick={onRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200 shadow-md">
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
                          <input id="book-image-upload" name="book-image" type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" className="sr-only" onChange={onImageChange} />
                        </label>
                        <p className="pl-3 self-center">or drag and drop</p>
                      </div>
                      <p className="text-xs text-emerald-500">PNG, JPG, GIF up to 5MB (will be compressed)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Book Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={onChange} required className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Enter book title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={onChange} step="0.01" className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="e.g., 19.99" min="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Genre</label>
                  <input type="text" name="genre" value={formData.genre} onChange={onChange} className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="e.g., Fiction, Mystery, Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Published Date</label>
                  <input type="date" name="published_date" value={formData.published_date} onChange={onChange} className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">ISBN</label>
                <input type="text" name="isbn" value={formData.isbn} onChange={onChange} className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="e.g., 978-3-16-148410-0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={onChange} rows="4" className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Describe the book..." />
            </div>

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
                        <div className="text-2xl bg-emerald-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center">
                          {selectedBookstore.logo || '📚'}
                        </div>
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
                        <div className="bg-green-100 p-3 rounded-lg flex items-center justify-center w-12 h-12 overflow-hidden">
                          {renderAuthorAvatar(selectedAuthor.avatar, selectedAuthor.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">Author</p>
                          <p className="text-sm text-green-700">{selectedAuthor.name}</p>
                          <p className="text-xs text-green-500">{selectedAuthor.genre || 'No genre specified'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-emerald-100">
              <button type="button" onClick={onClose} className="px-6 py-3 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50 transition duration-200 font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 transition duration-200 font-medium shadow-md hover:shadow-lg">
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;