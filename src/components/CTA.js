import React from "react";
import { BsCheck } from "react-icons/bs";
import "../styles/CTA.scss";

const CTA = () => {
  return (
    <section className="cta-container u-background-grey u-border-bottom">
      <div className="cta-content u-wrapper">
        <div className="cta">
          <div className="cta-img"></div>

          <div className="cta-right">
            <h2 className="title">Tải ứng dụng BookingCare</h2>
            <ul className="features">
              <li className="feature">
                <BsCheck /> Đặt khám nhanh hơn
              </li>
              <li className="feature">
                <BsCheck /> Nhận thông báo từ hệ thống
              </li>
              <li className="feature">
                <BsCheck /> Nhận hướng dẫn đi khám chi tiết
              </li>
            </ul>
            <div className="download">
              <a href="https://play.google.com/store/apps/details?id=vn.bookingcare.bookingcare">
                <img src="https://bookingcare.vn/assets/icon/google-play-badge.svg" alt="Google Play" />
              </a>
              <a href="https://apps.apple.com/vn/app/bookingcare/id1347700144">
                <img src="https://bookingcare.vn/assets/icon/app-store-badge-black.svg" alt="Google Play" />
              </a>
            </div>

            <a href="https://bookingcare.vn/app" className="open-link">
              Hoặc mở liên kết: <b>https://bookingcare.vn/app</b>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
