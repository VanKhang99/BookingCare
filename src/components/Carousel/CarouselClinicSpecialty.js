import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { getAllPackages } from "../../slices/packageSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselClinicSpecialty = ({ clinicId, specialtyId, settings }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);

  useEffect(() => {
    dispatch(getAllPackages({ specialtyId, clinicId }));
  }, []);

  return (
    <Carousel className="slides" {...settings}>
      {packageArr?.length > 0 &&
        packageArr.map((pk) => {
          const { imageUrl, id: packageId, nameVi, nameEn } = pk;
          return (
            <Link
              to={`/${path.CLINIC}/${clinicId}/specialties/${specialtyId}/package/${packageId}`}
              key={packageId}
              className="slide"
            >
              <div className="slide-content">
                <div className="slide-content__img">
                  <img src={imageUrl} alt={language === "vi" ? nameVi : nameEn} />
                </div>
                <span className="slide-content__name">{language === "vi" ? nameVi : nameEn}</span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselClinicSpecialty;
