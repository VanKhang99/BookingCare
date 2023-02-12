import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import { getAllSpecialties } from "../../slices/specialtySlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselPopularSpecialty = ({ onChange, settings }) => {
  const [specialties, setSpecialties] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleGetSpecialties = async () => {
    try {
      const res = await dispatch(getAllSpecialties());
      if (res && res.payload && res.payload.specialties) {
        return setSpecialties(res.payload.specialties);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSpecialties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Carousel className="slides" afterChange={onChange} {...settings}>
      {specialties &&
        specialties.length > 0 &&
        specialties.map((specialty) => {
          const { nameData, image, specialtyId } = specialty;
          return (
            <Link to={`/${path.SPECIALTY}/${specialtyId}`} key={specialtyId} className="slide">
              <div className="slide-content">
                <div className="slide-content__img">
                  <img src={image} alt={language === "vi" ? nameData.valueVi : nameData.valueEn} />
                </div>
                <span className="slide-content--name-specialty">
                  {language === "vi" ? nameData.valueVi : nameData.valueEn}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselPopularSpecialty;
