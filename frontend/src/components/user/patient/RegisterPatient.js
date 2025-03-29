import React, { useState, useEffect } from "react";

const RegisterPatient = ({ formData, handleInputChange, setFormData }) => {
  const [hasPaidHealthInsurance, setHasPaidHealthInsurance] = useState(formData.hasPaidHealthInsurance || null);
  const [doctors, setDoctors] = useState([]); // List of doctors
  const [selectedDoctor, setSelectedDoctor] = useState(formData.doctorId || "");
  const [egn, setEgn] = useState(formData.egn || "");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:8084/api/v1/doctor/list"
        );
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleHealthInsuranceChange = (e) => {
    const value = e.target.value === "yes";
    setHasPaidHealthInsurance(value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      hasPaidHealthInsurance: value,
    }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    setSelectedDoctor(selectedDoctorId);

    setFormData({
      ...formData,
      personalDoctorId: selectedDoctorId,
    });
  };

  const handleEgnChange = (e) => {
    const value = e.target.value;
    setEgn(value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      egn: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Health Insurance Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Health Insurance Status For Last 6 Months
        </h3>
        <div className="flex items-center space-x-8">
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="healthInsurance"
              value="yes"
              checked={hasPaidHealthInsurance === true}
              onChange={handleHealthInsuranceChange}
              className="form-radio h-5 w-5 text-blue-500"
            />
            <span className="text-gray-700">Paid</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name="healthInsurance"
              value="no"
              checked={hasPaidHealthInsurance === false}
              onChange={handleHealthInsuranceChange}
              className="form-radio h-5 w-5 text-red-500"
            />
            <span className="text-gray-700">Unpaid</span>
          </label>
        </div>
      </div>
  
      {/* Doctor Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label
          htmlFor="doctor"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Select Doctor
        </label>
        <select
          id="doctor"
          name="doctor"
          value={selectedDoctor}
          onChange={handleDoctorChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </select>
      </div>
  
      {/* EGN Input */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label
          htmlFor="egn"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          EGN (Personal Identification Number)
        </label>
        <input
          type="text"
          id="egn"
          name="egn"
          value={egn}
          onChange={handleEgnChange}
          maxLength="10"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter patient's EGN"
        />
      </div>
    </div>
  );
  
};

export default RegisterPatient;
