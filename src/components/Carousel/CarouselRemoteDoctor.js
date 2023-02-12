import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "antd";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { getAllSpecialtiesRemote } from "../../slices/specialtySlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselRemoteDoctor = ({ onChange, settings, doctorRemote }) => {
  const [specialtiesRemote, setSpecialtiesRemote] = useState([]);
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);

  const handleGetSpecialtiesRemote = async () => {
    try {
      const res = await dispatch(getAllSpecialtiesRemote());
      if (res?.payload?.specialties) {
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
          return (
            <Link
              to={`/${path.REMOTE}/${specialty.specialtyId}`}
              key={specialty.specialtyId}
              className="slide"
            >
              <div className="slide-content">
                {doctorRemote && (
                  <div className="slide-content__icon">
                    <BsFillCameraVideoFill />
                  </div>
                )}
                <div className="slide-content__img">
                  <img
                    src={specialty.imageRemote}
                    alt={language === "vi" ? specialty.nameData.valueVi : specialty.nameData.valueEn}
                  />
                </div>
                <span className="slide-content--name-specialty">
                  {language === "vi"
                    ? `${specialty.nameData.valueVi} từ xa`
                    : `Remote ${specialty.nameData.valueEn}`}
                </span>
              </div>
            </Link>
          );
        })}
    </Carousel>
  );
};

export default CarouselRemoteDoctor;
