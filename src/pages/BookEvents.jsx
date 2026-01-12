const BookEvents = () => {
  const events = [
    { 
      id: 1, 
      title: 'Author Meet & Greet', 
      date: '2024-06-15', 
      location: 'Main Library', 
      time: '2:00 PM',
      attendees: 120,
      type: 'Meetup'
    },
    { 
      id: 2, 
      title: 'Book Launch: "New Beginnings"', 
      date: '2024-06-20', 
      location: 'Community Hall', 
      time: '6:00 PM',
      attendees: 200,
      type: 'Launch'
    },
    { 
      id: 3, 
      title: 'Poetry Reading Night', 
      date: '2024-06-25', 
      location: 'Coffee & Books Cafe', 
      time: '7:30 PM',
      attendees: 80,
      type: 'Reading'
    },
    { 
      id: 4, 
      title: 'Writing Workshop', 
      date: '2024-07-05', 
      location: 'Creative Center', 
      time: '10:00 AM',
      attendees: 50,
      type: 'Workshop'
    },
    { 
      id: 5, 
      title: 'Book Club Meeting', 
      date: '2024-07-10', 
      location: 'Central Library', 
      time: '4:00 PM',
      attendees: 30,
      type: 'Club'
    },
    { 
      id: 6, 
      title: 'Children\'s Story Time', 
      date: '2024-07-12', 
      location: 'Children\'s Library', 
      time: '11:00 AM',
      attendees: 60,
      type: 'Children'
    },
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      'Meetup': 'bg-blue-100 text-blue-800',
      'Launch': 'bg-purple-100 text-purple-800',
      'Reading': 'bg-green-100 text-green-800',
      'Workshop': 'bg-yellow-100 text-yellow-800',
      'Club': 'bg-red-100 text-red-800',
      'Children': 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <h1 className="page-title">Book Events</h1>
        <p className="page-description">
          Join our exciting literary events, workshops, and author meetups. Connect with fellow book lovers!
        </p>

        {/* Upcoming Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{event.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {new Date(event.date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {event.date} • {event.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {event.attendees} attendees registered
                    </div>
                  </div>
                  
                  <button className="btn-primary w-full">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEvents;