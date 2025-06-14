import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  HeartIcon,
  ChartBarIcon,
  UserIcon,
  CalendarDaysIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import BaseDashboard from './BaseDashboard';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const fetchEndpoint = (id) => `http://localhost:8084/api/v1/doctor/${id}`;
  
  const managementItems = [
    {
      title: 'View Patients',
      description: 'Access your patient list and medical records',
      icon: UserGroupIcon,
      color: 'blue',
      path: '/doctor/dashboard/patient-list'
    },
    {
      title: 'Medical Diagnoses',
      description: 'Browse available diagnoses and medical conditions',
      icon: DocumentTextIcon,
      color: 'green',
      path: '/doctor/dashboard/diagnoses'
    },
    {
      title: 'Examination History',
      description: 'Review past examinations and patient visits',
      icon: ClipboardDocumentListIcon,
      color: 'purple',
      path: '/doctor/dashboard/:doctorId/examination-list/'
    },
    {
      title: 'Sick Leaves',
      description: 'Manage and issue sick leave certificates',
      icon: HeartIcon,
      color: 'orange',
      path: '/doctor/dashboard/sick-leaves'
    },
    {
      title: 'Statistics',
      description: 'View medical statistics and reports',
      icon: ChartBarIcon,
      color: 'indigo',
      path: '/doctor/dashboard/sick-leaves/statistics'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      green: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
      purple: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
      orange: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
      indigo: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'
    };
    return colorMap[color] || 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';
  };

  const getIconBgClasses = (color) => {
    const iconColorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return iconColorMap[color] || 'bg-gray-100 text-gray-600';
  };
  
  const renderContent = (data, authData) => {
    const doctorData = data?.doctorDTO || {};
    const userData = authData?.userDTO || {};
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, Dr. {userData.lastName || userData.firstName || userData.username}!
                </h1>
                <p className="text-gray-600">Manage your patients and medical practice</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Professional Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Professional Info</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm font-medium text-gray-900">
                  Dr. {userData.firstName} {userData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">{userData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">License</span>
                <span className="text-sm font-medium text-gray-900">
                  {doctorData.licenseNumber || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Specialization Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Specialization</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Field</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {doctorData.specialization || 'General Practice'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="text-sm font-medium text-gray-900">
                  {doctorData.yearsOfExperience || 'N/A'} years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Appointments</span>
                <span className="text-sm font-medium text-gray-900">8 scheduled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Patient</span>
                <span className="text-sm font-medium text-gray-900">10:30 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Availability</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">142</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">28</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">15</div>
            <div className="text-sm text-gray-600">Sick Leaves</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Medical Practice Management</h2>
            <p className="text-gray-600">Access your medical tools and patient management features</p>
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

        {/* Recent Activity */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New patient consultation completed</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <HeartIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sick leave certificate issued</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <ClipboardDocumentListIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Medical examination recorded</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-green-100 mt-1">Commonly used medical tools</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/doctor/dashboard/patient-list')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                Find Patient
              </button>
              <button
                onClick={() => navigate('/doctor/dashboard/sick-leaves/create/1')}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                Issue Sick Leave
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
      dashboardTitle="Doctor Dashboard"
    />
  );
};

export default DoctorDashboard;