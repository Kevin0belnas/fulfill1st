import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookstoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookstore, setBookstore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  // Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    return () => clearTimeout(timer);
  }, [location]);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchBookstore();
  }, [id]);

  const fetchBookstore = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/bookstores/${id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Bookstore not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookstore(data.success ? data.data : data);
    } catch (error) {
      console.error('Error fetching bookstore:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorBooks = async (authorId) => {
    try {
      setIsLoadingBooks(true);
      const response = await fetch(`${API_BASE_URL}/authors/${authorId}/books`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch author's books. Status: ${response.status}`);
      }
      
      const data = await response.json();
      let books = [];
      
      if (data.success) {
        if (data.data && data.data.books) {
          books = data.data.books;
        } else if (data.data && Array.isArray(data.data)) {
          books = data.data;
        } else if (data.books) {
          books = data.books;
        }
      }
      setAuthorBooks(books);
    } catch (error) {
      console.error('Error fetching author books:', error);
      setAuthorBooks([]);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleViewAuthorBooks = async (author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
    await fetchAuthorBooks(author.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAuthor(null);
    setAuthorBooks([]);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-12 h-12 border-3 border-emerald-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-1">Loading Bookstore</h3>
              <p className="text-sm text-emerald-700">Getting details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookstore) {
    return (
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-md mx-auto px-3 sm:px-4 lg:px-6 py-8">
          <div className={`text-center ${theme.bg.card} rounded-xl ${theme.shadow.card} p-6 ${theme.border.light} border`}>
            <div className="text-5xl mb-4 text-red-400">📚</div>
            <h1 className="text-xl font-bold text-emerald-900 mb-3">Bookstore Not Found</h1>
            <p className="text-sm text-emerald-700 mb-6">{error || 'Bookstore not found'}</p>
            <button 
              onClick={() => navigate('/bookstore')}
              className={`w-full ${theme.gradient.primary} text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:shadow transition-all`}
            >
              Return to Bookstores
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen ${theme.bg.primary} pt-20 pb-8 relative`}>
        <div className="max-w-screen mx-auto px-3 sm:px-4 lg:px-6">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to="/bookstore" className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-900 font-medium group">
              <svg className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Bookstores
            </Link>
          </div>

          {/* Bookstore Header */}
          <div className={`${theme.bg.card} rounded-lg ${theme.shadow.card} overflow-hidden mb-6 ${theme.border.light} border`}>
            {/* Hero Image Section */}
            <div className="relative h-40 bg-gradient-to-r from-emerald-50 to-green-50 flex items-center justify-center">
              {bookstore.image_url ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img 
                    src={bookstore.image_url?.startsWith('http') ? bookstore.image_url : `https://api.fulfill1st.com${bookstore.image_url}`}
                    alt={bookstore.name}
                    className="max-w-full max-h-full object-contain border border-emerald-200 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center">
                          <div class="text-4xl mb-2 text-emerald-600">${bookstore.logo || '📚'}</div>
                          <div class="text-lg font-bold text-emerald-900">${bookstore.name}</div>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-4xl mb-3 text-emerald-600">{bookstore.logo || '📚'}</div>
                  <h1 className="text-xl font-bold text-emerald-900 text-center">{bookstore.name}</h1>
                </div>
              )}
              
              {/* Rating Badge */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow border border-emerald-200">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-yellow-400">★</span>
                  <span className="text-sm text-emerald-900 font-medium">
                    {bookstore.rating || 5.0}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookstore Info Section */}
            <div className="p-4">
              <div className="mb-4">
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium mb-3 border border-emerald-200">
                  {bookstore.category || 'Independent'}
                </div>
                <h2 className="text-lg font-bold text-emerald-900 mb-2">{bookstore.name}</h2>
                <p className="text-sm text-emerald-800 mb-4 leading-relaxed">{bookstore.description || 'No description available.'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {bookstore.address && (
                  <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-emerald-700">Location</div>
                      <div className="text-sm text-emerald-900 font-medium truncate">{bookstore.address}</div>
                    </div>
                  </div>
                )}
                
                {bookstore.phone && (
                  <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-emerald-700">Phone</div>
                      <div className="text-sm text-emerald-900 font-medium">{bookstore.phone}</div>
                    </div>
                  </div>
                )}
                
                {bookstore.email && (
                  <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-emerald-700">Email</div>
                      <div className="text-sm text-emerald-900 font-medium truncate">{bookstore.email}</div>
                    </div>
                  </div>
                )}
                
                {bookstore.website && (
                  <div className="flex items-start p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-emerald-700">Website</div>
                      <a href={bookstore.website} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center group">
                        Visit
                        <svg className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="bg-emerald-50/80 rounded-lg p-3 border border-emerald-200">
                <h3 className="text-sm font-semibold text-emerald-900 mb-3">Store Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-white rounded border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-700">{bookstore.totalBooks || 0}</div>
                    <div className="text-xs text-emerald-600">Books</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-700">{bookstore.featuredAuthors || 0}</div>
                    <div className="text-xs text-emerald-600">Authors</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-700">{bookstore.established || 'N/A'}</div>
                    <div className="text-xs text-emerald-600">Established</div>
                  </div>
                  <div className="text-center p-2 bg-white rounded border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-700">{bookstore.reviews || 0}</div>
                    <div className="text-xs text-emerald-600">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Authors Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-emerald-900">Featured Authors</h2>
              <span className="text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full font-medium">
                {bookstore.authors?.length || 0} authors
              </span>
            </div>
            
            {bookstore.authors && bookstore.authors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookstore.authors.map((author) => (
                  <div key={author.id} className={`${theme.bg.card} rounded-lg ${theme.shadow.card} hover:${theme.shadow.hover} transition-all duration-300 border ${theme.border.light} overflow-hidden hover:border-emerald-300 group`}>
                    <div className="p-3">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center text-sm mr-3 text-emerald-800 font-bold">
                          {author.avatar || author.name?.charAt(0) || '👤'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-emerald-900 truncate group-hover:text-emerald-700">{author.name}</h3>
                          <p className="text-xs text-emerald-600 truncate">{author.genre || 'Author'}</p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-emerald-800 mb-3 line-clamp-2 h-8">{author.bio || 'No biography available.'}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-emerald-100">
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {author.books_count || 0} books
                        </span>
                        <button 
                          onClick={() => handleViewAuthorBooks(author)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center group"
                        >
                          View Books
                          <svg className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-lg p-6 text-center border border-emerald-200">
                <div className="text-3xl mb-2 text-emerald-400">✍️</div>
                <h3 className="text-sm font-semibold text-emerald-800 mb-1">No Authors Found</h3>
                <p className="text-xs text-emerald-600">No authors added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-4 right-4 ${theme.gradient.primary} text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all z-40`}
          aria-label="Scroll to top"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Author Books Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-3 pb-20 text-center">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            ></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-4xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedAuthor?.name}'s Books</h3>
                    <p className="text-emerald-100 text-xs mt-0.5">{authorBooks.length} works</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-emerald-100 p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {isLoadingBooks ? (
                  <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
                    <p className="text-sm text-emerald-700">Loading books...</p>
                  </div>
                ) : authorBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {authorBooks.map((book) => {
                      const bookImageUrl = book.image_url 
                            ? book.image_url.startsWith('http') 
                              ? book.image_url 
                              : `https://api.fulfill1st.com${book.image_url}`
                            : null;
                      
                      return (
                        <div key={book.id} className="bg-white border border-emerald-100 rounded overflow-hidden hover:shadow transition-all hover:border-emerald-300">
                          {/* Book Image */}
                          <div className="h-32 bg-emerald-50 flex items-center justify-center">
                            {bookImageUrl ? (
                              <img 
                                src={bookImageUrl}
                                alt={book.title}
                                className="max-w-full max-h-full object-contain p-2"
                              />
                            ) : (
                              <div className="text-3xl text-emerald-400">📖</div>
                            )}
                          </div>
                          
                          {/* Book Info */}
                          <div className="p-3">
                            <h4 className="text-sm font-semibold text-emerald-900 mb-1 truncate">{book.title}</h4>
                            <p className="text-xs text-emerald-800 mb-2 line-clamp-2 h-8">{book.description}</p>
                            
                            <div className="space-y-1 text-xs">
                              {book.published_date && (
                                <div className="flex items-center text-emerald-600">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(book.published_date).toLocaleDateString()}
                                </div>
                              )}
                              
                              {book.price && (
                                <div className="flex items-center text-emerald-700 font-medium">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                ) : (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2 text-emerald-300">📝</div>
                    <h4 className="text-sm font-semibold text-emerald-800 mb-1">No Books Published Yet</h4>
                    <p className="text-xs text-emerald-600">Working on new projects</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookstoreDetail;