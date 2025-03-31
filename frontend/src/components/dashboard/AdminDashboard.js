import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  const renderContent = (data, authData) => {
    // Store the user data for use in the useEffect hook
    if (authData && !userData) {
      setUserData(authData);
    }
    
    const authorityNames = authorities.map(auth => auth.authority).join(', ');
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome, {authData?.userDTO?.username}!
        </h2>
        <p className="text-lg text-gray-600 mb-6">Here is your admin data:</p>

        {/* Admin Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Admin Information</h3>
            <p className="mt-2"><strong>Username:</strong> {authData?.userDTO?.username}</p>
            <p><strong>Email:</strong> {authData?.userDTO?.email}</p>
            <p><strong>Authorities:</strong> {authorityNames || 'Loading authorities...'}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <h3 className="text-xl font-semibold text-gray-700">Account Details</h3>
            <p className="mt-2"><strong>First Name:</strong> {authData?.userDTO?.firstName}</p>
            <p><strong>Last Name:</strong> {authData?.userDTO?.lastName}</p>
            {authData?.userDTO?.createdAt && (
              <p><strong>Created At:</strong> {new Date(authData.userDTO.createdAt).toLocaleDateString()}</p>
            )}
            {authData?.userDTO?.lastLogin && (
              <p><strong>Last Login:</strong> {new Date(authData.userDTO.lastLogin).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={() => navigate('/admin/dashboard/diagnoses')}
            className="py-3 px-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 focus:outline-none"
          >
            Manage Diagnoses
          </button>

          <button
            onClick={() => navigate('/admin/dashboard/specializations')}
            className="py-3 px-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 focus:outline-none"
          >
            Manage Specializations
          </button>

          <button
            onClick={() => navigate('/admin/dashboard/doctor-list')}
            className="py-3 px-6 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition duration-300 focus:outline-none"
          >
            Manage Doctors
          </button>

          <button
            onClick={() => navigate('/admin/dashboard/patient-list')}
            className="py-3 px-6 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition duration-300 focus:outline-none"
          >
            Manage Patients
          </button>

          <button
            onClick={() => navigate('/admin/dashboard/examination-list')}
            className="py-3 px-6 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300 focus:outline-none"
          >
            Manage Examinations
          </button>

          <button
            onClick={() => navigate('/admin/dashboard/sick-leave-list')}
            className="py-3 px-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition duration-300 focus:outline-none"
          >
            Manage Sick-Leaves
          </button>
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