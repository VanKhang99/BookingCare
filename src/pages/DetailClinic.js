import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFetchDataBaseId } from "../utils/CustomHook";
import { getClinic } from "../slices/clinicSlice";
import { useInView, InView } from "react-intersection-observer";
import { Link as LinkScroll } from "react-scroll";
import {
  BookingCareIntro,
  BookingCareBenefit,
  ClinicBooking,
  ClinicTopic,
  ClinicTop,
  Loading,
  ScrollToTop,
} from "../components";
import { path } from "../utils/constants";
import "../styles/DetailClinic.scss";

const DetailClinic = () => {
  const [navigatorList, setNavigatorList] = useState([]);
  const { ref, inView } = useInView({
    root: null,
    threshold: 0,
    rootMargin: "-120px",
  });
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { clinicId } = useParams();
  const dataClinic = useFetchDataBaseId(clinicId ? +clinicId : "", "clinic", getClinic);

  const handleNavigator = (data) => {
    const entries = Object.entries(data).filter((entry) => entry[0].endsWith("HTML"));
    let navigatorList = [];

    entries.forEach((entry) => {
      if (entry[0] === "bookingHTML" && entry[1]) {
        if (!data.haveSpecialtyPage) {
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

    return setNavigatorList([...navigatorList]);
  };

  useEffect(() => {
    if (!_.isEmpty(dataClinic)) {
      handleNavigator(dataClinic);
      document.title = language === "vi" ? dataClinic.nameVi : dataClinic.nameEn;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_.isEmpty(dataClinic), language]);

  return (
    <div className="clinic">
      <div className="clinic-content">
        {!_.isEmpty(dataClinic) ? (
          <>
            <InView>
              <ClinicTop refObserver={ref} clinicId={clinicId} dataClinic={dataClinic} />
            </InView>

            <div className={`clinic-navigator ${inView ? "" : "fixed"}`}>
              <ul className="navigator-list">
                {navigatorList?.length > 0 &&
                  navigatorList.map((item, index) => {
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

                {dataClinic.haveSpecialtyPage && (
                  <li className="navigator-list__item navigator-list__item--specialty">
                    <Link to={`/${path.CLINIC}/${clinicId}/${path.SPECIALTIES}`}>
                      {language === "vi" ? "Chọn chuyên khoa" : "Choose specialty"}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="clinic-body u-wrapper">
              <BookingCareIntro />
              <BookingCareBenefit html={dataClinic.noteHTML} />
              {dataClinic.haveSpecialtyPage || (
                <ClinicBooking
                  title={language === "vi" ? "Đặt lịch khám" : "Booking"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.introductionHTML && (
                <ClinicTopic
                  html={dataClinic.introductionHTML}
                  title={language === "vi" ? "Giới thiệu" : "Introduction"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.strengthsHTML && (
                <ClinicTopic
                  html={dataClinic.strengthsHTML}
                  title={language === "vi" ? "Thế mạnh cạnh tranh" : "Competitive strength"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.equipmentHTML && (
                <ClinicTopic
                  html={dataClinic.equipmentHTML}
                  title={language === "vi" ? "Trang thiết bị" : "Equipment"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.locationHTML && (
                <ClinicTopic
                  html={dataClinic.locationHTML}
                  title={language === "vi" ? "Vị trí" : "Location"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.processHTML && (
                <ClinicTopic
                  html={dataClinic.processHTML}
                  title={language === "vi" ? "Quy trình khám" : "Process"}
                  clinicId={dataClinic.id}
                />
              )}
              {dataClinic.priceHTML && (
                <ClinicTopic
                  html={dataClinic.priceHTML}
                  title={language === "vi" ? "Giá khám bệnh" : "Price"}
                  clinicId={dataClinic.id}
                />
              )}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default DetailClinic;
