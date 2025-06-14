import React, { useState } from 'react';
import { 
  BeakerIcon, 
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DiagnosisForm = ({ diagnosis = {}, onSubmit, onCancel, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    diagnosis: diagnosis.diagnosis || '',
    description: diagnosis.description || '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.diagnosis.trim()) {
      errors.diagnosis = 'Diagnosis name is required';
    } else if (formData.diagnosis.trim().length < 2) {
      errors.diagnosis = 'Diagnosis name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Clinical description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        diagnosis: formData.diagnosis.trim(),
        description: formData.description.trim(),
      });
    }
  };

  const isEditing = !!diagnosis.id;
  const isFormValid = formData.diagnosis.trim() && formData.description.trim() && Object.keys(validationErrors).length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <BeakerIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEditing ? 'Edit Diagnosis' : 'Create New Diagnosis'}
            </h2>
            <p className="text-green-100 text-sm">
              {isEditing ? 'Modify diagnosis information' : 'Add a new medical diagnosis to the system'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Diagnosis Name */}
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
              <BeakerIcon className="h-4 w-4 inline mr-1" />
              Diagnosis Name *
            </label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Enter the diagnosis name (e.g., Hypertension, Diabetes Type 2)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors duration-200 ${
                validationErrors.diagnosis 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-green-500'
              }`}
              disabled={loading}
            />
            {validationErrors.diagnosis && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.diagnosis}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Provide a clear, specific diagnosis name using standard medical terminology
            </p>
          </div>

          {/* Clinical Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="h-4 w-4 inline mr-1" />
              Clinical Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide a detailed clinical description of the diagnosis, including symptoms, causes, and relevant medical information..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors duration-200 resize-none ${
                validationErrors.description 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-green-500'
              }`}
              disabled={loading}
            />
            {validationErrors.description && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.description}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Include comprehensive clinical information (minimum 10 characters)
            </p>
          </div>

          {/* Character Counts */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Diagnosis:</span> {formData.diagnosis.length} characters
              </div>
              <div>
                <span className="font-medium">Description:</span> {formData.description.length} characters
              </div>
            </div>
          </div>

          {/* Form Preview */}
          {formData.diagnosis && formData.description && isFormValid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">Preview</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-green-600 font-medium">Diagnosis:</span>
                  <p className="text-sm text-green-800 font-medium">{formData.diagnosis}</p>
                </div>
                <div>
                  <span className="text-xs text-green-600 font-medium">Description:</span>
                  <p className="text-sm text-green-800">{formData.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Diagnosis' : 'Create Diagnosis'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Guidelines Footer */}
      <div className="px-6 py-4 bg-blue-50 border-t border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <DocumentTextIcon className="h-4 w-4 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-2">
            <h4 className="text-xs font-medium text-blue-800">Guidelines</h4>
            <ul className="mt-1 text-xs text-blue-700 space-y-0.5">
              <li>• Use standard medical terminology and ICD-10 codes when applicable</li>
              <li>• Provide clear, concise diagnosis names that are easily recognizable</li>
              <li>• Include comprehensive clinical descriptions for proper identification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisForm;