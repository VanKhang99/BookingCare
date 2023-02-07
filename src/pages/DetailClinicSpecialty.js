import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useFetchDataBaseId } from "../utils/CustomHook";
import { getInfoClinic } from "../slices/clinicSlice";
import { getSpecialtyOfClinic } from "../slices/clinicSpecialtySlice";
import { useInView, InView } from "react-intersection-observer";
import { Link as LinkScroll } from "react-scroll";
import { MdLocationOn } from "react-icons/md";
import "../styles/DetailClinic.scss";
import {
  Header,
  Footer,
  BookingCareIntro,
  BookingCareBenefit,
  ClinicBooking,
  ClinicTopic,
} from "../components";

const initialState = {
  navigatorList: [],
  specialty: {},
  clinicData: {},
};

const DetailClinicSpecialty = () => {
  const [state, setState] = useState({ ...initialState });
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-120px",
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicId, specialtyId } = useParams();

  const handleFetchData = async (clinicId, specialtyId) => {
    try {
      let specialty, clinicData;
      specialty = await dispatch(getSpecialtyOfClinic({ clinicId, specialtyId }));
      if (!_.isEmpty(specialty.payload.data)) {
        clinicData = await dispatch(getInfoClinic(clinicId));
        if (!_.isEmpty(clinicData.payload.data)) {
          handleNavigator(specialty.payload.data, clinicData.payload.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigator = (dataSpecialty, clinicData) => {
    let navigatorList = [];
    const entries = Object.entries(dataSpecialty)
      .filter(([key]) => key.endsWith("HTML"))
      .filter(([, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "bookingHTML":
            return language === "vi" ? "Đặt lịch khám" : "Booking";
          case "introductionHTML":
            return language === "vi" ? "Giới thiệu" : "Introduction";
          case "examAndTreatmentHTML":
            return language === "vi" ? "Khám và điều trị" : "Examination and Treatment";
          case "strengthsHTML":
            return language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength";
          default:
            return null;
        }
      });

    navigatorList.push(...entries);

    if (clinicData.processHTML) {
      navigatorList.push(language === "vi" ? "Quy trình khám" : "Process");
    }

    if (clinicData.priceHTML) {
      navigatorList.push(language === "vi" ? "Giá khám bệnh" : "Price");
    }

    return setState({ ...state, specialty: dataSpecialty, clinicData, navigatorList: [...navigatorList] });
  };

  useEffect(() => {
    if (clinicId && specialtyId) {
      handleFetchData(clinicId, specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_.isEmpty(state.specialty) && !_.isEmpty(state.clinicData)) {
      handleNavigator(state.specialty, state.clinicData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtyId, language]);

  return (
    <div className="clinic-container">
      <div className="clinic-header">
        <Header fixed />
      </div>

      <div className="clinic-content">
        <div className="clinic-top u-wrapper">
          <div
            className="clinic-top__image"
            style={{ backgroundImage: `url(${state.specialty?.image || state.clinicData?.image})` }}
          ></div>

          <InView>
            <div className="top-info" ref={ref}>
              <div className="top-info-left">
                <img src={state.clinicData?.logo} alt={state.clinicData.nameClinicData?.valueVi} />
                <div className="more-info">
                  <span className="more-info__name">
                    {language === "vi"
                      ? `${state.specialty?.nameSpecialty?.valueVi} - ${state.clinicData?.nameClinicData?.valueVi}`
                      : `${state.specialty?.nameSpecialty?.valueEn} - ${state.clinicData?.nameClinicData?.valueEn}`}
                  </span>
                  <div className="more-info__address">
                    <MdLocationOn />
                    <span>{state.specialty?.address}</span>
                  </div>
                </div>
              </div>
              <div className="top-info-right">
                <LinkScroll
                  activeClass="active"
                  className="button"
                  to={language === "vi" ? "Đặt lịch khám" : "Booking"}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-120}
                >
                  {t("button.booking-examination")}
                </LinkScroll>
              </div>
            </div>
          </InView>
        </div>

        <div className={`clinic-navigator ${inView ? "" : "fixed"}`}>
          <ul className="navigator-list">
            {state.navigatorList?.length > 0 &&
              state.navigatorList.map((item, index) => {
                return (
                  <li key={index} className="navigator-list__item">
                    <LinkScroll
                      activeClass="active"
                      className="navigator-list__item--scroll"
                      to={item}
                      spy={true}
                      smooth={true}
                      duration={500}
                      offset={-120}
                    >
                      {item.toUpperCase()}
                    </LinkScroll>
                  </li>
                );
              })}
          </ul>
        </div>

        {!_.isEmpty(state.clinicData) && !_.isEmpty(state.specialty) && (
          <div className="clinic-body u-wrapper">
            <BookingCareIntro />
            <BookingCareBenefit html={state.clinicData.noteHTML} />
            {state.specialty.bookingHTML && (
              <ClinicBooking
                title={language === "vi" ? "Đặt lịch khám" : "Booking"}
                clinicId={state.clinicData.clinicId}
                pageClinicSpecialty={true}
                specialtyId={specialtyId}
              />
            )}
            {state.specialty.introductionHTML && (
              <ClinicTopic
                html={state.specialty.introductionHTML}
                title={language === "vi" ? "Giới thiệu" : "Introduction"}
                clinicId={state.clinicData.clinicId}
              />
            )}

            {state.specialty.examAndTreatmentHTML && (
              <ClinicTopic
                html={state.specialty.examAndTreatmentHTML}
                title={language === "vi" ? "Khám và điều trị" : "Examination and Treatment"}
                clinicId={state.clinicData.clinicId}
              />
            )}

            {state.specialty.strengthsHTML && (
              <ClinicTopic
                html={state.specialty.strengthsHTML}
                title={language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength"}
                clinicId={state.clinicData.clinicId}
              />
            )}

            {state.clinicData.processHTML && (
              <ClinicTopic
                html={state.clinicData.processHTML}
                title={language === "vi" ? "Quy trình khám" : "Process"}
                clinicId={state.clinicData.clinicId}
              />
            )}
            {state.clinicData.priceHTML && (
              <ClinicTopic
                html={state.clinicData.priceHTML}
                title={language === "vi" ? "Giá khám bệnh" : "Price"}
                clinicId={state.clinicData.clinicId}
              />
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DetailClinicSpecialty;
