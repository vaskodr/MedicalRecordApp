import React, { useEffect, useState } from 'react';
import { 
  ClipboardDocumentListIcon, 
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  BeakerIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Examination = ({ examination, onEdit, onDelete, authData }) => {
  const { examinationDate, treatment, doctorId, patientId, diagnosisIds, sickLeaveId } = examination;

  const [doctorName, setDoctorName] = useState('Loading...');
  const [patientName, setPatientName] = useState('Loading...');
  const [diagnosisNames, setDiagnosisNames] = useState([]);
  const [sickLeaveDetails, setSickLeaveDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor details
        if (doctorId) {
          try {
            const doctorResponse = await fetch(`http://localhost:8084/api/v1/doctor/${doctorId}`);
            if (doctorResponse.ok) {
              const doctorData = await doctorResponse.json();
              setDoctorName(`Dr. ${doctorData.firstName} ${doctorData.lastName}`);
            } else {
              setDoctorName('Unknown Doctor');
            }
          } catch (error) {
            console.error('Error fetching doctor details:', error);
            setDoctorName('Unknown Doctor');
          }
        }

        // Fetch patient details
        if (patientId) {
          try {
            const patientResponse = await fetch(`http://localhost:8084/api/v1/patient/${patientId}`);
            if (patientResponse.ok) {
              const patientData = await patientResponse.json();
              setPatientName(`${patientData.firstName} ${patientData.lastName}`);
            } else {
              setPatientName('Unknown Patient');
            }
          } catch (error) {
            console.error('Error fetching patient details:', error);
            setPatientName('Unknown Patient');
          }
        }

        // Fetch diagnosis details
        if (diagnosisIds && diagnosisIds.length > 0) {
          try {
            const diagnosisPromises = diagnosisIds.map(async (diagnosisId) => {
              const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${diagnosisId}`);
              if (response.ok) {
                const data = await response.json();
                return data.diagnosis;
              }
              return 'Unknown Diagnosis';
            });
            
            const names = await Promise.all(diagnosisPromises);
            setDiagnosisNames(names);
          } catch (error) {
            console.error('Error fetching diagnosis details:', error);
            setDiagnosisNames(['Unknown Diagnosis']);
          }
        }

        // Fetch sick leave details
        if (sickLeaveId) {
          try {
            const sickLeaveResponse = await fetch(`http://localhost:8084/api/v1/sick-leave/${sickLeaveId}`);
            if (sickLeaveResponse.ok) {
              const sickLeaveData = await sickLeaveResponse.json();
              setSickLeaveDetails(sickLeaveData);
            }
          } catch (error) {
            console.error('Error fetching sick leave details:', error);
            setSickLeaveDetails(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, patientId, diagnosisIds, sickLeaveId]);

  // Format date for display
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

  // Format sick leave information
  const formatSickLeaveInfo = () => {
    if (!sickLeaveDetails) return null;
    
    const startDate = formatDate(sickLeaveDetails.startDate);
    const endDate = formatDate(sickLeaveDetails.endDate);
    const reason = sickLeaveDetails.note || 'Medical leave';
    
    return {
      period: `${startDate} - ${endDate}`,
      reason: reason
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const sickLeaveInfo = formatSickLeaveInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200 overflow-hidden max-w-md">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">Examination</h3>
              <p className="text-blue-100 text-xs">
                <CalendarIcon className="h-3 w-3 inline mr-1" />
                {formatDate(examinationDate)}
              </p>
            </div>
          </div>
          
          {/* Compact Status Badge */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircleIcon className="h-2.5 w-2.5 mr-1" />
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-4 space-y-3">
        {/* Primary Information - Horizontal Layout */}
        <div className="space-y-2">
          {/* Doctor Information */}
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-blue-100 rounded">
              <AcademicCapIcon className="h-3 w-3 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Doctor</p>
              <p className="text-xs font-medium text-gray-900 truncate">{doctorName}</p>
            </div>
          </div>

          {/* Patient Information */}
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-teal-100 rounded">
              <UserIcon className="h-3 w-3 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Patient</p>
              <p className="text-xs font-medium text-gray-900 truncate">{patientName}</p>
            </div>
          </div>
        </div>

        {/* Treatment Details - Compact */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <DocumentTextIcon className="h-3 w-3 text-green-600" />
            <p className="text-xs text-gray-500 font-medium">Treatment</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-900 leading-relaxed line-clamp-2">{treatment}</p>
          </div>
        </div>

        {/* Diagnoses - Compact */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <BeakerIcon className="h-3 w-3 text-purple-600" />
            <p className="text-xs text-gray-500 font-medium">Diagnoses</p>
          </div>
          {diagnosisNames.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {diagnosisNames.slice(0, 2).map((diagnosis, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {diagnosis}
                </span>
              ))}
              {diagnosisNames.length > 2 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{diagnosisNames.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No diagnoses</p>
          )}
        </div>

        {/* Sick Leave - Compact */}
        {sickLeaveInfo && (
          <div className="bg-orange-50 border border-orange-200 rounded p-2">
            <div className="flex items-center space-x-1 mb-1">
              <ClockIcon className="h-3 w-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-800">Sick Leave</span>
            </div>
            <p className="text-xs text-orange-700 truncate">{sickLeaveInfo.period}</p>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>ID: {examination.id}</span>
            </div>
            {sickLeaveInfo && (
              <div className="flex items-center space-x-1">
                <ExclamationCircleIcon className="h-3 w-3 text-orange-500" />
                <span className="text-orange-600">Sick Leave</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Actions */}
      {authData.authorities.includes('ROLE_ADMIN') && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => onEdit(examination.id)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors duration-200"
            >
              <PencilIcon className="h-3 w-3 mr-1" />
              Edit
            </button>
            
            <button
              onClick={() => onDelete(examination.id)}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors duration-200"
            >
              <TrashIcon className="h-3 w-3 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Examination;