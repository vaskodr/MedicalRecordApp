import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import BaseDashboard from './BaseDashboard';
import Examination from '../examination/Examination';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [showExaminations, setShowExaminations] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [specializationNames, setSpecializationNames] = useState([]);

  const { authData } = useContext(AuthContext);

  const fetchPatientEndpoint = (id) => `http://localhost:8084/api/v1/patient/${id}`;
  const fetchExaminationsEndpoint = (id) => `http://localhost:8084/api/v1/examination/patient/${id}`;
  const fetchDoctorEndpoint = (id) => `http://localhost:8084/api/v1/doctor/${id}`;
  const fetchSpecializationsEndpoint = (id) => `http://localhost:8084/api/v1/specialization/${id}`;

  const toggleExaminations = () => setShowExaminations(prev => !prev);

  const handleEditExamination = (examinationId) => {
    console.log(`Editing examination with ID: ${examinationId}`);
  };

  const handleDeleteExamination = (examinationId) => {
    console.log(`Deleting examination with ID: ${examinationId}`);
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
          <p><strong className="text-gray-700">Name:</strong> {patientData.firstName} {patientData.lastName}</p>
          <p><strong className="text-gray-700">EGN:</strong> {patientData.egn}</p>
          <p><strong className="text-gray-700">Email:</strong> {patientData.email}</p>
          <p><strong className="text-gray-700">Phone:</strong> {patientData.phone}</p>
          <p><strong className="text-gray-700">Address:</strong> {patientData.address}</p>
          <p><strong className="text-gray-700">Gender:</strong> {patientData.gender}</p>
          <p><strong className="text-gray-700">Insurance Status:</strong> {patientData.hasPaidInsurance ? 'Paid' : 'Not Paid'}</p>

          <p>
            <strong className="text-gray-700">GP:</strong>{' '}
            {doctorData ? (
              <>
               Dr. {doctorData.firstName} {doctorData.lastName}{' '}
                <span className="text-sm text-gray-600">
                  (Specializations: {specializationNames.join(', ')})
                </span>
              </>
            ) : (
              patientData.personalDoctorId || 'Not Assigned'
            )}
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-gray-500">
          <p>Loading patient information...</p>
        </div>
      )}

      <button
        onClick={toggleExaminations}
        className="w-full sm:w-auto mt-4 p-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-300"
      >
        {showExaminations ? 'Hide Examinations' : 'Show Examinations'}
      </button>

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
    if (authData?.userDTO?.id) {
      const patientId = authData.userDTO.id;

      Promise.all([
        fetch(fetchPatientEndpoint(patientId)).then((res) => res.json()),
        fetch(fetchExaminationsEndpoint(patientId)).then((res) => res.json())
      ])
        .then(([patientDataResponse, examinationsResponse]) => {
          setPatientData(patientDataResponse);
          setExaminations(examinationsResponse);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [authData]);

  useEffect(() => {
    if (patientData?.personalDoctorId) {
      fetch(fetchDoctorEndpoint(patientData.personalDoctorId))
        .then((res) => res.json())
        .then((data) => {
          setDoctorData(data);
  
          if (Array.isArray(data.specializationIds) && data.specializationIds.length > 0) {
            fetch(fetchSpecializationsEndpoint(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data.specializationIds)
            })
              .then((res) => res.json())
              .then((specializations) => {
                const names = specializations.map(s => s.name); // ✅ Extract names
                setSpecializationNames(names);
              })
              .catch((err) => console.error('Error fetching specialization names:', err));
          }
        })
        .catch((err) => console.error('Failed to fetch doctor data:', err));
    }
  }, [patientData]);
  

  return (
    <BaseDashboard
      fetchEndpoint={fetchPatientEndpoint}
      renderContent={renderContent}
      dashboardTitle="Patient Dashboard"
    />
  );
};

export default PatientDashboard;
