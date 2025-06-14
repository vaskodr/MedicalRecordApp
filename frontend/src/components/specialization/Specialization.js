import React from "react";
import { 
  AcademicCapIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const Specialization = ({
  specialization,
  onEdit,
  onDelete,
  editMode,
  setEditMode,
  editedName,
  setEditedName,
  onSaveEdit,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit(specialization.id);
    } else if (e.key === 'Escape') {
      setEditMode(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-purple-200 overflow-hidden">
      {editMode === specialization.id ? (
        <>
          {/* Edit Mode Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <PencilIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Edit Specialization</h3>
                <p className="text-purple-100 text-sm">Modify the specialization name</p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="p-6">
            <div className="mb-4">
              <label htmlFor={`edit-${specialization.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                Specialization Name
              </label>
              <input
                id={`edit-${specialization.id}`}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Enter specialization name..."
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">Press Enter to save, Escape to cancel</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setEditMode(null)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={() => onSaveEdit(specialization.id)}
                disabled={!editedName.trim()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Display Mode Header */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {specialization.name}
                  </h3>
                  <p className="text-purple-100 text-sm">Medical Specialization</p>
                </div>
              </div>
              
              {/* Specialization Badge */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                  <BeakerIcon className="h-3 w-3 mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Specialization Details */}
            <div className="mb-4">
              <div className="flex items-center space-x-3 text-sm">
                <AcademicCapIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">Specialization Field</span>
                  <p className="text-gray-900 font-medium">{specialization.name}</p>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>ID: {specialization.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setEditMode(specialization.id);
                  setEditedName(specialization.name);
                }}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              
              <button
                onClick={() => onDelete(specialization.id)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Specialization;