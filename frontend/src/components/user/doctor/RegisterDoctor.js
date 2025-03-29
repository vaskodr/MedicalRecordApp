import React, { useState, useEffect } from "react";

const RegisterDoctor = ({ formData, setFormData }) => {
  const [specializations, setSpecializations] = useState([]);

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await fetch("http://localhost:8084/api/v1/specialization/list");
        const data = await response.json();
        setSpecializations(data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };

    fetchSpecializations();
  }, []);

  // Handle specialization checkbox toggle
  const handleSpecializationChange = (e) => {
    const value = Number(e.target.value); // Convert string to number for comparison
    setFormData((prevFormData) => {
      const selectedIds = prevFormData.specializationIds || [];
      const updatedIds = selectedIds.includes(value)
        ? selectedIds.filter((id) => id !== value) // Remove if already selected
        : [...selectedIds, value]; // Add if not selected
      return { ...prevFormData, specializationIds: updatedIds };
    });
  };

  // Handle GP radio button change
  const handleGPChange = (e) => {
    const isGP = e.target.value === "true"; // Convert string to boolean
    setFormData((prevFormData) => ({
      ...prevFormData,
      isGP,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Specializations */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Specializations
        </label>
        <div className="space-y-2">
          {specializations.map((specialization) => (
            <div key={specialization.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`specialization-${specialization.id}`}
                value={specialization.id}
                checked={formData.specializationIds?.includes(specialization.id) || false}
                onChange={handleSpecializationChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`specialization-${specialization.id}`}
                className="text-sm text-gray-700"
              >
                {specialization.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* General Practitioner */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Is this doctor a General Practitioner?
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="gp-yes"
              name="isGP"
              value="true"
              checked={formData.isGP === true}
              onChange={handleGPChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="gp-yes" className="text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="gp-no"
              name="isGP"
              value="false"
              checked={formData.isGP === false}
              onChange={handleGPChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="gp-no" className="text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;
