import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

const CreateDiagnosis = () => {
    const { authData } = useContext(AuthContext); // Get authentication data from context
    const navigate = useNavigate();

    const [diagnosis, setDiagnosis] = useState('');
    const [description, setDescription] = useState('');

    // Handle form submit to create a new diagnosis
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8084/api/v1/diagnosis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authData.accessToken}`, // Use token for authorization
                },
                body: JSON.stringify({
                    diagnosis,
                    description,
                }),
            });

            if (response.ok) {
                navigate('/admin/dashboard/diagnoses'); // Redirect to diagnoses list
                console.log("Diagnosis created!");
            } else {
                console.error('Failed to create diagnosis');
            }
        } catch (error) {
            console.error('Error creating diagnosis:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Diagnosis</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                    <label htmlFor="diagnosis" className="block text-gray-700 font-medium mb-2">
                        Diagnosis
                    </label>
                    <input
                        type="text"
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/diagnoses')}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDiagnosis;
