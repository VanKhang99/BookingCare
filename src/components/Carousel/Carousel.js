import React from "react";
import { Link } from "react-router-dom";
import { path } from "../../utils/constants";
import {
  NextArrow,
  PrevArrow,
  CarouselRemoteDoctor,
  CarouselPopularSpecialty,
  CarouselOutstandingFacilities,
  CarouselDoctor,
  CarouselHandbook,
  CarouselDoctorAndFacilities,
  CarouselPackageClinic,
  CarouselDoctorClinic,
} from "./index.js";
import "../../styles/Carousel.scss";
// import Specialties from "./../../pages/Specialties";

const Slider = ({
  clinicId,
  specialtyId,
  pageClinicSpecialty,

  mainTitle,
  buttonText,
  buttonText2,
  buttonText3,
  doctorRemote,
  popularSpecialty,
  outstandingFacilities,
  doctors,
  handbook,
  doctorAndFacilities,
  clinicPackage,
  clinicDoctor,
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
        doctors ||
        handbook ||
        doctorAndFacilities ||
        clinicPackage ||
        clinicDoctor
      }`}
    >
      <div className="carousel-content u-wrapper">
        <div className="carousel-top">
          <h2 className="carousel-top__title">{mainTitle}</h2>

          {doctorRemote && (
            <Link to={`/${path.SPECIALTY}/${path.REMOTE}`} className="button button-main">
              {buttonText}
            </Link>
          )}

          {popularSpecialty && (
            <Link to={`/${path.SPECIALTY}`} className="button button-main">
              {buttonText}
            </Link>
          )}

          {outstandingFacilities && (
            <Link to={`/${path.CLINIC}s`} className="button button-main">
              {buttonText}
            </Link>
          )}

          {doctors && (
            <Link to={`/${path.DOCTOR}s`} className="button button-main">
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

          {clinicPackage && (
            <Link to={`/`} className="button button-main">
              {buttonText}
            </Link>
          )}

          {clinicDoctor && (
            <Link to={`/`} className="button button-main">
              {buttonText}
            </Link>
          )}
        </div>

        {doctorRemote && <CarouselRemoteDoctor doctorRemote={doctorRemote} settings={settings} />}

        {popularSpecialty && <CarouselPopularSpecialty settings={settings} />}

        {outstandingFacilities && <CarouselOutstandingFacilities settings={settings} />}

        {doctors && (
          <CarouselDoctor
            settings={clinicId ? { ...settings, infinite: false } : settings}
            clinicId={clinicId}
          />
        )}

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

        {clinicPackage && (
          <CarouselPackageClinic
            settings={{ ...settings, infinite: false }}
            clinicId={clinicId}
            specialtyId={specialtyId}
            pageClinicSpecialty={pageClinicSpecialty}
          />
        )}

        {clinicDoctor && (
          <CarouselDoctorClinic settings={{ ...settings, infinite: false }} clinicId={clinicId} />
        )}
      </div>
    </div>
  );
};

export default Slider;
