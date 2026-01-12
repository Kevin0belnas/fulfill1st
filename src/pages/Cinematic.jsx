const Cinematic = () => {
  const movies = [
    { 
      id: 1, 
      title: 'The Lord of the Rings', 
      director: 'Peter Jackson', 
      rating: '9.0',
      year: '2001-2003',
      basedOn: 'J.R.R. Tolkien',
      genre: 'Fantasy'
    },
    { 
      id: 2, 
      title: 'Harry Potter Series', 
      director: 'Multiple Directors', 
      rating: '8.5',
      year: '2001-2011',
      basedOn: 'J.K. Rowling',
      genre: 'Fantasy'
    },
    { 
      id: 3, 
      title: 'The Shawshank Redemption', 
      director: 'Frank Darabont', 
      rating: '9.3',
      year: '1994',
      basedOn: 'Stephen King',
      genre: 'Drama'
    },
    { 
      id: 4, 
      title: 'The Godfather', 
      director: 'Francis Ford Coppola', 
      rating: '9.2',
      year: '1972',
      basedOn: 'Mario Puzo',
      genre: 'Crime'
    },
    { 
      id: 5, 
      title: 'To Kill a Mockingbird', 
      director: 'Robert Mulligan', 
      rating: '8.2',
      year: '1962',
      basedOn: 'Harper Lee',
      genre: 'Drama'
    },
    { 
      id: 6, 
      title: 'The Great Gatsby', 
      director: 'Baz Luhrmann', 
      rating: '7.2',
      year: '2013',
      basedOn: 'F. Scott Fitzgerald',
      genre: 'Romance'
    },
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Cinematic Adaptations</h1>
        <p className="page-description">
          Explore movies based on famous books and literary works. See how your favorite stories come to life on screen!
        </p>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="card group hover:shadow-xl transition-all duration-300">
              {/* Movie Poster */}
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20">🎬</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold">
                  {movie.rating}/10
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {movie.year}
                  </span>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {movie.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Directed by {movie.director}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Based on {movie.basedOn}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17 10a7 7 0 11-14 0 7 7 0 0114 0zm-7-3a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                    </svg>
                    Genre: {movie.genre}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    Watch Trailer
                  </button>
                  <button className="btn-outline border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">
                    Book Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Section */}
        <div className="mt-12 bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Did You Know?</h2>
          <p className="text-gray-700 mb-4">
            Many successful movies started as books! Some adaptations become even more popular than their 
            original literary works, introducing the stories to new audiences worldwide.
          </p>
          <button className="btn-outline border-blue-600 text-blue-600">
            Explore More Adaptations →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cinematic;