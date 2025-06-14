import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  CalendarIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  UserIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  BeakerIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../auth/AuthContext';

const CreateExamination = () => {
  const { patientId } = useParams();
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Extract and store doctorId from authData
  const doctorId = authData.userDTO.id;

  const [examinationDate, setExaminationDate] = useState('');
  const [treatment, setTreatment] = useState('');
  const [diagnosisIds, setDiagnosisIds] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosesLoading, setDiagnosesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);

  // Fetch patient information
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${authData?.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatientInfo(data);
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, [patientId, authData]);

  // Fetch all diagnoses from the API
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setDiagnosesLoading(true);
        const response = await fetch('http://localhost:8084/api/v1/diagnosis/list', {
          headers: {
            Authorization: `Bearer ${authData?.accessToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch diagnoses');
        }
        
        const data = await response.json();
        setDiagnoses(data);
      } catch (error) {
        setError('Failed to load diagnoses');
        console.error('Error fetching diagnoses:', error);
      } finally {
        setDiagnosesLoading(false);
      }
    };

    fetchDiagnoses();
  }, [authData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const createExaminationDTO = {
      examinationDate,
      treatment,
      diagnosisIds,
    };

    try {
      const response = await fetch(
        `http://localhost:8084/api/v1/examination/doctor/${doctorId}/patient/${patientId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData?.accessToken}`,
          },
          body: JSON.stringify(createExaminationDTO),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create examination');
      }

      const data = await response.json();
      console.log('Examination created:', data);

      // Redirect to preview page
      navigate(`/doctor/dashboard/examination/preview/${data.id}`);
    } catch (error) {
      setError('Failed to create examination. Please try again.');
      console.error('Error creating examination:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiagnosisChange = (id) => {
    setDiagnosisIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const removeDiagnosis = (id) => {
    setDiagnosisIds((prev) => prev.filter((d) => d !== id));
  };

  // Filter diagnoses by name
  const filteredDiagnoses = diagnoses.filter((diagnosis) =>
    diagnosis.description.toLowerCase().includes(filter.toLowerCase()) ||
    diagnosis.diagnosis.toLowerCase().includes(filter.toLowerCase())
  );

  const selectedDiagnoses = diagnoses.filter((diagnosis) =>
    diagnosisIds.includes(diagnosis.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Medical Examination</h1>
                <p className="text-gray-600">
                  {patientInfo 
                    ? `New examination for ${patientInfo.firstName} ${patientInfo.lastName}`
                    : `New examination for Patient ID: ${patientId}`
                  }
                </p>
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

      {/* Patient Information Card */}
      {patientInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Patient Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-medium text-gray-900">{patientInfo.firstName} {patientInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">EGN</p>
                <p className="font-medium text-gray-900">{patientInfo.egn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{patientInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Examination Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Examination Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Examination Date */}
            <div>
              <label htmlFor="examinationDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Examination Date *
              </label>
              <input
                type="date"
                id="examinationDate"
                value={examinationDate}
                onChange={(e) => setExaminationDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
            </div>

            {/* Treatment */}
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                <PencilSquareIcon className="h-4 w-4 inline mr-1" />
                Treatment Plan *
              </label>
              <textarea
                id="treatment"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Describe the treatment plan, medications, recommendations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                rows={4}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide detailed treatment instructions, medications, and follow-up recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Diagnoses Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BeakerIcon className="h-5 w-5 mr-2" />
              Assign Diagnoses
            </h2>
          </div>
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search diagnoses by name or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Selected Diagnoses */}
            {selectedDiagnoses.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Diagnoses ({selectedDiagnoses.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDiagnoses.map((diagnosis) => (
                    <span
                      key={diagnosis.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {diagnosis.diagnosis}
                      <button
                        type="button"
                        onClick={() => removeDiagnosis(diagnosis.id)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 focus:outline-none"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Diagnoses */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Available Diagnoses</h3>
              {diagnosesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading diagnoses...</span>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                  {filteredDiagnoses.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {filter ? 'No diagnoses match your search criteria' : 'No diagnoses available'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredDiagnoses.map((diagnosis) => (
                        <label
                          key={diagnosis.id}
                          className="flex items-start p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            value={diagnosis.id}
                            checked={diagnosisIds.includes(diagnosis.id)}
                            onChange={() => handleDiagnosisChange(diagnosis.id)}
                            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {diagnosis.diagnosis}
                            </div>
                            <div className="text-sm text-gray-500">
                              {diagnosis.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedDiagnoses.length > 0 && (
                  <span>{selectedDiagnoses.length} diagnosis(es) selected</span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !examinationDate || !treatment}
                  className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Create Examination
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Examination Guidelines</h3>
            <div className="mt-1 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure all required fields are completed before submission</li>
                <li>Select all relevant diagnoses that apply to this examination</li>
                <li>Provide detailed treatment instructions for patient care</li>
                <li>The examination will be available for review after creation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamination;