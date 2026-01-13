import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BookstoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [bookstore, setBookstore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Discovering Bookstore</h3>
              <p className="text-gray-500">Loading literary haven details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bookstore) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto mt-20">
            <div className="inline-block p-4 bg-red-50 rounded-full mb-6">
              <span className="text-4xl text-red-500">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Bookstore Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The bookstore does not exist in our collection.'}</p>
            <button 
              onClick={() => navigate('/bookstore')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Return to Bookstore Partners
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link to="/bookstore" className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Bookstore Partners
            </Link>
          </div>

          {/* Bookstore Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
            {/* Hero Image Section - Fixed with object-contain */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
              {bookstore.image_url ? (
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <img 
                    src={bookstore.image_url?.startsWith('http') ? bookstore.image_url : `https://api.fulfill1st.com${bookstore.image_url}`}
                    alt={bookstore.name}
                    className="max-w-full max-h-full object-contain border border-gray-200 rounded-lg shadow-sm"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="flex flex-col items-center justify-center">
                          <div class="text-7xl mb-4">${bookstore.logo || '📚'}</div>
                          <div class="text-3xl font-bold text-gray-800">${bookstore.name}</div>
                        </div>
                      `;
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-7xl mb-6 text-gray-600">{bookstore.logo || '📚'}</div>
                  <h1 className="text-4xl font-bold text-gray-800 text-center">{bookstore.name}</h1>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/90 to-transparent"></div>
              
              {/* Floating Info Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-gray-700 font-medium">
                    {bookstore.rating || 5.0}
                  </span>
                </div>
              </div>
            </div>

            {/* Bookstore Info Section */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                      {bookstore.category || 'Independent Bookstore'}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{bookstore.name}</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">{bookstore.description || 'No description available.'}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookstore.address && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="text-gray-900">{bookstore.address}</div>
                        </div>
                      </div>
                    )}
                    
                    {bookstore.phone && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="text-gray-900">{bookstore.phone}</div>
                        </div>
                      </div>
                    )}
                    
                    {bookstore.email && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="text-gray-900">{bookstore.email}</div>
                        </div>
                      </div>
                    )}
                    
                    {bookstore.website && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm text-gray-500">Website</div>
                          <a href={bookstore.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 font-medium">
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Store Statistics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">Books Published</div>
                      <div className="text-xl font-bold text-gray-900">{bookstore.totalBooks || 0}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">Featured Authors</div>
                      <div className="text-xl font-bold text-gray-900">{bookstore.featuredAuthors || 0}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">Year Established</div>
                      <div className="text-xl font-bold text-gray-900">{bookstore.established || 'N/A'}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="text-sm text-gray-600">Reviews</div>
                      <div className="text-xl font-bold text-gray-900">{bookstore.reviews || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Authors Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Authors</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {bookstore.authors?.length || 0} authors
              </span>
            </div>
            
            {bookstore.authors && bookstore.authors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookstore.authors.map((author) => (
                  <div key={author.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg mr-3">
                          {author.avatar || '👤'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{author.name}</h3>
                          <p className="text-sm text-gray-600">{author.genre || 'Author'}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{author.bio || 'No biography available.'}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">{author.books_count || 0} books</span>
                        <button 
                          onClick={() => handleViewAuthorBooks(author)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          View Books
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <div className="text-5xl mb-4 text-gray-400">✍️</div>
                <p className="text-gray-600">No authors found for this bookstore.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author Books Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto animate-in fade-in duration-300">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={closeModal}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedAuthor?.name}'s Books</h3>
                    <p className="text-blue-100 text-sm mt-1">{authorBooks.length} published works</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {isLoadingBooks ? (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading books...</p>
                  </div>
                ) : authorBooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authorBooks.map((book) => {
                      const bookImageUrl = book.image_url 
                            ? book.image_url.startsWith('http') 
                              ? book.image_url 
                              : `https://api.fulfill1st.com${book.image_url}`
                            : null;
                      
                      return (
                        <div key={book.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          {/* Book Image */}
                          <div className="h-48 bg-gray-100 flex items-center justify-center">
                            {bookImageUrl ? (
                              <img 
                                src={bookImageUrl}
                                alt={book.title}
                                className="max-w-full max-h-full object-contain p-4"
                              />
                            ) : (
                              <div className="text-5xl text-gray-400">📖</div>
                            )}
                          </div>
                          
                          {/* Book Info */}
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{book.title}</h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{book.description}</p>
                            
                            <div className="space-y-2 text-sm">
                              {book.published_date && (
                                <div className="flex items-center text-gray-500">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {new Date(book.published_date).toLocaleDateString()}
                                </div>
                              )}
                              
                              {book.price && (
                                <div className="flex items-center text-green-600 font-medium">
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
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 text-gray-300">📝</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No Books Published Yet</h4>
                    <p className="text-gray-500">This author is currently working on new projects.</p>
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