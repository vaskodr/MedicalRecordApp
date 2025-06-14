import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  HeartIcon,
  UserIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import LoginModal from "../login/LoginModal";

const NavigationBar = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
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
    setUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
  };

  const getUserDisplayName = () => {
    if (!authData?.userDTO) return "User";
    return `${authData.userDTO.firstName || ''} ${authData.userDTO.lastName || ''}`.trim() || authData.userDTO.username || "User";
  };

  const getUserRole = () => {
    if (!authData?.authorities) return "";
    if (authData.authorities.includes("ROLE_ADMIN")) return "Administrator";
    if (authData.authorities.includes("ROLE_DOCTOR")) return "Doctor";
    if (authData.authorities.includes("ROLE_PATIENT")) return "Patient";
    return "";
  };

  const navigateToDashboard = (role) => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    if (role === "ROLE_ADMIN") navigate("/admin/dashboard");
    if (role === "ROLE_DOCTOR") navigate("/doctor/dashboard");
    if (role === "ROLE_PATIENT") navigate("/patient/dashboard");
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-3 group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                  <HeartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900">MedicalCare</span>
                  <span className="text-xs text-gray-500 hidden sm:block">Healthcare Management</span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {!authData ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Register
                  </button>
                  <button
                    onClick={handleOpenModal}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Dashboard Navigation */}
                  {authData.authorities.includes("ROLE_ADMIN") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_ADMIN")}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-2" />
                      Admin
                    </button>
                  )}
                  {authData.authorities.includes("ROLE_DOCTOR") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_DOCTOR")}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                      Doctor Portal
                    </button>
                  )}
                  {authData.authorities.includes("ROLE_PATIENT") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_PATIENT")}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      Patient Portal
                    </button>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-gray-900">{getUserDisplayName()}</span>
                        <span className="text-xs text-gray-500">{getUserRole()}</span>
                      </div>
                      <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500">{getUserRole()}</p>
                          {authData.userDTO?.email && (
                            <p className="text-xs text-gray-500 truncate">{authData.userDTO.email}</p>
                          )}
                        </div>
                        <div className="py-1">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center"
                          >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {!authData ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <UserPlusIcon className="h-4 w-4 mr-3" />
                    Register
                  </button>
                  <button
                    onClick={() => {
                      handleOpenModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="px-3 py-2 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getUserRole()}</p>
                  </div>

                  {/* Dashboard Links */}
                  {authData.authorities.includes("ROLE_ADMIN") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_ADMIN")}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Admin Dashboard
                    </button>
                  )}
                  {authData.authorities.includes("ROLE_DOCTOR") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_DOCTOR")}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4 mr-3" />
                      Doctor Dashboard
                    </button>
                  )}
                  {authData.authorities.includes("ROLE_PATIENT") && (
                    <button
                      onClick={() => navigateToDashboard("ROLE_PATIENT")}
                      className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Patient Dashboard
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal onClose={handleCloseModal} />}
    </>
  );
};

export default NavigationBar;