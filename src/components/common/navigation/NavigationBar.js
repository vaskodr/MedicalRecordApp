import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../login/LoginModal";

const NavigationBar = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const { authData, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">Medical Records App</div>
        <div className="space-x-4">
          {!authData ? (
            <button
              onClick={handleOpenModal}
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200"
            >
              Login
            </button>
          ) : (
            <>
              {authData.authorities.includes("ROLE_ADMIN") && (
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                >
                  Admin Dashboard
                </button>
              )}
              {authData.authorities.includes("ROLE_PATIENT") && (
                <button
                  onClick={() => navigate("/patient/dashboard")}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                >
                  Patient Dashboard
                </button>
              )}
              {authData.authorities.includes("ROLE_DOCTOR") && (
                <button
                  onClick={() => navigate("/doctor/dashboard")}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400"
                >
                  Doctor Dashboard
                </button>
              )}
              <button
                onClick={handleLogoutClick}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {isLoginModalOpen && <LoginModal onClose={handleCloseModal} />}
    </nav>
  );
};

export default NavigationBar;
