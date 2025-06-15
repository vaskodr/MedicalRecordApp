import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  UsersIcon, 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const GPPatientsPage = () => {
  const { doctorId } = useParams(); // Get doctorId from URL params
  const navigate = useNavigate();
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInsurance, setFilterInsurance] = useState('all');

  useEffect(() => {
    const fetchGPPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching GP patients for doctor ID:', doctorId);
        const response = await fetch(`http://localhost:8084/api/v1/patient/by-doctor/${doctorId}`);
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch GP patients: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('GP patients data received:', data);
        console.log('Number of GP patients:', data.length);
        
        setPatients(data || []);
      } catch (err) {
        console.error('Error fetching GP patients:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchGPPatients();
    } else {
      setError('No doctor ID provided');
      setLoading(false);
    }
  }, [doctorId]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.egn.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInsurance = 
      filterInsurance === 'all' ||
      (filterInsurance === 'paid' && patient.hasPaidInsurance) ||
      (filterInsurance === 'unpaid' && !patient.hasPaidInsurance);

    return matchesSearch && matchesInsurance;
  });

  const handlePatientClick = (patientId) => {
    navigate(`/patient/${patientId}/details`);
  };

  const handleViewExaminations = (patientId) => {
    navigate(`/patient/${patientId}/examinations`);
  };

  // Validation: check if doctorId is valid
  if (!doctorId || doctorId === 'undefined' || isNaN(doctorId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <ShieldExclamationIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 font-semibold">Invalid Doctor ID</h3>
              <p className="text-red-600 text-sm mt-1">
                Please navigate from the dashboard to access GP patients.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading GP patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <ShieldExclamationIcon className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-red-800 font-semibold">Error Loading Patients</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/doctor/dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <div className="p-2 bg-teal-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My GP Patients</h1>
                  <p className="text-gray-600">Patients registered under your general practice (Doctor ID: {doctorId})</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">{patients.length}</div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => p.hasPaidInsurance).length}
                </div>
                <div className="text-sm text-gray-600">Insured</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => !p.hasPaidInsurance).length}
                </div>
                <div className="text-sm text-gray-600">Uninsured</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-semibold text-gray-900">
                  {patients.filter(p => p.gender === 'MALE').length}
                </div>
                <div className="text-sm text-gray-600">Male</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <div className="text-lg font-semibold text-gray-900">
                  {patients.reduce((sum, p) => sum + (p.examinationIds?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Exams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, username, EGN, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterInsurance}
                  onChange={(e) => setFilterInsurance(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Patients</option>
                  <option value="paid">Insured Only</option>
                  <option value="unpaid">Uninsured Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Patient List ({filteredPatients.length})
            </h2>
          </div>
          
          {filteredPatients.length === 0 ? (
            <div className="p-12 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">
                {searchTerm || filterInsurance !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No patients are currently registered under your GP practice.'
                }
              </p>
              {patients.length === 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    This is normal if you haven't been assigned any GP patients yet. 
                    Contact your administrator to assign patients to your practice.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <UserIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">@{patient.username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {patient.hasPaidInsurance ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <ShieldCheckIcon className="h-3 w-3 mr-1" />
                              Insured
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <ShieldExclamationIcon className="h-3 w-3 mr-1" />
                              Uninsured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            patient.gender === 'MALE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-pink-100 text-pink-800'
                          }`}>
                            {patient.gender}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <IdentificationIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">EGN:</span>
                          <span className="font-medium text-gray-900">{patient.egn}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{patient.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium text-gray-900">{patient.phone}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 md:col-span-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium text-gray-900">{patient.address}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ClipboardDocumentListIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Examinations:</span>
                          <span className="font-medium text-gray-900">
                            {patient.examinationIds?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handlePatientClick(patient.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleViewExaminations(patient.id)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        Examinations ({patient.examinationIds?.length || 0})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPPatientsPage;