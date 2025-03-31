import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExaminationPreview = () => {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [showSickLeaveForm, setShowSickLeaveForm] = useState(false);
  const [sickLeave, setSickLeave] = useState({
    startDate: '',
    endDate: '',
    note: '',
    days: 0,
  });

  useEffect(() => {
    fetch(`http://localhost:8084/api/v1/examination/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch examination details');
        return response.json();
      })
      .then((data) => {
        setExamination(data);

        if (data.patientId) {
          fetch(`http://localhost:8084/api/v1/patient/${data.patientId}`)
            .then((res) => res.json())
            .then((patient) => setPatientData(patient))
            .catch((err) => console.error('Error fetching patient:', err));
        }

        if (data.doctorId) {
          fetch(`http://localhost:8084/api/v1/doctor/${data.doctorId}`)
            .then((res) => res.json())
            .then((doctor) => setDoctorData(doctor))
            .catch((err) => console.error('Error fetching doctor:', err));
        }

        if (Array.isArray(data.diagnosisIds) && data.diagnosisIds.length > 0) {
          Promise.all(
            data.diagnosisIds.map((diagnosisId) =>
              fetch(`http://localhost:8084/api/v1/diagnosis/${diagnosisId}`)
                .then((res) => {
                  if (!res.ok) throw new Error(`Failed to fetch diagnosis ${diagnosisId}`);
                  return res.json();
                })
            )
          )
            .then((diagnosisList) => setDiagnoses(diagnosisList))
            .catch((err) => console.error('Error fetching diagnoses:', err));
        }
      })
      .catch((error) => console.error('Error fetching examination:', error));
  }, [id]);

  useEffect(() => {
    if (sickLeave.startDate && sickLeave.endDate) {
      const start = new Date(sickLeave.startDate);
      const end = new Date(sickLeave.endDate);
      const diff = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      setSickLeave((prev) => ({ ...prev, days: diff }));
    }
  }, [sickLeave.startDate, sickLeave.endDate]);

  const handleToggleSickLeaveForm = () => {
    setShowSickLeaveForm((prev) => !prev);
  };

  const handleSubmitSickLeave = () => {
    fetch(`http://localhost:8084/api/v1/sick-leave/examination/${examination.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: sickLeave.startDate,
        endDate: sickLeave.endDate,
        note: sickLeave.note,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create sick leave');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Sick leave created successfully:', data);
        alert('Sick leave created successfully!');
        setShowSickLeaveForm(false);
        setSickLeave({
          startDate: '',
          endDate: '',
          note: '',
          days: 0,
        });
      })
      .catch((err) => {
        console.error('Error creating sick leave:', err);
        alert('Error creating sick leave');
      });
  };

  if (!examination) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading examination...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10 space-y-6">
      <h2 className="text-3xl font-bold text-teal-600 border-b pb-2">Examination Preview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm">Patient</p>
          <p className="text-lg font-medium text-gray-800">
            {patientData
              ? `${patientData.firstName} ${patientData.lastName}`
              : 'Loading...'}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Doctor</p>
          <p className="text-lg font-medium text-gray-800">
            {doctorData
              ? `${doctorData.firstName} ${doctorData.lastName}`
              : 'Loading...'}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Date</p>
          <p className="text-lg font-medium text-gray-800">{examination.examinationDate}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Treatment</p>
          <p className="text-lg font-medium text-gray-800">{examination.treatment}</p>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-gray-500 text-sm mb-1">Diagnoses</p>
        {diagnoses.length > 0 ? (
          <ul className="divide-y divide-gray-200 border rounded-lg">
            {diagnoses.map((diag) => (
              <li key={diag.id} className="p-4">
                <p className="font-semibold text-gray-800">{diag.name || diag.diagnosis}</p>
                {diag.description && (
                  <p className="text-sm text-gray-600 mt-1">{diag.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No diagnoses available</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition duration-200"
          onClick={handleToggleSickLeaveForm}
        >
          {showSickLeaveForm ? 'Cancel' : 'Issue Sick Leave'}
        </button>
      </div>

      {showSickLeaveForm && (
        <div className="mt-6 border-t pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-teal-600">Sick Leave Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                value={sickLeave.startDate}
                onChange={(e) =>
                  setSickLeave({ ...sickLeave, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                value={sickLeave.endDate}
                onChange={(e) =>
                  setSickLeave({ ...sickLeave, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              value={sickLeave.note}
              onChange={(e) =>
                setSickLeave({ ...sickLeave, note: e.target.value })
              }
            ></textarea>
          </div>

          <div className="text-gray-600">
            <span className="font-semibold">Total Days:</span> {sickLeave.days}
          </div>

          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition"
              onClick={handleSubmitSickLeave}
              disabled={!sickLeave.startDate || !sickLeave.endDate}
            >
              Submit Sick Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExaminationPreview;
