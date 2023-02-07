import React from "react";
import { FaLightbulb } from "react-icons/fa";
import "../styles/BookingCareIntro.scss";

const BookingCareIntro = () => {
  return (
    <div className="BC-intro">
      <FaLightbulb />
      <span className="BC-intro__statistic">
        BookingCare là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng đầu Việt Nam kết nối người dùng với trên
        150 bệnh viện - phòng khám uy tín, hơn 1,000 bác sĩ chuyên khoa giỏi và hàng nghìn dịch vụ, sản phẩm y
        tế chất lượng cao.
      </span>
    </div>
  );
};

export default BookingCareIntro;
