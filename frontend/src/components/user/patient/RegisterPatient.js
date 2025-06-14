import React, { useState, useEffect } from "react";
import { 
  ShieldCheckIcon,
  UserIcon,
  IdentificationIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const RegisterPatient = ({ formData, handleInputChange, setFormData }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:8084/api/v1/doctor/gp-list"
        );
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          setError("Failed to load doctors list");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Network error while loading doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleHealthInsuranceChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prevFormData) => ({
      ...prevFormData,
      hasPaidHealthInsurance: value,
    }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      personalDoctorId: selectedDoctorId,
    }));
  };

  const handleEgnChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        egn: value,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* EGN Input */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <IdentificationIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Identification
          </h3>
        </div>
        <label
          htmlFor="egn"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          EGN (Personal Identification Number) *
        </label>
        <input
          type="text"
          id="egn"
          name="egn"
          value={formData.egn}
          onChange={handleEgnChange}
          maxLength="10"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your 10-digit EGN"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter exactly 10 digits
        </p>
      </div>

      {/* Health Insurance Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Health Insurance Status
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Have you paid health insurance for the last 6 months?
        </p>
        <div className="flex items-center space-x-8">
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="healthInsurance"
              value="true"
              checked={formData.hasPaidHealthInsurance === true}
              onChange={handleHealthInsuranceChange}
              className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Paid</span>
          </label>
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="healthInsurance"
              value="false"
              checked={formData.hasPaidHealthInsurance === false}
              onChange={handleHealthInsuranceChange}
              className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Unpaid</span>
          </label>
        </div>
      </div>
  
      {/* Doctor Selection */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Doctor
          </h3>
        </div>
        <label
          htmlFor="doctor"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Your Personal Doctor *
        </label>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading doctors...</span>
          </div>
        ) : (
          <select
            id="doctor"
            name="doctor"
            value={formData.personalDoctorId}
            onChange={handleDoctorChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName}
              </option>
            ))}
          </select>
        )}
        {doctors.length === 0 && !loading && !error && (
          <p className="text-sm text-yellow-600 mt-2">
            No general practitioners are currently available.
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterPatient;