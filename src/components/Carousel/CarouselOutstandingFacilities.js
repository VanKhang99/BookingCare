import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllClinicsPopular } from "../../slices/clinicSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselOutstandingFacilities = ({ onChange, settings }) => {
  const [clinics, setClinics] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleGetAllClinicPopular = async () => {
    try {
      const res = await dispatch(getAllClinicsPopular());
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
          const { clinicId, image, nameClinicData } = clinic;
          return (
            <Link to={`/${path.CLINIC}/${clinicId}`} key={clinicId} className="slide">
              <div className="slide-content">
                <div className="slide-img">
                  <img
                    src={image}
                    alt={language === "vi" ? nameClinicData.valueVi : nameClinicData.valueEn}
                  />
                </div>
                <span className="slide-title">
                  {language === "vi" ? nameClinicData.valueVi : nameClinicData.valueEn}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselOutstandingFacilities;
