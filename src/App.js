import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Home,
  Specialties,
  DetailSpecialty,
  Clinics,
  DetailClinic,
  ClinicCarouselMore,
  ClinicSpecialties,
  DetailClinicSpecialty,
  Doctors,
  DetailDoctor,
  DetailCategory,
  Login,
  Register,
  Support,
  System,
  VerifyBooking,
  PackageDetail,
  Packages,
  PackageClinic,
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
  CategoryManage,
  PackageManage,
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
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />

          <Route path="/" element={<SharedLayout clientInterface={1} />}>
            <Route index element={<Home />} />

            <Route path={path.SPECIALTIES} element={<Specialties remote={0} />} />
            <Route path={`${path.SPECIALTIES}/:specialtyId`} element={<DetailSpecialty remote={0} />} />
            <Route path={`${path.SPECIALTIES}/${path.REMOTE}`} element={<Specialties remote={1} />} />
            <Route
              path={`${path.SPECIALTIES}/${path.REMOTE}/:specialtyId`}
              element={<DetailSpecialty remote={1} />}
            />

            <Route path={`${path.CLINIC}s`} element={<Clinics />} />
            <Route path={`${path.CLINIC}/:clinicId`} element={<DetailClinic />} />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.DOCTOR}s`}
              element={<ClinicCarouselMore pageClinicDoctors={1} />}
            />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.DOCTOR}/:doctorId`}
              element={<DetailDoctor remote={0} />}
            />

            <Route
              path={`${path.CLINIC}/:clinicId/${path.PACKAGE}s`}
              element={<ClinicCarouselMore pageClinicDoctors={0} />}
            />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.PACKAGE}s/:packageId`}
              element={<PackageDetail packageOfClinic={1} />}
            />
            <Route path={`${path.CLINIC}/:clinicId/${path.SPECIALTIES}`} element={<ClinicSpecialties />} />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.SPECIALTIES}/:specialtyId`}
              element={<DetailClinicSpecialty />}
            />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.SPECIALTIES}/:specialtyId/${path.PACKAGE}s`}
              element={<ClinicCarouselMore packageClinicSpecialty={1} />}
            />
            <Route
              path={`${path.CLINIC}/:clinicId/${path.SPECIALTIES}/:specialtyId/${path.PACKAGE}s/:packageId`}
              element={<PackageDetail />}
            />

            <Route path={`${path.DOCTOR}s`} element={<Doctors remote={0} />} />
            <Route path={`${path.DOCTOR}/:id`} element={<DetailDoctor remote={0} />} />
            <Route path={`${path.DOCTOR}/${path.REMOTE}/:id`} element={<DetailDoctor remote={1} />} />

            <Route path={`${path.PACKAGE}s`} element={<Packages />} />
            <Route path={`${path.PACKAGE}s/:packageId`} element={<PackageDetail />} />
            <Route path={`${path.PACKAGE_CLINIC}/:packageId`} element={<PackageDetail />} />
            <Route path={`${path.PACKAGE}s/${path.CLINIC}s`} element={<Clinics />} />
            <Route path={`${path.PACKAGE}s/${path.CLINIC}s/:clinicId`} element={<PackageClinic />} />
            <Route path={`${path.PACKAGE}s/${path.CLINIC}/:clinicId`} element={<PackageClinic />} />
            <Route path={`${path.PACKAGE}s/${path.CATEGORIES}/:categoryId`} element={<DetailCategory />} />

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
          </Route>

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
            <Route path="doctor-schedule-manage" element={<ScheduleWrapper scheduleOf="doctor" />} />
            <Route path="patient-booking-manage" element={<PatientBooking />} />

            <Route path="clinic-manage" element={<ClinicManage />} />
            <Route path="clinic-specialty-manage" element={<ClinicSpecialtyManage />} />

            <Route path="specialty-manage" element={<SpecialtyManage />} />

            <Route path="handbook-manage" element={<HandBookManage />} />

            <Route path="package-type" element={<CategoryManage />} />
            <Route path="package-manage" element={<PackageManage />} />
            <Route path="package-schedule" element={<ScheduleWrapper scheduleOf="package" />} />

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
