import React from "react";
import { Carousel } from "antd";
import "../../styles/Carousel.scss";

const CarouselHandbook = ({ onChange, settings }) => {
  return (
    <Carousel className="slides" afterChange={onChange} {...settings}>
      <div className="slide">
        <div className="slide-content">
          <div className="slide-content__img">
            <img
              src="https://cdn.bookingcare.vn/fr/w300/2022/11/03/090741-tri-seo-ro-o-dau-tphcm.png"
              alt=""
            />
          </div>
          <a href="/" className="slide-content__title">
            Trị sẹo rỗ ở đâu tốt? 7 địa chỉ chuyên khoa tại TP.HCM
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-content__img">
            <img src="https://cdn.bookingcare.vn/fr/w300/2022/11/19/145532-adn-1.png" alt="" />
          </div>
          <a href="/" className="slide-content__title">
            Top 5 nha khoa chuyên sâu niềng răng cho trẻ uy tín tại TPHCM
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-content__img">
            <img src="https://cdn.bookingcare.vn/fr/w300/2022/11/21/153403-consult-now.jpg" alt="" />
          </div>
          <a href="/" className="slide-content__title">
            5 Địa chỉ Nha khoa Uy tín trên 15 năm hoạt động tại TPHCM
          </a>
        </div>
      </div>

      <div className="slide">
        <div className="slide-content">
          <div className="slide-content__img">
            <img src="https://cdn.bookingcare.vn/fr/w300/2022/11/24/142809-consult-now-5.png" alt="" />
          </div>
          <a href="/" className="slide-content__title">
            5 địa chỉ Nha khoa Uy tín TPHCM tiên phong ứng dụng công nghệ
          </a>
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselHandbook;
