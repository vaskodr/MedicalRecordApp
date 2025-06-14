import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  UserIcon,
  AcademicCapIcon,
  CalendarIcon,
  DocumentTextIcon,
  BeakerIcon,
  ClockIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PrinterIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ExaminationPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [examination, setExamination] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
  const [submittingSickLeave, setSubmittingSickLeave] = useState(false);
  const [sickLeave, setSickLeave] = useState({
    startDate: '',
    endDate: '',
    note: '',
    days: 0,
  });

  useEffect(() => {
    const fetchExaminationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch examination
        const examResponse = await fetch(`http://localhost:8084/api/v1/examination/${id}`);
        if (!examResponse.ok) throw new Error('Failed to fetch examination details');
        const examData = await examResponse.json();
        setExamination(examData);

        // Fetch patient data
        if (examData.patientId) {
          try {
            const patientResponse = await fetch(`http://localhost:8084/api/v1/patient/${examData.patientId}`);
            if (patientResponse.ok) {
              const patient = await patientResponse.json();
              setPatientData(patient);
            }
          } catch (err) {
            console.error('Error fetching patient:', err);
          }
        }

        // Fetch doctor data
        if (examData.doctorId) {
          try {
            const doctorResponse = await fetch(`http://localhost:8084/api/v1/doctor/${examData.doctorId}`);
            if (doctorResponse.ok) {
              const doctor = await doctorResponse.json();
              setDoctorData(doctor);
            }
          } catch (err) {
            console.error('Error fetching doctor:', err);
          }
        }

        // Fetch diagnoses
        if (Array.isArray(examData.diagnosisIds) && examData.diagnosisIds.length > 0) {
          try {
            const diagnosisPromises = examData.diagnosisIds.map(async (diagnosisId) => {
              const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${diagnosisId}`);
              if (response.ok) {
                return response.json();
              }
              return null;
            });
            
            const diagnosisList = await Promise.all(diagnosisPromises);
            setDiagnoses(diagnosisList.filter(Boolean));
          } catch (err) {
            console.error('Error fetching diagnoses:', err);
          }
        }
      } catch (error) {
        setError('Failed to load examination details');
        console.error('Error fetching examination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExaminationData();
  }, [id]);

  useEffect(() => {
    if (sickLeave.startDate && sickLeave.endDate) {
      const start = new Date(sickLeave.startDate);
      const end = new Date(sickLeave.endDate);
      const diff = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
      setSickLeave((prev) => ({ ...prev, days: diff }));
    }
  }, [sickLeave.startDate, sickLeave.endDate]);

  const handleToggleSickLeaveForm = () => {
    setShowSickLeaveForm((prev) => !prev);
    if (showSickLeaveForm) {
      // Reset form when closing
      setSickLeave({
        startDate: '',
        endDate: '',
        note: '',
        days: 0,
      });
    }
  };

  const handleCompleteSickLeave = async () => {
    if (!sickLeave.startDate || !sickLeave.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmittingSickLeave(true);
      const response = await fetch(`http://localhost:8084/api/v1/sick-leave/examination/${examination.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: sickLeave.startDate,
          endDate: sickLeave.endDate,
          note: sickLeave.note,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create sick leave');
      }

      const data = await response.json();
      console.log('Sick leave created successfully:', data);
      
      // Show success and complete examination
      alert('Sick leave created and examination completed successfully!');
      navigate('/doctor/dashboard');
    } catch (err) {
      console.error('Error creating sick leave:', err);
      alert('Error creating sick leave. Please try again.');
    } finally {
      setSubmittingSickLeave(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading examination details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Examination</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!examination) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
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
                <h1 className="text-2xl font-bold text-gray-900">Examination Preview</h1>
                <p className="text-gray-600">Detailed view of medical examination</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Complete Without Sick Leave
              </button>
              <button
                onClick={handleToggleSickLeaveForm}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                {showSickLeaveForm ? (
                  <>
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Issue Sick Leave
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Doctor Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Examination Details</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Patient</p>
                    <p className="text-lg font-medium text-gray-900">
                      {patientData
                        ? `${patientData.firstName} ${patientData.lastName}`
                        : 'Loading...'}
                    </p>
                    {patientData && (
                      <p className="text-sm text-gray-600">EGN: {patientData.egn}</p>
                    )}
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Attending Physician</p>
                    <p className="text-lg font-medium text-gray-900">
                      {doctorData
                        ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
                        : 'Loading...'}
                    </p>
                  </div>
                </div>

                {/* Examination Date */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Examination Date</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(examination.examinationDate)}
                    </p>
                  </div>
                </div>

                {/* Examination ID */}
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Examination ID</p>
                    <p className="text-lg font-medium text-gray-900">#{examination.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Treatment Plan
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{examination.treatment}</p>
              </div>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BeakerIcon className="h-5 w-5 mr-2" />
                Medical Diagnoses
              </h2>
            </div>
            <div className="p-6">
              {diagnoses.length > 0 ? (
                <div className="space-y-4">
                  {diagnoses.map((diag, index) => (
                    <div key={diag.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-1 bg-purple-100 rounded">
                          <BeakerIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {diag.name || diag.diagnosis}
                          </h3>
                          {diag.description && (
                            <p className="text-sm text-gray-600 mt-1">{diag.description}</p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No diagnoses recorded for this examination</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Summary</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Completed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Diagnoses</span>
                <span className="text-sm font-medium text-gray-900">{diagnoses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sick Leave</span>
                <span className="text-sm font-medium text-gray-900">
                  {examination.sickLeaveId ? 'Issued' : 'Not issued'}
                </span>
              </div>
            </div>
          </div>

          {/* Examination Completion Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg">
            <div className="px-6 py-4 border-b border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900">Complete Examination</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-blue-800 mb-4">
                Choose how to finalize this examination:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Complete Without Sick Leave</p>
                    <p className="text-xs text-blue-700">Finalize examination and return to dashboard</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Issue Sick Leave</p>
                    <p className="text-xs text-blue-700">Create sick leave certificate and complete examination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sick Leave Form */}
      {showSickLeaveForm && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Issue Sick Leave
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={sickLeave.startDate}
                  onChange={(e) => setSickLeave({ ...sickLeave, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={sickLeave.endDate}
                  onChange={(e) => setSickLeave({ ...sickLeave, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                Medical Note
              </label>
              <textarea
                id="note"
                rows={3}
                value={sickLeave.note}
                onChange={(e) => setSickLeave({ ...sickLeave, note: e.target.value })}
                placeholder="Enter medical reason for sick leave..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              />
            </div>

            {sickLeave.days > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      Duration: {sickLeave.days} day{sickLeave.days !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-blue-600">
                      From {formatDate(sickLeave.startDate)} to {formatDate(sickLeave.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleToggleSickLeaveForm}
                disabled={submittingSickLeave}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteSickLeave}
                disabled={!sickLeave.startDate || !sickLeave.endDate || submittingSickLeave}
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submittingSickLeave ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Issue Sick Leave & Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationPreview;