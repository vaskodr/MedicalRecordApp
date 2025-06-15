import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/common/layout/Layout";
import { AuthProvider } from "./auth/AuthContext";
import Welcome from "./pages/Welcome";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import PrivateRoute from "./auth/PrivateRoute";
import RegisterUser from "./components/user/RegisterUser";
import DiagnosesList from "./components/diagnosis/DiagnosesList";
import CreateDiagnosis from "./components/diagnosis/CreateDiagnosis";
import EditDiagnosis from "./components/diagnosis/EditDiagnosis";
import SpecializationList from "./components/specialization/SpecializationList";
import DoctorList from "./components/user/doctor/DoctorList";
import PatientsList from "./components/user/patient/PatientList";
import EditPatient from "./components/user/patient/EditPatient";
import CreateExamination from "./components/examination/CreateExamination";
import ExaminationPreview from "./components/examination/ExaminationPreview";
import LoginUser from "./components/common/login/LoginUser";
// Import sick leave components
import SickLeaveList from "./components/sick-leave/SickLeaveList";
import SickLeaveForm from "./components/sick-leave/SickLeaveForm";
import SickLeaveStatistics from "./components/sick-leave/SickLeaveStatistics";
import ExaminationList from "./components/examination/ExaminationList";
import MedicalStatistics from "./components/statistics/Statistics";
import GPPatientsPage from "./components/user/patient/GPPatientsList";
import DoctorExaminationsList from "./components/examination/DoctorExaminationList";
import EditExamination from "./components/examination/EditExamination";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/register" element={<RegisterUser />} />

            {/* Admin Dashboard Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/diagnoses"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN", "ROLE_DOCTOR"]}>
                  <DiagnosesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/diagnoses/create"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <CreateDiagnosis />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/diagnoses/edit/:id"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <EditDiagnosis />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard/specializations"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <SpecializationList />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard/doctor-list"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <DoctorList />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard/patient-list"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <PatientsList />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard/patients/edit/:id"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <EditPatient />
                </PrivateRoute>
              }
            />

            {/* Admin Sick Leave Routes */}
            <Route
              path="/admin/dashboard/sick-leaves"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <SickLeaveList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/sick-leaves/create/:examinationId"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <SickLeaveForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/sick-leaves/edit/:id"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <SickLeaveForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/sick-leaves/statistics"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <SickLeaveStatistics />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard/statistics"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <MedicalStatistics />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/dashboard/examination-list"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <ExaminationList />
                </PrivateRoute>
              }
            />

            {/* Doctor Dashboard Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/:doctorId/examiantion-list"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/diagnoses"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN", "ROLE_DOCTOR"]}>
                  <DiagnosesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/diagnoses/create"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <CreateDiagnosis />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/diagnoses/edit/:id"
              element={
                <PrivateRoute authorities={["ROLE_ADMIN"]}>
                  <EditDiagnosis />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/dashboard/patient-list"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <PatientsList />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/dashboard/examination/:patientId"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <CreateExamination />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/examination/preview/:id"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <ExaminationPreview />
                </PrivateRoute>
              }
            />

            {/* Doctor Sick Leave Routes */}
            <Route
              path="/doctor/dashboard/sick-leaves"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <SickLeaveList />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/sick-leaves/create/:examinationId"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <SickLeaveForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/sick-leaves/edit/:id"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <SickLeaveForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/statistics"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <MedicalStatistics />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/dashboard/gp-patients/:doctorId"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <GPPatientsPage />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/doctor/dashboard/:doctorId/examination-list"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <DoctorExaminationsList />
                </PrivateRoute>
              }
            />

            <Route
              path="/doctor/dashboard/examination/:examinationId/edit"
              element={
                <PrivateRoute authorities={["ROLE_DOCTOR"]}>
                  <EditExamination />
                </PrivateRoute>
              }
            />

            {/* Patient Dashboard */}
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute authorities={["ROLE_PATIENT"]}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />

            {/* Patient Sick Leave Routes (View Only) */}
            <Route
              path="/patient/dashboard/sick-leaves"
              element={
                <PrivateRoute authorities={["ROLE_PATIENT"]}>
                  <SickLeaveList />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;