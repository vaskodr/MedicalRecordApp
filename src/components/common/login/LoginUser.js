import React, { useState, useContext } from "react";
import { AuthContext } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to track errors
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null); // Reset the error state on each submission attempt

    try {
      const response = await fetch("http://localhost:8084/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data);

        // Navigate based on roles
        if (data.authorities.includes("ROLE_ADMIN")) {
          navigate(`/admin/dashboard`);
        } else if (data.authorities.includes("ROLE_PATIENT")) {
          navigate(`/patient/dashboard`);
        } else if (data.authorities.includes("ROLE_DOCTOR")) {
          navigate(`/doctor/dashboard`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed, please try again.");
      }
    } catch (error) {
      setError("Error during login. Please check your connection.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="email"
              className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Enter your email or username"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <a
            href="/register"
            className="text-blue-500 hover:underline text-sm"
          >
            Don't have an account? Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
