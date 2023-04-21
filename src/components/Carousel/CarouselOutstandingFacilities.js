import React, { useEffect } from "react";
import { Carousel, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllClinics } from "../../slices/clinicSlice";
import { path } from "../../utils/constants";
import "../../styles/Carousel.scss";

const CarouselOutstandingFacilities = ({ onChange, settings, packagesClinics }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((store) => store.app);
  const { clinicsPopular, isLoadingClinics } = useSelector((store) => store.clinic);

  useEffect(() => {
    if (clinicsPopular.length) return;
    const dispatchedThunk = dispatch(getAllClinics());

    //Cancel request when suddenly component unmounted
    return () => {
      dispatchedThunk.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicsPopular.length]);

  return (
    <>
      {!isLoadingClinics ? (
        <Carousel className="slides" afterChange={onChange} {...settings}>
          {clinicsPopular?.length > 0 &&
            clinicsPopular.map((clinic) => {
              const { id: clinicId, logoUrl } = clinic;
              return (
                <Link to={`/${path.CLINIC}/${clinicId}`} key={clinicId} className="slide">
                  <div className="slide-content">
                    <div className="slide-content__img">
                      <img
                        src={logoUrl}
                        alt={language === "vi" ? clinic.nameVi : clinic.nameEn}
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <span className="slide-content--name-clinic">
                      {language === "vi" ? clinic.nameVi : clinic.nameEn}
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

export default CarouselOutstandingFacilities;
