import React from "react";
import { Header, Banner, Slider, Media, CTA, Footer } from "../components";

const Home = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <div className="wrapper">
          <div className="content">
            <Banner />
            <Slider
              mainTitle="Bác sĩ từ xa qua Video"
              buttonText="XEM THÊM"
              doctorRemote="doctor-remote"
            />
            <Slider
              mainTitle="Chuyên khoa phổ biến"
              buttonText="XEM THÊM"
              popularSpecialty="popular-specialty"
            />
            <Slider
              mainTitle="Cơ sở y tế nổi bật"
              buttonText="TÌM KIẾM"
              outstandingFacilities="outstanding-facilities"
            />
            <Slider
              mainTitle="Bác sĩ nổi bật tuần qua"
              buttonText="TÌM KIẾM"
              outstandingDoctors="outstanding-doctors"
            />
            <Slider
              mainTitle="Cẩm nang"
              buttonText="Tất cả bài viết"
              handbook="handbook"
            />
            <Media />
            <CTA />
            <Slider
              mainTitle="Dành cho bác sĩ và cơ sở y tế"
              buttonText="Bài viết"
              buttonText2="Hợp tác"
              buttonText3="Liên hệ"
              doctorAndFacilities="doctor-facility"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
