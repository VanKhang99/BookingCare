import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Skeleton } from "antd";
import { getAllSpecialties } from "../../slices/specialtySlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselPopularSpecialty = ({ onChange, settings }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { isLoadingSpecialties, specialtiesPopular } = useSelector((store) => store.specialty);

  useEffect(() => {
    if (specialtiesPopular.length) return;

    const dispatchedThunk = dispatch(getAllSpecialties("popular"));

    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialtiesPopular.length]);

  return (
    <>
      {!isLoadingSpecialties ? (
        <Carousel className="slides" afterChange={onChange} {...settings}>
          {specialtiesPopular?.length > 0 &&
            specialtiesPopular.map((specialty) => {
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
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default CarouselPopularSpecialty;
