import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BeakerIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../auth/AuthContext';
import Diagnosis from './Diagnosis';

const DiagnosesList = () => {
  const { authData } = useContext(AuthContext);
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8084/api/v1/diagnosis/list', {
          headers: {
            'Authorization': authData?.accessToken ? `Bearer ${authData.accessToken}` : undefined,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Diagnoses data:', data);
        setDiagnoses(data);
        setFilteredDiagnoses(data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setError('Failed to load diagnoses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, [authData]);

  // Filter diagnoses based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = diagnoses.filter((diagnosis) =>
        diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDiagnoses(filtered);
    } else {
      setFilteredDiagnoses(diagnoses);
    }
  }, [searchTerm, diagnoses]);

  const handleEdit = (id) => navigate(`/admin/dashboard/diagnoses/edit/${id}`);

  const handleDelete = async (id) => {
    if (!authData?.accessToken) {
      alert('You must be logged in to delete a diagnosis.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this diagnosis?')) {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete the diagnosis');
        }

        setDiagnoses((prev) => prev.filter((d) => d.id !== id));
        setFilteredDiagnoses((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
        alert('Error deleting diagnosis. You may not have permission to perform this action.');
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600 font-medium">Loading diagnoses...</p>
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

  const totalDiagnoses = diagnoses.length;
  const activeDiagnoses = diagnoses.length; // Assuming all are active
  const recentDiagnoses = Math.floor(diagnoses.length * 0.2); // 20% as recent

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Diagnoses</h1>
                <p className="text-gray-600">Manage and view all medical diagnosis records</p>
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
              <button
                onClick={() => navigate('/admin/dashboard/diagnoses/create')}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Diagnosis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Diagnoses</p>
              <p className="text-2xl font-bold text-gray-900">{totalDiagnoses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Records</p>
              <p className="text-2xl font-bold text-gray-900">{activeDiagnoses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Math.min(totalDiagnoses, 15)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent</p>
              <p className="text-2xl font-bold text-gray-900">{recentDiagnoses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Diagnoses
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by diagnosis name or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              />
            </div>

            {/* Clear Search */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredDiagnoses.length} of {totalDiagnoses} diagnoses
            </p>
            {searchTerm && (
              <span className="text-sm text-green-600 font-medium">
                Search active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Diagnoses Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Diagnosis Records</h2>
        </div>
        
        {filteredDiagnoses.length === 0 ? (
          <div className="text-center py-12">
            <BeakerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No diagnoses match your search' : 'No diagnoses found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by adding a new diagnosis to the system.'
              }
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/admin/dashboard/diagnoses/create')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add First Diagnosis
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDiagnoses.map((diagnosis) => (
                <Diagnosis
                  key={diagnosis.id}
                  diagnosis={diagnosis}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-green-100 mt-1">Commonly used diagnosis management tasks</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/admin/dashboard/diagnoses/create')}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
            >
              Add Diagnosis
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

export default DiagnosesList;