import React from "react";
import { Link } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { MdLocationOn } from "react-icons/md";
import "../styles/ClinicTop.scss";

const ClinicTop = ({ refObserver, dataClinic, clinicId, clinicCarouselMore }) => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  return (
    <>
      <div className="clinic-top u-wrapper">
        <div className="clinic-top__image">
          <div className="clinic-top__image" style={{ backgroundImage: `url(${dataClinic.imageUrl})` }}></div>
        </div>
        <div className="top-info" ref={refObserver}>
          <div className="top-info-left">
            <img src={dataClinic.logoUrl} alt={dataClinic.nameVi} />
            <div className="more-info">
              <span className="more-info__name">
                {language === "vi" ? dataClinic.nameVi : dataClinic.nameEn}
              </span>
              <div className="more-info__address">
                <MdLocationOn />
                <span>{dataClinic?.address}</span>
              </div>
            </div>
          </div>
          <div className="top-info-right">
            {dataClinic.haveSpecialtyPage ? (
              <Link to={`/clinic/${+clinicId}/specialties`}> {t("button.booking-examination")}</Link>
            ) : (
              <LinkScroll
                activeClass="active"
                className="button"
                to={language === "vi" ? "Đặt lịch khám" : "Booking"}
                spy={true}
                smooth={true}
                duration={500}
                offset={clinicCarouselMore ? -100 : -160}
              >
                {t("button.booking-examination")}
              </LinkScroll>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicTop;
