import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const CreateExamination = () => {
  const { patientId } = useParams();
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  // Extract and store doctorId from authData
  const doctorId = authData.userDTO.id;
  console.log(doctorId);

  const [examinationDate, setExaminationDate] = useState('');
  const [treatment, setTreatment] = useState('');
  const [diagnosisIds, setDiagnosisIds] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [filter, setFilter] = useState(''); // For filtering diagnoses

  console.log(doctorId);
  // Fetch all diagnoses from the API
  useEffect(() => {
    fetch('http://localhost:8084/api/v1/diagnosis/list', {
      headers: {
        Authorization: `Bearer ${authData?.accessToken}`, // Pass token if needed
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch diagnoses');
        }
        return response.json();
      })
      .then((data) => setDiagnoses(data))
      .catch((error) => console.error('Error fetching diagnoses:', error));
  }, [authData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createExaminationDTO = {
      examinationDate,
      treatment,
      diagnosisIds,
    };

    try {
      const response = await fetch(
        `http://localhost:8084/api/v1/examination/doctor/${doctorId}/patient/${patientId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData?.accessToken}`, // Pass token if needed
          },
          body: JSON.stringify(createExaminationDTO),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create examination');
      }

      const data = await response.json();
      console.log('Examination created:', data);

      // Redirect to preview page
      navigate(`/doctor/dashboard/examination/preview/${data.id}`);
    } catch (error) {
      console.error('Error creating examination:', error);
    }
  };

  const handleDiagnosisChange = (id) => {
    setDiagnosisIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Filter diagnoses by name
  const filteredDiagnoses = diagnoses.filter((diagnosis) =>
    diagnosis.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Examination for Patient {patientId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Examination Date</label>
          <input
            type="date"
            value={examinationDate}
            onChange={(e) => setExaminationDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Treatment</label>
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            rows={3}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Assign Diagnoses</label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search diagnoses..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm mb-2"
          />
          <div className="border rounded-md p-2 max-h-48 overflow-y-auto">
            {filteredDiagnoses.map((diagnosis) => (
              <div key={diagnosis.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`diagnosis-${diagnosis.id}`}
                  value={diagnosis.id}
                  checked={diagnosisIds.includes(diagnosis.id)}
                  onChange={() => handleDiagnosisChange(diagnosis.id)}
                  className="mr-2"
                />
                <label htmlFor={`diagnosis-${diagnosis.id}`} className="text-gray-700">
                  {diagnosis.description} (ID: {diagnosis.id})
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create Examination
        </button>
      </form>
    </div>
  );
};

export default CreateExamination;
