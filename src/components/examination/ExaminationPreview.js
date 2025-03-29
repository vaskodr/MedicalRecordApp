import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExaminationPreview = () => {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8084/api/v1/examination/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch examination details');
        }
        return response.json();
      })
      .then((data) => setExamination(data))
      .catch((error) => console.error('Error fetching examination:', error));
  }, [id]);

  if (!examination) {
    return <p>Loading...</p>;
  }

  // Safely handle `diagnosisIds`
  const diagnosisList = examination.diagnosisIds?.length
    ? examination.diagnosisIds.join(', ')
    : 'No diagnoses available';

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Examination Preview</h2>
      <p><strong>Date:</strong> {examination.examinationDate}</p>
      <p><strong>Treatment:</strong> {examination.treatment}</p>
      <p><strong>Diagnoses:</strong> {diagnosisList}</p>

      {/* Option to issue a sick leave */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
        onClick={() => console.log('Issue sick leave functionality here')}
      >
        Issue Sick Leave
      </button>
    </div>
  );
};

export default ExaminationPreview;
