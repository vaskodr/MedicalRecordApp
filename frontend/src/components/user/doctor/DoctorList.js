import React, { useEffect, useState } from 'react';
import Doctor from './Doctor'; // Import the Doctor component

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:8084/api/v1/doctor/list');
        if (!response.ok) throw new Error('Failed to fetch doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const response = await fetch('http://localhost:8084/api/v1/specialization/list');
        if (!response.ok) throw new Error('Failed to fetch specializations');
        const data = await response.json();
        setSpecializations(data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };

    fetchDoctors();
    fetchSpecializations();
  }, []);

  const getSpecializationNames = (specializationIds) => {
    return specializationIds
      .map((id) => {
        const specialization = specializations.find((spec) => spec.id === id);
        return specialization ? specialization.name : null;
      })
      .filter((name) => name !== null);
  };

  // CRUD action handlers
  const handleView = (doctorId) => {
    console.log('Viewing doctor with ID:', doctorId);
  };

  const handleEdit = (doctorId) => {
    console.log('Editing doctor with ID:', doctorId);
  };

  const handleDelete = (doctorId) => {
    console.log('Deleting doctor with ID:', doctorId);
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <Doctor
            key={doctor.id}
            doctor={doctor}
            specializationNames={getSpecializationNames(doctor.specializationIds)}
            onView={() => handleView(doctor.id)}
            onEdit={() => handleEdit(doctor.id)}
            onDelete={() => handleDelete(doctor.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
