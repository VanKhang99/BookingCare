import React from "react";
import { Carousel } from "antd";
import "../../styles/Carousel.scss";

const CarouselDoctorAndFacilities = ({ onChange, settings }) => {
  return (
    <Carousel className="slides" afterChange={onChange} {...settings}>
      <div className="slide">
        <div className="slide-content">
          <div className="slide-img">
            <img
              src="https://cdn.bookingcare.vn/fr/w300/2022/11/13/132939-10x-content-seo-y-te.png"
              alt=""
            />
          </div>
          <a href="/" className="slide-title">
            10X Content là gì? Cách xây dựng Content SEO Y tế theo 10X Content
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-img">
            <img
              src="https://cdn.bookingcare.vn/fr/w300/2022/11/10/175657-cach-su-dung-google-keyword-planner.png"
              alt=""
            />
          </div>
          <a href="/" className="slide-title">
            Cách sử dụng Google Keyword Planner để chọn từ khóa bài viết
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-img">
            <img
              src="https://cdn.bookingcare.vn/fr/w300/2022/11/09/172027-module-thiet-ke-website-phong-kham.jpg"
              alt=""
            />
          </div>
          <a href="/" className="slide-title">
            Các Module quan trọng trong thiết kế Website phòng khám
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-img">
            <img
              src="https://cdn.bookingcare.vn/fr/w300/2022/11/08/134643-marketing-phong-kham-1.png"
              alt=""
            />
          </div>
          <a href="/" className="slide-title">
            Marketing phòng khám - Phần 1: Chiến lược tập trung vào chất lượng
            khám chữa bệnh
          </a>
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselDoctorAndFacilities;
