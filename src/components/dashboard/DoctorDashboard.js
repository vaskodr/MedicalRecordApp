import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from './BaseDashboard';

const DoctorDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation
  const fetchEndpoint = (id) => `http://localhost:8084/api/v1/doctor/${id}`;
  
  const renderContent = (data, authData) => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-gray-800">Hello, Dr. {authData.userDTO.lastName}!</h2>
      <p className="mt-4 text-lg text-gray-600">Welcome back to your dashboard. Here you can manage your patients and appointments.</p>
      <button
        onClick={() => navigate('/doctor/dashboard/patient-list')}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        View Patient List
      </button>
    </div>
  );

  return (
    <BaseDashboard
      fetchEndpoint={fetchEndpoint}
      renderContent={renderContent}
      dashboardTitle="Doctor Dashboard"
    />
  );
};

export default DoctorDashboard;
