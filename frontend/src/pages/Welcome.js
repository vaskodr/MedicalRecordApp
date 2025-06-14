import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HeartIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import LoginModal from "../components/common/login/LoginModal";

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const handleRegisterButton = () => {
    navigate("/register");
  };

  const handleLoginButton = () => {
    setLoginModalOpen(true);
  };

  const handleCloseModal = () => {
    setLoginModalOpen(false);
  };

  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: "Digital Medical Records",
      description: "Secure, centralized storage of all your medical history and documents"
    },
    {
      icon: UserGroupIcon,
      title: "Healthcare Team Access",
      description: "Allow your doctors and healthcare providers to access your information"
    },
    {
      icon: ShieldCheckIcon,
      title: "HIPAA Compliant Security",
      description: "Your medical data is protected with enterprise-grade security"
    }
  ];

  const benefits = [
    "Access your medical records anytime, anywhere",
    "Share information seamlessly with healthcare providers",
    "Track your health journey with comprehensive history",
    "Reduce paperwork and administrative hassle",
    "Emergency access to critical health information"
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center">
              {/* Logo and Branding */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-4 bg-blue-100 rounded-2xl">
                    <HeartIcon className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold text-gray-900">MedicalCare</h1>
                    <p className="text-lg text-gray-600">Healthcare Management Platform</p>
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Health,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> Digitized</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform how you manage your medical records with our secure, comprehensive healthcare platform. 
                Connect with healthcare providers and take control of your health journey.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={handleRegisterButton}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300"
                >
                  <UserPlusIcon className="h-6 w-6 mr-3" />
                  Get Started Free
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
                
                <button
                  onClick={handleLoginButton}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white border-2 border-blue-200 rounded-xl shadow-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                  Sign In
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Trusted by 10k+ Users
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Enterprise Security
                </div>
              </div>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-teal-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for Better Healthcare
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform provides comprehensive tools to manage your health information effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Why Choose MedicalCare?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Join thousands of patients and healthcare providers who trust our platform 
                  for secure, efficient medical record management.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleRegisterButton}
                    className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Your Journey
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <HeartIcon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h4>
                    <p className="text-gray-600 mb-6">
                      Join our healthcare community and experience the future of medical record management.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={handleRegisterButton}
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                      >
                        Create Account
                      </button>
                      <button
                        onClick={handleLoginButton}
                        className="w-full py-3 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-300"
                      >
                        Already have an account?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Take Control of Your Health Today
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Don't wait. Start managing your medical records with confidence and security.
            </p>
            <button
              onClick={handleRegisterButton}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
            >
              <UserPlusIcon className="h-6 w-6 mr-3" />
              Get Started Now
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal onClose={handleCloseModal} />}
    </>
  );
};

export default Welcome;