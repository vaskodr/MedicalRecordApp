import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ patientId, doctorId, isRelated }) => {
  const navigate = useNavigate();

  const handleManageExamination = () => {
    navigate(`/doctor/${doctorId}/examinations/manage/${patientId}`);
  };

  const handleViewExamination = () => {
    navigate(`/doctor/dashboard/${doctorId}/examinations/view/${patientId}`);
  };

  return (
    <>
      {isRelated ? (
        <>
          <button
            className="bg-green-500 text-white py-1 px-3 rounded mr-2"
            onClick={handleManageExamination}
          >
            Manage Examinations
          </button>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded"
            onClick={handleViewExamination}
          >
            View Examinations
          </button>
        </>
      ) : (
        <button
          className="bg-gray-500 text-white py-1 px-3 rounded"
          onClick={handleViewExamination}
        >
          View Examinations
        </button>
      )}
    </>
  );
};

export default ActionButtons;
