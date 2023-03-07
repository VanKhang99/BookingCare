import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { getAllSpecialties } from "../../slices/specialtySlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselRemoteDoctor = ({ onChange, settings, doctorRemote }) => {
  const [specialtiesRemote, setSpecialtiesRemote] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleGetSpecialtiesRemote = async () => {
    try {
      const res = await dispatch(getAllSpecialties("remote"));
      if (res.payload.specialties.length > 0) {
        return setSpecialtiesRemote(res.payload.specialties);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSpecialtiesRemote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Carousel className="slides" afterChange={onChange} {...settings}>
      {specialtiesRemote?.length > 0 &&
        specialtiesRemote.map((specialty) => {
          console.log();
          const { imageRemoteUrl, id: specialtyId } = specialty;
          return (
            <Link
              to={`/${path.SPECIALTIES}/${path.REMOTE}/${specialtyId}`}
              key={specialtyId}
              className="slide"
            >
              <div className="slide-content">
                {doctorRemote && (
                  <div className="slide-content__icon">
                    <BsFillCameraVideoFill />
                  </div>
                )}
                <div className="slide-content__img">
                  <img src={imageRemoteUrl} alt={language === "vi" ? specialty.nameVi : specialty.nameEn} />
                </div>
                <span className="slide-content--name-specialty">
                  {language === "vi" ? `${specialty.nameVi} từ xa` : `Remote ${specialty.nameEn}`}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselRemoteDoctor;
