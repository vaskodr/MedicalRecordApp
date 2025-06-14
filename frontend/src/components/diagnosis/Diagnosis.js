import React from 'react';
import { 
  BeakerIcon, 
  PencilIcon, 
  TrashIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Diagnosis = ({ diagnosis, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-green-200 overflow-hidden max-w-sm">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BeakerIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">Medical Diagnosis</h3>
              <p className="text-green-100 text-xs">Clinical Record</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
              <CheckCircleIcon className="h-2.5 w-2.5 mr-1" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <div className="p-4 space-y-3">
        {/* Diagnosis Name */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <BeakerIcon className="h-3 w-3 text-green-600" />
            <p className="text-xs text-gray-500 font-medium">Diagnosis</p>
          </div>
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            {diagnosis.diagnosis}
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <DocumentTextIcon className="h-3 w-3 text-blue-600" />
            <p className="text-xs text-gray-500 font-medium">Description</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-900 leading-relaxed line-clamp-3">
              {diagnosis.description}
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>ID: {diagnosis.id}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Medical Record</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Actions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onEdit(diagnosis.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors duration-200"
          >
            <PencilIcon className="h-3 w-3 mr-1" />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(diagnosis.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors duration-200"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;