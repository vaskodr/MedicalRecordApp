import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../auth/AuthContext';
import Patient from './Patient';

const PatientsList = () => {
  const { authData } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchEGN, setSearchEGN] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8084/api/v1/patient/list')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setFilteredPatients(data);
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }, [authData]);

  console.log(authData.userDTO.id);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setSearchEGN(value);
      if (value.length === 10) {
        setFilteredPatients(
          patients.filter((patient) => patient.egn === value)
        );
      } else {
        setFilteredPatients(patients);
      }
    }
  };

  const handleEdit = (id) => navigate(`/admin/dashboard/patients/edit/${id}`);
  const handleDelete = (id) => {
    if (!authData || !authData.accessToken) {
      alert('You must be logged in to delete a patient.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this patient?')) {
      fetch(`http://localhost:8084/api/v1/patient/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete the patient');
          }
          setPatients(patients.filter((p) => p.id !== id));
          setFilteredPatients(filteredPatients.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting patient:', error);
          alert('Error deleting patient. You may not have permission to perform this action.');
        });
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        {authData.role === 'ADMIN' && (
          <button
            onClick={() => navigate('/admin/dashboard/patients/create')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Add New Patient
          </button>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        {/* EGN Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchEGN}
            onChange={handleSearchChange}
            maxLength={10}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="Search by EGN (10 digits)"
          />
        </div>
        {filteredPatients.length > 0 ? (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Patient
                key={patient.id}
                patient={patient}
                onEdit={handleEdit}
                onDelete={handleDelete}
                authData={authData}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No patients available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientsList;
