import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Patient = ({ patient, onEdit, onDelete, authData }) => {
  const {
    egn,
    firstName,
    lastName,
    username,
    email,
    phone,
    personalDoctorId,
    hasPaidInsurance,
  } = patient;

  const [doctorName, setDoctorName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (personalDoctorId) {
      fetch(`http://localhost:8084/api/v1/doctor/${personalDoctorId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch doctor details');
          }
          return response.json();
        })
        .then((data) => {
          setDoctorName(`Dr. ${data.firstName} ${data.lastName}`);
        })
        .catch((error) => {
          console.error('Error fetching doctor details:', error);
          setDoctorName('Unknown Doctor');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setDoctorName('No GP Assigned');
      setLoading(false);
    }
  }, [personalDoctorId]);

  const handleExamination = () => {
    console.log(`Redirecting to examination page for patient: ${firstName} ${lastName}`);
    navigate(`/doctor/dashboard/examination/${patient.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200 overflow-hidden">
      {/* Header with Patient Name and Status */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {firstName} {lastName}
              </h3>
              <p className="text-teal-100 text-sm">@{username}</p>
            </div>
          </div>
          
          {/* Insurance Status Badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              hasPaidInsurance 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              {hasPaidInsurance ? 'Insured' : 'Uninsured'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <IdentificationIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">EGN</span>
                <p className="text-gray-900 font-medium">{egn}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Email</span>
                <p className="text-gray-900 font-medium truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">Phone</span>
                <p className="text-gray-900 font-medium">{phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <AcademicCapIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div>
                <span className="text-gray-500 text-xs uppercase tracking-wide">General Practitioner</span>
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <div className="flex items-center space-x-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                      <span className="text-gray-500 text-xs">Loading...</span>
                    </div>
                  ) : (
                    <p className={`text-sm font-medium ${
                      doctorName === 'No GP Assigned' || doctorName === 'Unknown Doctor' 
                        ? 'text-red-600' 
                        : 'text-gray-900'
                    }`}>
                      {doctorName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Warning */}
        {!hasPaidInsurance && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-800 font-medium">Insurance Payment Required</span>
            </div>
            <p className="text-xs text-red-600 mt-1">Patient needs to update insurance status for full coverage.</p>
          </div>
        )}

        {/* Patient Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${hasPaidInsurance ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span>{hasPaidInsurance ? 'Active' : 'Pending'} Status</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>ID: {egn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-end space-x-2">
          {authData.authorities.includes('ROLE_DOCTOR') && (
            <button
              onClick={handleExamination}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
              New Examination
            </button>
          )}
          
          {authData.authorities.includes('ROLE_ADMIN') && (
            <>
              <button
                onClick={() => onEdit(patient.id)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              
              <button
                onClick={() => onDelete(patient.id)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patient;