import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
import appReducer from "./slices/appSlice";
import doctorReducer from "./slices/doctorSlice";
import userReducer from "./slices/userSlice";
import bookingReducer from "./slices/bookingSlice";
// import specialtyReducer from "./slices/specialtySlice";
import clinicReducer from "./slices/clinicSlice";
import clinicSpecialtyReducer from "./slices/clinicSpecialtySlice";
import allcodeReducer from "./slices/allcodeSlice";
import packageReducer from "./slices/packageSlice";
import scheduleReducer from "./slices/scheduleSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    user: userReducer,
    doctor: doctorReducer,
    booking: bookingReducer,
    // specialty: specialtyReducer,
    clinic: clinicReducer,
    clinicSpecialty: clinicSpecialtyReducer,
    allcode: allcodeReducer,
    package: packageReducer,
    schedule: scheduleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import thunk from "redux-thunk";

// const reducers = combineReducers({
//   app: appReducer,
//   user: userReducer,
//   system: systemReducer,
//   userRedux: userReduxReducer,
// });

// const persistConfig = {
//   storage,
//   stateReconciler: autoMergeLevel2,
//   key: 'root',
//   version: 1,
// };

// const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: persistedReducer,
//   devTools: process.env.NODE_ENV !== "production",
//   middleware: [thunk],
// });

// export const persistor = persistStore(store);
