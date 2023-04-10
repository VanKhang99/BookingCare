import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { HiArrowSmRight } from "react-icons/hi";
import "../../styles/MedicalAppointmentHistory.scss";

const MedicalAppointmentHistory = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { language } = useSelector((store) => store.app);

  return (
    <div className="medical-appointment-history">
      <h2 className="profile-heading">{t("profile.medical-appointment-history")}</h2>

      <div className="appointment-history-list">
        <div className="appointment-history-item">
          <h3 className="appointment-history-item__title">Thông tin về lịch khám</h3>

          <ol className="appointment-info-list">
            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Email
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Khung giờ khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bác sĩ
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bệnh viện
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Ngày đặt lịch
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Lý do đặt lịch khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Tình trạng
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>
          </ol>
        </div>

        <div className="appointment-history-item">
          <h3 className="appointment-history-item__title">Thông tin về lịch khám</h3>

          <ol className="appointment-info-list">
            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Email
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Khung giờ khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bác sĩ
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bệnh viện
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Ngày đặt lịch
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Lý do đặt lịch khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Tình trạng
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>
          </ol>
        </div>

        <div className="appointment-history-item">
          <h3 className="appointment-history-item__title">Thông tin về lịch khám</h3>

          <ol className="appointment-info-list">
            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Email
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Khung giờ khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bác sĩ
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Bệnh viện
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Ngày đặt lịch
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Lý do đặt lịch khám
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>

            <li className="appointment-info-item">
              <span className="appointment-info-item__label">
                <HiArrowSmRight />
                Tình trạng
              </span>
              <span className="appointment-info-item__data">: test@gmail.com</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MedicalAppointmentHistory;
