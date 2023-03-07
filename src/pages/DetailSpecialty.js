import React, { useState, useEffect, useMemo } from "react";
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
  doctors: [],
  doctorId: "",
  doctorData: {},
};

const DetailSpecialty = ({ remote }) => {
  const [state, setState] = useState({ ...initialState });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { specialtyId } = useParams();
  const { language } = useSelector((store) => store.app);

  const doctorsFilter = useMemo(async () => {
    const res = await dispatch(
      getAllDoctorsById({
        nameColumnMap: "specialtyId",
        id: +specialtyId,
        typeRemote: "includeOnlyFalse",
      })
    );

    if (res?.payload?.data.doctors.length > 0) return res.payload.data.doctors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      return setState({
        ...state,
        specialtyData: { ...data[0].payload.data },
        doctors: data[1].payload.status === "error" ? [] : [...data[1].payload.data.doctors],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowMoreDataIntro = () => {
    return setState({ ...state, isOpenFullIntro: !state.isOpenFullIntro });
  };

  const handleModal = async (hourClicked, doctorId = null, packageId = null) => {
    // (Why get doctorId)
    //pass DoctorId --> Doctor --> BookingHours
    /// --> Run function (handleClick) to get "doctorId" pass reverse to parentComponent
    ////////via function handleModal --> run get dataDoctor and price to ModalBooking

    try {
      const res = await dispatch(getDoctor(+doctorId));

      if (res?.payload?.data) {
        return setState({
          ...state,
          doctorData: res.payload.data,
          doctorId,
          isOpenModalBooking: !state.isOpenModalBooking,
          hourClicked: { ...hourClicked },
        });
      }

      return setState({
        ...state,
        isOpenModalBooking: !state.isOpenModalBooking,
        hourClicked: { ...hourClicked },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProvinceChange = async (option) => {
    console.log(option);
    const doctorsCopy = await doctorsFilter;
    console.log(doctorsCopy);

    if (option.value === "*") {
      return setState({ ...state, doctors: doctorsCopy });
    }

    if (option.value !== "*") {
      const newDoctors = doctorsCopy.filter((doctor) => doctor.provinceData.keyMap === option.value);
      return setState({ ...state, doctors: newDoctors });
    }
  };

  useEffect(() => {
    if (specialtyId) {
      handleFetchData(specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="specialty-container">
      <div className="specialty">
        <div className="specialty-content ">
          <div className="specialty-intro">
            <IntroSpecialty
              isOpenFullIntro={state.isOpenFullIntro}
              specialtyData={state.specialtyData}
              onShowMoreDataIntro={handleShowMoreDataIntro}
              remote={remote}
            />
          </div>

          <div className="specialty-doctors">
            <div className="u-wrapper">
              <h2 className="specialty-doctors__title">
                {language === "vi" ? "Các bác sĩ chuyên khoa" : "Specialties Doctors"}
              </h2>

              <ProvinceOptions
                specialtyId={specialtyId ? specialtyId : ""}
                onProvinceChange={handleProvinceChange}
                remote={remote}
              />

              <ul className="doctors">
                {state?.doctors?.length > 0 &&
                  state.doctors.map((doctor, index) => {
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
          show={state.isOpenModalBooking}
          onHide={handleModal}
          doctorId={state.doctorId}
          doctorData={dataModalBooking(language, state.doctorData, "doctor")}
          hourClicked={state.hourClicked && !_.isEmpty(state.hourClicked) && state.hourClicked}
          remote={remote}
        />
      </div>
    </div>
  );
};

export default DetailSpecialty;
