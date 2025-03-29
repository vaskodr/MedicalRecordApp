import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const BaseDashboard = ({ fetchEndpoint, renderContent, dashboardTitle }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authData || !authData.userDTO) {
      console.error('Auth data is missing.');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(fetchEndpoint(authData.userDTO.id), {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error('Failed to fetch dashboard data.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [fetchEndpoint, authData]);

  if (!authData || !authData.userDTO) {
    return <div>Loading authentication data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-orange-600 text-white p-4">
        <h1 className="text-2xl font-bold">{dashboardTitle}</h1>
      </header>
      <main className="p-6 flex-1">
        {dashboardData ? renderContent(dashboardData, authData) : <p>Loading dashboard data...</p>}
      </main>
    </div>
  );
};

export default BaseDashboard;
