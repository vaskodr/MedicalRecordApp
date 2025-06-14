import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BeakerIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../auth/AuthContext';

const CreateDiagnosis = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [diagnosis, setDiagnosis] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submit to create a new diagnosis
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8084/api/v1/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.accessToken}`,
        },
        body: JSON.stringify({
          diagnosis: diagnosis.trim(),
          description: description.trim(),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        console.log("Diagnosis created!");
        setTimeout(() => {
          navigate('/admin/dashboard/diagnoses');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create diagnosis');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error creating diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const isFormValid = diagnosis.trim() && description.trim();

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnosis Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            The diagnosis has been added to the system and is now available for use.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard/diagnoses')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Diagnoses
              </button>
              <div className="p-2 bg-green-100 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Diagnosis</h1>
                <p className="text-gray-600">Add a new medical diagnosis to the system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Diagnosis Information
          </h2>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-6">
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
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                placeholder="Enter the diagnosis name (e.g., Hypertension, Diabetes Type 2)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide a clear, specific diagnosis name using standard medical terminology
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                Clinical Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Provide a detailed clinical description of the diagnosis, including symptoms, causes, and relevant medical information..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Include comprehensive clinical information that will help healthcare providers understand this diagnosis
              </p>
            </div>

            {/* Form Preview */}
            {diagnosis && description && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">Preview</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-green-600 font-medium">Diagnosis:</span>
                    <p className="text-sm text-green-800">{diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-xs text-green-600 font-medium">Description:</span>
                    <p className="text-sm text-green-800">{description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard/diagnoses')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
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
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Diagnosis
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Diagnosis Creation Guidelines</h3>
            <div className="mt-1 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Use standard medical terminology and ICD-10 codes when applicable</li>
                <li>Provide clear, concise diagnosis names that are easily recognizable</li>
                <li>Include comprehensive clinical descriptions for proper identification</li>
                <li>Ensure accuracy as this will be used by healthcare professionals</li>
                <li>Review all information before submitting to avoid errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDiagnosis;