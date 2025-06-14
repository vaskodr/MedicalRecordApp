import React, { useState, useEffect } from "react";
import { 
  AcademicCapIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  BeakerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Specialization from "./Specialization";

const SpecializationList = () => {
  const [specializations, setSpecializations] = useState([]);
  const [newSpecializationName, setNewSpecializationName] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingSpecialization, setAddingSpecialization] = useState(false);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8084/api/v1/specialization/list");
      if (!response.ok) throw new Error('Failed to fetch specializations');
      const data = await response.json();
      setSpecializations(data);
    } catch (error) {
      setError('Failed to load specializations');
      console.error("Error fetching specializations: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  // Filter specializations based on search term
  const filteredSpecializations = specializations.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSpecialization = async () => {
    if (newSpecializationName.trim()) {
      try {
        setAddingSpecialization(true);
        const response = await fetch("http://localhost:8084/api/v1/specialization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newSpecializationName }),
        });
        
        if (!response.ok) throw new Error('Failed to add specialization');
        
        setNewSpecializationName("");
        setShowAddForm(false);
        await fetchSpecializations();
      } catch (error) {
        console.error("Error adding specialization: ", error);
        setError('Failed to add specialization');
      } finally {
        setAddingSpecialization(false);
      }
    }
  };

  const handleEditSpecialization = async (id) => {
    if (editedName.trim()) {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/specialization/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editedName }),
        });
        
        if (!response.ok) throw new Error('Failed to update specialization');
        
        setEditMode(null);
        setEditedName("");
        await fetchSpecializations();
      } catch (error) {
        console.error("Error editing specialization: ", error);
        setError('Failed to update specialization');
      }
    }
  };

  const handleDeleteSpecialization = async (id) => {
    if (window.confirm('Are you sure you want to delete this specialization?')) {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/specialization/${id}`, {
          method: "DELETE"
        });
        
        if (!response.ok) throw new Error('Failed to delete specialization');
        
        setSpecializations((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Error deleting specialization: ", error);
        setError('Failed to delete specialization');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSpecialization();
    } else if (e.key === 'Escape') {
      setShowAddForm(false);
      setNewSpecializationName("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 font-medium">Loading specializations...</p>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Specializations</h1>
                <p className="text-gray-600">Manage and organize medical specialization fields</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Specialization
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Specializations</p>
              <p className="text-2xl font-bold text-gray-900">{specializations.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Fields</p>
              <p className="text-2xl font-bold text-gray-900">{specializations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BeakerIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Research Areas</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(specializations.length * 0.7)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Added</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Specialization Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Specialization
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label htmlFor="newSpecialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization Name
                </label>
                <input
                  id="newSpecialization"
                  type="text"
                  value={newSpecializationName}
                  onChange={(e) => setNewSpecializationName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter specialization name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-500">Press Enter to add, Escape to cancel</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSpecializationName("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSpecialization}
                  disabled={!newSpecializationName.trim() || addingSpecialization}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {addingSpecialization ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Specialization
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Search Specializations
          </h2>
        </div>
        <div className="p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredSpecializations.length} of {specializations.length} specializations
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Specializations Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Available Specializations</h2>
        </div>
        
        {filteredSpecializations.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No specializations match your search' : 'No specializations available'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by adding your first medical specialization.'
              }
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add First Specialization
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecializations.map((specialization) => (
                <Specialization
                  key={specialization.id}
                  specialization={specialization}
                  onEdit={handleEditSpecialization}
                  onDelete={handleDeleteSpecialization}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  editedName={editedName}
                  setEditedName={setEditedName}
                  onSaveEdit={handleEditSpecialization}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-purple-100 mt-1">Commonly used specialization management tasks</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
            >
              Add Specialization
            </button>
            <button 
              onClick={fetchSpecializations}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm"
            >
              Refresh List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecializationList;