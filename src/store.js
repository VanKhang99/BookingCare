import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import appReducer from "./slices/appSlice";
import doctorReducer from "./slices/doctorSlice";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import specialtyReducer from "./slices/specialtySlice";
import clinicReducer from "./slices/clinicSlice";
import clinicSpecialtyReducer from "./slices/clinicSpecialtySlice";
import allcodeReducer from "./slices/allcodeSlice";
import packageTypeReducer from "./slices/packageTypeSlice";
import packageReducer from "./slices/packageSlice";
import scheduleReducer from "./slices/scheduleSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
    specialty: specialtyReducer,
    clinic: clinicReducer,
    clinicSpecialty: clinicSpecialtyReducer,
    allcode: allcodeReducer,
    packageType: packageTypeReducer,
    package: packageReducer,
    schedule: scheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
