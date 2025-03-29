import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Patient = ({ patient, onEdit, onDelete, authData }) => {
  const {
    egn,
    firstName,
    lastName,
    username,
    email,
    phone,
    personalDoctorId,
    hasPaidInsurance,
  } = patient;

  const [doctorName, setDoctorName] = useState('Loading...');
  const navigate = useNavigate();

  useEffect(() => {
    if (personalDoctorId) {
      fetch(`http://localhost:8084/api/v1/doctor/${personalDoctorId}`)
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
  }, [personalDoctorId]);

  const handleExamination = () => {
    console.log(`Redirecting to examination page for patient: ${firstName} ${lastName}`);
    navigate(`/doctor/dashboard/examination/${patient.id}`);
  };

  return (
    <div className="flex justify-between items-center border-b py-2">
      <div className="flex-grow">
        {/* Display Patient Details */}
        <p className="text-xl font-semibold">{firstName} {lastName}</p>
        <p className="text-gray-600">EGN: {egn}</p>
        <p className="text-gray-600">Username: {username}</p>
        <p className="text-gray-600">Email: {email}</p>
        <p className="text-gray-600">Phone: {phone}</p>
        <p className="text-gray-600">Doctor: {doctorName}</p>
        <p
          className={`text-gray-600 ${
            hasPaidInsurance ? 'text-green-600' : 'text-red-600'
          }`}
        >
          Insurance: {hasPaidInsurance ? 'Paid' : 'Unpaid'}
        </p>
      </div>
      <div className="flex space-x-2">
        {authData.authorities.includes('ROLE_DOCTOR') && (
          <button
            onClick={handleExamination}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Examination
          </button>
        )}
        {authData.authorities.includes('ROLE_ADMIN') && (
          <>
            <button
              onClick={() => onEdit(patient.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(patient.id)}
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

export default Patient;
