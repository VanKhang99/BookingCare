import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllClinics } from "../../slices/clinicSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselOutstandingFacilities = ({ onChange, settings }) => {
  const [clinics, setClinics] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleGetAllClinicPopular = async () => {
    try {
      const res = await dispatch(getAllClinics("popular"));
      if (res?.payload?.clinics) {
        return setClinics(res.payload.clinics);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllClinicPopular();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Carousel className="slides" afterChange={onChange} {...settings}>
      {clinics?.length > 0 &&
        clinics.map((clinic) => {
          const { id: clinicId, logoUrl } = clinic;
          return (
            <Link to={`/${path.CLINIC}/${clinicId}`} key={clinicId} className="slide">
              <div className="slide-content">
                <div className="slide-content__img">
                  <img src={logoUrl} alt={language === "vi" ? clinic.nameVi : clinic.nameEn} />
                </div>
                <span className="slide-content--name-clinic">
                  {language === "vi" ? clinic.nameVi : clinic.nameEn}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselOutstandingFacilities;
