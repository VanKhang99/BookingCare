import React from "react";
import { Link } from "react-router-dom";
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
          <h2 className="carousel-top__title">{mainTitle}</h2>

          {doctorRemote && (
            <Link to="/specialty/remote" className="button button-main">
              {buttonText}
            </Link>
          )}

          {popularSpecialty && (
            <Link to="/specialty" className="button button-main">
              {buttonText}
            </Link>
          )}

          {outstandingFacilities && (
            <Link to="/specialty" className="button button-main">
              {buttonText}
            </Link>
          )}

          {outstandingDoctors && (
            <Link to="/doctors" className="button button-main">
              {buttonText}
            </Link>
          )}

          {doctorAndFacilities && (
            <div className="carousel-top__buttons">
              <a href="#">
                <button className="button button-main">{buttonText}</button>
              </a>
              <a href="#">
                <button className="button button-main">{buttonText2}</button>
              </a>
              <a href="#">
                <button className="button button-main">{buttonText3}</button>
              </a>
            </div>
          )}
        </div>

        {doctorRemote && <CarouselRemoteDoctor doctorRemote={doctorRemote} settings={settings} />}

        {popularSpecialty && <CarouselPopularSpecialty settings={settings} />}

        {outstandingFacilities && <CarouselOutstandingFacilities settings={settings} />}

        {outstandingDoctors && <CarouselOutstandingDoctors settings={settings} />}

        {handbook && (
          <CarouselHandbook
            settings={{
              ...settings,
              slidesToShow: 2,
              nextArrow: <NextArrow slidesToShow={2} />,
            }}
          />
        )}

        {doctorAndFacilities && (
          <CarouselDoctorAndFacilities
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
