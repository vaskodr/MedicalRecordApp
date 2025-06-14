import React from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon,
  AcademicCapIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Doctor = ({ doctor, specializationNames, onEdit, onView, onDelete }) => {
  if (!doctor) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-600">Doctor data is missing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200 overflow-hidden">
      {/* Header with Avatar and Name */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-blue-100 text-sm">@{doctor.username}</p>
          </div>
          {doctor.isGP && (
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                GP
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Contact Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3 text-sm">
            <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 truncate">{doctor.email}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900">{doctor.phone}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            <IdentificationIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-900">{doctor.doctorIdentity}</span>
          </div>
        </div>

        {/* Specializations */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AcademicCapIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Specializations</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {specializationNames.length > 0 ? (
              specializationNames.map((name, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {name}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                General Practice
              </span>
            )}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>ID: {doctor.doctorIdentity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={onView}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </button>
          
          <button
            onClick={onEdit}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Additional Info Hover Card */}
      <div className="hidden group-hover:block absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
        <h4 className="font-medium text-gray-900 mb-2">Quick Info</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Specializations: {specializationNames.length || 0}</p>
          <p>Status: {doctor.isGP ? 'General Practitioner' : 'Specialist'}</p>
          <p>Contact: Available</p>
        </div>
      </div>
    </div>
  );
};

export default Doctor;