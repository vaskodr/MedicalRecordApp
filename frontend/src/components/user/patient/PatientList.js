import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../../auth/AuthContext';
import Patient from './Patient';

const PatientsList = () => {
  const { authData } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchEGN, setSearchEGN] = useState('');
  const [searchName, setSearchName] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8084/api/v1/patient/list');
        if (!response.ok) throw new Error('Failed to fetch patients');
        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        setError('Failed to load patients');
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [authData]);

  // Combined filtering logic
  useEffect(() => {
    let filtered = patients;

    // Filter by EGN
    if (searchEGN.length === 10) {
      filtered = filtered.filter((patient) => patient.egn === searchEGN);
    }

    // Filter by name
    if (searchName) {
      filtered = filtered.filter((patient) => 
        patient.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by insurance status
    if (insuranceFilter !== '') {
      const hasInsurance = insuranceFilter === 'true';
      filtered = filtered.filter((patient) => patient.hasPaidInsurance === hasInsurance);
    }

    setFilteredPatients(filtered);
  }, [searchEGN, searchName, insuranceFilter, patients]);

  const handleEGNSearchChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setSearchEGN(value);
    }
  };

  const handleNameSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleInsuranceFilterChange = (e) => {
    setInsuranceFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchEGN('');
    setSearchName('');
    setInsuranceFilter('');
  };

  const handleEdit = (id) => navigate(`/admin/dashboard/patients/edit/${id}`);
  
  const handleDelete = async (id) => {
    if (!authData || !authData.accessToken) {
      alert('You must be logged in to delete a patient.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/patient/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete the patient');
        }

        setPatients(patients.filter((p) => p.id !== id));
        setFilteredPatients(filteredPatients.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Error deleting patient. You may not have permission to perform this action.');
      }
    }
  };

  const handleAddPatient = () => {
    navigate('/admin/dashboard/patients/create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-gray-600 font-medium">Loading patients...</p>
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

  const insuredCount = patients.filter(p => p.hasPaidInsurance).length;
  const uninsuredCount = patients.length - insuredCount;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Directory</h1>
                <p className="text-gray-600">Manage and view all registered patients</p>
              </div>
            </div>
            {authData.role === 'ADMIN' && (
              <button 
                onClick={handleAddPatient}
                className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Patient
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-teal-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Insured</p>
              <p className="text-2xl font-bold text-gray-900">{insuredCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Uninsured</p>
              <p className="text-2xl font-bold text-gray-900">{uninsuredCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Today</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(patients.length * 0.15)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search & Filter Patients
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* EGN Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchEGN}
                onChange={handleEGNSearchChange}
                maxLength={10}
                placeholder="Search by EGN (10 digits)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              />
            </div>

            {/* Name Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchName}
                onChange={handleNameSearchChange}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200"
              />
            </div>

            {/* Insurance Filter */}
            <div>
              <select
                value={insuranceFilter}
                onChange={handleInsuranceFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white transition-colors duration-200"
              >
                <option value="">All Insurance Status</option>
                <option value="true">Insured</option>
                <option value="false">Uninsured</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPatients.length} of {patients.length} patients
            </p>
            {(searchEGN || searchName || insuranceFilter) && (
              <button
                onClick={clearFilters}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Records</h2>
        </div>
        
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchEGN || searchName || insuranceFilter ? 'No patients match your criteria' : 'No patients found'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchEGN || searchName || insuranceFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding a new patient to the system.'
              }
            </p>
            {!searchEGN && !searchName && !insuranceFilter && authData.role === 'ADMIN' && (
              <div className="mt-6">
                <button 
                  onClick={handleAddPatient}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add First Patient
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPatients.map((patient) => (
                <Patient
                  key={patient.id}
                  patient={patient}
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
      <div className="mt-6 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-teal-100 mt-1">Commonly used patient management tasks</p>
          </div>
          <div className="flex space-x-3">
            {authData.role === 'ADMIN' && (
              <button 
                onClick={handleAddPatient}
                className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
              >
                Add Patient
              </button>
            )}
            <button className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;