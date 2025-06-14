import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BeakerIcon, 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../auth/AuthContext';
import DiagnosisForm from './DiagnosisForm';

const EditDiagnosis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDiagnosis(data);
        } else if (response.status === 404) {
          setError('Diagnosis not found');
        } else {
          setError('Failed to load diagnosis');
        }
      } catch (error) {
        console.error('Error fetching diagnosis:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (authData?.accessToken) {
      fetchDiagnosis();
    }
  }, [id, authData?.accessToken]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        console.log("Diagnosis Updated");
        setTimeout(() => {
          navigate('/admin/dashboard/diagnoses');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update diagnosis');
      }
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/diagnoses');
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !diagnosis) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard/diagnoses')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Diagnoses
              </button>
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Error Loading Diagnosis</h1>
                <p className="text-gray-600">Unable to load the diagnosis for editing</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Diagnosis</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/diagnoses')}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-6">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnosis Updated Successfully!</h2>
          <p className="text-gray-600 mb-6">
            The diagnosis "{diagnosis?.diagnosis}" has been updated and saved to the system.
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Diagnosis</h1>
                <p className="text-gray-600">
                  Modify diagnosis: <span className="font-medium">{diagnosis?.diagnosis}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Form */}
      <DiagnosisForm
        diagnosis={diagnosis}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={submitting}
        error={error}
      />

      {/* Additional Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>
                Updating this diagnosis will affect all existing examinations that reference it. 
                Please ensure all changes are accurate and follow medical terminology standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDiagnosis;