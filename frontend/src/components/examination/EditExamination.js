import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  UserIcon,
  CalendarDaysIcon,
  BeakerIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const EditExamination = () => {
  const { examinationId } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    examinationDate: '',
    treatment: '',
    doctorId: '',
    patientId: '',
    diagnosisIds: [],
    sickLeaveId: null
  });
  
  // Related data
  const [patient, setPatient] = useState(null);
  const [availableDiagnoses, setAvailableDiagnoses] = useState([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState([]);
  const [sickLeave, setSickLeave] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Sick leave form
  const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
  const [sickLeaveForm, setSickLeaveForm] = useState({
    startDate: '',
    endDate: '',
    days: 0,
    note: ''
  });

  useEffect(() => {
    if (examinationId) {
      fetchExaminationData();
      fetchAvailableDiagnoses();
    }
  }, [examinationId]);

  const fetchExaminationData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8084/api/v1/examination/${examinationId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Examination data:', data);
      
      setFormData({
        examinationDate: data.examinationDate || '',
        treatment: data.treatment || '',
        doctorId: data.doctorId || '',
        patientId: data.patientId || '',
        diagnosisIds: data.diagnosisIds || [],
        sickLeaveId: data.sickLeaveId || null
      });
      
      // Fetch related data
      if (data.patientId) {
        await fetchPatientData(data.patientId);
      }
      
      if (data.diagnosisIds && data.diagnosisIds.length > 0) {
        await fetchSelectedDiagnoses(data.diagnosisIds);
      }
      
      if (data.sickLeaveId) {
        await fetchSickLeaveData(data.sickLeaveId);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching examination:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/patient/${patientId}`);
      if (response.ok) {
        const patientData = await response.json();
        setPatient(patientData);
      }
    } catch (err) {
      console.warn('Failed to fetch patient data:', err);
    }
  };

  const fetchAvailableDiagnoses = async () => {
    try {
      // Assuming there's an endpoint to get all diagnoses
      // You might need to adjust this endpoint based on your API
      const response = await fetch('http://localhost:8084/api/v1/diagnosis');
      if (response.ok) {
        const diagnoses = await response.json();
        setAvailableDiagnoses(diagnoses);
      }
    } catch (err) {
      console.warn('Failed to fetch available diagnoses:', err);
    }
  };

  const fetchSelectedDiagnoses = async (diagnosisIds) => {
    try {
      const promises = diagnosisIds.map(id =>
        fetch(`http://localhost:8084/api/v1/diagnosis/${id}`).then(res => res.ok ? res.json() : null)
      );
      const results = await Promise.all(promises);
      setSelectedDiagnoses(results.filter(d => d !== null));
    } catch (err) {
      console.warn('Failed to fetch selected diagnoses:', err);
    }
  };

  const fetchSickLeaveData = async (sickLeaveId) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/sick-leave/${sickLeaveId}`);
      if (response.ok) {
        const sickLeaveData = await response.json();
        setSickLeave(sickLeaveData);
        setSickLeaveForm({
          startDate: sickLeaveData.startDate || '',
          endDate: sickLeaveData.endDate || '',
          days: sickLeaveData.days || 0,
          note: sickLeaveData.note || ''
        });
      }
    } catch (err) {
      console.warn('Failed to fetch sick leave data:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiagnosisAdd = (diagnosis) => {
    if (!formData.diagnosisIds.includes(diagnosis.id)) {
      setFormData(prev => ({
        ...prev,
        diagnosisIds: [...prev.diagnosisIds, diagnosis.id]
      }));
      setSelectedDiagnoses(prev => [...prev, diagnosis]);
    }
  };

  const handleDiagnosisRemove = (diagnosisId) => {
    setFormData(prev => ({
      ...prev,
      diagnosisIds: prev.diagnosisIds.filter(id => id !== diagnosisId)
    }));
    setSelectedDiagnoses(prev => prev.filter(d => d.id !== diagnosisId));
  };

  const handleSickLeaveChange = (e) => {
    const { name, value } = e.target;
    setSickLeaveForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate days when dates change
    if (name === 'startDate' || name === 'endDate') {
      const updatedForm = { ...sickLeaveForm, [name]: value };
      if (updatedForm.startDate && updatedForm.endDate) {
        const start = new Date(updatedForm.startDate);
        const end = new Date(updatedForm.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setSickLeaveForm(prev => ({ ...prev, days: diffDays }));
      }
    }
  };

  const createOrUpdateSickLeave = async () => {
    try {
      const sickLeaveData = {
        ...sickLeaveForm,
        examinationId: parseInt(examinationId)
      };
      
      let response;
      if (formData.sickLeaveId) {
        // Update existing sick leave
        response = await fetch(`http://localhost:8084/api/v1/sick-leave/${formData.sickLeaveId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sickLeaveData)
        });
      } else {
        // Create new sick leave
        response = await fetch('http://localhost:8084/api/v1/sick-leave', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sickLeaveData)
        });
      }
      
      if (response.ok) {
        const sickLeaveResult = await response.json();
        return sickLeaveResult.id || formData.sickLeaveId;
      }
      return null;
    } catch (err) {
      console.error('Error with sick leave:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      let updatedFormData = { ...formData };
      
      // Handle sick leave if form is shown
      if (showSickLeaveForm && sickLeaveForm.startDate && sickLeaveForm.endDate) {
        const sickLeaveId = await createOrUpdateSickLeave();
        if (sickLeaveId) {
          updatedFormData.sickLeaveId = sickLeaveId;
        }
      }
      
      // Prepare the examination data
      const examinationData = {
        ...updatedFormData,
        doctorId: parseInt(updatedFormData.doctorId),
        patientId: parseInt(updatedFormData.patientId),
        diagnosisIds: updatedFormData.diagnosisIds.map(id => parseInt(id))
      };
      
      console.log('Updating examination with data:', examinationData);
      
      const response = await fetch(`http://localhost:8084/api/v1/examination/${examinationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examinationData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Examination updated successfully:', result);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating examination:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading examination data...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.examinationDate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Examination</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Examination</h1>
              <p className="text-gray-600">Update examination details and treatment information</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckIcon className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Examination updated successfully!</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information (Read-only) */}
          {patient && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <p className="text-sm text-gray-900">{patient.firstName} {patient.lastName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <p className="text-sm text-gray-900">{patient.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Examination Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Examination Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Examination Date
                </label>
                <input
                  type="date"
                  name="examinationDate"
                  value={formData.examinationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor ID
                </label>
                <input
                  type="number"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment
                </label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter treatment details..."
                />
              </div>
            </div>
          </div>

          {/* Diagnoses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BeakerIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Diagnoses</h3>
            </div>
            
            {/* Selected Diagnoses */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Diagnoses:</h4>
              <div className="space-y-2">
                {selectedDiagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{diagnosis.diagnosis}</span>
                      {diagnosis.description && (
                        <p className="text-sm text-gray-600">{diagnosis.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDiagnosisRemove(diagnosis.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {selectedDiagnoses.length === 0 && (
                  <p className="text-gray-500 text-sm">No diagnoses selected</p>
                )}
              </div>
            </div>

            {/* Available Diagnoses */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Available Diagnoses:</h4>
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {availableDiagnoses
                  .filter(d => !formData.diagnosisIds.includes(d.id))
                  .map((diagnosis) => (
                    <button
                      key={diagnosis.id}
                      type="button"
                      onClick={() => handleDiagnosisAdd(diagnosis)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{diagnosis.diagnosis}</span>
                        <PlusIcon className="h-4 w-4 text-green-600" />
                      </div>
                      {diagnosis.description && (
                        <p className="text-sm text-gray-600 mt-1">{diagnosis.description}</p>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Sick Leave */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <HeartIcon className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sick Leave</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSickLeaveForm(!showSickLeaveForm)}
                className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                {showSickLeaveForm ? 'Hide Form' : (sickLeave ? 'Edit Sick Leave' : 'Add Sick Leave')}
              </button>
            </div>

            {sickLeave && !showSickLeaveForm && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Duration:</strong> {sickLeave.days} days<br />
                  <strong>Period:</strong> {new Date(sickLeave.startDate).toLocaleDateString()} - {new Date(sickLeave.endDate).toLocaleDateString()}<br />
                  {sickLeave.note && <><strong>Note:</strong> {sickLeave.note}</>}
                </p>
              </div>
            )}

            {showSickLeaveForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={sickLeaveForm.startDate}
                    onChange={handleSickLeaveChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={sickLeaveForm.endDate}
                    onChange={handleSickLeaveChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                  <input
                    type="number"
                    name="days"
                    value={sickLeaveForm.days}
                    onChange={handleSickLeaveChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <textarea
                    name="note"
                    value={sickLeaveForm.note}
                    onChange={handleSickLeaveChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Optional note..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  <span>Update Examination</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamination;