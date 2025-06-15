import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  HeartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const DoctorExaminationsList = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [enrichedExaminations, setEnrichedExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedExamination, setSelectedExamination] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    fetchExaminations();
  }, [doctorId]);

  const fetchExaminations = async () => {
    // Validate doctorId before making the API call
    if (!doctorId || doctorId === 'undefined' || isNaN(doctorId)) {
      setError('Invalid doctor ID. Please navigate from the dashboard.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching examinations for doctor ID:', doctorId);
      const response = await fetch(`http://localhost:8084/api/v1/examination/doctor/${doctorId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Examinations data received:', data);
      setExaminations(data || []);
      
      // Enrich the examinations with patient and diagnosis data
      await enrichExaminationsData(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching examinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const enrichExaminationsData = async (examinationsData) => {
    try {
      console.log('Enriching examinations data...');
      const enrichedData = await Promise.all(
        examinationsData.map(async (examination) => {
          const enriched = { ...examination };
          
          // Fetch patient data if patientId exists
          if (examination.patientId) {
            try {
              const patientResponse = await fetch(`http://localhost:8084/api/v1/patient/${examination.patientId}`);
              if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                enriched.patient = patientData;
                enriched.patientName = `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim();
              }
            } catch (err) {
              console.warn('Failed to fetch patient data for examination:', examination.id, err);
            }
          }
          
          // Fetch diagnosis data if diagnosisId exists
          if (examination.diagnosisId) {
            try {
              const diagnosisResponse = await fetch(`http://localhost:8084/api/v1/diagnosis/${examination.diagnosisId}`);
              if (diagnosisResponse.ok) {
                const diagnosisData = await diagnosisResponse.json();
                enriched.diagnosisData = diagnosisData;
                enriched.diagnosis = diagnosisData.diagnosis;
                enriched.diagnosisDescription = diagnosisData.description;
              }
            } catch (err) {
              console.warn('Failed to fetch diagnosis data for examination:', examination.id, err);
            }
          }
          
          // Fetch sick leave data if needed
          if (examination.sickLeaveId) {
            try {
              const sickLeaveResponse = await fetch(`http://localhost:8084/api/v1/sick-leave/${examination.sickLeaveId}`);
              if (sickLeaveResponse.ok) {
                const sickLeaveData = await sickLeaveResponse.json();
                enriched.sickLeave = sickLeaveData;
              }
            } catch (err) {
              console.warn('Failed to fetch sick leave data for examination:', examination.id, err);
            }
          }
          
          return enriched;
        })
      );
      
      console.log('Enriched examinations:', enrichedData);
      setEnrichedExaminations(enrichedData);
    } catch (err) {
      console.error('Error enriching examinations data:', err);
      // If enrichment fails, use original data
      setEnrichedExaminations(examinationsData);
    }
  };

  const fetchExaminationDetails = async (examinationId) => {
    try {
      setModalLoading(true);
      setModalError(null);
      
      console.log('Fetching examination details for ID:', examinationId);
      const response = await fetch(`http://localhost:8084/api/v1/examination/${examinationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const examinationDetails = await response.json();
      console.log('Examination details received:', examinationDetails);
      
      // Enrich the details with related data
      const enrichedDetails = { ...examinationDetails };
      
      // Fetch patient data
      if (examinationDetails.patientId) {
        try {
          const patientResponse = await fetch(`http://localhost:8084/api/v1/patient/${examinationDetails.patientId}`);
          if (patientResponse.ok) {
            const patientData = await patientResponse.json();
            enrichedDetails.patient = patientData;
          }
        } catch (err) {
          console.warn('Failed to fetch patient data:', err);
        }
      }
      
      // Fetch diagnosis data for all diagnosisIds
      if (examinationDetails.diagnosisIds && examinationDetails.diagnosisIds.length > 0) {
        try {
          const diagnosisPromises = examinationDetails.diagnosisIds.map(diagnosisId =>
            fetch(`http://localhost:8084/api/v1/diagnosis/${diagnosisId}`).then(res => res.ok ? res.json() : null)
          );
          const diagnosisResults = await Promise.all(diagnosisPromises);
          enrichedDetails.diagnoses = diagnosisResults.filter(d => d !== null);
        } catch (err) {
          console.warn('Failed to fetch diagnosis data:', err);
        }
      }
      
      // Fetch sick leave data if present
      if (examinationDetails.sickLeaveId) {
        try {
          const sickLeaveResponse = await fetch(`http://localhost:8084/api/v1/sick-leave/${examinationDetails.sickLeaveId}`);
          if (sickLeaveResponse.ok) {
            const sickLeaveData = await sickLeaveResponse.json();
            enrichedDetails.sickLeave = sickLeaveData;
          }
        } catch (err) {
          console.warn('Failed to fetch sick leave data:', err);
        }
      }
      
      setSelectedExamination(enrichedDetails);
    } catch (err) {
      setModalError(err.message);
      console.error('Error fetching examination details:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedExamination(null);
    setModalError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Debug log the examinations data
  console.log('Raw examinations data:', examinations);
  console.log('Enriched examinations data:', enrichedExaminations);
  console.log('Sample examination object:', enrichedExaminations[0]);

  // Filter and sort examinations using enriched data
  const filteredAndSortedExaminations = enrichedExaminations
    .filter(exam => {
      // Debug each examination object
      console.log('Filtering examination:', exam);
      
      // More flexible search - check multiple possible field names
      const patientName = exam.patientName || 
                         (exam.patient ? `${exam.patient.firstName || ''} ${exam.patient.lastName || ''}`.trim() : '') ||
                         exam.patientFirstName + ' ' + exam.patientLastName ||
                         '';
      
      const diagnosis = exam.diagnosis || exam.primaryDiagnosis || exam.diagnosisName || '';
      const notes = exam.notes || exam.description || exam.comments || '';
      
      const matchesSearch = searchTerm === '' || 
        patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notes.toLowerCase().includes(searchTerm.toLowerCase());
      
      // More flexible status matching
      const examStatus = exam.status || exam.examinationStatus || 'completed';
      const matchesFilter = filterStatus === 'all' || examStatus.toLowerCase() === filterStatus;
      
      console.log('Search matches:', matchesSearch, 'Filter matches:', matchesFilter);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.examinationDate || b.createdAt || b.dateCreated || 0) - 
                 new Date(a.examinationDate || a.createdAt || a.dateCreated || 0);
        case 'date_asc':
          return new Date(a.examinationDate || a.createdAt || a.dateCreated || 0) - 
                 new Date(b.examinationDate || b.createdAt || b.dateCreated || 0);
        case 'patient_name':
          const aName = a.patientName || (a.patient ? `${a.patient.firstName || ''} ${a.patient.lastName || ''}`.trim() : '');
          const bName = b.patientName || (b.patient ? `${b.patient.firstName || ''} ${b.patient.lastName || ''}`.trim() : '');
          return aName.localeCompare(bName);
        case 'status':
          return (a.status || a.examinationStatus || '').localeCompare(b.status || b.examinationStatus || '');
        default:
          return 0;
      }
    });

  console.log('Filtered examinations:', filteredAndSortedExaminations);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading examinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Examinations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchExaminations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Examination History</h1>
              <p className="text-gray-600">View and manage your patient examinations</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{examinations.length}</div>
                <div className="text-sm text-gray-600">Total Examinations</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {examinations.filter(e => {
                    const status = e.status || e.examinationStatus || 'completed';
                    return status.toLowerCase() === 'completed';
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {examinations.filter(e => {
                    const status = e.status || e.examinationStatus || '';
                    return status.toLowerCase() === 'pending';
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {examinations.filter(e => {
                    const examDate = new Date(e.examinationDate || e.createdAt || e.dateCreated);
                    const today = new Date();
                    return examDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by patient name, diagnosis, or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <div className="relative">
                  <FunnelIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div className="sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="patient_name">Patient Name</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Examinations List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Examinations ({filteredAndSortedExaminations.length})
            </h2>
          </div>

          {filteredAndSortedExaminations.length === 0 ? (
            <div className="p-12 text-center">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No examinations found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No examinations have been recorded yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedExaminations.map((examination) => {
                console.log('Rendering examination:', examination);
                
                // More flexible patient name extraction
                const patientName = examination.patientName || 
                                  (examination.patient ? 
                                    `${examination.patient.firstName || ''} ${examination.patient.lastName || ''}`.trim() : 
                                    '') ||
                                  `${examination.patientFirstName || ''} ${examination.patientLastName || ''}`.trim() ||
                                  'Unknown Patient';
                
                return (
                  <div key={examination.id || examination.examinationId || Math.random()} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {patientName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <CalendarDaysIcon className="h-4 w-4" />
                                <span>{formatDate(examination.examinationDate || examination.createdAt || examination.dateCreated)}</span>
                              </div>
                              {examination.duration && (
                                <div className="flex items-center space-x-1">
                                  <ClockIcon className="h-4 w-4" />
                                  <span>{examination.duration} min</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Diagnosis:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {examination.diagnosis || examination.primaryDiagnosis || examination.diagnosisName || 'Not specified'}
                            </p>
                            {examination.diagnosisDescription && (
                              <p className="text-xs text-gray-500 mt-1">
                                {examination.diagnosisDescription}
                              </p>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Type:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {examination.examinationType || examination.type || examination.category || 'General Examination'}
                            </p>
                          </div>
                          {examination.sickLeave && (
                            <div className="md:col-span-2">
                              <span className="text-sm font-medium text-gray-700">Sick Leave:</span>
                              <p className="text-sm text-gray-900 mt-1">
                                {examination.sickLeave.days} days 
                                ({new Date(examination.sickLeave.startDate).toLocaleDateString()} - {new Date(examination.sickLeave.endDate).toLocaleDateString()})
                              </p>
                              {examination.sickLeave.note && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Note: {examination.sickLeave.note}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {(examination.notes || examination.description || examination.comments) && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-700">Notes:</span>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {examination.notes || examination.description || examination.comments}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(examination.status || examination.examinationStatus)}`}>
                            {examination.status || examination.examinationStatus || 'Completed'}
                          </span>
                          {examination.priority && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(examination.priority)}`}>
                              {examination.priority}
                            </span>
                          )}
                          {examination.followUpRequired && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Follow-up Required
                            </span>
                          )}
                          {examination.sickLeave && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Sick Leave Issued
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <button
                          onClick={() => fetchExaminationDetails(examination.id || examination.examinationId)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        {(examination.status || examination.examinationStatus || '').toLowerCase() === 'pending' && (
                          <button
                            onClick={() => navigate(`/doctor/dashboard/examination/${examination.id || examination.examinationId}/edit`)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                            <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Examination Details Modal */}
        {selectedExamination && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Examination Details</h3>
                    <p className="text-sm text-gray-600">Complete examination information</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4">
                {modalLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading examination details...</span>
                  </div>
                ) : modalError ? (
                  <div className="text-center py-8">
                    <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Error Loading Details</h4>
                    <p className="text-gray-600">{modalError}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Patient Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="text-md font-semibold text-gray-900">Patient Information</h4>
                      </div>
                      {selectedExamination.patient ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Name:</span>
                            <p className="text-sm text-gray-900">
                              {selectedExamination.patient.firstName} {selectedExamination.patient.lastName}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Email:</span>
                            <p className="text-sm text-gray-900">{selectedExamination.patient.email || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Phone:</span>
                            <p className="text-sm text-gray-900">{selectedExamination.patient.phone || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                            <p className="text-sm text-gray-900">
                              {selectedExamination.patient.dateOfBirth ? 
                                new Date(selectedExamination.patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Patient information not available</p>
                      )}
                    </div>

                    {/* Examination Details */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="text-md font-semibold text-gray-900">Examination Details</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Examination Date:</span>
                          <p className="text-sm text-gray-900">
                            {formatDate(selectedExamination.examinationDate)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Doctor ID:</span>
                          <p className="text-sm text-gray-900">{selectedExamination.doctorId}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-700">Treatment:</span>
                          <p className="text-sm text-gray-900 mt-1">
                            {selectedExamination.treatment || 'No treatment specified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Diagnoses */}
                    {selectedExamination.diagnoses && selectedExamination.diagnoses.length > 0 && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <BeakerIcon className="h-5 w-5 text-green-600" />
                          <h4 className="text-md font-semibold text-gray-900">Diagnoses</h4>
                        </div>
                        <div className="space-y-3">
                          {selectedExamination.diagnoses.map((diagnosis, index) => (
                            <div key={diagnosis.id || index} className="border border-green-200 rounded-lg p-3 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-900">{diagnosis.diagnosis}</h5>
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  ID: {diagnosis.id}
                                </span>
                              </div>
                              {diagnosis.description && (
                                <p className="text-sm text-gray-600">{diagnosis.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sick Leave Information */}
                    {selectedExamination.sickLeave && (
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <HeartIcon className="h-5 w-5 text-orange-600" />
                          <h4 className="text-md font-semibold text-gray-900">Sick Leave</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Duration:</span>
                            <p className="text-sm text-gray-900">{selectedExamination.sickLeave.days} days</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Period:</span>
                            <p className="text-sm text-gray-900">
                              {new Date(selectedExamination.sickLeave.startDate).toLocaleDateString()} - {' '}
                              {new Date(selectedExamination.sickLeave.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedExamination.sickLeave.note && (
                            <div className="md:col-span-2">
                              <span className="text-sm font-medium text-gray-700">Note:</span>
                              <p className="text-sm text-gray-900 mt-1">{selectedExamination.sickLeave.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    navigate(`/doctor/dashboard/examination/${selectedExamination.id}/edit`);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Edit Examination
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorExaminationsList;