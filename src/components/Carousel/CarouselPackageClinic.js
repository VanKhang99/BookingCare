import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { getAllPackages } from "../../slices/packageSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselPackage = ({ clinicId, specialtyId, settings, pageClinicSpecialty }) => {
  const [packageToRender, setPackageToRender] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { packageArr } = useSelector((store) => store.package);

  useEffect(() => {
    if (!packageArr.length) {
      const dispatchedThunk = dispatch(getAllPackages());

      return () => {
        dispatchedThunk.abort();
      };
    }

    if (!specialtyId) {
      const packagesFilterById = packageArr.filter(
        (pk) => pk.specialtyId === null && pk.clinicId === clinicId
      );
      setPackageToRender(packagesFilterById);
    } else {
      const packagesFilterById = packageArr.filter(
        (pk) => pk.specialtyId === specialtyId && pk.clinicId === clinicId
      );
      setPackageToRender(packagesFilterById);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageArr.length]);

  return (
    <Carousel className="slides" {...settings}>
      {packageToRender?.length > 0 &&
        packageToRender.map((pk) => {
          const { imageUrl, id: packageId, nameVi, nameEn } = pk;
          return (
            <Link
              to={`${
                pageClinicSpecialty
                  ? `/${path.CLINIC}/${clinicId}/specialties/${specialtyId}/packages/${packageId}`
                  : `/${path.CLINIC}/${clinicId}/packages/${packageId}`
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
