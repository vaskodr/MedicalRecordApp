import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import BaseDashboard from './BaseDashboard';
import Examination from '../examination/Examination'; // Import the Examination component

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [showExaminations, setShowExaminations] = useState(false); // State to control the visibility of examinations
  const { authData } = useContext(AuthContext); // Assuming 'user' contains the authenticated user's data

  const fetchPatientEndpoint = (id) => `http://localhost:8084/api/v1/patient/${id}`;
  const fetchExaminationsEndpoint = (id) => `http://localhost:8084/api/v1/examination/patient/${id}`;

  // Function to toggle the examinations visibility
  const toggleExaminations = () => setShowExaminations(prevState => !prevState);

  // Function to handle edit action for an examination
  const handleEditExamination = (examinationId) => {
    // Navigate to the edit page (or handle edit logic here)
    console.log(`Editing examination with ID: ${examinationId}`);
  };

  // Function to handle delete action for an examination
  const handleDeleteExamination = (examinationId) => {
    // Perform the delete action (e.g., API call)
    console.log(`Deleting examination with ID: ${examinationId}`);
    // Optionally, remove from the state after deletion
    setExaminations(examinations.filter(exam => exam.id !== examinationId));
  };

  const renderContent = (data, authData) => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome, {authData.userDTO.firstName} {authData.userDTO.lastName}!
        </h2>
        <p className="mt-2">Here are your medical records:</p>
      </div>

      {patientData ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-teal-600">Patient Information:</h3>
          <p><strong className="text-gray-700">First Name:</strong> {patientData.firstName}</p>
          <p><strong className="text-gray-700">Last Name:</strong> {patientData.lastName}</p>
          <p><strong className="text-gray-700">Insurance Status:</strong> {patientData.insuranceStatus ? 'Paid' : 'Not Paid'}</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
          <p>Loading patient information...</p>
        </div>
      )}

      {/* Button to toggle examination list visibility */}
      <button
        onClick={toggleExaminations}
        className="w-full sm:w-auto mt-4 p-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
      >
        {showExaminations ? 'Hide Examinations' : 'Show Examinations'}
      </button>

      {/* Conditionally render Examinations */}
      {showExaminations && (
        <div className="space-y-4 mt-6">
          {examinations.length > 0 ? (
            examinations.map((examination) => (
              <Examination
                key={examination.id}
                examination={examination}
                onEdit={handleEditExamination}
                onDelete={handleDeleteExamination}
                authData={authData}
              />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
              <p>No examinations available.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (authData && authData.userDTO.id) {
      const patientId = authData.userDTO.id;

      // Fetch patient data and examinations concurrently
      Promise.all([
        fetch(fetchPatientEndpoint(patientId)).then((response) => response.json()),
        fetch(fetchExaminationsEndpoint(patientId)).then((response) => response.json()),
      ])
        .then(([patientDataResponse, examinationsResponse]) => {
          setPatientData(patientDataResponse);
          setExaminations(examinationsResponse);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [authData]); // Re-fetch data when user data changes

  return (
    <BaseDashboard
      fetchEndpoint={fetchPatientEndpoint}
      renderContent={renderContent}
      dashboardTitle="Patient Dashboard"
    />
  );
};

export default PatientDashboard;
