import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChartBarIcon, 
  CalendarIcon, 
  ClockIcon, 
  ArrowUpIcon, 
  UserIcon, 
  DocumentTextIcon,
  HeartIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// API Services
const ExaminationService = {
  // Get All Examinations For All Doctors
  getAllExaminations: async (startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/examination/by-period?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Failed to fetch examinations');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching all examinations:', error);
      throw error;
    }
  },
  
  // Get All Examinations By Doctor Id For Data Range
  getExaminationsByDoctor: async (doctorId, startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/examination/doctor/${doctorId}/by-period?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error(`Failed to fetch examinations for doctor ${doctorId}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error fetching examinations for doctor ${doctorId}:`, error);
      throw error;
    }
  }
};

const DoctorService = {
  // Get All Doctors
  getAllDoctors: async () => {
    try {
      const response = await fetch('http://localhost:8084/api/v1/doctor/list');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }
};

const SickLeaveService = {
  // Get Month in the Year with most issued SICK LEAVES
  getPeakMonth: async (year) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/sick-leave/statistics/peak-month?year=${year}`);
      if (!response.ok) throw new Error(`Failed to fetch sick leave peak month for ${year}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`Error fetching sick leave peak month for ${year}:`, error);
      throw error;
    }
  },

  // Get Doctor/s with most issued SICK LEAVES
  getDoctorsWithMostSickLeaves: async () => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/doctor/statistics/doctors-most-sick-leaves`);
      if (!response.ok) throw new Error('Failed to fetch doctors with most sick leaves');
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Error fetching doctors with most sick leaves:', error);
      throw error;
    }
  }
};

const MedicalStatistics = () => {
  // Examination state
  const [examinations, setExaminations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [examinationStats, setExaminationStats] = useState({
    totalExaminations: 0,
    totalDoctors: 0,
    totalPatients: 0,
    peakMonth: null,
    averagePerDay: 0,
    treatmentTypes: {},
    monthlyBreakdown: {}
  });

  // Sick leave state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [peakMonth, setPeakMonth] = useState(null);
  const [doctorsWithMostSickLeaves, setDoctorsWithMostSickLeaves] = useState([]);

  // Loading and error states
  const [loadingExaminations, setLoadingExaminations] = useState(true);
  const [loadingSickLeave, setLoadingSickLeave] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingDoctorsSickLeave, setLoadingDoctorsSickLeave] = useState(true);
  const [examinationError, setExaminationError] = useState(null);
  const [sickLeaveError, setSickLeaveError] = useState(null);
  const [doctorsError, setDoctorsError] = useState(null);
  const [doctorsSickLeaveError, setDoctorsSickLeaveError] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Get doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(doc => doc.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : `Doctor ${doctorId}`;
  };

  // Get unique doctors from examinations for dropdown filtering
  const uniqueDoctorIds = [...new Set(examinations.map(exam => exam.doctorId))];
  
  // Show all doctors if no examinations are loaded, otherwise filter by active doctors
  const availableDoctors = examinations.length > 0 
    ? doctors.filter(doctor => uniqueDoctorIds.includes(doctor.id))
    : doctors;

  const calculateExaminationStats = (exams) => {
    if (!exams || exams.length === 0) {
      return {
        totalExaminations: 0,
        totalDoctors: 0,
        totalPatients: 0,
        peakMonth: null,
        averagePerDay: 0,
        treatmentTypes: {},
        monthlyBreakdown: {}
      };
    }

    const uniqueDoctors = [...new Set(exams.map(exam => exam.doctorId))];
    const uniquePatients = [...new Set(exams.map(exam => exam.patientId))];
    
    // Calculate monthly breakdown
    const monthlyBreakdown = {};
    exams.forEach(exam => {
      const month = new Date(exam.examinationDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      monthlyBreakdown[month] = (monthlyBreakdown[month] || 0) + 1;
    });

    // Find peak month
    const peakMonth = Object.entries(monthlyBreakdown).reduce((max, [month, count]) => 
      count > (max.count || 0) ? { month, count } : max, {}
    );

    // Calculate date range in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const averagePerDay = exams.length / daysDiff;

    // Group treatments
    const treatmentTypes = {};
    exams.forEach(exam => {
      const treatment = exam.treatment.toLowerCase();
      treatmentTypes[treatment] = (treatmentTypes[treatment] || 0) + 1;
    });

    return {
      totalExaminations: exams.length,
      totalDoctors: uniqueDoctors.length,
      totalPatients: uniquePatients.length,
      peakMonth,
      averagePerDay: Math.round(averagePerDay * 100) / 100,
      treatmentTypes,
      monthlyBreakdown
    };
  };

  const fetchDoctors = useCallback(async () => {
    try {
      setLoadingDoctors(true);
      setDoctorsError(null);
      const response = await DoctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setDoctorsError('Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const fetchExaminationStats = useCallback(async () => {
    // Don't fetch if dates are not set
    if (!startDate || !endDate) {
      setExaminations([]);
      setExaminationStats({
        totalExaminations: 0,
        totalDoctors: 0,
        totalPatients: 0,
        peakMonth: null,
        averagePerDay: 0,
        treatmentTypes: {},
        monthlyBreakdown: {}
      });
      setLoadingExaminations(false);
      return;
    }

    try {
      setLoadingExaminations(true);
      setExaminationError(null);
      
      let response;
      if (selectedDoctor === 'all') {
        response = await ExaminationService.getAllExaminations(startDate, endDate);
      } else {
        response = await ExaminationService.getExaminationsByDoctor(selectedDoctor, startDate, endDate);
      }
      
      setExaminations(response.data);
      setExaminationStats(calculateExaminationStats(response.data));
    } catch (err) {
      setExaminationError('Failed to fetch examination statistics');
      console.error('Error fetching examination statistics:', err);
    } finally {
      setLoadingExaminations(false);
    }
  }, [selectedDoctor, startDate, endDate]);

  const fetchSickLeaveStats = useCallback(async () => {
    try {
      setLoadingSickLeave(true);
      setSickLeaveError(null);
      const peakMonthResponse = await SickLeaveService.getPeakMonth(selectedYear);
      setPeakMonth(peakMonthResponse.data);
    } catch (err) {
      setSickLeaveError('Failed to fetch sick leave statistics');
      console.error('Error fetching sick leave statistics:', err);
    } finally {
      setLoadingSickLeave(false);
    }
  }, [selectedYear]);

  const fetchDoctorsWithMostSickLeaves = useCallback(async () => {
    try {
      setLoadingDoctorsSickLeave(true);
      setDoctorsSickLeaveError(null);
      const response = await SickLeaveService.getDoctorsWithMostSickLeaves();
      setDoctorsWithMostSickLeaves(response.data);
    } catch (err) {
      setDoctorsSickLeaveError('Failed to fetch doctors with most sick leaves');
      console.error('Error fetching doctors with most sick leaves:', err);
    } finally {
      setLoadingDoctorsSickLeave(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
    fetchDoctorsWithMostSickLeaves();
  }, [fetchDoctors, fetchDoctorsWithMostSickLeaves]);

  useEffect(() => {
    fetchExaminationStats();
  }, [fetchExaminationStats]);

  useEffect(() => {
    fetchSickLeaveStats();
  }, [fetchSickLeaveStats]);

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            <ChartBarIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Medical Statistics Dashboard</h2>
            <p className="text-blue-100">
              Welcome to the comprehensive medical statistics dashboard. Use the tabs above to explore 
              detailed examination data and sick leave analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Examination Analytics</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Analyze examination patterns, treatment types, and doctor performance across custom date ranges.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Filter by specific doctors
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Custom date range selection
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Treatment analysis & trends
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Peak activity identification
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('examinations')}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Examinations
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sick Leave Statistics</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Track sick leave patterns and identify peak months for better workforce planning and health insights.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Yearly analysis & trends
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Peak month identification
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Historical comparisons
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Planning insights
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('sickleave')}
            className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Sick Leave
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Data Integration</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Comprehensive integration with your medical system APIs for real-time data analysis and reporting.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Real-time API integration
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Multi-source data analysis
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Automated calculations
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Export capabilities
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-center cursor-not-allowed">
            System Integrated
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-gray-600" />
            Quick Start Guide
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                Analyzing Examinations
              </h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                  Navigate to the "Examinations" tab
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                  Select your desired date range (start and end dates)
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                  Choose a specific doctor or view all doctors
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                  Review the generated statistics and insights
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AcademicCapIcon className="h-4 w-4 mr-2 text-orange-600" />
                Reviewing Sick Leave Data
              </h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                  Go to the "Sick Leave" tab
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                  Select the year you want to analyze
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                  View peak month analysis and trends
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                  Use insights for workforce planning
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Examination API</p>
                <p className="text-sm text-green-700">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-900">Sick Leave API</p>
                <p className="text-sm text-green-700">Connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-900">Dashboard</p>
                <p className="text-sm text-blue-700">Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ExaminationTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="doctor" className="text-sm font-medium text-gray-700">Doctor:</label>
            <select 
              id="doctor" 
              value={selectedDoctor} 
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              disabled={loadingDoctors}
            >
              <option value="all">All Doctors</option>
              {loadingDoctors ? (
                <option disabled>Loading doctors...</option>
              ) : doctorsError ? (
                <option disabled>Error loading doctors</option>
              ) : availableDoctors.length > 0 ? (
                availableDoctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {getDoctorName(doctor.id)}
                  </option>
                ))
              ) : (
                <option disabled>No doctors available</option>
              )}
            </select>
            {doctorsError && (
              <span className="text-red-500 text-sm ml-2">{doctorsError}</span>
            )}
            {loadingDoctors && (
              <span className="text-gray-500 text-sm ml-2">Loading...</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">From:</label>
            <input 
              id="startDate"
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Select start date"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">To:</label>
            <input 
              id="endDate"
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Select end date"
            />
          </div>
        </div>
      </div>

      {/* Examination Statistics */}
      {!startDate || !endDate ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <CalendarIcon className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Select Date Range</h3>
          <p className="text-blue-700">Please select both start and end dates to view examination statistics</p>
        </div>
      ) : loadingExaminations ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : examinationError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{examinationError}</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Examinations</p>
                  <p className="text-3xl font-bold text-blue-600">{examinationStats.totalExaminations}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                  <p className="text-3xl font-bold text-green-600">{examinationStats.totalDoctors}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Patients</p>
                  <p className="text-3xl font-bold text-purple-600">{examinationStats.totalPatients}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Average</p>
                  <p className="text-3xl font-bold text-orange-600">{examinationStats.averagePerDay}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Analysis */}
          {Object.keys(examinationStats.treatmentTypes).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Treatment Analysis</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(examinationStats.treatmentTypes)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([treatment, count]) => (
                    <div key={treatment} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 capitalize truncate">{treatment}</span>
                        <span className="text-lg font-bold text-blue-600">{count}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {((count / examinationStats.totalExaminations) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const SickLeaveTab = () => (
    <div className="space-y-6">
      {/* Year Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="year" className="text-sm font-medium text-gray-700">Year:</label>
          <select 
            id="year" 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Month Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-white" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">Peak Month Analysis</h3>
                <p className="text-orange-100">Month with highest sick leave activity for {selectedYear}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loadingSickLeave ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : sickLeaveError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{sickLeaveError}</p>
              </div>
            ) : peakMonth && peakMonth.hasSickLeaves ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-orange-600">{peakMonth.month}</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{peakMonth.monthName}</h4>
                <p className="text-gray-600 mb-4">Peak month for {peakMonth.year}</p>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowUpIcon className="h-6 w-6 text-red-600" />
                    <div>
                      <span className="text-2xl font-bold text-red-600">{peakMonth.sickLeaveCount}</span>
                      <span className="text-gray-600 font-medium ml-2">sick leaves issued</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">{peakMonth.monthName}</div>
                    <div className="text-xs text-gray-600">Peak Month</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-gray-900">{Math.round(peakMonth.sickLeaveCount / 30)}</div>
                    <div className="text-xs text-gray-600">Daily Avg</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h4>
                <p className="text-gray-600">No sick leave data found for {selectedYear}</p>
              </div>
            )}
          </div>
        </div>

        {/* Doctors with Most Sick Leaves */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-white" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-white">Top Doctors</h3>
                <p className="text-purple-100">Doctors with most issued sick leaves</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loadingDoctorsSickLeave ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : doctorsSickLeaveError ? (
              <div className="text-center py-12">
                <p className="text-red-600">{doctorsSickLeaveError}</p>
              </div>
            ) : doctorsWithMostSickLeaves && doctorsWithMostSickLeaves.length > 0 ? (
              <div className="space-y-4">
                {doctorsWithMostSickLeaves.slice(0, 5).map((doctorStat, index) => {
                  const doctor = doctors.find(d => d.id === doctorStat.doctorId);
                  const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : `Doctor ${doctorStat.doctorId}`;
                  
                  return (
                    <div key={doctorStat.doctorId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doctorName}</p>
                          <p className="text-sm text-gray-600">
                            {doctor ? `Specialization: ${doctor.specialization || 'General'}` : `ID: ${doctorStat.doctorId}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{doctorStat.sickLeaveCount}</p>
                        <p className="text-sm text-gray-600">sick leaves</p>
                      </div>
                    </div>
                  );
                })}
                
                {doctorsWithMostSickLeaves.length > 5 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      Showing top 5 of {doctorsWithMostSickLeaves.length} doctors
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h4>
                <p className="text-gray-600">No sick leave data found for doctors</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      {(peakMonth && peakMonth.hasSickLeaves) || (doctorsWithMostSickLeaves && doctorsWithMostSickLeaves.length > 0) ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Summary Insights</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Peak Activity
                </h4>
                <p className="text-orange-800 text-sm">
                  {peakMonth && peakMonth.hasSickLeaves 
                    ? `${peakMonth.monthName} ${peakMonth.year} had the highest sick leave activity with ${peakMonth.sickLeaveCount} cases issued.`
                    : 'No peak month data available for the selected year.'
                  }
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Top Performer
                </h4>
                <p className="text-purple-800 text-sm">
                  {doctorsWithMostSickLeaves && doctorsWithMostSickLeaves.length > 0 
                    ? (() => {
                        const topDoctor = doctors.find(d => d.id === doctorsWithMostSickLeaves[0].doctorId);
                        const topDoctorName = topDoctor ? `Dr. ${topDoctor.firstName} ${topDoctor.lastName}` : `Doctor ${doctorsWithMostSickLeaves[0].doctorId}`;
                        return `${topDoctorName} leads with ${doctorsWithMostSickLeaves[0].sickLeaveCount} sick leaves issued.`;
                      })()
                    : 'No doctor statistics available.'
                  }
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Total Doctors
                </h4>
                <p className="text-blue-800 text-sm">
                  {doctorsWithMostSickLeaves && doctorsWithMostSickLeaves.length > 0 
                    ? `${doctorsWithMostSickLeaves.length} doctors have issued sick leaves, helping manage patient care effectively.`
                    : 'Doctor participation data not available.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Statistics Dashboard</h1>
                <p className="text-gray-600">Comprehensive analysis of examinations and sick leave data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4">
          <div className="flex space-x-4">
            <TabButton 
              id="overview" 
              label="Overview" 
              icon={ChartBarIcon}
              active={activeTab === 'overview'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="examinations" 
              label="Examinations" 
              icon={DocumentTextIcon}
              active={activeTab === 'examinations'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="sickleave" 
              label="Sick Leave" 
              icon={AcademicCapIcon}
              active={activeTab === 'sickleave'} 
              onClick={setActiveTab} 
            />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'examinations' && <ExaminationTab />}
      {activeTab === 'sickleave' && <SickLeaveTab />}
    </div>
  );
};

export default MedicalStatistics;