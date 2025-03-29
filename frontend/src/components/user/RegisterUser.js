import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterDoctor from "./doctor/RegisterDoctor";
import RegisterPatient from "./patient/RegisterPatient"; // Ensure this is used

const RegisterUser = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    gp: "",
    specializationIds: [],
    egn: "",
    hasPaidHealthInsurance: "",
    personalDoctorId: ""
  });
  const navigate = useNavigate();

  // Handle role change (patient or doctor)
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint =
      role === "ROLE_PATIENT"
        ? "http://localhost:8084/api/v1/patient"
        : "http://localhost:8084/api/v1/doctor";

    // Create user data to be sent to the backend
    const userData = {
      ...formData,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User registered successfully");
        navigate("/login"); // Redirect after successful registration
      } else {
        console.error("Error registering user");
        console.log(formData);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Register</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Common User Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
  
          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
  
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          {/* Role Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange("ROLE_PATIENT")}
              className={`px-6 py-3 text-lg rounded-md ${
                role === "ROLE_PATIENT" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } transition duration-300`}
            >
              Register as Patient
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("ROLE_DOCTOR")}
              className={`px-6 py-3 text-lg rounded-md ${
                role === "ROLE_DOCTOR" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              } transition duration-300`}
            >
              Register as Doctor
            </button>
          </div>
  
          {/* Role-Specific Forms */}
          {role === "ROLE_PATIENT" && (
            <RegisterPatient
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          )}
  
          {role === "ROLE_DOCTOR" && (
            <RegisterDoctor
              formData={formData}
              setFormData={setFormData}
            />
          )}
  
          <button
            type="submit"
            className="w-full py-3 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default RegisterUser;
