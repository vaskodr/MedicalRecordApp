import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardDocumentListIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from "../../auth/AuthContext";
import Examination from "./Examination";

const ExaminationList = () => {
  const { authData } = useContext(AuthContext);
  const [examinations, setExaminations] = useState([]);
  const [filteredExaminations, setFilteredExaminations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isAdmin = authData?.authorities?.includes("ROLE_ADMIN");
  const isDoctor = authData?.authorities?.includes("ROLE_DOCTOR");

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8084/api/v1/examination/list");
        if (!response.ok) throw new Error('Failed to fetch examinations');
        const data = await response.json();
        setExaminations(data);
        setFilteredExaminations(data);
      } catch (error) {
        setError('Failed to load examinations');
        console.error('Error fetching examinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExaminations();
  }, [authData]);

  // Combined filtering logic
  useEffect(() => {
    let filtered = examinations;

    // Filter by search term (patient or doctor name would need additional API calls)
    if (searchTerm) {
      filtered = filtered.filter((exam) => 
        exam.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.examinationDate.includes(searchTerm)
      );
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((exam) => 
        exam.examinationDate === dateFilter
      );
    }

    // Filter by status (for this example, we'll consider all as completed)
    if (statusFilter) {
      // This would be expanded based on actual status fields
      filtered = filtered.filter((exam) => {
        if (statusFilter === 'completed') return true;
        if (statusFilter === 'with-sick-leave') return exam.sickLeaveId;
        if (statusFilter === 'without-sick-leave') return !exam.sickLeaveId;
        return true;
      });
    }

    setFilteredExaminations(filtered);
  }, [searchTerm, dateFilter, statusFilter, examinations]);

  const handleEdit = (id) => navigate(`/admin/dashboard/examinations/edit/${id}`);

  const handleDelete = async (id) => {
    if (!authData?.accessToken) {
      alert("You must be logged in to delete an examination.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this examination?")) {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/examination/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete the examination");
        }

        setExaminations((prev) => prev.filter((e) => e.id !== id));
        setFilteredExaminations((prev) => prev.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Error deleting examination:", error);
        alert("Error deleting examination. You may not have permission to perform this action.");
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setStatusFilter('');
  };

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading examinations...</p>
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

  const totalExaminations = examinations.length;
  const completedExaminations = examinations.length; // Assuming all are completed
  const withSickLeave = examinations.filter(e => e.sickLeaveId).length;
  const todayExaminations = examinations.filter(e => e.examinationDate === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Examinations</h1>
                <p className="text-gray-600">View and manage all patient examinations</p>
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
              {(isAdmin || isDoctor) && (
                <button
                  onClick={() => navigate("/admin/dashboard/examinations/create")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Examination
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Examinations</p>
              <p className="text-2xl font-bold text-gray-900">{totalExaminations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedExaminations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">With Sick Leave</p>
              <p className="text-2xl font-bold text-gray-900">{withSickLeave}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayExaminations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search & Filter Examinations
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
                placeholder="Search treatments..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors duration-200"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="with-sick-leave">With Sick Leave</option>
                <option value="without-sick-leave">Without Sick Leave</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!searchTerm && !dateFilter && !statusFilter}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredExaminations.length} of {totalExaminations} examinations
            </p>
            {(searchTerm || dateFilter || statusFilter) && (
              <span className="text-sm text-blue-600 font-medium">
                Filters active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Examinations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Examination Records</h2>
        </div>
        
        {filteredExaminations.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm || dateFilter || statusFilter ? 'No examinations match your criteria' : 'No examinations found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || dateFilter || statusFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating a new examination.'
              }
            </p>
            {!searchTerm && !dateFilter && !statusFilter && (isAdmin || isDoctor) && (
              <div className="mt-6">
                <button
                  onClick={() => navigate("/admin/dashboard/examinations/create")}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create First Examination
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExaminations.map((examination) => (
                <Examination
                  key={examination.id}
                  examination={examination}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  authData={authData}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-blue-100 mt-1">Commonly used examination management tasks</p>
          </div>
          <div className="flex space-x-3">
            {(isAdmin || isDoctor) && (
              <button
                onClick={() => navigate("/admin/dashboard/examinations/create")}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                New Examination
              </button>
            )}
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

export default ExaminationList;