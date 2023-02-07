import React from "react";
import {
  NextArrow,
  PrevArrow,
  CarouselRemoteDoctor,
  CarouselPopularSpecialty,
  CarouselOutstandingFacilities,
  CarouselOutstandingDoctors,
  CarouselHandbook,
  CarouselDoctorAndFacilities,
} from "./index.js";
import "../../styles/Carousel.scss";

const Slider = ({
  mainTitle,
  buttonText,
  buttonText2,
  buttonText3,
  doctorRemote,
  popularSpecialty,
  outstandingFacilities,
  outstandingDoctors,
  handbook,
  doctorAndFacilities,
}) => {
  const slidesToShow = 4;

  const onChange = (currentSlide) => {
    // console.log(currentSlide);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    draggable: true,
    nextArrow: <NextArrow slidesToShow={slidesToShow} />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div
      className={`carousel-container carousel-${
        doctorRemote ||
        popularSpecialty ||
        outstandingFacilities ||
        outstandingDoctors ||
        handbook ||
        doctorAndFacilities
      }`}
    >
      <div className="carousel-content u-wrapper">
        <div className="carousel-top">
          <h2 className="title">{mainTitle}</h2>
          {!doctorAndFacilities && (
            <a href="/">
              <button className="button button-main">{buttonText}</button>
            </a>
          )}

          {doctorAndFacilities && (
            <div className="carousel-buttons">
              <a href="/">
                <button className="button button-main">{buttonText}</button>
              </a>
              <a href="/">
                <button className="button button-main">{buttonText2}</button>
              </a>
              <a href="/">
                <button className="button button-main">{buttonText3}</button>
              </a>
            </div>
          )}
        </div>

        {doctorRemote && (
          <CarouselRemoteDoctor
            doctorRemote={doctorRemote}
            onChange={onChange}
            settings={settings}
          />
        )}

        {popularSpecialty && (
          <CarouselPopularSpecialty onChange={onChange} settings={settings} />
        )}

        {outstandingFacilities && (
          <CarouselOutstandingFacilities
            onChange={onChange}
            settings={settings}
          />
        )}

        {outstandingDoctors && (
          <CarouselOutstandingDoctors onChange={onChange} settings={settings} />
        )}

        {handbook && (
          <CarouselHandbook
            onChange={onChange}
            settings={{
              ...settings,
              slidesToShow: 2,
              nextArrow: <NextArrow slidesToShow={2} />,
            }}
          />
        )}

        {doctorAndFacilities && (
          <CarouselDoctorAndFacilities
            onChange={onChange}
            settings={{
              ...settings,
              slidesToShow: 2,
              nextArrow: <NextArrow slidesToShow={2} />,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
