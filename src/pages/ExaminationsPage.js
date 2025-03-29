import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExaminationsPage = () => {
  const { patientId } = useParams();
  const [examinations, setExaminations] = useState([]);

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await fetch(`http://localhost:8084/api/v1/examination/patient/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch examinations');
        const data = await response.json();
        setExaminations(data);
      } catch (error) {
        console.error('Error fetching examinations:', error);
      }
    };

    fetchExaminations();
  }, [patientId]);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Examinations for Patient ID: {patientId}</h1>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Treatment</th>
          </tr>
        </thead>
        <tbody>
          {examinations.map((examination) => (
            <tr key={examination.id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{examination.id}</td>
              <td className="border px-4 py-2">{examination.examinationDate}</td>
              <td className="border px-4 py-2">{examination.treatment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExaminationsPage;
