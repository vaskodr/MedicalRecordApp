import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleRegisterButton = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="text-center p-10 bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <header className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
          Welcome to the Medical Records Platform
        </header>
        <p className="text-xl text-gray-700 mb-8">
          A seamless way to manage your medical records and health data. Sign up today for easy access to all your medical information.
        </p>
        <div className="flex flex-col items-center space-y-6">
          <p className="text-xl font-medium text-gray-700">Get Started:</p>
          <button
            className="px-10 py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white font-semibold rounded-full shadow-xl hover:from-green-500 hover:to-teal-500 transform hover:scale-105 transition duration-300"
            onClick={handleRegisterButton}
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
