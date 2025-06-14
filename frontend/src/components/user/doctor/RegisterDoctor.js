import React, { useState, useEffect } from "react";
import { 
  AcademicCapIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const RegisterDoctor = ({ formData, setFormData }) => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8084/api/v1/specialization/list");
        if (response.ok) {
          const data = await response.json();
          setSpecializations(data);
        } else {
          setError("Failed to load specializations list");
        }
      } catch (error) {
        console.error("Error fetching specializations:", error);
        setError("Network error while loading specializations");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  // Initialize isGP if it's undefined
  useEffect(() => {
    if (formData.isGP === undefined) {
      setFormData(prev => ({
        ...prev,
        isGP: false
      }));
    }
  }, [formData.isGP, setFormData]);

  // Handle specialization checkbox toggle
  const handleSpecializationChange = (e) => {
    const value = Number(e.target.value);
    setFormData((prevFormData) => {
      const selectedIds = prevFormData.specializationIds || [];
      const updatedIds = selectedIds.includes(value)
        ? selectedIds.filter((id) => id !== value)
        : [...selectedIds, value];
      return { 
        ...prevFormData, 
        specializationIds: updatedIds 
      };
    });
  };

  // Handle GP radio button change
  const handleGPChange = (e) => {
    const isGP = e.target.value === "true";
    setFormData((prevFormData) => ({
      ...prevFormData,
      isGP: isGP,
    }));
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

      {/* General Practitioner Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Practice Type
          </h3>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Are you a General Practitioner? *
        </label>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              id="gp-yes"
              name="isGP"
              value="true"
              checked={formData.isGP === true}
              onChange={handleGPChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Yes, I'm a General Practitioner
            </span>
          </label>
          <label className="inline-flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              id="gp-no"
              name="isGP"
              value="false"
              checked={formData.isGP === false}
              onChange={handleGPChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              No, I'm a Specialist
            </span>
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          General Practitioners can serve as personal doctors for patients
        </p>
      </div>

      {/* Specializations */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Medical Specializations
          </h3>
        </div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select Your Specializations *
        </label>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading specializations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {specializations.map((specialization) => (
              <label 
                key={specialization.id} 
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  id={`specialization-${specialization.id}`}
                  value={specialization.id}
                  checked={formData.specializationIds?.includes(specialization.id) || false}
                  onChange={handleSpecializationChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">
                  {specialization.name}
                </span>
              </label>
            ))}
          </div>
        )}
        
        {specializations.length === 0 && !loading && !error && (
          <p className="text-sm text-yellow-600 mt-2">
            No specializations are currently available.
          </p>
        )}
        
        {formData.specializationIds && formData.specializationIds.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Selected Specializations: {formData.specializationIds.length}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.specializationIds.map(id => {
                const spec = specializations.find(s => s.id === id);
                return spec ? (
                  <span 
                    key={id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {spec.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-2">
          Select at least one specialization to continue
        </p>
      </div>
      
      {/* Debug information - can be removed in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
          Debug - isGP: {String(formData.isGP)}, 
          Specializations: [{formData.specializationIds?.join(', ') || 'none'}]
        </div>
      )}
    </div>
  );
};

export default RegisterDoctor;