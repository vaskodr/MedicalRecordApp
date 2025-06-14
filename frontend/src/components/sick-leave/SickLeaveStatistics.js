// components/sick-leave/SickLeaveStatistics.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ChartBarIcon, CalendarIcon, ClockIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import SickLeaveService from './SickLeaveService';

const SickLeaveStatistics = () => {
    const [peakMonth, setPeakMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const fetchStatistics = useCallback(async () => {
      try {
        setLoading(true);
        const peakMonthResponse = await SickLeaveService.getPeakMonth(selectedYear);
        setPeakMonth(peakMonthResponse.data);
      } catch (err) {
        setError('Failed to fetch statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    }, [selectedYear]);
  
    useEffect(() => {
      fetchStatistics();
    }, [fetchStatistics]);
  
    const handleYearChange = (e) => {
      setSelectedYear(parseInt(e.target.value));
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading statistics...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div className="flex items-center">
            <div className="text-red-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sick Leave Statistics</h1>
                  <p className="text-gray-600">Analyze sick leave patterns and trends</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <label htmlFor="year" className="text-sm font-medium text-gray-700">Year:</label>
                <select 
                  id="year" 
                  value={selectedYear} 
                  onChange={handleYearChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
  
        {/* Main Statistics Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Peak Month Large Card */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-white" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-white">Peak Month Analysis</h3>
                  <p className="text-blue-100">Month with the highest sick leave activity for {selectedYear}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {peakMonth && peakMonth.hasSickLeaves ? (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                    <span className="text-3xl font-bold text-blue-600">{peakMonth.month}</span>
                  </div>
                  <h4 className="text-4xl font-bold text-gray-900 mb-3">{peakMonth.monthName}</h4>
                  <p className="text-lg text-gray-600 mb-6">Peak month for {peakMonth.year}</p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center space-x-3">
                      <ArrowUpIcon className="h-8 w-8 text-green-600" />
                      <div>
                        <span className="text-4xl font-bold text-green-600">{peakMonth.sickLeaveCount}</span>
                        <span className="text-gray-600 font-medium ml-2">sick leaves issued</span>
                      </div>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{peakMonth.monthName}</div>
                      <div className="text-sm text-gray-600">Peak Month</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{peakMonth.year}</div>
                      <div className="text-sm text-gray-600">Year</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                  <h4 className="text-2xl font-medium text-gray-900 mb-3">No Data Available</h4>
                  <p className="text-gray-600 text-lg">No sick leave data found for {selectedYear}</p>
                  <p className="text-sm text-gray-500 mt-2">Try selecting a different year to view statistics</p>
                </div>
              )}
            </div>
          </div>
  
          {/* Side Statistics Cards */}
          <div className="space-y-6">
            {/* Year Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Year Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Selected Year</span>
                  <span className="font-semibold text-gray-900">{selectedYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Analysis Period</span>
                  <span className="font-semibold text-gray-900">12 months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    peakMonth && peakMonth.hasSickLeaves 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {peakMonth && peakMonth.hasSickLeaves ? 'Available' : 'No Data'}
                  </span>
                </div>
              </div>
            </div>
  
            {/* Quick Stats Card */}
            {peakMonth && peakMonth.hasSickLeaves && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{peakMonth.sickLeaveCount}</div>
                    <div className="text-sm text-blue-800">Peak Month Total</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(peakMonth.sickLeaveCount / 30)}</div>
                    <div className="text-sm text-purple-800">Avg. per Day</div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Trend Indicator */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <ArrowUpIcon className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Trend Analysis</h3>
              </div>
              <p className="text-purple-100 text-sm">
                {peakMonth && peakMonth.hasSickLeaves 
                  ? `${peakMonth.monthName} shows peak sick leave activity. Monitor seasonal patterns for better healthcare planning.`
                  : `No trend data available for ${selectedYear}. Historical data helps identify patterns.`
                }
              </p>
            </div>
          </div>
        </div>
  
        {/* Additional Insights Section */}
        {peakMonth && peakMonth.hasSickLeaves && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Key Insights for {selectedYear}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Peak Month
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {peakMonth.monthName} {peakMonth.year} recorded the highest sick leave activity 
                    with {peakMonth.sickLeaveCount} cases issued during this period.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <ArrowUpIcon className="h-4 w-4 mr-2" />
                    Activity Level
                  </h4>
                  <p className="text-green-800 text-sm">
                    This represents approximately {Math.round(peakMonth.sickLeaveCount / 30)} sick leaves 
                    per day on average during the peak month.
                  </p>
                </div>
  
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Planning Impact
                  </h4>
                  <p className="text-purple-800 text-sm">
                    Understanding peak months helps optimize staffing and resource allocation 
                    for better healthcare management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default SickLeaveStatistics;