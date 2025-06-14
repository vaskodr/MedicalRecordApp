import React from 'react';
import { 
  CalendarIcon, 
  DocumentTextIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const SickLeaveCard = ({ sickLeave, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDurationColor = (days) => {
    if (days <= 3) return 'bg-green-100 text-green-800 border-green-200';
    if (days <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getDurationIcon = (days) => {
    if (days <= 3) return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    if (days <= 7) return <ClockIcon className="h-4 w-4 text-yellow-600" />;
    return <ExclamationCircleIcon className="h-4 w-4 text-red-600" />;
  };

  const getDateRangeText = () => {
    const start = formatDate(sickLeave.startDate);
    const end = formatDate(sickLeave.endDate);
    return `${start} - ${end}`;
  };

  const isCurrentlyActive = () => {
    const now = new Date();
    const start = new Date(sickLeave.startDate);
    const end = new Date(sickLeave.endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-orange-200 overflow-hidden max-w-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">Sick Leave</h3>
              <p className="text-orange-100 text-xs">Medical Certificate</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
              isCurrentlyActive() 
                ? 'bg-green-100 text-green-800' 
                : 'bg-white bg-opacity-20 text-white'
            }`}>
              {isCurrentlyActive() ? 'Active' : 'Completed'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Duration and Period */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-500 font-medium">Duration</span>
            </div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDurationColor(sickLeave.days)}`}>
              {getDurationIcon(sickLeave.days)}
              <span className="ml-1">{sickLeave.days} day{sickLeave.days !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-3 w-3 text-orange-600" />
            <span className="text-xs text-gray-500 font-medium">Period</span>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-900 font-medium text-center">{getDateRangeText()}</p>
          </div>
        </div>

        {/* Examination Reference */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <ClipboardDocumentListIcon className="h-3 w-3 text-orange-600" />
            <span className="text-xs text-gray-500 font-medium">Examination</span>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Exam #{sickLeave.examinationId}
          </span>
        </div>

        {/* Medical Note */}
        {sickLeave.note && (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DocumentTextIcon className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-500 font-medium">Medical Note</span>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded p-2">
              <p className="text-xs text-orange-800 line-clamp-2">{sickLeave.note}</p>
            </div>
          </div>
        )}

        {/* ID and Status */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              <span>ID: #{sickLeave.id}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>Medical Leave</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onEdit && onEdit(sickLeave)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 transition-colors duration-200"
          >
            <PencilIcon className="h-3 w-3 mr-1" />
            Edit
          </button>
          
          <button
            onClick={() => onDelete && onDelete(sickLeave.id)}
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

export default SickLeaveCard;