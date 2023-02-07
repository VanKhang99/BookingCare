import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getInfoClinic } from "../slices/clinicSlice";
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
};

const DetailClinic = () => {
  const [state, setState] = useState({ ...initialState });
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-120px",
  });
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicId } = useParams();
  const dataClinic = useFetchDataBaseId(clinicId ? clinicId : "", "clinic", getInfoClinic);

  const handleNavigator = (data) => {
    const entries = Object.entries(data).filter((entry) => entry[0].endsWith("HTML"));
    let navigatorList = [];

    entries.forEach((entry) => {
      if (entry[0] === "bookingHTML" && entry[1]) {
        if (data.haveSpecialtyPage === 0) {
          navigatorList.push(`${language === "vi" ? "Đặt lịch khám" : "Booking"}`);
        }
      } else if (entry[0] === "introductionHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Giới thiệu" : "Introduction"}`);
      } else if (entry[0] === "strengthsHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength"}`);
      } else if (entry[0] === "equipmentHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Trang thiết bị" : "Equipment"}`);
      } else if (entry[0] === "locationHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Vị trí" : "Location"}`);
      } else if (entry[0] === "processHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Quy trình khám" : "Process"}`);
      } else if (entry[0] === "priceHTML" && entry[1]) {
        navigatorList.push(`${language === "vi" ? "Giá khám bệnh" : "Price"}`);
      }
    });

    return setState({ ...state, navigatorList: [...navigatorList] });
  };

  useEffect(() => {
    if (!_.isEmpty(dataClinic)) {
      handleNavigator(dataClinic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataClinic, language]);

  return (
    <div className="clinic-container">
      <div className="clinic-header">
        <Header fixed />
      </div>

      <div className="clinic-content">
        <div className="clinic-top u-wrapper">
          <div className="clinic-top__image" style={{ backgroundImage: `url(${dataClinic?.image})` }}></div>

          <InView>
            <div className="top-info" ref={ref}>
              <div className="top-info-left">
                <img src={dataClinic?.logo} alt={dataClinic.nameClinicData?.valueVi} />
                <div className="more-info">
                  <span className="more-info__name">
                    {language === "vi"
                      ? dataClinic?.nameClinicData?.valueVi
                      : dataClinic?.nameClinicData?.valueEn}
                  </span>
                  <div className="more-info__address">
                    <MdLocationOn />
                    <span>{dataClinic?.address}</span>
                  </div>
                </div>
              </div>
              <div className="top-info-right">
                {dataClinic.haveSpecialtyPage ? (
                  <Link to={`/clinics/${clinicId}/specialties`}> {t("button.booking-examination")}</Link>
                ) : (
                  <LinkScroll
                    activeClass="active"
                    className="button"
                    to={language === "vi" ? "Đặt lịch khám" : "Booking"}
                    spy={true}
                    smooth={true}
                    duration={500}
                    offset={-160}
                  >
                    {t("button.booking-examination")}
                  </LinkScroll>
                )}
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

            {dataClinic?.haveSpecialtyPage !== 0 && (
              <li className="navigator-list__item navigator-list__item--specialty">
                <Link to={`/clinics/${clinicId}/specialties`}>
                  {language === "vi" ? "Chọn chuyên khoa" : "Choose specialty"}
                </Link>
              </li>
            )}
          </ul>
        </div>

        {!_.isEmpty(dataClinic) && (
          <div className="clinic-body u-wrapper">
            <BookingCareIntro />
            <BookingCareBenefit html={dataClinic.noteHTML} />
            {dataClinic.haveSpecialtyPage === 1 || (
              <ClinicBooking
                title={language === "vi" ? "Đặt lịch khám" : "Booking"}
                clinicId={dataClinic.clinicId}
                // onToggleModal={handleModal}
              />
            )}
            {dataClinic.introductionHTML && (
              <ClinicTopic
                html={dataClinic.introductionHTML}
                title={language === "vi" ? "Giới thiệu" : "Introduction"}
                clinicId={dataClinic.clinicId}
              />
            )}
            {dataClinic.strengthsHTML && (
              <ClinicTopic
                html={dataClinic.strengthsHTML}
                title={language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength"}
                clinicId={dataClinic.clinicId}
              />
            )}
            {dataClinic.equipmentHTML && (
              <ClinicTopic
                html={dataClinic.equipmentHTML}
                title={language === "vi" ? "Trang thiết bị" : "Equipment"}
                clinicId={dataClinic.clinicId}
              />
            )}
            {dataClinic.locationHTML && (
              <ClinicTopic
                html={dataClinic.locationHTML}
                title={language === "vi" ? "Vị trí" : "Location"}
                clinicId={dataClinic.clinicId}
              />
            )}
            {dataClinic.processHTML && (
              <ClinicTopic
                html={dataClinic.processHTML}
                title={language === "vi" ? "Quy trình khám" : "Process"}
                clinicId={dataClinic.clinicId}
              />
            )}
            {dataClinic.priceHTML && (
              <ClinicTopic
                html={dataClinic.priceHTML}
                title={language === "vi" ? "Giá khám bệnh" : "Price"}
                clinicId={dataClinic.clinicId}
              />
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DetailClinic;
