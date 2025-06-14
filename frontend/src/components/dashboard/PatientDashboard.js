import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  IdentificationIcon, 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../auth/AuthContext';
import BaseDashboard from './BaseDashboard';
import Examination from '../examination/Examination';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [examinations, setExaminations] = useState([]);
  const [showExaminations, setShowExaminations] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [specializationNames, setSpecializationNames] = useState([]);

  const { authData } = useContext(AuthContext);

  const fetchPatientEndpoint = (id) => `http://localhost:8084/api/v1/patient/${id}`;
  const fetchExaminationsEndpoint = (id) => `http://localhost:8084/api/v1/examination/patient/${id}`;
  const fetchDoctorEndpoint = (id) => `http://localhost:8084/api/v1/doctor/${id}`;
  const fetchSpecializationsEndpoint = (id) => `http://localhost:8084/api/v1/specialization/${id}`;

  const toggleExaminations = () => setShowExaminations(prev => !prev);

  const handleEditExamination = (examinationId) => {
    console.log(`Editing examination with ID: ${examinationId}`);
  };

  const handleDeleteExamination = (examinationId) => {
    console.log(`Deleting examination with ID: ${examinationId}`);
    setExaminations(examinations.filter(exam => exam.id !== examinationId));
  };

  const renderContent = (data, authData) => (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {authData?.userDTO?.firstName} {authData?.userDTO?.lastName}!
              </h1>
              <p className="text-gray-600">Access your medical records and health information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-teal-600">{examinations.length}</div>
          <div className="text-sm text-gray-600">Total Visits</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {examinations.filter(e => new Date(e.date) > new Date(Date.now() - 30*24*60*60*1000)).length}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {patientData?.hasPaidInsurance ? 'Active' : 'Inactive'}
          </div>
          <div className="text-sm text-gray-600">Insurance</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {doctorData ? 'Assigned' : 'None'}
          </div>
          <div className="text-sm text-gray-600">GP Status</div>
        </div>
      </div>

      {/* Patient Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IdentificationIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
          </div>
          <div className="p-6">
            {patientData ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Full Name</span>
                    <p className="font-medium text-gray-900">{patientData.firstName} {patientData.lastName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">EGN</span>
                    <p className="font-medium text-gray-900">{patientData.egn}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Gender</span>
                    <p className="font-medium text-gray-900">{patientData.gender}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Insurance Status</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      patientData.hasPaidInsurance 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {patientData.hasPaidInsurance ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
          </div>
          <div className="p-6">
            {patientData ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Email</span>
                    <p className="font-medium text-gray-900">{patientData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Phone</span>
                    <p className="font-medium text-gray-900">{patientData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-600">Address</span>
                    <p className="font-medium text-gray-900">{patientData.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* General Practitioner */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">General Practitioner</h3>
          </div>
        </div>
        <div className="p-6">
          {doctorData ? (
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dr. {doctorData.firstName} {doctorData.lastName}</p>
                  <p className="text-sm text-purple-600">
                    Specializations: {specializationNames.join(', ') || 'General Practice'}
                  </p>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No General Practitioner assigned</p>
              <p className="text-sm text-gray-500 mt-1">Contact administration to assign a GP</p>
            </div>
          )}
        </div>
      </div>

      {/* Medical Records Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Medical Records</h3>
                <p className="text-sm text-gray-600">Your examination history and medical visits</p>
              </div>
            </div>
            <button
              onClick={toggleExaminations}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showExaminations ? <EyeSlashIcon className="h-4 w-4 mr-2" /> : <EyeIcon className="h-4 w-4 mr-2" />}
              {showExaminations ? 'Hide Records' : 'View Records'}
            </button>
          </div>
        </div>

        {showExaminations && (
          <div className="p-6">
            {examinations.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Showing {examinations.length} examination{examinations.length !== 1 ? 's' : ''}
                  </h4>
                  <button
                    onClick={() => navigate('/patient/dashboard/sick-leaves')}
                    className="inline-flex items-center px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-full transition-colors duration-200"
                  >
                    <HeartIcon className="h-4 w-4 mr-1" />
                    View Sick Leaves
                  </button>
                </div>
                {examinations.map((examination) => (
                  <div key={examination.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <Examination
                      examination={examination}
                      onEdit={handleEditExamination}
                      onDelete={handleDeleteExamination}
                      authData={authData}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Medical Records</h4>
                <p className="text-gray-600">You don't have any examination records yet.</p>
                <p className="text-sm text-gray-500 mt-1">Medical records will appear here after your first visit.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Need Medical Assistance?</h3>
            <p className="text-teal-100 mt-1">Contact your healthcare provider or emergency services</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm">
              Contact GP
            </button>
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm">
              Emergency: 112
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (authData?.userDTO?.id) {
      const patientId = authData.userDTO.id;

      Promise.all([
        fetch(fetchPatientEndpoint(patientId)).then((res) => res.json()),
        fetch(fetchExaminationsEndpoint(patientId)).then((res) => res.json())
      ])
        .then(([patientDataResponse, examinationsResponse]) => {
          setPatientData(patientDataResponse);
          setExaminations(examinationsResponse);
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [authData]);

  useEffect(() => {
    if (patientData?.personalDoctorId) {
      fetch(fetchDoctorEndpoint(patientData.personalDoctorId))
        .then((res) => res.json())
        .then((data) => {
          setDoctorData(data);
  
          if (Array.isArray(data.specializationIds) && data.specializationIds.length > 0) {
            fetch(fetchSpecializationsEndpoint(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data.specializationIds)
            })
              .then((res) => res.json())
              .then((specializations) => {
                const names = specializations.map(s => s.name);
                setSpecializationNames(names);
              })
              .catch((err) => console.error('Error fetching specialization names:', err));
          }
        })
        .catch((err) => console.error('Failed to fetch doctor data:', err));
    }
  }, [patientData]);

  return (
    <BaseDashboard
      fetchEndpoint={fetchPatientEndpoint}
      renderContent={renderContent}
      dashboardTitle="Patient Dashboard"
    />
  );
};

export default PatientDashboard;