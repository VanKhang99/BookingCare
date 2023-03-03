import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { getAllPackages } from "../../slices/packageSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselPackage = ({ clinicId, specialtyId, settings, pageClinicSpecialty }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);
  console.log(clinicId);
  console.log(specialtyId);

  useEffect(() => {
    if (!specialtyId) {
      dispatch(getAllPackages({ specialtyId: null, clinicId }));
    } else {
      dispatch(getAllPackages({ specialtyId, clinicId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Carousel className="slides" {...settings}>
      {packageArr?.length > 0 &&
        packageArr.map((pk) => {
          const { imageUrl, id: packageId, nameVi, nameEn } = pk;
          return (
            <Link
              to={`${
                pageClinicSpecialty
                  ? `/${path.CLINIC}/${clinicId}/specialties/${specialtyId}/package/${packageId}`
                  : `/${path.CLINIC}/${clinicId}/package/${packageId}`
              }`}
              key={packageId}
              className="slide"
            >
              <div className="slide-content">
                <div className="slide-content__img">
                  <img
                    src={imageUrl}
                    alt={language === "vi" ? nameVi : nameEn}
                    style={{ objectFit: `${pageClinicSpecialty ? "contain" : "cover"}` }}
                  />
                </div>
                <span className="slide-content__name">{language === "vi" ? nameVi : nameEn}</span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselPackage;
