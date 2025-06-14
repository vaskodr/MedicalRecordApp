import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  AcademicCapIcon, 
  UserIcon, 
  ClipboardDocumentListIcon,
  HeartIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import BaseDashboard from './BaseDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [authorities, setAuthorities] = useState([]);
  const [userData, setUserData] = useState(null);
  
  const fetchEndpoint = (id) => `http://localhost:8084/api/v1/user/${id}`;
  
  // This will be called when data is received from BaseDashboard
  useEffect(() => {
    if (userData?.userDTO?.authorityIds && userData.userDTO.authorityIds.length > 0) {
      fetchAuthoritiesForUser(userData.userDTO.authorityIds);
    }
  }, [userData]);
  
  const fetchAuthoritiesForUser = async (authorityIds) => {
    if (!authorityIds || authorityIds.length === 0) return;
    
    try {
      const authoritiesData = await Promise.all(
        authorityIds.map(async (authorityId) => {
          const response = await fetch(`http://localhost:8084/api/v1/role/${authorityId}`);
          if (!response.ok) throw new Error('Failed to fetch authority');
          return await response.json();
        })
      );
      
      setAuthorities(authoritiesData);
    } catch (error) {
      console.error('Error fetching authorities:', error);
    }
  };
  
  const managementItems = [
    {
      title: 'Manage Diagnoses',
      description: 'Create, edit, and manage medical diagnoses',
      icon: DocumentTextIcon,
      color: 'blue',
      path: '/admin/dashboard/diagnoses'
    },
    {
      title: 'Manage Specializations',
      description: 'Configure medical specializations and departments',
      icon: AcademicCapIcon,
      color: 'green',
      path: '/admin/dashboard/specializations'
    },
    {
      title: 'Manage Doctors',
      description: 'Oversee doctor accounts and credentials',
      icon: UserIcon,
      color: 'purple',
      path: '/admin/dashboard/doctor-list'
    },
    {
      title: 'Manage Patients',
      description: 'View and manage patient information',
      icon: UserGroupIcon,
      color: 'teal',
      path: '/admin/dashboard/patient-list'
    },
    {
      title: 'Manage Examinations',
      description: 'Review and organize medical examinations',
      icon: ClipboardDocumentListIcon,
      color: 'indigo',
      path: '/admin/dashboard/examination-list'
    },
    {
      title: 'Manage Sick Leaves',
      description: 'Track and manage sick leave records',
      icon: HeartIcon,
      color: 'orange',
      path: '/admin/dashboard/sick-leaves'
    },
    {
      title: 'View Statistics',
      description: 'Access system analytics and reports',
      icon: ChartBarIcon,
      color: 'pink',
      path: '/admin/dashboard/sick-leaves/statistics'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
      purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
      teal: 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500',
      indigo: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500',
      orange: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
      pink: 'bg-pink-500 hover:bg-pink-600 focus:ring-pink-500'
    };
    return colorMap[color] || 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';
  };

  const getIconBgClasses = (color) => {
    const iconColorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      teal: 'bg-teal-100 text-teal-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      orange: 'bg-orange-100 text-orange-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return iconColorMap[color] || 'bg-gray-100 text-gray-600';
  };
  
  const renderContent = (data, authData) => {
    // Store the user data for use in the useEffect hook
    if (authData && !userData) {
      setUserData(authData);
    }
    
    const authorityNames = authorities.map(auth => auth.authority).join(', ');
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CogIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {authData?.userDTO?.firstName || authData?.userDTO?.username}!
                </h1>
                <p className="text-gray-600">Manage your medical system from the admin dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Account Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Username</span>
                <span className="text-sm font-medium text-gray-900">{authData?.userDTO?.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">{authData?.userDTO?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {authorityNames || 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">First Name</span>
                <span className="text-sm font-medium text-gray-900">{authData?.userDTO?.firstName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Name</span>
                <span className="text-sm font-medium text-gray-900">{authData?.userDTO?.lastName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
            </div>
            <div className="space-y-2">
              {authData?.userDTO?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(authData.userDTO.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {authData?.userDTO?.lastLogin && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(authData.userDTO.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Access Level</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Management</h2>
            <p className="text-gray-600">Access all administrative functions and system controls</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managementItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.path)}
                    className="group p-6 border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg transition-colors duration-200 ${getIconBgClasses(item.color)} group-hover:scale-110`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-blue-100 mt-1">Frequently used administrative tasks</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard/diagnoses/create')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                Add Diagnosis
              </button>
              <button
                onClick={() => navigate('/admin/dashboard/sick-leaves/statistics')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseDashboard
      fetchEndpoint={fetchEndpoint}
      renderContent={renderContent}
      dashboardTitle="Admin Dashboard"
    />
  );
};

export default AdminDashboard;