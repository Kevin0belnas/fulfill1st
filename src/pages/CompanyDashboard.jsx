import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CompanyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookstores, setRecentBookstores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
        setRecentBookstores(data.data.recentBookstores || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to the Bookstore Management System</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookstores</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.bookstores || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Authors</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.authors || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.books || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">📖</span>
            </div>
          </div>
          </div>
      </div>

      {/* Recent Bookstores */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookstores</h2>
          <Link to="/company/manage-bookstore" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {recentBookstores.length > 0 ? (
          <div className="space-y-4">
            {recentBookstores.map((bookstore) => (
              <div key={bookstore.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{bookstore.logo || '📚'}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{bookstore.name}</h3>
                    <p className="text-sm text-gray-600">{bookstore.location}</p>
                  </div>
                </div>
                <Link 
                  to={`/bookstore/${bookstore.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No bookstores yet. Add your first bookstore!</p>
            <Link 
              to="/admin/bookstores/add"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Add Bookstore
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;