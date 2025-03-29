import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext'; // Import AuthContext for authData
import DiagnosisForm from './DiagnosisForm';

const EditDiagnosis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const { authData } = useContext(AuthContext); // Access authData from context

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`, // Include token for authorization
          }
        });
        if (response.ok) {
          const data = await response.json();
          setDiagnosis(data);
        } else {
          console.error('Failed to fetch diagnosis');
        }
      } catch (error) {
        console.error('Error fetching diagnosis:', error);
      }
    };

    fetchDiagnosis();
  }, [id, authData.accessToken]); // Adding authData.accessToken to dependencies

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:8084/api/v1/diagnosis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.accessToken}`, // Include token for authorization
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate('/admin/dashboard/diagnoses');
        console.log("Diagnosis Updated");
      } else {
        console.error('Error updating diagnosis:', response);
      }
    } catch (error) {
      console.error('Error updating diagnosis:', error);
    }
  };

  if (!diagnosis) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Diagnosis</h1>
      <DiagnosisForm
        diagnosis={diagnosis}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/diagnoses')}
      />
    </div>
  );
};

export default EditDiagnosis;
