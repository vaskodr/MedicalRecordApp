import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import SickLeaveService from './SickLeaveService.js';
import SickLeaveCard from './SickLeaveCard';

const SickLeaveList = () => {
  const [sickLeaves, setSickLeaves] = useState([]);
  const [filteredSickLeaves, setFilteredSickLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  useEffect(() => {
    fetchSickLeaves();
  }, []);

  useEffect(() => {
    let filtered = sickLeaves;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((sl) =>
        sl.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sl.id.toString().includes(searchTerm) ||
        sl.examinationId.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter === 'active') {
      const now = new Date();
      filtered = filtered.filter((sl) => {
        const start = new Date(sl.startDate);
        const end = new Date(sl.endDate);
        return now >= start && now <= end;
      });
    } else if (statusFilter === 'completed') {
      const now = new Date();
      filtered = filtered.filter((sl) => {
        const end = new Date(sl.endDate);
        return now > end;
      });
    }

    setFilteredSickLeaves(filtered);
  }, [searchTerm, statusFilter, sickLeaves]);

  const fetchSickLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SickLeaveService.getAllSickLeaves();
      setSickLeaves(response.data);
      setFilteredSickLeaves(response.data);
    } catch (err) {
      setError('Failed to fetch sick leaves');
      console.error('Error fetching sick leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sick leave?')) {
      try {
        await SickLeaveService.deleteSickLeave(id);
        setSickLeaves(sickLeaves.filter(sl => sl.id !== id));
        setFilteredSickLeaves(filteredSickLeaves.filter(sl => sl.id !== id));
      } catch (err) {
        setError('Failed to delete sick leave');
        console.error('Error deleting sick leave:', err);
      }
    }
  };

  const handleEdit = (sickLeave) => {
    // Implement edit functionality
    console.log('Edit sick leave:', sickLeave);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  const refreshData = () => {
    fetchSickLeaves();
  };

  // Calculate statistics
  const totalSickLeaves = sickLeaves.length;
  const activeSickLeaves = sickLeaves.filter(sl => {
    const now = new Date();
    const start = new Date(sl.startDate);
    const end = new Date(sl.endDate);
    return now >= start && now <= end;
  }).length;
  
  const thisMonthSickLeaves = sickLeaves.filter(sl => {
    const now = new Date();
    const startDate = new Date(sl.startDate);
    return startDate.getMonth() === now.getMonth() && startDate.getFullYear() === now.getFullYear();
  }).length;
  
  const averageDays = sickLeaves.length > 0 
    ? Math.round(sickLeaves.reduce((sum, sl) => sum + sl.days, 0) / sickLeaves.length) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600 font-medium">Loading sick leaves...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center">
          <div className="text-red-400">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sick Leave Management</h1>
                <p className="text-gray-600">Track and manage medical leave certificates</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Sick Leave
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sick Leaves</p>
              <p className="text-2xl font-bold text-gray-900">{totalSickLeaves}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Currently Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeSickLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{thisMonthSickLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Days</p>
              <p className="text-2xl font-bold text-gray-900">{averageDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search & Filter Sick Leaves
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, note, or exam..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200"
              >
                <option value="">All Status</option>
                <option value="active">Currently Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200"
              >
                <option value="cards">Card View</option>
                <option value="table">Table View</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!searchTerm && !statusFilter}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredSickLeaves.length} of {totalSickLeaves} sick leaves
            </p>
            {(searchTerm || statusFilter) && (
              <span className="text-sm text-orange-600 font-medium">
                Filters active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sick Leave Records</h2>
        </div>
        
        {filteredSickLeaves.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm || statusFilter ? 'No sick leaves match your criteria' : 'No sick leaves found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating a new sick leave record.'
              }
            </p>
            {!searchTerm && !statusFilter && (
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add First Sick Leave
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'cards' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSickLeaves.map((sickLeave) => (
                <SickLeaveCard
                  key={sickLeave.id}
                  sickLeave={sickLeave}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examination</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSickLeaves.map((sickLeave) => {
                  const isActive = (() => {
                    const now = new Date();
                    const start = new Date(sickLeave.startDate);
                    const end = new Date(sickLeave.endDate);
                    return now >= start && now <= end;
                  })();

                  return (
                    <tr key={sickLeave.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-orange-800">#{sickLeave.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(sickLeave.startDate).toLocaleDateString()} - {new Date(sickLeave.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sickLeave.days <= 3 ? 'bg-green-100 text-green-800' :
                          sickLeave.days <= 7 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sickLeave.days} day{sickLeave.days !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isActive ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {sickLeave.note || <span className="text-gray-400 italic">No note</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Exam #{sickLeave.examinationId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(sickLeave)}
                            className="inline-flex items-center p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(sickLeave.id)}
                            className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-orange-100 mt-1">Commonly used sick leave management tasks</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm">
              Add Sick Leave
            </button>
            <button 
              onClick={refreshData}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SickLeaveList;