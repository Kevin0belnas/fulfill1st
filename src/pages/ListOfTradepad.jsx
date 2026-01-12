const ListOfTradepad = () => {
  const tradepads = [
    { 
      id: 1, 
      name: 'Classic Literature Exchange', 
      members: 1250, 
      books: 340,
      activity: 'High',
      description: 'Trade and discuss timeless classics from around the world',
      category: 'Literature'
    },
    { 
      id: 2, 
      name: 'Sci-Fi Book Club', 
      members: 890, 
      books: 210,
      activity: 'Medium',
      description: 'Exchange science fiction novels and discuss futuristic concepts',
      category: 'Sci-Fi'
    },
    { 
      id: 3, 
      name: 'Mystery & Thriller Traders', 
      members: 1120, 
      books: 290,
      activity: 'High',
      description: 'Swap suspenseful novels and unravel mysteries together',
      category: 'Mystery'
    },
    { 
      id: 4, 
      name: 'Academic Books Network', 
      members: 650, 
      books: 180,
      activity: 'Medium',
      description: 'Trade academic textbooks and scholarly works',
      category: 'Academic'
    },
    { 
      id: 5, 
      name: 'Comic Book Collectors', 
      members: 2300, 
      books: 520,
      activity: 'Very High',
      description: 'Exchange comic books, graphic novels, and collectibles',
      category: 'Comics'
    },
    { 
      id: 6, 
      name: 'Rare Books Society', 
      members: 480, 
      books: 95,
      activity: 'Low',
      description: 'For collectors of rare and antique books',
      category: 'Rare'
    },
  ];

  const getActivityColor = (activity) => {
    const colors = {
      'Very High': 'bg-green-100 text-green-800',
      'High': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-gray-100 text-gray-800',
    };
    return colors[activity] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Literature': 'bg-purple-100 text-purple-800',
      'Sci-Fi': 'bg-indigo-100 text-indigo-800',
      'Mystery': 'bg-red-100 text-red-800',
      'Academic': 'bg-blue-100 text-blue-800',
      'Comics': 'bg-orange-100 text-orange-800',
      'Rare': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">List of Tradepad</h1>
        <p className="page-description">
          Connect with book trading communities and exchange your favorite reads. Join a community that shares your literary interests!
        </p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-blue-600">6,790</div>
            <div className="text-gray-600">Total Members</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-green-600">1,635</div>
            <div className="text-gray-600">Books Available</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-gray-600">Active Trading</div>
          </div>
        </div>

        {/* Tradepads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tradepads.map((tradepad) => (
            <div key={tradepad.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tradepad.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(tradepad.category)}`}>
                      {tradepad.category}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActivityColor(tradepad.activity)}`}>
                    {tradepad.activity} Activity
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{tradepad.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{tradepad.members.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm">Members</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{tradepad.books}</div>
                    <div className="text-gray-600 text-sm">Books Available</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    Join Community
                  </button>
                  <button className="btn-outline border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">
                    View Members
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Community */}
        <div className="mt-12 bg-linear-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Can't find your niche?</h2>
              <p className="text-gray-700">
                Start your own trading community for your specific interests!
              </p>
            </div>
            <button className="btn-primary mt-4 md:mt-0 px-8 py-3">
              Create New Tradepad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListOfTradepad;
