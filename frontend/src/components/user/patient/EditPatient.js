import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../auth/AuthContext';

const EditPatient = () => {
  const { authData } = useContext(AuthContext);
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    egn: '',
    birthDate: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8084/api/v1/patient/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPatient(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          egn: data.egn,
          birthDate: data.birthDate,
          phone: data.phone,
          address: data.address,
        });
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
        alert('Error fetching patient details.');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!authData || !authData.accessToken) {
      alert('You must be logged in to edit a patient.');
      return;
    }

    const updatedPatient = {
      ...formData,
    };

    fetch(`http://localhost:8084/api/v1/patient/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authData.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPatient),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update patient');
        }
        alert('Patient updated successfully!');
        navigate('/admin/dashboard/patients');
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
        alert('Error updating patient. Please try again.');
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {patient ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Edit Patient</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="egn" className="block text-gray-700">EGN (10 digits)</label>
                <input
                  type="text"
                  id="egn"
                  name="egn"
                  value={formData.egn}
                  onChange={handleChange}
                  maxLength={10}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="birthDate" className="block text-gray-700">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        ) : (
          <p>Loading patient details...</p>
        )}
      </div>
    </div>
  );
};

export default EditPatient;
