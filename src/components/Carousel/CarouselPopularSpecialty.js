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
      const res = await dispatch(getAllSpecialties("popular"));
      if (res.payload.specialties.length > 0) {
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
          const { imageUrl, id: specialtyId } = specialty;
          return (
            <Link to={`/${path.SPECIALTIES}/${specialtyId}`} key={specialtyId} className="slide">
              <div className="slide-content">
                <div className="slide-content__img">
                  <img src={imageUrl} alt={language === "vi" ? specialty.nameVi : specialty.nameEn} />
                </div>
                <span className="slide-content--name-specialty">
                  {language === "vi" ? specialty.nameVi : specialty.nameEn}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselPopularSpecialty;
