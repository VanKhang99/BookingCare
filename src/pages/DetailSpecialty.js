import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getInfoSpecialty } from "../slices/specialtySlice";
import { dataModalBooking } from "../utils/helpers";
import { getDoctor, getAllDoctorsById } from "../slices/doctorSlice";

import { IntroSpecialty, Doctor, ModalBooking, ProvinceOptions, RoleBookingCare } from "../components";
import "../styles/DetailSpecialty.scss";

const initialState = {
  specialtyData: {},
  isOpenFullIntro: false,
  isOpenModalBooking: false,
  hourBooked: {},
  doctorId: "",
  doctorData: {},
  doctors: [],
  doctorsToFilter: [],
};

const DetailSpecialty = ({ remote }) => {
  const [specialtyState, setSpecialtyState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { specialtyId } = useParams();
  const { language } = useSelector((store) => store.app);

  const handleFetchData = async (id) => {
    try {
      const data = await Promise.all([
        dispatch(getInfoSpecialty(+id)),
        dispatch(
          getAllDoctorsById({
            nameColumnMap: "specialtyId",
            id: +id,
            typeRemote: remote ? "includeOnlyTrue" : "includeOnlyFalse",
          })
        ),
      ]);

      return setSpecialtyState({
        ...specialtyState,
        specialtyData: { ...data[0].payload.data },
        doctors: data[1].payload.status === "error" ? [] : [...data[1].payload.data.doctors],
        doctorsToFilter: data[1].payload.status === "error" ? [] : [...data[1].payload.data.doctors],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMoreDataIntro = () => {
    return setSpecialtyState({ ...specialtyState, isOpenFullIntro: !specialtyState.isOpenFullIntro });
  };

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking

    try {
      if (!doctorId)
        return setSpecialtyState({
          ...specialtyState,
          isOpenModalBooking: !specialtyState.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });

      const res = await dispatch(getDoctor(+doctorId));
      if (res?.payload?.data) {
        return setSpecialtyState({
          ...specialtyState,
          doctorData: res.payload.data,
          doctorId,
          isOpenModalBooking: !specialtyState.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProvinceChange = async (option) => {
    if (option.value === "*") {
      return setSpecialtyState({ ...specialtyState, doctors: specialtyState.doctorsToFilter });
    }

    if (option.value !== "*") {
      const newDoctors = specialtyState.doctorsToFilter.filter(
        (doctor) => doctor.provinceData.keyMap === option.value
      );
      return setSpecialtyState({ ...specialtyState, doctors: newDoctors });
    }
  };

  useEffect(() => {
    if (specialtyId) {
      handleFetchData(specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_.isEmpty(specialtyState.specialtyData)) {
      document.title =
        language === "vi"
          ? `${specialtyState.specialtyData.nameVi} ${remote ? "từ xa" : ""}`
          : `${remote ? "Remote" : ""} ${specialtyState.specialtyData.nameEn} `;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, _.isEmpty(specialtyState.specialtyData)]);

  return (
    <div className="specialty-container">
      <div className="specialty">
        <div className="specialty-content ">
          <div className="specialty-intro">
            <IntroSpecialty
              isOpenFullIntro={specialtyState.isOpenFullIntro}
              specialtyData={specialtyState.specialtyData}
              onShowMoreDataIntro={handleShowMoreDataIntro}
              remote={remote}
            />
          </div>

          <div className="specialty-doctors">
            <div className="u-wrapper">
              <h2 className="specialty-doctors__title">
                {language === "vi" ? "Các bác sĩ chuyên khoa" : "Specialties Doctors"}
              </h2>

              {specialtyState.doctors.length > 0 && (
                <>
                  <ProvinceOptions
                    specialtyId={specialtyId ? specialtyId : ""}
                    onProvinceChange={handleProvinceChange}
                    remote={remote}
                  />
                </>
              )}

              <ul className="doctors">
                {specialtyState?.doctors?.length > 0 &&
                  specialtyState.doctors.map((doctor, index) => {
                    const doctorId = doctor.doctorId;
                    return (
                      <Doctor
                        key={index}
                        doctorId={doctorId}
                        doctorData={doctor}
                        onToggleModal={handleModal}
                        needAddress={remote ? false : true}
                        assurance={remote ? false : true}
                        remote={remote}
                      />
                    );
                  })}
              </ul>
            </div>
          </div>
          <RoleBookingCare />
        </div>

        <div className="specialty-footer">
          <div className="more-explore">
            <p className="u-wrapper">
              {t("detail-specialty.explore-more")} <a href="#"> {t("detail-specialty.see-question")} </a>
            </p>
          </div>
        </div>
      </div>

      <div className="modal-booking">
        <ModalBooking
          show={specialtyState.isOpenModalBooking}
          onHide={handleModal}
          doctorId={specialtyState.doctorId}
          doctorData={dataModalBooking(language, specialtyState.doctorData, "doctor")}
          hourClicked={
            specialtyState.hourClicked && !_.isEmpty(specialtyState.hourClicked) && specialtyState.hourClicked
          }
          remote={remote}
        />
      </div>
    </div>
  );
};

export default DetailSpecialty;
