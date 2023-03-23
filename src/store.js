import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import appReducer from "./slices/appSlice";
import doctorReducer from "./slices/doctorSlice";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
import specialtyReducer from "./slices/specialtySlice";
import clinicReducer from "./slices/clinicSlice";
import clinicSpecialtyReducer from "./slices/clinicSpecialtySlice";
import allcodeReducer from "./slices/allcodeSlice";
import categoryReducer from "./slices/categorySlice";
import packageReducer from "./slices/packageSlice";
import scheduleReducer from "./slices/scheduleSlice";

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  doctor: doctorReducer,
  booking: bookingReducer,
  specialty: specialtyReducer,
  clinic: clinicReducer,
  clinicSpecialty: clinicSpecialtyReducer,
  allcode: allcodeReducer,
  category: categoryReducer,
  package: packageReducer,
  schedule: scheduleReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
