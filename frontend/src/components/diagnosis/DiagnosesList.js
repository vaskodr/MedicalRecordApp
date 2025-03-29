import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext'; // Import AuthContext
import Diagnosis from './Diagnosis'; // Ensure this component is implemented correctly

const DiagnosesList = () => {
  const { authData } = useContext(AuthContext); // Get authData from context
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch diagnoses from the API
    fetch('http://localhost:8084/api/v1/diagnosis/list', {
      headers: {
        'Authorization': authData?.accessToken ? `Bearer ${authData.accessToken}` : undefined,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Diagnoses data:', data); // Debug API response
        setDiagnoses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching diagnoses:', error);
        setError('Failed to load diagnoses. Please try again later.');
        setLoading(false);
      });
  }, [authData]);

  // Handle the edit button click
  const handleEdit = (id) => navigate(`/admin/dashboard/diagnoses/edit/${id}`);

  // Handle the delete button click
  const handleDelete = (id) => {
    if (!authData || !authData.accessToken) {
      alert('You must be logged in to delete a diagnosis.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this diagnosis?')) {
      fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete the diagnosis');
          }
          // Remove the deleted diagnosis from the state
          setDiagnoses((prevDiagnoses) => prevDiagnoses.filter((d) => d.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting diagnosis:', error);
          alert('Error deleting diagnosis. You may not have permission to perform this action.');
        });
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading diagnoses...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Diagnoses</h1>
      <button
        onClick={() => navigate('/admin/dashboard/diagnoses/create')}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Add New Diagnosis
      </button>
      <div className="mt-4">
        {diagnoses.length > 0 ? (
          diagnoses.map((diagnosis) => (
            <Diagnosis
              key={diagnosis.id}
              diagnosis={diagnosis}
              onEdit={handleEdit} // Pass the edit function
              onDelete={handleDelete} // Pass the delete function
            />
          ))
        ) : (
          <p className="text-gray-600">No diagnoses available.</p>
        )}
      </div>
    </div>
  );
};

export default DiagnosesList;
