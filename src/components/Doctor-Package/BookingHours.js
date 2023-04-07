import React, { useState } from "react";
import HtmlReactParser from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { BiError } from "react-icons/bi";
import { FaCalendarAlt, FaVideo } from "react-icons/fa";
import { FaRegHandPointRight } from "react-icons/fa";
import { autoNavigateToLoginAndBack } from "../../slices/userSlice";
import "../../styles/BookingHours.scss";

const BookingHours = ({ schedules, doctorId, packageId, onToggleModal, small, remote }) => {
  const [isModalToLoginOpen, setIsModalToLoginOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);
  const { isLoggedIn } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const handleClick = (hourClicked, doctorId = null, packageId = null) => {
    if (!isLoggedIn) {
      return setIsModalToLoginOpen(true);
    }

    if (doctorId) {
      onToggleModal(hourClicked, +doctorId);
    } else {
      onToggleModal(hourClicked, +doctorId, +packageId);
    }
  };

  const handleOk = () => {
    setIsModalToLoginOpen(false);
    dispatch(autoNavigateToLoginAndBack(window.location.pathname));
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleCancel = () => {
    setIsModalToLoginOpen(false);
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

      {isModalToLoginOpen && (
        <div className="modal-navigate-to-login">
          <Modal
            title={language === "vi" ? "Yêu cầu đăng nhập" : "Requires login"}
            centered
            open={isModalToLoginOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>
              {language === "vi"
                ? "Bạn phải đăng nhập tài khoản trước khi tiến hành đặt lịch khám bệnh!"
                : "You must log in to your account before you can make an appointment!"}
            </p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default BookingHours;
