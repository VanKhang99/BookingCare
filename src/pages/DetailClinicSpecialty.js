import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSpecialtyOfClinic } from "../slices/clinicSpecialtySlice";
import { useInView, InView } from "react-intersection-observer";
import { Link as LinkScroll } from "react-scroll";
import { MdLocationOn } from "react-icons/md";
import { BookingCareIntro, BookingCareBenefit, ClinicBooking, ClinicTopic, Loading } from "../components";
import "../styles/DetailClinic.scss";

const initialState = {
  navigatorList: [],
  specialtyData: {},
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
      const res = await dispatch(getSpecialtyOfClinic({ clinicId, specialtyId }));
      if (!_.isEmpty(res.payload.data)) {
        handleNavigator(res.payload.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigator = (specialtyData) => {
    let navigatorList = [];
    const entries = Object.entries(specialtyData)
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

    if (specialtyData.clinicInfo.processHTML) {
      navigatorList.push(language === "vi" ? "Quy trình khám" : "Process");
    }

    if (specialtyData.clinicInfo.priceHTML) {
      navigatorList.push(language === "vi" ? "Giá khám bệnh" : "Price");
    }

    return setState({ ...state, specialtyData, navigatorList: [...navigatorList] });
  };

  useEffect(() => {
    if (clinicId && specialtyId) {
      handleFetchData(clinicId, specialtyId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!_.isEmpty(state.specialtyData)) {
      handleNavigator(state.specialtyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtyId, language]);

  return (
    <>
      <div className="clinic">
        <div className="clinic-content">
          {!_.isEmpty(state.specialtyData) ? (
            <>
              <div className="clinic-top u-wrapper">
                <div
                  className="clinic-top__image"
                  style={{
                    backgroundImage: `url(${
                      state.specialtyData.imageUrl || state.specialtyData.clinicInfo.imageUrl
                    })`,
                  }}
                ></div>

                <InView>
                  <div className="top-info" ref={ref}>
                    <div className="top-info-left">
                      <img
                        src={state.specialtyData.clinicInfo.logoUrl}
                        alt={state.specialtyData.clinicInfo.nameVi}
                      />
                      <div className="more-info">
                        <span className="more-info__name">
                          {language === "vi"
                            ? `${state.specialtyData.specialtyName.nameVi} - ${state.specialtyData.clinicInfo.nameVi}`
                            : `${state.specialtyData.specialtyName.nameEn} - ${state.specialtyData.clinicInfo.nameEn}`}
                        </span>
                        <div className="more-info__address">
                          <MdLocationOn />
                          <span>{state.specialtyData?.address}</span>
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

              <div className="clinic-body u-wrapper">
                <BookingCareIntro />
                <BookingCareBenefit html={state.specialtyData.clinicInfo.noteHTML} />

                {state.specialtyData.bookingHTML && (
                  <ClinicBooking
                    title={language === "vi" ? "Đặt lịch khám" : "Booking"}
                    clinicId={state.specialtyData.clinicId}
                    pageClinicSpecialty={true}
                    specialtyId={state.specialtyData.specialtyId}
                  />
                )}

                {state.specialtyData.introductionHTML && (
                  <ClinicTopic
                    html={state.specialtyData.introductionHTML}
                    title={language === "vi" ? "Giới thiệu" : "Introduction"}
                  />
                )}

                {state.specialtyData.examAndTreatmentHTML && (
                  <ClinicTopic
                    html={state.specialtyData.examAndTreatmentHTML}
                    title={language === "vi" ? "Khám và điều trị" : "Examination and Treatment"}
                  />
                )}

                {state.specialtyData.strengthsHTML && (
                  <ClinicTopic
                    html={state.specialtyData.strengthsHTML}
                    title={language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength"}
                  />
                )}

                {state.specialtyData.clinicInfo.processHTML && (
                  <ClinicTopic
                    html={state.specialtyData.clinicInfo.processHTML}
                    title={language === "vi" ? "Quy trình khám" : "Process"}
                  />
                )}
                {state.specialtyData.clinicInfo.priceHTML && (
                  <ClinicTopic
                    html={state.specialtyData.clinicInfo.priceHTML}
                    title={language === "vi" ? "Giá khám bệnh" : "Price"}
                  />
                )}
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default DetailClinicSpecialty;
