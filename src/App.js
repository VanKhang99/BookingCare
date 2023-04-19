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
  Profile,
  System,
  ConfirmBooking,
  PackageDetail,
  Packages,
  PackageClinic,
  ProtectedRoute,
  SharedLayout,
} from "./pages";
import {
  UserManage,
  DoctorManage,
  ScheduleWrapper,
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

          <Route
            path={`${path.CONFIRM_BOOKING}/token=:token&doctorId=:doctorId`}
            element={<ConfirmBooking />}
          />

          <Route
            path={`${path.CONFIRM_BOOKING}/token=:token&packageId=:packageId`}
            element={<ConfirmBooking />}
          />

          {/* NORMAL ROUTE */}
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

            {/* <Route path={path.ERROR} element={<Navigate to="/" replace />} /> */}
          </Route>

          {/* USER ACCOUNT ROUTE */}
          <Route
            path={path.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ADMIN-SYSTEM */}
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

            <Route path="clinic-manage" element={<ClinicManage />} />
            <Route path="clinic-specialty-manage" element={<ClinicSpecialtyManage />} />

            <Route path="specialty-manage" element={<SpecialtyManage />} />

            <Route path="handbook-manage" element={<HandBookManage />} />

            <Route path="package-type" element={<CategoryManage />} />
            <Route path="package-manage" element={<PackageManage />} />
            <Route path="package-schedule" element={<ScheduleWrapper scheduleOf="package" />} />

            <Route path="allcode-manage" element={<AllcodeManage />} />
          </Route>
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
