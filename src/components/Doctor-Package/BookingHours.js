import React from "react";
import HtmlReactParser from "html-react-parser";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BiError } from "react-icons/bi";
import { FaCalendarAlt, FaVideo } from "react-icons/fa";
import { FaRegHandPointRight } from "react-icons/fa";
import "../../styles/BookingHours.scss";

const BookingHours = ({ schedules, doctorId, packageId, onToggleModal, small, remote }) => {
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  const handleClick = (hourClicked, doctorId = null, packageId = null) => {
    if (doctorId) {
      onToggleModal(hourClicked, doctorId);
    } else {
      onToggleModal(hourClicked, doctorId, packageId);
    }
  };

  return (
    <div className={`booking-hours ${small ? "small" : "col-8"} `}>
      <div className="col-12 booking-hours-title">
        {remote ? <FaVideo /> : <FaCalendarAlt />}
        <span>{remote ? t("detail-doctor.exam-schedule-video") : t("detail-doctor.exam-schedule")}</span>
      </div>
      <div className="booking-hours-list">
        {schedules?.length > 0 ? (
          schedules.map((schedule, index) => {
            return (
              <button
                className="button"
                key={index}
                onClick={() => handleClick(schedule, doctorId, packageId)}
              >
                {language === "vi" ? schedule.timeTypeData.valueVi : schedule.timeTypeData.valueEn}
              </button>
            );
          })
        ) : (
          <div className="booking-hours-list--no-hour">
            <BiError />
            <span>{t("detail-doctor.no-schedule")}</span>
          </div>
        )}
      </div>

      {schedules?.length > 0 && (
        <p className="booking-hours__fee">
          <FaRegHandPointRight />
          <span>{HtmlReactParser(t("detail-doctor.fee"))}</span>
        </p>
      )}
    </div>
  );
};

export default BookingHours;
