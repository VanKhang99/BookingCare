import React, { useState } from "react";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import "../styles/RoleBookingCare.scss";

const RoleBookingCare = () => {
  const [showDetail, setShowDetail] = useState(true);

  const handleShowDetail = () => {
    return setShowDetail(!showDetail);
  };

  return (
    <div className="role-booking u-wrapper">
      <div className="role-title">
        <h2>Vai trò của BookingCare</h2>
        <div className="role-title__icon" onClick={handleShowDetail}>
          {showDetail ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
        </div>
      </div>

      <div className={`${showDetail ? "role-content show" : "role-content"}`}>
        <div className="role-first">
          <h4>Giúp bệnh nhân chọn đúng bác sĩ giỏi và đặt lịch nhanh chóng.</h4>
          <ul className="role-first-list">
            <li>Hệ thống bác sĩ chuyên khoa giỏi, uy tín</li>
            <li>Thông tin về bác sĩ đã được xác thực rõ ràng, chính xác</li>
            <li>Sắp xếp khám đúng bác sĩ mà bệnh nhân đã chọn đặt lịch</li>
            <li>Bảo vệ quyền lợi của bệnh nhân khi đi khám</li>
            <li>Miễn phí đặt lịch.</li>
          </ul>
        </div>

        <div className="role-second">
          <h4>Hỗ trợ trước, trong và sau khi đi khám.</h4>
          <div className="role-sub-second">
            <span>Trước khám</span>
            <ul>
              <li>Nhắc lịch khám, dặn dò chuẩn bị trước khám</li>
              <li>Hướng dẫn đi lại, quy trình làm thủ tục khám</li>
            </ul>
          </div>
          <div className="role-sub-second">
            <span>Trong khi khám</span>
            <ul>
              <li>Hỗ trợ giải quyết các vướng mắc trong khi khám</li>
              <li>Hỗ trợ người bệnh những yêu cầu nảy sinh</li>
            </ul>
          </div>
          <div className="role-sub-second">
            <span>Sau khi khám</span>
            <ul>
              <li>Ghi nhận ý kiến của bệnh nhân sau khám</li>
              <li>Hỗ trợ giải đáp, làm rõ những vấn đề chuyên môn</li>
              <li>Bảo vệ quyền lợi của bệnh nhân khi đi khám</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBookingCare;
