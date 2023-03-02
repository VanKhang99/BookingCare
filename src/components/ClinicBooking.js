import React, { useState, useEffect } from "react";
import _ from "lodash";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { Element } from "react-scroll";
import { Slider, Doctor, Package, ModalBooking } from "../components";
import { getDetailDoctor, getDoctorsBaseKeyMap } from "../slices/doctorSlice";
import { getPackage } from "../slices/packageSlice";
import "../styles/ClinicBooking.scss";

const initialState = {
  doctorId: "",
  packageId: "",
  isOpenModalBooking: false,
  hourClicked: {},
  doctorData: {},
  packageData: {},
};

const ClinicBooking = ({ title, clinicId, pageClinicSpecialty, specialtyId }) => {
  const [state, setState] = useState({ ...initialState });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const doctors = useFetchDataBaseId(clinicId, "doctors", getDoctorsBaseKeyMap, 0);

  const handleModal = async (hourClicked, doctorId, packageId) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to DetailClinic
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking

    try {
      let res;
      if (doctorId && !packageId) {
        res = await dispatch(getDetailDoctor(+doctorId));

        if (res?.payload?.data) {
          return setState({
            ...state,
            doctorData: res.payload.data,
            packageData: null,
            doctorId,
            packageId: null,
            isOpenModalBooking: !state.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      if (packageId && !doctorId) {
        res = await dispatch(getPackage(packageId));
        if (res?.payload?.data) {
          const pk = res.payload.data;
          console.log(pk);
          const dataPackageModal = {
            nameEn: pk.nameEn,
            nameVi: pk.nameVi,
            image: pk.clinicData.logo,
            price: pk.pricePackage,
            clinicName: pk.clinicName,
          };

          return setState({
            ...state,
            packageData: dataPackageModal,
            doctorData: null,
            packageId,
            doctorId: null,
            isOpenModalBooking: !state.isOpenModalBooking,
            hourClicked: { ...hourClicked },
          });
        }
      }

      return setState({ ...state, isOpenModalBooking: !state.isOpenModalBooking });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Element name={title}>
      <div className="clinic-booking">
        <h2 className="clinic-booking__title u-clinic-title">{title}</h2>
        <div className="clinic-booking-content">
          <div className="doctors">
            {!pageClinicSpecialty && <h3 className="doctors__title">Bác sĩ</h3>}

            <ul className="doctors-list">
              {doctors?.length > 0 &&
                doctors.map((doctor, index) => {
                  const { doctorId } = doctor;
                  return (
                    <Doctor key={index} doctorId={doctorId} doctorData={doctor} onToggleModal={handleModal} />
                  );
                })}
            </ul>
          </div>
          <div className="packages">
            {!pageClinicSpecialty && <h3 className="packages__title">Gói khám bệnh</h3>}

            <Slider
              mainTitle="Bác sĩ"
              buttonText={t("button.see-more").toUpperCase()}
              clinicSpecialtyDoctor="clinic-specialty-doctor"
              clinicId={clinicId}
              specialtyId={specialtyId}
            />
          </div>
        </div>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={state.isOpenModalBooking}
          onHide={() => handleModal()}
          doctorId={state.doctorId ? state.doctorId : ""}
          packageId={state.packageId ? state.packageId : ""}
          doctor={state.doctorData ? state.doctorData : {}}
          packageData={state.packageData ? state.packageData : {}}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
        />
      </div>
    </Element>
  );
};

export default ClinicBooking;
