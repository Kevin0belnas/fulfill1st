import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AuthorsBooksManagement = () => {
  const navigate = useNavigate();
  
  // State management
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookstores, setBookstores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('authors');
  
  // Unified Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Author Data
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorFormData, setAuthorFormData] = useState({
    bookstore_id: '',
    name: '',
    genre: '',
    bio: '',
    avatar: '👤',
    books_count: 0
  });
  
  // Books Data (for the selected author)
  const [authorBooks, setAuthorBooks] = useState([
    { title: '', price: '', genre: '', published_date: '', isbn: '', description: '', image_url: '' }
  ]);
  
  // Book Image Upload
  const [uploadingImages, setUploadingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Author Books Modal (for viewing)
  const [showViewBooksModal, setShowViewBooksModal] = useState(false);
  const [viewingAuthorBooks, setViewingAuthorBooks] = useState([]);
  const [selectedAuthorForView, setSelectedAuthorForView] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    fetchAuthors();
    fetchBooks();
    fetchBookstores();
  }, []);

  // Fetch data functions
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

  const fetchBooks = async () => {
    try {
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

  const fetchAuthorBooks = async (authorId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/authors/${authorId}/books`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data?.books || [];
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching author books:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Author Handlers
  const handleAuthorChange = (e) => {
    const { name, value } = e.target;
    setAuthorFormData(prev => ({
      ...prev,
      [name]: name === 'books_count' ? parseInt(value) || 0 : value
    }));
  };

  // Book Handlers (within author form)
  const handleBookChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBooks = [...authorBooks];
    updatedBooks[index] = {
      ...updatedBooks[index],
      [name]: value
    };
    setAuthorBooks(updatedBooks);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }

      const updatedFiles = [...imageFiles];
      updatedFiles[index] = file;
      setImageFiles(updatedFiles);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[index] = reader.result;
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadBookImage = async (file) => {
    if (!file) return null;

    try {
      const formData = new FormData();
      formData.append('image', file);

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
    }
  };

  const addBookField = () => {
    setAuthorBooks([...authorBooks, { title: '', price: '', genre: '', published_date: '', isbn: '', description: '', image_url: '' }]);
    setImageFiles([...imageFiles, null]);
    setImagePreviews([...imagePreviews, null]);
  };

  const removeBookField = (index) => {
    if (authorBooks.length > 1) {
      const updatedBooks = authorBooks.filter((_, i) => i !== index);
      const updatedFiles = imageFiles.filter((_, i) => i !== index);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      
      setAuthorBooks(updatedBooks);
      setImageFiles(updatedFiles);
      setImagePreviews(updatedPreviews);
    }
  };

  // Unified Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authorFormData.bookstore_id) {
      alert('Please select a bookstore');
      return;
    }
    
    if (!authorFormData.name) {
      alert('Please enter author name');
      return;
    }

    setLoading(true);

    try {
      // 1. First create the author
      const authorResponse = await fetch(`${API_BASE_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(authorFormData),
      });

      const authorData = await authorResponse.json();

      if (!authorData.success) {
        alert(`Error creating author: ${authorData.error}`);
        return;
      }

      const newAuthorId = authorData.data.id;
      let createdBooks = 0;

      // 2. Create books for this author
      for (let i = 0; i < authorBooks.length; i++) {
        const book = authorBooks[i];
        
        // Skip empty book entries
        if (!book.title.trim()) continue;

        // Upload image if provided
        let imageUrl = book.image_url;
        if (imageFiles[i]) {
          const uploadedImageUrl = await uploadBookImage(imageFiles[i]);
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
          }
        }

        // Format date
        let formattedDate = book.published_date;
        if (formattedDate) {
          formattedDate = new Date(formattedDate).toISOString().split('T')[0];
        } else {
          formattedDate = null;
        }

        const bookResponse = await fetch(`${API_BASE_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            bookstore_id: authorFormData.bookstore_id,
            author_id: newAuthorId,
            title: book.title,
            price: parseFloat(book.price) || 0,
            genre: book.genre || authorFormData.genre || '',
            published_date: formattedDate,
            isbn: book.isbn || '',
            description: book.description || '',
            image_url: imageUrl
          }),
        });

        const bookData = await bookResponse.json();
        if (bookData.success) {
          createdBooks++;
        }
      }

      // 3. Update author's book count
      if (createdBooks > 0) {
        await fetch(`${API_BASE_URL}/authors/${newAuthorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...authorFormData,
            books_count: createdBooks
          }),
        });
      }

      alert(`Successfully created author and ${createdBooks} book(s)!`);
      setShowAddModal(false);
      resetForms();
      fetchAuthors();
      fetchBooks();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create author and books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Handler
  const handleEdit = async (author) => {
    setSelectedAuthor(author);
    setAuthorFormData({
      bookstore_id: author.bookstore_id,
      name: author.name,
      genre: author.genre || '',
      bio: author.bio || '',
      avatar: author.avatar || '👤',
      books_count: author.books_count || 0
    });
    
    // Fetch existing books for this author
    const existingBooks = await fetchAuthorBooks(author.id);
    if (existingBooks.length > 0) {
      setAuthorBooks(existingBooks.map(book => ({
        title: book.title,
        price: book.price,
        genre: book.genre,
        published_date: book.published_date ? new Date(book.published_date).toISOString().split('T')[0] : '',
        isbn: book.isbn,
        description: book.description,
        image_url: book.image_url
      })));
      
      // Load image previews for existing books
      const previews = existingBooks.map(book => 
        book.image_url ? getFullImageUrl(book.image_url) : null
      );
      setImagePreviews(previews);
    } else {
      setAuthorBooks([{ title: '', price: '', genre: '', published_date: '', isbn: '', description: '', image_url: '' }]);
    }
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!authorFormData.bookstore_id) {
      alert('Please select a bookstore');
      return;
    }
    
    if (!authorFormData.name) {
      alert('Please enter author name');
      return;
    }

    setLoading(true);

    try {
      // 1. Update the author
      const authorResponse = await fetch(`${API_BASE_URL}/authors/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(authorFormData),
      });

      const authorData = await authorResponse.json();

      if (!authorData.success) {
        alert(`Error updating author: ${authorData.error}`);
        return;
      }

      let createdBooks = 0;

      // 2. For simplicity in this demo, let's create new books (in a real app, you'd handle updates/deletes)
      for (let i = 0; i < authorBooks.length; i++) {
        const book = authorBooks[i];
        
        // Skip empty book entries
        if (!book.title.trim()) continue;

        // Check if this is an existing book or new one
        // For demo, we'll create new ones. In production, you'd need book IDs to update existing ones.
        
        // Upload image if provided
        let imageUrl = book.image_url;
        if (imageFiles[i] && !imagePreviews[i]) {
          const uploadedImageUrl = await uploadBookImage(imageFiles[i]);
          if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
          }
        }

        // Format date
        let formattedDate = book.published_date;
        if (formattedDate) {
          formattedDate = new Date(formattedDate).toISOString().split('T')[0];
        } else {
          formattedDate = null;
        }

        // Check if this book already exists (by title for simplicity)
        // In production, use book IDs
        const existingBook = books.find(b => b.author_id === selectedAuthor.id && b.title === book.title);
        
        if (existingBook) {
          // Update existing book
          const bookResponse = await fetch(`${API_BASE_URL}/books/${existingBook.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              bookstore_id: authorFormData.bookstore_id,
              author_id: selectedAuthor.id,
              title: book.title,
              price: parseFloat(book.price) || 0,
              genre: book.genre || authorFormData.genre || '',
              published_date: formattedDate,
              isbn: book.isbn || '',
              description: book.description || '',
              image_url: imageUrl
            }),
          });
          
          const bookData = await bookResponse.json();
          if (bookData.success) {
            createdBooks++;
          }
        } else {
          // Create new book
          const bookResponse = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              bookstore_id: authorFormData.bookstore_id,
              author_id: selectedAuthor.id,
              title: book.title,
              price: parseFloat(book.price) || 0,
              genre: book.genre || authorFormData.genre || '',
              published_date: formattedDate,
              isbn: book.isbn || '',
              description: book.description || '',
              image_url: imageUrl
            }),
          });

          const bookData = await bookResponse.json();
          if (bookData.success) {
            createdBooks++;
          }
        }
      }

      alert(`Successfully updated author and ${createdBooks} book(s)!`);
      setShowEditModal(false);
      resetForms();
      fetchAuthors();
      fetchBooks();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update author and books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    if (!window.confirm('Are you sure you want to delete this author? All books by this author will also be deleted.')) {
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
        fetchBooks();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Failed to delete author. Please try again.');
    }
  };

  const handleViewAuthorBooks = async (author) => {
    setSelectedAuthorForView(author);
    setShowViewBooksModal(true);
    const books = await fetchAuthorBooks(author.id);
    setViewingAuthorBooks(books);
  };

  // Helper Functions
  const getBookstoreName = (bookstoreId) => {
    const bookstore = bookstores.find(b => b.id === bookstoreId);
    return bookstore ? bookstore.name : 'Unknown Bookstore';
  };

  const getAuthorName = (authorId) => {
    const author = authors.find(a => a.id === authorId);
    return author ? author.name : 'Unknown Author';
  };

  const resetForms = () => {
    setAuthorFormData({
      bookstore_id: '',
      name: '',
      genre: '',
      bio: '',
      avatar: '👤',
      books_count: 0
    });
    setAuthorBooks([{ title: '', price: '', genre: '', published_date: '', isbn: '', description: '', image_url: '' }]);
    setImageFiles([]);
    setImagePreviews([]);
    setSelectedAuthor(null);
  };

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

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('/uploads/')) {
      return `${API_BASE_URL.replace('/api', '')}${url}`;
    }
    return url;
  };

  if (loading && authors.length === 0 && books.length === 0) {
    return (
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-emerald-700">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Authors & Books Management</h1>
          <p className="text-emerald-700">
            Manage authors and their published books across all bookstores
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Author with Books
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-emerald-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('authors')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'authors'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-emerald-500 hover:text-emerald-700 hover:border-emerald-300'
            }`}
          >
            Authors ({authors.length})
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'books'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-emerald-500 hover:text-emerald-700 hover:border-emerald-300'
            }`}
          >
            Books ({books.length})
          </button>
        </nav>
      </div>

      {/* Authors Tab */}
      {activeTab === 'authors' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-200">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Bookstore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Books
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {authors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-emerald-600">
                      No authors found. Add your first author!
                    </td>
                  </tr>
                ) : (
                  authors.map((author) => (
                    <tr key={author.id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3 text-emerald-600">{author.avatar || '👤'}</div>
                          <div>
                            <div className="text-sm font-medium text-emerald-900">{author.name}</div>
                            <div className="text-sm text-emerald-700 truncate max-w-xs">
                              {author.bio ? `${author.bio.substring(0, 60)}...` : 'No biography'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-900">
                          {getBookstoreName(author.bookstore_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full border border-emerald-200">
                          {author.genre || 'Not specified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-emerald-700">
                            {author.books_count} books
                          </span>
                          {author.books_count > 0 && (
                            <button
                              onClick={() => handleViewAuthorBooks(author)}
                              className="text-emerald-600 hover:text-emerald-900 text-xs font-medium px-2 py-1 bg-emerald-50 rounded-lg"
                            >
                              View
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(author)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAuthor(author.id)}
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
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-emerald-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-200">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Bookstore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-emerald-600">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {book.image_url ? (
                              <img 
                                src={getFullImageUrl(book.image_url)} 
                                alt={book.title}
                                className="h-16 w-12 object-cover rounded-md shadow-sm border border-emerald-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${API_BASE_URL.replace('/api', '')}/uploads/books/default-book.jpg`;
                                }}
                              />
                            ) : (
                              <div className="h-16 w-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-md flex items-center justify-center shadow-sm border border-emerald-200">
                                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-emerald-900 truncate">
                              {book.title}
                            </div>
                            <div className="text-sm text-emerald-700 mt-1">
                              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-full border border-emerald-200">
                                {book.genre || 'No genre'}
                              </span>
                            </div>
                            {book.description && (
                              <div className="text-sm text-emerald-600 truncate max-w-xs mt-1">
                                {book.description.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-900">{book.author_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-900">{book.bookstore_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-emerald-700">
                          {formatDisplayDate(book.published_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-emerald-900">
                          {formatPrice(book.price)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unified Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-900">Add Author with Books</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForms();
                  }}
                  className="text-emerald-400 hover:text-emerald-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Author Information Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Author Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-1">
                          Select Bookstore *
                        </label>
                        <select
                          name="bookstore_id"
                          value={authorFormData.bookstore_id}
                          onChange={handleAuthorChange}
                          required
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
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
                        <label className="block text-sm font-medium text-emerald-700 mb-1">
                          Author Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={authorFormData.name}
                          onChange={handleAuthorChange}
                          required
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., Jit Lee"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-1">
                          Genre/Specialization
                        </label>
                        <input
                          type="text"
                          name="genre"
                          value={authorFormData.genre}
                          onChange={handleAuthorChange}
                          className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="e.g., Fiction, Mystery, Science"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-1">
                          Avatar Emoji
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            name="avatar"
                            value={authorFormData.avatar}
                            onChange={handleAuthorChange}
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="👤"
                            maxLength="2"
                          />
                          <div className="text-2xl text-emerald-600">{authorFormData.avatar || '👤'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-emerald-700 mb-1">
                      Author Biography
                    </label>
                    <textarea
                      name="bio"
                      value={authorFormData.bio}
                      onChange={handleAuthorChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Write about the author's background, achievements, and writing style..."
                    />
                  </div>
                </div>

                {/* Books Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Author's Books
                    </h3>
                    <button
                      type="button"
                      onClick={addBookField}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-200 text-sm font-medium"
                    >
                      + Add Another Book
                    </button>
                  </div>

                  <p className="text-blue-700 text-sm mb-6">
                    Add books written by this author. You can add multiple books at once.
                  </p>

                  {authorBooks.map((book, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-blue-900">Book {index + 1}</h4>
                        {authorBooks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBookField(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Book Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={book.title}
                            onChange={(e) => handleBookChange(index, e)}
                            required
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Kung Fu Panda"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={book.price}
                            onChange={(e) => handleBookChange(index, e)}
                            step="0.01"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 19.99"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Genre
                          </label>
                          <input
                            type="text"
                            name="genre"
                            value={book.genre}
                            onChange={(e) => handleBookChange(index, e)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Fiction, Mystery, Science"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Published Date
                          </label>
                          <input
                            type="date"
                            name="published_date"
                            value={book.published_date}
                            onChange={(e) => handleBookChange(index, e)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          ISBN
                        </label>
                        <input
                          type="text"
                          name="isbn"
                          value={book.isbn}
                          onChange={(e) => handleBookChange(index, e)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 978-3-16-148410-0"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={book.description}
                          onChange={(e) => handleBookChange(index, e)}
                          rows="2"
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe the book..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-1">
                          Book Cover Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(index, e)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-blue-600 mt-1">PNG, JPG, GIF up to 5MB</p>
                        {imagePreviews[index] && (
                          <div className="mt-2">
                            <img src={imagePreviews[index]} alt="Preview" className="h-32 rounded-lg shadow-md" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-emerald-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForms();
                    }}
                    className="px-6 py-2 border border-emerald-300 rounded-lg text-emerald-700 hover:bg-emerald-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 transition duration-200"
                  >
                    {loading ? 'Creating...' : 'Create Author with Books'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Author Books Modal */}
      {showViewBooksModal && selectedAuthorForView && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-3xl text-emerald-600">{selectedAuthorForView.avatar || '👤'}</div>
                    <div>
                      <h2 className="text-2xl font-bold text-emerald-900">{selectedAuthorForView.name}'s Books</h2>
                      <p className="text-emerald-700">
                        {selectedAuthorForView.genre} • {getBookstoreName(selectedAuthorForView.bookstore_id)}
                      </p>
                    </div>
                  </div>
                  <p className="text-emerald-700 mt-1">{viewingAuthorBooks.length} published works</p>
                </div>
                <button
                  onClick={() => {
                    setShowViewBooksModal(false);
                    setSelectedAuthorForView(null);
                    setViewingAuthorBooks([]);
                  }}
                  className="text-emerald-400 hover:text-emerald-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-emerald-700">Loading books...</p>
                </div>
              ) : viewingAuthorBooks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl text-emerald-300 mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">No Books Published Yet</h3>
                  <p className="text-emerald-600">This author is currently working on new projects.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {viewingAuthorBooks.map((book) => {
                    const bookImageUrl = book.image_url 
                          ? book.image_url.startsWith('http') 
                            ? book.image_url 
                            : `https://api.fulfill1st.com${book.image_url}`
                          : null;
                    
                    return (
                      <div key={book.id} className="bg-white border border-emerald-200 rounded-lg overflow-hidden hover:shadow-md transition-all hover:border-emerald-300">
                        <div className="h-48 bg-emerald-50 flex items-center justify-center">
                          {bookImageUrl ? (
                            <img 
                              src={bookImageUrl}
                              alt={book.title}
                              className="max-w-full max-h-full object-contain p-4"
                            />
                          ) : (
                            <div className="text-5xl text-emerald-400">📖</div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-bold text-emerald-900 mb-2 line-clamp-1">{book.title}</h4>
                          <p className="text-emerald-800 text-sm mb-3 line-clamp-2">{book.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            {book.published_date && (
                              <div className="flex items-center text-emerald-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formatDisplayDate(book.published_date)}
                              </div>
                            )}
                            
                            {book.price && (
                              <div className="flex items-center text-emerald-700 font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ${parseFloat(book.price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorsBooksManagement;