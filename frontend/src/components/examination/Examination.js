import React, { useEffect, useState } from 'react';

const Examination = ({ examination, onEdit, onDelete, authData }) => {
  const { examinationDate, treatment, doctorId, patientId, diagnosisIds } = examination;

  const [doctorName, setDoctorName] = useState('Loading...');
  const [patientName, setPatientName] = useState('Loading...');
  const [diagnosisNames, setDiagnosisNames] = useState([]);

  useEffect(() => {
    // Fetch doctor details
    if (doctorId) {
      fetch(`http://localhost:8084/api/v1/doctor/${doctorId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch doctor details');
          }
          return response.json();
        })
        .then((data) => {
          setDoctorName(`${data.firstName} ${data.lastName}`);
        })
        .catch((error) => {
          console.error('Error fetching doctor details:', error);
          setDoctorName('Unknown Doctor');
        });
    }

    // Fetch patient details
    if (patientId) {
      fetch(`http://localhost:8084/api/v1/patient/${patientId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch patient details');
          }
          return response.json();
        })
        .then((data) => {
          setPatientName(`${data.firstName} ${data.lastName}`);
        })
        .catch((error) => {
          console.error('Error fetching patient details:', error);
          setPatientName('Unknown Patient');
        });
    }

    // Ensure diagnosisIds is valid before fetching
    if (diagnosisIds && diagnosisIds.length > 0) {
      const diagnosisPromises = diagnosisIds.map((diagnosisId) =>
        fetch(`http://localhost:8084/api/v1/diagnosis/${diagnosisId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch diagnosis with ID: ${diagnosisId}`);
            }
            return response.json();
          })
          .then((data) => data.diagnosis) // Use 'diagnosis' field instead of 'name'
      );
  
      Promise.all(diagnosisPromises)
        .then((names) => {
          setDiagnosisNames(names);
        })
        .catch((error) => {
          console.error('Error fetching diagnosis details:', error);
          setDiagnosisNames(['Unknown Diagnosis']);
        });
    }
  }, [doctorId, patientId, diagnosisIds]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <h3 className="text-xl font-semibold text-teal-600 mb-4">Examination Details</h3>

      <div className="space-y-3">
        <p className="text-gray-700">
          <strong className="font-medium">Examination Date:</strong> {examinationDate}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium">Treatment:</strong> {treatment}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium">Doctor:</strong> {doctorName}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium">Patient:</strong> {patientName}
        </p>
        <p className="text-gray-700">
          <strong className="font-medium">Diagnoses:</strong> {diagnosisNames.length > 0 ? diagnosisNames.join(', ') : 'No diagnoses available'}
        </p>
      </div>

      <div className="flex space-x-4 mt-6">
      {authData.authorities.includes('ROLE_ADMIN') && (
          <>
            <button
              onClick={() => onEdit(examination.id)} // Calls the onEdit function
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(examination.id)} // Calls the onDelete function
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Examination;
