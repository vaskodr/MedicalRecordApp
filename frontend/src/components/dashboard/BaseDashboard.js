import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const BaseDashboard = ({ 
  fetchEndpoint, 
  renderContent, 
  dashboardTitle, 
  dashboardIcon: DashboardIcon = HomeIcon,
  dashboardColor = "blue",
  dashboardDescription = "Welcome to your dashboard"
}) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const colorClasses = {
    blue: {
      header: "bg-gradient-to-r from-blue-600 to-blue-700",
      icon: "bg-blue-100 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    green: {
      header: "bg-gradient-to-r from-green-600 to-green-700",
      icon: "bg-green-100 text-green-600",
      button: "bg-green-600 hover:bg-green-700"
    },
    teal: {
      header: "bg-gradient-to-r from-teal-600 to-teal-700",
      icon: "bg-teal-100 text-teal-600",
      button: "bg-teal-600 hover:bg-teal-700"
    },
    purple: {
      header: "bg-gradient-to-r from-purple-600 to-purple-700",
      icon: "bg-purple-100 text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    orange: {
      header: "bg-gradient-to-r from-orange-600 to-orange-700",
      icon: "bg-orange-100 text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700"
    }
  };

  const colors = colorClasses[dashboardColor] || colorClasses.blue;

  useEffect(() => {
    if (!authData || !authData.userDTO) {
      console.error('Auth data is missing.');
      setError('Authentication data is missing');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(fetchEndpoint(authData.userDTO.id), {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else if (response.status === 401) {
          setError('Session expired. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError('Failed to fetch dashboard data.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchEndpoint, authData, navigate]);

  const handleRetry = () => {
    if (authData?.userDTO?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(fetchEndpoint(authData.userDTO.id), {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          } else {
            setError('Failed to fetch dashboard data.');
          }
        } catch (error) {
          setError('Network error. Please check your connection.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  const getUserDisplayName = () => {
    if (!authData?.userDTO) return "User";
    return `${authData.userDTO.firstName || ''} ${authData.userDTO.lastName || ''}`.trim() || 
           authData.userDTO.username || "User";
  };

  const getUserRole = () => {
    if (!authData?.authorities) return "";
    if (authData.authorities.includes("ROLE_ADMIN")) return "Administrator";
    if (authData.authorities.includes("ROLE_DOCTOR")) return "Doctor";
    if (authData.authorities.includes("ROLE_PATIENT")) return "Patient";
    return "";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Dashboard</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <HomeIcon className="h-4 w-4 mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No auth data
  if (!authData || !authData.userDTO) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md w-full">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - No separate header since NavigationBar handles it */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboardData ? (
          <div className="space-y-6">
            {renderContent(dashboardData, authData)}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BaseDashboard;