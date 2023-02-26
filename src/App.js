import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Home,
  Specialties,
  DetailSpecialty,
  Clinics,
  DetailClinic,
  ClinicSpecialties,
  DetailClinicSpecialty,
  Doctors,
  DetailDoctor,
  MedicalPackage,
  Login,
  Support,
  System,
  VerifyBooking,
  PackageDetail,
  // RemoteExam,
  // MedicalTest,
  // MentalHealth,
  // Dental,
  // PackageSurgery,
  // MedicalProduct,
  // BusinessHealth,
  ProtectedRoute,
  SharedLayout,
} from "./pages";
import {
  // UserManage,
  UserManage,
  DoctorManage,
  ScheduleWrapper,
  PatientBooking,
  ClinicManage,
  ClinicSpecialtyManage,
  SpecialtyManage,
  PackageTypeManage,
  PackageManage,
  PackageSchedule,
  HandBookManage,
  AllcodeManage,
} from "./system";
import { path } from "./utils/constants";
import { setAuthToken } from "./utils/helpers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./i18n";

function App() {
  const token = localStorage.getItem("token");

  if (token) {
    setAuthToken(token);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={path.HOME} element={<Home />} />

          <Route path={path.SPECIALTY} element={<Specialties remote={0} />} />
          <Route path={`${path.SPECIALTY}/${path.REMOTE}`} element={<Specialties remote={1} />} />
          <Route path={`${path.SPECIALTY}/:specialtyId`} element={<DetailSpecialty remote={0} />} />
          <Route
            path={`${path.SPECIALTY}/${path.REMOTE}/:specialtyId`}
            element={<DetailSpecialty remote={1} />}
          />

          <Route path={`${path.CLINIC}s`} element={<Clinics />} />
          <Route path={`${path.CLINIC}/:clinicId`} element={<DetailClinic />} />
          <Route path={`${path.CLINIC}/:clinicId/specialties`} element={<ClinicSpecialties />} />
          <Route
            path={`${path.CLINIC}/:clinicId/specialties/:specialtyId`}
            element={<DetailClinicSpecialty />}
          />

          <Route path={`${path.DOCTOR}s`} element={<Doctors remote={0} />} />
          <Route path={`${path.DOCTOR}/:id`} element={<DetailDoctor remote={0} />} />
          <Route path={`${path.DOCTOR}/${path.REMOTE}/:id`} element={<DetailDoctor remote={1} />} />

          <Route path={path.PACKAGE} element={<MedicalPackage />} />
          <Route path={`${path.PACKAGE_CLINIC}/:packageId`} element={<PackageDetail />} />
          <Route path={`${path.PACKAGE_SPECIALTY}/:packageId`} element={<PackageDetail />} />

          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.SUPPORT} element={<Support />} />
          <Route path={path.ERROR} element={<Navigate to="/" replace />} />
          <Route
            path={`${path.VERIFY_BOOKING}/token=:token&doctorId=:doctorId`}
            element={<VerifyBooking />}
          />
          <Route
            path={`${path.VERIFY_BOOKING}/token=:token&packageId=:packageId`}
            element={<VerifyBooking />}
          />

          <Route
            path={`${path.ADMIN}-${path.SYSTEM}`}
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<System />} />

            <Route path="user-manage" element={<UserManage />} />

            <Route path="doctor-manage" element={<DoctorManage />} />
            <Route path="doctor-schedule-manage" element={<ScheduleWrapper />} />
            <Route path="patient-booking-manage" element={<PatientBooking />} />

            <Route path="clinic-manage" element={<ClinicManage />} />
            <Route path="clinic-specialty-manage" element={<ClinicSpecialtyManage />} />

            <Route path="specialty-manage" element={<SpecialtyManage />} />

            <Route path="handbook-manage" element={<HandBookManage />} />

            <Route path="package-type" element={<PackageTypeManage />} />
            <Route path="package-manage" element={<PackageManage />} />
            <Route path="package-schedule" element={<PackageSchedule />} />

            <Route path="allcode-manage" element={<AllcodeManage />} />
          </Route>

          <Route
            path={`${path.DOCTOR}-${path.SYSTEM}`}
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<System />} />
            <Route path="patient-booking-manage" element={<PatientBooking />} />
            <Route path="schedule-manage" element={<ScheduleWrapper isDoctorAccount={true} />} />
          </Route>

          {/* BANNER */}
          {/* <Route path={path.REMOTEEXAM} element={<RemoteExam />} />
          <Route path={path.MEDICALTEST} element={<MedicalTest />} />
          <Route path={path.MENTALHEALTH} element={<MentalHealth />} />
          <Route path={path.DENTAL} element={<Dental />} />
          <Route path={path.PACKAGESURGERY} element={<PackageSurgery />} />
          <Route path={path.MEDICALPRODUCT} element={<MedicalProduct />} />
          <Route path={path.BUSINESSHEALTH} element={<BusinessHealth />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
